"""LLM-MVP:3 first certified adapter: OpenAI text completion.

Replaceable. Not the Nexora LLM architecture. Credentials stay server-side.
"""

from __future__ import annotations

import os
from typing import Any, Callable

from app.services.nexora_llm.contracts import (
    AdapterError,
    NEXORA_LLM_FIRST_CERTIFIED_ADAPTER,
    NEXORA_LLM_FIRST_CERTIFIED_PROVIDER,
    ProviderCompletion,
    RuntimeUsage,
)


def _env(name: str) -> str | None:
    value = os.getenv(name)
    if value is None:
        return None
    trimmed = value.strip()
    return trimmed or None


def openai_api_key_configured() -> bool:
    return _env("OPENAI_API_KEY") is not None


def selected_openai_model() -> str:
    return _env("OPENAI_MODEL") or _env("OPENAI_DEFAULT_MODEL") or "gpt-4o-mini"


def _token(value: Any) -> int | None:
    return int(value) if isinstance(value, (int, float)) and not isinstance(value, bool) else None


def _usage_of(response: Any) -> RuntimeUsage:
    usage = getattr(response, "usage", None)
    if usage is None and isinstance(response, dict):
        usage = response.get("usage")
    if usage is None:
        return RuntimeUsage(inputTokens=None, outputTokens=None, totalTokens=None)

    def read(*names: str) -> int | None:
        for name in names:
            if isinstance(usage, dict):
                found = _token(usage.get(name))
            else:
                found = _token(getattr(usage, name, None))
            if found is not None:
                return found
        return None

    return RuntimeUsage(
        inputTokens=read("input_tokens", "prompt_tokens"),
        outputTokens=read("output_tokens", "completion_tokens"),
        totalTokens=read("total_tokens"),
    )


def _text_of(response: Any) -> Any:
    raw = getattr(response, "output_text", None)
    if raw is None and isinstance(response, dict):
        raw = response.get("output_text")
    if isinstance(raw, list):
        return "".join(str(part) for part in raw)
    return raw


def _attr(response: Any, name: str) -> Any:
    value = getattr(response, name, None)
    if value is None and isinstance(response, dict):
        value = response.get(name)
    return value


def classify_openai_error(exc: BaseException) -> AdapterError:
    name = type(exc).__name__
    status = getattr(exc, "status_code", None)
    lowered = str(exc).lower()
    if name in {"APITimeoutError", "TimeoutError"} or "timeout" in lowered and "api" in name.lower():
        return AdapterError("TIMEOUT", "Provider request timed out.")
    if name in {"APIConnectionError", "ConnectError"}:
        return AdapterError("NETWORK_ERROR", "Provider network error.")
    if name in {"AuthenticationError"} or status == 401:
        return AdapterError("AUTH_ERROR", "Provider authentication failed.")
    if name in {"RateLimitError"} or status == 429:
        return AdapterError("RATE_LIMIT", "Provider rate limit.")
    if name in {"BadRequestError"} or status == 400:
        return AdapterError("INVALID_RESPONSE", "Provider rejected the request.")
    return AdapterError("PROVIDER_ERROR", "Provider error.")


class OpenAITextAdapter:
    """First certified live adapter. Not a router, cost guard, or CC owner."""

    identity = NEXORA_LLM_FIRST_CERTIFIED_ADAPTER
    provider = NEXORA_LLM_FIRST_CERTIFIED_PROVIDER

    def __init__(
        self,
        *,
        client_factory: Callable[[], Any] | None = None,
        api_key: str | None = None,
        model: str | None = None,
    ) -> None:
        self._client_factory = client_factory
        self._api_key = api_key
        self._model = model

    def _client(self) -> Any:
        key = self._api_key if self._api_key is not None else _env("OPENAI_API_KEY")
        if not key:
            raise AdapterError("NOT_CONFIGURED", "OPENAI_API_KEY is not configured.")
        if self._client_factory is not None:
            return self._client_factory()
        try:
            from openai import OpenAI
        except Exception as exc:  # pragma: no cover
            raise AdapterError("NOT_CONFIGURED", "OpenAI SDK is not installed.") from exc
        return OpenAI(api_key=key)

    def complete(
        self,
        *,
        system_instruction: str,
        user_payload: str,
        timeout_seconds: float,
    ) -> ProviderCompletion:
        model = self._model or selected_openai_model()
        try:
            client = self._client()
            response = client.responses.create(
                model=model,
                input=[
                    {"role": "system", "content": system_instruction},
                    {"role": "user", "content": user_payload},
                ],
                timeout=timeout_seconds,
            )
        except AdapterError:
            raise
        except Exception as exc:
            raise classify_openai_error(exc) from exc

        request_id = _attr(response, "id")
        response_model = _attr(response, "model")
        return ProviderCompletion(
            text=_text_of(response),
            provider=self.provider,
            model=str(response_model) if response_model else model,
            requestId=str(request_id) if request_id else None,
            usage=_usage_of(response),
            cost=None,
        )
