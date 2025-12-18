"""Pydantic v2 models for human signals and archetype scoring results."""
from __future__ import annotations

from datetime import datetime
from typing import List, Literal

from pydantic import BaseModel, ConfigDict, field_validator


def _clamp01(value: float) -> float:
    return max(0.0, min(1.0, value))


class HumanSignal(BaseModel):
    """Single extracted signal from human input."""

    model_config = ConfigDict(extra="forbid")

    type: Literal["keyword", "phrase", "pattern", "meta"]
    value: str
    score: float

    @field_validator("score", mode="before")
    @classmethod
    def _clamp_score(cls, value: float) -> float:
        return _clamp01(float(value))


class HumanSignalMeta(BaseModel):
    """Lightweight metadata summary for a signal report."""

    model_config = ConfigDict(extra="forbid")

    length: int
    exclamation_count: int
    question_count: int


class HumanSignalReport(BaseModel):
    """Signal extraction report for a text input."""

    model_config = ConfigDict(extra="forbid")

    text: str
    signals: List[HumanSignal]
    meta: HumanSignalMeta


class HumanArchetypeResult(BaseModel):
    """Single scored archetype with evidence."""

    model_config = ConfigDict(extra="forbid")

    archetype_id: str
    confidence: float
    intensity: float
    evidence: List[str]

    @field_validator("confidence", "intensity", mode="before")
    @classmethod
    def _clamp_scores(cls, value: float) -> float:
        return _clamp01(float(value))


class HumanArchetypeState(BaseModel):
    """Aggregate archetype scoring output."""

    model_config = ConfigDict(extra="forbid")

    timestamp: datetime
    results: List[HumanArchetypeResult]
    pressure: float
    instability: float

    @field_validator("pressure", "instability", mode="before")
    @classmethod
    def _clamp_aggregates(cls, value: float) -> float:
        return _clamp01(float(value))
