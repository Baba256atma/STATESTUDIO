"""File-backed loading helpers for tenant and workspace policy overlays."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from app.schemas.policy_overlays import TenantPolicyOverlay, WorkspacePolicyOverlay


BACKEND_ROOT = Path(__file__).resolve().parents[4]
DEFAULT_TENANT_OVERLAY_DIR = BACKEND_ROOT / "config" / "tenants"
DEFAULT_WORKSPACE_OVERLAY_DIR = BACKEND_ROOT / "config" / "workspaces"


class PolicyOverlayLoader:
    """Load typed tenant and workspace policy overlays from local storage."""

    def __init__(
        self,
        tenant_dir: str | Path | None = None,
        workspace_dir: str | Path | None = None,
    ) -> None:
        self.tenant_dir = Path(tenant_dir) if tenant_dir is not None else DEFAULT_TENANT_OVERLAY_DIR
        self.workspace_dir = Path(workspace_dir) if workspace_dir is not None else DEFAULT_WORKSPACE_OVERLAY_DIR

    def load_tenant_overlays(self) -> dict[str, TenantPolicyOverlay]:
        """Load all tenant overlays from disk."""
        overlays: dict[str, TenantPolicyOverlay] = {}
        for path in self._iter_overlay_files(self.tenant_dir):
            payload = self._read_payload(path)
            overlay = TenantPolicyOverlay.model_validate(
                {
                    **payload,
                    "scope_type": "tenant",
                    "scope_id": payload.get("scope_id") or path.stem,
                    "source": str(path),
                }
            )
            overlays[overlay.scope_id] = overlay
        return overlays

    def load_workspace_overlays(self) -> dict[str, WorkspacePolicyOverlay]:
        """Load all workspace overlays from disk."""
        overlays: dict[str, WorkspacePolicyOverlay] = {}
        for path in self._iter_overlay_files(self.workspace_dir):
            payload = self._read_payload(path)
            overlay = WorkspacePolicyOverlay.model_validate(
                {
                    **payload,
                    "scope_type": "workspace",
                    "scope_id": payload.get("scope_id") or path.stem,
                    "source": str(path),
                }
            )
            overlays[overlay.scope_id] = overlay
        return overlays

    @staticmethod
    def _iter_overlay_files(directory: Path) -> list[Path]:
        if not directory.exists() or not directory.is_dir():
            return []
        return sorted(
            [
                path
                for path in directory.iterdir()
                if path.is_file() and path.suffix.lower() in {".json", ".yaml", ".yml"}
            ]
        )

    @staticmethod
    def _read_payload(path: Path) -> dict[str, Any]:
        suffix = path.suffix.lower()
        raw_text = path.read_text(encoding="utf-8")
        if suffix == ".json":
            payload = json.loads(raw_text)
        elif suffix in {".yaml", ".yml"}:
            try:
                import yaml
            except ImportError as exc:
                raise ValueError("yaml_support_not_installed") from exc
            payload = yaml.safe_load(raw_text)
        else:
            raise ValueError("unsupported_overlay_format")

        if not isinstance(payload, dict):
            raise ValueError("overlay_payload_must_be_object")
        return payload
