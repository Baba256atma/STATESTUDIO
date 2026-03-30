"""Canonical schemas for deterministic signal-to-object mapping."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator


ObjectImpactRole = Literal["primary", "affected", "context"]


def _trim_string(value: str | None) -> str | None:
    if value is None:
        return None
    trimmed = value.strip()
    return trimmed or None


def _clamp_score(value: float) -> float:
    return max(0.0, min(1.0, float(value)))


class ObjectImpact(BaseModel):
    """One explainable object impact derived from one or more signals."""

    model_config = ConfigDict(extra="forbid")

    object_id: str
    role: ObjectImpactRole
    score: float
    reasons: list[str] = Field(default_factory=list)
    source_signal_ids: list[str] = Field(default_factory=list)

    @field_validator("object_id", "role", mode="before")
    @classmethod
    def _trim_required_fields(cls, value: str) -> str:
        trimmed = _trim_string(value)
        if trimmed is None:
            raise ValueError("Field cannot be empty.")
        return trimmed

    @field_validator("reasons", "source_signal_ids", mode="before")
    @classmethod
    def _normalize_string_lists(cls, value: list[str] | None) -> list[str]:
        if not value:
            return []
        normalized: list[str] = []
        seen: set[str] = set()
        for item in value:
            if not isinstance(item, str):
                continue
            trimmed = item.strip()
            if not trimmed or trimmed in seen:
                continue
            seen.add(trimmed)
            normalized.append(trimmed)
        return normalized

    @field_validator("score", mode="before")
    @classmethod
    def _normalize_score(cls, value: float) -> float:
        return _clamp_score(value)


class ObjectImpactSet(BaseModel):
    """Canonical mapping result used by scanner, reactions, and panels."""

    model_config = ConfigDict(extra="forbid")

    primary: list[ObjectImpact] = Field(default_factory=list)
    affected: list[ObjectImpact] = Field(default_factory=list)
    context: list[ObjectImpact] = Field(default_factory=list)

