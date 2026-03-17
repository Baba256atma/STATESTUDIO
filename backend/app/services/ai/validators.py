"""Validation helpers for structured local AI responses."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from fastapi import HTTPException
from pydantic import BaseModel, Field, ValidationError

from app.schemas.ai import ObjectCandidate, RiskSignal


class StructuredAIOutput(BaseModel):
    """Canonical parsed structure expected from the model."""

    summary: str | None = None
    risk_signals: list[RiskSignal] = Field(default_factory=list)
    object_candidates: list[ObjectCandidate] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)


@dataclass(frozen=True)
class ValidationResult:
    """Validation result for structured model output."""

    ok: bool
    data: StructuredAIOutput | None
    error: str | None


def normalize_text_input(text: str | None) -> str:
    """Return a normalized text payload for local AI requests."""
    return (text or "").strip()


def require_non_empty_text(text: str | None) -> str:
    """Validate that a request contains non-empty text."""
    normalized = normalize_text_input(text)
    if not normalized:
        raise HTTPException(
            status_code=422,
            detail={
                "error": {
                    "code": "INVALID_INPUT",
                    "message": "text is required",
                }
            },
        )
    return normalized


def validate_structured_output(payload: Any) -> ValidationResult:
    """Validate model output against the expected semantic JSON structure."""
    if payload is None:
        return ValidationResult(ok=False, data=None, error="empty_structured_output")

    if not isinstance(payload, dict):
        return ValidationResult(ok=False, data=None, error="structured_output_must_be_object")

    try:
        data = StructuredAIOutput.model_validate(payload)
    except ValidationError:
        return ValidationResult(ok=False, data=None, error="invalid_structured_output")

    return ValidationResult(ok=True, data=data, error=None)
