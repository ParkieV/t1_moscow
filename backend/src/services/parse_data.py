from typing import Any

import fitz

from fastapi import UploadFile


async def parse_files(files: list[UploadFile]):
    for file in files:
        if not file.filename.endswith('.pdf'):
            raise ValueError('Could not parse file')

        await parse_pdf(file)

async def parse_pdf(file: UploadFile) -> list[dict[str, Any]]:
    pdf = fitz.open(stream=await file.read(), filetype='pdf')
    all_info_about_pdf = []
    for number_of_page, page in enumerate(pdf):
        text = page.get_text().replace('\n', ' ').strip()

        all_info_about_pdf.append({
            'metadata': {
                "page_number": number_of_page + 1,  # номер страницы
                "page_char_counts": len(text),  # количество символов
                "page_word_counts": len(text.split(" ")),  # количество слов
                "page_sents_counts": len(text.split(". ")),  # количество предложений
                "page_token_counts(approximately)": len(text) / 4,  # количество токенов
            },
            "text": text  # текст
        })
    return all_info_about_pdf