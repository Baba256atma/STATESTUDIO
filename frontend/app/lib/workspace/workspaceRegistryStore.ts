import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import {
  DEMO_WORKSPACE,
  DEMO_WORKSPACE_ID,
  WORKSPACE_REGISTRY_VERSION,
  isWorkspace,
  normalizeWorkspaceId,
  type Workspace,
  type WorkspaceId,
  type WorkspaceRegistryMutation,
  type WorkspaceRegistrySnapshot,
} from "./workspaceRegistryContract.ts";

type WorkspaceRegistryListener = () => void;

const workspaceRegistryListeners = new Set<WorkspaceRegistryListener>();

let registryInitialized = false;
let registrySnapshot: WorkspaceRegistrySnapshot = createInitialWorkspaceRegistrySnapshot();

function createInitialWorkspaceRegistrySnapshot(): WorkspaceRegistrySnapshot {
  return Object.freeze({
    version: WORKSPACE_REGISTRY_VERSION,
    workspaces: Object.freeze({
      [DEMO_WORKSPACE_ID]: DEMO_WORKSPACE,
    }),
    workspaceOrder: Object.freeze([DEMO_WORKSPACE_ID]),
    activeWorkspaceId: DEMO_WORKSPACE_ID,
  });
}

function freezeWorkspaceRegistrySnapshot(input: {
  workspaces: Record<WorkspaceId, Workspace>;
  workspaceOrder: WorkspaceId[];
  activeWorkspaceId: WorkspaceId | null;
}): WorkspaceRegistrySnapshot {
  return Object.freeze({
    version: WORKSPACE_REGISTRY_VERSION,
    workspaces: Object.freeze({ ...input.workspaces }),
    workspaceOrder: Object.freeze([...input.workspaceOrder]),
    activeWorkspaceId: input.activeWorkspaceId,
  });
}

function emitWorkspaceRegistryChange(): void {
  for (const listener of workspaceRegistryListeners) {
    listener();
  }
}

function logWorkspaceRegistryDiagnostic(label: string, payload?: unknown): void {
  devDiagnosticLog("workspaceRegistry", label, payload);
}

function logWorkspaceLifecycleDiagnostic(label: string, payload?: unknown): void {
  devDiagnosticLog("workspaceLifecycle", label, payload);
}

function nowIso(): string {
  return new Date().toISOString();
}

function slugWorkspaceName(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return slug || "workspace";
}

function createWorkspaceId(name: string, existing: Readonly<Record<WorkspaceId, Workspace>>): WorkspaceId {
  const base = slugWorkspaceName(name);
  let candidate = `${base}_${Date.now().toString(36)}`;
  let counter = 2;
  while (existing[candidate]) {
    candidate = `${base}_${Date.now().toString(36)}_${counter}`;
    counter += 1;
  }
  return candidate;
}

function listActiveWorkspaceIdsFrom(
  workspaces: Readonly<Record<WorkspaceId, Workspace>>,
  workspaceOrder: readonly WorkspaceId[]
): WorkspaceId[] {
  return workspaceOrder.filter((workspaceId) => workspaces[workspaceId]?.status === "active");
}

function resolveProtectedActiveWorkspaceId(
  workspaces: Readonly<Record<WorkspaceId, Workspace>>,
  workspaceOrder: readonly WorkspaceId[],
  preferredWorkspaceId: WorkspaceId | null
): WorkspaceId | null {
  if (preferredWorkspaceId && workspaces[preferredWorkspaceId]?.status === "active") return preferredWorkspaceId;
  if (workspaces[DEMO_WORKSPACE_ID]?.status === "active") return DEMO_WORKSPACE_ID;
  return listActiveWorkspaceIdsFrom(workspaces, workspaceOrder)[0] ?? null;
}

function canArchiveWorkspaceInSnapshot(snapshot: WorkspaceRegistrySnapshot, workspaceId: WorkspaceId): boolean {
  if (snapshot.workspaces[workspaceId]?.status !== "active") return false;
  return listActiveWorkspaceIdsFrom(snapshot.workspaces, snapshot.workspaceOrder).length > 1;
}

function canDeleteWorkspaceInSnapshot(snapshot: WorkspaceRegistrySnapshot, workspaceId: WorkspaceId): boolean {
  if (!snapshot.workspaces[workspaceId]) return false;
  return listActiveWorkspaceIdsFrom(snapshot.workspaces, snapshot.workspaceOrder).length > 1;
}

