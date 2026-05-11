from __future__ import annotations

from .base_agent import TypeCAgentDefinition

FINANCIAL_AGENT = TypeCAgentDefinition(
    name="Financial Agent",
    focus="Focus on ROI, cost/risk balance, efficiency, and capital discipline.",
    fallback_insight="Financial review should balance risk reduction with execution cost.",
    fallback_concerns=("The safest path may still carry hidden cost or delay.",),
    fallback_recommendations=("Estimate the cost of mitigation before approval.",),
    fallback_confidence=0.44,
)
