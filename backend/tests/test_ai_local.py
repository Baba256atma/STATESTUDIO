from __future__ import annotations

from fastapi.testclient import TestClient

import main
from app.routers.ai_local import get_local_ai_orchestrator
from app.schemas.ai import (
    AIResponse,
    HealthResponse,
    ProviderHealthEntry,
    ProviderHealthListResponse,
    ProviderInfo,
    ProviderListResponse,
    SystemModel,
    SystemModelResponse,
)
from app.schemas.audit import AuditEvent, AuditEventListResponse, AuditPolicyDecisionsResponse, AuditPolicyResponse
from app.schemas.telemetry import (
    PipelineTrace,
    PipelineTraceListResponse,
    StageMetric,
    TelemetryEvent,
    TelemetryEventListResponse,
    TelemetryMetricsResponse,
    TelemetryStageListResponse,
)
from app.schemas.privacy import PrivacyClassificationResult, PrivacyPolicyResponse as PrivacyClassificationPolicyResponse
from app.services.ai.routing_types import RoutingDecision, RoutingPolicyResponse


class FakeHealthyOrchestrator:
    async def get_health(self) -> HealthResponse:
        return HealthResponse(
            ok=True,
            provider="ollama",
            available=True,
            base_url="http://localhost:11434",
            default_model="llama3.2:3b",
        )

    async def list_models(self):
        return {
            "ok": True,
            "provider": "ollama",
            "models": [{"name": "llama3.2:3b"}],
        }

    async def analyze_local(self, payload) -> AIResponse:
        return AIResponse(
            ok=True,
            provider="ollama",
            model="llama3.2:3b",
            output='{"summary":"Risk is rising."}',
            summary="Risk is rising.",
            metadata={"task": "analyze_scenario"},
        )

    def list_providers(self) -> ProviderListResponse:
        return ProviderListResponse(
            default_provider="ollama",
            fallback_provider=None,
            providers=[
                ProviderInfo(
                    key="ollama",
                    kind="local",
                    enabled=True,
                    configured=True,
                    default_model="llama3.2:3b",
                    base_url="http://localhost:11434",
                )
            ],
        )

    async def get_provider_health(self) -> ProviderHealthListResponse:
        return ProviderHealthListResponse(
            default_provider="ollama",
            fallback_provider=None,
            providers=[
                ProviderHealthEntry(
                    provider="ollama",
                    available=True,
                    default_model="llama3.2:3b",
                    latency_ms=3.2,
                    error=None,
                )
            ],
        )

    def get_routing_policy(self) -> RoutingPolicyResponse:
        return RoutingPolicyResponse(
            enabled=True,
            default_mode="local_first",
            local_first=True,
            cloud_fallback_enabled=False,
            cloud_for_reasoning_enabled=False,
            privacy_strict_local=True,
            cloud_allowed_tasks=["analyze_scenario"],
            local_allowed_tasks=["analyze_scenario", "extract_objects"],
        )

    async def decide_routing(self, payload) -> RoutingDecision:
        return RoutingDecision(
            selected_provider="ollama",
            routing_reason="Local-first policy selected a healthy local provider",
            fallback_allowed=False,
            privacy_mode="standard",
            local_preferred=True,
            cloud_allowed=False,
            local_available=True,
            cloud_available=False,
        )

    def get_privacy_policy(self) -> PrivacyClassificationPolicyResponse:
        return PrivacyClassificationPolicyResponse(
            enabled=True,
            default_privacy_mode="default",
            strict_mode=True,
            assume_uploaded_content_confidential=True,
            cloud_blocked_sensitivity_levels=["confidential", "restricted"],
            local_required_sensitivity_levels=["restricted"],
        )

    def classify_privacy(self, payload) -> PrivacyClassificationResult:
        return PrivacyClassificationResult(
            task_type=payload.task_type,
            contains_uploaded_content=False,
            privacy_mode="default",
            sensitivity_level="internal",
            cloud_allowed=False,
            local_required=False,
            classification_reason="Internal content defaults to local-first routing",
            policy_tags=["internal_context"],
        )

    def get_audit_policy(self) -> AuditPolicyResponse:
        return AuditPolicyResponse(
            enabled=True,
            log_to_file=False,
            file_path=None,
            keep_in_memory=True,
            max_events=500,
            include_policy_tags=True,
            redact_sensitive_fields=True,
            include_provider_metadata=False,
        )

    def get_audit_events(self, **kwargs) -> AuditEventListResponse:
        return AuditEventListResponse(
            events=[
                AuditEvent(
                    trace_id="trace-1",
                    timestamp="2026-03-15T00:00:00+00:00",
                    stage="privacy_classified",
                    task_type="analyze_scenario",
                    privacy_mode="default",
                    sensitivity_level="internal",
                    decision_reason="Internal content defaults to local-first routing",
                    success=True,
                )
            ]
        )

    def get_recent_audit_events(self, limit: int = 50) -> AuditEventListResponse:
        return self.get_audit_events()

    def get_policy_decision_events(self, **kwargs) -> AuditPolicyDecisionsResponse:
        return AuditPolicyDecisionsResponse(
            events=[
                AuditEvent(
                    trace_id="trace-1",
                    timestamp="2026-03-15T00:00:00+00:00",
                    stage="routing_decided",
                    task_type="analyze_scenario",
                    privacy_mode="default",
                    sensitivity_level="internal",
                    selected_provider="ollama",
                    decision_reason="Local-first policy selected a healthy local provider",
                    success=True,
                )
            ]
        )

    def get_telemetry_metrics(self) -> TelemetryMetricsResponse:
        return TelemetryMetricsResponse(
            total_events=4,
            total_traces=1,
            average_stage_latency_ms=4.2,
            fallback_rate=0.0,
            routing_policy_override_rate=0.0,
            response_valid_rate=1.0,
            privacy_cloud_block_rate=1.0,
        )

    def get_telemetry_traces(self, **kwargs) -> PipelineTraceListResponse:
        return PipelineTraceListResponse(
            traces=[
                PipelineTrace(
                    trace_id="trace-1",
                    task_type="analyze_scenario",
                    total_latency_ms=12.5,
                    events=[
                        TelemetryEvent(
                            trace_id="trace-1",
                            timestamp="2026-03-15T00:00:00+00:00",
                            stage="routing_decided",
                            task_type="analyze_scenario",
                            provider="ollama",
                            latency_ms=1.2,
                            success=True,
                        )
                    ],
                )
            ]
        )

    def get_telemetry_stage_metrics(self) -> TelemetryStageListResponse:
        return TelemetryStageListResponse(
            stages=[
                StageMetric(
                    stage="routing_decided",
                    count=1,
                    avg_latency_ms=1.2,
                    success_rate=1.0,
                )
            ]
        )

    def get_telemetry_events(self, **kwargs) -> TelemetryEventListResponse:
        return TelemetryEventListResponse(
            events=[
                TelemetryEvent(
                    trace_id="trace-1",
                    timestamp="2026-03-15T00:00:00+00:00",
                    stage="routing_decided",
                    task_type="analyze_scenario",
                    provider="ollama",
                    latency_ms=1.2,
                    success=True,
                )
            ]
        )

    async def model_system(self, payload) -> SystemModelResponse:
        return SystemModelResponse(
            ok=True,
            trace_id=payload.trace_id,
            latency_ms=4.5,
            metadata={"task": "model_system", "engine": "fake"},
            system_model=SystemModel(
                problem_summary="Supply instability is increasing cost and degrading customer outcomes.",
                objects=[
                    {
                        "id": "obj_supplier",
                        "type": "actor",
                        "name": "Supplier",
                        "description": "Entity providing materials or services.",
                    }
                ],
                signals=[
                    {
                        "id": "sig_cost",
                        "name": "Operational Cost",
                        "type": "metric",
                    }
                ],
                relationships=[
                    {
                        "from": "obj_supplier",
                        "to": "sig_cost",
                        "type": "amplifies",
                    }
                ],
                loops=[],
                conflicts=[],
                fragility_points=[],
                scenario_inputs=[],
            ),
        )


