"""Result models for end-to-end AI routing evaluation."""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class StageAssertionResult(BaseModel):
    """Deterministic pass/fail result for a single evaluation stage."""

    stage: str
    passed: bool
    reason: str
    expected: dict[str, Any] = Field(default_factory=dict)
    actual: dict[str, Any] = Field(default_factory=dict)


class EvaluationCaseResult(BaseModel):
    """Scored result for a single evaluation case."""

    case_id: str
    passed: bool
    score: float
    privacy_classification_passed: bool
    routing_passed: bool
    provider_selection_passed: bool
    model_selection_passed: bool
    fallback_passed: bool
    response_valid_passed: bool
    audit_passed: bool
    latency_ms: float | None = None
    selected_provider: str | None = None
    selected_model: str | None = None
    fallback_used: bool = False
    benchmark_used: bool = False
    failure_reasons: list[str] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
    stage_assertions: list[StageAssertionResult] = Field(default_factory=list)


class EvaluationScoreSummary(BaseModel):
    """Aggregated summary across a full evaluation run."""

    total_cases: int
    passed_cases: int
    pass_rate: float
    privacy_pass_rate: float
    routing_pass_rate: float
    provider_selection_pass_rate: float
    model_selection_pass_rate: float
    fallback_pass_rate: float
    response_valid_pass_rate: float
    audit_pass_rate: float
    average_latency_ms: float = 0.0


class EvaluationRunResult(BaseModel):
    """Top-level output for a complete evaluation run."""

    started_at: str
    completed_at: str
    mocked_providers: bool = True
    include_audit_checks: bool = True
    output_path: str | None = None
    cases: list[EvaluationCaseResult] = Field(default_factory=list)
    summary: EvaluationScoreSummary
