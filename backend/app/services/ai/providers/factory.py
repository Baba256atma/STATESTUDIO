"""Factory helpers for AI provider resolution."""

from __future__ import annotations

from app.core.config import LocalAISettings, get_local_ai_settings
from app.services.ai.providers.anthropic_provider import AnthropicProvider
from app.services.ai.providers.base import AIProvider
from app.services.ai.providers.exceptions import ProviderNotConfiguredError, UnknownProviderError
from app.services.ai.providers.ollama_provider import OllamaProvider
from app.services.ai.providers.openai_provider import OpenAIProvider
from app.services.ai.providers.registry import AIProviderRegistry


class AIProviderFactory:
    """Build and resolve AI providers for orchestration code."""

    def __init__(self, settings: LocalAISettings | None = None) -> None:
        self.settings = settings or get_local_ai_settings()
        self._registry = AIProviderRegistry(
            {
                "ollama": OllamaProvider(settings=self.settings),
                "openai": OpenAIProvider(settings=self.settings),
                "anthropic": AnthropicProvider(settings=self.settings),
            }
        )

    def registry(self) -> AIProviderRegistry:
        """Return the provider registry."""
        return self._registry

    def get_provider(self, provider_key: str) -> AIProvider:
        """Return a provider by key or raise a controlled error."""
        provider = self._registry.get(provider_key)
        if provider is None:
            raise UnknownProviderError(provider_key)
        return provider

    def get_default_provider(self) -> AIProvider:
        """Return the default provider, falling back safely when needed."""
        provider = self.get_provider(self.settings.default_provider)
        descriptor = provider.describe()
        if descriptor.enabled and descriptor.configured:
            return provider

        fallback_key = self.settings.fallback_provider or self.settings.provider
        fallback_provider = self.get_provider(fallback_key)
        fallback_descriptor = fallback_provider.describe()
        if fallback_descriptor.enabled and fallback_descriptor.configured:
            return fallback_provider

        raise ProviderNotConfiguredError(self.settings.default_provider)
