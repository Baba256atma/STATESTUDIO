/**
 * SP:1.7 — Executive Framing Visual Calibration tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING,
  EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS,
  resolveExecutiveCameraPresentation,
  sanitizeExecutiveCameraIntent,
} from "./executiveCameraFoundation.ts";
import {
  EXECUTIVE_DENSITY_FOCUS_DISTANCE,
  EXECUTIVE_DENSITY_OVERVIEW_DISTANCE,
  resolveDensityAwareCameraDistance,
  resolveExecutiveDensityAwareFraming,
  resolveExecutiveStageDensityProfile,
} from "./executiveDensityAwareFraming.ts";
import {
  EXECUTIVE_CALIBRATED_FOCUS_DISTANCE,
  EXECUTIVE_CALIBRATED_OVERVIEW_DISTANCE,
  EXECUTIVE_CALIBRATED_OVERVIEW_TARGET,
  EXECUTIVE_FRAMING_PRE_CALIBRATION_FOCUS_DISTANCE,
  EXECUTIVE_FRAMING_PRE_CALIBRATION_OVERVIEW_DISTANCE,
  EXECUTIVE_FRAMING_VISUAL_CALIBRATION_BOUNDARY,
  EXECUTIVE_SAFE_FRAMING_MARGINS,
  EXECUTIVE_WORKSPACE_DIAL_EXCLUSION,
  createExecutiveBoundaryCompositionBounds,
  executiveFramingVisualCalibrationIdentity,
  expandExecutiveOccupiedBoundsWithExtents,
  getExecutiveFramingVisualCalibrationIdentity,
  isObsoleteTooCloseOverviewDistance,
  resolveExecutiveCalibratedOverviewDistance,
  validateExecutiveFramingFit,
  verifyExecutiveFramingVisualCalibration,
} from "./executiveFramingVisualCalibration.ts";
import {
  applyExecutiveCameraNavigationAction,
  applyExecutiveCameraNavigationOffsets,
  resolveExecutiveCameraNavigationBaseIntent,
} from "./executiveCameraNavigation.ts";
import {
  EXECUTIVE_FOCUS_VIEWING_POLICY,
  EXECUTIVE_OVERVIEW_VIEWING_POLICY,
} from "./executiveViewingAngle.ts";
import { EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS } from "./executiveSpatialComposition.ts";

const source = readFileSync(
  new URL("./executiveFramingVisualCalibration.ts", import.meta.url),
  "utf8",
);

const MVP_BOUNDS = createExecutiveBoundaryCompositionBounds({
  leftEdgeX: -2.35,
  rightEdgeX: 2.3,
  lowerZ: -1.55,
  upperZ: 1.4,
});

function overviewIntent(distance: number) {
  return sanitizeExecutiveCameraIntent(
    Object.freeze({
      target: EXECUTIVE_CALIBRATED_OVERVIEW_TARGET,
      distance,
      azimuth: EXECUTIVE_OVERVIEW_VIEWING_POLICY.azimuth,
      elevation: EXECUTIVE_OVERVIEW_VIEWING_POLICY.elevation,
      fov: EXECUTIVE_OVERVIEW_VIEWING_POLICY.fov,
    }),
  );
}

test("1. SP:1.7 identity and presentation-only boundary", () => {
  const identity = getExecutiveFramingVisualCalibrationIdentity();
  assert.equal(identity.id, executiveFramingVisualCalibrationIdentity);
  assert.equal(identity.version, "1.7.0");
  assert.equal(
    identity.upstreamDensityFraming,
    "SP:1.6/ExecutiveDensityAwareFraming",
  );
  assert.equal(EXECUTIVE_FRAMING_VISUAL_CALIBRATION_BOUNDARY.objectSpecificHacks, false);
  assert.equal(verifyExecutiveFramingVisualCalibration().ok, true);
  assert.doesNotMatch(source, /objectId\s*===\s*["']obj-risk["']/);
  assert.doesNotMatch(source, /objectId\s*===\s*["']obj-budget["']/);
});

test("2. calibrated overview distances replace obsolete too-close family", () => {
  assert.equal(
    EXECUTIVE_CALIBRATED_OVERVIEW_DISTANCE.sparse,
    EXECUTIVE_DENSITY_OVERVIEW_DISTANCE.sparse,
  );
  assert.equal(
    EXECUTIVE_CALIBRATED_OVERVIEW_DISTANCE.balanced,
    EXECUTIVE_DENSITY_OVERVIEW_DISTANCE.balanced,
  );
  assert.equal(
    EXECUTIVE_CALIBRATED_OVERVIEW_DISTANCE.dense,
    EXECUTIVE_DENSITY_OVERVIEW_DISTANCE.dense,
  );
  assert.equal(
    EXECUTIVE_CALIBRATED_OVERVIEW_DISTANCE["high-density"],
    EXECUTIVE_DENSITY_OVERVIEW_DISTANCE["high-density"],
  );
  assert.ok(
    EXECUTIVE_CALIBRATED_OVERVIEW_DISTANCE.balanced >
      EXECUTIVE_FRAMING_PRE_CALIBRATION_OVERVIEW_DISTANCE.balanced + 0.75,
  );
  assert.equal(isObsoleteTooCloseOverviewDistance(8.85), true);
  assert.equal(
    isObsoleteTooCloseOverviewDistance(
      EXECUTIVE_CALIBRATED_OVERVIEW_DISTANCE.balanced,
    ),
    false,
  );
});

test("3. calibrated distances stay within SP:1.1 bounds and progress gently", () => {
  const family = [
    EXECUTIVE_CALIBRATED_OVERVIEW_DISTANCE.sparse,
    EXECUTIVE_CALIBRATED_OVERVIEW_DISTANCE.balanced,
    EXECUTIVE_CALIBRATED_OVERVIEW_DISTANCE.dense,
    EXECUTIVE_CALIBRATED_OVERVIEW_DISTANCE["high-density"],
  ];
  for (let index = 0; index < family.length; index += 1) {
    const distance = family[index]!;
    assert.ok(distance >= EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS.minimumDistance);
    assert.ok(distance <= EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS.maximumDistance);
    if (index > 0) {
      assert.ok(distance >= family[index - 1]!);
      assert.ok(distance - family[index - 1]! < 1.5);
    }
  }
});

test("4. balanced overview no longer resolves to obsolete 8.85 framing", () => {
  const framing = resolveExecutiveDensityAwareFraming({
    mode: "overview",
    visibleObjectCount: 8,
    visibleContextCount: 0,
    focusedObjectId: null,
    relatedVisibleCount: 0,
    spatialBounds: MVP_BOUNDS,
  });
  assert.equal(framing.profile, "balanced");
  assert.ok(framing.cameraDistance >= 10.2);
  assert.ok(
    framing.cameraDistance >
      EXECUTIVE_FRAMING_PRE_CALIBRATION_OVERVIEW_DISTANCE.balanced + 0.75,
  );
  assert.deepEqual(framing.cameraTarget, EXECUTIVE_CALIBRATED_OVERVIEW_TARGET);
});

test("5. focus distance family is calibrated independently", () => {
  assert.equal(
    EXECUTIVE_DENSITY_FOCUS_DISTANCE.focusOnly,
    EXECUTIVE_CALIBRATED_FOCUS_DISTANCE.focusOnly,
  );
  assert.equal(
    EXECUTIVE_DENSITY_FOCUS_DISTANCE.smallCluster,
    EXECUTIVE_CALIBRATED_FOCUS_DISTANCE.smallCluster,
  );
  assert.ok(
    EXECUTIVE_CALIBRATED_FOCUS_DISTANCE.smallCluster >
      EXECUTIVE_FRAMING_PRE_CALIBRATION_FOCUS_DISTANCE.smallCluster - 1e-9,
  );
  assert.equal(
    EXECUTIVE_FOCUS_VIEWING_POLICY.distance,
    EXECUTIVE_CALIBRATED_FOCUS_DISTANCE.smallCluster,
  );
});

test("6. safe margins are asymmetric for Dial / Advisor pressure", () => {
  assert.ok(EXECUTIVE_SAFE_FRAMING_MARGINS.right > EXECUTIVE_SAFE_FRAMING_MARGINS.left);
  assert.ok(
    EXECUTIVE_SAFE_FRAMING_MARGINS.bottom > EXECUTIVE_SAFE_FRAMING_MARGINS.top,
  );
  assert.ok(DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING.right > DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING.left);
  assert.ok(
    DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING.bottom >
      DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING.top,
  );
  assert.ok(EXECUTIVE_WORKSPACE_DIAL_EXCLUSION.minNdcX > 0.35);
  assert.ok(EXECUTIVE_WORKSPACE_DIAL_EXCLUSION.maxNdcY < -0.25);
});

test("7. occupied bounds expansion uses extents not centers only", () => {
  const raw = Object.freeze({
    minX: 2.0,
    maxX: 2.0,
    minY: 0,
    maxY: 0,
    minZ: 1.2,
    maxZ: 1.2,
  });
  const expanded = expandExecutiveOccupiedBoundsWithExtents(raw);
  assert.ok(expanded.minX < raw.minX);
  assert.ok(expanded.maxX > raw.maxX);
  assert.ok(expanded.maxZ > raw.maxZ);
});

test("8. RISK REGRESSION — bottom-right boundary object clears Dial zone", () => {
  // Generic bottom-right composition edge — no objectId branching.
  const bottomRightBounds = createExecutiveBoundaryCompositionBounds({
    leftEdgeX: -2.2,
    rightEdgeX: 2.35,
    lowerZ: -1.4,
    upperZ: 1.45,
  });

  const obsolete = validateExecutiveFramingFit({
    cameraIntent: overviewIntent(
      EXECUTIVE_FRAMING_PRE_CALIBRATION_OVERVIEW_DISTANCE.balanced,
    ),
    occupiedBounds: bottomRightBounds,
    viewport: Object.freeze({ width: 1280, height: 820, usableWidthRatio: 1 }),
  });
  assert.equal(obsolete.fits, false);

  const calibrated = validateExecutiveFramingFit({
    cameraIntent: overviewIntent(EXECUTIVE_CALIBRATED_OVERVIEW_DISTANCE.balanced),
    occupiedBounds: bottomRightBounds,
    viewport: Object.freeze({ width: 1280, height: 820, usableWidthRatio: 1 }),
  });
  assert.equal(calibrated.uiOcclusion, false);
  assert.equal(calibrated.violatedEdges.includes("dial"), false);
  assert.equal(calibrated.geometricClipping, false);
  assert.equal(calibrated.fits, true);
});

test("9. EXECUTION REGRESSION — left-edge object has safe left clearance", () => {
  // Generic left-boundary composition — no objectId branching.
  const leftEdgeBounds = createExecutiveBoundaryCompositionBounds({
    leftEdgeX: -2.55,
    rightEdgeX: 2.0,
    lowerZ: -1.3,
    upperZ: 1.2,
  });

  const calibrated = validateExecutiveFramingFit({
    cameraIntent: overviewIntent(EXECUTIVE_CALIBRATED_OVERVIEW_DISTANCE.balanced),
    occupiedBounds: leftEdgeBounds,
  });
  assert.equal(calibrated.violatedEdges.includes("left"), false);
  assert.equal(calibrated.fits, true);

  // Calibrated distance must remain materially farther than the obsolete family.
  assert.ok(
    EXECUTIVE_CALIBRATED_OVERVIEW_DISTANCE.balanced >
      EXECUTIVE_FRAMING_PRE_CALIBRATION_OVERVIEW_DISTANCE.balanced + 0.75,
  );
});

test("10. edge extremes (left/right/top/bottom) fit calibrated overview", () => {
  // Validate real edge envelopes separately. A single full AABB invents a
  // synthetic bottom-right corner that no composed object occupies after
  // SP:2.8A Dial-safe composition.
  const edgeEnvelopes = [
    createExecutiveBoundaryCompositionBounds({
      leftEdgeX: EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.minX,
      rightEdgeX: 0.4,
      lowerZ: -0.4,
      upperZ: 0.4,
    }),
    createExecutiveBoundaryCompositionBounds({
      leftEdgeX: 1.5,
      rightEdgeX: EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.maxX,
      lowerZ: EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.minZ,
      upperZ: -0.8,
    }),
    createExecutiveBoundaryCompositionBounds({
      leftEdgeX: -0.4,
      rightEdgeX: 0.4,
      lowerZ: EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.minZ,
      upperZ: -0.2,
    }),
    createExecutiveBoundaryCompositionBounds({
      leftEdgeX: -1.9,
      rightEdgeX: 1.15,
      lowerZ: 0.4,
      upperZ: EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS.maxZ,
    }),
  ] as const;

  for (const occupiedBounds of edgeEnvelopes) {
    const fit = validateExecutiveFramingFit({
      cameraIntent: overviewIntent(EXECUTIVE_CALIBRATED_OVERVIEW_DISTANCE.balanced),
      occupiedBounds,
    });
    assert.equal(fit.fits, true);
    assert.equal(fit.geometricClipping, false);
    assert.equal(fit.uiOcclusion, false);
  }
});

test("11. narrow usable viewport increases required framing distance", () => {
  const wide = resolveDensityAwareCameraDistance({
    mode: "overview",
    visibleObjectCount: 8,
    visibleContextCount: 0,
    focusedObjectId: null,
    relatedVisibleCount: 0,
    spatialBounds: MVP_BOUNDS,
    viewport: Object.freeze({ width: 1400, height: 900, usableWidthRatio: 1 }),
  });
  const narrow = resolveDensityAwareCameraDistance({
    mode: "overview",
    visibleObjectCount: 8,
    visibleContextCount: 0,
    focusedObjectId: null,
    relatedVisibleCount: 0,
    spatialBounds: MVP_BOUNDS,
    viewport: Object.freeze({
      width: 900,
      height: 900,
      usableWidthRatio: 0.55,
    }),
  });
  assert.ok(narrow >= wide);
});

test("12. calibrated fit resolver pulls back when bounds demand it", () => {
  const distance = resolveExecutiveCalibratedOverviewDistance({
    profile: "dense",
    baseDistance: EXECUTIVE_CALIBRATED_OVERVIEW_DISTANCE.dense,
    cameraIntentBase: Object.freeze({
      target: EXECUTIVE_CALIBRATED_OVERVIEW_TARGET,
      azimuth: EXECUTIVE_OVERVIEW_VIEWING_POLICY.azimuth,
      elevation: EXECUTIVE_OVERVIEW_VIEWING_POLICY.elevation,
      fov: EXECUTIVE_OVERVIEW_VIEWING_POLICY.fov,
    }),
    occupiedBounds: createExecutiveBoundaryCompositionBounds({}),
    viewport: Object.freeze({
      width: 960,
      height: 900,
      usableWidthRatio: 0.5,
    }),
  });
  assert.ok(distance >= EXECUTIVE_CALIBRATED_OVERVIEW_DISTANCE.dense);
  assert.ok(distance <= EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS.maximumDistance);
});

test("13. focus cluster remains closer than calibrated overview", () => {
  const focus = resolveExecutiveDensityAwareFraming({
    mode: "focus",
    visibleObjectCount: 8,
    visibleContextCount: 0,
    focusedObjectId: "obj-a",
    relatedVisibleCount: 3,
  });
  const overview = resolveExecutiveDensityAwareFraming({
    mode: "overview",
    visibleObjectCount: 8,
    visibleContextCount: 0,
    focusedObjectId: null,
    relatedVisibleCount: 0,
    spatialBounds: MVP_BOUNDS,
  });
  assert.ok(focus.cameraDistance < overview.cameraDistance);
  assert.ok(
    Math.abs(
      focus.cameraDistance - EXECUTIVE_CALIBRATED_FOCUS_DISTANCE.smallCluster,
    ) < 0.35,
  );
});

test("14. focus exit restores calibrated overview (not obsolete 8.85)", () => {
  const overview = resolveExecutiveDensityAwareFraming({
    mode: "overview",
    visibleObjectCount: 8,
    visibleContextCount: 0,
    focusedObjectId: null,
    relatedVisibleCount: 0,
    spatialBounds: MVP_BOUNDS,
  });
  assert.equal(overview.mode, "overview");
  assert.ok(
    overview.cameraDistance >
      EXECUTIVE_FRAMING_PRE_CALIBRATION_OVERVIEW_DISTANCE.balanced + 0.75,
  );
});

test("15. Reset restores calibrated density base distance", () => {
  const base = resolveExecutiveCameraNavigationBaseIntent({
    mode: "overview",
    target: EXECUTIVE_CALIBRATED_OVERVIEW_TARGET,
    distance: EXECUTIVE_CALIBRATED_OVERVIEW_DISTANCE.balanced,
    fov: EXECUTIVE_OVERVIEW_VIEWING_POLICY.fov,
  });
  const zoomed = applyExecutiveCameraNavigationAction(
    { azimuthOffset: 8, elevationOffset: 0, distanceOffset: -1.4 },
    "reset",
    base,
  );
  const restored = applyExecutiveCameraNavigationOffsets(base, zoomed);
  assert.equal(zoomed.distanceOffset, 0);
  assert.equal(
    restored.distance,
    EXECUTIVE_CALIBRATED_OVERVIEW_DISTANCE.balanced,
  );
});

test("16. navigation offsets survive calibrated density base change", () => {
  const baseA = resolveExecutiveCameraNavigationBaseIntent({
    mode: "overview",
    target: EXECUTIVE_CALIBRATED_OVERVIEW_TARGET,
    distance: EXECUTIVE_CALIBRATED_OVERVIEW_DISTANCE.balanced,
  });
  const orbit = applyExecutiveCameraNavigationAction(
    { azimuthOffset: 0, elevationOffset: 0, distanceOffset: 0 },
    "orbit-left",
    baseA,
  );
  const denser = resolveExecutiveCameraNavigationBaseIntent({
    mode: "overview",
    target: EXECUTIVE_CALIBRATED_OVERVIEW_TARGET,
    distance: EXECUTIVE_CALIBRATED_OVERVIEW_DISTANCE.dense,
  });
  const intent = applyExecutiveCameraNavigationOffsets(denser, orbit);
  assert.ok(
    Math.abs(intent.azimuth - denser.azimuth - orbit.azimuthOffset) < 1e-9,
  );
  assert.equal(intent.distance, denser.distance + orbit.distanceOffset);
});

test("17. deterministic calibrated framing", () => {
  const a = resolveExecutiveDensityAwareFraming({
    mode: "overview",
    visibleObjectCount: 8,
    visibleContextCount: 0,
    focusedObjectId: null,
    relatedVisibleCount: 0,
    spatialBounds: MVP_BOUNDS,
  });
  const b = resolveExecutiveDensityAwareFraming({
    mode: "overview",
    visibleObjectCount: 8,
    visibleContextCount: 0,
    focusedObjectId: null,
    relatedVisibleCount: 0,
    spatialBounds: MVP_BOUNDS,
  });
  assert.deepEqual(a, b);
  assert.equal(
    resolveExecutiveStageDensityProfile({
      mode: "overview",
      visibleObjectCount: 8,
      visibleContextCount: 0,
      focusedObjectId: null,
      relatedVisibleCount: 0,
      spatialBounds: MVP_BOUNDS,
    }),
    "balanced",
  );
});

test("18. presentation resolve remains finite with calibrated padding", () => {
  const presentation = resolveExecutiveCameraPresentation(
    overviewIntent(EXECUTIVE_CALIBRATED_OVERVIEW_DISTANCE.balanced),
    { framing: DEFAULT_EXECUTIVE_CAMERA_FRAMING_PADDING },
  );
  assert.ok(Number.isFinite(presentation.position.x));
  assert.ok(Number.isFinite(presentation.position.y));
  assert.ok(Number.isFinite(presentation.position.z));
  const resolvedDistance = Math.hypot(
    presentation.position.x - presentation.target.x,
    presentation.position.y - presentation.target.y,
    presentation.position.z - presentation.target.z,
  );
  assert.ok(
    resolvedDistance <= EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS.maximumDistance + 1e-6,
  );
});
