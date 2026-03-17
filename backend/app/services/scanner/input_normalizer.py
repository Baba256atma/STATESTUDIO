"""Input normalization helpers for the Nexora scanner backend."""

from __future__ import annotations

import re
from typing import Any


def safe_trim(value: str | None) -> str | None:
    """Return a trimmed string or ``None`` when the input is empty."""
    if value is None:
        return None
    trimmed = value.strip()
    return trimmed or None


def normalize_whitespace(value: str | None) -> str | None:
    """Collapse repeated whitespace in a string while preserving word order."""
    trimmed = safe_trim(value)
    if trimmed is None:
        return None
    return re.sub(r"\s+", " ", trimmed)


def build_source_meta(
    source_type: str | None,
    source_name: str | None,
    source_url: str | None,
    metadata: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Build a normalized source metadata payload for downstream analysis."""
    return {
        "source_type": normalize_whitespace(source_type),
        "source_name": normalize_whitespace(source_name),
        "source_url": safe_trim(source_url),
        "metadata": dict(metadata or {}),
    }


def normalize_scanner_input(
    text: str | None,
    source_type: str | None,
    source_name: str | None,
    source_url: str | None,
    metadata: dict | None = None,
) -> dict[str, Any]:
    """Return a normalized scanner input payload for downstream services."""
    normalized_text = normalize_whitespace(text)
    source_meta = build_source_meta(
        source_type=source_type,
        source_name=source_name,
        source_url=source_url,
        metadata=metadata,
    )
    return {
        "text": normalized_text,
        "source_type": source_meta["source_type"],
        "source_name": source_meta["source_name"],
        "source_url": source_meta["source_url"],
        "source_meta": source_meta,
        "metadata": source_meta["metadata"],
    }
