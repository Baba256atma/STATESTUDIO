"""Typed result models for the AI routing regression suite."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

from tools.e2e_ai_eval.eval_types import EvaluationCase


RegressionCategory = Literal[
    "privacy",
    "routing",
    "provider",
    "model_selection",
    "fallback",
    "audit",
    "e2e",
]


class RegressionCase(BaseModel):
    """Regression case derived from a deterministic evaluation scenario."""

    case_id: str
    category: RegressionCategory
    description: str
    evaluation_case: EvaluationCase


class RegressionStageResult(BaseModel):
    """Pass or fail result for a single regression stage."""

    stage: str
    passed: bool
    reason: str


class RegressionCaseResult(BaseModel):
    """Structured result for a single regression case."""

    case_id: str
    category: RegressionCategory
    passed: bool
    latency_ms: float | None = None
    fallback_used: bool = False
    selected_provider: str | None = None
    selected_model: str | None = None
    failure_reasons: list[str] = Field(default_factory=list)
    stages: list[RegressionStageResult] = Field(default_factory=list)


class RegressionSummary(BaseModel):
    """Aggregate regression summary for CI and local diagnostics."""

    total_cases: int
    passed_cases: int
    failed_cases: int
    pass_rate: float
    average_latency_ms: float = 0.0
    fallback_case_count: int = 0
    audit_failure_count: int = 0
    stage_failure_counts: dict[str, int] = Field(default_factory=dict)


class RegressionRunResult(BaseModel):
    """Top-level output for a regression suite execution."""

    generated_at: str
    verbose: bool = False
    cases: list[RegressionCaseResult] = Field(default_factory=list)
    summary: RegressionSummary
