"""Routes for the Nexora local AI layer."""

from __future__ import annotations

from fastapi import APIRouter, Body, Depends, HTTPException, Request, status

from app.schemas.ai import (
    LocalAIAnalyzeRequest,
    LocalAIHealthResponse,
    LocalAIModelsResponse,
    LocalAIResponse,
    ModelSelectionDebugRequest,
    ModelSelectionDebugResponse,
    ProviderHealthListResponse,
    ProviderListResponse,
    SelectionStatsResponse,
    SystemModelRequest,
    SystemModelResponse,
)
from app.schemas.audit import (
    AuditEventListResponse,
    AuditPolicyDecisionsResponse,
    AuditPolicyResponse,
)
from app.schemas.telemetry import (
    PipelineTraceListResponse,
    TelemetryEventListResponse,
    TelemetryMetricsResponse,
    TelemetryStageListResponse,
)
from app.schemas.privacy import (
    PrivacyClassificationRequest,
    PrivacyClassificationResult,
    PrivacyPolicyResponse as PrivacyClassificationPolicyResponse,
)
from app.routers.ai_control_plane import router as ai_control_plane_router
from app.services.ai.orchestrator import LocalAIOrchestrator
from app.services.ai.routing_types import RoutingDecision, RoutingDecisionRequest, RoutingPolicyResponse


router = APIRouter(prefix="/ai/local", tags=["ai-local"])
router.include_router(ai_control_plane_router)

_ANALYZE_EXAMPLE = {
    "basic": {
        "summary": "Analyze a business disruption scenario",
        "value": {
            "text": "A supplier delay is increasing delivery pressure and customer risk.",
            "context": {
                "domain": "business",
                "task": "scenario_analysis",
            },
            "metadata": {
                "task": "analyze_scenario",
            },
        },
    }
}

_SELECT_MODEL_EXAMPLE = {
    "basic": {
        "summary": "Resolve the preferred model for a reasoning task",
        "value": {
            "task_type": "analyze_scenario",
            "context": {
                "domain": "operations",
                "priority": "normal",
            },
            "latency_sensitive": False,
            "quality_policy": "balanced",
        },
    }
}

_ROUTING_EXAMPLE = {
    "basic": {
        "summary": "Evaluate a routing decision for a privacy-sensitive task",
        "value": {
            "task_type": "analyze_scenario",
            "privacy_sensitive": True,
            "latency_sensitive": False,
            "cloud_permitted": False,
        },
    }
}

_PRIVACY_EXAMPLE = {
    "basic": {
        "summary": "Classify a potentially sensitive AI request",
        "value": {
            "task_type": "analyze_scenario",
            "text": "Review internal supplier delivery delays and revenue forecast exposure.",
            "contains_uploaded_content": False,
            "metadata": {"privacy_sensitive": True},
            "context": {"workspace": "operations"},
        },
    }
}

_SYSTEM_MODEL_EXAMPLE = {
    "basic": {
        "summary": "Build a structured system model from a complex problem",
        "value": {
            "text": "Supply chain delays are increasing costs and reducing customer satisfaction. Suppliers are unreliable and inventory shortages create panic orders.",
            "context": {
                "domain": "operations",
            },
            "metadata": {
                "task": "model_system",
            },
        },
    }
}

_AUDIT_RECENT_EXAMPLE = {
    "basic": {
        "summary": "Inspect recent audit records",
        "value": {},
    }
}

_TELEMETRY_TRACE_EXAMPLE = {
    "basic": {
        "summary": "Inspect recent telemetry traces",
        "value": {},
    }
}


def get_local_ai_orchestrator() -> LocalAIOrchestrator:
    """Return the shared local AI orchestrator."""
    return LocalAIOrchestrator()


def _raise_service_unavailable(message: str) -> None:
    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail={
            "ok": False,
            "error": {
                "type": "AI_LOCAL_UNAVAILABLE",
                "message": message,
            },
        },
    )


def _is_provider_unavailable(error_code: str | None) -> bool:
    return error_code in {"provider_unavailable", "provider_timeout", "provider_http_error"}


@router.get(
    "/telemetry/metrics",
    response_model=TelemetryMetricsResponse,
    summary="Inspect telemetry metrics",
    description="Returns aggregated in-memory telemetry metrics for the AI orchestration pipeline.",
)
async def local_ai_telemetry_metrics(
    orchestrator: LocalAIOrchestrator = Depends(get_local_ai_orchestrator),
) -> TelemetryMetricsResponse:
    """Return aggregated telemetry metrics."""
    try:
        return orchestrator.get_telemetry_metrics()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_TELEMETRY_METRICS_ERROR",
                    "message": "AI telemetry metrics are currently unavailable.",
                },
            },
        )


