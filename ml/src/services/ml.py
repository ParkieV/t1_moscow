import re
from typing import Any
from uuid import UUID, uuid4

import numpy as np
import pandas as pd
import os
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
import spacy

nlp = spacy.load("ru_core_news_sm")
from spacy.lang.ru import Russian
from sentence_transformers import SentenceTransformer, util

from src.logger import logger

EMB_MODEL = 'all-mpnet-base-v2'
LLM_MODEL = "unsloth/gemma-2-2b-it-bnb-4bit"
text_and_embs = None
emb_model = None
good_chunks = None


def get_device_info():
    return "cuda" if torch.cuda.is_available() else "cpu"


def split_list_of_text_into_overlapping_chunks(input_list: list, slice_size=7, overlap=2):
    step = slice_size - overlap
    return [input_list[i: i + slice_size] for i in range(0, len(input_list), step)]


def save_embeddings_to_csv(embeddings, file_name='embeddings.csv'):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    folder_name = 'tables'
    folder_path = os.path.join(script_dir, folder_name)

    os.makedirs(folder_path, exist_ok=True)
    full_file_path = os.path.join(folder_path, file_name)

    if os.path.exists(full_file_path):
        existing_data = pd.read_csv(full_file_path)
        new_data = pd.DataFrame(embeddings)
        combined_data = pd.concat([existing_data, new_data], ignore_index=True)
        combined_data.to_csv(full_file_path, index=False)
    else:
        pd.DataFrame(embeddings).to_csv(full_file_path, index=False)


def load_embeddings(file_info: list[list[dict[str, Any]]], assistant_id: UUID):
    logger.info(file_info)
    global text_and_embs, emb_model, good_chunks
    nlp = Russian()
    nlp.add_pipe("sentencizer")
    files = []
    for file in file_info:
        for item in file:
            item['sents'] = list(nlp(item['text']).sents)
            item['sents'] = [str(sent) for sent in item['sents']]
            item['page_sents_count_spacy'] = len(item['sents'])

        for item in file:
            item['sents_chunks'] = split_list_of_text_into_overlapping_chunks(input_list=item['sents'], slice_size=5)
            item['num_chunks'] = len(item['sents_chunks'])

        pdf_chunks = []

        for item in file:

            for sent_chunks in item['sents_chunks']:
                chunk_dict = {}
                logger.info("1")
                chunk_dict['page_number'] = item['page_number']
                logger.info("2")

                joined_sent_chunk = " ".join(sent_chunks).replace("  ", " ").strip()
                joined_sent_chunk = re.sub(r'\.([A-Z])', r'. \1', joined_sent_chunk)

                chunk_dict['sents_chunks'] = joined_sent_chunk
                chunk_dict['chunk_char_count'] = len(joined_sent_chunk)
                chunk_dict['chunk_word_count'] = len(joined_sent_chunk.split())
                chunk_dict['chunk_token_count'] = len(joined_sent_chunk) / 4

                pdf_chunks.append(chunk_dict)

        df = pd.DataFrame(pdf_chunks)
        min_token_length = 10

        good_chunks = df[df['chunk_token_count'] > min_token_length].to_dict(orient='records')

        emb_model = SentenceTransformer(model_name_or_path=EMB_MODEL, device=get_device_info())
        for item in good_chunks:
            item['emb'] = emb_model.encode(item['sents_chunks'], convert_to_tensor=False)

        # Здесь записаны готовые эмбеддинги для текста которые можно положить в бд
        text_and_embs = pd.DataFrame(good_chunks)
        save_embeddings_to_csv(text_and_embs, f'embeddings_{str(assistant_id)}.csv')
        logger.debug(text_and_embs)
        files.append(text_and_embs)

    return files


def get_answer(query: str, assistant_id: UUID):
    global emb_model

    script_dir = os.path.dirname(os.path.abspath(__file__))
    folder_name = 'tables'
    folder_path = os.path.join(script_dir, folder_name)
    full_file_path = os.path.join(folder_path, f'embeddings_{str(assistant_id)}.csv')

    text_and_embs = pd.read_csv(full_file_path)
    text_and_embs['emb'] = text_and_embs['emb'].apply(lambda x: np.fromstring(x.strip('[]'), sep=' '))

    # Model configuration
    model_id = LLM_MODEL
    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True, bnb_4bit_use_double_quant=True, bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.float16
    )
    model = AutoModelForCausalLM.from_pretrained(
        model_id,
        device_map="auto",
        torch_dtype=torch.float16,
        quantization_config=bnb_config
    )
    tokenizer = AutoTokenizer.from_pretrained(model_id)

    prompt = """
    Ты помогаешь пользователю разбираться в запросах по pdf файлам.
    1. Используй только релевантную информацию из представленного контекста для построения ответа. Если информация кажется нерелевантной или недостаточной для ответа, сообщите пользователю, что в предоставленных документах нет необходимой информации.
    2. Стремись быть максимально точным и информативным, формируя ответ ясным и доступным языком.
    3. Если вы не можешь ответить на вопрос на основе релевантных данных, вежливо проинформируй пользователя, что в текущем контексте нет нужной информации для ответа на его запрос.
    Запрос пользователя:
    {query}
    Найденный контекст:
    {context}
    Ans:
    """

    # Здесь нужно достать все эмбеддинги документов и засунуть их в torch.tensor
    embeds = torch.tensor(np.array((text_and_embs['emb'].tolist())), dtype=torch.float32).to(get_device_info())

    # Ищем самые похожие на запрос эмбеддинги (Топ 5)
    emb_query = emb_model.encode(query, convert_to_tensor=True).to(get_device_info())
    dot_scores = util.dot_score(a=emb_query, b=embeds)[0]
    top_res = torch.topk(dot_scores, k=5)

    # Мы нашли индексы релевантных эмбеддингов (В переменной top_res[1] и теперь должны найти соответствующие им текста)
    list_context = [text_and_embs.loc[text, 'sents_chunks'] for text in top_res[1].tolist()]
    context = str.join(" ", list_context)

    prompt = prompt.format(
        context=context,
        query=query
    )

    dialogue_template = [
        {"role": "user",
         "content": prompt}
    ]

    prompt = tokenizer.apply_chat_template(
        conversation=dialogue_template,
        tokenize=False,
        add_generation_prompt=True
    )

    input_ids = tokenizer(prompt, return_tensors='pt').to(get_device_info())

    output_ids = model.generate(
        **input_ids,
        temperature=0.7,
        do_sample=True,
        max_new_tokens=1024
    )

    out_text = tokenizer.decode(output_ids[0], skip_special_tokens=True)
    print(f"Query: {query}")
    print(f"RAG answer:\m{out_text.replace(prompt, '')}")
    return out_text.replace(prompt, '')


if __name__ == '__main__':
    uuiD = uuid4()
    load_embeddings([
        [
            {
                'page_number': 1,
                'page_char_counts': 168,
                'page_word_counts': 27,
                'page_sents_counts': 1,
                'page_token_counts(approximately)': 42.0,
                'text': 'Хакатон итоги 2024 Daniil Yefimov • November 09, 2024 Ежегодное итоговое мероприятие Хакатон Клуба снова с нами! В этот раз не  только для студентов Университета МИСИС!'
            }
        ]
    ], uuiD)
    get_answer('Где будет проходить хакатон в этом году?', uuiD)
