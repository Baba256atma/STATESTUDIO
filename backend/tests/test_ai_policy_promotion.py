from __future__ import annotations

import json
from pathlib import Path

from fastapi.testclient import TestClient

import main
from app.core.config import LocalAISettings
from app.routers.ai_control_plane import get_ai_control_plane_service
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
    _write_json(policy_path, _base_policy())
    return AIControlPlaneService(
        LocalAISettings(),
        policy_path=policy_path,
        env_policy_dir=env_policy_dir,
    )


def test_invalid_promotion_path_is_rejected(tmp_path: Path):
    service = _service(tmp_path)

    result = service.promote_policy(
        {
            "source_environment": "dev",
            "target_environment": "production",
            "requested_by": "ci",
            "approved_by": "release-manager",
            "promotion_reason": "skip not allowed",
        }
    )

    assert result.promotion_status == "blocked"
    assert "not allowed" in (result.promotion_reason or "").lower()


def test_gate_failure_blocks_promotion(tmp_path: Path):
    service = _service(tmp_path)
    service._snapshot.evaluation.regression_enabled = False

    service.promote_policy(
        {
            "source_environment": "local",
            "target_environment": "dev",
            "requested_by": "ci",
            "promotion_reason": "move to dev",
        }
    )
    result = service.promote_policy(
        {
            "source_environment": "dev",
            "target_environment": "staging",
            "requested_by": "ci",
            "approved_by": "qa-lead",
            "promotion_reason": "move to staging",
        }
    )

    assert result.promotion_status == "blocked"
    assert any(gate.gate_name == "regression_suite" and gate.passed is False for gate in result.gate_results)


def test_successful_promotion_across_environments(tmp_path: Path):
    service = _service(tmp_path)

    first = service.promote_policy(
        {
            "source_environment": "local",
            "target_environment": "dev",
            "requested_by": "ci",
            "promotion_reason": "move to dev",
        }
    )
    second = service.promote_policy(
        {
            "source_environment": "dev",
            "target_environment": "staging",
            "requested_by": "ci",
            "approved_by": "qa-lead",
            "promotion_reason": "move to staging",
        }
    )
    third = service.promote_policy(
        {
            "source_environment": "staging",
            "target_environment": "production",
            "requested_by": "ci",
            "approved_by": "release-manager",
            "promotion_reason": "move to production",
        }
    )

    assert first.promotion_status == "promoted"
    assert second.promotion_status == "promoted"
    assert third.promotion_status == "promoted"
    assert service.get_policy_environment(EnvironmentType.PRODUCTION).policy_version == service.get_snapshot().version_info.policy_version


def test_rollback_restores_last_known_good_policy(tmp_path: Path):
    service = _service(tmp_path)
    service._snapshot.model.fast_model = "fast-v2"

    service.promote_policy(
        {
            "source_environment": "local",
            "target_environment": "dev",
            "requested_by": "ci",
            "promotion_reason": "first",
        }
    )
    service._snapshot.model.fast_model = "fast-v3"
    service.promote_policy(
        {
            "source_environment": "local",
            "target_environment": "dev",
            "requested_by": "ci",
            "promotion_reason": "second",
        }
    )

    rollback = service.rollback_policy_environment(
        EnvironmentType.DEV,
        {"actor_id": "release-manager", "reason": "revert dev"},
    )

    assert rollback.rolled_back is True
    assert service.get_policy_environment(EnvironmentType.DEV).snapshot.model.fast_model == "fast-v2"


def test_environment_policy_loading_from_disk(tmp_path: Path):
    service = _service(tmp_path)
    service._snapshot.model.fast_model = "fast-v2"
    service.promote_policy(
        {
            "source_environment": "local",
            "target_environment": "dev",
            "requested_by": "ci",
            "promotion_reason": "persisted dev snapshot",
        }
    )

    reloaded = AIControlPlaneService(
        LocalAISettings(),
        policy_path=tmp_path / "ai_policy.json",
        env_policy_dir=tmp_path / "policies",
    )

    assert reloaded.get_policy_environment(EnvironmentType.DEV).snapshot.model.fast_model == "fast-v2"


def test_promotion_history_and_endpoints(tmp_path: Path):
    service = _service(tmp_path)
    main.app.dependency_overrides[get_ai_control_plane_service] = lambda: service

    with TestClient(main.app) as client:
        promote_response = client.post(
            "/ai/local/control-plane/policy/promote",
            json={
                "source_environment": "local",
                "target_environment": "dev",
                "requested_by": "ci",
                "promotion_reason": "endpoint promotion",
            },
        )
        environments_response = client.get("/ai/local/control-plane/policy/environments")
        environment_response = client.get("/ai/local/control-plane/policy/environment/dev")
        history_response = client.get("/ai/local/control-plane/policy/promotion-history")
        rollback_response = client.post(
            "/ai/local/control-plane/policy/environment/dev/rollback",
            json={"actor_id": "operator", "reason": "rollback endpoint"},
        )

    main.app.dependency_overrides.clear()

    assert promote_response.status_code == 200
    assert environments_response.status_code == 200
    assert environment_response.status_code == 200
    assert history_response.status_code == 200
    assert rollback_response.status_code == 200
    assert len(history_response.json()["records"]) >= 1
    assert "api_key" not in json.dumps(environment_response.json()).lower()

    audit_events = get_audit_logger().recent(limit=200)
    assert any(event.stage == "policy_promoted" for event in audit_events)