@router.get(
    "/telemetry/traces",
    response_model=PipelineTraceListResponse,
    summary="Inspect telemetry traces",
    description="Returns grouped telemetry traces for recent AI orchestration requests.",
)
async def local_ai_telemetry_traces(
    trace_id: str | None = None,
    limit: int | None = 50,
    orchestrator: LocalAIOrchestrator = Depends(get_local_ai_orchestrator),
) -> PipelineTraceListResponse:
    """Return grouped telemetry traces."""
    try:
        return orchestrator.get_telemetry_traces(trace_id=trace_id, limit=limit)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_TELEMETRY_TRACES_ERROR",
                    "message": "AI telemetry traces are currently unavailable.",
                },
            },
        )


@router.get(
    "/telemetry/stages",
    response_model=TelemetryStageListResponse,
    summary="Inspect stage telemetry",
    description="Returns aggregated stage latency and success telemetry for the AI pipeline.",
)
async def local_ai_telemetry_stages(
    orchestrator: LocalAIOrchestrator = Depends(get_local_ai_orchestrator),
) -> TelemetryStageListResponse:
    """Return aggregated stage telemetry metrics."""
    try:
        return orchestrator.get_telemetry_stage_metrics()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_TELEMETRY_STAGES_ERROR",
                    "message": "AI telemetry stage metrics are currently unavailable.",
                },
            },
        )


@router.get(
    "/telemetry/events",
    response_model=TelemetryEventListResponse,
    summary="Inspect telemetry events",
    description="Returns filtered raw telemetry events for internal diagnostics.",
)
async def local_ai_telemetry_events(
    trace_id: str | None = None,
    stage: str | None = None,
    task_type: str | None = None,
    limit: int | None = 100,
    orchestrator: LocalAIOrchestrator = Depends(get_local_ai_orchestrator),
) -> TelemetryEventListResponse:
    """Return filtered telemetry events."""
    try:
        return orchestrator.get_telemetry_events(
            trace_id=trace_id,
            stage=stage,
            task_type=task_type,
            limit=limit,
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_TELEMETRY_EVENTS_ERROR",
                    "message": "AI telemetry events are currently unavailable.",
                },
            },
        )


@router.get(
    "/audit/policy",
    response_model=AuditPolicyResponse,
    summary="Inspect audit policy",
    description="Returns the active audit trail logging configuration used by the local orchestration layer.",
)
async def local_ai_audit_policy(
    orchestrator: LocalAIOrchestrator = Depends(get_local_ai_orchestrator),
) -> AuditPolicyResponse:
    """Return the active audit logging policy snapshot."""
    try:
        return orchestrator.get_audit_policy()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_AUDIT_POLICY_ERROR",
                    "message": "AI audit policy diagnostics are currently unavailable.",
                },
            },
        )


@router.get(
    "/audit/events",
    response_model=AuditEventListResponse,
    summary="List audit events",
    description="Returns filtered AI audit events for internal diagnostics.",
)
async def local_ai_audit_events(
    trace_id: str | None = None,
    stage: str | None = None,
    task_type: str | None = None,
    limit: int | None = 100,
    orchestrator: LocalAIOrchestrator = Depends(get_local_ai_orchestrator),
) -> AuditEventListResponse:
    """Return filtered audit events."""
    try:
        return orchestrator.get_audit_events(
            trace_id=trace_id,
            stage=stage,
            task_type=task_type,
            limit=limit,
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_AUDIT_EVENTS_ERROR",
                    "message": "AI audit events are currently unavailable.",
                },
            },
        )


@router.get(
    "/audit/recent",
    response_model=AuditEventListResponse,
    summary="List recent audit events",
    description="Returns recent AI audit events for internal diagnostics.",
)
async def local_ai_audit_recent(
    limit: int = 50,
    orchestrator: LocalAIOrchestrator = Depends(get_local_ai_orchestrator),
) -> AuditEventListResponse:
    """Return recent audit events."""
    try:
        return orchestrator.get_recent_audit_events(limit=limit)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_AUDIT_RECENT_ERROR",
                    "message": "Recent AI audit events are currently unavailable.",
                },
            },
        )


@router.get(
    "/audit/policy-decisions",
    response_model=AuditPolicyDecisionsResponse,
    summary="List audit policy decisions",
    description="Returns privacy, routing, provider, model, and fallback policy decision events.",
)
async def local_ai_audit_policy_decisions(
    trace_id: str | None = None,
    task_type: str | None = None,
    limit: int | None = 100,
    orchestrator: LocalAIOrchestrator = Depends(get_local_ai_orchestrator),
) -> AuditPolicyDecisionsResponse:
    """Return policy decision audit events."""
    try:
        return orchestrator.get_policy_decision_events(
            trace_id=trace_id,
            task_type=task_type,
            limit=limit,
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_AUDIT_POLICY_DECISIONS_ERROR",
                    "message": "AI audit policy decisions are currently unavailable.",
                },
            },
        )


