from __future__ import annotations
import os
from typing import Iterable, List
from urllib.parse import urlparse

from langchain_community.document_loaders import PyPDFLoader, WebBaseLoader
from langchain_core.documents import Document

from config import settings


def _norm_source(path_or_url: str) -> str:
    try:
        parsed = urlparse(path_or_url)
        if parsed.scheme and parsed.netloc:
            return path_or_url
    except Exception:
        pass
    return os.path.relpath(path_or_url).replace("\\", "/")


def load_pdfs_from_dir(directory: str | None = None) -> List[Document]:
    directory = directory or settings.DATA_SOURCES_DIR
    docs: List[Document] = []
    if not os.path.isdir(directory):
        return docs
    for fname in os.listdir(directory):
        if not fname.lower().endswith((".pdf",)):
            continue
        loader = PyPDFLoader(os.path.join(directory, fname))
        for d in loader.load():
            d.metadata = d.metadata or {}
            d.metadata["source"] = _norm_source(os.path.join(directory, fname))
            docs.append(d)
    return docs


def load_webpages(urls: Iterable[str]) -> List[Document]:
    out: List[Document] = []
    to_fetch = [u for u in urls if u]
    if not to_fetch:
        return out
    loader = WebBaseLoader(to_fetch)
    for d in loader.load():
        d.metadata = d.metadata or {}
        d.metadata["source"] = _norm_source(d.metadata.get("source", d.metadata.get("url", "web")))
        out.append(d)
    return out
