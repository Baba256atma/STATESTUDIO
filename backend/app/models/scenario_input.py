"""Input models for Nexora Scenario Simulation Lite."""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.models.scanner_output import FragilityScanResponse
from ingestion.schemas import SignalBundle


def _trim_string(value: str | None) -> str | None:
    if value is None:
        return None
    trimmed = value.strip()
    return trimmed or None


class ScenarioSimulationRequest(BaseModel):
    """Structured request payload for deterministic what-if simulation."""

    model_config = ConfigDict(extra="forbid")

    scenario_text: str
    baseline_scanner_result: FragilityScanResponse | None = None
    signal_bundle: SignalBundle | None = None
    max_steps: int = Field(default=4, ge=1, le=5)
    domain: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)

    @model_validator(mode="before")
    @classmethod
    def _normalize_and_validate(cls, value: Any) -> Any:
        if not isinstance(value, dict):
            return value

        normalized = dict(value)
        normalized["scenario_text"] = _trim_string(normalized.get("scenario_text"))
        normalized["domain"] = _trim_string(normalized.get("domain"))

        if not normalized.get("scenario_text"):
            raise ValueError("Provide 'scenario_text' for simulation.")

        if normalized.get("max_steps") in (None, ""):
            normalized["max_steps"] = 4

        return normalized
