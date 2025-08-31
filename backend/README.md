# IELTS Essay Rater & Recommender (FastAPI + LangChain RAG)

An end-to-end IELTS Writing Task 2 rater and recommendation engine using LangChain, Retrieval-Augmented Generation (RAG), and PDO prompt engineering. Optional LangSmith observability via env vars.

## Features
- RAG over PDFs and websites (tips, examples, band descriptors)
- Structured ratings aligned to IELTS criteria
- Improved essay suggestions + bullet recommendations
- FastAPI REST API with Swagger UI at `/docs`
- Modular chains and utilities; vectorstore persisted via Chroma

## Project Structure
```
ielts-essay-rate/
  app.py                 # FastAPI app
  config.py              # Settings via dotenv/env
  requirements.txt
  .env.example
  chains/
    rag_chain.py
    essay_rating_chain.py
    recommendation_chain.py
  utils/
    loader.py
    vectorstore.py
    llm.py
  models/
    schemas.py
  data/
    sources/             # Put your PDFs here
    vectorstore/         # Persisted embeddings
  scripts/
    ingest.py            # CLI ingestion helper
  prompts/
    rating_prompt.txt
    recommendation_prompt.txt
```

## Setup
1. Create and fill your `.env` from `.env.example`.
2. Install dependencies:
```cmd
pip install -r requirements.txt
```

3. Ingest documents (PDFs in `data/sources`, optional URLs):
```cmd
python scripts\ingest.py https://ieltsliz.com/ielts-writing-task-2-tips/ https://www.ieltsbuddy.com/ielts-writing-task-2.html
```

4. Run the API:
```cmd
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

5. Open Swagger docs: http://localhost:8000/docs

## API
- GET `/health` – service status and vectorstore doc count
- POST `/ingest` – body: `{ "urls": ["..."] }`
- POST `/rate` – body:
```json
{
  "title": "Some people think...",
  "essay_text": "Your essay here...",
  "target_band": 7.0,
  "top_k": 6
}
```

## Notes
- LLM: defaults to `gpt-4o-mini`. Change `MODEL` and `TEMPERATURE` in `.env`.
- LangSmith: set `LANGSMITH_TRACING=true` and `LANGSMITH_API_KEY` to enable.
- Vector DB: Chroma persisted under `data/vectorstore`.

## Roadmap
- Add rubric grounding with explicit IELTS descriptors dataset
- Multi-model fallback and cost control
- Streamlit UI
- Offline eval set + LangSmith traces
