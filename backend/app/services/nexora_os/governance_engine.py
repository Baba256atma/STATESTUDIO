from __future__ import annotations

from .models import NexoraOSState

CRITICAL_ACTIONS = {
    "execute_strategy",
    "start_execution",
    "promote_sandbox",
    "production_change",
}


def enforce_governance(state: NexoraOSState, action: str, approval_id: str | None = None) -> dict[str, object]:
    """Return an explainable permission decision without executing anything."""
    if action not in CRITICAL_ACTIONS:
        return {
            "allowed": True,
            "reason": "non_critical_action",
            "approvalRequired": False,
        }

    if approval_id and any(approval.id == approval_id and approval.approved for approval in state.approvals):
        return {
            "allowed": True,
            "reason": "approved_by_manager",
            "approvalRequired": True,
        }

    return {
        "allowed": False,
        "reason": "manager_approval_required",
        "approvalRequired": True,
    }
