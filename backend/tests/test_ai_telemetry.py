from __future__ import annotations

import asyncio
from pathlib import Path

from app.core.config import LocalAISettings
from app.schemas.ai import LocalAIAnalyzeRequest
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
from app.services.ai.telemetry_collector import AITelemetryCollector


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


class SafeFailingTelemetryCollector(AITelemetryCollector):
    def _write_jsonl(self, event) -> None:  # type: ignore[override]
        raise OSError("cannot_write")


def test_telemetry_collector_stores_recent_events_safely():
    collector = AITelemetryCollector(LocalAISettings(ai_telemetry_max_events=2))
    collector.record_event(trace_id="t1", stage="request_received", task_type="analyze_scenario", success=True)
    collector.record_event(trace_id="t2", stage="privacy_classified", task_type="analyze_scenario", success=True)
    collector.record_event(trace_id="t3", stage="routing_decided", task_type="analyze_scenario", success=True)

    events = collector.list_events(limit=10)
    assert len(events) == 2
    assert events[-1].trace_id == "t3"


def test_telemetry_file_logging_works_when_enabled(tmp_path: Path):
    file_path = tmp_path / "telemetry.jsonl"
    collector = AITelemetryCollector(
        LocalAISettings(
            ai_telemetry_log_to_file=True,
            ai_telemetry_file_path=str(file_path),
        )
    )

    collector.record_event(trace_id="trace-file", stage="request_received", task_type="explain", success=True)

    assert file_path.exists()
    assert "trace-file" in file_path.read_text(encoding="utf-8")


def test_telemetry_stage_latency_and_redaction_are_captured():
    settings = LocalAISettings()
    collector = AITelemetryCollector(settings)
    orchestrator = LocalAIOrchestrator(
        settings=settings,
        provider=FakeProvider(),
        telemetry_collector=collector,
    )

    response = asyncio.run(
        orchestrator.analyze_local(
            LocalAIAnalyzeRequest(
                text="Analyze internal supplier delay.",
                metadata={"task": "analyze_scenario", "prompt": "secret prompt body", "token": "secret"},
            )
        )
    )

    assert response.ok is True
    events = collector.list_events(limit=20)
    stages = {event.stage for event in events}
    assert "privacy_classified" in stages
    assert "response_returned" in stages
    response_event = next(event for event in events if event.stage == "response_returned")
    assert response_event.latency_ms is not None
    request_event = next(event for event in events if event.stage == "request_received")
    assert "prompt" not in request_event.metadata.get("request_metadata", {})
    assert request_event.metadata["request_metadata"]["token"] == "[REDACTED]"


def test_telemetry_metrics_snapshot_is_structured():
    collector = AITelemetryCollector(LocalAISettings())
    collector.record_event(trace_id="t1", stage="routing_decided", provider="ollama", latency_ms=1.5, success=True)
    collector.record_event(trace_id="t1", stage="response_returned", provider="ollama", model="llama3.2:3b", latency_ms=5.0, success=True)

    metrics = collector.metrics()

    assert metrics.total_events == 2
    assert metrics.provider_usage[0].provider == "ollama"
    assert metrics.model_usage[0].model == "llama3.2:3b"


def test_telemetry_logging_failure_does_not_break_request_execution():
    failing = SafeFailingTelemetryCollector(
        LocalAISettings(
            ai_telemetry_log_to_file=True,
            ai_telemetry_file_path="/tmp/nonexistent/telemetry.jsonl",
        )
    )

    result = failing.record_event(
        trace_id="trace-safe",
        stage="request_received",
        task_type="analyze_scenario",
        success=True,
    )

    assert result is False

    orchestrator = LocalAIOrchestrator(
        settings=LocalAISettings(),
        provider=FakeProvider(),
        telemetry_collector=AITelemetryCollector(LocalAISettings()),
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