class FakeUnavailableOrchestrator:
    async def get_health(self) -> HealthResponse:
        return HealthResponse(
            ok=True,
            provider="ollama",
            available=False,
            base_url="http://localhost:11434",
            default_model="llama3.2:3b",
        )

    async def list_models(self):
        return {
            "ok": False,
            "provider": "ollama",
            "models": [],
        }

    async def analyze_local(self, payload) -> AIResponse:
        return AIResponse(
            ok=False,
            provider="ollama",
            model="llama3.2:3b",
            output="",
            summary="Provider unavailable.",
            metadata={"provider_error": "provider_unavailable"},
        )


class FakeInvalidPayloadOrchestrator:
    async def get_health(self) -> HealthResponse:
        return HealthResponse(
            ok=True,
            provider="ollama",
            available=True,
            base_url="http://localhost:11434",
            default_model="llama3.2:3b",
        )

    async def list_models(self):
        return {
            "ok": True,
            "provider": "ollama",
            "models": [{"name": "llama3.2:3b"}],
        }

    async def analyze_local(self, payload) -> AIResponse:
        return AIResponse(
            ok=False,
            provider="ollama",
            model="llama3.2:3b",
            output="",
            summary="No structured output was produced.",
            metadata={"validation_error": "invalid_structured_output"},
        )


