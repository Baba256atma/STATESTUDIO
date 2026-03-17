from __future__ import annotations

import json
from pathlib import Path

from fastapi.testclient import TestClient

import main
from app.core.config import LocalAISettings
from app.routers.ai_control_plane import get_ai_control_plane_service
from app.schemas.policy_canary import CanaryHealthSummary
from app.schemas.policy_promotion import EnvironmentType
from app.services.ai.audit_logger import get_audit_logger
from app.services.ai.control_plane.control_plane_service import AIControlPlaneService


def _write_json(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


def _base_policy() -> dict:
    return {
        "version_info": {
            "policy_version": "policy-v1",
            "source": "file",
        },
        "routing": {
            "cloud_fallback_enabled": False,
            "cloud_for_reasoning_enabled": False,
            "cloud_allowed_tasks": ["analyze_scenario"],
        },
        "provider": {
            "cloud_provider_enabled": False,
        },
        "privacy": {
            "strict_mode": True,
            "cloud_blocked_sensitivity_levels": ["confidential", "restricted"],
            "local_required_sensitivity_levels": ["restricted"],
        },
        "evaluation": {
            "use_mock_providers": True,
            "include_audit_checks": True,
            "regression_enabled": True,
        },
        "audit": {
            "enabled": True,
            "redact_sensitive_fields": True,
        },
        "telemetry": {
            "enabled": True,
            "redact_sensitive_fields": True,
        },
    }


def _service(tmp_path: Path) -> AIControlPlaneService:
    policy_path = tmp_path / "ai_policy.json"
    env_policy_dir = tmp_path / "policies"
    canary_state_path = tmp_path / "policies" / "canary_release.json"
    _write_json(policy_path, _base_policy())
    return AIControlPlaneService(
        LocalAISettings(),
        policy_path=policy_path,
        env_policy_dir=env_policy_dir,
        canary_state_path=canary_state_path,
    )


def _prepare_staging_canary(service: AIControlPlaneService) -> str:
    service._snapshot.model.fast_model = "fast-canary-v2"
    service.promote_policy(
        {
            "source_environment": "local",
            "target_environment": "dev",
            "requested_by": "ci",
            "promotion_reason": "prep dev",
        }
    )
    service.promote_policy(
        {
            "source_environment": "dev",
            "target_environment": "staging",
            "requested_by": "ci",
            "approved_by": "qa",
            "promotion_reason": "prep staging",
        }
    )
    return service.get_policy_environment(EnvironmentType.STAGING).policy_version


def test_deterministic_canary_assignment(tmp_path: Path):
    service = _service(tmp_path)
    canary_version = _prepare_staging_canary(service)
    service.start_policy_canary(
        {
            "stable_policy_version": service.get_policy_environment(EnvironmentType.PRODUCTION).policy_version,
            "canary_policy_version": canary_version,
            "canary_enabled": True,
            "traffic_percentage": 50,
            "assignment_scope": "global",
            "source_environment": "staging",
        },
        {"actor_id": "release-manager", "reason": "start canary"},
    )

    first = service.assign_policy_canary({"trace_id": "trace-123"})
    second = service.assign_policy_canary({"trace_id": "trace-123"})

    assert first.assigned_channel == second.assigned_channel
    assert first.request_hash_bucket == second.request_hash_bucket


def test_stable_fallback_when_canary_disabled(tmp_path: Path):
    service = _service(tmp_path)
    result = service.assign_policy_canary({"trace_id": "stable-only"})
    assert result.assigned_channel == "stable"


def test_rollout_percentage_handling(tmp_path: Path):
    service = _service(tmp_path)
    canary_version = _prepare_staging_canary(service)
    service.start_policy_canary(
        {
            "stable_policy_version": service.get_policy_environment(EnvironmentType.PRODUCTION).policy_version,
            "canary_policy_version": canary_version,
            "canary_enabled": True,
            "traffic_percentage": 100,
            "assignment_scope": "global",
            "source_environment": "staging",
        },
        {"actor_id": "release-manager", "reason": "full canary"},
    )

    result = service.assign_policy_canary({"trace_id": "always-canary"})
    assert result.assigned_channel == "canary"


def test_canary_pause_and_resume_behavior(tmp_path: Path):
    service = _service(tmp_path)
    canary_version = _prepare_staging_canary(service)
    service.start_policy_canary(
        {
            "stable_policy_version": service.get_policy_environment(EnvironmentType.PRODUCTION).policy_version,
            "canary_policy_version": canary_version,
            "canary_enabled": True,
            "traffic_percentage": 100,
            "assignment_scope": "global",
            "source_environment": "staging",
        },
        {"actor_id": "release-manager", "reason": "start canary"},
    )

    service.pause_policy_canary({"actor_id": "release-manager", "reason": "pause"})
    paused = service.assign_policy_canary({"trace_id": "pause-check"})
    service.resume_policy_canary({"actor_id": "release-manager", "reason": "resume"})
    resumed = service.assign_policy_canary({"trace_id": "pause-check"})

    assert paused.assigned_channel == "stable"
    assert resumed.assigned_channel == "canary"


def test_canary_rollback_behavior(tmp_path: Path):
    service = _service(tmp_path)
    canary_version = _prepare_staging_canary(service)
    service.start_policy_canary(
        {
            "stable_policy_version": service.get_policy_environment(EnvironmentType.PRODUCTION).policy_version,
            "canary_policy_version": canary_version,
            "canary_enabled": True,
            "traffic_percentage": 25,
            "assignment_scope": "global",
            "source_environment": "staging",
        },
        {"actor_id": "release-manager", "reason": "start canary"},
    )

    state = service.rollback_policy_canary({"actor_id": "release-manager", "reason": "rollback"})

    assert state.status == "rolled_back"
    assert state.canary_enabled is False


def test_canary_promotion_updates_production(tmp_path: Path):
    service = _service(tmp_path)
    canary_version = _prepare_staging_canary(service)
    service.start_policy_canary(
        {
            "stable_policy_version": service.get_policy_environment(EnvironmentType.PRODUCTION).policy_version,
            "canary_policy_version": canary_version,
            "canary_enabled": True,
            "traffic_percentage": 50,
            "assignment_scope": "global",
            "source_environment": "staging",
        },
        {"actor_id": "release-manager", "reason": "start canary"},
    )

    state = service.promote_policy_canary({"actor_id": "release-manager", "reason": "promote"})

    assert state.status == "promoted"
    assert service.get_policy_environment(EnvironmentType.PRODUCTION).policy_version == canary_version


def test_health_based_canary_rollback_decision(tmp_path: Path):
    service = _service(tmp_path)
    canary_version = _prepare_staging_canary(service)
    stable_version = service.get_policy_environment(EnvironmentType.PRODUCTION).policy_version
    service.start_policy_canary(
        {
            "stable_policy_version": stable_version,
            "canary_policy_version": canary_version,
            "canary_enabled": True,
            "traffic_percentage": 50,
            "assignment_scope": "global",
            "source_environment": "staging",
        },
        {"actor_id": "release-manager", "reason": "start canary"},
    )

    for index in range(5):
        trace_id = f"stable-{index}"
        service._record_telemetry_event(
            trace_id=trace_id,
            stage="response_returned",
            task_type="policy_canary",
            latency_ms=100.0,
            success=True,
            metadata={"release_channel": "stable", "policy_version": stable_version},
        )
        get_audit_logger().record_event(
            trace_id=trace_id,
            stage="response_returned",
            task_type="policy_canary",
            success=True,
            metadata={"release_channel": "stable", "policy_version": stable_version},
        )

    for index in range(5):
        trace_id = f"canary-{index}"
        service._record_telemetry_event(
            trace_id=trace_id,
            stage="provider_execution_failed",
            task_type="policy_canary",
            success=False,
            metadata={"release_channel": "canary", "policy_version": canary_version},
        )
        service._record_telemetry_event(
            trace_id=trace_id,
            stage="response_returned",
            task_type="policy_canary",
            latency_ms=900.0,
            success=False,
            metadata={"release_channel": "canary", "policy_version": canary_version},
        )

    summary = service.get_policy_canary_health()

    assert isinstance(summary, CanaryHealthSummary)
    assert summary.rollback_required is True
    assert service.get_policy_canary_state().status == "rolled_back"


def test_canary_endpoints_return_expected_structure(tmp_path: Path):
    service = _service(tmp_path)
    canary_version = _prepare_staging_canary(service)
    main.app.dependency_overrides[get_ai_control_plane_service] = lambda: service

    with TestClient(main.app) as client:
        start_response = client.post(
            "/ai/local/control-plane/policy/canary/start?actor_id=release-manager&reason=start",
            json={
                "stable_policy_version": service.get_policy_environment(EnvironmentType.PRODUCTION).policy_version,
                "canary_policy_version": canary_version,
                "canary_enabled": True,
                "traffic_percentage": 25,
                "assignment_scope": "global",
                "source_environment": "staging",
            },
        )
        state_response = client.get("/ai/local/control-plane/policy/canary/state")
        health_response = client.get("/ai/local/control-plane/policy/canary/health")
        rollback_response = client.post(
            "/ai/local/control-plane/policy/canary/rollback",
            json={"actor_id": "release-manager", "reason": "rollback"},
        )

    main.app.dependency_overrides.clear()

    assert start_response.status_code == 200
    assert state_response.status_code == 200
    assert health_response.status_code == 200
    assert rollback_response.status_code == 200
    assert "stable_policy_version" in start_response.json()
    assert "health_status" in (health_response.json() or {})
