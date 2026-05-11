from __future__ import annotations

from .models import NexoraApprovalRequest, NexoraOSState


def create_approval_request(state: NexoraOSState, request: NexoraApprovalRequest) -> NexoraOSState:
    if any(existing.id == request.id for existing in state.approvals):
        return state.model_copy(deep=True)
    next_state = state.model_copy(deep=True)
    next_state.approvals.append(request.model_copy(update={"approved": False}))
    return next_state


def approve_request(state: NexoraOSState, approval_id: str) -> NexoraOSState:
    next_state = state.model_copy(deep=True)
    for index, approval in enumerate(next_state.approvals):
        if approval.id == approval_id:
            next_state.approvals[index] = approval.model_copy(update={"approved": True})
            return next_state
    return next_state


def reject_request(state: NexoraOSState, approval_id: str) -> NexoraOSState:
    next_state = state.model_copy(deep=True)
    for index, approval in enumerate(next_state.approvals):
        if approval.id == approval_id:
            next_state.approvals[index] = approval.model_copy(update={"approved": False})
            return next_state
    return next_state
