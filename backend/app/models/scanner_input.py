"""Input models for the Nexora Fragility Scanner MVP."""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, ConfigDict, Field, model_validator

from ingestion.schemas import SignalBundle


def _trim_string(value: str | None) -> str | None:
    if value is None:
        return None
    trimmed = value.strip()
    return trimmed or None


class FragilityScanRequest(BaseModel):
    """Structured request payload for a fragility scan."""

    model_config = ConfigDict(extra="forbid")

    text: str | None = None
    payload: str | None = None
    source_type: str | None = None
    source_name: str | None = None
    source_url: str | None = None
    workspace_id: str | None = None
    user_id: str | None = None
    mode: str = "business"
    allowed_objects: list[str] | None = None
    signal_bundle: SignalBundle | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)

    @model_validator(mode="before")
    @classmethod
    def _normalize_and_validate(cls, value: Any) -> Any:
        if not isinstance(value, dict):
            return value

        normalized = dict(value)
        for key in ("text", "payload", "source_type", "source_name", "source_url", "workspace_id", "user_id", "mode"):
            normalized[key] = _trim_string(normalized.get(key))

        allowed_objects = normalized.get("allowed_objects")
        if isinstance(allowed_objects, list):
            normalized["allowed_objects"] = [
                trimmed
                for item in allowed_objects
                if isinstance(item, str) and (trimmed := item.strip())
            ] or None

        normalized["mode"] = normalized.get("mode") or "business"
        if (
            not normalized.get("signal_bundle")
            and not normalized.get("text")
            and not normalized.get("payload")
            and not normalized.get("source_url")
        ):
            raise ValueError("Provide at least one of 'signal_bundle', 'text', 'payload', or 'source_url'.")
        return normalized
