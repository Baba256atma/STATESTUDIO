"""Typed contracts for deterministic strategy generation mode."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field

from engines.scenario_simulation.propagation_models import PropagationObjectGraph
from engines.scenario_simulation.scenario_action_models import ScenarioActionIntent
from engines.system_intelligence.intelligence_models import SystemIntelligenceResult


StrategyGenerationMode = Literal["explore", "optimize", "stress_test"]
StrategyFocus = Literal["risk", "growth", "efficiency", "stability"]


class StrategyGenerationConstraints(BaseModel):
    maxStrategies: int = Field(default=4, ge=1, le=8)
    riskTolerance: float = Field(default=0.5, ge=0.0, le=1.0)
    preferredFocus: StrategyFocus = "risk"


class StrategyGenerationInput(BaseModel):
    intelligence: SystemIntelligenceResult
    currentScenario: dict[str, Any] | None = None
    constraints: StrategyGenerationConstraints = Field(default_factory=StrategyGenerationConstraints)
    mode: StrategyGenerationMode = "explore"
    scene_json: dict[str, Any] | None = None
    object_graph: PropagationObjectGraph | None = None


class GeneratedStrategy(BaseModel):
    strategy_id: str
    title: str
    description: str
    actions: list[ScenarioActionIntent] = Field(default_factory=list)
    expected_focus: str | None = None
    rationale: str


class EvaluatedStrategy(BaseModel):
    strategy: GeneratedStrategy
    intelligence: SystemIntelligenceResult
    score: float = Field(ge=0.0, le=1.0)
    ranking: int = Field(ge=1)
    tradeoffs: list[str] = Field(default_factory=list)
    risk_level: float = Field(ge=0.0, le=1.0)
    expected_impact: float = Field(ge=0.0, le=1.0)


class StrategyGenerationSummary(BaseModel):
    headline: str
    explanation: str
    confidence: float = Field(ge=0.0, le=1.0)


class StrategyGenerationResult(BaseModel):
    strategies: list[EvaluatedStrategy] = Field(default_factory=list)
    recommended_strategy_id: str | None = None
    summary: StrategyGenerationSummary

