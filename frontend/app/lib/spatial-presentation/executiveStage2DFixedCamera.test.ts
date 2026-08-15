/**
 * STAGE-2D:1 — Fixed Camera Foundation invariants.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  applyExecutiveStageFixedCameraToStagePresentation,
} from "../nex-mvp/nexoraMVPExecutiveStage2DFixedCamera.ts";
import { applyExecutiveFocusVisualGrammarToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveFocusVisualGrammar.ts";
import { applyExecutiveNetworkTopologyToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveNetworkTopology.ts";
import { applyExecutivePresentationPlaneToStagePresentation } from "../nex-mvp/nexoraMVPExecutivePresentationPlane.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  selectNexoraMVPInteractionSubject,
  syncNexoraMVPObjectInteractionShellContext,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  CANONICAL_STAGE_CENTER,
  CANONICAL_STAGE_DEPTH,
  EXECUTIVE_STAGE_2D_CENTER,
  EXECUTIVE_STAGE_2D_DEPTH,
  EXECUTIVE_STAGE_2D_FIXED_CAMERA_BOUNDARY,
  EXECUTIVE_STAGE_FIXED_CAMERA,
  EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
  executiveStage2DFixedCameraIdentity,
  executiveStage2DFixedCameraNamespace,
  executiveStage2DFixedCameraVersion,
  getExecutiveStage2DFixedCameraIdentity,
  isExecutiveStageFixedCameraPosition,
  isExecutiveStageFixedCameraTarget,
  normalizeExecutiveStage2DPosition,
  resolveExecutiveStageFixedCamera,
  resolveExecutiveStageFixedCameraTuple,
  verifyExecutiveStage2DFixedCamera,
} from "./executiveStage2DFixedCamera.ts";

const here = dirname(fileURLToPath(import.meta.url));

function overviewPresentation() {
  const state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  return deriveNexoraMVPStageInteractionPresentation(state);
}

function focusPresentation(objectId: string) {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, objectId);
  state = syncNexoraMVPObjectInteractionShellContext(state, {
    workspace: state.workspace,
    presentationState: "minimum",
    environmentIntent: state.environmentIntent,
  });
  return deriveNexoraMVPStageInteractionPresentation(state);
}

function stage2dPipeline(objectId: string | null) {
  const base =
    objectId == null ? overviewPresentation() : focusPresentation(objectId);
  const withGrammar = applyExecutiveFocusVisualGrammarToStagePresentation(base, {
    presentationDepth: "minimum",
  });
  const withNetwork = applyExecutiveNetworkTopologyToStagePresentation(withGrammar);
  const withPlane = applyExecutivePresentationPlaneToStagePresentation(withNetwork);
  return applyExecutiveStageFixedCameraToStagePresentation(withPlane);
}

test("STAGE-2D:1 identity / version / namespace", () => {
  const identity = getExecutiveStage2DFixedCameraIdentity();
  assert.equal(identity.id, "STAGE-2D:1/ExecutiveStage2DFixedCamera");
  assert.equal(identity.version, "2.1.0");
  assert.equal(
    identity.namespace,
    "nexora.spatial-presentation.executive-stage-2d-fixed-camera",
  );
  assert.equal(executiveStage2DFixedCameraIdentity, identity.id);
  assert.equal(executiveStage2DFixedCameraVersion, identity.version);
  assert.equal(executiveStage2DFixedCameraNamespace, identity.namespace);
  assert.equal(verifyExecutiveStage2DFixedCamera().ok, true);
});

test("Invariant A — camera target is canonical Stage center (0,0,0)", () => {
  const camera = resolveExecutiveStageFixedCamera();
  assert.deepEqual(camera.target, { x: 0, y: 0, z: 0 });
  assert.deepEqual(EXECUTIVE_STAGE_2D_CENTER, CANONICAL_STAGE_CENTER);
  assert.equal(isExecutiveStageFixedCameraTarget(camera.target), true);
  const tuple = resolveExecutiveStageFixedCameraTuple();
  assert.deepEqual(tuple.target, [0, 0, 0]);
});

test("Invariant B — focus cannot retarget camera", () => {
  const focused = stage2dPipeline("obj-budget");
  assert.equal(focused.scene.focusedObjectId, "obj-budget");
  assert.deepEqual(focused.scene.camera.target, [0, 0, 0]);
  assert.equal(
    isExecutiveStageFixedCameraPosition(focused.scene.camera.position),
    true,
  );
  assert.equal(
    EXECUTIVE_STAGE_2D_FIXED_CAMERA_BOUNDARY.retargetsOnObjectFocus,
    false,
  );
});

test("Invariant C — selection cannot move camera", () => {
  const overview = stage2dPipeline(null);
  const selected = stage2dPipeline("obj-budget");
  assert.notEqual(overview.scene.selectedObjectId, selected.scene.selectedObjectId);
  assert.deepEqual(overview.scene.camera.position, selected.scene.camera.position);
  assert.deepEqual(overview.scene.camera.target, selected.scene.camera.target);
  assert.equal(overview.scene.camera.fov, selected.scene.camera.fov);
  assert.deepEqual(selected.scene.camera.position, [
    0,
    0,
    EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
  ]);
});

test("Invariant D — competing attention cannot move camera", () => {
  // Simulate upstream focus/attention choreography proposing a non-origin target
  // while Capacity remains an attention peer and Budget is explicit focus.
  const base = focusPresentation("obj-budget");
  const poisoned = Object.freeze({
    ...base,
    scene: Object.freeze({
      ...base.scene,
      focusedObjectId: "obj-budget",
      selectedObjectId: "obj-budget",
      camera: Object.freeze({
        position: [2.4, 3.1, 7.2] as const,
        target: [0.8, 0.42, 0.15] as const,
        fov: 36,
        near: 0.1,
        far: 80,
      }),
    }),
  });

  const fixed = applyExecutiveStageFixedCameraToStagePresentation(poisoned);
  assert.equal(fixed.scene.focusedObjectId, "obj-budget");
  assert.deepEqual(fixed.scene.camera.target, [0, 0, 0]);
  assert.deepEqual(fixed.scene.camera.position, [
    0,
    0,
    EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
  ]);
  assert.equal(
    EXECUTIVE_STAGE_2D_FIXED_CAMERA_BOUNDARY.movesCameraOnAttention,
    false,
  );
  assert.equal(
    EXECUTIVE_STAGE_2D_FIXED_CAMERA_BOUNDARY.movesCameraOnFocus,
    false,
  );
});

test("Invariant E — topology depth convention z = 0", () => {
  assert.equal(EXECUTIVE_STAGE_2D_DEPTH, 0);
  assert.equal(CANONICAL_STAGE_DEPTH, 0);
  const normalized = normalizeExecutiveStage2DPosition({ x: 1.5, y: -2, z: 9 });
  assert.deepEqual(normalized, { x: 1.5, y: -2, z: 0 });

  const presentation = stage2dPipeline("obj-revenue");
  for (const object of presentation.scene.objects) {
    assert.equal(
      object.targetPosition[2],
      0,
      `${object.id} target Z must be 0`,
    );
  }
});

test("fixed camera pose is front-facing on +Z with controls disabled", () => {
  const camera = resolveExecutiveStageFixedCamera();
  assert.deepEqual(camera.position, {
    x: 0,
    y: 0,
    z: EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
  });
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA.orbitEnabled, false);
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA.panEnabled, false);
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA.zoomEnabled, false);
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA.azimuth, 0);
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA.elevation, 0);
  assert.equal(
    EXECUTIVE_STAGE_2D_FIXED_CAMERA_BOUNDARY.cameraProjection,
    "perspective",
  );
});

test("Stage host bypasses SP:1.3 navigation and exposes STAGE-2D observability", () => {
  const host = readFileSync(
    join(here, "../../executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx"),
    "utf8",
  );
  assert.match(host, /data-stage-camera-mode/);
  assert.match(host, /data-stage-camera-target/);
  assert.match(host, /data-stage-depth/);
  assert.match(host, /applyExecutiveStageFixedCameraToStagePresentation/);
  assert.doesNotMatch(host, /resolveNavigatedExecutiveCameraTuple/);
  assert.doesNotMatch(host, /NexoraExecutiveCameraNavigationControls/);
  assert.doesNotMatch(host, /OrbitControls/);

  const controller = readFileSync(
    join(
      here,
      "../../executive/nex-mvp/stage/NexoraExecutiveCameraController.tsx",
    ),
    "utf8",
  );
  assert.match(controller, /resolveExecutiveStageFixedCamera/);
  assert.match(controller, /STAGE-2D:1/);
  assert.doesNotMatch(controller, /desiredPosition/);

  const shell = readFileSync(
    join(here, "../../executive/nex-mvp/NexoraExecutiveShell.tsx"),
    "utf8",
  );
  assert.match(shell, /applyExecutiveStageFixedCameraToStagePresentation/);
});