@router.get(
    "/privacy/policy",
    response_model=PrivacyClassificationPolicyResponse,
    summary="Inspect privacy policy",
    description="Returns the active deterministic privacy classification policy used before routing.",
)
async def local_ai_privacy_policy(
    orchestrator: LocalAIOrchestrator = Depends(get_local_ai_orchestrator),
) -> PrivacyClassificationPolicyResponse:
    """Return the active privacy classification policy snapshot."""
    try:
        return orchestrator.get_privacy_policy()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_PRIVACY_POLICY_ERROR",
                    "message": "AI privacy policy diagnostics are currently unavailable.",
                },
            },
        )


@router.post(
    "/privacy/classify",
    response_model=PrivacyClassificationResult,
    summary="Classify privacy sensitivity",
    description="Returns the deterministic privacy classification for a request without executing routing or inference.",
)
async def local_ai_privacy_classify(
    payload: PrivacyClassificationRequest = Body(..., openapi_examples=_PRIVACY_EXAMPLE),
    orchestrator: LocalAIOrchestrator = Depends(get_local_ai_orchestrator),
) -> PrivacyClassificationResult:
    """Return the privacy classification for a local AI request."""
    try:
        return orchestrator.classify_privacy(payload)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_PRIVACY_CLASSIFICATION_ERROR",
                    "message": "AI privacy classification is currently unavailable.",
                },
            },
        )


@router.get(
    "/routing/policy",
    response_model=RoutingPolicyResponse,
    summary="Inspect routing policy",
    description="Returns the active deterministic routing policy configuration used by the local orchestration layer.",
)
async def local_ai_routing_policy(
    orchestrator: LocalAIOrchestrator = Depends(get_local_ai_orchestrator),
) -> RoutingPolicyResponse:
    """Return the active hybrid routing policy snapshot."""
    try:
        return orchestrator.get_routing_policy()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_ROUTING_POLICY_ERROR",
                    "message": "AI routing policy diagnostics are currently unavailable.",
                },
            },
        )


@router.post(
    "/routing/decide",
    response_model=RoutingDecision,
    summary="Compute routing decision",
    description="Returns the provider routing decision for a task without executing the request.",
)
async def local_ai_routing_decide(
    payload: RoutingDecisionRequest = Body(..., openapi_examples=_ROUTING_EXAMPLE),
    orchestrator: LocalAIOrchestrator = Depends(get_local_ai_orchestrator),
) -> RoutingDecision:
    """Return the provider routing decision for a local AI task."""
    try:
        return await orchestrator.decide_routing(payload)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_ROUTING_DECISION_ERROR",
                    "message": "AI routing decision is currently unavailable.",
                },
            },
        )


@router.get(
    "/providers",
    response_model=ProviderListResponse,
    summary="List AI providers",
    description="Returns the registered AI providers available to the local orchestration layer.",
)
async def local_ai_providers(
    orchestrator: LocalAIOrchestrator = Depends(get_local_ai_orchestrator),
) -> ProviderListResponse:
    """Return registered AI provider metadata."""
    try:
        return orchestrator.list_providers()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_PROVIDER_LIST_ERROR",
                    "message": "AI provider diagnostics are currently unavailable.",
                },
            },
        )


@router.get(
    "/providers/health",
    response_model=ProviderHealthListResponse,
    summary="Check AI provider health",
    description="Returns compact health information for registered AI providers.",
)
async def local_ai_provider_health(
    orchestrator: LocalAIOrchestrator = Depends(get_local_ai_orchestrator),
) -> ProviderHealthListResponse:
    """Return compact health information for registered AI providers."""
    try:
        return await orchestrator.get_provider_health()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_PROVIDER_HEALTH_ERROR",
                    "message": "AI provider health diagnostics are currently unavailable.",
                },
            },
        )


@router.get(
    "/health",
    response_model=LocalAIHealthResponse,
    summary="Check local AI provider health",
    description="Returns the availability and configuration status of the local AI provider used by Nexora.",
)
async def local_ai_health(
    request: Request,
    orchestrator: LocalAIOrchestrator = Depends(get_local_ai_orchestrator),
) -> LocalAIHealthResponse:
    """Return health information for the local AI provider."""
    try:
        response = await orchestrator.get_health()
        response.trace_id = request.headers.get("x-trace-id")
        return response
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_LOCAL_HEALTH_ERROR",
                    "message": "Local AI health check is currently unavailable.",
                },
            },
        )


