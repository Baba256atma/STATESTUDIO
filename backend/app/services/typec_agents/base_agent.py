from __future__ import annotations

import json
from collections.abc import Callable
from dataclasses import dataclass
from typing import Any

from pydantic import ValidationError

from app.models.typec_ai_models import TypeCAgentResponse, TypeCMultiAgentRequest
from app.services.typec_ai_service import sanitize_typec_ai_request


Provider = Callable[[str], Any]


@dataclass(frozen=True)
class TypeCAgentDefinition:
    name: str
    focus: str
    fallback_insight: str
    fallback_concerns: tuple[str, ...]
    fallback_recommendations: tuple[str, ...]
    fallback_confidence: float = 0.45


def _agent_prompt(definition: TypeCAgentDefinition, request: TypeCMultiAgentRequest) -> str:
    payload = {
        "systemRole": f"You are Nexora {definition.name}.",
        "constraints": [
            "Advisory only. Do not execute decisions.",
            "Do not mutate scene state, routing, memory, or execution.",
            "Do not invent objects, scenarios, or metrics.",
            "Use only the provided deterministic context.",
            "Return only JSON with agent, insight, concerns, recommendations, confidence.",
        ],
        "focus": definition.focus,
        "context": sanitize_typec_ai_request(
            # TypeCMultiAgentRequest has the same field shape as TypeCAIInsightRequest for sanitization.
            request  # type: ignore[arg-type]
        ),
    }
    return json.dumps(payload, ensure_ascii=False, separators=(",", ":"))[:4_000]


def fallback_agent_response(definition: TypeCAgentDefinition) -> TypeCAgentResponse:
    return TypeCAgentResponse(
        agent=definition.name,
        insight=definition.fallback_insight,
        concerns=list(definition.fallback_concerns),
        recommendations=list(definition.fallback_recommendations),
        confidence=definition.fallback_confidence,
    )


def validate_agent_response(definition: TypeCAgentDefinition, raw: Any) -> TypeCAgentResponse:
    if isinstance(raw, str):
        raw = json.loads(raw)
    if not isinstance(raw, dict):
        raise ValueError("agent_response_not_object")
    payload = {"agent": definition.name, **raw}
    return TypeCAgentResponse.model_validate(payload)


def run_agent(
    definition: TypeCAgentDefinition,
    request: TypeCMultiAgentRequest,
    provider: Provider | None = None,
) -> TypeCAgentResponse:
    if provider is None:
        return fallback_agent_response(definition)
    try:
        return validate_agent_response(definition, provider(_agent_prompt(definition, request)))
    except (ValidationError, ValueError, json.JSONDecodeError, RuntimeError, Exception):
        return fallback_agent_response(definition)
