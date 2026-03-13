"""Pydantic v2 models for the human archetype catalog."""
from __future__ import annotations

from datetime import datetime
from typing import List, Literal

from pydantic import BaseModel, ConfigDict, field_validator, model_validator


def _clamp(value: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, value))


def _clamp01(value: float) -> float:
    return _clamp(value, 0.0, 1.0)


class HumanArchetypeSignals(BaseModel):
    """Signal definitions for a human archetype."""

    model_config = ConfigDict(extra="forbid")

    keywords: List[str]
    phrases: List[str]
    sentiment_hint: Literal["neg", "pos", "mixed", "neutral"] | None = None


class HumanArchetypeWeights(BaseModel):
    """Weight settings for signal contribution and scaling."""

    model_config = ConfigDict(extra="forbid")

    keyword_weight: float
    phrase_weight: float
    intensity_scale: float

    @field_validator("keyword_weight", "phrase_weight", mode="before")
    @classmethod
    def _clamp_weights(cls, value: float) -> float:
        return _clamp01(float(value))

    @field_validator("intensity_scale", mode="before")
    @classmethod
    def _clamp_intensity_scale(cls, value: float) -> float:
        return _clamp(float(value), 0.0, 2.0)


class HumanArchetypeOutputs(BaseModel):
    """Default output values for the archetype."""

    model_config = ConfigDict(extra="forbid")

    default_intensity: float

    @field_validator("default_intensity", mode="before")
    @classmethod
    def _clamp_default_intensity(cls, value: float) -> float:
        return _clamp01(float(value))


class HumanArchetypeDefinition(BaseModel):
    """Editable human archetype definition."""

    model_config = ConfigDict(extra="forbid")

    id: str
    name: str
    description: str
    tags: List[str]
    signals: HumanArchetypeSignals
    weights: HumanArchetypeWeights
    outputs: HumanArchetypeOutputs
    editable: bool = True

    @field_validator("id", "name", mode="before")
    @classmethod
    def _non_empty(cls, value: str) -> str:
        value = str(value).strip()
        if not value:
            raise ValueError("must be non-empty")
        return value


class HumanCatalog(BaseModel):
    """Versioned catalog of human archetype definitions."""

    model_config = ConfigDict(extra="forbid")

    version: str
    updated_at: datetime
    items: List[HumanArchetypeDefinition]

    @model_validator(mode="after")
    def _unique_ids(self) -> "HumanCatalog":
        seen = set()
        for item in self.items:
            if item.id in seen:
                raise ValueError(f"duplicate archetype id: {item.id}")
            seen.add(item.id)
        return self