export function listActiveWorkspaces(): readonly Workspace[] {
  const snapshot = getWorkspaceRegistrySnapshot();
  return Object.freeze(
    snapshot.workspaceOrder
      .map((workspaceId) => snapshot.workspaces[workspaceId])
      .filter((workspace): workspace is Workspace => Boolean(workspace) && workspace.status === "active")
  );
}

export function canArchiveWorkspace(workspaceId: unknown): boolean {
  const normalized = normalizeWorkspaceId(workspaceId);
  if (!normalized) return false;
  const snapshot = getWorkspaceRegistrySnapshot();
  return canArchiveWorkspaceInSnapshot(snapshot, normalized);
}

export function canDeleteWorkspace(workspaceId: unknown): boolean {
  const normalized = normalizeWorkspaceId(workspaceId);
  if (!normalized) return false;
  const snapshot = getWorkspaceRegistrySnapshot();
  return canDeleteWorkspaceInSnapshot(snapshot, normalized);
}

export function initializeWorkspaceRegistry(): WorkspaceRegistrySnapshot {
  if (registryInitialized) return registrySnapshot;
  registryInitialized = true;
  logWorkspaceRegistryDiagnostic("[WorkspaceRegistry][Init]", {
    version: WORKSPACE_REGISTRY_VERSION,
    workspaceCount: registrySnapshot.workspaceOrder.length,
    activeWorkspaceId: registrySnapshot.activeWorkspaceId,
  });
  logWorkspaceRegistryDiagnostic("[ActiveWorkspace][Resolved]", getActiveWorkspace());
  return registrySnapshot;
}

export function subscribeWorkspaceRegistry(listener: WorkspaceRegistryListener): () => void {
  workspaceRegistryListeners.add(listener);
  return () => {
    workspaceRegistryListeners.delete(listener);
  };
}

export function getWorkspaceRegistrySnapshot(): WorkspaceRegistrySnapshot {
  initializeWorkspaceRegistry();
  return registrySnapshot;
}

export function listWorkspaces(): readonly Workspace[] {
  const snapshot = getWorkspaceRegistrySnapshot();
  return Object.freeze(
    snapshot.workspaceOrder
      .map((workspaceId) => snapshot.workspaces[workspaceId])
      .filter(Boolean)
  );
}

export function getWorkspaceById(workspaceId: unknown): Workspace | null {
  const normalized = normalizeWorkspaceId(workspaceId);
  if (!normalized) return null;
  return getWorkspaceRegistrySnapshot().workspaces[normalized] ?? null;
}

export function getActiveWorkspaceId(): WorkspaceId | null {
  return getWorkspaceRegistrySnapshot().activeWorkspaceId;
}

export function getActiveWorkspace(): Workspace | null {
  const snapshot = getWorkspaceRegistrySnapshot();
  return snapshot.activeWorkspaceId ? snapshot.workspaces[snapshot.activeWorkspaceId] ?? null : null;
}

