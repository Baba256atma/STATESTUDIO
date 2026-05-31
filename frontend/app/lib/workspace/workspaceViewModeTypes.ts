/** E2:52 — Executive workspace visualization mode contracts. */

export type WorkspaceViewMode = "2D" | "3D";

export const DEFAULT_WORKSPACE_VIEW_MODE: WorkspaceViewMode = "2D";

export const WORKSPACE_VIEW_MODE_EVENT = "nexora:workspace-view-mode-changed";

export type WorkspaceViewModeSnapshot = {
  currentMode: WorkspaceViewMode;
  lastCameraProfile: WorkspaceViewMode;
  preferredViewMode: WorkspaceViewMode;
};

export function isWorkspaceViewMode(value: unknown): value is WorkspaceViewMode {
  return value === "2D" || value === "3D";
}

export function oppositeWorkspaceViewMode(mode: WorkspaceViewMode): WorkspaceViewMode {
  return mode === "2D" ? "3D" : "2D";
}
