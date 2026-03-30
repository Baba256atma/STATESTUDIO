from __future__ import annotations

from typing import Any

from engines.strategic_council.council_engine import run_strategic_council
from engines.strategic_council.council_models import CouncilAgentInput, StrategicCouncilResult


def build_strategic_council_input(payload: dict[str, Any] | CouncilAgentInput) -> CouncilAgentInput:
    if isinstance(payload, CouncilAgentInput):
        return payload
    return CouncilAgentInput.model_validate(payload)


def run_strategic_council_service(payload: dict[str, Any] | CouncilAgentInput) -> StrategicCouncilResult:
    request = build_strategic_council_input(payload)
    return run_strategic_council(request)
