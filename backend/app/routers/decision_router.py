from __future__ import annotations

from typing import Any

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.models.decision_input import DecisionEngineInput
from app.models.decision_output import DecisionEngineResult
from app.services.decision.decision_orchestrator import DecisionEngineOrchestrator

router = APIRouter(prefix="/decision", tags=["decision-execution"])
decision_engine = DecisionEngineOrchestrator()


class DecisionExecutionRequest(BaseModel):
    selected_objects: list[str] = Field(default_factory=list)
    context: list[dict[str, Any]] = Field(default_factory=list)
    scenario: dict[str, Any] | None = None


class DecisionExecutionResponse(BaseModel):
    simulation_result: dict[str, Any]
    comparison: list[dict[str, Any]]
    scene_actions: dict[str, list[str]]


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


@router.post("/compare", response_model=DecisionEngineResult)
async def compare_decision(payload: DecisionEngineInput) -> DecisionEngineResult:
    result = decision_engine.compare(payload.model_dump())
    return DecisionEngineResult.model_validate(result)
