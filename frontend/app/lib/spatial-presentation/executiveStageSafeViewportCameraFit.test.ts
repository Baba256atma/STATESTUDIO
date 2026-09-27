/**
 * NPA-T STAGE-CAMERA:FIX1 — Safe Viewport camera fit tests A–R.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  EXECUTIVE_STAGE_FIXED_CAMERA,
  EXECUTIVE_STAGE_FIXED_CAMERA_AZIMUTH_DEG,
  EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE,
  EXECUTIVE_STAGE_FIXED_CAMERA_ELEVATION_DEG,
  EXECUTIVE_STAGE_FIXED_CAMERA_FOV,
  EXECUTIVE_STAGE_2D_FIXED_CAMERA_BOUNDARY,
  resolveExecutiveStageFixedCamera,
  resolveExecutiveStageFixedCameraAtDistance,
} from "./executiveStage2DFixedCamera.ts";
import { EXECUTIVE_STAGE_MOTION } from "./executiveStageMotion.ts";
import { EXECUTIVE_STAGE_DEEP_Z_RANGE } from "./executiveStageDeepZVisualEnvironment.ts";
import { EXECUTIVE_OBJECT_MATERIAL_PROFILES } from "./executiveObjectMaterialSurface.ts";
import { EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE } from "./executiveOvsObjectVisualLanguage.ts";
import { EXECUTIVE_OBJECT_LABEL_OPACITY_BOUNDS } from "./executiveObjectLabelInformationDensity.ts";
import { NEXORA_MVP_STAGE_ATMOSPHERE_FIELD } from "../nex-mvp/nexoraMVPWorkspacePresentation.ts";
import { EXECUTIVE_OVS_ISOMETRIC_THEATRE_BOUNDARY } from "./executiveOvsIsometricTheatreVisual.ts";
import {
  EXECUTIVE_STAGE_SAFE_VIEWPORT_FIT,
  EXECUTIVE_STAGE_SAFE_VIEWPORT_FIT_BOUNDARY,
  EXECUTIVE_STAGE_SAFE_VIEWPORT_OCCLUSION_TESTIDS,
  deriveExecutiveStageSafeSceneBounds,
  measureExecutiveStageSafeViewportInsets,
  resolveExecutiveStageSafeViewportCameraFit,
  verifyExecutiveStageSafeViewportCameraFit,
} from "./executiveStageSafeViewportCameraFit.ts";

const here = dirname(fileURLToPath(import.meta.url));

function compactInsets(): Parameters<
  typeof resolveExecutiveStageSafeViewportCameraFit
>[0]["insets"] {
  return Object.freeze({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: 1100,
    height: 820,
  });
}

function advisorOpenInsets() {
  return Object.freeze({
    left: 96,
    right: 0,
    top: 88,
    bottom: 72,
    width: 720,
    height: 760,
  });
}

function objectAt(
  id: string,
  x: number,
  y: number,
  extras?: { opacity?: number; role?: string; scale?: number },
) {
  return Object.freeze({
    id,
    targetPosition: [x, y, 0] as const,
    scale: extras?.scale ?? 1,
    opacity: extras?.opacity ?? 1,
    role: extras?.role ?? "related",
  });
}

test("A — Baseline compact UI stays at certified distance 11", () => {
  const fit = resolveExecutiveStageSafeViewportCameraFit({
    insets: compactInsets(),
    sceneBounds: deriveExecutiveStageSafeSceneBounds([
      objectAt("obj-revenue", 0, 0),
    ]),
  });
  assert.equal(fit.baseDistance, 11);
  assert.equal(fit.effectiveDistance, 11);
  assert.equal(fit.reason, "base");
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_DISTANCE, 11);
  assert.equal(verifyExecutiveStageSafeViewportCameraFit(), true);
});

test("B — Advisor-narrowed canvas with top/left overlays can increase distance", () => {
  const sceneBounds = deriveExecutiveStageSafeSceneBounds([
    objectAt("obj-capacity", 0, 0.4),
    objectAt("obj-gap", -2.4, 1.6),
    objectAt("obj-plan", 2.6, 1.5),
    objectAt("obj-expand", -2.2, -1.7),
    objectAt("obj-expansion", 2.4, -1.5),
  ]);
  const fit = resolveExecutiveStageSafeViewportCameraFit({
    insets: advisorOpenInsets(),
    sceneBounds,
  });
  assert.ok(fit.effectiveDistance >= 11);
  assert.ok(fit.effectiveDistance <= EXECUTIVE_STAGE_SAFE_VIEWPORT_FIT.maxDistance);
  assert.ok(fit.ndc.right - fit.ndc.left < 2);
});

test("C — Closing Advisor (compact insets) returns to base when scene is simple", () => {
  const sceneBounds = deriveExecutiveStageSafeSceneBounds([
    objectAt("obj-revenue", 0, 0),
  ]);
  const open = resolveExecutiveStageSafeViewportCameraFit({
    insets: advisorOpenInsets(),
    sceneBounds,
  });
  const closed = resolveExecutiveStageSafeViewportCameraFit({
    insets: compactInsets(),
    sceneBounds,
  });
  assert.equal(closed.effectiveDistance, 11);
  assert.ok(closed.effectiveDistance <= open.effectiveDistance);
});

test("D — Top context surface reduces safe NDC top", () => {
  const withTop = measureExecutiveStageSafeViewportInsets({
    canvas: { left: 0, top: 0, right: 1000, bottom: 800, width: 1000, height: 800 },
    overlays: [{ left: 200, top: 8, right: 800, bottom: 72 }],
  });
  assert.ok(withTop.top >= 60);
  const fit = resolveExecutiveStageSafeViewportCameraFit({
    insets: { ...compactInsets(), top: withTop.top, height: 800, width: 1000 },
    sceneBounds: { minX: -1, maxX: 1, minY: -1, maxY: 2.8 },
  });
  assert.ok(fit.ndc.top < 1 - 0.08);
});

test("E — Combined Advisor + top surface uses one resulting fit", () => {
  const a = resolveExecutiveStageSafeViewportCameraFit({
    insets: advisorOpenInsets(),
    sceneBounds: { minX: -2.5, maxX: 2.5, minY: -1.8, maxY: 2.2 },
  });
  const b = resolveExecutiveStageSafeViewportCameraFit({
    insets: advisorOpenInsets(),
    sceneBounds: { minX: -2.5, maxX: 2.5, minY: -1.8, maxY: 2.2 },
  });
  assert.deepEqual(a, b);
  assert.equal(a.effectiveDistance, Math.max(11, a.requiredDistance));
});

test("F — Bottom overlay increases bottom inset", () => {
  const measured = measureExecutiveStageSafeViewportInsets({
    canvas: { left: 0, top: 0, right: 900, bottom: 700, width: 900, height: 700 },
    overlays: [{ left: 520, top: 520, right: 880, bottom: 690 }],
  });
  assert.ok(measured.bottom >= 150);
});

test("F2 — Tall left object list is a left strip, not a top band", () => {
  const measured = measureExecutiveStageSafeViewportInsets({
    canvas: { left: 0, top: 0, right: 1000, bottom: 800, width: 1000, height: 800 },
    overlays: [{ left: 12, top: 12, right: 164, bottom: 340 }],
  });
  assert.ok(measured.left >= 140);
  assert.ok(measured.top < 80);
});

test("F3 — Upper-right KPI card is not treated as a full-height right panel", () => {
  const measured = measureExecutiveStageSafeViewportInsets({
    canvas: { left: 0, top: 0, right: 1064, bottom: 799, width: 1064, height: 799 },
    overlays: [{ left: 780, top: 48, right: 1060, bottom: 260 }],
  });
  assert.ok(measured.right < 200);
  assert.ok(measured.top >= 40);
});

test("G — Combined max insets remain a single viewport, not multiplied zooms", () => {
  const source = readFileSync(
    join(here, "./executiveStageSafeViewportCameraFit.ts"),
    "utf8",
  );
  assert.doesNotMatch(source, /advisorOpen \? distance \*/);
  assert.doesNotMatch(source, /topCard \? distance \*/);
  assert.match(source, /resolveExecutiveStageSafeViewportCameraFit/);
});

