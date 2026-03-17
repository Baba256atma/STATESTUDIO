"""Compatibility wrapper around the Ollama provider implementation."""

from __future__ import annotations

from typing import Any

import httpx

from app.core.config import LocalAISettings, get_local_ai_settings
from app.services.ai.providers.ollama_provider import OllamaProvider
from app.services.ai.providers.types import (
    ProviderChatRequest,
)


class OllamaClient:
    """Backward-compatible wrapper retaining the historical Ollama client API."""

    def __init__(
        self,
        settings: LocalAISettings | None = None,
        http_client: httpx.AsyncClient | None = None,
    ) -> None:
        self.settings = settings or get_local_ai_settings()
        self._provider = OllamaProvider(settings=self.settings, http_client=http_client)

    @property
    def provider_name(self) -> str:
        """Return the configured provider label."""
        return self._provider.provider_key

    @property
    def default_model(self) -> str:
        """Return the configured default model name."""
        return self._provider.default_model

    async def health_check(self) -> dict[str, Any]:
        """Return normalized health information for the local provider."""
        return (await self._provider.health_check()).model_dump()

    async def list_models(self) -> dict[str, Any]:
        """Return normalized model metadata from Ollama."""
        return (await self._provider.list_models()).model_dump()

    async def chat_json(
        self,
        *,
        messages: list[dict[str, str]],
        model: str | None = None,
        system: str | None = None,
        temperature: float | None = None,
        format_schema: dict[str, Any] | str | None = "json",
        trace_id: str | None = None,
    ) -> dict[str, Any]:
        """Run a non-streaming chat request and normalize structured output."""
        response = await self._provider.chat_json(
            ProviderChatRequest(
                messages=messages,
                model=model,
                system=system,
                temperature=temperature,
                format_schema=format_schema,
                trace_id=trace_id,
            )
        )
        return response.model_dump()
