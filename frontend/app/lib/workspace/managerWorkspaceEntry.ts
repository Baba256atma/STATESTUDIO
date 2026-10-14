import {
  DEMO_WORKSPACE_ID,
  isLegacyWorkflowWorkspaceIdentifier,
  isManagerWorkspaceKind,
  normalizeWorkspaceId,
  type ManagerWorkspaceKind,
  type WorkspaceRegistrySnapshot,
} from "./workspaceRegistryContract.ts";
import { createManagerWorkspace, type ManagerWorkspace } from "./managerWorkspaceIdentity.ts";
import { getActiveWorkspaceId } from "./workspaceRegistryStore.ts";
import { selectWorkspaceForRuntime } from "./workspaceSelectionBinding.ts";

export type ManagerWorkspaceEntryRole = "business" | "project" | "demo";

export type ManagerWorkspaceEntry = Readonly<{
  workspaceId: string;
  name: string;
  role: ManagerWorkspaceEntryRole;
  typeLabel: "Business" | "Project" | "Demo";
  identityLabel: string;
}>;

export type ManagerWorkspaceEntryProjection = Readonly<{
  active: ManagerWorkspaceEntry;
  real: readonly ManagerWorkspaceEntry[];
  demo: ManagerWorkspaceEntry | null;
  hasRealWorkspace: boolean;
}>;

function entryForWorkspace(
  workspaceId: string,
  name: string,
  kind: ManagerWorkspaceKind | undefined,
): ManagerWorkspaceEntry | null {
  if (isLegacyWorkflowWorkspaceIdentifier(workspaceId)) return null;
  if (workspaceId === DEMO_WORKSPACE_ID) {
    return Object.freeze({
      workspaceId,
      name: "Nexora Demo",
      role: "demo",
      typeLabel: "Demo",
      identityLabel: "Nexora Demo · Demo",
    });
  }
  if (kind === "BUSINESS") {
    return Object.freeze({
      workspaceId,
      name,
      role: "business",
      typeLabel: "Business",
      identityLabel: `${name} · Business`,
    });
  }
  if (kind === "PROJECT") {
    return Object.freeze({
      workspaceId,
      name,
      role: "project",
      typeLabel: "Project",
      identityLabel: `${name} · Project`,
    });
  }
  return null;
}

export function projectManagerWorkspaceEntries(
  snapshot: WorkspaceRegistrySnapshot,
): ManagerWorkspaceEntryProjection {
  const real: ManagerWorkspaceEntry[] = [];
  let demo: ManagerWorkspaceEntry | null = null;
  for (const workspaceId of snapshot.workspaceOrder) {
    const workspace = snapshot.workspaces[workspaceId];
    if (!workspace || workspace.status !== "active") continue;
    const entry = entryForWorkspace(workspace.workspaceId, workspace.workspaceName, workspace.kind);
    if (!entry) continue;
    if (entry.role === "demo") demo = entry;
    else real.push(entry);
  }
  const activeId = snapshot.activeWorkspaceId;
  const active =
    [...real, ...(demo ? [demo] : [])].find((entry) => entry.workspaceId === activeId) ??
    demo ??
    Object.freeze({
      workspaceId: DEMO_WORKSPACE_ID,
      name: "Nexora Demo",
      role: "demo" as const,
      typeLabel: "Demo" as const,
      identityLabel: "Nexora Demo · Demo",
    });
  return Object.freeze({
    active,
    real: Object.freeze(real),
    demo,
    hasRealWorkspace: real.length > 0,
  });
}

export function assessManagerWorkspaceCreation(input: {
  readonly name: unknown;
  readonly kind: unknown;
}):
  | Readonly<{ ok: true; name: string; kind: ManagerWorkspaceKind }>
  | Readonly<{ ok: false; reason: "name" | "type" }> {
  if (typeof input.name !== "string" || input.name.trim().length === 0) {
    return Object.freeze({ ok: false, reason: "name" });
  }
  if (!isManagerWorkspaceKind(input.kind)) {
    return Object.freeze({ ok: false, reason: "type" });
  }
  return Object.freeze({ ok: true, name: input.name.trim(), kind: input.kind });
}

export function createManagerWorkspaceFromEntry(input: {
  readonly name: unknown;
  readonly kind: unknown;
}): ManagerWorkspace | null {
  const assessed = assessManagerWorkspaceCreation(input);
  if (!assessed.ok) return null;
  const before = getActiveWorkspaceId();
  const created = createManagerWorkspace({ name: assessed.name, kind: assessed.kind });
  if (!created || isLegacyWorkflowWorkspaceIdentifier(created.workspaceId)) {
    return null;
  }
  if (getActiveWorkspaceId() !== created.workspaceId) {
    if (before && before !== getActiveWorkspaceId()) {
      selectWorkspaceForRuntime(before);
    }
    return null;
  }
  return created;
}

export function selectManagerWorkspaceEntry(workspaceId: unknown): boolean {
  const normalized = normalizeWorkspaceId(workspaceId);
  if (!normalized || isLegacyWorkflowWorkspaceIdentifier(normalized)) return false;
  selectWorkspaceForRuntime(normalized);
  return getActiveWorkspaceId() === normalized;
}
