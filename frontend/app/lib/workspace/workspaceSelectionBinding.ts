import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type { Workspace, WorkspaceId } from "./workspaceRegistryContract.ts";
import {
  getActiveWorkspace,
  getWorkspaceRegistrySnapshot,
  setActiveWorkspace,
} from "./workspaceRegistryStore.ts";
import {
  resolveWorkspaceIsolationContext,
  type WorkspaceIsolationContext,
} from "./workspaceIsolationFoundations.ts";

export type WorkspaceRuntimeContextBinding = Readonly<{
  workspaceId: WorkspaceId;
  activeWorkspace: Workspace | null;
  sceneContextStable: boolean;
  dashboardContextStable: boolean;
  assistantContextStable: boolean;
  isolationContext: WorkspaceIsolationContext | null;
}>;

export function bindActiveWorkspaceToRuntimeContext(workspaceId: WorkspaceId): WorkspaceRuntimeContextBinding {
  const activeWorkspace = getActiveWorkspace();
  const isolationContext = activeWorkspace
    ? resolveWorkspaceIsolationContext(activeWorkspace.workspaceId)
    : null;
  const binding: WorkspaceRuntimeContextBinding = Object.freeze({
    workspaceId,
    activeWorkspace,
    sceneContextStable: true,
    dashboardContextStable: true,
    assistantContextStable: true,
    isolationContext,
  });

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("nexora:workspace-context-refresh", {
        detail: {
          workspaceId,
          workspaceName: activeWorkspace?.workspaceName ?? null,
          sceneContext: "stable",
          dashboardContext: "stable",
          assistantContext: "stable",
          isolationContext,
        },
      })
    );
  }

  return binding;
}

export function selectWorkspaceForRuntime(workspaceId: WorkspaceId): WorkspaceRuntimeContextBinding {
  setActiveWorkspace(workspaceId);
  const binding = bindActiveWorkspaceToRuntimeContext(workspaceId);
  const snapshot = getWorkspaceRegistrySnapshot();

  devDiagnosticLog("workspaceSwitcher", "[WorkspaceSwitcher] Workspace selected", {
    workspaceId,
    activeWorkspaceId: snapshot.activeWorkspaceId,
    activeWorkspace: binding.activeWorkspace?.workspaceName ?? null,
  });

  return binding;
}
