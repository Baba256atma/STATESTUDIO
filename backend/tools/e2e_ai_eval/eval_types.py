"""Typed evaluation case and observation models for end-to-end AI routing checks."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field

from app.schemas.ai import AIResponse, ModelSelectionResult
from app.schemas.audit import AuditEvent
from app.services.ai.privacy_types import PrivacyClassificationResult
from app.services.ai.routing_types import RoutingDecision


class ProviderScenario(BaseModel):
    """Deterministic provider behavior used during evaluation."""

    provider: str
    kind: Literal["local", "cloud"]
    available: bool = True
    enabled: bool = True
    configured: bool = True
    models: list[str] = Field(default_factory=list)
    response_payload: dict[str, Any] | list[Any] | None = None
    execution_error_code: str | None = None
    execution_error_message: str | None = None
    latency_ms: float = Field(default=5.0, ge=0.0)
    metadata: dict[str, Any] = Field(default_factory=dict)


class EvaluationCase(BaseModel):
    """Expected behavior for a full end-to-end orchestration scenario."""

    case_id: str
    task_type: str
    input_text: str
    context: dict[str, Any] = Field(default_factory=dict)
    metadata: dict[str, Any] = Field(default_factory=dict)
    expected_sensitivity_level: str
    expected_privacy_mode: str
    expected_cloud_allowed: bool
    expected_local_required: bool
    expected_provider: str | None
    expected_fallback_behavior: bool = False
    expected_response_valid: bool = True
    expected_benchmark_used: bool = False
    expected_selected_model: str | None = None
    expected_audit_stages: list[str] = Field(default_factory=list)
    provider_scenarios: list[ProviderScenario] = Field(default_factory=list)
    benchmark_summary: list[dict[str, Any]] = Field(default_factory=list)
    notes: str | None = None


class ObservedEvaluationState(BaseModel):
    """Observed system behavior captured from a single evaluation case run."""

    case_id: str
    trace_id: str
    task_type: str
    privacy_result: PrivacyClassificationResult
    routing_decision: RoutingDecision
    selection_result: ModelSelectionResult
    response: AIResponse
    response_valid: bool
    selected_provider: str | None
    selected_model: str | None
    fallback_used: bool
    benchmark_used: bool
    latency_ms: float | None = None
    audit_events: list[AuditEvent] = Field(default_factory=list)
    audit_stages: list[str] = Field(default_factory=list)
