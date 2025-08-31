from __future__ import annotations
from typing import List

from langchain_core.documents import Document
from langchain_core.runnables import RunnableLambda

from utils.vectorstore import get_vectorstore, add_documents


def get_retriever(k: int = 6):
    return get_vectorstore().as_retriever(search_kwargs={"k": k})


def format_docs(docs: List[Document]) -> str:
    parts = []
    for d in docs:
        src = d.metadata.get("source") if d.metadata else None
        parts.append(f"Source: {src}\n{d.page_content}")
    return "\n\n---\n\n".join(parts)


def build_context_chain(k: int = 6):
    retriever = get_retriever(k=k)
    def _retrieve(question: str):
        docs = retriever.get_relevant_documents(question)
        return {
            "docs": docs,
            "context": format_docs(docs),
        }
    return RunnableLambda(lambda inp: _retrieve(inp["query"]))


def ingest(docs: List[Document]) -> int:
    return add_documents(docs)
