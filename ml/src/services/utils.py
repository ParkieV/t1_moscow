from typing import Any

import aiohttp
from jose import jwt, JWTError
from fastapi import Depends, HTTPException

from src.config import auth_config, oauth2_scheme


def check_token(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(status_code=401, detail="Could not validate credentials")
    try:
        payload = jwt.decode(token, auth_config.secret_key, algorithms=[auth_config.algorithm])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

async def fetch_url(url: str) -> Any:
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            print(f"Status: {response.status}")
            try:
                content = await response.json()
                return content
            except:
                return None