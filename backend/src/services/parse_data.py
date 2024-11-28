from io import BytesIO
from typing import Any
from uuid import UUID

import fitz
from docx import Document

from fastapi import UploadFile

from src.repositories.postgres import PostgresContext
from src.repositories.postgres.data import FileCRUD


async def parse_files(files: list[UploadFile], assistant_id: UUID):
    db_context = PostgresContext[FileCRUD](crud=FileCRUD(session_factory=PostgresContext.new_session))
    res = []
    for file in files:
        if file.filename.endswith('.pdf'):
            data_info = await _parse_pdf(file)
            await db_context.crud.insert_file(assistant_id, data_info)
            res.append(data_info)
        elif file.filename.endswith('.docx'):
            data_info = await _parse_docx(file)
            await db_context.crud.insert_file(assistant_id, data_info)
            res.append(data_info)
        elif file.filename.endswith('.txt'):
            data_info = await _parse_txt(file)
            await db_context.crud.insert_file(assistant_id, data_info)
            res.append(data_info)
        else:
            raise ValueError('Could not parse file')

    return res


async def _parse_pdf(file: UploadFile) -> list[dict[str, Any]]:
    pdf = fitz.open(stream=await file.read(), filetype='pdf')
    file_info = []
    for number_of_page, page in enumerate(pdf):
        text = page.get_text().replace('\n', ' ').strip()

        file_info.append({
            'metadata': {
                "page_number": number_of_page + 1,
                "page_char_counts": len(text),  # количество символов
                "page_word_counts": len(text.split(" ")),  # количество слов
                "page_sents_counts": len(text.split(". ")),  # количество предложений
                "page_token_counts(approximately)": len(text) / 4,  # количество токенов
            },
            "text": text  # текст
        })
    return file_info

async def _parse_txt(file: UploadFile) -> list[dict[str, Any]]:
    text = (await file.read()).decode('utf-8').replace('\n', ' ').strip()

    file_info = {
        'metadata': {
            "char_counts": len(text),  # количество символов
            "word_counts": len(text.split(" ")),  # количество слов
            "sents_counts": len(text.split(". ")),  # количество предложений
            "token_counts(approximately)": len(text) / 4,  # количество токенов
        },
        "text": text  # текст
    }
    return [file_info]

async def _parse_docx(file: UploadFile) -> list[dict[str, Any]]:
    content = await file.read()

    # Используем BytesIO для работы с данными в памяти
    doc = Document(BytesIO(content))

    # Извлекаем текст из документа
    text = []
    for paragraph in doc.paragraphs:
        text.append(paragraph.text)

    # Объединяем текст в один блок
    full_text = " ".join(text)

    file_info = {
        'metadata': {
            "char_counts": len(full_text),  # количество символов
            "word_counts": len(full_text.split(" ")),  # количество слов
            "sents_counts": len(full_text.split(". ")),  # количество предложений
            "token_counts(approximately)": len(full_text) / 4,  # количество токенов
        },
        "text": full_text  # текст
    }

    return [file_info]