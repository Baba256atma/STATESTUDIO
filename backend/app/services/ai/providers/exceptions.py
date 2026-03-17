"""Provider-safe exceptions for Nexora AI integrations."""

from __future__ import annotations


class AIProviderError(Exception):
    """Base exception for controlled provider failures."""

    def __init__(self, code: str, message: str) -> None:
        super().__init__(message)
        self.code = code
        self.message = message


class UnknownProviderError(AIProviderError):
    """Raised when a provider key is not registered."""

    def __init__(self, provider_key: str) -> None:
        super().__init__("unknown_provider", f"Unknown AI provider: {provider_key}")


class ProviderUnavailableError(AIProviderError):
    """Raised when a provider cannot be reached."""

    def __init__(self, message: str = "AI provider is unavailable.") -> None:
        super().__init__("provider_unavailable", message)


class ProviderInvalidResponseError(AIProviderError):
    """Raised when a provider returns unusable output."""

    def __init__(self, message: str = "AI provider returned invalid output.") -> None:
        super().__init__("invalid_provider_response", message)


class ProviderNotConfiguredError(AIProviderError):
    """Raised when a provider exists but is not configured for execution."""

    def __init__(self, provider_key: str) -> None:
        super().__init__("provider_not_configured", f"AI provider is not configured: {provider_key}")
