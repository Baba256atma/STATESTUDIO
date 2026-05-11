import type {
  NexoraApprovalRequest,
  NexoraAuditEvent,
  NexoraOSModuleId,
  NexoraOSStateSnapshot,
  NexoraWorkspace,
} from "./NexoraOSContracts.ts";

const MAX_AUDIT_EVENTS = 80;

function sanitizeId(value: string): string {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function uniqueById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of items) {
    if (!item.id || seen.has(item.id)) continue;
    seen.add(item.id);
    result.push(item);
  }
  return result;
}

export function createNexoraWorkspace(input: {
  title: string;
  domain: string;
  now?: number;
  activeScenarioId?: string | null;
}): NexoraWorkspace {
  const createdAt = input.now ?? Date.now();
  const domain = input.domain.trim() || "general";
  const title = input.title.trim() || "Executive Workspace";
  return {
    id: `workspace_${sanitizeId(domain)}_${sanitizeId(title)}_${createdAt}`,
    title,
    domain,
    createdAt,
    activeScenarioId: input.activeScenarioId ?? null,
  };
}

export function createDefaultNexoraOSState(now = Date.now()): NexoraOSStateSnapshot {
  const workspace = createNexoraWorkspace({
    title: "Executive Command Environment",
    domain: "type_c",
    now,
  });
  return {
    workspaces: [workspace],
    activeWorkspaceId: workspace.id,
    approvals: [],
    auditEvents: [
      {
        id: `audit_os_started_${now}`,
        type: "os_started",
        timestamp: now,
        details: "Nexora OS governance shell initialized.",
      },
    ],
    activeModule: "strategic_workspace",
  };
}

export function addNexoraWorkspace(
  state: NexoraOSStateSnapshot,
  workspace: NexoraWorkspace
): NexoraOSStateSnapshot {
  const workspaces = uniqueById([...(state.workspaces ?? []), workspace]);
  return {
    ...state,
    workspaces,
    activeWorkspaceId: state.activeWorkspaceId ?? workspace.id,
  };
}

export function switchNexoraWorkspace(
  state: NexoraOSStateSnapshot,
  workspaceId: string
): NexoraOSStateSnapshot {
  if (!state.workspaces.some((workspace) => workspace.id === workspaceId)) return state;
  return {
    ...state,
    activeWorkspaceId: workspaceId,
  };
}

export function requestNexoraApproval(
  state: NexoraOSStateSnapshot,
  request: Omit<NexoraApprovalRequest, "approved">
): NexoraOSStateSnapshot {
  if (!request.id || state.approvals.some((candidate) => candidate.id === request.id)) return state;
  return {
    ...state,
    approvals: [...state.approvals, { ...request, approved: false }],
  };
}

export function resolveNexoraApproval(
  state: NexoraOSStateSnapshot,
  approvalId: string,
  approved: boolean
): NexoraOSStateSnapshot {
  if (!state.approvals.some((candidate) => candidate.id === approvalId)) return state;
  return {
    ...state,
    approvals: state.approvals.map((approval) =>
      approval.id === approvalId ? { ...approval, approved } : approval
    ),
  };
}

export function appendNexoraAuditEvent(
  state: NexoraOSStateSnapshot,
  event: NexoraAuditEvent
): NexoraOSStateSnapshot {
  if (!event.id || state.auditEvents.some((candidate) => candidate.id === event.id)) return state;
  return {
    ...state,
    auditEvents: [event, ...state.auditEvents].slice(0, MAX_AUDIT_EVENTS),
  };
}

export function setNexoraOSModule(
  state: NexoraOSStateSnapshot,
  activeModule: NexoraOSModuleId
): NexoraOSStateSnapshot {
  if (state.activeModule === activeModule) return state;
  return {
    ...state,
    activeModule,
  };
}
