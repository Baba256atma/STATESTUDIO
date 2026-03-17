"""Normalized provider request and response types."""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class ProviderDescriptor(BaseModel):
    """Static descriptor for a provider implementation."""

    key: str
    kind: str
    enabled: bool = True
    configured: bool = True
    default_model: str | None = None
    base_url: str | None = None
    supports_structured_output: bool = True
    metadata: dict[str, Any] = Field(default_factory=dict)


class ProviderChatRequest(BaseModel):
    """Normalized structured chat request for provider implementations."""

    model: str | None = None
    messages: list[dict[str, str]] = Field(default_factory=list)
    system: str | None = None
    temperature: float | None = None
    format_schema: dict[str, Any] | str | None = "json"
    trace_id: str | None = None


class ProviderModelInfo(BaseModel):
    """Normalized model metadata returned by a provider."""

    name: str
    provider: str
    available: bool = True
    family: str | None = None
    size: str | None = None
    context_window: int | None = Field(default=None, ge=1)
    metadata: dict[str, Any] = Field(default_factory=dict)


class ProviderHealthStatus(BaseModel):
    """Normalized provider health status."""

    ok: bool = True
    provider: str
    available: bool = False
    base_url: str | None = None
    default_model: str | None = None
    latency_ms: float | None = Field(default=None, ge=0.0)
    error: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class ProviderModelList(BaseModel):
    """Normalized model listing for a provider."""

    ok: bool = True
    provider: str
    models: list[ProviderModelInfo] = Field(default_factory=list)
    latency_ms: float | None = Field(default=None, ge=0.0)
    error: str | None = None
    trace_id: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class ProviderChatResponse(BaseModel):
    """Normalized chat response returned by a provider."""

    ok: bool = False
    provider: str
    model: str
    raw_model: str | None = None
    output: str = ""
    data: dict[str, Any] | list[Any] | None = None
    latency_ms: float | None = Field(default=None, ge=0.0)
    error: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)
