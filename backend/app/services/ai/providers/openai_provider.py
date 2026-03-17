"""Placeholder OpenAI provider for future cloud integration."""

from __future__ import annotations

from app.core.config import LocalAISettings, get_local_ai_settings
from app.services.ai.providers.base import AIProvider
from app.services.ai.providers.types import (
    ProviderChatRequest,
    ProviderChatResponse,
    ProviderDescriptor,
    ProviderHealthStatus,
    ProviderModelList,
)


class OpenAIProvider(AIProvider):
    """Non-executing placeholder used to keep provider routing extensible."""

    def __init__(self, settings: LocalAISettings | None = None) -> None:
        self.settings = settings or get_local_ai_settings()

    @property
    def provider_key(self) -> str:
        return "openai"

    @property
    def default_model(self) -> str:
        return self.settings.openai_default_model

    def describe(self) -> ProviderDescriptor:
        return ProviderDescriptor(
            key=self.provider_key,
            kind="cloud",
            enabled=self.settings.cloud_provider_enabled,
            configured=self.settings.openai_enabled,
            default_model=self.default_model,
            base_url=self.settings.openai_base_url,
            metadata={"stub": True},
        )

    async def health_check(self) -> ProviderHealthStatus:
        return ProviderHealthStatus(
            ok=True,
            provider=self.provider_key,
            available=False,
            base_url=self.settings.openai_base_url,
            default_model=self.default_model,
            error=None if self.settings.openai_enabled else "provider_not_configured",
            metadata={"stub": True},
        )

    async def list_models(self) -> ProviderModelList:
        return ProviderModelList(
            ok=self.settings.openai_enabled,
            provider=self.provider_key,
            models=[],
            error=None if self.settings.openai_enabled else "provider_not_configured",
            metadata={"stub": True},
        )

    async def chat_json(self, request: ProviderChatRequest) -> ProviderChatResponse:
        return ProviderChatResponse(
            ok=False,
            provider=self.provider_key,
            model=request.model or self.default_model,
            raw_model=request.model or self.default_model,
            output="",
            error="provider_not_configured",
            metadata={"stub": True, "trace_id": request.trace_id},
        )
