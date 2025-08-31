from __future__ import annotations
import os
from langchain_openai import ChatOpenAI
from config import settings


def get_chat_llm() -> ChatOpenAI:
    model = settings.MODEL
    temperature = settings.TEMPERATURE
    # ChatOpenAI reads OPENAI_* env vars automatically
    return ChatOpenAI(model=model, temperature=temperature, api_key=settings.OPENAI_API_KEY)
