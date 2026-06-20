export const WORKSPACE_REGISTRY_VERSION = "NW-A:1";

export type WorkspaceStatus = "active" | "archived";

export type WorkspaceId = string;

export type Workspace = Readonly<{
  workspaceId: WorkspaceId;
  workspaceName: string;
  status: WorkspaceStatus;
  createdAt: string;
  updatedAt: string;
  lastOpenedAt: string;
  domain?: string | null;
  objectCount?: number | null;
  dataSourceCount?: number | null;
  metadata?: Readonly<Record<string, unknown>>;
}>;

export type WorkspaceRegistrySnapshot = Readonly<{
  version: typeof WORKSPACE_REGISTRY_VERSION;
  workspaces: Readonly<Record<WorkspaceId, Workspace>>;
  workspaceOrder: readonly WorkspaceId[];
  activeWorkspaceId: WorkspaceId | null;
}>;

export type WorkspaceRegistryMutation =
  | Readonly<{ type: "setActiveWorkspace"; workspaceId: WorkspaceId }>
  | Readonly<{ type: "upsertWorkspace"; workspace: Workspace }>
  | Readonly<{ type: "renameWorkspace"; workspaceId: WorkspaceId; workspaceName: string; updatedAt?: string }>
  | Readonly<{ type: "archiveWorkspace"; workspaceId: WorkspaceId; archivedAt?: string }>
  | Readonly<{ type: "deleteWorkspace"; workspaceId: WorkspaceId }>;

export const DEMO_WORKSPACE_ID = "demo_workspace";
export const DEMO_WORKSPACE_NAME = "Demo Workspace";
export const DEMO_WORKSPACE_CREATED_AT = "2026-06-19T00:00:00.000Z";

export const DEMO_WORKSPACE: Workspace = Object.freeze({
  workspaceId: DEMO_WORKSPACE_ID,
  workspaceName: DEMO_WORKSPACE_NAME,
  status: "active",
  createdAt: DEMO_WORKSPACE_CREATED_AT,
  updatedAt: DEMO_WORKSPACE_CREATED_AT,
  lastOpenedAt: DEMO_WORKSPACE_CREATED_AT,
  domain: null,
  objectCount: null,
  dataSourceCount: null,
  metadata: Object.freeze({
    source: "demo_runtime_migration",
    phase: "NW-A:1",
  }),
});

export function normalizeWorkspaceId(value: unknown): WorkspaceId | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function isWorkspace(value: unknown): value is Workspace {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<Workspace>;
  return (
    typeof candidate.workspaceId === "string" &&
    candidate.workspaceId.trim().length > 0 &&
    typeof candidate.workspaceName === "string" &&
    candidate.workspaceName.trim().length > 0 &&
    (candidate.status === "active" || candidate.status === "archived") &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.updatedAt === "string" &&
    typeof candidate.lastOpenedAt === "string"
  );
}
