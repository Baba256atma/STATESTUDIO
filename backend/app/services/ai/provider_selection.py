"""Deterministic provider selection helpers."""

from __future__ import annotations

from typing import Any

from app.core.config import LocalAISettings


def resolve_requested_provider(metadata: dict[str, Any] | None) -> str | None:
    """Resolve an optional provider override from request metadata."""
    if not isinstance(metadata, dict):
        return None

    raw_provider = metadata.get("provider")
    if isinstance(raw_provider, str) and raw_provider.strip():
        return raw_provider.strip().lower()

    context = metadata.get("context")
    if isinstance(context, dict):
        contextual_provider = context.get("provider")
        if isinstance(contextual_provider, str) and contextual_provider.strip():
            return contextual_provider.strip().lower()

    return None


def select_provider_key(
    *,
    settings: LocalAISettings,
    requested_provider: str | None,
) -> str:
    """Select the provider key for the current request."""
    if requested_provider:
        return requested_provider

    if settings.local_provider_enabled:
        return settings.provider

    return settings.default_provider
