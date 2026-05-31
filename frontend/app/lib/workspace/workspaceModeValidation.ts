/**
 * E2:59 — Development validation for 2D/3D workspace mode activation pipeline.
 */

import type { WorkspaceViewMode } from "./workspaceViewModeTypes";
import { getWorkspaceViewMode } from "./workspaceViewModeRuntime";
import { resolveExecutiveDefaultCameraForMode } from "./workspaceModeTransitionRuntime";
import { logExecutive2DProfile } from "../scene/camera/executive2DCameraProfile";
import { logExecutive3DProfile } from "../scene/camera/executive3DCameraProfile";

export type WorkspaceModeValidationStage =
  | "button_click"
  | "store_updated"
  | "mode_changed"
  | "scene_subscribed"
  | "camera_updated"
  | "transition_completed";

export type WorkspaceModeValidationReport = {
  requestedMode: WorkspaceViewMode | null;
  currentMode: WorkspaceViewMode;
  storeMatchesRequest: boolean;
  cameraFrame: ReturnType<typeof resolveExecutiveDefaultCameraForMode>;
  stages: WorkspaceModeValidationStage[];
  passed: boolean;
  notes: string[];
};

const logKeys = new Set<string>();

function devLog(label: string, payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${label}:${JSON.stringify(payload)}`;
  if (logKeys.has(key)) return;
  logKeys.add(key);
  globalThis.console?.debug?.(label, payload);
}

export function logViewModeRequested(mode: WorkspaceViewMode, source: string): void {
  devLog("[Nexora][ViewModeRequested]", { mode, source });
}

export function logViewModeChanged(from: WorkspaceViewMode, to: WorkspaceViewMode, source: string): void {
  devLog("[Nexora][ViewModeChanged]", { from, to, source });
}

export function logModeTransition(payload: Record<string, unknown>): void {
  devLog("[Nexora][ModeTransition]", payload);
}

export function logToolbarViewModeClick(mode: WorkspaceViewMode): void {
  if (mode === "3D") {
    devLog("[Nexora][3DButtonClicked]", { mode, timestamp: Date.now() });
  }
}

export function logCameraProfileForMode(mode: WorkspaceViewMode): void {
  const frame = resolveExecutiveDefaultCameraForMode(mode);
  if (mode === "2D") {
    logExecutive2DProfile({ mode, position: frame.position, lookAt: frame.lookAt, fov: frame.fov });
    devLog("[Nexora][CameraProfile2D]", { position: frame.position, fov: frame.fov });
  } else {
    logExecutive3DProfile({ mode, position: frame.position, lookAt: frame.lookAt, fov: frame.fov });
    devLog("[Nexora][CameraProfile3D]", { position: frame.position, fov: frame.fov });
  }
}

export function validateWorkspaceModeActivation(input: {
  requestedMode: WorkspaceViewMode;
  source?: string;
  sceneSubscribed?: boolean;
  cameraApplied?: boolean;
}): WorkspaceModeValidationReport {
  const currentMode = getWorkspaceViewMode();
  const storeMatchesRequest = currentMode === input.requestedMode;
  const cameraFrame = resolveExecutiveDefaultCameraForMode(currentMode);
  const stages: WorkspaceModeValidationStage[] = ["button_click"];

  if (storeMatchesRequest) stages.push("store_updated", "mode_changed");
  if (input.sceneSubscribed !== false) stages.push("scene_subscribed");
  if (input.cameraApplied) stages.push("camera_updated");
  if (storeMatchesRequest && input.cameraApplied) stages.push("transition_completed");

  const notes: string[] = [];
  if (!storeMatchesRequest) {
    notes.push(`store_mode_mismatch: expected ${input.requestedMode}, got ${currentMode}`);
  }
  if (input.cameraApplied === false) {
    notes.push("camera_frame_not_applied");
  }

  const report: WorkspaceModeValidationReport = {
    requestedMode: input.requestedMode,
    currentMode,
    storeMatchesRequest,
    cameraFrame,
    stages,
    passed: storeMatchesRequest && input.cameraApplied !== false,
    notes,
  };

  devLog("[Nexora][ViewModeValidation]", {
    source: input.source ?? "runtime",
    passed: report.passed,
    requestedMode: report.requestedMode,
    currentMode: report.currentMode,
    stages: report.stages,
    notes: report.notes,
  });

  return report;
}

export function resetWorkspaceModeValidationLogsForTests(): void {
  logKeys.clear();
}
