from __future__ import annotations
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from models.schemas import (
    RateRequest, RateResponse, IngestRequest, IngestResponse,
    HealthResponse, RetrievedChunk,
)
from utils.loader import load_pdfs_from_dir, load_webpages
from utils.vectorstore import doc_count
from utils.llm import get_chat_llm
from chains import rag_chain, essay_rating_chain, recommendation_chain

app = FastAPI(title="IELTS Essay Rater & Recommender")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(status="ok", vectorstore_ready=True, docs_count=doc_count())


@app.post("/ingest", response_model=IngestResponse)
async def ingest(req: IngestRequest):
    if not req.urls or len([u for u in req.urls if (u or '').strip()]) == 0:
        raise HTTPException(status_code=400, detail="No URLs provided")
    web_docs = load_webpages(req.urls)
    added = rag_chain.ingest(web_docs)
    total = doc_count()
    return IngestResponse(added_docs=added, total_docs=total, message="Ingestion complete")


@app.post("/rate", response_model=RateResponse)
async def rate(req: RateRequest):
    if not req.essay_text.strip():
        raise HTTPException(status_code=400, detail="Essay text is required")

    query = f"IELTS Task 2: {req.title}. Focus: band descriptors, examples, common pitfalls, tips."
    retriever = rag_chain.get_retriever(k=req.top_k)
    docs = retriever.get_relevant_documents(query)
    context = rag_chain.format_docs(docs)

    llm = get_chat_llm()
    rating_chain = essay_rating_chain.build_rating_chain(llm)
    reco_chain = recommendation_chain.build_recommendation_chain(llm)

    inputs = {
        "title": req.title,
        "essay_text": req.essay_text,
        "context": context,
        "target_band": req.target_band or "",
    }

    rating = rating_chain.invoke(inputs)
    reco = reco_chain.invoke(inputs)

    retrieved: List[RetrievedChunk] = []
    for d in docs:
        src = d.metadata.get("source") if d.metadata else None
        snippet = (d.page_content or "")[:600]
        retrieved.append(RetrievedChunk(source=src, snippet=snippet))

    return RateResponse(rating=rating, recommendation=reco, retrieved=retrieved)


@app.get("/")
async def root():
    return {"message": "IELTS Essay Rater API. See /docs for Swagger UI."}
