"""Canonical schemas for the Nexora ingestion layer."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Literal
from uuid import uuid4

from pydantic import BaseModel, ConfigDict, Field, field_validator


SourceDocumentType = Literal["text", "pdf", "csv", "web"]


def _trim_string(value: str | None) -> str | None:
    if value is None:
        return None
    trimmed = value.strip()
    return trimmed or None


def _clamp_strength(value: float) -> float:
    return max(0.0, min(1.0, float(value)))


class SourceDocument(BaseModel):
    """Normalized input document after extraction."""

    model_config = ConfigDict(extra="forbid")

    id: str = Field(default_factory=lambda: f"src_{uuid4().hex}")
    type: SourceDocumentType
    raw_content: str
    metadata: dict[str, Any] = Field(default_factory=dict)

    @field_validator("id", "raw_content", mode="before")
    @classmethod
    def _trim_required_strings(cls, value: str) -> str:
        trimmed = _trim_string(value)
        if trimmed is None:
            raise ValueError("Field cannot be empty.")
        return trimmed


class Signal(BaseModel):
    """Canonical signal extracted from a source document."""

    model_config = ConfigDict(extra="forbid")

    id: str = Field(default_factory=lambda: f"sig_{uuid4().hex}")
    type: str
    description: str
    entities: list[str] = Field(default_factory=list)
    strength: float
    source_id: str

    @field_validator("id", "type", "description", "source_id", mode="before")
    @classmethod
    def _trim_signal_strings(cls, value: str) -> str:
        trimmed = _trim_string(value)
        if trimmed is None:
            raise ValueError("Field cannot be empty.")
        return trimmed

    @field_validator("entities", mode="before")
    @classmethod
    def _normalize_entities(cls, value: list[str] | None) -> list[str]:
        if not value:
            return []
        normalized: list[str] = []
        seen: set[str] = set()
        for item in value:
            if not isinstance(item, str):
                continue
            trimmed = item.strip()
            key = trimmed.lower()
            if not trimmed or key in seen:
                continue
            seen.add(key)
            normalized.append(trimmed)
        return normalized

    @field_validator("strength", mode="before")
    @classmethod
    def _normalize_strength(cls, value: float) -> float:
        return _clamp_strength(value)


class SignalBundle(BaseModel):
    """Canonical bundle returned by the ingestion service."""

    model_config = ConfigDict(extra="forbid")

    source: SourceDocument
    signals: list[Signal] = Field(default_factory=list)
    created_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )


class IngestionRunRequest(BaseModel):
    """Public API request payload for ingestion execution."""

    model_config = ConfigDict(extra="forbid")

    type: SourceDocumentType
    payload: str | dict[str, Any]
    metadata: dict[str, Any] = Field(default_factory=dict)

    @field_validator("payload", mode="before")
    @classmethod
    def _normalize_payload(cls, value: str | dict[str, Any]) -> str | dict[str, Any]:
        if isinstance(value, str):
            trimmed = _trim_string(value)
            if trimmed is None:
                raise ValueError("payload is required")
            return trimmed
        if isinstance(value, dict):
            return value
        raise ValueError("payload must be a string or object")


class IngestionRunResponse(SignalBundle):
    """Alias response model for router clarity."""