def _make_client(orchestrator) -> TestClient:
    main.app.dependency_overrides[get_local_ai_orchestrator] = lambda: orchestrator
    return TestClient(main.app)


def teardown_function():
    main.app.dependency_overrides.clear()


def test_local_ai_health_endpoint_success():
    with _make_client(FakeHealthyOrchestrator()) as client:
        response = client.get("/ai/local/health")

    assert response.status_code == 200
    body = response.json()
    assert body["ok"] is True
    assert body["provider"] == "ollama"
    assert body["available"] is True


def test_local_ai_health_endpoint_degraded_unavailable():
    with _make_client(FakeUnavailableOrchestrator()) as client:
        response = client.get("/ai/local/health")

    assert response.status_code == 200
    body = response.json()
    assert body["ok"] is True
    assert body["available"] is False


def test_local_ai_analyze_endpoint_success_with_mocked_orchestrator():
    with _make_client(FakeHealthyOrchestrator()) as client:
        response = client.post(
            "/ai/local/analyze",
            json={"text": "Analyze supplier delay risk."},
        )

    assert response.status_code == 200
    body = response.json()
    assert body["ok"] is True
    assert body["provider"] == "ollama"
    assert body["model"] == "llama3.2:3b"
    assert body["summary"] == "Risk is rising."


def test_local_ai_analyze_endpoint_invalid_upstream_payload_case():
    with _make_client(FakeInvalidPayloadOrchestrator()) as client:
        response = client.post(
            "/ai/local/analyze",
            json={"text": "Analyze an unstable scenario."},
        )

    assert response.status_code == 200
    body = response.json()
    assert body["ok"] is False
    assert body["summary"] == "No structured output was produced."
    assert body["metadata"]["validation_error"] == "invalid_structured_output"


def test_local_ai_system_model_endpoint_success():
    with _make_client(FakeHealthyOrchestrator()) as client:
        response = client.post(
            "/ai/local/system-model",
            json={"text": "Suppliers are unreliable and delays are increasing costs."},
        )

    assert response.status_code == 200
    body = response.json()
    assert body["ok"] is True
    assert body["system_model"]["objects"][0]["id"] == "obj_supplier"
    assert body["system_model"]["signals"][0]["id"] == "sig_cost"
    assert body["system_model"]["relationships"][0]["from"] == "obj_supplier"


def test_local_ai_providers_endpoint_success():
    with _make_client(FakeHealthyOrchestrator()) as client:
        response = client.get("/ai/local/providers")

    assert response.status_code == 200
    body = response.json()
    assert body["default_provider"] == "ollama"
    assert body["providers"][0]["key"] == "ollama"


