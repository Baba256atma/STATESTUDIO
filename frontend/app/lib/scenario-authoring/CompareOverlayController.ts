/**
 * C:2 — Compare Overlay Controller.
 *
 * Safely activates and deactivates compare overlay state while preserving scene,
 * object selection, camera, and timeline snapshots. This controller does not
 * render UI and has no routing, scene, topology, or selection mutation authority.
 */

import {
  EMPTY_COMPARE_OVERLAY_STATE,
  type CompareOverlayState,
} from "./CompareOverlayContract.ts";

export const COMPARE_OVERLAY_CONTROLLER_DIAGNOSTIC = "[COMPARE_OVERLAY_CONTROLLER]" as const;

export const COMPARE_OVERLAY_CONTROLLER_READY_DIAGNOSTIC = "[COMPARE_OVERLAY_CONTROLLER_READY]" as const;

export const C2_OVERLAY_CONTROLLER_COMPLETE_TAG = "[C2_OVERLAY_CONTROLLER_COMPLETE]" as const;

export const COMPARE_OVERLAY_CONTROLLER_VERSION = "1.0.0" as const;

export type CompareOverlayActivationMode = "overlay_on" | "overlay_off";

export type CompareOverlaySceneSnapshot = Readonly<{
  sceneId: string;
  sceneRevision: string;
  objectCount: number;
  topologyFingerprint: string;
}>;

export type CompareOverlaySelectionSnapshot = Readonly<{
  selectedObjectIds: readonly string[];
  focusedObjectId: string | null;
}>;

export type CompareOverlayCameraSnapshot = Readonly<{
  position: readonly [number, number, number];
  target: readonly [number, number, number];
  zoom: number;
}>;

export type CompareOverlayTimelineSnapshot = Readonly<{
  activeFrame: number;
  playbackState: "paused" | "playing";
  rangeStart: number;
  rangeEnd: number;
}>;

export type CompareOverlayPreservedState = Readonly<{
  scene: CompareOverlaySceneSnapshot;
  selection: CompareOverlaySelectionSnapshot;
  camera: CompareOverlayCameraSnapshot;
  timeline: CompareOverlayTimelineSnapshot;
}>;

export type CompareOverlayControllerInput = Readonly<{
  overlayState: CompareOverlayState;
  preservedState: CompareOverlayPreservedState;
}>;

export type CompareOverlayControllerState = Readonly<{
  version: typeof COMPARE_OVERLAY_CONTROLLER_VERSION;
  mode: CompareOverlayActivationMode;
  overlayActive: boolean;
  overlayState: CompareOverlayState;
  preservedState: CompareOverlayPreservedState;
  scenePreserved: true;
  selectionPreserved: true;
  cameraPreserved: true;
  timelinePreserved: true;
  routingMutation: false;
  sceneMutation: false;
  topologyMutation: false;
  selectionMutation: false;
  readOnly: true;
  diagnostics: readonly [
    typeof COMPARE_OVERLAY_CONTROLLER_DIAGNOSTIC,
    typeof COMPARE_OVERLAY_CONTROLLER_READY_DIAGNOSTIC,
  ];
}>;

export const COMPARE_OVERLAY_CONTROLLER_DIAGNOSTICS = Object.freeze([
  COMPARE_OVERLAY_CONTROLLER_DIAGNOSTIC,
  COMPARE_OVERLAY_CONTROLLER_READY_DIAGNOSTIC,
] as const);

function freezeSceneSnapshot(scene: CompareOverlaySceneSnapshot): CompareOverlaySceneSnapshot {
  return Object.freeze({
    sceneId: scene.sceneId,
    sceneRevision: scene.sceneRevision,
    objectCount: scene.objectCount,
    topologyFingerprint: scene.topologyFingerprint,
  });
}

function freezeSelectionSnapshot(
  selection: CompareOverlaySelectionSnapshot
): CompareOverlaySelectionSnapshot {
  return Object.freeze({
    selectedObjectIds: Object.freeze([...selection.selectedObjectIds]),
    focusedObjectId: selection.focusedObjectId,
  });
}

function freezeCameraSnapshot(camera: CompareOverlayCameraSnapshot): CompareOverlayCameraSnapshot {
  return Object.freeze({
    position: Object.freeze([...camera.position] as [number, number, number]),
    target: Object.freeze([...camera.target] as [number, number, number]),
    zoom: camera.zoom,
  });
}

