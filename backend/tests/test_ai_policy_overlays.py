from __future__ import annotations

import json
from pathlib import Path

from fastapi.testclient import TestClient

import main
from app.core.config import LocalAISettings
from app.routers.ai_control_plane import get_ai_control_plane_service
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
            "cloud_fallback_enabled": True,
            "cloud_for_reasoning_enabled": True,
            "cloud_allowed_tasks": ["analyze_scenario", "explain", "summarize_context"],
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
        "privacy": {
            "strict_mode": True,
            "cloud_blocked_sensitivity_levels": ["confidential", "restricted"],
            "local_required_sensitivity_levels": ["restricted"],
        },
    }


def test_global_only_effective_policy_resolution(tmp_path: Path):
    service = AIControlPlaneService(
        LocalAISettings(),
        policy_path=tmp_path / "ai_policy.json",
        tenant_dir=tmp_path / "tenants",
        workspace_dir=tmp_path / "workspaces",
    )
    _write_json(tmp_path / "ai_policy.json", _base_policy())
    service.reload()

    resolution = service.resolve_effective_policy()

    assert resolution.base_policy_version == "global-v1"
    assert resolution.tenant_overlay_version is None
    assert resolution.workspace_overlay_version is None
    assert resolution.effective_policy.provider.cloud_provider_enabled is True


def test_tenant_overlay_overrides_global_values(tmp_path: Path):
    base_path = tmp_path / "ai_policy.json"
    tenant_dir = tmp_path / "tenants"
    _write_json(base_path, _base_policy())
    _write_json(
        tenant_dir / "tenant-a.json",
        {
            "policy_version": "tenant-a-v1",
            "overlay": {
                "routing": {
                    "cloud_allowed_tasks": ["explain"],
                },
                "model": {
                    "reasoning_model": "tenant-reasoning-model",
                },
            },
        },
    )
    service = AIControlPlaneService(
        LocalAISettings(),
        policy_path=base_path,
        tenant_dir=tenant_dir,
        workspace_dir=tmp_path / "workspaces",
    )

    resolution = service.resolve_effective_policy(tenant_id="tenant-a")

    assert resolution.tenant_overlay_version == "tenant-a-v1"
    assert resolution.effective_policy.routing.cloud_allowed_tasks == ["explain"]
    assert resolution.effective_policy.model.reasoning_model == "tenant-reasoning-model"


def test_workspace_overlay_overrides_tenant_and_global_values(tmp_path: Path):
    base_path = tmp_path / "ai_policy.json"
    tenant_dir = tmp_path / "tenants"
    workspace_dir = tmp_path / "workspaces"
    _write_json(base_path, _base_policy())
    _write_json(
        tenant_dir / "tenant-a.json",
        {
            "policy_version": "tenant-a-v1",
            "overlay": {
                "routing": {
                    "cloud_allowed_tasks": ["explain"],
                },
            },
        },
    )
    _write_json(
        workspace_dir / "workspace-1.json",
        {
            "tenant_id": "tenant-a",
            "policy_version": "workspace-1-v1",
            "overlay": {
                "provider": {
                    "cloud_provider_enabled": False,
                },
            },
        },
    )
    service = AIControlPlaneService(
        LocalAISettings(),
        policy_path=base_path,
        tenant_dir=tenant_dir,
        workspace_dir=workspace_dir,
    )

    resolution = service.resolve_effective_policy(tenant_id="tenant-a", workspace_id="workspace-1")

    assert resolution.workspace_overlay_version == "workspace-1-v1"
    assert resolution.effective_policy.provider.cloud_provider_enabled is False
    assert resolution.effective_policy.routing.cloud_allowed_tasks == ["explain"]


def test_missing_overlay_files_fall_back_safely(tmp_path: Path):
    base_path = tmp_path / "ai_policy.json"
    _write_json(base_path, _base_policy())
    service = AIControlPlaneService(
        LocalAISettings(),
        policy_path=base_path,
        tenant_dir=tmp_path / "missing-tenants",
        workspace_dir=tmp_path / "missing-workspaces",
    )

    resolution = service.resolve_effective_policy(tenant_id="tenant-x", workspace_id="workspace-x")

    assert resolution.tenant_overlay_version is None
    assert resolution.workspace_overlay_version is None
    assert resolution.effective_policy.provider.cloud_provider_enabled is True


