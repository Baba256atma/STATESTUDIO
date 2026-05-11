from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field


class NexoraWorkspace(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    title: str
    domain: str
    createdAt: int
    activeScenarioId: str | None = None


class NexoraApprovalRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    action: str
    requestedBy: str
    approved: bool = False


class NexoraAuditEvent(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    type: str
    timestamp: int
    details: str


class NexoraOSState(BaseModel):
    model_config = ConfigDict(extra="forbid")

    workspaces: list[NexoraWorkspace] = Field(default_factory=list)
    activeWorkspaceId: str | None = None
    approvals: list[NexoraApprovalRequest] = Field(default_factory=list)
    auditEvents: list[NexoraAuditEvent] = Field(default_factory=list)
