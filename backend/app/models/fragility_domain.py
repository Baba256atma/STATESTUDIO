"""Framework-agnostic domain entities for the Nexora Fragility Scanner MVP."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator


FragilityDimension = Literal[
    "operational",
    "delivery",
    "inventory",
    "dependency",
    "volatility",
    "resilience",
]

FragilitySeverity = Literal["low", "medium", "high", "critical"]


def _clamp01(value: float) -> float:
    return max(0.0, min(1.0, float(value)))


def _trim_string(value: str | None) -> str | None:
    if value is None:
        return None
    trimmed = value.strip()
    return trimmed or None


class ScannerEvidence(BaseModel):
    """Evidence item supporting a fragility signal or assessment."""

    model_config = ConfigDict(extra="forbid")

    text: str
    source: str | None = None
    confidence: float = 0.5

    @field_validator("text", "source", mode="before")
    @classmethod
    def _trim_fields(cls, value: str | None) -> str | None:
        return _trim_string(value)

    @field_validator("confidence", mode="before")
    @classmethod
    def _clamp_confidence(cls, value: float) -> float:
        return _clamp01(value)


class FragilitySignal(BaseModel):
    """Normalized fragility signal extracted from a source."""

    model_config = ConfigDict(extra="forbid")

    id: str
    label: str
    score: float = Field(ge=0.0, le=1.0)
    severity: FragilitySeverity
    evidence: list[ScannerEvidence] = Field(default_factory=list)
    source: str | None = None
    dimension: FragilityDimension

    @field_validator("id", "label", "source", "dimension", mode="before")
    @classmethod
    def _trim_text_fields(cls, value: str | None) -> str | None:
        return _trim_string(value)

    @field_validator("score", mode="before")
    @classmethod
    def _clamp_score(cls, value: float) -> float:
        return _clamp01(value)


class FragilityAssessment(BaseModel):
    """Aggregated fragility assessment across one scanner dimension."""

    model_config = ConfigDict(extra="forbid")

    dimension: FragilityDimension
    score: float = Field(ge=0.0, le=1.0)
    severity: FragilitySeverity
    signals: list[FragilitySignal] = Field(default_factory=list)
    summary: str | None = None
    evidence: list[ScannerEvidence] = Field(default_factory=list)

    @field_validator("score", mode="before")
    @classmethod
    def _clamp_score(cls, value: float) -> float:
        return _clamp01(value)

    @field_validator("summary", mode="before")
    @classmethod
    def _trim_summary(cls, value: str | None) -> str | None:
        return _trim_string(value)
