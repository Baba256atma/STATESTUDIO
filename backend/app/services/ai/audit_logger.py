"""Structured audit trail logging for AI policy decisions."""

from __future__ import annotations

import json
import logging
from collections import deque
from datetime import UTC, datetime
from functools import lru_cache
from pathlib import Path

from app.core.config import LocalAISettings, get_local_ai_settings
from app.services.ai.audit_redaction import minimize_audit_metadata
from app.services.ai.control_plane.control_plane_service import AIControlPlaneService
from app.services.ai.audit_types import (
    AuditEvent,
    AuditPolicyResponse,
    AuditStage,
    PolicyDecisionRecord,
)


logger = logging.getLogger("nexora.ai.audit")

POLICY_DECISION_STAGES: set[AuditStage] = {
    "privacy_classified",
    "routing_decided",
    "provider_selected",
    "model_selected",
    "fallback_applied",
}


class AIAuditLogger:
    """Store recent audit events and optionally append JSONL records."""

    def __init__(self, settings: LocalAISettings) -> None:
        self.settings = settings
        self.control_plane = AIControlPlaneService(settings)
        self._events: deque[AuditEvent] = deque(maxlen=self.control_plane.get_audit_policy().max_events)

    def describe_policy(self) -> AuditPolicyResponse:
        """Return the active audit logging policy."""
        policy = self.control_plane.get_audit_policy()
        return AuditPolicyResponse(
            enabled=policy.enabled,
            log_to_file=policy.log_to_file,
            file_path=policy.file_path if policy.log_to_file else None,
            keep_in_memory=policy.keep_in_memory,
            max_events=policy.max_events,
            include_policy_tags=policy.include_policy_tags,
            redact_sensitive_fields=policy.redact_sensitive_fields,
            include_provider_metadata=policy.include_provider_metadata,
        )

    def record_event(
        self,
        *,
        trace_id: str,
        stage: AuditStage,
        task_type: str | None = None,
        correlation_id: str | None = None,
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
    ) -> bool:
        """Record a structured audit event and swallow storage failures."""
        policy = self.control_plane.get_audit_policy()
        if not policy.enabled:
            return False

        version_info = self.control_plane.get_version_info()
        event = AuditEvent(
            trace_id=trace_id,
            timestamp=datetime.now(UTC).isoformat(),
            stage=stage,
            correlation_id=correlation_id,
            task_type=task_type,
            privacy_mode=privacy_mode,
            sensitivity_level=sensitivity_level,
            selected_provider=selected_provider,
            selected_model=selected_model,
            fallback_used=fallback_used,
            benchmark_used=benchmark_used,
            decision_reason=decision_reason,
            policy_tags=(policy_tags or []) if policy.include_policy_tags else [],
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
            logger.exception("ai_audit_record_failed trace_id=%s stage=%s", trace_id, stage)
            return False

    def list_events(
        self,
        *,
        trace_id: str | None = None,
        stage: str | None = None,
        task_type: str | None = None,
        limit: int | None = None,
    ) -> list[AuditEvent]:
        """Return filtered audit events from in-memory storage."""
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

    def recent(self, limit: int = 50) -> list[AuditEvent]:
        """Return recent in-memory audit events."""
        return self.list_events(limit=limit)

    def policy_decisions(
        self,
        *,
        trace_id: str | None = None,
        task_type: str | None = None,
        limit: int | None = None,
    ) -> list[PolicyDecisionRecord]:
        """Return policy decision events only."""
        events = [
            PolicyDecisionRecord(**event.model_dump())
            for event in self.list_events(trace_id=trace_id, task_type=task_type, limit=limit)
            if event.stage in POLICY_DECISION_STAGES
        ]
        return events

    def _write_jsonl(self, event: AuditEvent) -> None:
        path = Path(self.control_plane.get_audit_policy().file_path)
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("a", encoding="utf-8") as handle:
            handle.write(json.dumps(event.model_dump(), ensure_ascii=True) + "\n")


@lru_cache(maxsize=1)
def get_audit_logger() -> AIAuditLogger:
    """Return the shared audit logger."""
    return AIAuditLogger(get_local_ai_settings())
