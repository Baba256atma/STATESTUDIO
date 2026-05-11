export type NexoraOSModuleId =
  | "strategic_workspace"
  | "war_room"
  | "multi_agent"
  | "sandbox"
  | "execution"
  | "memory"
  | "governance";

export type NexoraWorkspace = {
  id: string;
  title: string;
  domain: string;
  createdAt: number;
  activeScenarioId?: string | null;
};

export type NexoraApprovalRequest = {
  id: string;
  action: string;
  requestedBy: string;
  approved: boolean;
};

export type NexoraAuditEvent = {
  id: string;
  type: string;
  timestamp: number;
  details: string;
};

export type NexoraOSStateSnapshot = {
  workspaces: NexoraWorkspace[];
  activeWorkspaceId: string | null;
  approvals: NexoraApprovalRequest[];
  auditEvents: NexoraAuditEvent[];
  activeModule: NexoraOSModuleId;
};

export type NexoraOSRouteIntent = {
  module: NexoraOSModuleId;
  reason: string;
};
