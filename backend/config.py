import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    OPENAI_API_KEY: str | None = os.getenv("OPENAI_API_KEY")
    OPENAI_API_BASE: str | None = os.getenv("OPENAI_API_BASE")
    OPENAI_API_TYPE: str | None = os.getenv("OPENAI_API_TYPE")
    OPENAI_API_VERSION: str | None = os.getenv("OPENAI_API_VERSION")

    ANTHROPIC_API_KEY: str | None = os.getenv("ANTHROPIC_API_KEY")

    LANGSMITH_API_KEY: str | None = os.getenv("LANGSMITH_API_KEY")
    LANGSMITH_TRACING: str | None = os.getenv("LANGSMITH_TRACING", "false")
    LANGSMITH_ENDPOINT: str | None = os.getenv("LANGSMITH_ENDPOINT")
    LANGCHAIN_PROJECT: str | None = os.getenv("LANGCHAIN_PROJECT", "ielts-essay-rate")

    VECTORSTORE_DIR: str = os.getenv("VECTORSTORE_DIR", "data/vectorstore")
    DATA_SOURCES_DIR: str = os.getenv("DATA_SOURCES_DIR", "data/sources")

    MODEL: str = os.getenv("MODEL", "gpt-4o-mini")
    TEMPERATURE: float = float(os.getenv("TEMPERATURE", "0.2"))

settings = Settings()
