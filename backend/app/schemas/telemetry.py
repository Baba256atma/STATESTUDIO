"""Typed schemas for AI telemetry events and diagnostics."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field


TelemetryStage = Literal[
    "request_received",
    "canary_assigned",
    "experiment_assigned",
    "privacy_classified",
    "routing_decided",
    "provider_selected",
    "model_selected",
    "provider_execution_started",
    "provider_execution_completed",
    "provider_execution_failed",
    "fallback_applied",
    "response_returned",
]


class TelemetryEvent(BaseModel):
    """Structured telemetry event emitted by the AI orchestration pipeline."""

    trace_id: str
    timestamp: str
    stage: TelemetryStage
    task_type: str | None = None
    provider: str | None = None
    model: str | None = None
    latency_ms: float | None = None
    token_usage: dict[str, int] | None = None
    fallback_used: bool = False
    benchmark_used: bool = False
    routing_reason: str | None = None
    privacy_mode: str | None = None
    sensitivity_level: str | None = None
    success: bool | None = None
    error_code: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class PipelineTrace(BaseModel):
    """Grouped telemetry events for a single orchestration trace."""

    trace_id: str
    task_type: str | None = None
    events: list[TelemetryEvent] = Field(default_factory=list)
    total_latency_ms: float | None = None


class StageMetric(BaseModel):
    """Aggregated stage-level telemetry metric."""

    stage: TelemetryStage
    count: int = 0
    avg_latency_ms: float = 0.0
    success_rate: float = 0.0


class ProviderExecutionMetric(BaseModel):
    """Aggregated provider execution usage metric."""

    provider: str
    request_count: int = 0
    avg_latency_ms: float = 0.0


class ModelExecutionMetric(BaseModel):
    """Aggregated model execution usage metric."""

    model: str
    request_count: int = 0
    avg_latency_ms: float = 0.0


class TelemetryEventListResponse(BaseModel):
    """Telemetry event list response."""

    ok: bool = True
    events: list[TelemetryEvent] = Field(default_factory=list)


class PipelineTraceListResponse(BaseModel):
    """Telemetry trace list response."""

    ok: bool = True
    traces: list[PipelineTrace] = Field(default_factory=list)


class TelemetryStageListResponse(BaseModel):
    """Telemetry stage metric response."""

    ok: bool = True
    stages: list[StageMetric] = Field(default_factory=list)


class TelemetryMetricsResponse(BaseModel):
    """Aggregated telemetry metrics response."""

    ok: bool = True
    total_events: int = 0
    total_traces: int = 0
    average_stage_latency_ms: float = 0.0
    fallback_rate: float = 0.0
    routing_policy_override_rate: float = 0.0
    response_valid_rate: float = 0.0
    privacy_cloud_block_rate: float = 0.0
    provider_usage: list[ProviderExecutionMetric] = Field(default_factory=list)
    model_usage: list[ModelExecutionMetric] = Field(default_factory=list)
    stages: list[StageMetric] = Field(default_factory=list)
