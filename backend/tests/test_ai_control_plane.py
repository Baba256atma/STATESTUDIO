from __future__ import annotations

import json
from pathlib import Path

from fastapi.testclient import TestClient

import main
from app.core.config import LocalAISettings
from app.routers.ai_control_plane import get_ai_control_plane_service
from app.schemas.control_plane import AIControlPlaneState
from app.services.ai.control_plane.control_plane_service import AIControlPlaneService
from app.services.ai.control_plane.policy_engine import AIPolicyEngine
from app.services.ai.privacy_classifier import PrivacyClassifier
from app.services.ai.privacy_types import PrivacyClassificationRequest
from app.services.ai.routing_policy import HybridRoutingPolicy
from app.services.ai.routing_types import RoutingDecisionRequest, RoutingProviderState


def _write_policy(path: Path, payload: dict) -> None:
    path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


def _local_state(available: bool = True) -> RoutingProviderState:
    return RoutingProviderState(
        provider="ollama",
        kind="local",
        available=available,
        enabled=True,
        configured=True,
    )


def _cloud_state(available: bool = True) -> RoutingProviderState:
    return RoutingProviderState(
        provider="openai",
        kind="cloud",
        available=available,
        enabled=True,
        configured=True,
    )


def test_control_plane_defaults_load_correctly(tmp_path: Path):
    service = AIControlPlaneService(
        LocalAISettings(),
        policy_path=tmp_path / "missing-ai-policy.json",
    )

    state = service.get_state()

    assert state.snapshot.version_info.policy_version == "nexora-default-v1"
    assert state.snapshot.version_info.source == "settings_defaults"
    assert state.snapshot.routing.default_mode == "local_first"
    assert state.snapshot.provider.default_provider == "ollama"


def test_malformed_policy_file_falls_back_safely_and_reload_keeps_last_good(tmp_path: Path):
    policy_path = tmp_path / "ai_policy.json"
    _write_policy(
        policy_path,
        {
            "version_info": {
                "policy_version": "file-policy-v1",
                "source": "file",
            },
            "provider": {
                "cloud_provider_enabled": True,
                "providers": {
                    "openai": {
                        "enabled": True,
                        "kind": "cloud",
                        "default_model": "gpt-4o-mini",
                    }
                },
            },
        },
    )
    service = AIControlPlaneService(LocalAISettings(), policy_path=policy_path)

    assert service.get_snapshot().version_info.policy_version == "file-policy-v1"

    policy_path.write_text("{invalid-json\n", encoding="utf-8")
    state = service.reload()

    assert state.reload_succeeded is False
    assert state.snapshot.version_info.policy_version == "file-policy-v1"
    assert state.last_error is not None


def test_policy_engine_returns_explainable_decisions(tmp_path: Path):
    policy_path = tmp_path / "ai_policy.json"
    _write_policy(
        policy_path,
        {
            "version_info": {
                "policy_version": "policy-engine-v1",
                "source": "file",
            },
            "routing": {
                "cloud_fallback_enabled": True,
                "cloud_allowed_tasks": ["explain", "summarize_context"],
            },
            "provider": {
                "cloud_provider_enabled": True,
                "providers": {
                    "openai": {
                        "enabled": True,
                        "kind": "cloud",
                        "default_model": "gpt-4o-mini",
                    }
                },
            },
        },
    )
    service = AIControlPlaneService(LocalAISettings(), policy_path=policy_path)
    engine = AIPolicyEngine(service.get_snapshot())

    decision = engine.is_cloud_routing_enabled()
    task_decision = engine.is_task_cloud_allowed("explain")
    fallback_decision = engine.is_fallback_allowed()

    assert decision.effective_value is True
    assert decision.policy_version == "policy-engine-v1"
    assert task_decision.effective_value is True
    assert fallback_decision.effective_value is True


def test_privacy_and_routing_layers_consume_control_plane_values(tmp_path: Path, monkeypatch):
    policy_path = tmp_path / "ai_policy.json"
    _write_policy(
        policy_path,
        {
            "version_info": {
                "policy_version": "integration-v1",
                "source": "file",
            },
            "routing": {
                "cloud_fallback_enabled": True,
                "cloud_allowed_tasks": ["explain"],
                "local_allowed_tasks": ["analyze_scenario", "extract_objects"],
            },
            "privacy": {
                "strict_mode": False,
                "cloud_blocked_sensitivity_levels": ["restricted"],
                "local_required_sensitivity_levels": ["restricted"],
            },
            "provider": {
                "cloud_provider_enabled": True,
                "providers": {
                    "openai": {
                        "enabled": True,
                        "kind": "cloud",
                        "default_model": "gpt-4o-mini",
                    }
                },
            },
        },
    )
    monkeypatch.setattr(
        "app.services.ai.control_plane.policy_loader.DEFAULT_POLICY_PATH",
        policy_path,
    )

    settings = LocalAISettings(
        ai_cloud_provider_enabled=True,
        ai_cloud_fallback_enabled=False,
        ai_cloud_for_reasoning_enabled=False,
    )
    privacy = PrivacyClassifier(settings).classify(
        PrivacyClassificationRequest(
            task_type="explain",
            text="Explain the public release timeline.",
            metadata={"cloud_allowed": True},
        )
    )
    decision = HybridRoutingPolicy(settings).decide(
        RoutingDecisionRequest(
            task_type="explain",
            privacy_sensitive=False,
            privacy_mode=privacy.privacy_mode,
            sensitivity_level=privacy.sensitivity_level,
            local_required=privacy.local_required,
            cloud_allowed=privacy.cloud_allowed,
            classification_reason=privacy.classification_reason,
            provider_states=[_local_state(False), _cloud_state(True)],
            metadata={},
        )
    )

    assert privacy.cloud_allowed is True
    assert decision.selected_provider == "openai"
    assert decision.fallback_allowed is True


def test_control_plane_diagnostics_endpoints_return_expected_structure(tmp_path: Path):
    policy_path = tmp_path / "ai_policy.json"
    _write_policy(
        policy_path,
        {
            "version_info": {
                "policy_version": "diagnostics-v1",
                "source": "file",
            },
            "provider": {
                "cloud_provider_enabled": True,
            },
        },
    )
    service = AIControlPlaneService(LocalAISettings(), policy_path=policy_path)
    main.app.dependency_overrides[get_ai_control_plane_service] = lambda: service

    with TestClient(main.app) as client:
        state_response = client.get("/ai/local/control-plane/state")
        policies_response = client.get("/ai/local/control-plane/policies")
        version_response = client.get("/ai/local/control-plane/version")
        reload_response = client.post("/ai/local/control-plane/reload")

    main.app.dependency_overrides.clear()

    assert state_response.status_code == 200
    assert policies_response.status_code == 200
    assert version_response.status_code == 200
    assert reload_response.status_code == 200
    assert state_response.json()["snapshot"]["version_info"]["policy_version"] == "diagnostics-v1"
    assert policies_response.json()["provider"]["cloud_provider_enabled"] is True
    assert version_response.json()["policy_version"] == "diagnostics-v1"
    assert "api_key" not in json.dumps(policies_response.json()).lower()


def test_control_plane_state_model_contains_policy_version(tmp_path: Path):
    policy_path = tmp_path / "ai_policy.json"
    _write_policy(
        policy_path,
        {
            "version_info": {
                "policy_version": "state-v1",
                "source": "file",
            },
        },
    )
    state = AIControlPlaneService(LocalAISettings(), policy_path=policy_path).get_state()

    assert isinstance(state, AIControlPlaneState)
    assert state.snapshot.version_info.policy_version == "state-v1"
