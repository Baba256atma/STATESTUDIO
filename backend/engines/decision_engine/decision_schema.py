"""Pydantic schemas for Nexora strategic decision analysis."""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field

from backend.engines.scenario_simulation.simulation_schema import (
    ScenarioComparisonResult,
    ScenarioInput,
    SimulationResult,
)
from backend.engines.system_modeling.model_schema import SystemModel


class CandidateAction(BaseModel):
    """A candidate strategy or operator-provided action."""

    id: str
    description: str


class DecisionWeights(BaseModel):
    """Configurable weighted scoring inputs for decision ranking."""

    stability_weight: float = 0.4
    resilience_weight: float = 0.3
    cost_weight: float = 0.2
    risk_weight: float = 0.1


class StrategyEvaluation(BaseModel):
    """Evaluation for one candidate strategy."""

    id: str
    description: str
    expected_outcome: str
    risk: float = Field(ge=0.0, le=1.0)
    cost: float = Field(ge=0.0, le=1.0)
    stability_score: float = Field(ge=0.0, le=1.0)
    resilience_score: float = Field(ge=0.0, le=1.0)
    decision_score: float
    unintended_consequences: list[str] = Field(default_factory=list)
    simulation: SimulationResult


class RecommendedAction(BaseModel):
    """Recommended strategy selected by the decision engine."""

    id: str
    reason: str


class RiskAnalysis(BaseModel):
    """Aggregated system risk signals and fragility context."""

    baseline_risk: float = Field(ge=0.0, le=1.0)
    baseline_stability: float = Field(ge=0.0, le=1.0)
    fragility_count: int = Field(ge=0)
    conflict_count: int = Field(ge=0)
    event_count: int = Field(ge=0)
    primary_fragilities: list[str] = Field(default_factory=list)


class DecisionAnalysis(BaseModel):
    """Full strategic decision analysis output."""

    decision_summary: str
    strategies: list[StrategyEvaluation] = Field(default_factory=list)
    recommended_action: RecommendedAction | None = None
    scenario_comparison: ScenarioComparisonResult | None = None
    system_insights: list[str] = Field(default_factory=list)
    risk_analysis: RiskAnalysis
    metadata: dict[str, Any] = Field(default_factory=dict)


class DecisionAnalysisRequest(BaseModel):
    """Input wrapper for strategic decision analysis."""

    system_model: SystemModel
    simulation: SimulationResult
    candidate_actions: list[CandidateAction] = Field(default_factory=list)
    weights: DecisionWeights = Field(default_factory=DecisionWeights)
    scenario: ScenarioInput = Field(default_factory=ScenarioInput)
