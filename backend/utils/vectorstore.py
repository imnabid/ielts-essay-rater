from __future__ import annotations
import os
from typing import Iterable, List

from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_core.documents import Document

from config import settings

DB_DIR = settings.VECTORSTORE_DIR

_embeddings: OpenAIEmbeddings | None = None
_vectorstore: Chroma | None = None


def get_embeddings() -> OpenAIEmbeddings:
    global _embeddings
    if _embeddings is None:
        _embeddings = OpenAIEmbeddings(model=settings.EMBEDDING_MODEL)
    return _embeddings


def get_vectorstore() -> Chroma:
    global _vectorstore
    if _vectorstore is None:
        os.makedirs(DB_DIR, exist_ok=True)
        _vectorstore = Chroma(
            collection_name="ielts-essay-rag",
            persist_directory=DB_DIR,
            embedding_function=get_embeddings(),
        )
    return _vectorstore


def add_documents(docs: Iterable[Document]) -> int:
    vs = get_vectorstore()
    doc_list: List[Document] = list(docs)
    if not doc_list:
        return 0
    vs.add_documents(doc_list)
    return len(doc_list)


def doc_count() -> int:
    vs = get_vectorstore()
    try:
        return vs._collection.count() 
    except Exception:
        return 0
