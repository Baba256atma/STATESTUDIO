import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type { SceneJson } from "../sceneTypes.ts";
import { DEMO_WORKSPACE_ID, type Workspace, type WorkspaceId } from "./workspaceRegistryContract.ts";
import {
  getWorkspaceDataSources,
  getWorkspaceObjects as getScopedWorkspaceObjects,
  getWorkspaceRelationships,
} from "./workspaceContextResolver.ts";
import {
  getWorkspaceModel,
  getWorkspaceObjects as getApprovedWorkspaceObjects,
} from "./workspaceApprovedModelContract.ts";

export const EMPTY_WORKSPACE_CONTRACT_VERSION = "NW-B:1" as const;

export type EmptyWorkspaceModelState = "empty" | "modeled";
export type EmptyWorkspaceOnboardingState = "welcome" | "dismissed" | "modeling_placeholder";

export type EmptyWorkspaceState = {
  contractVersion: typeof EMPTY_WORKSPACE_CONTRACT_VERSION;
  workspaceId: WorkspaceId;
  state: EmptyWorkspaceModelState;
  onboardingState: EmptyWorkspaceOnboardingState;
  hasUserObjects: boolean;
  hasUserRelationships: boolean;
  hasUserDataSources: boolean;
  hasApprovedModel: boolean;
  reason: "demo_workspace" | "no_model_resources" | "model_resources_present";
};

const EMPTY_WORKSPACE_SCENE: SceneJson = {
  state_vector: {},
  meta: {
    phase: "NW-B:1",
    emptyWorkspace: true,
    label: "Unmodeled Workspace",
  },
  scene: {
    objects: [],
    relationships: [],
    loops: [],
  },
} as SceneJson;

const dismissedWorkspaceIds = new Set<WorkspaceId>();
const modelingPlaceholderWorkspaceIds = new Set<WorkspaceId>();
const emptyWorkspaceListeners = new Set<() => void>();
let emptyWorkspaceVersion = 0;

function notifyEmptyWorkspaceListeners(): void {
  emptyWorkspaceVersion += 1;
  emptyWorkspaceListeners.forEach((listener) => listener());
}

function isDemoWorkspace(workspace: Workspace | null | undefined): boolean {
  return (
    workspace?.workspaceId === DEMO_WORKSPACE_ID ||
    workspace?.metadata?.source === "demo_runtime_migration"
  );
}

function hasApprovedModel(workspace: Workspace | null | undefined): boolean {
  const metadata = workspace?.metadata;
  return (
    metadata?.approvedModel === true ||
    metadata?.modelApproved === true ||
    metadata?.modelState === "approved" ||
    getWorkspaceModel(workspace?.workspaceId)?.status === "approved"
  );
}

function resolveOnboardingState(workspaceId: WorkspaceId): EmptyWorkspaceOnboardingState {
  if (modelingPlaceholderWorkspaceIds.has(workspaceId)) return "modeling_placeholder";
  if (dismissedWorkspaceIds.has(workspaceId)) return "dismissed";
  return "welcome";
}

export function subscribeEmptyWorkspaceState(listener: () => void): () => void {
  emptyWorkspaceListeners.add(listener);
  return () => {
    emptyWorkspaceListeners.delete(listener);
  };
}

export function getEmptyWorkspaceServerSnapshot(): number {
  return emptyWorkspaceVersion;
}

export function getEmptyWorkspaceClientSnapshot(): number {
  return emptyWorkspaceVersion;
}

export function resolveEmptyWorkspaceState(workspace: Workspace | null | undefined): EmptyWorkspaceState | null {
  if (!workspace) return null;

  if (isDemoWorkspace(workspace)) {
    return Object.freeze({
      contractVersion: EMPTY_WORKSPACE_CONTRACT_VERSION,
      workspaceId: workspace.workspaceId,
      state: "modeled",
      onboardingState: "dismissed",
      hasUserObjects: true,
      hasUserRelationships: true,
      hasUserDataSources: false,
      hasApprovedModel: true,
      reason: "demo_workspace",
    });
  }

  const workspaceId = workspace.workspaceId;
  const ownsObjects =
    getScopedWorkspaceObjects(workspaceId).length > 0 ||
    getApprovedWorkspaceObjects(workspaceId).length > 0;
  const ownsRelationships = getWorkspaceRelationships(workspaceId).length > 0;
  const ownsDataSources = getWorkspaceDataSources(workspaceId).length > 0;
  const approved = hasApprovedModel(workspace);
  const empty = !ownsObjects && !ownsRelationships && !ownsDataSources && !approved;

  const state = Object.freeze({
    contractVersion: EMPTY_WORKSPACE_CONTRACT_VERSION,
    workspaceId,
    state: empty ? "empty" : "modeled",
    onboardingState: empty ? resolveOnboardingState(workspaceId) : "dismissed",
    hasUserObjects: ownsObjects,
    hasUserRelationships: ownsRelationships,
    hasUserDataSources: ownsDataSources,
    hasApprovedModel: approved,
    reason: empty ? "no_model_resources" : "model_resources_present",
  } satisfies EmptyWorkspaceState);

  if (process.env.NODE_ENV !== "production" && state.state === "empty") {
    devDiagnosticLog("emptyWorkspace", "[EmptyWorkspace]", {
      Workspace: state.workspaceId,
      State: state.state,
    });
  }

  return state;
}

export function isEmptyWorkspaceState(state: EmptyWorkspaceState | null | undefined): boolean {
  return state?.state === "empty";
}

export function getEmptyWorkspaceSceneJson(workspaceId: WorkspaceId): SceneJson {
  return {
    ...EMPTY_WORKSPACE_SCENE,
    meta: {
      ...(EMPTY_WORKSPACE_SCENE.meta ?? {}),
      workspaceId,
    },
  } as SceneJson;
}

export function dismissEmptyWorkspaceOnboarding(workspaceId: WorkspaceId): void {
  dismissedWorkspaceIds.add(workspaceId);
  modelingPlaceholderWorkspaceIds.delete(workspaceId);
  devDiagnosticLog("emptyWorkspace", "[EmptyWorkspace] StartModelingDismissed", {
    Workspace: workspaceId,
  });
  notifyEmptyWorkspaceListeners();
}

export function openEmptyWorkspaceModelingPlaceholder(workspaceId: WorkspaceId): void {
  modelingPlaceholderWorkspaceIds.add(workspaceId);
  dismissedWorkspaceIds.delete(workspaceId);
  devDiagnosticLog("emptyWorkspace", "[EmptyWorkspace] StartModelingOpened", {
    Workspace: workspaceId,
  });
  notifyEmptyWorkspaceListeners();
}

export function reopenEmptyWorkspaceOnboarding(workspaceId: WorkspaceId): void {
  dismissedWorkspaceIds.delete(workspaceId);
  modelingPlaceholderWorkspaceIds.delete(workspaceId);
  notifyEmptyWorkspaceListeners();
}
