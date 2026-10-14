/**
 * NPA-T MWI:1 — Manager Workspace identity and authority foundation.
 *
 * The existing NW-A workspace registry remains the only active-workspace store.
 * This module projects a Manager Workspace from that record. It does not own
 * NMI Unified Company / Project, Stage, Advisor, Data Reality, or workflow mode.
 *
 * Manager Workspace
 *   → identifies the manager-owned working boundary
 * NMI Unified Company / Project (BCA context + NMI composition)
 *   → models the business/project truth inside that boundary
 */

import { BUSINESS_PROJECT_CONTEXT_BOUNDARY } from "../business-context-awareness/businessProjectContextContract.ts";
import { NMI_AUTHORITY_BOUNDARY } from "../nmi/nmiAuthorityBoundary.ts";
import { NMI_FOUNDATION_CONTRACT } from "../nmi/nmiContract.ts";
import {
  DEMO_WORKSPACE_ID,
  isLegacyWorkflowWorkspaceIdentifier,
  isManagerWorkspaceKind,
  normalizeWorkspaceId,
  type LegacyWorkflowWorkspaceIdentifier,
  type ManagerWorkspaceKind,
  type Workspace,
  type WorkspaceId,
} from "./workspaceRegistryContract.ts";
import {
  createWorkspace,
  getActiveWorkspace,
  getActiveWorkspaceId,
  getWorkspaceById,
  upsertWorkspace,
} from "./workspaceRegistryStore.ts";

export const MANAGER_WORKSPACE_IDENTITY = "MWI:1/ManagerWorkspaceIdentity" as const;

export type ManagerWorkspace = Readonly<{
  workspaceId: WorkspaceId;
  name: string;
  kind: ManagerWorkspaceKind;
}>;

export type WorkspaceIdentifierClass =
  | "manager_workspace"
  | "legacy_workflow"
  | "demo_test"
  | "unclassified_registry"
  | "unknown";

export type ActiveManagerWorkspaceResolution = Readonly<{
  activeWorkspaceId: WorkspaceId | null;
  managerWorkspace: ManagerWorkspace | null;
  classification: WorkspaceIdentifierClass;
}>;

export type WorkflowWorkspaceSeparation = Readonly<{
  workspaceId: WorkspaceId | null;
  workflowMode: LegacyWorkflowWorkspaceIdentifier | null;
  acceptedAsWorkspaceIdentity: boolean;
}>;

export const MANAGER_WORKSPACE_AUTHORITY = Object.freeze({
  identity: MANAGER_WORKSPACE_IDENTITY,
  activeWorkspaceOwner: "workspaceRegistryStore.getActiveWorkspaceId" as const,
  identitySource: "workspaceRegistryContract.Workspace" as const,
  persistenceRelationship:
    "The registry is the in-memory authority. IndexedDB CSV durability and legacy localStorage project state persist caller-supplied ids; they do not define workspace identity." as const,
  downstreamConsumptionSeam: "resolveActiveManagerWorkspace" as const,
  replacesNmiUnifiedCompanyProject: false as const,
  parallelWorkspaceStore: false as const,
  parallelCompanyProjectModel: false as const,
  workflowModesAreWorkspaceIds: false as const,
  ownsBusinessProjectTruth: false as const,
  businessProjectTruthAuthority: NMI_AUTHORITY_BOUNDARY.businessProjectContext,
  unifiedModelAuthority: NMI_FOUNDATION_CONTRACT.identity,
  businessProjectContextOwnsInterpretation: BUSINESS_PROJECT_CONTEXT_BOUNDARY.ownsContextInterpretation,
});

/**
 * MWI:2 binds the live executive data paths. The remaining entries still
 * accept a caller-supplied id, including historical workflow-mode keys.
 */
export const MANAGER_WORKSPACE_DOWNSTREAM_SEAMS = Object.freeze([
  "data-reality.csv-import-store.legacy-callers",
  "data-reality.indexeddb-historical-records",
  "advisor.conversation-context",
  "saved-scenes",
  "timeline-history",
  "learning.nexora-mvp-key",
  "dashboard.executive-workspace-catalog",
] as const);

export const MWI2_LIVE_DATA_BINDINGS = Object.freeze([
  "executive-shell.csv-bootstrap",
  "executive-shell.csv-read",
  "executive-shell.data-explorer",
  "executive-shell.monitoring",
  "executive-shell.advisor-data-inquiry",
  "executive-shell.csv-semantic-clarification",
  "executive-shell.data-object-id",
] as const);

export function projectManagerWorkspace(workspace: Workspace | null | undefined): ManagerWorkspace | null {
  if (!workspace) return null;
  if (isLegacyWorkflowWorkspaceIdentifier(workspace.workspaceId)) return null;
  if (!isManagerWorkspaceKind(workspace.kind)) return null;
  return Object.freeze({
    workspaceId: workspace.workspaceId,
    name: workspace.workspaceName,
    kind: workspace.kind,
  });
}

