"""Pydantic v2 models for editable system archetype library."""
from __future__ import annotations

from datetime import datetime
from typing import Dict, List, Literal

from pydantic import BaseModel, ConfigDict, field_validator, model_validator


def _clamp(value: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, value))


def _clamp01(value: float) -> float:
    return _clamp(value, 0.0, 1.0)


class LoopTemplate(BaseModel):
    """Editable loop template description."""

    model_config = ConfigDict(extra="forbid")

    id: str
    type: Literal["R", "B"]
    variables: List[str]
    notes: str | None = None

    @field_validator("id", mode="before")
    @classmethod
    def _non_empty_id(cls, value: str) -> str:
        value = str(value).strip()
        if not value:
            raise ValueError("id must be non-empty")
        return value


class SystemArchetypeThresholds(BaseModel):
    """Activation thresholds for a system archetype."""

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
    """Editable system archetype definition."""

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
    def _required_signals_valid(self) -> "SystemArchetypeDefinition":
        if not self.required_signals:
            raise ValueError("required_signals must not be empty")
        if any(not str(sig).strip() for sig in self.required_signals):
            raise ValueError("required_signals must be non-empty strings")
        return self


class SystemArchetypeCatalog(BaseModel):
    """Versioned container for system archetype definitions."""

    model_config = ConfigDict(extra="forbid")

    version: str
    updated_at: datetime
    items: List[SystemArchetypeDefinition]

    @model_validator(mode="after")
    def _unique_ids(self) -> "SystemArchetypeCatalog":
        if not self.items:
            raise ValueError("items must not be empty")
        seen = set()
        for item in self.items:
            if item.id in seen:
                raise ValueError(f"duplicate system archetype id: {item.id}")
            seen.add(item.id)
        return self
