from typing import List, Optional
from pydantic import BaseModel, Field

class BandScores(BaseModel):
    task_response: float = Field(..., ge=0, le=9)
    coherence_and_cohesion: float = Field(..., ge=0, le=9)
    lexical_resource: float = Field(..., ge=0, le=9)
    grammatical_range_and_accuracy: float = Field(..., ge=0, le=9)
    overall: float = Field(..., ge=0, le=9)

class CriterionFeedback(BaseModel):
    criterion: str
    score: float
    justification: str
    examples: List[str] = []

class RatingResult(BaseModel):
    band_scores: BandScores
    strengths: List[str]
    weaknesses: List[str]
    criterion_feedback: List[CriterionFeedback]
    prioritized_actions: List[str]
    estimated_band_if_addressed: float

class RecommendationResult(BaseModel):
    improved_essay: str
    bullet_point_suggestions: List[str]
    high_value_patterns: List[str]

class RetrievedChunk(BaseModel):
    source: Optional[str]
    snippet: str

class RateRequest(BaseModel):
    title: str
    essay_text: str
    target_band: Optional[float] = Field(None, ge=0, le=9)
    top_k: int = 6

class RateResponse(BaseModel):
    rating: RatingResult
    recommendation: RecommendationResult
    retrieved: List[RetrievedChunk]

class IngestRequest(BaseModel):
    urls: List[str] = []

class IngestResponse(BaseModel):
    added_docs: int
    total_docs: int
    message: str

class HealthResponse(BaseModel):
    status: str
    vectorstore_ready: bool
    docs_count: int