test("H — Capacity-like five-object scene stays within max distance", () => {
  const fit = resolveExecutiveStageSafeViewportCameraFit({
    insets: advisorOpenInsets(),
    sceneBounds: deriveExecutiveStageSafeSceneBounds([
      objectAt("Capacity", 0, 0.2),
      objectAt("Capacity Gap", -2.1, 1.4),
      objectAt("Capacity Expansion Plan", 2.2, 1.3),
      objectAt("Expand Capacity", -2.0, -1.5),
      objectAt("Capacity Expansion", 2.1, -1.4),
    ]),
  });
  assert.ok(fit.effectiveDistance <= 14);
  assert.equal(fit.conflict === "SCENE_DENSITY_LAYOUT_CONFLICT" || fit.conflict === "none", true);
});

test("I — Risk/Nexo scene bounds remain origin-relative and z=0", () => {
  const bounds = deriveExecutiveStageSafeSceneBounds([
    objectAt("obj-risk", 0, 0.8),
    objectAt("obj-delivery", -1.6, -1.1),
    objectAt("obj-capacity", 0, -1.2),
    objectAt("obj-customer", 1.6, -1.1),
  ]);
  assert.ok(bounds.maxY > bounds.minY);
  const pose = resolveExecutiveStageFixedCameraAtDistance(12);
  assert.deepEqual(pose.target, { x: 0, y: 0, z: 0 });
  assert.equal(EXECUTIVE_STAGE_DEEP_Z_RANGE.semanticPlaneZ, 0);
});

