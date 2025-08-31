from __future__ import annotations

from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI

from models.schemas import RecommendationResult


def build_recommendation_chain(llm: ChatOpenAI):
    template = (
        "You are a writing tutor. Using the IELTS context and band descriptors, propose concrete improvements.\n"
        "Purpose: Provide a revised essay and bullet-point suggestions grounded in retrieved examples.\n"
        "Data: Title: {title}\nEssay:\n"""{essay_text}"""\n\nContext:\n"""{context}"""\n\n"
        "Output: JSON with keys: improved_essay, bullet_point_suggestions, high_value_patterns.\n"
        "Rules:\n- Keep the revised essay <= 280 words unless the prompt requires otherwise.\n- Mimic formal academic tone suitable for IELTS.\n- Use patterns observed in context.\n- No extra text outside JSON.\n"
    )
    prompt = PromptTemplate.from_template(template)
    structured_llm = llm.with_structured_output(RecommendationResult)
    return prompt | structured_llm
