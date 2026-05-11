from __future__ import annotations

import re
import time

from .models import NexoraOSState, NexoraWorkspace


def _slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", value.lower()).strip("_") or "workspace"


def create_workspace(title: str, domain: str, now: int | None = None) -> NexoraWorkspace:
    timestamp = now or int(time.time() * 1000)
    clean_title = title.strip() or "Executive Workspace"
    clean_domain = domain.strip() or "general"
    return NexoraWorkspace(
        id=f"workspace_{_slug(clean_domain)}_{_slug(clean_title)}_{timestamp}",
        title=clean_title,
        domain=clean_domain,
        createdAt=timestamp,
    )


def switch_workspace(state: NexoraOSState, workspace_id: str) -> NexoraOSState:
    if not any(workspace.id == workspace_id for workspace in state.workspaces):
        return state.model_copy(deep=True)
    next_state = state.model_copy(deep=True)
    next_state.activeWorkspaceId = workspace_id
    return next_state
