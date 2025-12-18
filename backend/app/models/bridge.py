"""Pydantic v2 models for human-to-system bridge configuration."""
from __future__ import annotations

from datetime import datetime
from typing import Dict, List

from pydantic import BaseModel, ConfigDict, field_validator, model_validator


def _clamp01(value: float) -> float:
    return max(0.0, min(1.0, value))


class BridgeRule(BaseModel):
    """Mapping between a human archetype and weighted system signals."""

    model_config = ConfigDict(extra="forbid")

    human_archetype_id: str
    system_signals: Dict[str, float]

    @field_validator("human_archetype_id", mode="before")
    @classmethod
    def _non_empty_id(cls, value: str) -> str:
        value = str(value).strip()
        if not value:
            raise ValueError("must be non-empty")
        return value

    @field_validator("system_signals", mode="before")
    @classmethod
    def _clamp_weights(cls, value: Dict[str, float]) -> Dict[str, float]:
        cleaned: Dict[str, float] = {}
        for key, weight in value.items():
            name = str(key).strip()
            if not name:
                raise ValueError("system_signals keys must be non-empty")
            cleaned[name] = _clamp01(float(weight))
        return cleaned


class BridgeConfig(BaseModel):
    """Versioned container for editable bridge rules."""

    model_config = ConfigDict(extra="forbid")

    version: str
    updated_at: datetime
    rules: List[BridgeRule]

    @model_validator(mode="after")
    def _unique_rules(self) -> "BridgeConfig":
        if not self.rules:
            raise ValueError("rules must not be empty")
        seen = set()
        for rule in self.rules:
            if rule.human_archetype_id in seen:
                raise ValueError(f"duplicate human_archetype_id: {rule.human_archetype_id}")
            seen.add(rule.human_archetype_id)
        return self
