from __future__ import annotations

import json
from collections.abc import Callable
from typing import Any

from pydantic import ValidationError

from app.models.typec_ai_models import TypeCAgentResponse, TypeCMultiAgentRequest, TypeCMultiAgentSynthesis

Provider = Callable[[str], Any]


def fallback_synthesis(agent_responses: list[TypeCAgentResponse]) -> TypeCMultiAgentSynthesis:
    average_confidence = (
        sum(agent.confidence for agent in agent_responses) / len(agent_responses) if agent_responses else 0.25
    )
    return TypeCMultiAgentSynthesis(
        executiveSummary="Agents completed an advisory review using deterministic Type-C context.",
        keyAgreement="Agents agree that manager approval and validation are required before execution.",
        keyConflict="No validated conflict was produced by the AI layer.",
        strategicRecommendation="Use the deterministic recommendation, then validate risk and execution assumptions.",
        cautionAreas=["Advisory output cannot mutate scene state, routing, or execution."],
        confidence=max(0.0, min(1.0, average_confidence)),
    )


def _synthesis_prompt(request: TypeCMultiAgentRequest, agent_responses: list[TypeCAgentResponse]) -> str:
    payload = {
        "systemRole": "You are Nexora Executive Synthesizer.",
        "constraints": [
            "Combine agent outputs without inventing state.",
            "Advisory only. Do not execute decisions.",
            "Do not mutate scene state, routing, memory, or execution.",
            "Return only JSON with executiveSummary, keyAgreement, keyConflict, strategicRecommendation, cautionAreas, confidence.",
        ],
        "contextAvailable": {
            "hasRecommendation": request.recommendation is not None,
            "hasAdaptiveGuidance": request.adaptiveGuidance is not None,
            "hasMemorySummary": request.memorySummary is not None,
        },
        "agentResponses": [agent.model_dump() for agent in agent_responses],
    }
    return json.dumps(payload, ensure_ascii=False, separators=(",", ":"))[:4_000]


def validate_synthesis(raw: Any) -> TypeCMultiAgentSynthesis:
    if isinstance(raw, str):
        raw = json.loads(raw)
    if not isinstance(raw, dict):
        raise ValueError("synthesis_not_object")
    return TypeCMultiAgentSynthesis.model_validate(raw)


def synthesize_agent_responses(
    request: TypeCMultiAgentRequest,
    agent_responses: list[TypeCAgentResponse],
    provider: Provider | None = None,
) -> TypeCMultiAgentSynthesis:
    if provider is None:
        return fallback_synthesis(agent_responses)
    try:
        return validate_synthesis(provider(_synthesis_prompt(request, agent_responses)))
    except (ValidationError, ValueError, json.JSONDecodeError, RuntimeError, Exception):
        return fallback_synthesis(agent_responses)
