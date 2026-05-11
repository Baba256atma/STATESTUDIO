from __future__ import annotations

from .base_agent import TypeCAgentDefinition

RISK_AGENT = TypeCAgentDefinition(
    name="Risk Agent",
    focus="Focus only on propagation risk, exposure, instability, and downside concentration.",
    fallback_insight="Risk review should prioritize propagation exposure before execution.",
    fallback_concerns=("Unvalidated dependencies may amplify impact.",),
    fallback_recommendations=("Validate the highest-risk path before committing.",),
    fallback_confidence=0.46,
)
