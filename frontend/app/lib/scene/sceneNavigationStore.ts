import type { CameraPresetId, SceneNavigationMode, SceneNavigationSource } from "./sceneNavigationTypes";
import { isCameraPresetId, isSceneNavigationMode } from "./sceneNavigationTypes";

export type SceneNavigationToolbarSnapshot = {
  navigationMode: SceneNavigationMode;
  selectedPresetId: CameraPresetId;
};

const SCENE_NAVIGATION_SERVER_SNAPSHOT: Readonly<SceneNavigationToolbarSnapshot> = Object.freeze({
  navigationMode: "select",
  selectedPresetId: "global",
});
const sceneNavigationDiagnosticKeys = new Set<string>();

let navigationMode: SceneNavigationMode = "select";
let selectedPresetId: CameraPresetId = "global";
let sceneNavigationToolbarSnapshot: Readonly<SceneNavigationToolbarSnapshot> = SCENE_NAVIGATION_SERVER_SNAPSHOT;

type NavigationListener = () => void;
const listeners = new Set<NavigationListener>();

function logSceneNavigationDiagnostic(label: string, detail: Record<string, unknown>, key: string): void {
  if (process.env.NODE_ENV === "production") return;
  const dedupeKey = `${label}:${key}`;
  if (sceneNavigationDiagnosticKeys.has(dedupeKey)) return;
  sceneNavigationDiagnosticKeys.add(dedupeKey);
  console.info(label, detail);
}

function notifySceneNavigationSubscribers(): void {
  logSceneNavigationDiagnostic(
    "[Nexora][SceneNavigation][SubscribersNotified]",
    {
      navigationMode: sceneNavigationToolbarSnapshot.navigationMode,
      selectedPresetId: sceneNavigationToolbarSnapshot.selectedPresetId,
      subscriberCount: listeners.size,
    },
    `${sceneNavigationToolbarSnapshot.navigationMode}:${sceneNavigationToolbarSnapshot.selectedPresetId}:${listeners.size}`
  );
  listeners.forEach((listener) => listener());
}

function publishSceneNavigationState(next: SceneNavigationToolbarSnapshot): void {
  const prev = sceneNavigationToolbarSnapshot;
  if (prev.navigationMode === next.navigationMode && prev.selectedPresetId === next.selectedPresetId) {
    logSceneNavigationDiagnostic(
      "[Nexora][SceneNavigation][SnapshotSkippedNoChange]",
      next,
      `${next.navigationMode}:${next.selectedPresetId}`
    );
    return;
  }
  sceneNavigationToolbarSnapshot = Object.freeze({ ...next });
  logSceneNavigationDiagnostic(
    "[Nexora][SceneNavigation][SnapshotCreated]",
    sceneNavigationToolbarSnapshot,
    `${sceneNavigationToolbarSnapshot.navigationMode}:${sceneNavigationToolbarSnapshot.selectedPresetId}`
  );
  notifySceneNavigationSubscribers();
}

export function getSceneNavigationMode(): SceneNavigationMode {
  return navigationMode;
}

export function getSelectedCameraPresetId(): CameraPresetId {
  return selectedPresetId;
}

export function getSceneNavigationToolbarSnapshot(): Readonly<SceneNavigationToolbarSnapshot> {
  return sceneNavigationToolbarSnapshot;
}

export function getSceneNavigationToolbarServerSnapshot(): Readonly<SceneNavigationToolbarSnapshot> {
  return SCENE_NAVIGATION_SERVER_SNAPSHOT;
}

export function subscribeSceneNavigationStore(listener: NavigationListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setSceneNavigationMode(mode: SceneNavigationMode, _source: SceneNavigationSource): void {
  if (!isSceneNavigationMode(mode)) return;
  if (mode === navigationMode) {
    publishSceneNavigationState({ navigationMode, selectedPresetId });
    return;
  }
  navigationMode = mode;
  publishSceneNavigationState({ navigationMode, selectedPresetId });
}

export function setSelectedCameraPresetId(presetId: CameraPresetId, _source: SceneNavigationSource): void {
  if (!isCameraPresetId(presetId)) return;
  if (presetId === selectedPresetId) {
    publishSceneNavigationState({ navigationMode, selectedPresetId });
    return;
  }
  selectedPresetId = presetId;
  publishSceneNavigationState({ navigationMode, selectedPresetId });
}

/** Test-only reset. */
export function resetSceneNavigationStoreForTests(): void {
  navigationMode = "select";
  selectedPresetId = "global";
  sceneNavigationToolbarSnapshot = SCENE_NAVIGATION_SERVER_SNAPSHOT;
  sceneNavigationDiagnosticKeys.clear();
  listeners.clear();
}
