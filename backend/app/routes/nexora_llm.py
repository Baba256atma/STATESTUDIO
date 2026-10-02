from __future__ import annotations

from typing import Any

from fastapi import APIRouter
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


@router.post("/runtime", response_model=NexoraLlmRuntimeResultBody)
def create_nexora_llm_runtime_result(
    payload: NexoraLlmRuntimeRequestBody,
) -> dict[str, Any]:
    return execute_nexora_llm_guarded_runtime(payload.model_dump())
