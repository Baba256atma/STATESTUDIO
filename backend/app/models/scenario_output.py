"""Output models for Nexora Scenario Simulation Lite."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.scanner_output import PanelAdviceSlice, PanelTimelineSlice


ScenarioObjectRole = Literal["primary", "affected", "context"]
ScenarioStateChange = Literal["increase", "decrease", "stress", "delay", "watch"]
ScenarioImpactLevel = Literal["low", "moderate", "high", "critical"]


def _trim_string(value: str | None) -> str | None:
    if value is None:
        return None
    trimmed = value.strip()
    return trimmed or None


def _clamp01(value: float) -> float:
    return max(0.0, min(1.0, float(value)))


class ScenarioPropagationStep(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    order: int
    label: str
    type: str
    source_object_ids: list[str] = Field(default_factory=list)
    target_object_ids: list[str] = Field(default_factory=list)
    confidence: float
    reason: str

    @field_validator("id", "label", "type", "reason", mode="before")
    @classmethod
    def _trim_fields(cls, value: str) -> str:
        trimmed = _trim_string(value)
        if trimmed is None:
            raise ValueError("Field cannot be empty.")
        return trimmed

    @field_validator("source_object_ids", "target_object_ids", mode="before")
    @classmethod
    def _normalize_object_lists(cls, value: list[str] | None) -> list[str]:
        if not value:
            return []
        return [item.strip() for item in value if isinstance(item, str) and item.strip()]

    @field_validator("confidence", mode="before")
    @classmethod
    def _normalize_confidence(cls, value: float) -> float:
        return _clamp01(value)


class ScenarioObjectState(BaseModel):
    model_config = ConfigDict(extra="forbid")

    object_id: str
    role: ScenarioObjectRole
    impact_score: float
    state_change: ScenarioStateChange
    reasons: list[str] = Field(default_factory=list)

    @field_validator("object_id", "role", "state_change", mode="before")
    @classmethod
    def _trim_fields(cls, value: str) -> str:
        trimmed = _trim_string(value)
        if trimmed is None:
            raise ValueError("Field cannot be empty.")
        return trimmed

    @field_validator("reasons", mode="before")
    @classmethod
    def _normalize_reasons(cls, value: list[str] | None) -> list[str]:
        if not value:
            return []
        return [item.strip() for item in value if isinstance(item, str) and item.strip()]

    @field_validator("impact_score", mode="before")
    @classmethod
    def _normalize_score(cls, value: float) -> float:
        return _clamp01(value)


class ScenarioSceneOverlay(BaseModel):
    model_config = ConfigDict(extra="forbid")

    highlighted_object_ids: list[str] = Field(default_factory=list)
    primary_object_ids: list[str] = Field(default_factory=list)
    affected_object_ids: list[str] = Field(default_factory=list)
    dim_unrelated_objects: bool = False
    overlay_labels_by_object: dict[str, str] = Field(default_factory=dict)

    @field_validator("highlighted_object_ids", "primary_object_ids", "affected_object_ids", mode="before")
    @classmethod
    def _normalize_lists(cls, value: list[str] | None) -> list[str]:
        if not value:
            return []
        return [item.strip() for item in value if isinstance(item, str) and item.strip()]


class ScenarioSimulationResult(BaseModel):
    model_config = ConfigDict(extra="forbid")

    ok: bool
    scenario_summary: str
    scenario_type: str
    overall_impact_level: ScenarioImpactLevel
    primary_objects: list[str] = Field(default_factory=list)
    affected_objects: list[str] = Field(default_factory=list)
    object_states: list[ScenarioObjectState] = Field(default_factory=list)
    propagation_steps: list[ScenarioPropagationStep] = Field(default_factory=list)
    scene_overlay: ScenarioSceneOverlay = Field(default_factory=ScenarioSceneOverlay)
    timeline_slice: PanelTimelineSlice
    advice_slice: PanelAdviceSlice

    @field_validator("scenario_summary", "scenario_type", mode="before")
    @classmethod
    def _trim_strings(cls, value: str) -> str:
        trimmed = _trim_string(value)
        if trimmed is None:
            raise ValueError("Field cannot be empty.")
        return trimmed

    @field_validator("primary_objects", "affected_objects", mode="before")
    @classmethod
    def _normalize_object_lists(cls, value: list[str] | None) -> list[str]:
        if not value:
            return []
        return [item.strip() for item in value if isinstance(item, str) and item.strip()]
