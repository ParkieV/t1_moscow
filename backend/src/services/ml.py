import re
from typing import Any

import numpy as np
import pandas as pd
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
import spacy
nlp = spacy.load("ru_core_news_sm")
from spacy.lang.ru import Russian
from sentence_transformers import SentenceTransformer, util

from src.logger import logger

EMB_MODEL = 'all-mpnet-base-v2'
LLM_MODEL = "unsloth/gemma-2-2b-it-bnb-4bit"


def get_device_info():
    return "cuda" if torch.cuda.is_available() else "cpu"


def split_list_of_text_into_overlapping_chunks(input_list: list, slice_size=7, overlap=2):
    step = slice_size - overlap
    return [input_list[i: i + slice_size] for i in range(0, len(input_list), step)]


def load_embeddings(file_info: list[list[dict[str, Any]]]):
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
                chunk_dict['page_number'] = item['page_number']

                joined_sent_chunk = " ".join(sent_chunks).replace("  ", " ").strip()
                joined_sent_chunk = re.sub(r'\.([A-Z])', r'. \1', joined_sent_chunk)

                chunk_dict['sents_chunks'] = joined_sent_chunk
                chunk_dict['chunk_char_count'] = len(joined_sent_chunk)
                chunk_dict['chunk_word_count'] = len(joined_sent_chunk.split())
                chunk_dict['chunk_token_count'] = len(joined_sent_chunk) / 4

                pdf_chunks.append(chunk_dict)

        df = pd.DataFrame(pdf_chunks)
        min_token_length = 50

        good_chunks = df[df['chunk_token_count'] > min_token_length].to_dict(orient='records')

        emb_model = SentenceTransformer(model_name_or_path=EMB_MODEL, device=get_device_info())
        for item in good_chunks:
            item['emb'] = emb_model.encode(item['sents_chunks'], convert_to_tensor=False)

        # Здесь записаны готовые эмбеддинги для текста которые можно положить в бд
        text_and_embs = pd.DataFrame(good_chunks)
        logger.debug(text_and_embs)
        files.append(text_and_embs)

def get_answer():

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
    embeds = torch.tensor(np.array((text_and_embs['emb'].tolist())), dtype=torch.float32).to(device)

    # Ищем самые похожие на запрос эмбеддинги (Топ 5)
    query = "Где будут проходить хакатон итоги в этом году?"
    emb_query = emb_model.encode(query, convert_to_tensor=True).to(device)
    dot_scores = util.dot_score(a=emb_query, b=embeds)[0]
    top_res = torch.topk(dot_scores, k=5)

    # Мы нашли индексы релевантных эмбеддингов (В переменной top_res[1] и теперь должны найти соответствующие им текста)
    list_context = [good_chunks[text]['sents_chunks'] for text in top_res[1].tolist()]
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

    input_ids = tokenizer(prompt, return_tensors='pt').to(device)

    output_ids = model.generate(
        **input_ids,
        temperature=0.7,
        do_sample=True,
        max_new_tokens=1024
    )

    out_text = tokenizer.decode(output_ids[0], skip_special_tokens=True)
    print(f"Query: {query}")
    print(f"RAG answer:\m{out_text.replace(prompt, '')}")


if __name__ =='__main__':
    load_embeddings(file_info=[
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
    ])