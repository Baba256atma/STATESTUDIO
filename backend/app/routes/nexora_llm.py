from __future__ import annotations

import hmac
import os
import re
from typing import Any

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, ConfigDict

from app.services.nexora_llm.usage_guard import execute_nexora_llm_guarded_runtime

router = APIRouter(prefix="/nexora/llm", tags=["nexora-llm"])


class NexoraLlmRuntimeRequestBody(BaseModel):
    model_config = ConfigDict(extra="ignore")

    turnId: str
    deterministicResponse: str
    experienceStatus: str
    managementContext: dict[str, Any]


class NexoraLlmRuntimeFailureBody(BaseModel):
    category: str
    message: str


class NexoraLlmRuntimeMetaBody(BaseModel):
    provider: str
    model: str | None = None
    requestId: str | None = None
    latencyMs: float | None = None


class NexoraLlmRuntimeUsageBody(BaseModel):
    inputTokens: int | None = None
    outputTokens: int | None = None
    totalTokens: int | None = None


class NexoraLlmRuntimeCostBody(BaseModel):
    amount: float
    currency: str


class NexoraLlmPolicyBody(BaseModel):
    identity: str | None = None
    allowed: bool
    reason: str
    reservationId: str | None = None
    dispatched: bool | None = None


class NexoraLlmRuntimeResultBody(BaseModel):
    contribution: str | None
    status: str
    failure: NexoraLlmRuntimeFailureBody | None
    runtime: NexoraLlmRuntimeMetaBody
    usage: NexoraLlmRuntimeUsageBody
    cost: NexoraLlmRuntimeCostBody | None = None
    policy: NexoraLlmPolicyBody | None = None


_USAGE_SCOPE = re.compile(r"^[A-Za-z0-9:._-]{8,180}$")


_UNSAFE_ERROR = re.compile(r"sk-|api[_-]?key|secret|traceback|password|/[A-Za-z0-9._/-]{8,}", re.IGNORECASE)


def _safe_runtime_result(result: dict[str, Any]) -> dict[str, Any]:
    failure = result.get("failure")
    if not isinstance(failure, dict):
        return result
    message = failure.get("message")
    if isinstance(message, str) and _UNSAFE_ERROR.search(message):
        safe = dict(result)
        safe["failure"] = {"category": failure.get("category") or "PROVIDER_ERROR", "message": "llm_request_failed"}
        return safe
    return result


def _hosted_gateway_scope(request: Request) -> str | None:
    if os.environ.get("NEXORA_DEPLOYMENT_MODE") != "hosted":
        return None
    expected = os.environ.get("NEXORA_LLM_GATEWAY_SECRET") or ""
    actual = request.headers.get("x-nexora-gateway-secret") or ""
    if not expected or not actual or len(expected) != len(actual) or not hmac.compare_digest(expected, actual):
        raise HTTPException(status_code=401, detail="not_authorized")
    scope = request.headers.get("x-nexora-usage-scope") or ""
    if scope == "ws_default" or not _USAGE_SCOPE.fullmatch(scope):
        raise HTTPException(status_code=401, detail="not_authorized")
    return scope


@router.post("/runtime", response_model=NexoraLlmRuntimeResultBody)
def create_nexora_llm_runtime_result(
    payload: NexoraLlmRuntimeRequestBody,
    request: Request,
) -> dict[str, Any]:
    usage_scope = _hosted_gateway_scope(request)
    return _safe_runtime_result(execute_nexora_llm_guarded_runtime(payload.model_dump(), usage_scope=usage_scope))
