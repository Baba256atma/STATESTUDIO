"""Output models for the Nexora Fragility Scanner MVP."""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, ConfigDict, Field, field_validator


def _clamp01(value: float) -> float:
    return max(0.0, min(1.0, float(value)))


def _trim_string(value: str) -> str:
    return value.strip()


class FragilityDriver(BaseModel):
    """A primary driver contributing to system fragility."""

    model_config = ConfigDict(extra="forbid")

    id: str
    label: str
    score: float = 0.0
    severity: str
    dimension: str | None = None
    evidence_text: str | None = None

    @field_validator("id", "label", "severity", "dimension", "evidence_text", mode="before")
    @classmethod
    def _trim_fields(cls, value: str | None) -> str | None:
        if value is None:
            return None
        trimmed = value.strip()
        return trimmed or None

    @field_validator("score", mode="before")
    @classmethod
    def _clamp_score(cls, value: float) -> float:
        return _clamp01(value)


class FragilityFinding(BaseModel):
    """One concrete fragility finding returned by the scanner."""

    model_config = ConfigDict(extra="forbid")

    id: str
    title: str
    severity: str
    explanation: str
    recommendation: str

    @field_validator("id", "title", "severity", "explanation", "recommendation", mode="before")
    @classmethod
    def _trim_text_fields(cls, value: str | None) -> str | None:
        if value is None:
            return None
        trimmed = value.strip()
        return trimmed or None


class FragilityScanResponse(BaseModel):
    """Frontend-friendly fragility scanner response payload."""

    model_config = ConfigDict(extra="forbid")

    ok: bool
    summary: str
    fragility_score: float
    fragility_level: str
    drivers: list[FragilityDriver] = Field(default_factory=list)
    findings: list[FragilityFinding] = Field(default_factory=list)
    suggested_objects: list[str] = Field(default_factory=list)
    suggested_actions: list[str] = Field(default_factory=list)
    scene_payload: dict[str, Any] = Field(default_factory=dict)
    debug: dict[str, Any] | None = None

    @field_validator("summary", "fragility_level", mode="before")
    @classmethod
    def _trim_response_strings(cls, value: str) -> str:
        return _trim_string(value)

    @field_validator("suggested_objects", "suggested_actions", mode="before")
    @classmethod
    def _trim_response_lists(cls, value: list[str] | None) -> list[str]:
        if not value:
            return []
        return [item.strip() for item in value if isinstance(item, str) and item.strip()]

    @field_validator("fragility_score", mode="before")
    @classmethod
    def _clamp_score(cls, value: float) -> float:
        return _clamp01(value)
