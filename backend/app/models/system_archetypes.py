"""Pydantic v2 models for system signal to archetype mapping."""
from __future__ import annotations

from datetime import datetime
from typing import Dict, List, Literal

from pydantic import BaseModel, ConfigDict, field_validator, model_validator


def _clamp(value: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, value))


def _clamp01(value: float) -> float:
    return _clamp(value, 0.0, 1.0)


class SystemSignals(BaseModel):
    """Normalized system signal values."""

    model_config = ConfigDict(extra="forbid")

    values: Dict[str, float]

    @field_validator("values", mode="before")
    @classmethod
    def _clamp_values(cls, value: Dict[str, float]) -> Dict[str, float]:
        cleaned: Dict[str, float] = {}
        for key, weight in value.items():
            name = str(key).strip()
            if not name:
                raise ValueError("signal name must be non-empty")
            cleaned[name] = _clamp01(float(weight))
        return cleaned


class LoopTemplate(BaseModel):
    """Loop structure descriptor for a system archetype."""

    model_config = ConfigDict(extra="forbid")

    id: str
    type: Literal["R", "B"]
    variables: List[str]
    notes: str | None = None


class SystemArchetypeThresholds(BaseModel):
    """Threshold settings for activation and confidence."""

    model_config = ConfigDict(extra="forbid")

    min_confidence: float = 0.4
    activation: Dict[str, float] = {}

    @field_validator("min_confidence", mode="before")
    @classmethod
    def _clamp_min_confidence(cls, value: float) -> float:
        return _clamp01(float(value))

    @field_validator("activation", mode="before")
    @classmethod
    def _clamp_activation(cls, value: Dict[str, float]) -> Dict[str, float]:
        cleaned: Dict[str, float] = {}
        for key, weight in value.items():
            name = str(key).strip()
            if not name:
                raise ValueError("activation signal name must be non-empty")
            cleaned[name] = _clamp01(float(weight))
        return cleaned


class SystemArchetypeDefinition(BaseModel):
    """Definition of a system archetype with signal weighting and loop template."""

    model_config = ConfigDict(extra="forbid")

    id: str
    name: str
    description: str
    required_signals: List[str]
    weights: Dict[str, float]
    thresholds: SystemArchetypeThresholds
    loops_template: List[LoopTemplate]

    @field_validator("id", "name", mode="before")
    @classmethod
    def _non_empty(cls, value: str) -> str:
        value = str(value).strip()
        if not value:
            raise ValueError("must be non-empty")
        return value

    @field_validator("weights", mode="before")
    @classmethod
    def _clamp_weights(cls, value: Dict[str, float]) -> Dict[str, float]:
        cleaned: Dict[str, float] = {}
        for key, weight in value.items():
            name = str(key).strip()
            if not name:
                raise ValueError("weight signal name must be non-empty")
            cleaned[name] = _clamp01(float(weight))
        return cleaned

    @model_validator(mode="after")
    def _required_signals_non_empty(self) -> "SystemArchetypeDefinition":
        if any(not str(sig).strip() for sig in self.required_signals):
            raise ValueError("required_signals must be non-empty strings")
        return self


class SystemArchetypeResult(BaseModel):
    """Result of mapping system signals to a system archetype."""

    model_config = ConfigDict(extra="forbid")

    archetype_id: str
    confidence: float
    dominant_loop: Literal["R", "B"]
    evidence: Dict[str, float]
    notes: str

    @field_validator("confidence", mode="before")
    @classmethod
    def _clamp_confidence(cls, value: float) -> float:
        return _clamp01(float(value))

    @field_validator("evidence", mode="before")
    @classmethod
    def _clamp_evidence(cls, value: Dict[str, float]) -> Dict[str, float]:
        cleaned: Dict[str, float] = {}
        for key, weight in value.items():
            name = str(key).strip()
            if not name:
                raise ValueError("evidence signal name must be non-empty")
            cleaned[name] = _clamp01(float(weight))
        return cleaned


class SystemArchetypeState(BaseModel):
    """Aggregate system archetype mapping output."""

    model_config = ConfigDict(extra="forbid")

    timestamp: datetime
    results: List[SystemArchetypeResult]
    pressure: float
    instability: float

    @field_validator("pressure", "instability", mode="before")
    @classmethod
    def _clamp_aggregates(cls, value: float) -> float:
        return _clamp01(float(value))
