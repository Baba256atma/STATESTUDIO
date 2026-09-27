/**
 * NPA-T STAGE-SPATIAL:2 — restrained off-axis STAGE-2D:1 camera tests A–J.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { projectNexoraDecisionTheatreFoundation } from "../decision-theatre/nexoraDecisionTheatrePublicIndex.ts";
import { resolveNexoraLiveStageDthExpSpatial } from "../../executive/nex-mvp/resolveNexoraLiveStageDthExpSpatial.ts";
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
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { EXECUTIVE_STAGE_MOTION } from "./executiveStageMotion.ts";
import {
  EXECUTIVE_STAGE_2D_CAMERA_AUTHORITY,
  EXECUTIVE_STAGE_2D_CAMERA_OBSERVABILITY,
  EXECUTIVE_STAGE_2D_DEPTH,
  EXECUTIVE_STAGE_2D_FIXED_CAMERA_BOUNDARY,
  EXECUTIVE_STAGE_FIXED_CAMERA,
  EXECUTIVE_STAGE_FIXED_CAMERA_POSE_BOUNDS,
  isExecutiveStageFixedCameraPosition,
  resolveExecutiveStageFixedCamera,
  verifyExecutiveStage2DFixedCamera,
} from "./executiveStage2DFixedCamera.ts";

const here = dirname(fileURLToPath(import.meta.url));

function pipeline(objectId: string | null) {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  if (objectId != null) {
    state = selectNexoraMVPInteractionSubject(state, objectId);
  }
  const base = deriveNexoraMVPStageInteractionPresentation(state);
  const withGrammar = applyExecutiveFocusVisualGrammarToStagePresentation(base, {
    presentationDepth: "minimum",
  });
  const withNetwork = applyExecutiveNetworkTopologyToStagePresentation(withGrammar);
  const withPlane = applyExecutivePresentationPlaneToStagePresentation(withNetwork);
  return applyExecutiveStageFixedCameraToStagePresentation(withPlane);
}

function theatreFor(objectId: string | null) {
  let stageState = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  if (objectId != null) {
    stageState = selectNexoraMVPInteractionSubject(stageState, objectId);
  }
  return projectNexoraDecisionTheatreFoundation({ stageState });
}

test("A — Pose bounds: neutral pose is inside certified STAGE-SPATIAL:2 bounds", () => {
  const camera = EXECUTIVE_STAGE_FIXED_CAMERA;
  const bounds = EXECUTIVE_STAGE_FIXED_CAMERA_POSE_BOUNDS;
  assert.ok(camera.azimuthDeg >= bounds.azimuthDeg.min);
  assert.ok(camera.azimuthDeg <= bounds.azimuthDeg.max);
  assert.ok(camera.elevationDeg >= bounds.elevationDeg.min);
  assert.ok(camera.elevationDeg <= bounds.elevationDeg.max);
  assert.ok(camera.distance >= bounds.distance.min);
  assert.ok(camera.distance <= bounds.distance.max);
  assert.ok(camera.fov >= bounds.fov.min);
  assert.ok(camera.fov <= bounds.fov.max);
  assert.deepEqual(camera.target, { x: 0, y: 0, z: 0 });
  assert.equal(verifyExecutiveStage2DFixedCamera().ok, true);
});

test("B — Off-axis: azimuth and elevation are nonzero and bounded", () => {
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA.azimuthDeg, 8);
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA.elevationDeg, 10);
  assert.ok(EXECUTIVE_STAGE_FIXED_CAMERA.azimuth > 0);
  assert.ok(EXECUTIVE_STAGE_FIXED_CAMERA.elevation > 0);
  const resolved = resolveExecutiveStageFixedCamera();
  assert.ok(resolved.position.x !== 0);
  assert.ok(resolved.position.y !== 0);
  assert.ok(resolved.position.z < 11);
  assert.ok(resolved.position.z > 10.5);
});

test("C — Fixed across focus: overview and focused scenes resolve the same camera pose", () => {
  const overview = pipeline(null);
  const capacity = pipeline("obj-capacity");
  const risk = pipeline("obj-risk");
  assert.deepEqual(overview.scene.camera, capacity.scene.camera);
  assert.deepEqual(capacity.scene.camera, risk.scene.camera);
  assert.equal(isExecutiveStageFixedCameraPosition(capacity.scene.camera.position), true);
  assert.equal(EXECUTIVE_STAGE_2D_FIXED_CAMERA_BOUNDARY.movesCameraOnFocus, false);
  assert.equal(EXECUTIVE_STAGE_2D_CAMERA_AUTHORITY.statement, "Object moves. Camera does not chase.");
});

test("D — No pointer offset: pointer input cannot change camera", () => {
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA.pointerOffset, 0);
  assert.equal(EXECUTIVE_STAGE_2D_FIXED_CAMERA_BOUNDARY.allowsPointerParallax, false);
  assert.equal(EXECUTIVE_STAGE_2D_CAMERA_OBSERVABILITY.pointerOffset, "0");
  const controller = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraExecutiveCameraController.tsx"),
    "utf8",
  );
  assert.doesNotMatch(controller, /pointerX|clientX|pointermove|onPointerMove/);
  assert.match(controller, /pointerOffset/);
});

test("E — Reduced motion uses the same static pose", () => {
  const a = resolveExecutiveStageFixedCamera();
  const b = resolveExecutiveStageFixedCamera();
  assert.deepEqual(a, b);
  assert.equal(EXECUTIVE_STAGE_MOTION.reducedMotionDurationMs, 80);
  const source = readFileSync(join(here, "./executiveStage2DFixedCamera.ts"), "utf8");
  assert.doesNotMatch(source, /prefersReducedMotion|prefers-reduced-motion/);
});

test("F — Canonical Object semanticZ remains 0", () => {
  assert.equal(EXECUTIVE_STAGE_2D_DEPTH, 0);
  const presentation = pipeline("obj-capacity");
  for (const object of presentation.scene.objects) {
    assert.equal(object.targetPosition[2], 0);
  }
});

test("G — Executive Stage still has no OrbitControls / free camera", () => {
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA.orbitEnabled, false);
  assert.equal(EXECUTIVE_STAGE_2D_FIXED_CAMERA_BOUNDARY.introducesOrbitControls, false);
  const controller = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraExecutiveCameraController.tsx"),
    "utf8",
  );
  const canvas = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageCanvas.tsx"),
    "utf8",
  );
  assert.doesNotMatch(controller, /OrbitControls/);
  assert.doesNotMatch(canvas, /OrbitControls/);
});

test("H — Object selection still resolves canonical ID", () => {
  const capacity = pipeline("obj-capacity");
  assert.equal(capacity.scene.focusedObjectId, "obj-capacity");
  assert.equal(capacity.scene.selectedObjectId, "obj-capacity");
  const object = capacity.scene.objects.find((entry) => entry.id === "obj-capacity");
  assert.equal(object?.id, "obj-capacity");
});

test("I — Camera change does not alter selected Nexo family", () => {
  const riskSpatial = resolveNexoraLiveStageDthExpSpatial(theatreFor("obj-risk"));
  const capacitySpatial = resolveNexoraLiveStageDthExpSpatial(theatreFor("obj-capacity"));
  assert.equal(riskSpatial?.family, "NEXO_RISK");
  assert.equal(capacitySpatial, null);
});

test("J — Precision 2D host is not transformed by camera", () => {
  const contextual = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageContextualVisual.tsx"),
    "utf8",
  );
  assert.match(contextual, /NexoraEvidenceVisualView/);
  const canvas = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageCanvas.tsx"),
    "utf8",
  );
  assert.doesNotMatch(canvas, /NexoraEvidenceVisualView/);
  assert.equal(canvas.split("<Canvas").length - 1, 1);
});