export function classifyWorkspaceIdentifier(value: unknown): WorkspaceIdentifierClass {
  const workspaceId = normalizeWorkspaceId(value);
  if (!workspaceId) return "unknown";
  if (isLegacyWorkflowWorkspaceIdentifier(workspaceId)) return "legacy_workflow";
  if (workspaceId === DEMO_WORKSPACE_ID) return "demo_test";
  const workspace = getWorkspaceById(workspaceId);
  if (!workspace) return "unknown";
  if (isManagerWorkspaceKind(workspace.kind)) return "manager_workspace";
  return "unclassified_registry";
}

/** The one answer to "which Business or Project is the manager working in?" */
export function resolveActiveManagerWorkspace(): ActiveManagerWorkspaceResolution {
  const activeWorkspaceId = getActiveWorkspaceId();
  return Object.freeze({
    activeWorkspaceId,
    managerWorkspace: projectManagerWorkspace(getActiveWorkspace()),
    classification: classifyWorkspaceIdentifier(activeWorkspaceId),
  });
}

/**
 * Creates a real manager workspace through the existing registry.
 * The generated id is the stable boundary. Workflow-mode strings are refused.
 */
export function createManagerWorkspace(input: {
  readonly name: string;
  readonly kind: ManagerWorkspaceKind;
}): ManagerWorkspace | null {
  if (!isManagerWorkspaceKind(input.kind)) return null;
  const created = createWorkspace(input.name);
  if (isLegacyWorkflowWorkspaceIdentifier(created.workspaceId)) return null;
  const stamped: Workspace = Object.freeze({
    ...created,
    kind: input.kind,
    metadata: Object.freeze({
      ...(created.metadata ?? {}),
      managerWorkspaceKind: input.kind,
      phase: "MWI:1",
    }),
  });
  upsertWorkspace(stamped);
  return projectManagerWorkspace(getWorkspaceById(stamped.workspaceId));
}

/**
 * Compatibility adapter. A cockpit mode is returned as workflowMode and is
 * not accepted as a workspace id. Any other non-empty id is left for the caller;
 * it does not become the active workspace by itself.
 */
export function separateWorkflowIdentity(requestedId: unknown): WorkflowWorkspaceSeparation {
  const workspaceId = normalizeWorkspaceId(requestedId);
  if (!workspaceId) {
    return Object.freeze({
      workspaceId: null,
      workflowMode: null,
      acceptedAsWorkspaceIdentity: false,
    });
  }
  if (isLegacyWorkflowWorkspaceIdentifier(workspaceId)) {
    return Object.freeze({
      workspaceId: null,
      workflowMode: workspaceId,
      acceptedAsWorkspaceIdentity: false,
    });
  }
  return Object.freeze({
    workspaceId,
    workflowMode: null,
    acceptedAsWorkspaceIdentity: true,
  });
}

/** Changing cockpit mode keeps the same canonical workspace id. */
export function bindWorkflowMode<TMode extends string>(input: {
  readonly workspaceId: WorkspaceId;
  readonly workflowMode: TMode;
}): Readonly<{ workspaceId: WorkspaceId; workflowMode: TMode }> {
  return Object.freeze({
    workspaceId: input.workspaceId,
    workflowMode: input.workflowMode,
  });
}

export type LiveExecutiveDataWorkspace = Readonly<{
  workspaceId: WorkspaceId;
  classification: WorkspaceIdentifierClass;
  managerWorkspace: ManagerWorkspace | null;
  demoBootstrapPermitted: boolean;
  workflowModesAreWorkspaceIds: false;
}>;

/**
 * Live /executive data binding. The id always comes from the workspace registry.
 * Cockpit modes are not substituted in when the registry id is missing.
 */
export function resolveLiveExecutiveDataWorkspace(): LiveExecutiveDataWorkspace {
  const active = resolveActiveManagerWorkspace();
  const workspaceId = active.activeWorkspaceId;
  if (!workspaceId || isLegacyWorkflowWorkspaceIdentifier(workspaceId)) {
    return Object.freeze({
      workspaceId: DEMO_WORKSPACE_ID,
      classification: "demo_test" as const,
      managerWorkspace: null,
      demoBootstrapPermitted: false,
      workflowModesAreWorkspaceIds: false as const,
    });
  }
  return Object.freeze({
    workspaceId,
    classification: active.classification,
    managerWorkspace: active.managerWorkspace,
    demoBootstrapPermitted: active.classification === "demo_test",
    workflowModesAreWorkspaceIds: false as const,
  });
}

export function readLiveExecutiveDataWorkspaceId(): WorkspaceId {
  return resolveLiveExecutiveDataWorkspace().workspaceId;
}

/** New manager persistence. Legacy workflow identifiers are not writable ids. */
export function acceptNewManagerPersistenceWorkspaceId(workspaceId: unknown): boolean {
  const normalized = normalizeWorkspaceId(workspaceId);
  if (!normalized) return false;
  return !isLegacyWorkflowWorkspaceIdentifier(normalized);
}
