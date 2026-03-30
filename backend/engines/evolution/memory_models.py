"""Structured decision memory contracts for Nexora evolution."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field


MemoryMode = Literal["analysis", "simulation", "decision", "compare", "strategy_generation"]
OutcomeStatus = Literal["unknown", "positive", "negative", "mixed"]


class SelectedDecision(BaseModel):
    decision_type: str
    target_id: str | None = None
    note: str | None = None


class PredictedSummary(BaseModel):
    headline: str
    expected_impact: float | None = Field(default=None, ge=0.0, le=1.0)
    expected_risk: float | None = Field(default=None, ge=0.0, le=1.0)


class ObservedOutcome(BaseModel):
    outcome_status: OutcomeStatus = "unknown"
    observed_impact: float | None = Field(default=None, ge=0.0, le=1.0)
    observed_risk: float | None = Field(default=None, ge=0.0, le=1.0)
    note: str | None = None


class ScenarioMemoryRecord(BaseModel):
    record_id: str
    timestamp: float
    scenario_id: str | None = None
    scenario_title: str | None = None
    source_action_ids: list[str] = Field(default_factory=list)
    source_object_ids: list[str] = Field(default_factory=list)
    mode: MemoryMode
    propagation_snapshot: dict[str, Any] | None = None
    decision_path_snapshot: dict[str, Any] | None = None
    intelligence_snapshot: dict[str, Any] | None = None
    comparison_snapshot: dict[str, Any] | None = None
    generated_strategies: list[dict[str, Any]] | None = None
    selected_strategy_id: str | None = None
    selected_decision: SelectedDecision | None = None
    predicted_summary: PredictedSummary | None = None
    observed_outcome: ObservedOutcome | None = None
    tags: list[str] = Field(default_factory=list)


class StrategyMemoryRecord(BaseModel):
    record_id: str
    timestamp: float
    strategy_id: str
    title: str
    rationale: str
    actions: list[dict[str, Any]] = Field(default_factory=list)
    predicted_score: float | None = Field(default=None, ge=0.0, le=1.0)
    chosen: bool = False
    outcome_status: OutcomeStatus = "unknown"


class ComparisonMemoryRecord(BaseModel):
    record_id: str
    timestamp: float
    scenario_a_id: str | None = None
    scenario_b_id: str | None = None
    winner: Literal["A", "B", "tie", "unknown"] = "unknown"
    recommendation: str | None = None
    user_choice: Literal["A", "B", "hybrid", "none", "unknown"] = "unknown"
    confidence: float | None = Field(default=None, ge=0.0, le=1.0)


class MemorySaveRequest(BaseModel):
    scenario_record: ScenarioMemoryRecord | None = None
    strategy_records: list[StrategyMemoryRecord] = Field(default_factory=list)
    comparison_record: ComparisonMemoryRecord | None = None


class OutcomeUpdateRequest(BaseModel):
    record_id: str
    observed_outcome: ObservedOutcome
