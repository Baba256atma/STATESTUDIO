"""Input models for Nexora Decision Engine Lite."""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.models.scanner_output import FragilityScanResponse
from app.models.scenario_output import ScenarioSimulationResult


def _trim_string(value: str | None) -> str | None:
    if value is None:
        return None
    trimmed = value.strip()
    return trimmed or None


class DecisionEngineInput(BaseModel):
    """Structured request payload for deterministic decision comparison."""

    model_config = ConfigDict(extra="forbid")

    baseline: FragilityScanResponse | None = None
    scenarios: list[ScenarioSimulationResult] = Field(default_factory=list)
    decision_goal: str | None = None
    constraints: dict[str, Any] = Field(default_factory=dict)

    # Legacy compatibility path used by the current frontend execution flow.
    selected_objects: list[str] = Field(default_factory=list)
    context: list[dict[str, Any]] = Field(default_factory=list)
    scenario: dict[str, Any] | None = None

    @model_validator(mode="before")
    @classmethod
    def _normalize_payload(cls, value: Any) -> Any:
        if not isinstance(value, dict):
            return value

        normalized = dict(value)
        normalized["decision_goal"] = _trim_string(normalized.get("decision_goal"))
        normalized["selected_objects"] = [
            item.strip()
            for item in normalized.get("selected_objects", []) or []
            if isinstance(item, str) and item.strip()
        ]
        return normalized
