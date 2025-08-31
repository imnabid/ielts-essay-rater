from __future__ import annotations
import argparse
from typing import List

from config import settings
from utils.loader import load_pdfs_from_dir, load_webpages
from chains.rag_chain import ingest


def main(argv: List[str] | None = None):
    parser = argparse.ArgumentParser(
        description="Ingest local PDFs and optional web URLs into the vector store.")
    parser.add_argument("urls", nargs="*", help="One or more http(s) URLs to ingest")
    parser.add_argument("--skip-pdf", action="store_true", help="Skip ingesting local PDFs")
    parser.add_argument("--pdf-dir", default=settings.DATA_SOURCES_DIR,
                        help="Directory containing PDFs (default: from settings)")
    args = parser.parse_args(argv)

    docs = []
    if not args.skip_pdf:
        docs.extend(load_pdfs_from_dir(args.pdf_dir))

    if args.urls:
        docs.extend(load_webpages(args.urls))

    if not docs:
        print("Nothing to ingest. Provide URLs or ensure PDFs exist in the specified directory.")
        return

    added = ingest(docs)
    print(f"Added {added} documents to vectorstore at {settings.VECTORSTORE_DIR}")


if __name__ == "__main__":
    main()
