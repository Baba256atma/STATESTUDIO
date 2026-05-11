from __future__ import annotations

from app.services.nexora_os import (
    append_audit_event,
    approve_request,
    create_approval_request,
    create_workspace,
    enforce_governance,
    switch_workspace,
)
from app.services.nexora_os.models import NexoraApprovalRequest, NexoraAuditEvent, NexoraOSState


def test_workspace_creation_and_switching():
    workspace = create_workspace("Supply Chain", "type_c", now=100)
    state = NexoraOSState(workspaces=[workspace], activeWorkspaceId=None)
    switched = switch_workspace(state, workspace.id)
    assert switched.activeWorkspaceId == workspace.id
    assert state.activeWorkspaceId is None


def test_approval_validation_and_resolution():
    state = NexoraOSState()
    request = NexoraApprovalRequest(id="approval_1", action="start_execution", requestedBy="manager")
    requested = create_approval_request(state, request)
    assert len(requested.approvals) == 1
    assert requested.approvals[0].approved is False
    approved = approve_request(requested, "approval_1")
    assert approved.approvals[0].approved is True


def test_audit_logging_is_deduped():
    state = NexoraOSState()
    event = NexoraAuditEvent(id="audit_1", type="simulation", timestamp=100, details="Scenario simulated")
    once = append_audit_event(state, event)
    twice = append_audit_event(once, event)
    assert len(once.auditEvents) == len(twice.auditEvents)


def test_governance_blocks_critical_action_without_approval():
    state = NexoraOSState()
    decision = enforce_governance(state, "start_execution")
    assert decision["allowed"] is False
    assert decision["approvalRequired"] is True


def test_governance_allows_critical_action_with_approval():
    state = NexoraOSState(
        approvals=[
            NexoraApprovalRequest(
                id="approval_1",
                action="start_execution",
                requestedBy="manager",
                approved=True,
            )
        ]
    )
    decision = enforce_governance(state, "start_execution", approval_id="approval_1")
    assert decision["allowed"] is True


def test_governance_allows_non_critical_action():
    decision = enforce_governance(NexoraOSState(), "view_workspace")
    assert decision["allowed"] is True
    assert decision["approvalRequired"] is False
