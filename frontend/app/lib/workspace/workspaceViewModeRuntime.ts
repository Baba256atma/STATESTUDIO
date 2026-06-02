import type { WorkspaceViewMode, WorkspaceViewModeSnapshot } from "./workspaceViewModeTypes";
import { DEFAULT_WORKSPACE_VIEW_MODE, WORKSPACE_VIEW_MODE_EVENT } from "./workspaceViewModeTypes";
import {
  hydrateExecutiveNavigationPreference,
  persistExecutiveNavigationPreference,
} from "./executiveNavigationPersistence";
import { applyRelationshipViewProfileForMode } from "../scene/relationshipViewProfiles";
import {
  logExecutiveViewportModeSwitch,
} from "../scene/viewport/executiveViewportModeRuntime";
import { resolveWorkspaceModeTransition } from "./workspaceModeTransitionRuntime";
import {
  logCameraProfileForMode,
  logModeTransition,
  logViewModeChanged,
  logViewModeRequested,
  validateWorkspaceModeActivation,
} from "./workspaceModeValidation";

const logKeys = new Set<string>();

let snapshot: WorkspaceViewModeSnapshot = Object.freeze({
  currentMode: DEFAULT_WORKSPACE_VIEW_MODE,
  lastCameraProfile: DEFAULT_WORKSPACE_VIEW_MODE,
  preferredViewMode: DEFAULT_WORKSPACE_VIEW_MODE,
});
let lastViewModeSource = "runtime";

const listeners = new Set<() => void>();

function isDev(): boolean {
  return process.env.NODE_ENV !== "production";
}

function devLog(label: string, payload: Record<string, unknown>): void {
  if (!isDev()) return;
  const key = `${label}:${JSON.stringify(payload)}`;
  if (logKeys.has(key)) return;
  logKeys.add(key);
  globalThis.console?.debug?.(label, payload);
}

function notify(): void {
  listeners.forEach((listener) => listener());
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(WORKSPACE_VIEW_MODE_EVENT, {
        detail: { mode: snapshot.currentMode, snapshot, source: lastViewModeSource },
      })
    );
  }
}

function commitSnapshot(next: WorkspaceViewModeSnapshot): void {
  snapshot = Object.freeze(next);
  const current = hydrateExecutiveNavigationPreference();
  persistExecutiveNavigationPreference({
    ...current,
    selectedMode: snapshot.currentMode,
    lastCameraProfile: snapshot.lastCameraProfile,
    preferredViewMode: snapshot.preferredViewMode,
  });
  notify();
}

export function getWorkspaceViewMode(): WorkspaceViewMode {
  return snapshot.currentMode;
}

export function getWorkspaceViewModeSnapshot(): WorkspaceViewModeSnapshot {
  return snapshot;
}

export function getWorkspaceViewModeServerSnapshot(): WorkspaceViewMode {
  return DEFAULT_WORKSPACE_VIEW_MODE;
}

export function subscribeWorkspaceViewMode(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function hydrateWorkspaceViewMode(): WorkspaceViewModeSnapshot {
  const persisted = hydrateExecutiveNavigationPreference();
  snapshot = Object.freeze({
    currentMode: persisted.selectedMode,
    lastCameraProfile: persisted.lastCameraProfile,
    preferredViewMode: persisted.preferredViewMode,
  });
  applyRelationshipViewProfileForMode(snapshot.currentMode);
  devLog("[Nexora][ViewMode]", { mode: snapshot.currentMode, source: "hydrate" });
  devLog("[Nexora][ViewPersistence]", {
    selectedMode: snapshot.currentMode,
    preferredViewMode: snapshot.preferredViewMode,
    lastCameraProfile: snapshot.lastCameraProfile,
  });
  return snapshot;
}

export function setWorkspaceViewMode(mode: WorkspaceViewMode, source = "runtime"): WorkspaceViewModeSnapshot {
  logViewModeRequested(mode, source);
  lastViewModeSource = source;
  if (snapshot.currentMode === mode) {
    notify();
    return snapshot;
  }
  const from = snapshot.currentMode;
  const transition = resolveWorkspaceModeTransition({ from, to: mode });
  const controlsPreserveCenter = null;
  logExecutiveViewportModeSwitch({
    from,
    to: mode,
    source,
    operationalCenter: controlsPreserveCenter,
    preserveSelection: transition.preserveSelection,
  });
  applyRelationshipViewProfileForMode(mode);
  const next: WorkspaceViewModeSnapshot = {
    currentMode: mode,
    lastCameraProfile: mode,
    preferredViewMode: mode,
  };
  commitSnapshot(next);
  if (process.env.NODE_ENV !== "production") {
    console.log("[Nexora][ViewModeChanged]", {
      previousMode: from,
      nextMode: mode,
    });
  }
  logViewModeChanged(from, mode, source);
  logModeTransition({
    from,
    to: mode,
    source,
    durationMs: transition.durationMs,
    preserveSelection: transition.preserveSelection,
    cameraProfileId: transition.cameraProfileId,
  });
  logCameraProfileForMode(mode);
  validateWorkspaceModeActivation({
    requestedMode: mode,
    source,
    sceneSubscribed: true,
    cameraApplied: undefined,
  });
  devLog("[Nexora][ModeSwitch]", {
    from,
    to: mode,
    source,
    durationMs: transition.durationMs,
    preserveSelection: transition.preserveSelection,
  });
  if (mode === "2D") {
    devLog("[Nexora][2DProfile]", { profile: transition.cameraProfileId });
  } else {
    devLog("[Nexora][3DProfile]", { profile: transition.cameraProfileId });
  }
  return snapshot;
}

export function toggleWorkspaceViewMode(source = "runtime"): WorkspaceViewModeSnapshot {
  const nextMode: WorkspaceViewMode = snapshot.currentMode === "2D" ? "3D" : "2D";
  return setWorkspaceViewMode(nextMode, source);
}

export function resetWorkspaceViewModeRuntimeForTests(): void {
  snapshot = Object.freeze({
    currentMode: DEFAULT_WORKSPACE_VIEW_MODE,
    lastCameraProfile: DEFAULT_WORKSPACE_VIEW_MODE,
    preferredViewMode: DEFAULT_WORKSPACE_VIEW_MODE,
  });
  listeners.clear();
  logKeys.clear();
}
