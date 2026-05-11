from __future__ import annotations

from .base_agent import TypeCAgentDefinition

OPERATIONS_AGENT = TypeCAgentDefinition(
    name="Operations Agent",
    focus="Focus on execution feasibility, bottlenecks, handoffs, and operational complexity.",
    fallback_insight="Operational readiness depends on validating bottlenecks before launch.",
    fallback_concerns=("Execution complexity may hide in handoffs between nodes.",),
    fallback_recommendations=("Confirm ownership and monitoring signals before execution.",),
    fallback_confidence=0.47,
)
