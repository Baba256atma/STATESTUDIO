from __future__ import annotations

import logging
from typing import Any

from fastapi import APIRouter, status
from pydantic import BaseModel, Field, ValidationError

from app.models.decision_input import DecisionEngineInput
from app.models.decision_output import DecisionEngineResult
from app.services.decision.decision_orchestrator import DecisionEngineOrchestrator
from app.services.decision_analysis_chat_attachment import build_decision_analysis_from_prompt_text
from app.utils.responses import http_error

router = APIRouter(prefix="/decision", tags=["decision-execution"])
decision_engine = DecisionEngineOrchestrator()
logger = logging.getLogger(__name__)


class DecisionExecutionRequest(BaseModel):
    selected_objects: list[str] = Field(default_factory=list)
    context: list[dict[str, Any]] = Field(default_factory=list)
    scenario: dict[str, Any] | None = None


class DecisionExecutionResponse(BaseModel):
    simulation_result: dict[str, Any]
    comparison: list[dict[str, Any]]
    scene_actions: dict[str, list[str]]


class StrategicAnalysisTextIn(BaseModel):
    text: str = Field(min_length=8, max_length=32_000)


class StrategicAnalysisTextOut(BaseModel):
    ok: bool
    decision_analysis: dict[str, Any] | None = None


def _build_mock_response() -> DecisionExecutionResponse:
    return DecisionExecutionResponse(
        simulation_result={
            "impact_score": 0.7,
            "risk_change": -0.1,
            "kpi_effects": [
                {"kpi": "delivery", "change": -15},
                {"kpi": "cost", "change": 5},
            ],
            "affected_objects": ["obj_delivery"],
        },
        comparison=[
            {"option": "Option A", "score": 0.7},
            {"option": "Option B", "score": 0.6},
        ],
        scene_actions={
            "highlight": ["obj_delivery"],
            "dim": ["obj_inventory"],
        },
    )


@router.post("/simulate", response_model=DecisionExecutionResponse)
async def simulate_decision(_: DecisionExecutionRequest) -> DecisionExecutionResponse:
    return _build_mock_response()


@router.post("/strategic-analysis-text", response_model=StrategicAnalysisTextOut)
def strategic_analysis_text(payload: StrategicAnalysisTextIn) -> StrategicAnalysisTextOut:
    """
    Build and return ``decision_analysis`` from narrative context (e.g. domain demo load).
    Same engine path as chat attachment; does not persist or mutate client state.
    """
    da = build_decision_analysis_from_prompt_text(payload.text)
    if da is not None:
        logger.info("[Nexora][DecisionAnalysis][ScenarioLoad][Built]")
        return StrategicAnalysisTextOut(ok=True, decision_analysis=da)
    logger.warning("[Nexora][DecisionAnalysis][ScenarioLoad][Built] failed_or_short")
    return StrategicAnalysisTextOut(ok=False, decision_analysis=None)


@router.post("/compare", response_model=DecisionEngineResult)
async def compare_decision(payload: DecisionEngineInput) -> DecisionEngineResult:
    try:
        result = decision_engine.compare(payload.model_dump())
    except ValidationError as exc:
        logger.warning("decision_compare_invalid error=%s", exc)
        raise http_error(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            "DECISION_INVALID_INPUT",
            "Decision comparison input is invalid.",
            code="DECISION_INVALID_INPUT",
            details=exc.errors(),
        ) from exc
    except ValueError as exc:
        logger.warning("decision_compare_rejected error=%s", exc)
        raise http_error(
            status.HTTP_400_BAD_REQUEST,
            "DECISION_INPUT_ERROR",
            str(exc),
            code="DECISION_INPUT_ERROR",
        ) from exc
    except Exception as exc:
        logger.exception("decision_compare_failed")
        raise http_error(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            "DECISION_ERROR",
            "Decision comparison is currently unavailable.",
            code="DECISION_ERROR",
        ) from exc
    try:
        return DecisionEngineResult.model_validate(result)
    except ValidationError as exc:
        logger.error("decision_compare_contract_invalid error=%s", exc)
        raise http_error(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            "DECISION_CONTRACT_ERROR",
            "Decision comparison returned an invalid response.",
            code="DECISION_CONTRACT_ERROR",
        ) from exc
