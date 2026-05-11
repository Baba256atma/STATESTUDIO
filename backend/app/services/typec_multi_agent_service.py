from __future__ import annotations

from collections.abc import Callable
from typing import Any

from app.models.typec_ai_models import TypeCMultiAgentRequest, TypeCMultiAgentResponse
from app.services.typec_ai_service import _call_configured_provider
from app.services.typec_agents import (
    FINANCIAL_AGENT,
    FRAGILITY_AGENT,
    OPERATIONS_AGENT,
    RISK_AGENT,
    STRATEGY_AGENT,
    run_agent,
    synthesize_agent_responses,
)

Provider = Callable[[str], Any]

AGENT_SEQUENCE = (
    RISK_AGENT,
    STRATEGY_AGENT,
    OPERATIONS_AGENT,
    FINANCIAL_AGENT,
    FRAGILITY_AGENT,
)


def generate_typec_multi_agent_insight(
    request: TypeCMultiAgentRequest,
    provider: Provider | None = None,
) -> TypeCMultiAgentResponse:
    active_provider = provider or _call_configured_provider
    agent_responses = [
        run_agent(definition, request, provider=active_provider)
        for definition in AGENT_SEQUENCE
    ]
    synthesis = synthesize_agent_responses(request, agent_responses, provider=active_provider)
    return TypeCMultiAgentResponse(
        agentResponses=agent_responses,
        synthesis=synthesis,
    )
