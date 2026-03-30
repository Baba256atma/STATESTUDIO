"""Plain-text extractor for Nexora ingestion."""

from __future__ import annotations

from typing import Any, Mapping


class TextExtractionError(ValueError):
    """Raised when the text ingestion payload is invalid."""


def _coerce_text_payload(payload: str | Mapping[str, Any]) -> str:
    """Extract the canonical text field from the ingestion payload."""
    if isinstance(payload, str):
        return payload

    if isinstance(payload, Mapping):
        raw_text = payload.get("text")
        if isinstance(raw_text, str):
            return raw_text
        raise TextExtractionError("Text ingestion payload must include a string 'text' field.")

    raise TextExtractionError("Text ingestion payload must be a string or an object containing a string 'text' field.")


def extract_text(payload: str | Mapping[str, Any]) -> str:
    """Return normalized text input from the canonical ingestion payload."""
    text = _coerce_text_payload(payload).strip()
    if not text:
        raise TextExtractionError("Text ingestion payload cannot be empty.")
    return text

