export type BandScores = {
  task_response: number;
  coherence_and_cohesion: number;
  lexical_resource: number;
  grammatical_range_and_accuracy: number;
  overall: number;
};

export type CriterionFeedback = {
  criterion: string;
  score: number;
  justification: string;
  examples: string[];
};

export type RatingResult = {
  band_scores: BandScores;
  strengths: string[];
  weaknesses: string[];
  criterion_feedback: CriterionFeedback[];
  prioritized_actions: string[];
  estimated_band_if_addressed: number;
};

export type RecommendationResult = {
  improved_essay: string;
  bullet_point_suggestions: string[];
  high_value_patterns: string[];
};

export type RetrievedChunk = { source?: string; snippet: string };

export type RateResponse = {
  rating: RatingResult;
  recommendation: RecommendationResult;
  retrieved: RetrievedChunk[];
};

export type IngestResponse = {
  added_docs: number;
  total_docs: number;
  message: string;
};
