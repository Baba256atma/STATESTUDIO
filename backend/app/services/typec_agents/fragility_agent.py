from __future__ import annotations

from .base_agent import TypeCAgentDefinition

FRAGILITY_AGENT = TypeCAgentDefinition(
    name="Fragility Agent",
    focus="Focus on single points of failure, cascade sensitivity, and system brittleness.",
    fallback_insight="Fragility is highest where dependency concentration is not yet validated.",
    fallback_concerns=("Single-point failure may cascade through the scenario.",),
    fallback_recommendations=("Stress-test the most central dependency before execution.",),
    fallback_confidence=0.49,
)
