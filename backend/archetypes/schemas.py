"""Pydantic models for system archetype analysis outputs."""
from __future__ import annotations

from typing import List, Literal

from pydantic import BaseModel, ConfigDict, field_validator


def _clamp01(value: float) -> float:
    return max(0.0, min(1.0, value))


class FeedbackLoop(BaseModel):
    """Represents a feedback loop with a type, variables, and optional delay."""

    model_config = ConfigDict(extra="forbid")

    id: str
    type: Literal["R", "B"]
    variables: List[str]
    strength: float
    delay: float | None = None

    @field_validator("strength", mode="before")
    @classmethod
    def _clamp_strength(cls, value: float) -> float:
        return _clamp01(float(value))

    @field_validator("delay", mode="before")
    @classmethod
    def _clamp_delay(cls, value: float | None) -> float | None:
        if value is None:
            return None
        return _clamp01(float(value))


class ArchetypeDefinition(BaseModel):
    """Defines a system archetype pattern and its expected structure."""

    model_config = ConfigDict(extra="forbid")

    id: str
    name: str
    description: str
    loops: List[FeedbackLoop]
    typical_signals: List[str]
    risk_level: Literal["low", "medium", "high"]
    leverage_points: List[str]


class ArchetypeDetectionResult(BaseModel):
    """Captures a detected archetype instance and confidence metrics."""

    model_config = ConfigDict(extra="forbid")

    archetype_id: str
    confidence: float
    dominant_loop: Literal["R", "B"]
    notes: str

    @field_validator("confidence", mode="before")
    @classmethod
    def _clamp_confidence(cls, value: float) -> float:
        return _clamp01(float(value))


class ArchetypeState(BaseModel):
    """Container for detected archetypes and system-level indicators."""

    model_config = ConfigDict(extra="forbid")

    detected: List[ArchetypeDetectionResult]
    system_pressure: float
    instability: float
    timestamp: float

    @field_validator("system_pressure", "instability", mode="before")
    @classmethod
    def _clamp_system_metrics(cls, value: float) -> float:
        return _clamp01(float(value))
