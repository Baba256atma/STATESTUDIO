"""Privacy-aware minimization helpers for audit logging."""

from __future__ import annotations

from typing import Any


SENSITIVE_KEYS = {
    "api_key",
    "authorization",
    "credential",
    "password",
    "secret",
    "token",
}


def minimize_audit_metadata(
    metadata: dict[str, Any] | None,
    *,
    sensitivity_level: str | None,
    redact_sensitive_fields: bool,
    include_provider_metadata: bool,
) -> dict[str, Any]:
    """Return minimized metadata safe for audit storage."""
    if not isinstance(metadata, dict):
        return {}

    minimized: dict[str, Any] = {}
    for key, value in metadata.items():
        normalized_key = key.strip().lower()
        if normalized_key in {"text", "prompt", "messages", "raw_output"}:
            continue
        if normalized_key == "provider_metadata" and not include_provider_metadata:
            continue
        if redact_sensitive_fields and normalized_key in SENSITIVE_KEYS:
            minimized[key] = "[REDACTED]"
            continue
        if sensitivity_level in {"confidential", "restricted"} and isinstance(value, str):
            minimized[key] = "[MINIMIZED]"
            continue
        if sensitivity_level in {"confidential", "restricted"} and isinstance(value, (int, float, bool)):
            minimized[key] = "[MINIMIZED]"
            continue
        if isinstance(value, dict):
            minimized[key] = minimize_audit_metadata(
                value,
                sensitivity_level=sensitivity_level,
                redact_sensitive_fields=redact_sensitive_fields,
                include_provider_metadata=include_provider_metadata,
            )
            continue
        if isinstance(value, list):
            minimized[key] = [
                "[MINIMIZED]" if sensitivity_level in {"confidential", "restricted"} else item
                for item in value[:10]
            ]
            continue
        minimized[key] = value
    return minimized
