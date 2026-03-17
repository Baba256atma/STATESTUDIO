"""Structured telemetry collection for the Nexora AI pipeline."""

from __future__ import annotations

import json
import logging
from collections import deque
from datetime import UTC, datetime
from pathlib import Path

from app.core.config import LocalAISettings
from app.schemas.telemetry import (
    PipelineTrace,
    PipelineTraceListResponse,
    TelemetryEvent,
    TelemetryEventListResponse,
    TelemetryMetricsResponse,
    TelemetryStage,
    TelemetryStageListResponse,
)
from app.services.ai.audit_redaction import minimize_audit_metadata
from app.services.ai.control_plane.control_plane_service import AIControlPlaneService
from app.services.ai.telemetry_metrics import build_stage_metric_response, build_telemetry_metrics


logger = logging.getLogger("nexora.ai.telemetry")


class AITelemetryCollector:
    """Collect recent AI telemetry events and optional JSONL records."""

    def __init__(self, settings: LocalAISettings) -> None:
        self.settings = settings
        self.control_plane = AIControlPlaneService(settings)
        self._events: deque[TelemetryEvent] = deque(maxlen=self.control_plane.get_telemetry_policy().max_events)

    def record_event(
        self,
        *,
        trace_id: str,
        stage: TelemetryStage,
        task_type: str | None = None,
        provider: str | None = None,
        model: str | None = None,
        latency_ms: float | None = None,
        token_usage: dict[str, int] | None = None,
        fallback_used: bool = False,
        benchmark_used: bool = False,
        routing_reason: str | None = None,
        privacy_mode: str | None = None,
        sensitivity_level: str | None = None,
        success: bool | None = None,
        error_code: str | None = None,
        metadata: dict | None = None,
    ) -> bool:
        """Record a telemetry event and swallow collector failures."""
        policy = self.control_plane.get_telemetry_policy()
        if not policy.enabled:
            return False

        version_info = self.control_plane.get_version_info()
        event = TelemetryEvent(
            trace_id=trace_id,
            timestamp=datetime.now(UTC).isoformat(),
            stage=stage,
            task_type=task_type,
            provider=provider,
            model=model,
            latency_ms=round(latency_ms, 2) if latency_ms is not None else None,
            token_usage=token_usage,
            fallback_used=fallback_used,
            benchmark_used=benchmark_used,
            routing_reason=routing_reason,
            privacy_mode=privacy_mode,
            sensitivity_level=sensitivity_level,
            success=success,
            error_code=error_code,
            metadata=minimize_audit_metadata(
                {**(metadata or {}), "policy_version": version_info.policy_version},
                sensitivity_level=sensitivity_level,
                redact_sensitive_fields=policy.redact_sensitive_fields,
                include_provider_metadata=policy.include_provider_metadata,
            ),
        )
        try:
            if policy.keep_in_memory:
                self._events.append(event)
            if policy.log_to_file:
                self._write_jsonl(event)
            return True
        except Exception:
            logger.exception("ai_telemetry_record_failed trace_id=%s stage=%s", trace_id, stage)
            return False

    def list_events(
        self,
        *,
        trace_id: str | None = None,
        stage: str | None = None,
        task_type: str | None = None,
        limit: int | None = None,
    ) -> list[TelemetryEvent]:
        """Return filtered telemetry events from in-memory storage."""
        events = list(self._events)
        if trace_id:
            events = [event for event in events if event.trace_id == trace_id]
        if stage:
            events = [event for event in events if event.stage == stage]
        if task_type:
            events = [event for event in events if event.task_type == task_type]
        if limit is not None and limit >= 0:
            events = events[-limit:]
        return events

    def list_event_response(
        self,
        *,
        trace_id: str | None = None,
        stage: str | None = None,
        task_type: str | None = None,
        limit: int | None = None,
    ) -> TelemetryEventListResponse:
        """Return a response wrapper for filtered telemetry events."""
        return TelemetryEventListResponse(
            events=self.list_events(
                trace_id=trace_id,
                stage=stage,
                task_type=task_type,
                limit=limit,
            )
        )

    def list_traces(self, *, trace_id: str | None = None, limit: int | None = None) -> PipelineTraceListResponse:
        """Return grouped pipeline traces."""
        grouped: dict[str, list[TelemetryEvent]] = {}
        for event in self.list_events(trace_id=trace_id):
            grouped.setdefault(event.trace_id, []).append(event)
        traces: list[PipelineTrace] = []
        for grouped_trace_id in sorted(grouped):
            trace_events = grouped[grouped_trace_id]
            response_events = [event for event in trace_events if event.stage == "response_returned" and event.latency_ms is not None]
            traces.append(
                PipelineTrace(
                    trace_id=grouped_trace_id,
                    task_type=trace_events[0].task_type if trace_events else None,
                    events=trace_events[-limit:] if limit is not None and limit >= 0 else trace_events,
                    total_latency_ms=response_events[-1].latency_ms if response_events else None,
                )
            )
        return PipelineTraceListResponse(traces=traces[-limit:] if limit is not None and limit >= 0 else traces)

    def metrics(self) -> TelemetryMetricsResponse:
        """Return an aggregated telemetry metrics snapshot."""
        return build_telemetry_metrics(list(self._events))

    def stage_metrics(self) -> TelemetryStageListResponse:
        """Return aggregated stage metrics only."""
        return build_stage_metric_response(list(self._events))

    def _write_jsonl(self, event: TelemetryEvent) -> None:
        path = Path(self.control_plane.get_telemetry_policy().file_path)
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("a", encoding="utf-8") as handle:
            handle.write(json.dumps(event.model_dump(), ensure_ascii=True) + "\n")
