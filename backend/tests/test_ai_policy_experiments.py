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
    experiment_state_path = tmp_path / "policies" / "experiments.json"
    _write_json(policy_path, _base_policy())
    return AIControlPlaneService(
        LocalAISettings(),
        policy_path=policy_path,
        env_policy_dir=env_policy_dir,
        experiment_state_path=experiment_state_path,
    )


def _prepare_variant(service: AIControlPlaneService) -> str:
    service._snapshot.model.fast_model = "fast-variant-v2"
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


def _create_experiment(service: AIControlPlaneService, variant_version: str) -> str:
    experiment = service.create_policy_experiment(
        {
            "experiment_name": "Routing Variant Test",
            "control_policy_version": service.get_policy_environment(EnvironmentType.PRODUCTION).policy_version,
            "variants": [
                {
                    "variant_name": "variant_b",
                    "policy_version": variant_version,
                    "source_environment": "staging",
                }
            ],
            "traffic_split": {"control": 50, "variant_b": 50},
            "assignment_scope": "global",
        },
        {"actor_id": "experiment-owner", "reason": "create"},
    )
    return experiment.experiment_id


def test_deterministic_variant_assignment(tmp_path: Path):
    service = _service(tmp_path)
    experiment_id = _create_experiment(service, _prepare_variant(service))
    service.start_policy_experiment(experiment_id, {"actor_id": "experiment-owner", "reason": "start"})

    first = service.assign_policy_experiment(experiment_id, {"trace_id": "trace-123"})
    second = service.assign_policy_experiment(experiment_id, {"trace_id": "trace-123"})

    assert first.selected_variant == second.selected_variant
    assert first.request_hash_bucket == second.request_hash_bucket


def test_traffic_split_behavior(tmp_path: Path):
    service = _service(tmp_path)
    variant_version = _prepare_variant(service)
    experiment = service.create_policy_experiment(
        {
            "experiment_name": "All Variant Traffic",
            "control_policy_version": service.get_policy_environment(EnvironmentType.PRODUCTION).policy_version,
            "variants": [{"variant_name": "variant_b", "policy_version": variant_version}],
            "traffic_split": {"control": 0, "variant_b": 100},
            "assignment_scope": "global",
        },
        {"actor_id": "experiment-owner", "reason": "create"},
    )
    service.start_policy_experiment(experiment.experiment_id, {"actor_id": "experiment-owner", "reason": "start"})

    assignment = service.assign_policy_experiment(experiment.experiment_id, {"trace_id": "always-variant"})

    assert assignment.selected_variant == "variant_b"


def test_experiment_lifecycle_transitions(tmp_path: Path):
    service = _service(tmp_path)
    experiment_id = _create_experiment(service, _prepare_variant(service))

    started = service.start_policy_experiment(experiment_id, {"actor_id": "owner", "reason": "start"})
    paused = service.pause_policy_experiment(experiment_id, {"actor_id": "owner", "reason": "pause"})
    completed = service.complete_policy_experiment(experiment_id, {"actor_id": "owner", "reason": "complete"})

    assert started.status == "active"
    assert paused.status == "paused"
    assert completed.status == "completed"


def test_result_aggregation_and_winner_selection(tmp_path: Path):
    service = _service(tmp_path)
    variant_version = _prepare_variant(service)
    experiment_id = _create_experiment(service, variant_version)
    service.start_policy_experiment(experiment_id, {"actor_id": "owner", "reason": "start"})
    control_version = service.get_policy_environment(EnvironmentType.PRODUCTION).policy_version

    for index in range(6):
        trace_id = f"control-{index}"
        service._record_telemetry_event(
            trace_id=trace_id,
            stage="response_returned",
            task_type="policy_experiment",
            latency_ms=200.0,
            success=True,
            metadata={
                "experiment_id": experiment_id,
                "selected_variant": "control",
                "policy_version": control_version,
            },
        )
        get_audit_logger().record_event(
            trace_id=trace_id,
            stage="response_returned",
            task_type="policy_experiment",
            success=True,
            metadata={
                "experiment_id": experiment_id,
                "selected_variant": "control",
                "policy_version": control_version,
            },
        )

    for index in range(6):
        trace_id = f"variant-{index}"
        service._record_telemetry_event(
            trace_id=trace_id,
            stage="response_returned",
            task_type="policy_experiment",
            latency_ms=120.0,
            success=True,
            metadata={
                "experiment_id": experiment_id,
                "selected_variant": "variant_b",
                "policy_version": variant_version,
            },
        )
        get_audit_logger().record_event(
            trace_id=trace_id,
            stage="response_returned",
            task_type="policy_experiment",
            success=True,
            metadata={
                "experiment_id": experiment_id,
                "selected_variant": "variant_b",
                "policy_version": variant_version,
            },
        )

    results = service.get_policy_experiment_results(experiment_id)

    assert results.metrics_summary is not None
    assert results.metrics_summary.winning_variant == "variant_b"
    assert results.decision is not None
    assert results.decision.promotion_ready is True


def test_safe_stop_behavior_returns_control(tmp_path: Path):
    service = _service(tmp_path)
    experiment_id = _create_experiment(service, _prepare_variant(service))
    service.start_policy_experiment(experiment_id, {"actor_id": "owner", "reason": "start"})
    service.stop_policy_experiment(experiment_id, {"actor_id": "owner", "reason": "stop"})

    assignment = service.assign_policy_experiment(experiment_id, {"trace_id": "stop-check"})

    assert assignment.selected_variant == "control"


def test_endpoints_return_expected_structure(tmp_path: Path):
    service = _service(tmp_path)
    variant_version = _prepare_variant(service)
    main.app.dependency_overrides[get_ai_control_plane_service] = lambda: service

    with TestClient(main.app) as client:
        create_response = client.post(
            "/ai/local/control-plane/policy/experiments/create?actor_id=owner&reason=create",
            json={
                "experiment_name": "Endpoint Experiment",
                "control_policy_version": service.get_policy_environment(EnvironmentType.PRODUCTION).policy_version,
                "variants": [{"variant_name": "variant_b", "policy_version": variant_version}],
                "traffic_split": {"control": 50, "variant_b": 50},
                "assignment_scope": "global",
            },
        )
        experiment_id = create_response.json()["experiment_id"]
        start_response = client.post(
            f"/ai/local/control-plane/policy/experiments/start?experiment_id={experiment_id}",
            json={"actor_id": "owner", "reason": "start"},
        )
        list_response = client.get("/ai/local/control-plane/policy/experiments")
        detail_response = client.get(f"/ai/local/control-plane/policy/experiments/{experiment_id}")
        results_response = client.get(f"/ai/local/control-plane/policy/experiments/{experiment_id}/results")

    main.app.dependency_overrides.clear()

    assert create_response.status_code == 200
    assert start_response.status_code == 200
    assert list_response.status_code == 200
    assert detail_response.status_code == 200
    assert results_response.status_code == 200
    assert "experiment_name" in detail_response.json()
    assert "metrics_summary" in results_response.json()