export function reduceWorkspaceRegistryMutation(
  snapshot: WorkspaceRegistrySnapshot,
  mutation: WorkspaceRegistryMutation
): WorkspaceRegistrySnapshot {
  switch (mutation.type) {
    case "setActiveWorkspace": {
      const workspaceId = normalizeWorkspaceId(mutation.workspaceId);
      if (!workspaceId || snapshot.workspaces[workspaceId]?.status !== "active") return snapshot;
      if (snapshot.activeWorkspaceId === workspaceId) return snapshot;
      const activeWorkspace = snapshot.workspaces[workspaceId];
      const workspaces = {
        ...snapshot.workspaces,
        [workspaceId]: {
          ...activeWorkspace,
          lastOpenedAt: activeWorkspace.updatedAt,
        },
      };
      return freezeWorkspaceRegistrySnapshot({
        workspaces,
        workspaceOrder: [...snapshot.workspaceOrder],
        activeWorkspaceId: workspaceId,
      });
    }
    case "upsertWorkspace": {
      if (!isWorkspace(mutation.workspace)) return snapshot;
      const exists = Boolean(snapshot.workspaces[mutation.workspace.workspaceId]);
      const workspaces = {
        ...snapshot.workspaces,
        [mutation.workspace.workspaceId]: Object.freeze({ ...mutation.workspace }),
      };
      const workspaceOrder = exists
        ? [...snapshot.workspaceOrder]
        : [...snapshot.workspaceOrder, mutation.workspace.workspaceId];
      return freezeWorkspaceRegistrySnapshot({
        workspaces,
        workspaceOrder,
        activeWorkspaceId: resolveProtectedActiveWorkspaceId(
          workspaces,
          workspaceOrder,
          snapshot.activeWorkspaceId ?? mutation.workspace.workspaceId
        ),
      });
    }
    case "renameWorkspace": {
      const workspaceId = normalizeWorkspaceId(mutation.workspaceId);
      const workspaceName = mutation.workspaceName.trim();
      if (!workspaceId || !workspaceName || !snapshot.workspaces[workspaceId]) return snapshot;
      return freezeWorkspaceRegistrySnapshot({
        workspaces: {
          ...snapshot.workspaces,
          [workspaceId]: Object.freeze({
            ...snapshot.workspaces[workspaceId],
            workspaceName,
            updatedAt: mutation.updatedAt ?? nowIso(),
          }),
        },
        workspaceOrder: [...snapshot.workspaceOrder],
        activeWorkspaceId: resolveProtectedActiveWorkspaceId(
          snapshot.workspaces,
          snapshot.workspaceOrder,
          snapshot.activeWorkspaceId
        ),
      });
    }
    case "archiveWorkspace": {
      const workspaceId = normalizeWorkspaceId(mutation.workspaceId);
      if (!workspaceId || !snapshot.workspaces[workspaceId]) return snapshot;
      if (!canArchiveWorkspaceInSnapshot(snapshot, workspaceId)) return snapshot;
      const archived = Object.freeze({
        ...snapshot.workspaces[workspaceId],
        status: "archived" as const,
        updatedAt: mutation.archivedAt ?? snapshot.workspaces[workspaceId].updatedAt,
      });
      const workspaces = {
        ...snapshot.workspaces,
        [workspaceId]: archived,
      };
      return freezeWorkspaceRegistrySnapshot({
        workspaces,
        workspaceOrder: [...snapshot.workspaceOrder],
        activeWorkspaceId: resolveProtectedActiveWorkspaceId(
          workspaces,
          snapshot.workspaceOrder,
          snapshot.activeWorkspaceId === workspaceId ? null : snapshot.activeWorkspaceId
        ),
      });
    }
    case "deleteWorkspace": {
      const workspaceId = normalizeWorkspaceId(mutation.workspaceId);
      if (!workspaceId || !snapshot.workspaces[workspaceId]) return snapshot;
      if (!canDeleteWorkspaceInSnapshot(snapshot, workspaceId)) return snapshot;
      const workspaces = { ...snapshot.workspaces };
      delete workspaces[workspaceId];
      const workspaceOrder = snapshot.workspaceOrder.filter((id) => id !== workspaceId);
      return freezeWorkspaceRegistrySnapshot({
        workspaces,
        workspaceOrder,
        activeWorkspaceId: resolveProtectedActiveWorkspaceId(
          workspaces,
          workspaceOrder,
          snapshot.activeWorkspaceId === workspaceId ? null : snapshot.activeWorkspaceId
        ),
      });
    }
    default:
      return snapshot;
  }
}

export function dispatchWorkspaceRegistryMutation(mutation: WorkspaceRegistryMutation): WorkspaceRegistrySnapshot {
  initializeWorkspaceRegistry();
  const next = reduceWorkspaceRegistryMutation(registrySnapshot, mutation);
  if (next === registrySnapshot) return registrySnapshot;
  registrySnapshot = next;
  logWorkspaceRegistryDiagnostic("[WorkspaceRegistry][Mutation]", {
    type: mutation.type,
    activeWorkspaceId: registrySnapshot.activeWorkspaceId,
    workspaceCount: registrySnapshot.workspaceOrder.length,
  });
  logWorkspaceRegistryDiagnostic("[ActiveWorkspace][Resolved]", getActiveWorkspace());
  emitWorkspaceRegistryChange();
  return registrySnapshot;
}

