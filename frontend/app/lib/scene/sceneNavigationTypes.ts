/** E2:21 — Scene-native executive navigation contract types. */

export type SceneNavigationMode = "select" | "pan" | "orbit" | "zoom";

export type SceneNavigationActionId =
  | "focus_selection"
  | "fit_scene"
  | "reset_view"
  | "zoom_in"
  | "zoom_out"
  | "fullscreen"
  | "select_preset";

export type CameraPresetId = "global" | "operations" | "risk" | "simulation";

export type SceneNavigationSource =
  | "toolbar"
  | "timeline"
  | "assistant"
  | "panel"
  | "keyboard"
  | "legacy";

export type SceneNavigationToolbarModel = {
  navigationMode: SceneNavigationMode;
  selectedPresetId: CameraPresetId;
  hasSelection: boolean;
  isFullscreen: boolean;
};

export type SceneNavigationFocusRequest = {
  objectId: string;
  source: SceneNavigationSource;
  animate?: boolean;
};

export type SceneNavigationActionRequest = {
  action: SceneNavigationActionId;
  source: SceneNavigationSource;
  presetId?: CameraPresetId;
};

export type SceneNavigationModeRequest = {
  mode: SceneNavigationMode;
  source: SceneNavigationSource;
};

export type SceneNavigationCameraSnapshot = {
  position: [number, number, number];
  target: [number, number, number];
  mode: SceneNavigationMode;
  presetId: CameraPresetId;
  selectedObjectId: string | null;
};

export const SCENE_NAVIGATION_MODES: readonly {
  id: SceneNavigationMode;
  label: string;
  icon: string;
}[] = [
  { id: "select", label: "Select", icon: "▣" },
  { id: "pan", label: "Pan", icon: "✥" },
  { id: "orbit", label: "Orbit", icon: "⟳" },
  { id: "zoom", label: "Zoom", icon: "◎" },
] as const;

export const SCENE_NAVIGATION_ACTIONS: readonly {
  id: Exclude<SceneNavigationActionId, "select_preset">;
  label: string;
  icon: string;
}[] = [
  { id: "focus_selection", label: "Focus Selection", icon: "◎" },
  { id: "fit_scene", label: "Fit Scene", icon: "⊞" },
  { id: "reset_view", label: "Reset View", icon: "↺" },
  { id: "zoom_in", label: "Zoom In", icon: "+" },
  { id: "zoom_out", label: "Zoom Out", icon: "−" },
  { id: "fullscreen", label: "Fullscreen", icon: "⛶" },
] as const;

export const CAMERA_PRESET_DEFINITIONS: readonly {
  id: CameraPresetId;
  label: string;
  description: string;
}[] = [
  { id: "global", label: "Global View", description: "Balanced executive overview" },
  { id: "operations", label: "Operations View", description: "Operational focus framing" },
  { id: "risk", label: "Risk View", description: "Risk posture emphasis" },
  { id: "simulation", label: "Simulation View", description: "Simulation workspace framing" },
] as const;

export function isSceneNavigationMode(value: unknown): value is SceneNavigationMode {
  return value === "select" || value === "pan" || value === "orbit" || value === "zoom";
}

export function isCameraPresetId(value: unknown): value is CameraPresetId {
  return value === "global" || value === "operations" || value === "risk" || value === "simulation";
}
