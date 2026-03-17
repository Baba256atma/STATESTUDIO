"""Base interfaces for AI provider implementations."""

from __future__ import annotations

from abc import ABC, abstractmethod

from app.services.ai.providers.types import (
    ProviderChatRequest,
    ProviderChatResponse,
    ProviderDescriptor,
    ProviderHealthStatus,
    ProviderModelList,
)


class AIProvider(ABC):
    """Abstract provider interface used by orchestration code."""

    @property
    @abstractmethod
    def provider_key(self) -> str:
        """Return the stable provider key."""

    @property
    @abstractmethod
    def default_model(self) -> str | None:
        """Return the provider default model if one exists."""

    @abstractmethod
    def describe(self) -> ProviderDescriptor:
        """Return static provider metadata for diagnostics."""

    @abstractmethod
    async def health_check(self) -> ProviderHealthStatus:
        """Return provider health information."""

    @abstractmethod
    async def list_models(self) -> ProviderModelList:
        """Return the models available from this provider."""

    @abstractmethod
    async def chat_json(self, request: ProviderChatRequest) -> ProviderChatResponse:
        """Execute a structured chat request."""
