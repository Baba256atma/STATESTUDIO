import test from "node:test";
import assert from "node:assert/strict";

import {
  buildCompareOverlayMarker,
  buildCompareOverlayProfile,
  buildCompareOverlayState,
} from "./CompareOverlayContract.ts";
import {
  activateCompareOverlay,
  C2_OVERLAY_CONTROLLER_COMPLETE_TAG,
  COMPARE_OVERLAY_CONTROLLER_DIAGNOSTIC,
  COMPARE_OVERLAY_CONTROLLER_READY_DIAGNOSTIC,
  CompareOverlayController,
  deactivateCompareOverlay,
  getCompareOverlayControllerState,
  resetCompareOverlayControllerForTests,
  type CompareOverlayPreservedState,
} from "./CompareOverlayController.ts";

function overlayState() {
  const marker = buildCompareOverlayMarker({
    markerId: "marker-1",
    scenarioRole: "scenarioA",
    markerKind: "object",
    targetId: "object-1",
    label: "Object improved",
    intensity: 50,
    confidence: 90,
  });
  const profile = buildCompareOverlayProfile({
    profileId: "profile-1",
    comparisonId: "compare-1",
    scenarioAId: "scenario-a",
    scenarioBId: "scenario-b",
    markers: [marker],
  });
  return buildCompareOverlayState({
    activeComparisonId: "compare-1",
    profiles: [profile],
  });
}

function preservedState(): CompareOverlayPreservedState {
  return Object.freeze({
    scene: Object.freeze({
      sceneId: "scene-1",
      sceneRevision: "rev-7",
      objectCount: 42,
      topologyFingerprint: "topology:v1",
    }),
    selection: Object.freeze({
      selectedObjectIds: Object.freeze(["object-1", "object-2"]),
      focusedObjectId: "object-1",
    }),
    camera: Object.freeze({
      position: Object.freeze([1, 2, 3]),
      target: Object.freeze([4, 5, 6]),
      zoom: 1.25,
    }),
    timeline: Object.freeze({
      activeFrame: 12,
      playbackState: "paused",
      rangeStart: 0,
      rangeEnd: 30,
    }),
  });
}

test.beforeEach(() => {
  resetCompareOverlayControllerForTests();
});

test("exports C2 overlay controller tag and diagnostics", () => {
  assert.equal(C2_OVERLAY_CONTROLLER_COMPLETE_TAG, "[C2_OVERLAY_CONTROLLER_COMPLETE]");
  assert.equal(COMPARE_OVERLAY_CONTROLLER_DIAGNOSTIC, "[COMPARE_OVERLAY_CONTROLLER]");
  assert.equal(COMPARE_OVERLAY_CONTROLLER_READY_DIAGNOSTIC, "[COMPARE_OVERLAY_CONTROLLER_READY]");
  assert.deepEqual(CompareOverlayController.diagnostics, [
    "[COMPARE_OVERLAY_CONTROLLER]",
    "[COMPARE_OVERLAY_CONTROLLER_READY]",
  ]);
});

test("toggles overlay on and off without mutation authority", () => {
  const state = overlayState();
  const preserved = preservedState();

  const onState = activateCompareOverlay({ overlayState: state, preservedState: preserved });
  assert.equal(onState.mode, "overlay_on");
  assert.equal(onState.overlayActive, true);
  assert.equal(onState.routingMutation, false);
  assert.equal(onState.sceneMutation, false);
  assert.equal(onState.topologyMutation, false);
  assert.equal(onState.selectionMutation, false);
  assert.equal(getCompareOverlayControllerState(), onState);

  const offState = deactivateCompareOverlay({ overlayState: state, preservedState: preserved });
  assert.equal(offState.mode, "overlay_off");
  assert.equal(offState.overlayActive, false);
  assert.equal(offState.routingMutation, false);
  assert.equal(offState.sceneMutation, false);
  assert.equal(offState.topologyMutation, false);
  assert.equal(offState.selectionMutation, false);
  assert.equal(getCompareOverlayControllerState(), offState);
});

test("preserves scene selection camera and timeline snapshots", () => {
  const state = overlayState();
  const preserved = preservedState();
  const beforeOverlay = JSON.stringify(state);
  const beforePreserved = JSON.stringify(preserved);

  const controllerState = activateCompareOverlay({ overlayState: state, preservedState: preserved });

  assert.deepEqual(controllerState.preservedState.scene, preserved.scene);
  assert.deepEqual(controllerState.preservedState.selection, preserved.selection);
  assert.deepEqual(controllerState.preservedState.camera, preserved.camera);
  assert.deepEqual(controllerState.preservedState.timeline, preserved.timeline);
  assert.notEqual(controllerState.preservedState.selection.selectedObjectIds, preserved.selection.selectedObjectIds);
  assert.notEqual(controllerState.preservedState.camera.position, preserved.camera.position);
  assert.equal(controllerState.scenePreserved, true);
  assert.equal(controllerState.selectionPreserved, true);
  assert.equal(controllerState.cameraPreserved, true);
  assert.equal(controllerState.timelinePreserved, true);
  assert.equal(JSON.stringify(state), beforeOverlay);
  assert.equal(JSON.stringify(preserved), beforePreserved);
  assert.equal(Object.isFrozen(controllerState), true);
  assert.equal(Object.isFrozen(controllerState.preservedState.selection.selectedObjectIds), true);
  assert.throws(() => {
    (controllerState.preservedState.selection.selectedObjectIds as string[]).push("object-3");
  }, TypeError);
});