export function setActiveWorkspace(workspaceId: WorkspaceId): WorkspaceRegistrySnapshot {
  return dispatchWorkspaceRegistryMutation({ type: "setActiveWorkspace", workspaceId });
}

export function upsertWorkspace(workspace: Workspace): WorkspaceRegistrySnapshot {
  return dispatchWorkspaceRegistryMutation({ type: "upsertWorkspace", workspace });
}

export function createWorkspace(workspaceName: string): Workspace {
  initializeWorkspaceRegistry();
  const normalizedName = workspaceName.trim() || "Untitled Workspace";
  const timestamp = nowIso();
  const workspace: Workspace = Object.freeze({
    workspaceId: createWorkspaceId(normalizedName, registrySnapshot.workspaces),
    workspaceName: normalizedName,
    status: "active",
    createdAt: timestamp,
    updatedAt: timestamp,
    lastOpenedAt: timestamp,
    domain: null,
    objectCount: 0,
    dataSourceCount: 0,
    metadata: Object.freeze({
      lifecycle: "empty_workspace",
      phase: "NW-A:3",
    }),
  });
  upsertWorkspace(workspace);
  setActiveWorkspace(workspace.workspaceId);
  logWorkspaceLifecycleDiagnostic("[WorkspaceLifecycle] Created Workspace", {
    workspaceId: workspace.workspaceId,
    workspaceName: workspace.workspaceName,
  });
  return workspace;
}

export function renameWorkspace(
  workspaceId: WorkspaceId,
  workspaceName: string,
  updatedAt?: string
): WorkspaceRegistrySnapshot {
  const next = dispatchWorkspaceRegistryMutation({
    type: "renameWorkspace",
    workspaceId,
    workspaceName,
    updatedAt,
  });
  logWorkspaceLifecycleDiagnostic("[WorkspaceLifecycle] Renamed Workspace", {
    workspaceId,
    workspaceName: getWorkspaceById(workspaceId)?.workspaceName ?? null,
  });
  return next;
}

export function duplicateWorkspace(workspaceId: WorkspaceId): Workspace | null {
  initializeWorkspaceRegistry();
  const source = getWorkspaceById(workspaceId);
  if (!source) return null;
  const timestamp = nowIso();
  const workspace: Workspace = Object.freeze({
    ...source,
    workspaceId: createWorkspaceId(`${source.workspaceName} Copy`, registrySnapshot.workspaces),
    workspaceName: `${source.workspaceName} Copy`,
    status: "active",
    createdAt: timestamp,
    updatedAt: timestamp,
    lastOpenedAt: timestamp,
    metadata: Object.freeze({
      ...(source.metadata ?? {}),
      duplicatedFromWorkspaceId: source.workspaceId,
      phase: "NW-A:3",
    }),
  });
  upsertWorkspace(workspace);
  setActiveWorkspace(workspace.workspaceId);
  logWorkspaceLifecycleDiagnostic("[WorkspaceLifecycle] Duplicated Workspace", {
    sourceWorkspaceId: source.workspaceId,
    workspaceId: workspace.workspaceId,
    workspaceName: workspace.workspaceName,
  });
  return workspace;
}

export function archiveWorkspace(workspaceId: WorkspaceId, archivedAt?: string): WorkspaceRegistrySnapshot {
  const before = registrySnapshot;
  const next = dispatchWorkspaceRegistryMutation({ type: "archiveWorkspace", workspaceId, archivedAt });
  if (next !== before) {
    logWorkspaceLifecycleDiagnostic("[WorkspaceLifecycle] Archived Workspace", {
      workspaceId,
      activeWorkspaceId: next.activeWorkspaceId,
    });
  }
  return next;
}

export function deleteWorkspace(workspaceId: WorkspaceId): WorkspaceRegistrySnapshot {
  const before = registrySnapshot;
  const next = dispatchWorkspaceRegistryMutation({ type: "deleteWorkspace", workspaceId });
  if (next !== before) {
    logWorkspaceLifecycleDiagnostic("[WorkspaceLifecycle] Deleted Workspace", {
      workspaceId,
      activeWorkspaceId: next.activeWorkspaceId,
    });
  }
  return next;
}

export function resetWorkspaceRegistryForTests(): void {
  registryInitialized = false;
  registrySnapshot = createInitialWorkspaceRegistrySnapshot();
  workspaceRegistryListeners.clear();
}
