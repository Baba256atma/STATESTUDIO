"""In-memory and file-backed storage for tenant and workspace policy overlays."""

from __future__ import annotations

from pathlib import Path

from app.schemas.policy_overlays import TenantPolicyOverlay, WorkspacePolicyOverlay
from app.services.ai.control_plane.overlay_loader import PolicyOverlayLoader


class PolicyOverlayStore:
    """Manage loaded tenant and workspace overlays with safe reload behavior."""

    def __init__(
        self,
        tenant_dir: str | Path | None = None,
        workspace_dir: str | Path | None = None,
    ) -> None:
        self.loader = PolicyOverlayLoader(tenant_dir=tenant_dir, workspace_dir=workspace_dir)
        self._tenant_overlays: dict[str, TenantPolicyOverlay] = {}
        self._workspace_overlays: dict[str, WorkspacePolicyOverlay] = {}
        self._last_error: str | None = None
        self.reload()

    def reload(self) -> bool:
        """Reload overlay state while preserving the last known-good state on failure."""
        try:
            tenant_overlays = self.loader.load_tenant_overlays()
            workspace_overlays = self.loader.load_workspace_overlays()
            self._tenant_overlays = tenant_overlays
            self._workspace_overlays = workspace_overlays
            self._last_error = None
            return True
        except Exception as exc:
            self._last_error = str(exc)
            return False

    def get_tenant_overlay(self, tenant_id: str | None) -> TenantPolicyOverlay | None:
        """Return a tenant overlay by tenant identifier."""
        if not tenant_id:
            return None
        return self._tenant_overlays.get(tenant_id)

    def get_workspace_overlay(self, workspace_id: str | None) -> WorkspacePolicyOverlay | None:
        """Return a workspace overlay by workspace identifier."""
        if not workspace_id:
            return None
        return self._workspace_overlays.get(workspace_id)

    def list_tenant_overlays(self) -> dict[str, TenantPolicyOverlay]:
        """Return all loaded tenant overlays."""
        return dict(self._tenant_overlays)

    def list_workspace_overlays(self) -> dict[str, WorkspacePolicyOverlay]:
        """Return all loaded workspace overlays."""
        return dict(self._workspace_overlays)

    def last_error(self) -> str | None:
        """Return the most recent overlay reload error, if any."""
        return self._last_error
