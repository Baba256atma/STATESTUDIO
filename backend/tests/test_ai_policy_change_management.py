from __future__ import annotations

import json
from pathlib import Path

from fastapi.testclient import TestClient

import main
from app.core.config import LocalAISettings
from app.routers.ai_control_plane import get_ai_control_plane_service
from app.services.ai.audit_logger import get_audit_logger
from app.services.ai.control_plane.control_plane_service import AIControlPlaneService


def _write_json(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


def _base_policy() -> dict:
    return {
        "version_info": {
            "policy_version": "global-v1",
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
    }


def test_preview_policy_change_returns_diff_validation_and_approval(tmp_path: Path):
    base_path = tmp_path / "ai_policy.json"
    _write_json(base_path, _base_policy())
    service = AIControlPlaneService(LocalAISettings(), policy_path=base_path)

    preview = service.preview_policy_change(
        {
            "title": "Switch reasoning model",
            "scope_type": "global",
            "payload": {"model": {"reasoning_model": "custom-reasoning-model"}},
        }
    )

    assert preview.diff.changed_fields == ["model.reasoning_model"]
    assert preview.validation.valid is True
    assert preview.approval.risk_level in {"medium", "low"}


def test_high_risk_change_requires_approval_and_activation(tmp_path: Path):
    base_path = tmp_path / "ai_policy.json"
    _write_json(base_path, _base_policy())
    service = AIControlPlaneService(LocalAISettings(), policy_path=base_path)

    record = service.submit_policy_change(
        {
            "title": "Enable cloud routing",
            "scope_type": "global",
            "proposed_by": "architect",
            "payload": {
                "provider": {"cloud_provider_enabled": True},
                "routing": {
                    "cloud_fallback_enabled": True,
                    "cloud_for_reasoning_enabled": True,
                },
            },
        }
    )

    assert record.status == "pending"
    approved = service.approve_policy_change(record.change_id, {"actor_id": "policy-admin", "reason": "reviewed"})
    activated = service.activate_policy_change(approved.change_id, {"actor_id": "policy-admin", "reason": "activate"})

    assert activated.status == "activated"
    assert service.get_snapshot().provider.cloud_provider_enabled is True
    assert service.get_snapshot().routing.cloud_fallback_enabled is True


def test_invalid_change_fails_validation(tmp_path: Path):
    base_path = tmp_path / "ai_policy.json"
    _write_json(base_path, _base_policy())
    service = AIControlPlaneService(LocalAISettings(), policy_path=base_path)

    record = service.submit_policy_change(
        {
            "title": "Remove restricted local guard",
            "scope_type": "global",
            "payload": {
                "privacy": {
                    "cloud_blocked_sensitivity_levels": ["confidential"],
                    "local_required_sensitivity_levels": [],
                }
            },
        }
    )

    assert record.status == "validation_failed"
    assert any(issue.code == "restricted_cloud_block_missing" for issue in record.validation.issues)


def test_overlay_change_guard_blocks_unsafe_relaxation(tmp_path: Path):
    base_path = tmp_path / "ai_policy.json"
    tenant_dir = tmp_path / "tenants"
    _write_json(base_path, _base_policy())
    _write_json(
        tenant_dir / "tenant-a.json",
        {
            "policy_version": "tenant-a-v1",
            "overlay": {
                "provider": {"cloud_provider_enabled": False},
            },
        },
    )
    service = AIControlPlaneService(LocalAISettings(), policy_path=base_path, tenant_dir=tenant_dir)

    preview = service.preview_policy_change(
        {
            "title": "Tenant tries to re-enable cloud",
            "scope_type": "tenant",
            "tenant_id": "tenant-a",
            "payload": {
                "provider": {"cloud_provider_enabled": True},
            },
        }
    )

    assert "provider.cloud_provider_enabled" in preview.blocked_fields
    assert preview.validation.valid is True
    assert service.resolve_effective_policy(tenant_id="tenant-a").effective_policy.provider.cloud_provider_enabled is False


def test_policy_change_diagnostics_endpoints_and_audit_integration(tmp_path: Path):
    base_path = tmp_path / "ai_policy.json"
    _write_json(base_path, _base_policy())
    service = AIControlPlaneService(LocalAISettings(), policy_path=base_path)
    main.app.dependency_overrides[get_ai_control_plane_service] = lambda: service

    with TestClient(main.app) as client:
        submit_response = client.post(
            "/ai/local/control-plane/policy-changes",
            json={
                "title": "Change extraction model",
                "scope_type": "global",
                "proposed_by": "architect",
                "payload": {"model": {"extraction_model": "custom-extraction-model"}},
            },
        )
        change_id = submit_response.json()["change_id"]
        approve_response = client.post(
            f"/ai/local/control-plane/policy-changes/{change_id}/approve",
            json={"actor_id": "operator", "reason": "approved"},
        )
        activate_response = client.post(
            f"/ai/local/control-plane/policy-changes/{change_id}/activate",
            json={"actor_id": "operator", "reason": "activate"},
        )
        diagnostics_response = client.get("/ai/local/control-plane/policy-changes/diagnostics/state")
        list_response = client.get("/ai/local/control-plane/policy-changes")
        pending_response = client.get("/ai/local/control-plane/policy/pending")
        history_response = client.get("/ai/local/control-plane/policy/history")
        diff_response = client.get(f"/ai/local/control-plane/policy/diff/{change_id}")
        approval_response = client.get(f"/ai/local/control-plane/policy/approval/{change_id}")
        audit_record_response = client.get(f"/ai/local/control-plane/policy/audit/{change_id}")

    main.app.dependency_overrides.clear()

    assert submit_response.status_code == 200
    assert approve_response.status_code == 200
    assert activate_response.status_code == 200
    assert diagnostics_response.status_code == 200
    assert list_response.status_code == 200
    assert pending_response.status_code == 200
    assert history_response.status_code == 200
    assert diff_response.status_code == 200
    assert approval_response.status_code == 200
    assert audit_record_response.status_code == 200
    assert diagnostics_response.json()["counts_by_status"]["activated"] >= 1
    assert "api_key" not in json.dumps(list_response.json()).lower()

    audit_events = [
        event
        for event in get_audit_logger().recent(limit=200)
        if event.trace_id == change_id
    ]
    assert any(event.stage == "policy_change_submitted" for event in audit_events)
    assert any(event.stage == "policy_change_activated" for event in audit_events)
    assert any(event.stage == "policy_change_validated" for event in audit_events)


def test_reload_policy_changes_preserves_last_known_good(tmp_path: Path):
    base_path = tmp_path / "ai_policy.json"
    _write_json(base_path, _base_policy())
    service = AIControlPlaneService(LocalAISettings(), policy_path=base_path)

    first = service.submit_policy_change(
        {
            "title": "Safe model change",
            "scope_type": "global",
            "payload": {"model": {"fast_model": "fast-v2"}},
        }
    )
    first = service.approve_policy_change(first.change_id, {"actor_id": "operator", "reason": "approve"})
    first = service.activate_policy_change(first.change_id, {"actor_id": "operator", "reason": "activate"})

    second = service.submit_policy_change(
        {
            "title": "Invalid restricted policy",
            "scope_type": "global",
            "payload": {"privacy": {"local_required_sensitivity_levels": []}},
        }
    )

    diagnostics = service.reload_policy_changes()

    assert first.status == "activated"
    assert second.status == "validation_failed"
    assert diagnostics.last_reload_succeeded is True
    assert service.get_snapshot().model.fast_model == "fast-v2"


def test_policy_endpoints_validate_and_pending_state(tmp_path: Path):
    base_path = tmp_path / "ai_policy.json"
    _write_json(base_path, _base_policy())
    service = AIControlPlaneService(LocalAISettings(), policy_path=base_path)
    main.app.dependency_overrides[get_ai_control_plane_service] = lambda: service

    with TestClient(main.app) as client:
        validate_response = client.post(
            "/ai/local/control-plane/policy/validate",
            json={
                "title": "Unsafe privacy change",
                "scope_type": "global",
                "payload": {"privacy": {"cloud_blocked_sensitivity_levels": ["confidential"]}},
            },
        )
        propose_response = client.post(
            "/ai/local/control-plane/policy/propose",
            json={
                "title": "Enable cloud routing",
                "scope_type": "global",
                "payload": {
                    "provider": {"cloud_provider_enabled": True},
                    "routing": {"cloud_fallback_enabled": True},
                },
            },
        )
        pending_response = client.get("/ai/local/control-plane/policy/pending")

    main.app.dependency_overrides.clear()

    assert validate_response.status_code == 200
    assert validate_response.json()["valid"] is False
    assert propose_response.status_code == 200
    assert propose_response.json()["status"] == "pending"
    assert len(pending_response.json()["changes"]) >= 1