test("J — Simple object focus does not zoom out on compact UI", () => {
  const fit = resolveExecutiveStageSafeViewportCameraFit({
    insets: compactInsets(),
    sceneBounds: deriveExecutiveStageSafeSceneBounds([
      objectAt("obj-revenue", 0, 0, { role: "focus" }),
    ]),
  });
  assert.equal(fit.effectiveDistance, 11);
  assert.equal(fit.reason, "base");
});

test("K — Same UI state is deterministic (no drift)", () => {
  const input = {
    insets: advisorOpenInsets(),
    sceneBounds: { minX: -2, maxX: 2, minY: -1.5, maxY: 1.8 },
  };
  const samples = Array.from({ length: 5 }, () =>
    resolveExecutiveStageSafeViewportCameraFit(input),
  );
  for (const sample of samples) {
    assert.deepEqual(sample, samples[0]);
  }
});

test("L — Resize recomputes from canvas width/height", () => {
  const sceneBounds = { minX: -2.4, maxX: 2.4, minY: -1.6, maxY: 2 };
  const wide = resolveExecutiveStageSafeViewportCameraFit({
    insets: { ...advisorOpenInsets(), width: 1200, height: 800, left: 80, top: 80 },
    sceneBounds,
  });
  const narrow = resolveExecutiveStageSafeViewportCameraFit({
    insets: { ...advisorOpenInsets(), width: 640, height: 800, left: 80, top: 80 },
    sceneBounds,
  });
  assert.ok(narrow.effectiveDistance >= wide.effectiveDistance);
});

test("M — Reduced motion uses existing STAGE-MOTION durations; final distance identical", () => {
  assert.equal(EXECUTIVE_STAGE_MOTION.reducedMotionDurationMs, 80);
  assert.equal(EXECUTIVE_STAGE_MOTION.topologyDurationMs, 450);
  const controller = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraExecutiveCameraController.tsx"),
    "utf8",
  );
  assert.match(controller, /prefers-reduced-motion/);
  assert.match(controller, /reducedMotionDurationMs/);
});

test("N — NexoraExecutiveCameraController remains sole camera authority", () => {
  const controller = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraExecutiveCameraController.tsx"),
    "utf8",
  );
  const canvas = readFileSync(
    join(here, "../../executive/nex-mvp/stage/NexoraStageCanvas.tsx"),
    "utf8",
  );
  assert.match(controller, /NexoraExecutiveCameraController/);
  assert.doesNotMatch(controller, /OrbitControls/);
  assert.doesNotMatch(canvas, /OrbitControls/);
  assert.equal(EXECUTIVE_STAGE_2D_FIXED_CAMERA_BOUNDARY.introducesOrbitControls, false);
  assert.equal(EXECUTIVE_STAGE_SAFE_VIEWPORT_FIT_BOUNDARY.createsCameraController, false);
});

test("O — Fit does not write Object XY / Z", () => {
  const source = readFileSync(
    join(here, "./executiveStageSafeViewportCameraFit.ts"),
    "utf8",
  );
  assert.equal(EXECUTIVE_STAGE_SAFE_VIEWPORT_FIT_BOUNDARY.movesCanonicalXy, false);
  assert.doesNotMatch(source, /targetPosition\[0\]\s*=/);
  assert.equal(EXECUTIVE_STAGE_DEEP_Z_RANGE.semanticPlaneZ, 0);
});

test("P — Director / Nexo unchanged", () => {
  assert.equal(EXECUTIVE_OVS_ISOMETRIC_THEATRE_BOUNDARY.ownsObjectCatalog, false);
  const source = readFileSync(
    join(here, "./executiveStageSafeViewportCameraFit.ts"),
    "utf8",
  );
  assert.doesNotMatch(source, /selectNexoraDirectorNexoFamily|NEXO_RISK/);
});

test("Q — Visual systems unchanged", () => {
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.operational, "rounded-block");
  assert.equal(EXECUTIVE_OBJECT_MATERIAL_PROFILES.operational.baseColor, "#4a5563");
  assert.equal(EXECUTIVE_OBJECT_LABEL_OPACITY_BOUNDS.normal, 0.88);
  assert.equal(NEXORA_MVP_STAGE_ATMOSPHERE_FIELD.extent, 48);
  assert.equal(EXECUTIVE_STAGE_DEEP_Z_RANGE.particleCount, 0);
});

test("R — No new camera/layout authority; overlays reuse existing testids", () => {
  assert.ok(EXECUTIVE_STAGE_SAFE_VIEWPORT_OCCLUSION_TESTIDS.includes(
    "nexora-stage-interaction-breadcrumb",
  ));
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_AZIMUTH_DEG, 8);
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_ELEVATION_DEG, 10);
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA_FOV, 42);
  assert.deepEqual(resolveExecutiveStageFixedCamera().target, { x: 0, y: 0, z: 0 });
  assert.equal(EXECUTIVE_STAGE_FIXED_CAMERA.azimuthDeg, 8);
  const pose = resolveExecutiveStageFixedCameraAtDistance(11);
  assert.deepEqual(pose.position, resolveExecutiveStageFixedCamera().position);
});
