import type { WorkspaceViewMode } from "./workspaceViewModeTypes";
import {
  resolveExecutive2DCameraFrame,
  type ExecutiveCameraBounds,
  type ExecutiveCameraFrame,
} from "../scene/camera/executive2DCameraProfile";
import {
  resolveExecutive3DCameraFrame,
  resolveExecutive3DDefaultCamera,
} from "../scene/camera/executive3DCameraProfile";
import { resolveExecutive2DDefaultCamera } from "../scene/camera/executive2DCameraProfile";

export type WorkspaceModeTransitionInput = {
  from: WorkspaceViewMode;
  to: WorkspaceViewMode;
};

export type WorkspaceModeTransitionPlan = {
  from: WorkspaceViewMode;
  to: WorkspaceViewMode;
  durationMs: number;
  preserveSelection: true;
  preservePanels: true;
  preserveTimeline: true;
  preserveAiState: true;
  cameraProfileId: string;
};

export function resolveWorkspaceModeTransition(
  input: WorkspaceModeTransitionInput
): WorkspaceModeTransitionPlan {
  return {
    from: input.from,
    to: input.to,
    durationMs: 420,
    preserveSelection: true,
    preservePanels: true,
    preserveTimeline: true,
    preserveAiState: true,
    cameraProfileId: input.to === "2D" ? "executive_2d_strategic" : "executive_3d_strategic",
  };
}

export function resolveExecutiveCameraFrameForMode(
  mode: WorkspaceViewMode,
  bounds: ExecutiveCameraBounds,
  radius: number,
  opts?: { horizontalBias?: number; verticalBias?: number; pullback?: number }
): ExecutiveCameraFrame {
  if (mode === "2D") {
    return resolveExecutive2DCameraFrame(bounds, radius);
  }
  return resolveExecutive3DCameraFrame(bounds, radius, opts);
}

export function resolveExecutiveDefaultCameraForMode(mode: WorkspaceViewMode): ExecutiveCameraFrame {
  return mode === "2D" ? resolveExecutive2DDefaultCamera() : resolveExecutive3DDefaultCamera();
}

export function resolveExecutiveGlobalViewFrame(
  mode: WorkspaceViewMode,
  bounds: ExecutiveCameraBounds,
  radius: number
): ExecutiveCameraFrame {
  const frame = resolveExecutiveCameraFrameForMode(mode, bounds, radius);
  if (process.env.NODE_ENV !== "production") {
    globalThis.console?.debug?.("[Nexora][GlobalView]", {
      mode,
      position: frame.position,
      lookAt: frame.lookAt,
      fov: frame.fov,
    });
  }
  return frame;
}
