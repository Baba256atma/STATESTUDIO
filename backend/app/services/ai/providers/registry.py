"""Provider registry for AI provider implementations."""

from __future__ import annotations

from app.services.ai.providers.base import AIProvider


class AIProviderRegistry:
    """Simple in-memory registry for AI providers."""

    def __init__(self, providers: dict[str, AIProvider]) -> None:
        self._providers = dict(providers)

    def get(self, provider_key: str) -> AIProvider | None:
        """Return a provider by key if it is registered."""
        return self._providers.get(provider_key)

    def list(self) -> list[AIProvider]:
        """Return registered providers in deterministic insertion order."""
        return list(self._providers.values())

    def keys(self) -> list[str]:
        """Return registered provider keys."""
        return list(self._providers.keys())
