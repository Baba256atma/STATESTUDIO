"""Policy change orchestration for diff, validation, approval, and activation."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Callable

from app.schemas.control_plane import AIPolicySnapshot
from app.schemas.policy_changes import (
    PolicyApprovalAction,
    PolicyChangeDiagnostics,
    PolicyChangeListResponse,
    PolicyChangePreview,
    PolicyChangeRecord,
    PolicyChangeRequest,
)


@dataclass
class PolicyChangeService:
    """Small orchestration facade for policy change workflow methods."""

    preview_fn: Callable[[PolicyChangeRequest | dict], PolicyChangePreview]
    submit_fn: Callable[[PolicyChangeRequest | dict], PolicyChangeRecord]
    approve_fn: Callable[[str, PolicyApprovalAction | dict], PolicyChangeRecord]
    reject_fn: Callable[[str, PolicyApprovalAction | dict], PolicyChangeRecord]
    activate_fn: Callable[[str, PolicyApprovalAction | dict], PolicyChangeRecord]
    list_fn: Callable[[str | None, str | None], PolicyChangeListResponse]
    get_fn: Callable[[str], PolicyChangeRecord]
    reload_fn: Callable[[], PolicyChangeDiagnostics]
    current_snapshot_fn: Callable[[str | None, str | None], AIPolicySnapshot]

    def preview(self, request: PolicyChangeRequest | dict) -> PolicyChangePreview:
        """Preview a change without storing it."""
        return self.preview_fn(request)

    def propose(self, request: PolicyChangeRequest | dict) -> PolicyChangeRecord:
        """Create a staged policy change."""
        return self.submit_fn(request)

    def approve(self, change_id: str, action: PolicyApprovalAction | dict) -> PolicyChangeRecord:
        """Approve a staged change."""
        return self.approve_fn(change_id, action)

    def reject(self, change_id: str, action: PolicyApprovalAction | dict) -> PolicyChangeRecord:
        """Reject a staged change."""
        return self.reject_fn(change_id, action)

    def activate(self, change_id: str, action: PolicyApprovalAction | dict) -> PolicyChangeRecord:
        """Activate an approved change."""
        return self.activate_fn(change_id, action)

    def list_pending(self) -> PolicyChangeListResponse:
        """List pending policy changes only."""
        return self.list_fn("pending", None)

    def list_history(self) -> PolicyChangeListResponse:
        """List all policy changes."""
        return self.list_fn(None, None)

    def diff_for(self, change_id: str):
        """Return the diff result for a stored change."""
        return self.get_fn(change_id).diff

    def validate(self, request: PolicyChangeRequest | dict):
        """Return validation for a proposed change."""
        return self.preview_fn(request).validation

    def reload(self) -> PolicyChangeDiagnostics:
        """Revalidate active changes."""
        return self.reload_fn()
