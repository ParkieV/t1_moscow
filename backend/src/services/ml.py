
import numpy as np # linear algebra
import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)
import numpy as np
import pandas as pd
import torch
import transformers
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
import requests
import os
import fitz
from tqdm.auto import tqdm
from spacy.lang.en import English
from spacy.lang.ru import Russian
from sentence_transformers import SentenceTransformer, util
device = "cuda" if torch.cuda.is_available() else "cpu"
device
path = "KAT.pdf"

if not os.path.exists(path):
    print(f"[INFO] We don't have this file, downloading...")

    url = "https://telegra.ph/Hakaton-itogi-2024-11-09"

    filename = path

    response = requests.get(url)

    if response.status_code == 200:
        with open(filename, "wb") as file:
            file.write(response.content)
            print(f"File downloaded as {filename}")
    else:
        print(f"Can't download. Status code: {respones.status_code}")
else:
    print(f"File {path} is good!")
path = '/kaggle/input/itogi-pdf/2024  Telegraph.pdf'