@router.get(
    "/models",
    response_model=LocalAIModelsResponse,
    summary="List local AI models",
    description="Returns the local models currently exposed by the configured provider.",
)
async def local_ai_models(
    request: Request,
    orchestrator: LocalAIOrchestrator = Depends(get_local_ai_orchestrator),
) -> LocalAIModelsResponse:
    """Return the currently available local models."""
    try:
        health = await orchestrator.get_health()
        if not health.available:
            _raise_service_unavailable("Local AI provider is unavailable.")
        response = await orchestrator.list_models()
        response.trace_id = request.headers.get("x-trace-id")
        return response
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_LOCAL_MODELS_ERROR",
                    "message": "Local AI models are currently unavailable.",
                },
            },
        )


@router.post(
    "/analyze",
    response_model=LocalAIResponse,
    summary="Run local AI semantic analysis",
    description=(
        "Runs a structured local analysis task and returns semantic data only. "
        "The model does not control scene actions."
    ),
)
async def local_ai_analyze(
    request: Request,
    payload: LocalAIAnalyzeRequest = Body(..., openapi_examples=_ANALYZE_EXAMPLE),
    orchestrator: LocalAIOrchestrator = Depends(get_local_ai_orchestrator),
) -> LocalAIResponse:
    """Run a local analysis request."""
    payload.trace_id = payload.trace_id or request.headers.get("x-trace-id")
    try:
        response = await orchestrator.analyze_local(payload)
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_LOCAL_ANALYZE_ERROR",
                    "message": "Local AI analysis failed.",
                },
            },
        )

    provider_error = response.metadata.get("provider_error") if isinstance(response.metadata, dict) else None
    if not response.ok and _is_provider_unavailable(provider_error):
        _raise_service_unavailable("Local AI provider is unavailable.")

    return response


@router.post(
    "/system-model",
    response_model=SystemModelResponse,
    summary="Build a universal system model",
    description=(
        "Transforms a natural language problem description into a machine-readable "
        "system model containing objects, signals, relationships, loops, conflicts, "
        "fragility points, and scenario inputs."
    ),
)
async def local_ai_system_model(
    request: Request,
    payload: SystemModelRequest = Body(..., openapi_examples=_SYSTEM_MODEL_EXAMPLE),
    orchestrator: LocalAIOrchestrator = Depends(get_local_ai_orchestrator),
) -> SystemModelResponse:
    """Build a structured system model."""
    payload.trace_id = payload.trace_id or request.headers.get("x-trace-id")
    try:
        return await orchestrator.model_system(payload)
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_SYSTEM_MODEL_ERROR",
                    "message": "System modeling failed.",
                },
            },
        )


@router.post(
    "/select-model",
    response_model=ModelSelectionDebugResponse,
    summary="Select local AI model (diagnostic)",
    description=(
        "Internal-facing diagnostic endpoint that resolves which local AI model "
        "Nexora would choose for a task without running inference."
    ),
)
async def local_ai_select_model(
    payload: ModelSelectionDebugRequest = Body(..., openapi_examples=_SELECT_MODEL_EXAMPLE),
    orchestrator: LocalAIOrchestrator = Depends(get_local_ai_orchestrator),
) -> ModelSelectionDebugResponse:
    """Return the model selection decision for a local AI task."""
    payload.metadata = {**payload.metadata, "local_only": True}
    try:
        selection = await orchestrator.select_model(payload)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_LOCAL_MODEL_SELECTION_ERROR",
                    "message": "Local AI model selection is currently unavailable.",
                },
            },
        )

    return ModelSelectionDebugResponse(
        selected_model=selection.selected_model,
        selection_reason=selection.reason,
        fallback_used=selection.fallback_used,
        benchmark_used=selection.benchmark_used,
        model_class=selection.model_class,
        strategy=selection.strategy,
        metadata=selection.metadata,
    )


@router.get(
    "/selection-stats",
    response_model=SelectionStatsResponse,
    summary="Selection metrics (diagnostic)",
    description=(
        "Internal-facing diagnostic endpoint that returns compact in-memory "
        "model selection metrics and recent selection history."
    ),
)
async def local_ai_selection_stats(
    orchestrator: LocalAIOrchestrator = Depends(get_local_ai_orchestrator),
) -> SelectionStatsResponse:
    """Return aggregated in-memory model selection metrics."""
    try:
        return orchestrator.get_selection_stats()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "ok": False,
                "error": {
                    "type": "AI_LOCAL_SELECTION_STATS_ERROR",
                    "message": "Local AI selection metrics are currently unavailable.",
                },
            },
        )
