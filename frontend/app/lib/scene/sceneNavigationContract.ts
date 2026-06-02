import type {
  CameraPresetId,
  SceneNavigationActionId,
  SceneNavigationFocusRequest,
  SceneNavigationMode,
  SceneNavigationSource,
} from "./sceneNavigationTypes";
import {
  logSceneNavigationCameraFocus,
  logSceneNavigationCameraReset,
  logSceneNavigationFitScene,
  logSceneNavigationPresetSelected,
  logSceneNavigationToolbarAction,
} from "../ui/sceneNavigationInstrumentation";
import {
  getSelectedCameraPresetId,
  setSceneNavigationMode,
  setSelectedCameraPresetId,
} from "./sceneNavigationStore";

export const SCENE_NAVIGATION_ACTION_EVENT = "nexora:scene-navigation-action";
export const SCENE_NAVIGATION_FOCUS_EVENT = "nexora:scene-navigation-focus";
export const SCENE_NAVIGATION_MODE_EVENT = "nexora:scene-navigation-mode";
export const SCENE_NAVIGATION_PRESET_EVENT = "nexora:scene-navigation-preset";

/** Legacy E2:11 bridge — maps old toolbar actions to E2:21 contract. */
const LEGACY_CAMERA_ACTION_MAP: Partial<Record<string, SceneNavigationActionId>> = {
  fit_view: "fit_scene",
  reset_view: "reset_view",
  focus_selection: "focus_selection",
  zoom_in: "zoom_in",
  zoom_out: "zoom_out",
};

function dispatch<T>(eventName: string, detail: T): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
}

export function requestSceneNavigationAction(
  action: SceneNavigationActionId,
  source: SceneNavigationSource = "toolbar"
): void {
  logSceneNavigationToolbarAction({ action, source });
  if (action === "reset_view") {
    logSceneNavigationCameraReset({ source });
  } else if (action === "fit_scene") {
    logSceneNavigationFitScene({ source });
  }
  dispatch(SCENE_NAVIGATION_ACTION_EVENT, { action, source });
}

export function requestSceneNavigationMode(
  mode: SceneNavigationMode,
  source: SceneNavigationSource = "toolbar"
): void {
  setSceneNavigationMode(mode, source);
  logSceneNavigationToolbarAction({ action: `mode:${mode}`, source });
  dispatch(SCENE_NAVIGATION_MODE_EVENT, { mode, source });
}

export function requestCameraPreset(
  presetId: CameraPresetId,
  source: SceneNavigationSource = "toolbar"
): void {
  setSelectedCameraPresetId(presetId, source);
  logSceneNavigationPresetSelected({ presetId, source });
  dispatch(SCENE_NAVIGATION_PRESET_EVENT, { presetId, source });
}

/** Centralized object-centric focus routing for Scene, Timeline, Assistant, and panels. */
export function focusObject(
  objectId: string,
  source: SceneNavigationSource = "panel",
  options?: { animate?: boolean }
): void {
  const trimmed = objectId.trim();
  if (!trimmed) return;
  logSceneNavigationCameraFocus({ objectId: trimmed, source });
  dispatch<SceneNavigationFocusRequest>(SCENE_NAVIGATION_FOCUS_EVENT, {
    objectId: trimmed,
    source,
    animate: options?.animate ?? true,
  });
}

/** Legacy E2:11 camera toolbar bridge. */
export function requestCameraToolbarAction(action: string): void {
  const mapped = LEGACY_CAMERA_ACTION_MAP[action];
  if (mapped) {
    requestSceneNavigationAction(mapped, "legacy");
    return;
  }
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("nexora:camera-toolbar-action", { detail: { action } }));
}

export function readSceneNavigationPresetId(): CameraPresetId {
  return getSelectedCameraPresetId();
}
