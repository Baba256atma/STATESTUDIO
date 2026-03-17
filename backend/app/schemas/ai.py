"""Typed schemas for the Nexora local AI layer."""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, ConfigDict, Field, field_validator


class RiskSignal(BaseModel):
    """A normalized risk or instability signal extracted from AI output."""

    key: str
    label: str | None = None
    score: float = Field(default=0.0, ge=0.0, le=1.0)
    confidence: float = Field(default=0.5, ge=0.0, le=1.0)
    weight: float = Field(default=1.0, ge=0.0, le=1.0)
    metadata: dict[str, Any] = Field(default_factory=dict)


class ObjectCandidate(BaseModel):
    """A candidate system object identified during AI reasoning."""

    object_id: str
    label: str | None = None
    object_type: str | None = None
    score: float = Field(default=0.0, ge=0.0, le=1.0)
    confidence: float = Field(default=0.5, ge=0.0, le=1.0)
    weight: float = Field(default=1.0, ge=0.0, le=1.0)
    metadata: dict[str, Any] = Field(default_factory=dict)


class AIRequest(BaseModel):
    """Generic input payload for local or future provider-backed AI requests."""

    text: str = Field(..., min_length=1, max_length=8000)
    model: str | None = None
    history: list[str] | None = None
    context: dict[str, Any] | None = None
    trace_id: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)

    @field_validator("text")
    @classmethod
    def _normalize_text(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("text must not be empty")
        return normalized

    @field_validator("model")
    @classmethod
    def _normalize_model(cls, value: str | None) -> str | None:
        if value is None:
            return None
        normalized = value.strip()
        return normalized or None


class AIResponse(BaseModel):
    """Generic structured AI response."""

    ok: bool = True
    provider: str = "ollama"
    model: str = "unknown"
    output: str = ""
    summary: str | None = None
    risk_signals: list[RiskSignal] = Field(default_factory=list)
    object_candidates: list[ObjectCandidate] = Field(default_factory=list)
    trace_id: str | None = None
    raw_model: str | None = None
    latency_ms: float | None = Field(default=None, ge=0.0)
    metadata: dict[str, Any] = Field(default_factory=dict)


class SystemModelObject(BaseModel):
    """A system object extracted from a problem description."""

    id: str
    type: str
    name: str
    description: str


class SystemModelSignal(BaseModel):
    """A measurable signal relevant to the system model."""

    id: str
    name: str
    type: str
    description: str | None = None


class SystemModelRelationship(BaseModel):
    """A directed relationship between system objects or signals."""

    model_config = ConfigDict(populate_by_name=True)

    from_object: str = Field(alias="from")
    to_object: str = Field(alias="to")
    type: str
    description: str | None = None


class SystemFeedbackLoop(BaseModel):
    """A reinforcing or balancing feedback loop within the system."""

    name: str
    type: str
    path: list[str] = Field(default_factory=list)


class SystemConflict(BaseModel):
    """A tradeoff or conflict surfaced by the system model."""

    name: str
    actors: list[str] = Field(default_factory=list)
    tradeoff: list[str] = Field(default_factory=list)


class SystemFragilityPoint(BaseModel):
    """A fragile part of the system that can trigger outsized degradation."""

    signal: str
    threshold: str
    description: str | None = None


class SystemScenarioInput(BaseModel):
    """A scenario variable derived from the system model."""

    id: str
    name: str
    signal: str
    baseline: str
    stress_case: str


class SystemModel(BaseModel):
    """Machine-readable system model for downstream analysis and simulation."""

    problem_summary: str
    objects: list[SystemModelObject] = Field(default_factory=list)
    signals: list[SystemModelSignal] = Field(default_factory=list)
    relationships: list[SystemModelRelationship] = Field(default_factory=list)
    loops: list[SystemFeedbackLoop] = Field(default_factory=list)
    conflicts: list[SystemConflict] = Field(default_factory=list)
    fragility_points: list[SystemFragilityPoint] = Field(default_factory=list)
    scenario_inputs: list[SystemScenarioInput] = Field(default_factory=list)


class SystemModelRequest(AIRequest):
    """Request payload for building a structured system model."""


class SystemModelResponse(BaseModel):
    """Structured response for the universal system-modeling engine."""

    ok: bool = True
    system_model: SystemModel
    trace_id: str | None = None
    latency_ms: float | None = Field(default=None, ge=0.0)
    metadata: dict[str, Any] = Field(default_factory=dict)


class ModelInfo(BaseModel):
    """Metadata describing a local or remote AI model."""

    name: str
    provider: str = "ollama"
    available: bool = True
    family: str | None = None
    size: str | None = None
    context_window: int | None = Field(default=None, ge=1)
    metadata: dict[str, Any] = Field(default_factory=dict)


class ProviderInfo(BaseModel):
    """Descriptor for an AI provider exposed through diagnostics."""

    key: str
    kind: str
    enabled: bool = True
    configured: bool = True
    default_model: str | None = None
    base_url: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class ModelCapabilityProfile(BaseModel):
    """Capability profile used by the model selection engine."""

    model: str
    provider: str = "ollama"
    supports_json: bool = True
    reasoning_score: float = Field(default=0.7, ge=0.0, le=1.0)
    speed_score: float = Field(default=0.7, ge=0.0, le=1.0)
    extraction_score: float = Field(default=0.7, ge=0.0, le=1.0)
    enabled: bool = True
    latency_class: str = "balanced"
    quality_class: str = "balanced"
    metadata: dict[str, Any] = Field(default_factory=dict)


class BenchmarkModelPreference(BaseModel):
    """Normalized benchmark summary metrics for a single model."""

    model: str
    avg_latency_ms: float | None = Field(default=None, ge=0.0)
    success_rate: float = Field(default=0.0, ge=0.0, le=1.0)
    json_valid_rate: float = Field(default=0.0, ge=0.0, le=1.0)
    avg_objects_detected: float = Field(default=0.0, ge=0.0)
    avg_risk_signals: float = Field(default=0.0, ge=0.0)
    avg_confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    metadata: dict[str, Any] = Field(default_factory=dict)


class ModelSelectionRequest(BaseModel):
    """Input payload for selecting a model for a local AI task."""

    task_type: str
    provider: str = "ollama"
    requested_model: str | None = None
    available_models: list[str] = Field(default_factory=list)
    latency_sensitive: bool = False
    quality_policy: str = "balanced"
    metadata: dict[str, Any] = Field(default_factory=dict)

    @field_validator("task_type")
    @classmethod
    def _normalize_task_type(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("task_type must not be empty")
        return normalized

    @field_validator("quality_policy")
    @classmethod
    def _normalize_quality_policy(cls, value: str) -> str:
        normalized = value.strip().lower()
        return normalized or "balanced"


class ModelSelectionResult(BaseModel):
    """Resolved model selection decision for a local AI task."""

    task_type: str
    selected_model: str
    model_class: str
    strategy: str = "task_policy"
    provider: str = "ollama"
    reason: str
    fallback_used: bool = False
    benchmark_used: bool = False
    metadata: dict[str, Any] = Field(default_factory=dict)


class ModelSelectionDebugRequest(BaseModel):
    """Diagnostic request payload for local AI model selection."""

    task_type: str
    context: dict[str, Any] | None = None
    requested_model: str | None = None
    latency_sensitive: bool = False
    quality_policy: str = "balanced"
    metadata: dict[str, Any] = Field(default_factory=dict)

    @field_validator("task_type")
    @classmethod
    def _normalize_debug_task_type(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("task_type must not be empty")
        return normalized

    @field_validator("requested_model")
    @classmethod
    def _normalize_requested_model(cls, value: str | None) -> str | None:
        if value is None:
            return None
        normalized = value.strip()
        return normalized or None

    @field_validator("quality_policy")
    @classmethod
    def _normalize_debug_quality_policy(cls, value: str) -> str:
        normalized = value.strip().lower()
        return normalized or "balanced"


class ModelSelectionDebugResponse(BaseModel):
    """Diagnostic response payload for local AI model selection."""

    selected_model: str
    selection_reason: str
    fallback_used: bool = False
    benchmark_used: bool = False
    model_class: str
    strategy: str = "task_policy"
    metadata: dict[str, Any] = Field(default_factory=dict)


class SelectionHistoryEntry(BaseModel):
    """Compact selection history entry for diagnostics."""

    task_type: str
    selected_model: str
    fallback_used: bool = False
    timestamp: str
    latency_bucket: str | None = None


class SelectionStatsResponse(BaseModel):
    """Aggregated in-memory model selection metrics."""

    total_selections: int = 0
    selections_by_model: dict[str, int] = Field(default_factory=dict)
    selections_by_task: dict[str, int] = Field(default_factory=dict)
    fallback_rate: float = Field(default=0.0, ge=0.0, le=1.0)
    selections_by_latency_bucket: dict[str, int] = Field(default_factory=dict)
    recent_history: list[SelectionHistoryEntry] = Field(default_factory=list)


class ProviderHealthEntry(BaseModel):
    """Compact provider health entry used by diagnostics."""

    provider: str
    available: bool = False
    default_model: str | None = None
    latency_ms: float | None = Field(default=None, ge=0.0)
    error: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class ProviderListResponse(BaseModel):
    """List of registered AI providers."""

    ok: bool = True
    default_provider: str
    fallback_provider: str | None = None
    providers: list[ProviderInfo] = Field(default_factory=list)


class ProviderHealthListResponse(BaseModel):
    """Aggregated provider health status response."""

    ok: bool = True
    default_provider: str
    fallback_provider: str | None = None
    providers: list[ProviderHealthEntry] = Field(default_factory=list)


class HealthResponse(BaseModel):
    """Health status for an AI provider integration."""

    ok: bool = True
    provider: str = "ollama"
    available: bool = False
    base_url: str | None = None
    default_model: str | None = None
    trace_id: str | None = None
    latency_ms: float | None = Field(default=None, ge=0.0)
    metadata: dict[str, Any] = Field(default_factory=dict)


class LocalAIModelsResponse(BaseModel):
    """Model list response for the local AI layer."""

    ok: bool = True
    provider: str = "ollama"
    models: list[ModelInfo] = Field(default_factory=list)
    trace_id: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class LocalAIAnalyzeRequest(AIRequest):
    """Backward-compatible request payload for local analysis."""


class LocalAIChatRequest(AIRequest):
    """Backward-compatible request payload for local chat."""


LocalAIHealthResponse = HealthResponse
LocalAIModelInfo = ModelInfo
LocalAIResponse = AIResponse
