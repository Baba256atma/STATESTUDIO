from __future__ import annotations

from .base_agent import TypeCAgentDefinition

STRATEGY_AGENT = TypeCAgentDefinition(
    name="Strategy Agent",
    focus="Focus on long-term positioning, strategic tradeoffs, and opportunity cost.",
    fallback_insight="The recommendation should be weighed against strategic flexibility.",
    fallback_concerns=("A lower-risk path may reduce speed or optionality.",),
    fallback_recommendations=("Choose the path that preserves future options while reducing risk.",),
    fallback_confidence=0.48,
)
