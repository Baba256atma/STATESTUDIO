"""Shared service exceptions for the local AI layer."""

from __future__ import annotations

from app.services.ai.providers.exceptions import (
    AIProviderError,
    ProviderInvalidResponseError,
    ProviderUnavailableError,
)


class LocalAIServiceError(AIProviderError):
    """Base exception for controlled local AI service failures."""

    def __init__(self, code: str, message: str) -> None:
        super().__init__(code, message)


class LocalAIProviderUnavailableError(ProviderUnavailableError):
    """Raised when the configured local AI provider cannot be reached."""

    def __init__(self, message: str = "Local AI provider is unavailable.") -> None:
        super().__init__(message)


class LocalAIInvalidResponseError(ProviderInvalidResponseError):
    """Raised when the provider returns unusable or invalid output."""

    def __init__(self, message: str = "Local AI provider returned invalid output.") -> None:
        super().__init__(message)
