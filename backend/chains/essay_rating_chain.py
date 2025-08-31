from __future__ import annotations
from typing import List

from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI

from models.schemas import RatingResult, BandScores, CriterionFeedback


def build_rating_chain(llm: ChatOpenAI):
    # Avoid nested triple quotes in f-strings; use simple placeholders
    template = (
        "You are an IELTS Writing Task 2 examiner. Rate the essay strictly per official band descriptors.\n"
        "Follow PDO: Purpose, Data, Output.\n\n"
        "Purpose: Provide objective scoring and actionable feedback.\n\n"
        "Data:\n"
        "Title: {title}\n"
        "Essay:\n{essay_text}\n\n"
        "Context (tips/examples):\n{context}\n\n"
        "Output: Return a JSON with keys: band_scores, strengths, weaknesses, "
        "criterion_feedback, prioritized_actions, estimated_band_if_addressed.\n"
        "Rules:\n"
        "- Be concise but specific.\n"
        "- Use evidence from the essay and context.\n"
        "- Scores must be floats between 0 and 9.\n"
        "- Do not include any text outside the JSON.\n"
        "Target band (optional): {target_band}\n"
    )

    prompt = PromptTemplate.from_template(template)
    structured_llm = llm.with_structured_output(RatingResult)
    chain = prompt | structured_llm
    return chain