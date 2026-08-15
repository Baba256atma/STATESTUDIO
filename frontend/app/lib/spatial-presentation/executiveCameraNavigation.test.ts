/**
 * SP:1.3 — Executive Camera Navigation policy tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS,
  EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS,
} from "./executiveCameraFoundation.ts";
import { EXECUTIVE_OVERVIEW_VIEWING_POLICY } from "./executiveViewingAngle.ts";
import {
  EXECUTIVE_CAMERA_NAVIGATION_AZIMUTH_LIMITS,
  EXECUTIVE_CAMERA_NAVIGATION_BOUNDARY,
  EXECUTIVE_CAMERA_NAVIGATION_STEPS,
  INITIAL_EXECUTIVE_CAMERA_NAVIGATION_STATE,
  applyExecutiveCameraNavigationAction,
  applyExecutiveCameraNavigationOffsets,
  executiveCameraNavigationIdentity,
  executiveCameraNavigationUpstreamCameraFoundationIdentity,
  executiveCameraNavigationUpstreamViewingAngleIdentity,
  executiveCameraNavigationVersion,
  getExecutiveCameraNavigationIdentity,
  getExecutiveCameraNavigationLimitState,
  isExecutiveCameraNavigationAtDefault,
  resolveExecutiveCameraNavigationBaseIntent,
  resolveNavigatedExecutiveCameraPresentation,
  verifyExecutiveCameraNavigation,
  type ExecutiveCameraNavigationState,
} from "./executiveCameraNavigation.ts";

const source = readFileSync(
  new URL("./executiveCameraNavigation.ts", import.meta.url),
  "utf8",
);

function baseIntent() {
  return resolveExecutiveCameraNavigationBaseIntent({
    mode: "overview",
    target: EXECUTIVE_OVERVIEW_VIEWING_POLICY.target,
  });
}

test("1. SP:1.3 identity depends on SP:1.1 and SP:1.2", () => {
  const identity = getExecutiveCameraNavigationIdentity();
  assert.equal(
    executiveCameraNavigationIdentity,
    "SP:1.3/ExecutiveCameraNavigation",
  );
  assert.equal(executiveCameraNavigationVersion, "1.3.0");
  assert.equal(
    executiveCameraNavigationUpstreamCameraFoundationIdentity,
    "SP:1.1/ExecutiveCameraFoundation",
  );
  assert.equal(
    executiveCameraNavigationUpstreamViewingAngleIdentity,
    "SP:1.2/ExecutiveViewingAngle",
  );
  assert.equal(
    identity.upstreamCameraFoundation,
    "SP:1.1/ExecutiveCameraFoundation",
  );
  assert.equal(identity.upstreamViewingAngle, "SP:1.2/ExecutiveViewingAngle");
});

test("2. orbit-left reduces azimuth offset", () => {
  const base = baseIntent();
  const next = applyExecutiveCameraNavigationAction(
    INITIAL_EXECUTIVE_CAMERA_NAVIGATION_STATE,
    "orbit-left",
    base,
  );
  assert.ok(next.azimuthOffset < 0);
  assert.ok(
    Math.abs(
      next.azimuthOffset + EXECUTIVE_CAMERA_NAVIGATION_STEPS.azimuthStep,
    ) < 1e-5,
  );
});

test("3. orbit-right increases azimuth offset", () => {
  const base = baseIntent();
  const next = applyExecutiveCameraNavigationAction(
    INITIAL_EXECUTIVE_CAMERA_NAVIGATION_STATE,
    "orbit-right",
    base,
  );
  assert.ok(next.azimuthOffset > 0);
  assert.ok(
    Math.abs(
      next.azimuthOffset - EXECUTIVE_CAMERA_NAVIGATION_STEPS.azimuthStep,
    ) < 1e-5,
  );
});

test("4. tilt-up increases elevation", () => {
  const base = baseIntent();
  const next = applyExecutiveCameraNavigationAction(
    INITIAL_EXECUTIVE_CAMERA_NAVIGATION_STATE,
    "tilt-up",
    base,
  );
  const intent = applyExecutiveCameraNavigationOffsets(base, next);
  assert.ok(intent.elevation > base.elevation);
});

test("5. tilt-down decreases elevation", () => {
  const base = baseIntent();
  const next = applyExecutiveCameraNavigationAction(
    INITIAL_EXECUTIVE_CAMERA_NAVIGATION_STATE,
    "tilt-down",
    base,
  );
  const intent = applyExecutiveCameraNavigationOffsets(base, next);
  assert.ok(intent.elevation < base.elevation);
});

test("6. zoom-in decreases distance", () => {
  const base = baseIntent();
  const next = applyExecutiveCameraNavigationAction(
    INITIAL_EXECUTIVE_CAMERA_NAVIGATION_STATE,
    "zoom-in",
    base,
  );
  const intent = applyExecutiveCameraNavigationOffsets(base, next);
  assert.ok(intent.distance < base.distance);
});

test("7. zoom-out increases distance", () => {
  const base = baseIntent();
  const next = applyExecutiveCameraNavigationAction(
    INITIAL_EXECUTIVE_CAMERA_NAVIGATION_STATE,
    "zoom-out",
    base,
  );
  const intent = applyExecutiveCameraNavigationOffsets(base, next);
  assert.ok(intent.distance > base.distance);
});

test("8. reset restores canonical SP:1.2 values", () => {
  const base = baseIntent();
  let state = INITIAL_EXECUTIVE_CAMERA_NAVIGATION_STATE;
  state = applyExecutiveCameraNavigationAction(state, "orbit-right", base);
  state = applyExecutiveCameraNavigationAction(state, "tilt-up", base);
  state = applyExecutiveCameraNavigationAction(state, "zoom-out", base);
  const reset = applyExecutiveCameraNavigationAction(state, "reset", base);
  assert.equal(isExecutiveCameraNavigationAtDefault(reset), true);
  const presentation = resolveNavigatedExecutiveCameraPresentation({
    mode: "overview",
    target: EXECUTIVE_OVERVIEW_VIEWING_POLICY.target,
    navigation: reset,
  });
  assert.deepEqual(presentation.target, EXECUTIVE_OVERVIEW_VIEWING_POLICY.target);
  assert.equal(presentation.fov, EXECUTIVE_OVERVIEW_VIEWING_POLICY.fov);
});

test("9. azimuth never exceeds approved bounds", () => {
  const base = baseIntent();
  let state = INITIAL_EXECUTIVE_CAMERA_NAVIGATION_STATE;
  for (let index = 0; index < 20; index += 1) {
    state = applyExecutiveCameraNavigationAction(state, "orbit-right", base);
  }
  assert.ok(
    state.azimuthOffset <=
      EXECUTIVE_CAMERA_NAVIGATION_AZIMUTH_LIMITS.maximumAzimuthOffset + 1e-9,
  );
  for (let index = 0; index < 40; index += 1) {
    state = applyExecutiveCameraNavigationAction(state, "orbit-left", base);
  }
  assert.ok(
    state.azimuthOffset >=
      EXECUTIVE_CAMERA_NAVIGATION_AZIMUTH_LIMITS.minimumAzimuthOffset - 1e-9,
  );
});

test("10. elevation never exceeds approved bounds", () => {
  const base = baseIntent();
  let state = INITIAL_EXECUTIVE_CAMERA_NAVIGATION_STATE;
  for (let index = 0; index < 20; index += 1) {
    state = applyExecutiveCameraNavigationAction(state, "tilt-up", base);
  }
  let intent = applyExecutiveCameraNavigationOffsets(base, state);
  assert.ok(
    intent.elevation <=
      EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS.maximumElevation + 1e-5,
  );
  for (let index = 0; index < 40; index += 1) {
    state = applyExecutiveCameraNavigationAction(state, "tilt-down", base);
  }
  intent = applyExecutiveCameraNavigationOffsets(base, state);
  assert.ok(
    intent.elevation >=
      EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS.minimumElevation - 1e-5,
  );
});

test("11. distance never exceeds approved bounds", () => {
  const base = baseIntent();
  let state = INITIAL_EXECUTIVE_CAMERA_NAVIGATION_STATE;
  for (let index = 0; index < 20; index += 1) {
    state = applyExecutiveCameraNavigationAction(state, "zoom-out", base);
  }
  let intent = applyExecutiveCameraNavigationOffsets(base, state);
  assert.ok(
    intent.distance <=
      EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS.maximumDistance + 1e-9,
  );
  for (let index = 0; index < 40; index += 1) {
    state = applyExecutiveCameraNavigationAction(state, "zoom-in", base);
  }
  intent = applyExecutiveCameraNavigationOffsets(base, state);
  assert.ok(
    intent.distance >=
      EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS.minimumDistance - 1e-9,
  );
});

test("12. repeated actions remain deterministic", () => {
  const base = baseIntent();
  const run = () => {
    let state = INITIAL_EXECUTIVE_CAMERA_NAVIGATION_STATE;
    state = applyExecutiveCameraNavigationAction(state, "orbit-left", base);
    state = applyExecutiveCameraNavigationAction(state, "tilt-up", base);
    state = applyExecutiveCameraNavigationAction(state, "zoom-in", base);
    return resolveNavigatedExecutiveCameraPresentation({
      mode: "overview",
      target: EXECUTIVE_OVERVIEW_VIEWING_POLICY.target,
      navigation: state,
    });
  };
  assert.deepEqual(run(), run());
});

test("13. navigation does not mutate input state", () => {
  const base = baseIntent();
  const state: ExecutiveCameraNavigationState = {
    azimuthOffset: 0.1,
    elevationOffset: 0.05,
    distanceOffset: -0.2,
  };
  const beforeState = JSON.stringify(state);
  const beforeBase = JSON.stringify(base);
  applyExecutiveCameraNavigationAction(state, "orbit-right", base);
  applyExecutiveCameraNavigationOffsets(base, state);
  assert.equal(JSON.stringify(state), beforeState);
  assert.equal(JSON.stringify(base), beforeBase);
});

test("14. current camera target is preserved", () => {
  const target = { x: 1.2, y: 0.4, z: -0.8 };
  const base = resolveExecutiveCameraNavigationBaseIntent({
    mode: "focus",
    target,
  });
  const navigated = applyExecutiveCameraNavigationOffsets(
    base,
    applyExecutiveCameraNavigationAction(
      INITIAL_EXECUTIVE_CAMERA_NAVIGATION_STATE,
      "orbit-right",
      base,
    ),
  );
  assert.deepEqual(navigated.target, target);
});

test("15. navigation result remains finite", () => {
  const presentation = resolveNavigatedExecutiveCameraPresentation({
    mode: "overview",
    target: EXECUTIVE_OVERVIEW_VIEWING_POLICY.target,
    navigation: {
      azimuthOffset: 0.2,
      elevationOffset: 0.1,
      distanceOffset: -0.5,
    },
  });
  assert.ok(Number.isFinite(presentation.position.x));
  assert.ok(Number.isFinite(presentation.position.y));
  assert.ok(Number.isFinite(presentation.position.z));
  assert.ok(Number.isFinite(presentation.target.x));
  assert.ok(Number.isFinite(presentation.fov));
});

test("16. business/executive state is not required for navigation", () => {
  assert.equal(EXECUTIVE_CAMERA_NAVIGATION_BOUNDARY.ownsBusinessTruth, false);
  assert.equal(EXECUTIVE_CAMERA_NAVIGATION_BOUNDARY.ownsSelection, false);
  assert.equal(EXECUTIVE_CAMERA_NAVIGATION_BOUNDARY.ownsFocus, false);
  assert.equal(EXECUTIVE_CAMERA_NAVIGATION_BOUNDARY.ownsDataReality, false);
  assert.doesNotMatch(source, /executiveVisualState|kpiResult|severityScore/);
  assert.equal(
    EXECUTIVE_CAMERA_NAVIGATION_BOUNDARY.introducesUnrestrictedOrbitControls,
    false,
  );
  assert.doesNotMatch(source, /from\s+["']@?react-three\/drei["']/);
  assert.doesNotMatch(source, /from\s+["']three["']/);
  assert.doesNotMatch(source, /@react-three\/fiber/);
  const limits = getExecutiveCameraNavigationLimitState(
    INITIAL_EXECUTIVE_CAMERA_NAVIGATION_STATE,
    baseIntent(),
  );
  assert.equal(limits.canReset, false);
  assert.equal(limits.canOrbitLeft, true);
  assert.equal(verifyExecutiveCameraNavigation().ok, true);
});
