"""Service orchestration for the local AI layer."""

from __future__ import annotations

import logging
import time
from uuid import uuid4

from app.core.config import LocalAISettings, get_local_ai_settings
from app.schemas.ai import (
    AIRequest,
    AIResponse,
    HealthResponse,
    LocalAIAnalyzeRequest,
    LocalAIChatRequest,
    LocalAIModelsResponse,
    ModelSelectionDebugRequest,
    ModelSelectionResult,
    ModelSelectionRequest,
    ProviderHealthEntry,
    ProviderHealthListResponse,
    ProviderInfo,
    ProviderListResponse,
    SelectionStatsResponse,
    SystemModelRequest,
    SystemModelResponse,
)
from app.schemas.audit import (
    AuditEventListResponse,
    AuditPolicyDecisionsResponse,
    AuditPolicyResponse as AuditLoggingPolicyResponse,
)
from app.schemas.telemetry import (
    PipelineTraceListResponse,
    TelemetryEventListResponse,
    TelemetryMetricsResponse,
    TelemetryStageListResponse,
)
from app.services.ai.audit_logger import AIAuditLogger
from app.services.ai.model_selection_engine import LocalAIModelSelectionEngine
from app.services.ai.ollama_client import OllamaClient
from app.services.ai.privacy_classifier import PrivacyClassifier
from app.services.ai.privacy_types import (
    PrivacyClassificationRequest,
    PrivacyClassificationResult,
    PrivacyPolicyResponse,
)
from app.services.ai.provider_selection import resolve_requested_provider
from app.services.ai.prompt_builder import AITaskType, build_task_prompt
from app.services.ai.providers.base import AIProvider
from app.services.ai.providers.exceptions import AIProviderError
from app.services.ai.providers.factory import AIProviderFactory
from app.services.ai.providers.types import ProviderChatRequest, ProviderDescriptor
from app.services.ai.response_mapper import (
    map_ai_response,
    map_health_response,
    map_models_response,
    map_structured_ai_response,
)
from app.services.ai.routing_policy import HybridRoutingPolicy
from app.services.ai.routing_types import (
    RoutingDecision,
    RoutingDecisionRequest,
    RoutingPolicyResponse,
    RoutingProviderState,
)
from app.services.ai.selection_metrics import get_selection_metrics_store
from app.services.ai.telemetry_collector import AITelemetryCollector
from app.services.ai.system_modeling_engine import UniversalSystemModelingEngine
from app.services.ai.validators import require_non_empty_text, validate_structured_output


logger = logging.getLogger("nexora.ai.orchestrator")


class _LegacyClientProviderAdapter(AIProvider):
    """Adapter used to preserve compatibility with legacy client injection."""

    def __init__(self, client: OllamaClient) -> None:
        self._client = client

    @property
    def provider_key(self) -> str:
        return self._client.provider_name

    @property
    def default_model(self) -> str | None:
        return self._client.default_model

    def describe(self) -> ProviderDescriptor:
        return ProviderDescriptor(
            key=self.provider_key,
            kind="local",
            enabled=True,
            configured=True,
            default_model=self.default_model,
        )

    async def health_check(self):
        from app.services.ai.providers.types import ProviderHealthStatus

        return ProviderHealthStatus(**await self._client.health_check())

    async def list_models(self):
        from app.services.ai.providers.types import ProviderModelList

        return ProviderModelList(**await self._client.list_models())

    async def chat_json(self, request: ProviderChatRequest):
        from app.services.ai.providers.types import ProviderChatResponse

        return ProviderChatResponse(
            **await self._client.chat_json(
                messages=request.messages,
                model=request.model,
                system=request.system,
                temperature=request.temperature,
                format_schema=request.format_schema,
                trace_id=request.trace_id,
            )
        )