function freezeTimelineSnapshot(timeline: CompareOverlayTimelineSnapshot): CompareOverlayTimelineSnapshot {
  return Object.freeze({
    activeFrame: timeline.activeFrame,
    playbackState: timeline.playbackState,
    rangeStart: timeline.rangeStart,
    rangeEnd: timeline.rangeEnd,
  });
}

export function buildCompareOverlayPreservedState(
  input: CompareOverlayPreservedState
): CompareOverlayPreservedState {
  return Object.freeze({
    scene: freezeSceneSnapshot(input.scene),
    selection: freezeSelectionSnapshot(input.selection),
    camera: freezeCameraSnapshot(input.camera),
    timeline: freezeTimelineSnapshot(input.timeline),
  });
}

export const EMPTY_COMPARE_OVERLAY_PRESERVED_STATE: CompareOverlayPreservedState =
  buildCompareOverlayPreservedState({
    scene: {
      sceneId: "",
      sceneRevision: "",
      objectCount: 0,
      topologyFingerprint: "",
    },
    selection: {
      selectedObjectIds: Object.freeze([]),
      focusedObjectId: null,
    },
    camera: {
      position: Object.freeze([0, 0, 0]),
      target: Object.freeze([0, 0, 0]),
      zoom: 1,
    },
    timeline: {
      activeFrame: 0,
      playbackState: "paused",
      rangeStart: 0,
      rangeEnd: 0,
    },
  });

export const EMPTY_COMPARE_OVERLAY_CONTROLLER_STATE: CompareOverlayControllerState = Object.freeze({
  version: COMPARE_OVERLAY_CONTROLLER_VERSION,
  mode: "overlay_off",
  overlayActive: false,
  overlayState: EMPTY_COMPARE_OVERLAY_STATE,
  preservedState: EMPTY_COMPARE_OVERLAY_PRESERVED_STATE,
  scenePreserved: true,
  selectionPreserved: true,
  cameraPreserved: true,
  timelinePreserved: true,
  routingMutation: false,
  sceneMutation: false,
  topologyMutation: false,
  selectionMutation: false,
  readOnly: true,
  diagnostics: COMPARE_OVERLAY_CONTROLLER_DIAGNOSTICS,
});

let latestCompareOverlayControllerState: CompareOverlayControllerState =
  EMPTY_COMPARE_OVERLAY_CONTROLLER_STATE;

function buildControllerState(
  mode: CompareOverlayActivationMode,
  input: CompareOverlayControllerInput
): CompareOverlayControllerState {
  return Object.freeze({
    version: COMPARE_OVERLAY_CONTROLLER_VERSION,
    mode,
    overlayActive: mode === "overlay_on",
    overlayState: input.overlayState,
    preservedState: buildCompareOverlayPreservedState(input.preservedState),
    scenePreserved: true as const,
    selectionPreserved: true as const,
    cameraPreserved: true as const,
    timelinePreserved: true as const,
    routingMutation: false as const,
    sceneMutation: false as const,
    topologyMutation: false as const,
    selectionMutation: false as const,
    readOnly: true as const,
    diagnostics: COMPARE_OVERLAY_CONTROLLER_DIAGNOSTICS,
  });
}

export function activateCompareOverlay(input: CompareOverlayControllerInput): CompareOverlayControllerState {
  latestCompareOverlayControllerState = buildControllerState("overlay_on", input);
  return latestCompareOverlayControllerState;
}

export function deactivateCompareOverlay(input: CompareOverlayControllerInput): CompareOverlayControllerState {
  latestCompareOverlayControllerState = buildControllerState("overlay_off", input);
  return latestCompareOverlayControllerState;
}

export function getCompareOverlayControllerState(): CompareOverlayControllerState {
  return latestCompareOverlayControllerState;
}

export function resetCompareOverlayControllerForTests(): void {
  latestCompareOverlayControllerState = EMPTY_COMPARE_OVERLAY_CONTROLLER_STATE;
}

export const CompareOverlayController = Object.freeze({
  activateCompareOverlay,
  deactivateCompareOverlay,
  getCompareOverlayControllerState,
  resetCompareOverlayControllerForTests,
  buildCompareOverlayPreservedState,
  diagnostics: COMPARE_OVERLAY_CONTROLLER_DIAGNOSTICS,
  emptyState: EMPTY_COMPARE_OVERLAY_CONTROLLER_STATE,
});
