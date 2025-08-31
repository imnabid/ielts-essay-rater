from __future__ import annotations
import os
from langchain_openai import ChatOpenAI
from config import settings


def get_chat_llm() -> ChatOpenAI:
    # Uses OpenAI-compatible endpoint; supports Azure/OpenRouter if envs are set
    model = settings.MODEL
    temperature = settings.TEMPERATURE
    # ChatOpenAI reads OPENAI_* env vars automatically
    return ChatOpenAI(model=model, temperature=temperature)
