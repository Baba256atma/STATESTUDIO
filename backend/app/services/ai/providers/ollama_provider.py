"""Ollama provider implementation for the Nexora AI provider layer."""

from __future__ import annotations

import json
import logging
import time
from typing import Any

import httpx

from app.core.config import LocalAISettings, get_local_ai_settings
from app.services.ai.providers.base import AIProvider
from app.services.ai.providers.exceptions import (
    ProviderInvalidResponseError,
    ProviderUnavailableError,
)
from app.services.ai.providers.types import (
    ProviderChatRequest,
    ProviderChatResponse,
    ProviderDescriptor,
    ProviderHealthStatus,
    ProviderModelInfo,
    ProviderModelList,
)


logger = logging.getLogger("nexora.ai.providers.ollama")


class OllamaProvider(AIProvider):
    """Async Ollama provider implementation backed by HTTP APIs."""

    def __init__(
        self,
        settings: LocalAISettings | None = None,
        http_client: httpx.AsyncClient | None = None,
    ) -> None:
        self.settings = settings or get_local_ai_settings()
        self._http_client = http_client

    @property
    def provider_key(self) -> str:
        """Return the provider key used by routing and diagnostics."""
        return self.settings.provider

    @property
    def default_model(self) -> str:
        """Return the configured Ollama default model."""
        return self.settings.default_model

    def describe(self) -> ProviderDescriptor:
        """Return static Ollama provider metadata."""
        return ProviderDescriptor(
            key=self.provider_key,
            kind="local",
            enabled=self.settings.enabled and self.settings.local_provider_enabled,
            configured=True,
            default_model=self.default_model,
            base_url=self.settings.base_url,
            metadata={"health_path": self.settings.health_path},
        )

    async def health_check(self) -> ProviderHealthStatus:
        """Return normalized health information for Ollama."""
        result = await self._request("GET", self.settings.health_path, trace_id="startup-health-check")
        available = bool(result["ok"] and result["status_code"] and result["status_code"] < 500)
        return ProviderHealthStatus(
            ok=True,
            provider=self.provider_key,
            available=available,
            base_url=self.settings.base_url,
            default_model=self.default_model,
            latency_ms=result["latency_ms"],
            error=result["error"],
            metadata={"health_path": self.settings.health_path, "status_code": result["status_code"]},
        )

    async def list_models(self) -> ProviderModelList:
        """Return normalized model metadata from Ollama."""
        result = await self._request("GET", "/api/tags")
        models_payload = result["data"].get("models", []) if isinstance(result["data"], dict) else []

        models: list[ProviderModelInfo] = []
        if isinstance(models_payload, list):
            for item in models_payload:
                if not isinstance(item, dict):
                    continue
                details = item.get("details") if isinstance(item.get("details"), dict) else {}
                context_length = item.get("context_length")
                if not isinstance(context_length, int):
                    context_length = details.get("parameter_size") if isinstance(details.get("parameter_size"), int) else None
                name = str(item.get("name") or "")
                if not name:
                    continue
                models.append(
                    ProviderModelInfo(
                        name=name,
                        provider=self.provider_key,
                        available=True,
                        family=details.get("family"),
                        size=item.get("size") or details.get("parameter_size"),
                        context_window=context_length if isinstance(context_length, int) and context_length > 0 else None,
                        metadata={
                            "digest": item.get("digest"),
                            "modified_at": item.get("modified_at"),
                            "details": details,
                        },
                    )
                )

        return ProviderModelList(
            ok=bool(result["ok"]),
            provider=self.provider_key,
            models=models,
            latency_ms=result["latency_ms"],
            error=result["error"],
            trace_id=result["trace_id"],
        )

    async def chat_json(self, request: ProviderChatRequest) -> ProviderChatResponse:
        """Run a non-streaming chat request and normalize structured output."""
        request_messages: list[dict[str, str]] = []
        if request.system:
            request_messages.append({"role": "system", "content": request.system})
        request_messages.extend(request.messages)

        payload: dict[str, Any] = {
            "model": request.model or self.default_model,
            "messages": request_messages,
            "stream": False,
        }
        if request.format_schema is not None:
            payload["format"] = request.format_schema
        if request.temperature is not None:
            payload["options"] = {"temperature": float(request.temperature)}

        result = await self._request("POST", "/api/chat", json_body=payload, trace_id=request.trace_id)
        raw_payload = result["data"] if isinstance(result["data"], dict) else {}
        raw_message = raw_payload.get("message") if isinstance(raw_payload.get("message"), dict) else {}
        raw_content = raw_message.get("content")
        output = raw_content if isinstance(raw_content, str) else ""

        parsed_json: dict[str, Any] | list[Any] | None = None
        parse_error: str | None = None
        if output:
            try:
                loaded = json.loads(output)
                if isinstance(loaded, (dict, list)):
                    parsed_json = loaded
            except json.JSONDecodeError:
                parse_error = "invalid_json_output"

        if parse_error:
            logger.warning(
                "ollama_invalid_json_output trace_id=%s model=%s",
                request.trace_id,
                payload["model"],
            )

        if self.settings.log_raw_responses:
            logger.debug(
                "ollama_raw_response trace_id=%s model=%s payload=%s",
                request.trace_id,
                payload["model"],
                raw_payload,
            )

        normalized_error = result["error"] or parse_error
        if result["ok"] and not output:
            normalized_error = "empty_model_output"
            logger.warning(
                "ollama_empty_model_output trace_id=%s model=%s",
                request.trace_id,
                payload["model"],
            )

        return ProviderChatResponse(
            ok=bool(result["ok"] and output),
            provider=self.provider_key,
            model=payload["model"],
            raw_model=raw_payload.get("model") or payload["model"],
            output=output,
            data=parsed_json,
            latency_ms=result["latency_ms"],
            error=normalized_error,
            metadata={
                "trace_id": request.trace_id,
                "done": raw_payload.get("done"),
                "done_reason": raw_payload.get("done_reason"),
                "prompt_eval_count": raw_payload.get("prompt_eval_count"),
                "eval_count": raw_payload.get("eval_count"),
            },
        )

    async def _request(
        self,
        method: str,
        path: str,
        *,
        json_body: dict[str, Any] | None = None,
        trace_id: str | None = None,
    ) -> dict[str, Any]:
        """Execute an Ollama request and return a normalized result."""
        started_at = time.perf_counter()
        client = self._http_client or self._build_client()
        close_client = self._http_client is None
        normalized_path = path if path.startswith("/") else f"/{path}"

        try:
            response = await client.request(method, normalized_path, json=json_body)
            latency_ms = round((time.perf_counter() - started_at) * 1000, 2)
            response.raise_for_status()
            data = response.json() if response.content else {}
            logger.info(
                "ollama_request_ok trace_id=%s method=%s path=%s status_code=%s latency_ms=%s",
                trace_id,
                method,
                normalized_path,
                response.status_code,
                latency_ms,
            )
            return {
                "ok": True,
                "status_code": response.status_code,
                "data": data,
                "latency_ms": latency_ms,
                "error": None,
                "trace_id": trace_id,
            }
        except httpx.TimeoutException:
            latency_ms = round((time.perf_counter() - started_at) * 1000, 2)
            logger.warning(
                "ollama_request_timeout trace_id=%s method=%s path=%s latency_ms=%s",
                trace_id,
                method,
                normalized_path,
                latency_ms,
            )
            return {
                "ok": False,
                "status_code": None,
                "data": None,
                "latency_ms": latency_ms,
                "error": ProviderUnavailableError("Local AI provider timed out.").code,
                "trace_id": trace_id,
            }
        except httpx.HTTPStatusError as exc:
            latency_ms = round((time.perf_counter() - started_at) * 1000, 2)
            logger.warning(
                "ollama_request_http_error trace_id=%s method=%s path=%s status_code=%s latency_ms=%s",
                trace_id,
                method,
                normalized_path,
                exc.response.status_code,
                latency_ms,
            )
            return {
                "ok": False,
                "status_code": exc.response.status_code,
                "data": None,
                "latency_ms": latency_ms,
                "error": "provider_http_error",
                "trace_id": trace_id,
            }
        except httpx.HTTPError:
            latency_ms = round((time.perf_counter() - started_at) * 1000, 2)
            logger.warning(
                "ollama_request_unavailable trace_id=%s method=%s path=%s latency_ms=%s",
                trace_id,
                method,
                normalized_path,
                latency_ms,
            )
            return {
                "ok": False,
                "status_code": None,
                "data": None,
                "latency_ms": latency_ms,
                "error": ProviderUnavailableError().code,
                "trace_id": trace_id,
            }
        except ValueError:
            latency_ms = round((time.perf_counter() - started_at) * 1000, 2)
            logger.warning(
                "ollama_request_invalid_json trace_id=%s method=%s path=%s latency_ms=%s",
                trace_id,
                method,
                normalized_path,
                latency_ms,
            )
            return {
                "ok": False,
                "status_code": None,
                "data": None,
                "latency_ms": latency_ms,
                "error": ProviderInvalidResponseError().code,
                "trace_id": trace_id,
            }
        finally:
            if close_client:
                await client.aclose()

    def _build_client(self) -> httpx.AsyncClient:
        """Create a short-lived async HTTP client for provider requests."""
        return httpx.AsyncClient(
            base_url=self.settings.base_url,
            timeout=httpx.Timeout(self.settings.timeout_seconds),
            headers={"Accept": "application/json"},
        )
