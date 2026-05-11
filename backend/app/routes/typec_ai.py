from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.models.typec_ai_models import (
    TypeCAIInsightRequest,
    TypeCAIInsightResponse,
    TypeCMultiAgentRequest,
    TypeCMultiAgentResponse,
)
from app.services.typec_ai_service import generate_typec_ai_insight
from app.services.typec_multi_agent_service import generate_typec_multi_agent_insight

router = APIRouter(prefix="/typec/ai", tags=["typec-ai"])


@router.post("/insight", response_model=TypeCAIInsightResponse)
def create_typec_ai_insight(payload: TypeCAIInsightRequest) -> TypeCAIInsightResponse:
    if (
        payload.decisionRecommendation is None
        and payload.adaptiveGuidance is None
        and payload.memorySummary is None
    ):
        raise HTTPException(
            status_code=422,
            detail={"error": {"code": "INVALID_INPUT", "message": "Type-C AI context is required"}},
        )
    return generate_typec_ai_insight(payload)


@router.post("/multi-agent", response_model=TypeCMultiAgentResponse)
def create_typec_multi_agent_insight(payload: TypeCMultiAgentRequest) -> TypeCMultiAgentResponse:
    if payload.recommendation is None and payload.adaptiveGuidance is None and payload.memorySummary is None:
        raise HTTPException(
            status_code=422,
            detail={"error": {"code": "INVALID_INPUT", "message": "Type-C multi-agent context is required"}},
        )
    return generate_typec_multi_agent_insight(payload)
