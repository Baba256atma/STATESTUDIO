"""LLM-MVP:3 provider-neutral Nexora LLM runtime.

Translates the Phase-2 management context into a participant payload, then
delegates vendor I/O to one replaceable adapter. Does not mutate Nexora.
"""

from __future__ import annotations

import json
import logging
import time
from typing import Any, Protocol

from app.services.nexora_llm.contracts import (
    AdapterError,
    FailureCategory,
    NEXORA_LLM_MANAGEMENT_CONTEXT_IDENTITY,
    NEXORA_LLM_PARTICIPANT_SYSTEM_INSTRUCTION,
    NEXORA_LLM_RUNTIME_DEFAULT_TIMEOUT_SECONDS,
    ProviderCompletion,
    RuntimeCost,
    RuntimeFailure,
    RuntimeMeta,
    RuntimeResult,
    RuntimeUsage,
)
from app.services.nexora_llm.openai_text_adapter import (
    OpenAITextAdapter,
    openai_api_key_configured,
)

logger = logging.getLogger("nexora.llm.runtime")


class RuntimeAdapter(Protocol):
    provider: str

    def complete(
        self,
        *,
        system_instruction: str,
        user_payload: str,
        timeout_seconds: float,
    ) -> ProviderCompletion: ...


def _usage() -> RuntimeUsage:
    return RuntimeUsage(inputTokens=None, outputTokens=None, totalTokens=None)


def _result(
    *,
    contribution: str | None,
    status: str,
    failure: RuntimeFailure | None,
    runtime: RuntimeMeta,
    usage: RuntimeUsage | None = None,
    cost: RuntimeCost | None = None,
) -> RuntimeResult:
    return RuntimeResult(
        contribution=contribution,
        status="ok" if status == "ok" else "failed",
        failure=failure,
        runtime=runtime,
        usage=usage or _usage(),
        cost=cost,
    )


def _failed(
    category: FailureCategory,
    message: str,
    runtime: RuntimeMeta,
    usage: RuntimeUsage | None = None,
    cost: RuntimeCost | None = None,
) -> RuntimeResult:
    return _result(
        contribution=None,
        status="failed",
        failure=RuntimeFailure(category=category, message=message),
        runtime=runtime,
        usage=usage,
        cost=cost,
    )


def _token(value: Any) -> int | None:
    return int(value) if isinstance(value, (int, float)) and not isinstance(value, bool) else None


def _normalize_usage(raw: Any) -> RuntimeUsage:
    if not isinstance(raw, dict):
        return _usage()
    return RuntimeUsage(
        inputTokens=_token(raw.get("inputTokens")),
        outputTokens=_token(raw.get("outputTokens")),
        totalTokens=_token(raw.get("totalTokens")),
    )


def _normalize_cost(raw: Any) -> RuntimeCost | None:
    if not isinstance(raw, dict):
        return None
    amount = raw.get("amount")
    currency = raw.get("currency")
    if not isinstance(amount, (int, float)) or not isinstance(currency, str) or not currency.strip():
        return None
    return RuntimeCost(amount=float(amount), currency=currency.strip())


def build_user_payload(request: dict[str, Any]) -> str:
    return json.dumps(
        {
            "turnId": request.get("turnId"),
            "experienceStatus": request.get("experienceStatus"),
            "deterministicResponse": request.get("deterministicResponse"),
            "managementContext": request.get("managementContext"),
        },
        ensure_ascii=False,
        separators=(",", ":"),
    )


def _valid_request(request: Any) -> bool:
    if not isinstance(request, dict):
        return False
    context = request.get("managementContext")
    return (
        isinstance(request.get("turnId"), str)
        and bool(str(request.get("turnId")).strip())
        and isinstance(request.get("deterministicResponse"), str)
        and isinstance(request.get("experienceStatus"), str)
        and isinstance(context, dict)
        and context.get("identity") == NEXORA_LLM_MANAGEMENT_CONTEXT_IDENTITY
    )


def configured_adapter() -> RuntimeAdapter | None:
    if openai_api_key_configured():
        return OpenAITextAdapter()
    return None


def execute_nexora_llm_runtime(
    request: dict[str, Any] | None,
    adapter: RuntimeAdapter | None = None,
    *,
    timeout_seconds: float | None = None,
) -> RuntimeResult:
    timeout = (
        timeout_seconds
        if timeout_seconds is not None and timeout_seconds > 0
        else NEXORA_LLM_RUNTIME_DEFAULT_TIMEOUT_SECONDS
    )
    selected = adapter if adapter is not None else configured_adapter()
    runtime = RuntimeMeta(
        provider=getattr(selected, "provider", "none") if selected else "none",
        model=None,
        requestId=None,
        latencyMs=0,
    )
    if selected is None:
        return _failed("NOT_CONFIGURED", "Nexora LLM runtime adapter is not configured.", runtime)
    if not _valid_request(request):
        runtime["provider"] = selected.provider
        return _failed("INVALID_RESPONSE", "Nexora LLM runtime request is invalid.", runtime)

    started = time.perf_counter()
    try:
        completion = selected.complete(
            system_instruction=NEXORA_LLM_PARTICIPANT_SYSTEM_INSTRUCTION,
            user_payload=build_user_payload(request),  # type: ignore[arg-type]
            timeout_seconds=timeout,
        )
    except AdapterError as exc:
        runtime["latencyMs"] = round((time.perf_counter() - started) * 1000, 3)
        logger.info(
            "nexora_llm_runtime turn=%s provider=%s status=%s latency_ms=%s",
            request.get("turnId") if isinstance(request, dict) else None,
            selected.provider,
            exc.category,
            runtime["latencyMs"],
        )
        return _failed(exc.category, exc.message, runtime)
    except Exception:
        runtime["latencyMs"] = round((time.perf_counter() - started) * 1000, 3)
        logger.info(
            "nexora_llm_runtime turn=%s provider=%s status=PROVIDER_ERROR latency_ms=%s",
            request.get("turnId") if isinstance(request, dict) else None,
            selected.provider,
            runtime["latencyMs"],
        )
        return _failed("PROVIDER_ERROR", "Provider adapter failed.", runtime)

    runtime["latencyMs"] = round((time.perf_counter() - started) * 1000, 3)
    runtime["provider"] = str(completion.get("provider") or selected.provider)
    model = completion.get("model")
    runtime["model"] = str(model) if isinstance(model, str) and model else None
    request_id = completion.get("requestId")
    runtime["requestId"] = str(request_id) if isinstance(request_id, str) and request_id else None
    usage = _normalize_usage(completion.get("usage"))
    cost = _normalize_cost(completion.get("cost"))
    text = completion.get("text")
    if not isinstance(text, str):
        result = _failed("INVALID_RESPONSE", "Provider completion text was malformed.", runtime, usage, cost)
    else:
        trimmed = text.strip()
        if not trimmed:
            result = _failed("EMPTY_RESPONSE", "Provider returned an empty contribution.", runtime, usage, cost)
        else:
            result = _result(
                contribution=trimmed,
                status="ok",
                failure=None,
                runtime=runtime,
                usage=usage,
                cost=cost,
            )
    logger.info(
        "nexora_llm_runtime turn=%s provider=%s model=%s status=%s latency_ms=%s usage=%s",
        request.get("turnId") if isinstance(request, dict) else None,
        runtime["provider"],
        runtime["model"],
        result["failure"]["category"] if result["failure"] else "ok",
        runtime["latencyMs"],
        usage,
    )
    return result
