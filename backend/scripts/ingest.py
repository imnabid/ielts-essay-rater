from __future__ import annotations
import sys
from config import settings
from utils.loader import load_pdfs_from_dir, load_webpages
from chains.rag_chain import ingest


def main():
    urls = sys.argv[1:]
    local_docs = load_pdfs_from_dir(settings.DATA_SOURCES_DIR)
    web_docs = load_webpages(urls)
    added = ingest(local_docs + web_docs)
    print(f"Added {added} documents to vectorstore at {settings.VECTORSTORE_DIR}")


if __name__ == "__main__":
    main()