def test_local_ai_provider_health_endpoint_success():
    with _make_client(FakeHealthyOrchestrator()) as client:
        response = client.get("/ai/local/providers/health")

    assert response.status_code == 200
    body = response.json()
    assert body["default_provider"] == "ollama"
    assert body["providers"][0]["provider"] == "ollama"
    assert body["providers"][0]["available"] is True


def test_local_ai_routing_policy_endpoint_success():
    with _make_client(FakeHealthyOrchestrator()) as client:
        response = client.get("/ai/local/routing/policy")

    assert response.status_code == 200
    body = response.json()
    assert body["enabled"] is True
    assert body["default_mode"] == "local_first"


def test_local_ai_routing_decide_endpoint_success():
    with _make_client(FakeHealthyOrchestrator()) as client:
        response = client.post(
            "/ai/local/routing/decide",
            json={"task_type": "analyze_scenario", "privacy_sensitive": False},
        )

    assert response.status_code == 200
    body = response.json()
    assert body["selected_provider"] == "ollama"
    assert body["local_preferred"] is True


def test_local_ai_privacy_policy_endpoint_success():
    with _make_client(FakeHealthyOrchestrator()) as client:
        response = client.get("/ai/local/privacy/policy")

    assert response.status_code == 200
    body = response.json()
    assert body["enabled"] is True
    assert body["default_privacy_mode"] == "default"


def test_local_ai_privacy_classify_endpoint_success():
    with _make_client(FakeHealthyOrchestrator()) as client:
        response = client.post(
            "/ai/local/privacy/classify",
            json={"task_type": "analyze_scenario", "text": "Internal supplier issue"},
        )

    assert response.status_code == 200
    body = response.json()
    assert body["sensitivity_level"] == "internal"
    assert body["cloud_allowed"] is False


def test_local_ai_audit_policy_endpoint_success():
    with _make_client(FakeHealthyOrchestrator()) as client:
        response = client.get("/ai/local/audit/policy")

    assert response.status_code == 200
    body = response.json()
    assert body["enabled"] is True
    assert body["keep_in_memory"] is True


def test_local_ai_audit_events_endpoint_success():
    with _make_client(FakeHealthyOrchestrator()) as client:
        response = client.get("/ai/local/audit/events")

    assert response.status_code == 200
    body = response.json()
    assert body["events"][0]["stage"] == "privacy_classified"


def test_local_ai_audit_policy_decisions_endpoint_success():
    with _make_client(FakeHealthyOrchestrator()) as client:
        response = client.get("/ai/local/audit/policy-decisions")

    assert response.status_code == 200
    body = response.json()
    assert body["events"][0]["stage"] == "routing_decided"


def test_local_ai_telemetry_metrics_endpoint_success():
    with _make_client(FakeHealthyOrchestrator()) as client:
        response = client.get("/ai/local/telemetry/metrics")

    assert response.status_code == 200
    body = response.json()
    assert body["total_events"] == 4
    assert body["response_valid_rate"] == 1.0


def test_local_ai_telemetry_traces_endpoint_success():
    with _make_client(FakeHealthyOrchestrator()) as client:
        response = client.get("/ai/local/telemetry/traces")

    assert response.status_code == 200
    body = response.json()
    assert body["traces"][0]["trace_id"] == "trace-1"
    assert body["traces"][0]["events"][0]["stage"] == "routing_decided"


def test_local_ai_telemetry_stages_endpoint_success():
    with _make_client(FakeHealthyOrchestrator()) as client:
        response = client.get("/ai/local/telemetry/stages")

    assert response.status_code == 200
    body = response.json()
    assert body["stages"][0]["stage"] == "routing_decided"


def test_local_ai_telemetry_events_endpoint_success():
    with _make_client(FakeHealthyOrchestrator()) as client:
        response = client.get("/ai/local/telemetry/events")

    assert response.status_code == 200
    body = response.json()
    assert body["events"][0]["provider"] == "ollama"
