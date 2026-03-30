"""Output models for Nexora Decision Engine Lite."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.scanner_output import PanelAdviceSlice, PanelTimelineSlice, PanelWarRoomSlice


DecisionImpactLevel = Literal["low", "moderate", "high", "critical"]


def _trim_string(value: str | None) -> str | None:
    if value is None:
        return None
    trimmed = value.strip()
    return trimmed or None


def _clamp01(value: float) -> float:
    return max(0.0, min(1.0, float(value)))


class DecisionOption(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    label: str
    scenario_summary: str
    impact_level: DecisionImpactLevel
    key_object_ids: list[str] = Field(default_factory=list)
    pros: list[str] = Field(default_factory=list)
    cons: list[str] = Field(default_factory=list)
    score: float
    confidence: float

    @field_validator("id", "label", "scenario_summary", mode="before")
    @classmethod
    def _trim_fields(cls, value: str) -> str:
        trimmed = _trim_string(value)
        if trimmed is None:
            raise ValueError("Field cannot be empty.")
        return trimmed

    @field_validator("key_object_ids", "pros", "cons", mode="before")
    @classmethod
    def _normalize_lists(cls, value: list[str] | None) -> list[str]:
        if not value:
            return []
        return [item.strip() for item in value if isinstance(item, str) and item.strip()]

    @field_validator("score", "confidence", mode="before")
    @classmethod
    def _normalize_scores(cls, value: float) -> float:
        return _clamp01(value)


class DecisionComparison(BaseModel):
    model_config = ConfigDict(extra="forbid")

    options: list[DecisionOption] = Field(default_factory=list)
    best_option_id: str
    comparison_summary: str

    @field_validator("best_option_id", "comparison_summary", mode="before")
    @classmethod
    def _trim_fields(cls, value: str) -> str:
        trimmed = _trim_string(value)
        if trimmed is None:
            raise ValueError("Field cannot be empty.")
        return trimmed


class DecisionRecommendation(BaseModel):
    model_config = ConfigDict(extra="forbid")

    recommended_option_id: str
    reason: str
    expected_outcome: str
    risk_level: str
    key_actions: list[str] = Field(default_factory=list)

    @field_validator("recommended_option_id", "reason", "expected_outcome", "risk_level", mode="before")
    @classmethod
    def _trim_fields(cls, value: str) -> str:
        trimmed = _trim_string(value)
        if trimmed is None:
            raise ValueError("Field cannot be empty.")
        return trimmed

    @field_validator("key_actions", mode="before")
    @classmethod
    def _normalize_key_actions(cls, value: list[str] | None) -> list[str]:
        if not value:
            return []
        return [item.strip() for item in value if isinstance(item, str) and item.strip()]


class LegacyComparisonItem(BaseModel):
    model_config = ConfigDict(extra="forbid")

    option: str
    score: float

    @field_validator("option", mode="before")
    @classmethod
    def _trim_option(cls, value: str) -> str:
        trimmed = _trim_string(value)
        if trimmed is None:
            raise ValueError("Field cannot be empty.")
        return trimmed

    @field_validator("score", mode="before")
    @classmethod
    def _normalize_score(cls, value: float) -> float:
        return _clamp01(value)


class LegacySimulationResult(BaseModel):
    model_config = ConfigDict(extra="forbid")

    impact_score: float
    risk_change: float
    kpi_effects: list[dict[str, Any]] = Field(default_factory=list)
    affected_objects: list[str] = Field(default_factory=list)

    @field_validator("impact_score", mode="before")
    @classmethod
    def _normalize_impact(cls, value: float) -> float:
        return _clamp01(value)

    @field_validator("affected_objects", mode="before")
    @classmethod
    def _normalize_objects(cls, value: list[str] | None) -> list[str]:
        if not value:
            return []
        return [item.strip() for item in value if isinstance(item, str) and item.strip()]


class LegacySceneActions(BaseModel):
    model_config = ConfigDict(extra="forbid")

    highlight: list[str] = Field(default_factory=list)
    dim: list[str] = Field(default_factory=list)


class DecisionEngineResult(BaseModel):
    model_config = ConfigDict(extra="forbid")

    ok: bool
    comparison_result: DecisionComparison
    recommendation: DecisionRecommendation
    timeline_slice: PanelTimelineSlice
    advice_slice: PanelAdviceSlice
    war_room_slice: PanelWarRoomSlice

    # Legacy compatibility for current frontend compare flow.
    comparison: list[LegacyComparisonItem] = Field(default_factory=list)
    simulation_result: LegacySimulationResult
    scene_actions: LegacySceneActions
