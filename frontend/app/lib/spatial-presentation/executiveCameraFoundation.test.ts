/**
 * SP:1.1 — Executive Camera Foundation tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING,
  DEFAULT_EXECUTIVE_FOCUS_CAMERA_INTENT,
  DEFAULT_EXECUTIVE_OVERVIEW_CAMERA_INTENT,
  DEFAULT_EXECUTIVE_OVERVIEW_CAMERA_PRESENTATION,
  EXECUTIVE_CAMERA_AZIMUTH_CONSTRAINTS,
  EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS,
  EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS,
  EXECUTIVE_CAMERA_FOUNDATION_BOUNDARY,
  EXECUTIVE_FOCUS_ANCHOR_TARGET,
  EXECUTIVE_STAGE_CENTER_TARGET,
  clampExecutiveCameraDistance,
  clampExecutiveCameraElevation,
  executiveCameraFoundationArchitecturalRole,
  executiveCameraFoundationIdentity,
  executiveCameraFoundationNamespace,
  executiveCameraFoundationVersion,
  getExecutiveCameraFoundationIdentity,
  normalizeExecutiveCameraAzimuth,
  resolveDefaultExecutiveCameraPresentation,
  resolveExecutiveCameraPresentation,
  sanitizeExecutiveCameraIntent,
  toExecutiveCameraTuplePresentation,
  verifyExecutiveCameraFoundation,
  type ExecutiveCameraIntent,
} from "./executiveCameraFoundation.ts";

const source = readFileSync(
  new URL("./executiveCameraFoundation.ts", import.meta.url),
  "utf8",
);

function isFiniteVector(vector: { x: number; y: number; z: number }): boolean {
  return (
    Number.isFinite(vector.x) &&
    Number.isFinite(vector.y) &&
    Number.isFinite(vector.z)
  );
}

test("1. SP:1.1 identity and presentation-only role", () => {
  const identity = getExecutiveCameraFoundationIdentity();
  assert.equal(
    executiveCameraFoundationIdentity,
    "SP:1.1/ExecutiveCameraFoundation",
  );
  assert.equal(identity.id, "SP:1.1/ExecutiveCameraFoundation");
  assert.equal(executiveCameraFoundationVersion, "1.1.0");
  assert.equal(
    executiveCameraFoundationNamespace,
    "nexora.spatial-presentation.executive-camera",
  );
  assert.equal(
    executiveCameraFoundationArchitecturalRole,
    "PresentationOnlyExecutiveCameraResolution",
  );
  assert.equal(EXECUTIVE_CAMERA_FOUNDATION_BOUNDARY.ownsBusinessTruth, false);
  assert.equal(EXECUTIVE_CAMERA_FOUNDATION_BOUNDARY.ownsDataReality, false);
  assert.equal(EXECUTIVE_CAMERA_FOUNDATION_BOUNDARY.ownsKpiState, false);
  assert.equal(
    EXECUTIVE_CAMERA_FOUNDATION_BOUNDARY.introducesOrbitUi,
    false,
  );
  assert.equal(
    EXECUTIVE_CAMERA_FOUNDATION_BOUNDARY.introducesFocusChoreography,
    false,
  );
});

test("2. default camera intent resolves deterministically", () => {
  const a = resolveExecutiveCameraPresentation(
    DEFAULT_EXECUTIVE_OVERVIEW_CAMERA_INTENT,
    { framing: DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING },
  );
  const b = resolveExecutiveCameraPresentation(
    DEFAULT_EXECUTIVE_OVERVIEW_CAMERA_INTENT,
    { framing: DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING },
  );
  assert.deepEqual(a, b);
  assert.deepEqual(a, DEFAULT_EXECUTIVE_OVERVIEW_CAMERA_PRESENTATION);
  assert.equal(a.fov, 42);
  assert.ok(a.position.x > 0, "default azimuth should create lateral offset");
  assert.ok(a.position.y > a.target.y, "default elevation should be elevated");
});

test("3. distance is clamped to safe bounds", () => {
  assert.equal(
    clampExecutiveCameraDistance(0.1),
    EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS.minimumDistance,
  );
  assert.equal(
    clampExecutiveCameraDistance(100),
    EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS.maximumDistance,
  );
  const near = resolveExecutiveCameraPresentation({
    ...DEFAULT_EXECUTIVE_OVERVIEW_CAMERA_INTENT,
    distance: 0.25,
  });
  const far = resolveExecutiveCameraPresentation({
    ...DEFAULT_EXECUTIVE_OVERVIEW_CAMERA_INTENT,
    distance: 99,
  });
  const nearDist = Math.hypot(
    near.position.x - near.target.x,
    near.position.y - near.target.y,
    near.position.z - near.target.z,
  );
  const farDist = Math.hypot(
    far.position.x - far.target.x,
    far.position.y - far.target.y,
    far.position.z - far.target.z,
  );
  assert.ok(
    nearDist >= EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS.minimumDistance - 1e-6,
  );
  assert.ok(
    farDist <= EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS.maximumDistance + 1e-6,
  );
});

test("4. elevation is clamped to safe bounds", () => {
  assert.equal(
    clampExecutiveCameraElevation(-1),
    EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS.minimumElevation,
  );
  assert.equal(
    clampExecutiveCameraElevation(Math.PI / 2),
    EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS.maximumElevation,
  );
  const underside = resolveExecutiveCameraPresentation({
    ...DEFAULT_EXECUTIVE_OVERVIEW_CAMERA_INTENT,
    elevation: -0.8,
  });
  assert.ok(underside.position.y > underside.target.y);
  const topDown = resolveExecutiveCameraPresentation({
    ...DEFAULT_EXECUTIVE_OVERVIEW_CAMERA_INTENT,
    elevation: 1.5,
  });
  assert.ok(
    topDown.position.y - topDown.target.y <
      topDown.target.y +
        EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS.maximumDistance,
  );
});

test("5. valid azimuth produces valid camera position", () => {
  const presentation = resolveExecutiveCameraPresentation({
    target: EXECUTIVE_STAGE_CENTER_TARGET,
    distance: 9,
    azimuth: EXECUTIVE_CAMERA_AZIMUTH_CONSTRAINTS.defaultAzimuth,
    elevation: EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS.defaultElevation,
  });
  assert.ok(isFiniteVector(presentation.position));
  assert.ok(presentation.position.x !== 0);
  assert.ok(presentation.position.z > 0);
  assert.equal(
    normalizeExecutiveCameraAzimuth(Math.PI * 3),
    normalizeExecutiveCameraAzimuth(Math.PI),
  );
});

test("6. target changes correctly affect resolved presentation", () => {
  const stageCenter = resolveExecutiveCameraPresentation({
    ...DEFAULT_EXECUTIVE_OVERVIEW_CAMERA_INTENT,
    target: EXECUTIVE_STAGE_CENTER_TARGET,
  });
  const focusAnchor = resolveExecutiveCameraPresentation({
    ...DEFAULT_EXECUTIVE_FOCUS_CAMERA_INTENT,
    target: EXECUTIVE_FOCUS_ANCHOR_TARGET,
  });
  assert.deepEqual(stageCenter.target, EXECUTIVE_STAGE_CENTER_TARGET);
  assert.deepEqual(focusAnchor.target, EXECUTIVE_FOCUS_ANCHOR_TARGET);
  assert.notDeepEqual(stageCenter.position, focusAnchor.position);
  assert.ok(focusAnchor.target.y > stageCenter.target.y);
});

test("7. output contains finite numeric coordinates", () => {
  const presentation = resolveDefaultExecutiveCameraPresentation("overview");
  assert.ok(isFiniteVector(presentation.position));
  assert.ok(isFiniteVector(presentation.target));
  assert.ok(Number.isFinite(presentation.fov));
  assert.ok(Number.isFinite(presentation.near));
  assert.ok(Number.isFinite(presentation.far));
});

test("8. invalid/extreme values cannot generate unusable camera state", () => {
  const intent = {
    target: { x: Number.NaN, y: Number.POSITIVE_INFINITY, z: Number.NaN },
    distance: Number.NaN,
    azimuth: Number.POSITIVE_INFINITY,
    elevation: Number.NEGATIVE_INFINITY,
    fov: Number.NaN,
  } as ExecutiveCameraIntent;
  const presentation = resolveExecutiveCameraPresentation(intent);
  assert.ok(isFiniteVector(presentation.position));
  assert.ok(isFiniteVector(presentation.target));
  assert.ok(Number.isFinite(presentation.fov));
  assert.ok(presentation.far > presentation.near);
  assert.ok(presentation.position.y >= presentation.target.y);
});

test("9. repeated identical input produces identical resolved output", () => {
  const input: ExecutiveCameraIntent = {
    target: { x: 0.5, y: 0.2, z: -0.25 },
    distance: 8.25,
    azimuth: 0.4,
    elevation: 0.5,
    fov: 41,
  };
  const samples = Array.from({ length: 5 }, () =>
    resolveExecutiveCameraPresentation(input, {
      framing: DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING,
    }),
  );
  for (let index = 1; index < samples.length; index += 1) {
    assert.deepEqual(samples[index], samples[0]);
  }
});

test("10. resolver does not mutate its input", () => {
  const intent: ExecutiveCameraIntent = {
    target: { x: 1, y: 0.2, z: 1 },
    distance: 8,
    azimuth: 0.3,
    elevation: 0.45,
    fov: 42,
  };
  const before = JSON.stringify(intent);
  resolveExecutiveCameraPresentation(intent, {
    framing: { top: 0.1, right: 0.2, bottom: 0.1, left: 0.1 },
  });
  assert.equal(JSON.stringify(intent), before);
});

test("11. camera contracts remain presentation-only", () => {
  assert.equal(EXECUTIVE_CAMERA_FOUNDATION_BOUNDARY.ownsBusinessTruth, false);
  assert.equal(EXECUTIVE_CAMERA_FOUNDATION_BOUNDARY.ownsExecutiveSeverity, false);
  assert.equal(EXECUTIVE_CAMERA_FOUNDATION_BOUNDARY.ownsObjectImportance, false);
  assert.equal(EXECUTIVE_CAMERA_FOUNDATION_BOUNDARY.ownsRelationships, false);
  assert.equal(EXECUTIVE_CAMERA_FOUNDATION_BOUNDARY.ownsWorkspaceSemantics, false);
  assert.equal(EXECUTIVE_CAMERA_FOUNDATION_BOUNDARY.ownsAdvisorConclusions, false);
  assert.equal(EXECUTIVE_CAMERA_FOUNDATION_BOUNDARY.ownsAttentionTruth, false);
  assert.match(source, /presentation-only/i);
  assert.doesNotMatch(source, /OrbitControls/);
  assert.doesNotMatch(source, /from\s+["']three["']/);
  assert.doesNotMatch(source, /@react-three\/fiber/);
});

test("12. sanitize + tuple helpers stay stable", () => {
  const sanitized = sanitizeExecutiveCameraIntent(
    DEFAULT_EXECUTIVE_OVERVIEW_CAMERA_INTENT,
  );
  const presentation = resolveExecutiveCameraPresentation(sanitized);
  const tuple = toExecutiveCameraTuplePresentation(presentation);
  assert.equal(tuple.position.length, 3);
  assert.equal(tuple.target.length, 3);
  assert.equal(tuple.fov, presentation.fov);
  const verified = verifyExecutiveCameraFoundation();
  assert.equal(verified.ok, true);
  assert.equal(verifyExecutiveCameraFoundation({ forceFailure: true }).ok, false);
});
