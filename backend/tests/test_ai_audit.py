from __future__ import annotations

import asyncio
from pathlib import Path

from app.core.config import LocalAISettings
from app.schemas.ai import LocalAIAnalyzeRequest
from app.services.ai.audit_logger import AIAuditLogger
from app.services.ai.audit_redaction import minimize_audit_metadata
from app.services.ai.orchestrator import LocalAIOrchestrator
from app.services.ai.providers.base import AIProvider
from app.services.ai.providers.types import (
    ProviderChatRequest,
    ProviderChatResponse,
    ProviderDescriptor,
    ProviderHealthStatus,
    ProviderModelInfo,
    ProviderModelList,
)


class FakeProvider(AIProvider):
    @property
    def provider_key(self) -> str:
        return "ollama"

    @property
    def default_model(self) -> str | None:
        return "llama3.2:3b"

    def describe(self) -> ProviderDescriptor:
        return ProviderDescriptor(
            key="ollama",
            kind="local",
            enabled=True,
            configured=True,
            default_model="llama3.2:3b",
        )

    async def health_check(self) -> ProviderHealthStatus:
        return ProviderHealthStatus(
            provider="ollama",
            available=True,
            default_model="llama3.2:3b",
        )

    async def list_models(self) -> ProviderModelList:
        return ProviderModelList(
            provider="ollama",
            models=[ProviderModelInfo(name="llama3.2:3b", provider="ollama")],
        )

    async def chat_json(self, request: ProviderChatRequest) -> ProviderChatResponse:
        return ProviderChatResponse(
            ok=True,
            provider="ollama",
            model=request.model or "llama3.2:3b",
            raw_model=request.model or "llama3.2:3b",
            output='{"summary":"ok","risk_signals":[],"object_candidates":[]}',
            data={"summary": "ok", "risk_signals": [], "object_candidates": []},
            latency_ms=5.0,
        )


class SafeFailingAuditLogger(AIAuditLogger):
    def _write_jsonl(self, event) -> None:  # type: ignore[override]
        raise OSError("cannot_write")


def test_audit_logger_stores_recent_events_safely():
    logger = AIAuditLogger(LocalAISettings(ai_audit_max_events=2))
    logger.record_event(trace_id="t1", stage="request_received", task_type="analyze_scenario", success=True)
    logger.record_event(trace_id="t2", stage="privacy_classified", task_type="analyze_scenario", success=True)
    logger.record_event(trace_id="t3", stage="routing_decided", task_type="analyze_scenario", success=True)

    events = logger.recent(limit=10)
    assert len(events) == 2
    assert events[-1].trace_id == "t3"


def test_audit_file_logging_works_when_enabled(tmp_path: Path):
    file_path = tmp_path / "audit.jsonl"
    logger = AIAuditLogger(
        LocalAISettings(
            ai_audit_log_to_file=True,
            ai_audit_file_path=str(file_path),
        )
    )

    logger.record_event(trace_id="trace-file", stage="request_received", task_type="explain", success=True)

    assert file_path.exists()
    content = file_path.read_text(encoding="utf-8")
    assert "trace-file" in content


def test_redaction_masks_sensitive_fields():
    redacted = minimize_audit_metadata(
        {
            "token": "secret-token",
            "prompt": "sensitive prompt body",
            "nested": {"password": "secret"},
            "safe": "value",
        },
        sensitivity_level="restricted",
        redact_sensitive_fields=True,
        include_provider_metadata=False,
    )

    assert redacted["token"] == "[REDACTED]"
    assert "prompt" not in redacted
    assert redacted["nested"]["password"] == "[REDACTED]"
    assert redacted["safe"] == "[MINIMIZED]"


def test_audit_logging_failure_does_not_break_request_execution():
    settings = LocalAISettings()
    logger = SafeFailingAuditLogger(
        LocalAISettings(
            ai_audit_log_to_file=True,
            ai_audit_file_path="/tmp/nonexistent/audit.jsonl",
        )
    )

    result = logger.record_event(
        trace_id="trace-safe",
        stage="request_received",
        task_type="analyze_scenario",
        success=True,
    )

    assert result is False

    orchestrator = LocalAIOrchestrator(
        settings=settings,
        provider=FakeProvider(),
        audit_logger=AIAuditLogger(settings),
    )
    response = asyncio.run(
        orchestrator.analyze_local(
            LocalAIAnalyzeRequest(
                text="Analyze internal supplier delay.",
                metadata={"task": "analyze_scenario"},
            )
        )
    )

    assert response.ok is True


def test_privacy_routing_and_model_selection_emit_audit_events():
    settings = LocalAISettings()
    audit_logger = AIAuditLogger(settings)
    orchestrator = LocalAIOrchestrator(
        settings=settings,
        provider=FakeProvider(),
        audit_logger=audit_logger,
    )

    response = asyncio.run(
        orchestrator.analyze_local(
            LocalAIAnalyzeRequest(
                text="Analyze internal supplier delay.",
                metadata={"task": "analyze_scenario"},
            )
        )
    )

    assert response.ok is True
    events = audit_logger.recent(limit=20)
    stages = {event.stage for event in events}
    assert "privacy_classified" in stages
    assert "routing_decided" in stages
    assert "model_selected" in stages