def test_malformed_overlay_files_fail_safely_and_reload_keeps_last_good(tmp_path: Path):
    base_path = tmp_path / "ai_policy.json"
    tenant_dir = tmp_path / "tenants"
    _write_json(base_path, _base_policy())
    _write_json(
        tenant_dir / "tenant-a.json",
        {
            "policy_version": "tenant-a-v1",
            "overlay": {
                "routing": {
                    "cloud_allowed_tasks": ["explain"],
                },
            },
        },
    )
    service = AIControlPlaneService(
        LocalAISettings(),
        policy_path=base_path,
        tenant_dir=tenant_dir,
        workspace_dir=tmp_path / "workspaces",
    )

    assert service.resolve_effective_policy(tenant_id="tenant-a").tenant_overlay_version == "tenant-a-v1"

    (tenant_dir / "tenant-a.json").write_text("{invalid-json\n", encoding="utf-8")
    state = service.reload_overlays()

    assert state.reload_succeeded is False
    assert service.resolve_effective_policy(tenant_id="tenant-a").tenant_overlay_version == "tenant-a-v1"


def test_overlay_guard_blocks_unsafe_relaxation(tmp_path: Path):
    base_path = tmp_path / "ai_policy.json"
    tenant_dir = tmp_path / "tenants"
    workspace_dir = tmp_path / "workspaces"
    base = _base_policy()
    base["provider"]["cloud_provider_enabled"] = False
    _write_json(base_path, base)
    _write_json(
        tenant_dir / "tenant-a.json",
        {
            "policy_version": "tenant-a-v1",
            "overlay": {
                "provider": {
                    "cloud_provider_enabled": True,
                },
                "privacy": {
                    "cloud_blocked_sensitivity_levels": ["restricted"],
                },
            },
        },
    )
    service = AIControlPlaneService(
        LocalAISettings(),
        policy_path=base_path,
        tenant_dir=tenant_dir,
        workspace_dir=workspace_dir,
    )

    resolution = service.resolve_effective_policy(tenant_id="tenant-a")

    assert resolution.effective_policy.provider.cloud_provider_enabled is False
    assert "confidential" in resolution.effective_policy.privacy.cloud_blocked_sensitivity_levels
    assert len(resolution.conflicts) >= 1


def test_effective_policy_diagnostics_return_expected_structure(tmp_path: Path):
    base_path = tmp_path / "ai_policy.json"
    tenant_dir = tmp_path / "tenants"
    workspace_dir = tmp_path / "workspaces"
    _write_json(base_path, _base_policy())
    _write_json(
        tenant_dir / "tenant-a.json",
        {
            "policy_version": "tenant-a-v1",
            "overlay": {
                "routing": {
                    "cloud_allowed_tasks": ["explain"],
                },
            },
        },
    )
    _write_json(
        workspace_dir / "workspace-1.json",
        {
            "tenant_id": "tenant-a",
            "policy_version": "workspace-1-v1",
            "overlay": {
                "provider": {
                    "cloud_provider_enabled": False,
                },
            },
        },
    )
    service = AIControlPlaneService(
        LocalAISettings(),
        policy_path=base_path,
        tenant_dir=tenant_dir,
        workspace_dir=workspace_dir,
    )
    main.app.dependency_overrides[get_ai_control_plane_service] = lambda: service

    with TestClient(main.app) as client:
        response_global = client.get("/ai/local/control-plane/effective-policy")
        response_tenant = client.get("/ai/local/control-plane/effective-policy/tenant-a")
        response_workspace = client.get("/ai/local/control-plane/effective-policy/tenant-a/workspace-1")
        response_trace = client.get("/ai/local/control-plane/overlay-trace/tenant-a/workspace-1")

    main.app.dependency_overrides.clear()

    assert response_global.status_code == 200
    assert response_tenant.status_code == 200
    assert response_workspace.status_code == 200
    assert response_trace.status_code == 200
    assert response_workspace.json()["workspace_overlay_version"] == "workspace-1-v1"
    assert response_trace.json()[0]["overlay_reference"]["scope_type"] == "tenant"
    assert "api_key" not in json.dumps(response_workspace.json()).lower()
