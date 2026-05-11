from __future__ import annotations

from .models import NexoraAuditEvent, NexoraOSState

MAX_AUDIT_EVENTS = 100


def append_audit_event(state: NexoraOSState, event: NexoraAuditEvent) -> NexoraOSState:
    if any(existing.id == event.id for existing in state.auditEvents):
        return state.model_copy(deep=True)
    next_state = state.model_copy(deep=True)
    next_state.auditEvents = [event, *next_state.auditEvents][:MAX_AUDIT_EVENTS]
    return next_state