class LocalAIOrchestrator:
    """Coordinate structured local AI analysis for Nexora."""

    def __init__(
        self,
        settings: LocalAISettings | None = None,
        client: OllamaClient | None = None,
        provider: AIProvider | None = None,
        provider_factory: AIProviderFactory | None = None,
        audit_logger: AIAuditLogger | None = None,
        telemetry_collector: AITelemetryCollector | None = None,
    ) -> None:
        self.settings = settings or get_local_ai_settings()
        self.provider_factory = provider_factory or AIProviderFactory(settings=self.settings)
        self.provider = provider or (_LegacyClientProviderAdapter(client) if client is not None else None)
        self.selection_engine = LocalAIModelSelectionEngine(self.settings)
        self.privacy_classifier = PrivacyClassifier(self.settings)
        self.routing_policy = HybridRoutingPolicy(self.settings)
        self.selection_metrics = get_selection_metrics_store()
        self.audit_logger = audit_logger or AIAuditLogger(self.settings)
        self.telemetry_collector = telemetry_collector or AITelemetryCollector(self.settings)
        self.system_modeling_engine = UniversalSystemModelingEngine()

    async def get_health(self) -> HealthResponse:
        """Return local provider health status."""
        provider = await self._resolve_provider_for_task(task_type="analyze_scenario", metadata=None)
        result = await provider.health_check()
        return map_health_response(
            provider=result.provider,
            base_url=result.base_url or "",
            available=bool(result.available),
            default_model=result.default_model or self.settings.default_model,
        )

    async def list_models(self) -> LocalAIModelsResponse:
        """Return available local model names."""
        if not self.settings.enabled:
            return map_models_response(provider=self.settings.provider, models=[])

        provider = await self._resolve_provider_for_task(task_type="analyze_scenario", metadata=None)
        result = await provider.list_models()
        models = [model.name for model in result.models if model.name]
        return map_models_response(provider=provider.provider_key, models=models)

    async def analyze(self, request: AIRequest) -> AIResponse:
        """Run the structured local AI analysis pipeline.

        The model returns semantic JSON only. Scene decisions stay in the
        deterministic Nexora engine and are not delegated to the model.
        """
        started_at = time.perf_counter()
        text = require_non_empty_text(request.text)
        trace_id = self._resolve_trace_id(request)
        task = self._resolve_task(request)
        metadata = request.metadata if isinstance(request.metadata, dict) else {}
        self._audit(
            trace_id=trace_id,
            stage="request_received",
            task_type=task,
            metadata={"request_metadata": metadata},
            success=True,
        )
        self._telemetry(
            trace_id=trace_id,
            stage="request_received",
            task_type=task,
            latency_ms=0.0,
            success=True,
            metadata={"request_metadata": metadata},
        )
        privacy_started_at = time.perf_counter()
        privacy = self.classify_privacy(
            PrivacyClassificationRequest(
                task_type=task,
                text=text,
                contains_uploaded_content=bool(
                    metadata.get("contains_uploaded_content")
                    or metadata.get("uploaded_document")
                ),
                workspace_privacy_mode=str(metadata.get("workspace_privacy_mode")).strip().lower()
                if metadata.get("workspace_privacy_mode")
                else None,
                metadata=metadata,
                context=request.context if isinstance(request.context, dict) else {},
            )
        )
        self._audit(
            trace_id=trace_id,
            stage="privacy_classified",
            task_type=task,
            privacy_mode=privacy.privacy_mode,
            sensitivity_level=privacy.sensitivity_level,
            decision_reason=privacy.classification_reason,
            policy_tags=privacy.policy_tags,
            success=True,
            metadata={
                "contains_uploaded_content": privacy.contains_uploaded_content,
                "cloud_allowed": privacy.cloud_allowed,
                "local_required": privacy.local_required,
            },
        )
        self._telemetry(
            trace_id=trace_id,
            stage="privacy_classified",
            task_type=task,
            latency_ms=(time.perf_counter() - privacy_started_at) * 1000,
            routing_reason=privacy.classification_reason,
            privacy_mode=privacy.privacy_mode,
            sensitivity_level=privacy.sensitivity_level,
            success=True,
            metadata={
                "contains_uploaded_content": privacy.contains_uploaded_content,
                "cloud_allowed": privacy.cloud_allowed,
                "local_required": privacy.local_required,
            },
        )
        routing_started_at = time.perf_counter()
        routing = await self.decide_routing(
            self._build_routing_request(
                task_type=task,
                metadata=metadata,
                privacy=privacy,
            )
        )
        self._audit(
            trace_id=trace_id,
            stage="routing_decided",
            task_type=task,
            privacy_mode=routing.privacy_mode,
            sensitivity_level=privacy.sensitivity_level,
            selected_provider=routing.selected_provider,
            fallback_used="fallback" in routing.routing_reason.lower(),
            decision_reason=routing.routing_reason,
            policy_tags=privacy.policy_tags,
            success=routing.selected_provider is not None,
            metadata={
                "local_available": routing.local_available,
                "cloud_available": routing.cloud_available,
                "cloud_allowed": routing.cloud_allowed,
                "local_preferred": routing.local_preferred,
            },
        )
        self._telemetry(
            trace_id=trace_id,
            stage="routing_decided",
            task_type=task,
            provider=routing.selected_provider,
            latency_ms=(time.perf_counter() - routing_started_at) * 1000,
            fallback_used="fallback" in routing.routing_reason.lower(),
            routing_reason=routing.routing_reason,
            privacy_mode=routing.privacy_mode,
            sensitivity_level=privacy.sensitivity_level,
            success=routing.selected_provider is not None,
            metadata={
                "local_available": routing.local_available,
                "cloud_available": routing.cloud_available,
                "cloud_allowed": routing.cloud_allowed,
                "local_preferred": routing.local_preferred,
            },
        )
        prompt = build_task_prompt(task, text, request.context)

        if routing.selected_provider is None:
            self._audit(
                trace_id=trace_id,
                stage="response_returned",
                task_type=task,
                privacy_mode=privacy.privacy_mode,
                sensitivity_level=privacy.sensitivity_level,
                decision_reason=routing.routing_reason,
                policy_tags=privacy.policy_tags,
                success=False,
                error_code="no_provider_available",
            )
            self._telemetry(
                trace_id=trace_id,
                stage="response_returned",
                task_type=task,
                latency_ms=(time.perf_counter() - started_at) * 1000,
                routing_reason=routing.routing_reason,
                privacy_mode=privacy.privacy_mode,
                sensitivity_level=privacy.sensitivity_level,
                success=False,
                error_code="no_provider_available",
            )
            return map_ai_response(
                ok=False,
                provider=self.settings.provider,
                model=request.model or self.settings.default_model,
                output="",
                trace_id=trace_id,
                metadata={
                    "task": task,
                    "routing_reason": routing.routing_reason,
                    "routing_fallback_allowed": routing.fallback_allowed,
                    "routing_privacy_mode": routing.privacy_mode,
                    "routing_local_preferred": routing.local_preferred,
                    "routing_cloud_allowed": routing.cloud_allowed,
                    "privacy_sensitivity_level": privacy.sensitivity_level,
                    "privacy_classification_reason": privacy.classification_reason,
                    "privacy_policy_tags": privacy.policy_tags,
                },
            )

        provider = self._get_provider_by_key(routing.selected_provider)
        provider_fallback_used = "fallback" in routing.routing_reason.lower()
        self._audit(
            trace_id=trace_id,
            stage="provider_selected",
            task_type=task,
            privacy_mode=privacy.privacy_mode,
            sensitivity_level=privacy.sensitivity_level,
            selected_provider=provider.provider_key,
            fallback_used=provider_fallback_used,
            decision_reason=routing.routing_reason,
            policy_tags=privacy.policy_tags,
            success=True,
        )
        self._telemetry(
            trace_id=trace_id,
            stage="provider_selected",
            task_type=task,
            provider=provider.provider_key,
            fallback_used=provider_fallback_used,
            routing_reason=routing.routing_reason,
            privacy_mode=privacy.privacy_mode,
            sensitivity_level=privacy.sensitivity_level,
            success=True,
        )
        if provider_fallback_used:
            self._audit(
                trace_id=trace_id,
                stage="fallback_applied",
                task_type=task,
                privacy_mode=privacy.privacy_mode,
                sensitivity_level=privacy.sensitivity_level,
                selected_provider=provider.provider_key,
                fallback_used=True,
                decision_reason=routing.routing_reason,
                policy_tags=privacy.policy_tags,
                success=True,
            )
            self._telemetry(
                trace_id=trace_id,
                stage="fallback_applied",
                task_type=task,
                provider=provider.provider_key,
                fallback_used=True,
                routing_reason=routing.routing_reason,
                privacy_mode=privacy.privacy_mode,
                sensitivity_level=privacy.sensitivity_level,
                success=True,
            )
        selection_started_at = time.perf_counter()
        selection = await self._select_model_for_provider(
            payload=ModelSelectionDebugRequest(
                task_type=task,
                requested_model=request.model,
                latency_sensitive=bool(metadata.get("latency_sensitive")),
                quality_policy=str(metadata.get("quality_policy", "balanced")),
                metadata=metadata,
            ),
            provider=provider,
        )
        logger.info(
            "local_ai_analyze_start trace_id=%s task=%s provider=%s model=%s",
            trace_id,
            task,
            provider.provider_key,
            selection.selected_model,
        )
        self._audit(
            trace_id=trace_id,
            stage="model_selected",
            task_type=task,
            privacy_mode=privacy.privacy_mode,
            sensitivity_level=privacy.sensitivity_level,
            selected_provider=provider.provider_key,
            selected_model=selection.selected_model,
            fallback_used=selection.fallback_used,
            benchmark_used=selection.benchmark_used,
            decision_reason=selection.reason,
            policy_tags=privacy.policy_tags,
            success=True,
            metadata={
                "model_class": selection.model_class,
                "selection_strategy": selection.strategy,
                "selection_metadata": selection.metadata,
            },
        )
        self._telemetry(
            trace_id=trace_id,
            stage="model_selected",
            task_type=task,
            provider=provider.provider_key,
            model=selection.selected_model,
            latency_ms=(time.perf_counter() - selection_started_at) * 1000,
            fallback_used=selection.fallback_used,
            benchmark_used=selection.benchmark_used,
            routing_reason=selection.reason,
            privacy_mode=privacy.privacy_mode,
            sensitivity_level=privacy.sensitivity_level,
            success=True,
            metadata={
                "model_class": selection.model_class,
                "selection_strategy": selection.strategy,
            },
        )

        if not self.settings.enabled:
            self._audit(
                trace_id=trace_id,
                stage="response_returned",
                task_type=task,
                privacy_mode=privacy.privacy_mode,
                sensitivity_level=privacy.sensitivity_level,
                selected_provider=selection.provider,
                selected_model=selection.selected_model,
                fallback_used=selection.fallback_used,
                benchmark_used=selection.benchmark_used,
                decision_reason="AI layer is disabled",
                policy_tags=privacy.policy_tags,
                success=False,
                error_code="disabled",
            )
            self._telemetry(
                trace_id=trace_id,
                stage="response_returned",
                task_type=task,
                provider=selection.provider,
                model=selection.selected_model,
                latency_ms=(time.perf_counter() - started_at) * 1000,
                fallback_used=selection.fallback_used,
                benchmark_used=selection.benchmark_used,
                routing_reason="AI layer is disabled",
                privacy_mode=privacy.privacy_mode,
                sensitivity_level=privacy.sensitivity_level,
                success=False,
                error_code="disabled",
            )
            return map_ai_response(
                ok=False,
                provider=selection.provider,
                model=selection.selected_model,
                output="",
                trace_id=trace_id,
                metadata={
                    "status": "disabled",
                    "task": task,
                    "route_reason": selection.reason,
                    "route_model_class": selection.model_class,
                    "selection_benchmark_used": selection.benchmark_used,
                    "selection_strategy": selection.strategy,
                    "selection_fallback_used": selection.fallback_used,
                    "selected_provider": selection.provider,
                    "routing_reason": routing.routing_reason,
                    "routing_fallback_allowed": routing.fallback_allowed,
                    "routing_privacy_mode": routing.privacy_mode,
                    "privacy_sensitivity_level": privacy.sensitivity_level,
                    "privacy_classification_reason": privacy.classification_reason,
                    "privacy_policy_tags": privacy.policy_tags,
                },
            )

        self._audit(
            trace_id=trace_id,
            stage="provider_execution_started",
            task_type=task,
            privacy_mode=privacy.privacy_mode,
            sensitivity_level=privacy.sensitivity_level,
            selected_provider=provider.provider_key,
            selected_model=selection.selected_model,
            fallback_used=selection.fallback_used,
            benchmark_used=selection.benchmark_used,
            decision_reason="Provider execution started",
            policy_tags=privacy.policy_tags,
            success=True,
        )
        self._telemetry(
            trace_id=trace_id,
            stage="provider_execution_started",
            task_type=task,
            provider=provider.provider_key,
            model=selection.selected_model,
            fallback_used=selection.fallback_used,
            benchmark_used=selection.benchmark_used,
            routing_reason="Provider execution started",
            privacy_mode=privacy.privacy_mode,
            sensitivity_level=privacy.sensitivity_level,
            success=True,
        )
        try:
            result = await provider.chat_json(
                ProviderChatRequest(
                    model=selection.selected_model,
                    messages=[{"role": "user", "content": prompt}],
                    trace_id=trace_id,
                )
            )
        except AIProviderError as exc:
            self._audit(
                trace_id=trace_id,
                stage="provider_execution_failed",
                task_type=task,
                privacy_mode=privacy.privacy_mode,
                sensitivity_level=privacy.sensitivity_level,
                selected_provider=selection.provider,
                selected_model=selection.selected_model,
                fallback_used=selection.fallback_used,
                benchmark_used=selection.benchmark_used,
                decision_reason=selection.reason,
                policy_tags=privacy.policy_tags,
                success=False,
                error_code=exc.code,
                metadata={"provider_error_message": exc.message},
            )
            self._telemetry(
                trace_id=trace_id,
                stage="provider_execution_failed",
                task_type=task,
                provider=selection.provider,
                model=selection.selected_model,
                fallback_used=selection.fallback_used,
                benchmark_used=selection.benchmark_used,
                routing_reason=selection.reason,
                privacy_mode=privacy.privacy_mode,
                sensitivity_level=privacy.sensitivity_level,
                success=False,
                error_code=exc.code,
                metadata={"provider_error_message": exc.message},
            )
            self._audit(
                trace_id=trace_id,
                stage="response_returned",
                task_type=task,
                privacy_mode=privacy.privacy_mode,
                sensitivity_level=privacy.sensitivity_level,
                selected_provider=selection.provider,
                selected_model=selection.selected_model,
                fallback_used=selection.fallback_used,
                benchmark_used=selection.benchmark_used,
                decision_reason=selection.reason,
                policy_tags=privacy.policy_tags,
                success=False,
                error_code=exc.code,
            )
            self._telemetry(
                trace_id=trace_id,
                stage="response_returned",
                task_type=task,
                provider=selection.provider,
                model=selection.selected_model,
                latency_ms=(time.perf_counter() - started_at) * 1000,
                fallback_used=selection.fallback_used,
                benchmark_used=selection.benchmark_used,
                routing_reason=selection.reason,
                privacy_mode=privacy.privacy_mode,
                sensitivity_level=privacy.sensitivity_level,
                success=False,
                error_code=exc.code,
            )
            return map_ai_response(
                ok=False,
                provider=selection.provider,
                model=selection.selected_model,
                output="",
                trace_id=trace_id,
                metadata={
                    "task": task,
                    "selection_reason": selection.reason,
                    "selection_benchmark_used": selection.benchmark_used,
                    "selection_strategy": selection.strategy,
                    "selection_fallback_used": selection.fallback_used,
                    "routing_reason": routing.routing_reason,
                    "routing_fallback_allowed": routing.fallback_allowed,
                    "routing_privacy_mode": routing.privacy_mode,
                    "privacy_sensitivity_level": privacy.sensitivity_level,
                    "privacy_classification_reason": privacy.classification_reason,
                    "privacy_policy_tags": privacy.policy_tags,
                    "provider_error": exc.code,
                    "provider_error_message": exc.message,
                },
            )

        validated = validate_structured_output(result.data)
        total_latency_ms = round((time.perf_counter() - started_at) * 1000, 2)
        logger.info(
            "local_ai_analyze_complete trace_id=%s task=%s provider=%s model=%s ok=%s provider_error=%s validation_error=%s latency_ms=%s",
            trace_id,
            task,
            provider.provider_key,
            selection.selected_model,
            bool(result.ok and validated.ok),
            result.error,
            validated.error,
            total_latency_ms,
        )
        self._audit(
            trace_id=trace_id,
            stage="provider_execution_completed",
            task_type=task,
            privacy_mode=privacy.privacy_mode,
            sensitivity_level=privacy.sensitivity_level,
            selected_provider=provider.provider_key,
            selected_model=selection.selected_model,
            fallback_used=selection.fallback_used,
            benchmark_used=selection.benchmark_used,
            decision_reason=selection.reason,
            policy_tags=privacy.policy_tags,
            success=bool(result.ok and validated.ok),
            error_code=result.error or validated.error,
            metadata={"provider_latency_ms": result.latency_ms},
        )
        self._telemetry(
            trace_id=trace_id,
            stage="provider_execution_completed",
            task_type=task,
            provider=provider.provider_key,
            model=selection.selected_model,
            latency_ms=result.latency_ms,
            fallback_used=selection.fallback_used,
            benchmark_used=selection.benchmark_used,
            routing_reason=selection.reason,
            privacy_mode=privacy.privacy_mode,
            sensitivity_level=privacy.sensitivity_level,
            success=bool(result.ok and validated.ok),
            error_code=result.error or validated.error,
            metadata={"response_valid": validated.ok},
        )
        self._audit(
            trace_id=trace_id,
            stage="response_returned",
            task_type=task,
            privacy_mode=privacy.privacy_mode,
            sensitivity_level=privacy.sensitivity_level,
            selected_provider=provider.provider_key,
            selected_model=selection.selected_model,
            fallback_used=selection.fallback_used,
            benchmark_used=selection.benchmark_used,
            decision_reason=selection.reason,
            policy_tags=privacy.policy_tags,
            success=bool(result.ok and validated.ok),
            error_code=result.error or validated.error,
        )
        self._telemetry(
            trace_id=trace_id,
            stage="response_returned",
            task_type=task,
            provider=provider.provider_key,
            model=selection.selected_model,
            latency_ms=total_latency_ms,
            fallback_used=selection.fallback_used,
            benchmark_used=selection.benchmark_used,
            routing_reason=selection.reason,
            privacy_mode=privacy.privacy_mode,
            sensitivity_level=privacy.sensitivity_level,
            success=bool(result.ok and validated.ok),
            error_code=result.error or validated.error,
            metadata={"response_valid": validated.ok},
        )

        return map_structured_ai_response(
            ok=bool(result.ok and validated.ok),
            provider=provider.provider_key,
            model=selection.selected_model,
            validated=validated.data,
            raw_output=str(result.output or ""),
            raw_model=result.raw_model,
            trace_id=trace_id,
            latency_ms=total_latency_ms,
            metadata={
                "task": task,
                "route_reason": selection.reason,
                "route_model_class": selection.model_class,
                "selection_reason": selection.reason,
                "selection_benchmark_used": selection.benchmark_used,
                "selection_strategy": selection.strategy,
                "selection_fallback_used": selection.fallback_used,
                "selected_provider": provider.provider_key,
                "selection_metadata": selection.metadata,
                "routing_reason": routing.routing_reason,
                "routing_fallback_allowed": routing.fallback_allowed,
                "routing_privacy_mode": routing.privacy_mode,
                "routing_local_preferred": routing.local_preferred,
                "routing_cloud_allowed": routing.cloud_allowed,
                "privacy_mode": privacy.privacy_mode,
                "privacy_sensitivity_level": privacy.sensitivity_level,
                "privacy_cloud_allowed": privacy.cloud_allowed,
                "privacy_local_required": privacy.local_required,
                "privacy_classification_reason": privacy.classification_reason,
                "privacy_policy_tags": privacy.policy_tags,
                "provider_error": result.error,
                "validation_error": validated.error,
                "provider_latency_ms": result.latency_ms,
            },
        )

    async def chat(self, request: LocalAIChatRequest) -> AIResponse:
        """Run a lightweight explanation-oriented chat request."""
        generic_request = AIRequest(
            text=request.text,
            model=request.model,
            history=request.history,
            context=request.context,
            trace_id=request.trace_id,
            metadata={**request.metadata, "task": "explain"},
        )
        return await self.analyze(generic_request)

    async def analyze_local(self, payload: LocalAIAnalyzeRequest) -> AIResponse:
        """Backward-compatible wrapper for the local analysis endpoint."""
        normalized_metadata = dict(payload.metadata)
        normalized_metadata.setdefault("cloud_permitted", False)
        normalized_metadata.setdefault("local_only", True)
        generic_request = AIRequest(
            text=payload.text,
            model=payload.model,
            history=payload.history,
            context=payload.context,
            trace_id=payload.trace_id,
            metadata=normalized_metadata,
        )
        return await self.analyze(generic_request)

    async def model_system(self, payload: SystemModelRequest) -> SystemModelResponse:
        """Build a deterministic machine-readable system model from natural language text."""
        started_at = time.perf_counter()
        text = require_non_empty_text(payload.text)
        trace_id = payload.trace_id or str(uuid4())
        metadata = dict(payload.metadata)
        self._audit(
            trace_id=trace_id,
            stage="request_received",
            task_type="model_system",
            success=True,
            metadata={"request_metadata": metadata},
        )
        self._telemetry(
            trace_id=trace_id,
            stage="request_received",
            task_type="model_system",
            latency_ms=0.0,
            success=True,
            metadata={"request_metadata": metadata},
        )

        system_model = self.system_modeling_engine.build(
            text=text,
            context=payload.context if isinstance(payload.context, dict) else {},
            metadata=metadata,
        )
        latency_ms = round((time.perf_counter() - started_at) * 1000, 2)
        self._audit(
            trace_id=trace_id,
            stage="response_returned",
            task_type="model_system",
            decision_reason="System model generated deterministically.",
            success=True,
            metadata={
                "object_count": len(system_model.objects),
                "signal_count": len(system_model.signals),
                "relationship_count": len(system_model.relationships),
                "loop_count": len(system_model.loops),
            },
        )
        self._telemetry(
            trace_id=trace_id,
            stage="response_returned",
            task_type="model_system",
            latency_ms=latency_ms,
            success=True,
            metadata={
                "object_count": len(system_model.objects),
                "signal_count": len(system_model.signals),
                "relationship_count": len(system_model.relationships),
                "loop_count": len(system_model.loops),
            },
        )
        return SystemModelResponse(
            ok=True,
            system_model=system_model,
            trace_id=trace_id,
            latency_ms=latency_ms,
            metadata={"task": "model_system", "engine": "deterministic_system_modeling"},
        )

    async def select_model(
        self,
        payload: ModelSelectionDebugRequest | ModelSelectionRequest,
    ) -> ModelSelectionResult:
        """Resolve the best model for a task without invoking the provider."""
        task_type = payload.task_type
        privacy = self.classify_privacy(
            PrivacyClassificationRequest(
                task_type=task_type,
                text=None,
                contains_uploaded_content=bool((getattr(payload, "metadata", None) or {}).get("contains_uploaded_content")),
                metadata=getattr(payload, "metadata", None) or {},
                context=getattr(payload, "context", None) or {},
            )
        )
        routing = await self.decide_routing(
            self._build_routing_request(
                task_type=task_type,
                metadata=getattr(payload, "metadata", None) or {},
                privacy=privacy,
            )
        )
        provider_key = routing.selected_provider or self.settings.provider
        provider = self._get_provider_by_key(provider_key)
        selection_result = await self._select_model_for_provider(payload=payload, provider=provider)
        selection_result = selection_result.model_copy(
            update={
                "metadata": {
                    **selection_result.metadata,
                    "routing_reason": routing.routing_reason,
                    "routing_fallback_allowed": routing.fallback_allowed,
                    "routing_privacy_mode": routing.privacy_mode,
                    "privacy_sensitivity_level": privacy.sensitivity_level,
                    "privacy_classification_reason": privacy.classification_reason,
                    "privacy_policy_tags": privacy.policy_tags,
                }
            }
        )
        return selection_result

    async def decide_routing(self, payload: RoutingDecisionRequest) -> RoutingDecision:
        """Return the current provider routing decision for a task."""
        if self.provider is not None:
            return RoutingDecision(
                selected_provider=self.provider.provider_key,
                routing_reason="Injected provider override is active",
                fallback_allowed=False,
                privacy_mode="standard",
                local_preferred=True,
                cloud_allowed=False,
                local_available=True,
                cloud_available=False,
            )

        if not payload.provider_states:
            payload = payload.model_copy(update={"provider_states": await self._collect_provider_states(payload)})

        return self.routing_policy.decide(payload)

    def get_routing_policy(self) -> RoutingPolicyResponse:
        """Return a static description of the active routing policy."""
        return self.routing_policy.describe_policy()

    def classify_privacy(self, payload: PrivacyClassificationRequest) -> PrivacyClassificationResult:
        """Return the privacy classification for a request."""
        return self.privacy_classifier.classify(payload)

    def get_privacy_policy(self) -> PrivacyPolicyResponse:
        """Return a static description of the active privacy classification policy."""
        return self.privacy_classifier.describe_policy()

    def get_audit_policy(self) -> AuditLoggingPolicyResponse:
        """Return a static description of the active audit logging policy."""
        return self.audit_logger.describe_policy()

    def get_audit_events(
        self,
        *,
        trace_id: str | None = None,
        stage: str | None = None,
        task_type: str | None = None,
        limit: int | None = None,
    ) -> AuditEventListResponse:
        """Return filtered audit events."""
        return AuditEventListResponse(
            events=self.audit_logger.list_events(
                trace_id=trace_id,
                stage=stage,
                task_type=task_type,
                limit=limit,
            )
        )

    def get_recent_audit_events(self, limit: int = 50) -> AuditEventListResponse:
        """Return recent audit events."""
        return AuditEventListResponse(events=self.audit_logger.recent(limit=limit))

    def get_policy_decision_events(
        self,
        *,
        trace_id: str | None = None,
        task_type: str | None = None,
        limit: int | None = None,
    ) -> AuditPolicyDecisionsResponse:
        """Return policy decision audit events."""
        return AuditPolicyDecisionsResponse(
            events=self.audit_logger.policy_decisions(
                trace_id=trace_id,
                task_type=task_type,
                limit=limit,
            )
        )

    def get_telemetry_metrics(self) -> TelemetryMetricsResponse:
        """Return aggregated AI telemetry metrics."""
        return self.telemetry_collector.metrics()

    def get_telemetry_traces(
        self,
        *,
        trace_id: str | None = None,
        limit: int | None = None,
    ) -> PipelineTraceListResponse:
        """Return grouped telemetry traces."""
        return self.telemetry_collector.list_traces(trace_id=trace_id, limit=limit)

    def get_telemetry_events(
        self,
        *,
        trace_id: str | None = None,
        stage: str | None = None,
        task_type: str | None = None,
        limit: int | None = None,
    ) -> TelemetryEventListResponse:
        """Return filtered raw telemetry events."""
        return self.telemetry_collector.list_event_response(
            trace_id=trace_id,
            stage=stage,
            task_type=task_type,
            limit=limit,
        )

    def get_telemetry_stage_metrics(self) -> TelemetryStageListResponse:
        """Return stage-only telemetry metrics."""
        return self.telemetry_collector.stage_metrics()

    def get_selection_stats(self) -> SelectionStatsResponse:
        """Return the current in-memory model selection metrics."""
        return self.selection_metrics.snapshot()

    def list_providers(self) -> ProviderListResponse:
        """Return registered provider descriptors."""
        providers = [
            ProviderInfo(
                key=descriptor.key,
                kind=descriptor.kind,
                enabled=descriptor.enabled,
                configured=descriptor.configured,
                default_model=descriptor.default_model,
                base_url=descriptor.base_url,
                metadata=descriptor.metadata,
            )
            for descriptor in (provider.describe() for provider in self.provider_factory.registry().list())
        ]
        return ProviderListResponse(
            default_provider=self.settings.default_provider,
            fallback_provider=self.settings.fallback_provider,
            providers=providers,
        )

    async def get_provider_health(self) -> ProviderHealthListResponse:
        """Return health information for all registered providers."""
        provider_entries: list[ProviderHealthEntry] = []
        for provider in self.provider_factory.registry().list():
            health = await provider.health_check()
            provider_entries.append(
                ProviderHealthEntry(
                    provider=health.provider,
                    available=health.available,
                    default_model=health.default_model,
                    latency_ms=health.latency_ms,
                    error=health.error,
                    metadata=health.metadata,
                )
            )
        return ProviderHealthListResponse(
            default_provider=self.settings.default_provider,
            fallback_provider=self.settings.fallback_provider,
            providers=provider_entries,
        )

    async def _select_model_for_provider(
        self,
        *,
        payload: ModelSelectionDebugRequest | ModelSelectionRequest,
        provider: AIProvider,
    ) -> ModelSelectionResult:
        """Resolve the best model for the selected provider."""
        started_at = time.perf_counter()
        available_models = await self._get_available_model_names(provider)
        selection_request = self._build_selection_request(payload, available_models, provider.provider_key)
        selection_result = self.selection_engine.select(
            selection_request,
            default_model=self.settings.default_model,
        )
        selection_result = selection_result.model_copy(update={"provider": provider.provider_key})
        selection_latency_ms = (time.perf_counter() - started_at) * 1000
        self.selection_metrics.record(
            task_type=selection_result.task_type,
            selected_model=selection_result.selected_model,
            fallback_used=selection_result.fallback_used,
            latency_bucket=self._latency_bucket(selection_latency_ms),
        )
        return selection_result

    async def _get_available_model_names(self, provider: AIProvider) -> list[str]:
        result = await provider.list_models()
        return [model.name for model in result.models if model.name]

    async def _collect_provider_states(
        self,
        payload: RoutingDecisionRequest,
    ) -> list[RoutingProviderState]:
        """Collect compact provider states for routing decisions."""
        states: list[RoutingProviderState] = []
        for provider in self.provider_factory.registry().list():
            descriptor = provider.describe()
            if not descriptor.enabled:
                states.append(
                    RoutingProviderState(
                        provider=descriptor.key,
                        kind=descriptor.kind,
                        available=False,
                        enabled=descriptor.enabled,
                        configured=descriptor.configured,
                    )
                )
                continue

            if descriptor.kind == "cloud" and not self._should_probe_cloud(payload):
                states.append(
                    RoutingProviderState(
                        provider=descriptor.key,
                        kind=descriptor.kind,
                        available=False,
                        enabled=descriptor.enabled,
                        configured=descriptor.configured,
                    )
                )
                continue

            health = await provider.health_check()
            states.append(
                RoutingProviderState(
                    provider=descriptor.key,
                    kind=descriptor.kind,
                    available=health.available,
                    enabled=descriptor.enabled,
                    configured=descriptor.configured,
                )
            )
        return states

    def _should_probe_cloud(self, payload: RoutingDecisionRequest) -> bool:
        """Return whether cloud providers should be considered for this request."""
        if payload.requested_provider:
            return True
        if payload.cloud_permitted:
            return True
        if payload.task_type in {"analyze_scenario", "explain", "summarize_context"}:
            return self.settings.cloud_for_reasoning_enabled
        return False

    @staticmethod
    def _resolve_task(request: AIRequest) -> AITaskType:
        task = request.metadata.get("task") if isinstance(request.metadata, dict) else None
        if task in {"analyze_scenario", "extract_objects", "explain", "classify_intent", "summarize_context"}:
            return task
        return "analyze_scenario"

    @staticmethod
    def _resolve_trace_id(request: AIRequest) -> str:
        """Return a stable trace identifier for a single orchestration run."""
        return request.trace_id or str(uuid4())

    def _build_selection_request(
        self,
        payload: ModelSelectionDebugRequest | ModelSelectionRequest,
        available_models: list[str],
        provider_key: str,
    ) -> ModelSelectionRequest:
        """Build the normalized selection request used by the engine."""
        if isinstance(payload, ModelSelectionRequest):
            return payload.model_copy(
                update={
                    "provider": provider_key,
                    "available_models": available_models or payload.available_models,
                }
            )

        return ModelSelectionRequest(
            task_type=payload.task_type,
            provider=provider_key,
            requested_model=payload.requested_model,
            available_models=available_models,
            latency_sensitive=payload.latency_sensitive,
            quality_policy=payload.quality_policy,
            metadata={
                **payload.metadata,
                "context": payload.context or {},
            },
        )

    def _build_routing_request(
        self,
        *,
        task_type: str,
        metadata: dict | None,
        privacy: PrivacyClassificationResult,
    ) -> RoutingDecisionRequest:
        """Build a routing request from orchestration metadata."""
        normalized_metadata = dict(metadata or {})
        context = normalized_metadata.get("context")
        context_dict = context if isinstance(context, dict) else {}

        return RoutingDecisionRequest(
            task_type=task_type,
            privacy_sensitive=privacy.sensitivity_level in {"confidential", "restricted"},
            privacy_mode=privacy.privacy_mode,
            sensitivity_level=privacy.sensitivity_level,
            local_required=privacy.local_required,
            latency_sensitive=bool(
                normalized_metadata.get("latency_sensitive")
                or context_dict.get("latency_sensitive")
            ),
            cloud_permitted=bool(normalized_metadata.get("cloud_permitted") and privacy.cloud_allowed),
            cloud_allowed=privacy.cloud_allowed,
            classification_reason=privacy.classification_reason,
            policy_tags=privacy.policy_tags,
            requested_provider=resolve_requested_provider(normalized_metadata),
            metadata=normalized_metadata,
        )

    @staticmethod
    def _latency_bucket(latency_ms: float) -> str:
        """Return a compact latency bucket for selection diagnostics."""
        if latency_ms < 1:
            return "lt_1ms"
        if latency_ms < 5:
            return "1_to_5ms"
        if latency_ms < 20:
            return "5_to_20ms"
        return "gte_20ms"

    def _get_provider_by_key(self, provider_key: str) -> AIProvider:
        """Return a provider by key, honoring explicit provider injection."""
        if self.provider is not None and self.provider.provider_key == provider_key:
            return self.provider
        return self.provider_factory.get_provider(provider_key)

    async def _resolve_provider_for_task(
        self,
        *,
        task_type: str,
        metadata: dict | None,
    ) -> AIProvider:
        """Resolve the provider for a task using routing policy."""
        if self.provider is not None:
            return self.provider

        routing = await self.decide_routing(
            self._build_routing_request(
                task_type=task_type,
                metadata=metadata,
                privacy=self.classify_privacy(
                    PrivacyClassificationRequest(
                        task_type=task_type,
                        text=None,
                        metadata=metadata or {},
                        context={},
                    )
                ),
            )
        )
        if routing.selected_provider is None:
            return self.provider_factory.get_default_provider()
        return self._get_provider_by_key(routing.selected_provider)

    def _audit(
        self,
        *,
        trace_id: str,
        stage: str,
        task_type: str | None = None,
        privacy_mode: str | None = None,
        sensitivity_level: str | None = None,
        selected_provider: str | None = None,
        selected_model: str | None = None,
        fallback_used: bool = False,
        benchmark_used: bool = False,
        decision_reason: str | None = None,
        policy_tags: list[str] | None = None,
        success: bool | None = None,
        error_code: str | None = None,
        metadata: dict | None = None,
    ) -> None:
        """Write a structured audit event without affecting request execution."""
        try:
            self.audit_logger.record_event(
                trace_id=trace_id,
                stage=stage,
                task_type=task_type,
                privacy_mode=privacy_mode,
                sensitivity_level=sensitivity_level,
                selected_provider=selected_provider,
                selected_model=selected_model,
                fallback_used=fallback_used,
                benchmark_used=benchmark_used,
                decision_reason=decision_reason,
                policy_tags=policy_tags,
                success=success,
                error_code=error_code,
                metadata=metadata,
            )
        except Exception:
            logger.exception("ai_audit_emit_failed trace_id=%s stage=%s", trace_id, stage)

    def _telemetry(
        self,
        *,
        trace_id: str,
        stage: str,
        task_type: str | None = None,
        provider: str | None = None,
        model: str | None = None,
        latency_ms: float | None = None,
        fallback_used: bool = False,
        benchmark_used: bool = False,
        routing_reason: str | None = None,
        privacy_mode: str | None = None,
        sensitivity_level: str | None = None,
        success: bool | None = None,
        error_code: str | None = None,
        metadata: dict | None = None,
    ) -> None:
        """Write a structured telemetry event without affecting request execution."""
        try:
            self.telemetry_collector.record_event(
                trace_id=trace_id,
                stage=stage,
                task_type=task_type,
                provider=provider,
                model=model,
                latency_ms=latency_ms,
                fallback_used=fallback_used,
                benchmark_used=benchmark_used,
                routing_reason=routing_reason,
                privacy_mode=privacy_mode,
                sensitivity_level=sensitivity_level,
                success=success,
                error_code=error_code,
                metadata=metadata,
            )
        except Exception:
            logger.exception("ai_telemetry_emit_failed trace_id=%s stage=%s", trace_id, stage)
