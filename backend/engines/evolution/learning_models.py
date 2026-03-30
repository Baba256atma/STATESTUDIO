"""Learning and evolution contracts for Nexora policy adaptation."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class LearningSignal(BaseModel):
    signal_id: str
    signal_type: Literal["policy_boost", "policy_penalty", "confidence_adjustment", "focus_pattern"]
    target_scope: Literal["object", "path", "strategy_kind", "mode", "global"]
    target_key: str
    value: float = Field(ge=-1.0, le=1.0)
    rationale: str
    confidence: float = Field(ge=0.0, le=1.0)
    timestamp: float


class PolicyAdjustment(BaseModel):
    adjustment_id: str
    policy_name: Literal["intelligence", "compare", "strategy_generation"]
    key: str
    delta: float = Field(ge=-0.2, le=0.2)
    reason: str
    confidence: float = Field(ge=0.0, le=1.0)


class EvolutionSummary(BaseModel):
    headline: str
    explanation: str


class EvolutionState(BaseModel):
    active: bool
    learning_signals: list[LearningSignal] = Field(default_factory=list)
    policy_adjustments: list[PolicyAdjustment] = Field(default_factory=list)
    summary: EvolutionSummary
