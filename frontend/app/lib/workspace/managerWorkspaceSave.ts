/**
 * OWN-MVP:1 — Manager Workspace save verification.
 *
 * The registry and each manager-owned store already persist on write.
 * This seam checks that recovery contract. It does not copy state into a second store.
 */
import { listCsvRealDataImports } from "../data-reality/csvRealDataImportStore.ts";
import { DURABLE_MONITORING_STORAGE_KEY } from "../data-reality/durableMonitoringRuntime.ts";
import { loadSceneOrgSavedScenes } from "../scene-org/sceneOrgSavedSceneDurability.ts";
import {
  DEMO_WORKSPACE_ID,
  isLegacyWorkflowWorkspaceIdentifier,
  isManagerWorkspaceKind,
  type ManagerWorkspaceKind,
} from "./workspaceRegistryContract.ts";
import { isRealManagerWorkspaceId } from "./liveManagerDataWorkspaceGuard.ts";
import {
  MANAGER_WORKSPACE_REGISTRY_STORAGE_KEY,
  getActiveWorkspaceId,
  getWorkspaceById,
} from "./workspaceRegistryStore.ts";

export const managerWorkspaceSaveIdentity = "OWN-MVP:1/ManagerWorkspaceSave" as const;

export const MANAGER_WORKSPACE_SAVE_MODEL = "autosave-plus-saved-status" as const;

export const MANAGER_WORKSPACE_SAVE_UNSUPPORTED = Object.freeze([
  "decision-session",
  "execution-session",
  "outcome-registry",
  "conversation",
  "stage-focus",
  "nmi-projection",
] as const);

export type ManagerWorkspaceSaveResult = Readonly<{
  identity: typeof managerWorkspaceSaveIdentity;
  model: typeof MANAGER_WORKSPACE_SAVE_MODEL;
  status: "saved" | "refused" | "failed";
  reason: "not_manager_workspace" | "legacy_workflow" | "registry_not_durable" | null;
  workspaceId: string | null;
  workspaceKind: ManagerWorkspaceKind | null;
  workspaceName: string | null;
  persisted: readonly string[];
  unsupported: readonly string[];
  failures: readonly string[];
  csvImports: readonly Readonly<{ importId: string; fileName: string; workspaceId: string }>[];
}>;

function storage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function refused(
  reason: "not_manager_workspace" | "legacy_workflow",
  workspaceId: string | null,
): ManagerWorkspaceSaveResult {
  return Object.freeze({
    identity: managerWorkspaceSaveIdentity,
    model: MANAGER_WORKSPACE_SAVE_MODEL,
    status: "refused",
    reason,
    workspaceId,
    workspaceKind: null,
    workspaceName: null,
    persisted: Object.freeze([]),
    unsupported: MANAGER_WORKSPACE_SAVE_UNSUPPORTED,
    failures: Object.freeze([]),
    csvImports: Object.freeze([]),
  });
}

function ownedKeyCount(target: Storage, prefix: string): number {
  let count = 0;
  for (let index = 0; index < target.length; index += 1) {
    const key = target.key(index);
    if (key?.startsWith(prefix)) count += 1;
  }
  return count;
}

/** Verifies the active Manager Workspace is already recoverable. Does not write a workspace copy. */
export function saveActiveManagerWorkspace(): ManagerWorkspaceSaveResult {
  const workspaceId = getActiveWorkspaceId();
  if (workspaceId && isLegacyWorkflowWorkspaceIdentifier(workspaceId)) {
    return refused("legacy_workflow", workspaceId);
  }
  if (!workspaceId || workspaceId === DEMO_WORKSPACE_ID || !isRealManagerWorkspaceId(workspaceId)) {
    return refused("not_manager_workspace", workspaceId);
  }
  const workspace = getWorkspaceById(workspaceId);
  if (!workspace || !isManagerWorkspaceKind(workspace.kind)) {
    return refused("not_manager_workspace", workspaceId);
  }
  const target = storage();
  const raw = target?.getItem(MANAGER_WORKSPACE_REGISTRY_STORAGE_KEY) ?? null;
  let durable = false;
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as { workspaces?: Record<string, { workspaceId?: string; workspaceName?: string; kind?: string }> };
      const record = parsed.workspaces?.[workspaceId];
      durable = record?.workspaceId === workspaceId && record.workspaceName === workspace.workspaceName && record.kind === workspace.kind;
    } catch {
      durable = false;
    }
  }
  if (!durable || !target) {
    return Object.freeze({
      identity: managerWorkspaceSaveIdentity,
      model: MANAGER_WORKSPACE_SAVE_MODEL,
      status: "failed",
      reason: "registry_not_durable",
      workspaceId,
      workspaceKind: workspace.kind,
      workspaceName: workspace.workspaceName,
      persisted: Object.freeze([]),
      unsupported: MANAGER_WORKSPACE_SAVE_UNSUPPORTED,
      failures: Object.freeze(["registry_not_durable"]),
      csvImports: Object.freeze([]),
    });
  }
  const csvImports = Object.freeze(
    listCsvRealDataImports(workspaceId).map((entry) =>
      Object.freeze({
        importId: entry.importId,
        fileName: entry.prepared.fileName,
        workspaceId: entry.workspaceId,
      }),
    ),
  );
  const persisted = ["workspace-registry"];
  if (csvImports.length > 0) persisted.push("csv-imports");
  const scenes = loadSceneOrgSavedScenes(target).scenes.filter((scene) => scene.managerWorkspaceId === workspaceId);
  if (scenes.length > 0) persisted.push("saved-scenes");
  if (ownedKeyCount(target, `nexora.decisionMemory.${workspaceId}.`) > 0) persisted.push("decision-memory");
  if (ownedKeyCount(target, `nexora.approvalWorkflow.${workspaceId}.`) > 0) persisted.push("approval");
  if (ownedKeyCount(target, `nexora.collaboration.${workspaceId}.`) > 0) persisted.push("collaboration");
  const monitoring = target.getItem(DURABLE_MONITORING_STORAGE_KEY);
  if (monitoring?.includes(`"workspaceId":"${workspaceId}"`) || monitoring?.includes(`"workspaceId": "${workspaceId}"`)) {
    persisted.push("monitoring");
  }
  return Object.freeze({
    identity: managerWorkspaceSaveIdentity,
    model: MANAGER_WORKSPACE_SAVE_MODEL,
    status: "saved",
    reason: null,
    workspaceId,
    workspaceKind: workspace.kind,
    workspaceName: workspace.workspaceName,
    persisted: Object.freeze(persisted),
    unsupported: MANAGER_WORKSPACE_SAVE_UNSUPPORTED,
    failures: Object.freeze([]),
    csvImports,
  });
}
