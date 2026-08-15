/**
 * SP:1.2 — Executive Viewing Angle tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS,
  EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS,
} from "./executiveCameraFoundation.ts";
import {
  EXECUTIVE_OVERVIEW_VIEWING_CAMERA_PRESENTATION,
  EXECUTIVE_OVERVIEW_VIEWING_POLICY,
  EXECUTIVE_VIEWING_ANGLE_BOUNDARY,
  EXECUTIVE_VIEWING_FOV_RANGE,
  executiveViewingAngleArchitecturalRole,
  executiveViewingAngleIdentity,
  executiveViewingAngleNamespace,
  executiveViewingAngleUpstreamCameraFoundationIdentity,
  executiveViewingAngleVersion,
  getExecutiveOverviewCameraIntent,
  getExecutiveViewingAngleIdentity,
  resolveExecutiveDefaultViewingIntent,
  resolveExecutiveDefaultViewingPresentation,
  verifyExecutiveViewingAngle,
} from "./executiveViewingAngle.ts";

const source = readFileSync(
  new URL("./executiveViewingAngle.ts", import.meta.url),
  "utf8",
);

test("1. SP:1.2 identity depends on SP:1.1 foundation", () => {
  const identity = getExecutiveViewingAngleIdentity();
  assert.equal(executiveViewingAngleIdentity, "SP:1.2/ExecutiveViewingAngle");
  assert.equal(identity.id, "SP:1.2/ExecutiveViewingAngle");
  assert.equal(executiveViewingAngleVersion, "1.2.0");
  assert.equal(
    executiveViewingAngleNamespace,
    "nexora.spatial-presentation.executive-viewing-angle",
  );
  assert.equal(
    executiveViewingAngleArchitecturalRole,
    "PresentationOnlyExecutiveViewingPolicy",
  );
  assert.equal(
    executiveViewingAngleUpstreamCameraFoundationIdentity,
    "SP:1.1/ExecutiveCameraFoundation",
  );
  assert.equal(
    identity.upstreamCameraFoundation,
    "SP:1.1/ExecutiveCameraFoundation",
  );
});

test("2. default view is elevated above the Stage", () => {
  const presentation = resolveExecutiveDefaultViewingPresentation();
  assert.ok(presentation.position.y > presentation.target.y);
  assert.ok(
    EXECUTIVE_OVERVIEW_VIEWING_POLICY.elevation >
      EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS.minimumElevation,
  );
});

test("3. default view is not straight-on", () => {
  const intent = resolveExecutiveDefaultViewingIntent();
  const presentation = resolveExecutiveDefaultViewingPresentation();
  assert.notEqual(intent.azimuth, 0);
  assert.ok(Math.abs(presentation.position.x - presentation.target.x) > 0.5);
});

test("4. default view remains inside SP:1.1 safety constraints", () => {
  const intent = resolveExecutiveDefaultViewingIntent();
  assert.ok(
    intent.distance >= EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS.minimumDistance,
  );
  assert.ok(
    intent.distance <= EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS.maximumDistance,
  );
  assert.ok(
    intent.elevation >= EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS.minimumElevation,
  );
  assert.ok(
    intent.elevation <= EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS.maximumElevation,
  );
});

test("5. resolved FOV is within approved executive range", () => {
  const presentation = resolveExecutiveDefaultViewingPresentation();
  assert.ok(presentation.fov >= EXECUTIVE_VIEWING_FOV_RANGE.minimumFov);
  assert.ok(presentation.fov <= EXECUTIVE_VIEWING_FOV_RANGE.maximumFov);
  assert.equal(presentation.fov, EXECUTIVE_VIEWING_FOV_RANGE.defaultFov);
});

test("6. target is deterministic", () => {
  const a = resolveExecutiveDefaultViewingIntent();
  const b = resolveExecutiveDefaultViewingIntent();
  assert.deepEqual(a.target, b.target);
  assert.deepEqual(
    a.target,
    EXECUTIVE_OVERVIEW_VIEWING_POLICY.target,
  );
});

test("7. camera position is finite", () => {
  const presentation = EXECUTIVE_OVERVIEW_VIEWING_CAMERA_PRESENTATION;
  assert.ok(Number.isFinite(presentation.position.x));
  assert.ok(Number.isFinite(presentation.position.y));
  assert.ok(Number.isFinite(presentation.position.z));
  assert.ok(Number.isFinite(presentation.target.x));
  assert.ok(Number.isFinite(presentation.target.y));
  assert.ok(Number.isFinite(presentation.target.z));
});

test("8. identical inputs resolve identically", () => {
  const samples = Array.from({ length: 5 }, () =>
    resolveExecutiveDefaultViewingPresentation(),
  );
  for (let index = 1; index < samples.length; index += 1) {
    assert.deepEqual(samples[index], samples[0]);
  }
});

test("9. Stage center offsets are handled correctly where supported", () => {
  const centered = resolveExecutiveDefaultViewingPresentation({
    stageCenter: { x: 0.4, y: 0.2, z: -0.3 },
  });
  assert.deepEqual(centered.target, { x: 0.4, y: 0.2, z: -0.3 });
  assert.ok(
    Math.abs(centered.position.x - 0.4) > 0.5 ||
      Math.abs(centered.position.z + 0.3) > 0.5,
  );
});

test("10. default angle does not violate min/max elevation", () => {
  const intent = getExecutiveOverviewCameraIntent();
  assert.ok(
    intent.elevation >= EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS.minimumElevation,
  );
  assert.ok(
    intent.elevation <= EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS.maximumElevation,
  );
  assert.notEqual(
    intent.elevation,
    EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS.minimumElevation,
  );
  assert.notEqual(
    intent.elevation,
    EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS.maximumElevation,
  );
});

test("11. resolver does not mutate inputs", () => {
  const input = {
    profile: "overview" as const,
    stageCenter: { x: 0.1, y: 0.2, z: 0.3 },
    framing: { top: 0.1, right: 0.2, bottom: 0.1, left: 0.08 },
  };
  const before = JSON.stringify(input);
  resolveExecutiveDefaultViewingPresentation(input);
  assert.equal(JSON.stringify(input), before);
});

test("12. SP:1.2 does not introduce user navigation state", () => {
  assert.equal(EXECUTIVE_VIEWING_ANGLE_BOUNDARY.introducesOrbitUi, false);
  assert.equal(
    EXECUTIVE_VIEWING_ANGLE_BOUNDARY.introducesFreeCameraNavigation,
    false,
  );
  assert.doesNotMatch(source, /OrbitControls/);
  assert.doesNotMatch(source, /useFrame/);
  assert.doesNotMatch(source, /navigationState|orbitState|cameraJoystick/);
  assert.doesNotMatch(source, /from\s+["']three["']/);
  assert.doesNotMatch(source, /@react-three\/fiber/);
});

test("13. viewing policy does not depend on executive severity/business state", () => {
  assert.equal(EXECUTIVE_VIEWING_ANGLE_BOUNDARY.ownsExecutiveSeverity, false);
  assert.equal(EXECUTIVE_VIEWING_ANGLE_BOUNDARY.ownsObjectImportance, false);
  assert.equal(EXECUTIVE_VIEWING_ANGLE_BOUNDARY.ownsDataReality, false);
  assert.equal(EXECUTIVE_VIEWING_ANGLE_BOUNDARY.ownsBusinessTruth, false);
  assert.equal(
    EXECUTIVE_VIEWING_ANGLE_BOUNDARY.presentationNeutralViewpoint,
    true,
  );
  // Policy resolution must not branch on business/severity signals.
  assert.doesNotMatch(
    source,
    /executiveVisualState|stateMarker|attentionLevel|kpiResult/,
  );
  assert.doesNotMatch(source, /if\s*\([^)]*(critical|recommended|severity)/i);
  const verified = verifyExecutiveViewingAngle();
  assert.equal(verified.ok, true);
  assert.equal(verifyExecutiveViewingAngle({ forceFailure: true }).ok, false);
});
