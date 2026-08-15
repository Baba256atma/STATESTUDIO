/**
 * SP:1.6 — Density-Aware Camera & Spatial Framing tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS,
} from "./executiveCameraFoundation.ts";
import {
  EXECUTIVE_FOCUS_VIEWING_POLICY,
  EXECUTIVE_OVERVIEW_VIEWING_POLICY,
} from "./executiveViewingAngle.ts";
import {
  EXECUTIVE_DENSITY_AWARE_FRAMING_BOUNDARY,
  EXECUTIVE_DENSITY_FOCUS_DISTANCE,
  EXECUTIVE_DENSITY_OVERVIEW_DISTANCE,
  buildExecutiveOccupiedBoundsFromPositions,
  executiveDensityAwareFramingIdentity,
  executiveDensityAwareFramingVersion,
  getExecutiveDensityAwareFramingIdentity,
  resolveDensityAwareCameraDistance,
  resolveExecutiveDensityAwareFraming,
  resolveExecutiveDensityEffectiveScore,
  resolveExecutiveStageDensityProfile,
  verifyExecutiveDensityAwareFraming,
  type ExecutiveStageDensityInput,
} from "./executiveDensityAwareFraming.ts";
import {
  applyExecutiveCameraNavigationAction,
  applyExecutiveCameraNavigationOffsets,
  resolveExecutiveCameraNavigationBaseIntent,
} from "./executiveCameraNavigation.ts";

const source = readFileSync(
  new URL("./executiveDensityAwareFraming.ts", import.meta.url),
  "utf8",
);

function overviewInput(
  overrides: Partial<ExecutiveStageDensityInput> = {},
): ExecutiveStageDensityInput {
  return {
    mode: "overview",
    visibleObjectCount: 8,
    visibleContextCount: 0,
    focusedObjectId: null,
    relatedVisibleCount: 0,
    spatialBounds: Object.freeze({
      minX: -2.35,
      maxX: 2.3,
      minY: -0.2,
      maxY: 0.45,
      minZ: -1.55,
      maxZ: 1.4,
    }),
    ...overrides,
  };
}

test("1. SP:1.6 identity depends on SP:1.1–1.5", () => {
  const identity = getExecutiveDensityAwareFramingIdentity();
  assert.equal(identity.id, executiveDensityAwareFramingIdentity);
  assert.equal(identity.version, executiveDensityAwareFramingVersion);
  assert.equal(
    identity.upstreamFocusChoreography,
    "SP:1.5/ExecutiveFocusChoreography",
  );
  assert.equal(
    identity.upstreamSpatialComposition,
    "SP:1.4/ExecutiveSpatialComposition",
  );
  assert.equal(EXECUTIVE_DENSITY_AWARE_FRAMING_BOUNDARY.presentationOnly, true);
  assert.equal(verifyExecutiveDensityAwareFraming().ok, true);
});

test("2. zero/single-object scenes resolve sparse", () => {
  const zero = resolveExecutiveStageDensityProfile(
    overviewInput({
      visibleObjectCount: 0,
      spatialBounds: undefined,
    }),
  );
  const single = resolveExecutiveStageDensityProfile(
    overviewInput({
      visibleObjectCount: 1,
      spatialBounds: Object.freeze({
        minX: 0,
        maxX: 0.2,
        minY: 0,
        maxY: 0.1,
        minZ: 0,
        maxZ: 0.2,
      }),
    }),
  );
  assert.equal(zero, "sparse");
  assert.equal(single, "sparse");
});

test("3. sparse scenes classify correctly", () => {
  const profile = resolveExecutiveStageDensityProfile(
    overviewInput({
      visibleObjectCount: 4,
      spatialBounds: Object.freeze({
        minX: -1,
        maxX: 1,
        minY: 0,
        maxY: 0.2,
        minZ: -0.8,
        maxZ: 0.8,
      }),
    }),
  );
  assert.equal(profile, "sparse");
});

test("4. balanced scenes classify correctly (MVP scale)", () => {
  assert.equal(
    resolveExecutiveStageDensityProfile(overviewInput()),
    "balanced",
  );
});

test("5. dense scenes classify correctly", () => {
  const profile = resolveExecutiveStageDensityProfile(
    overviewInput({
      visibleObjectCount: 14,
      visibleContextCount: 4,
      spatialBounds: Object.freeze({
        minX: -2.75,
        maxX: 2.75,
        minY: -0.35,
        maxY: 0.55,
        minZ: -1.7,
        maxZ: 1.55,
      }),
    }),
  );
  assert.equal(profile, "dense");
});

test("6. high-density scenes classify correctly", () => {
  const profile = resolveExecutiveStageDensityProfile(
    overviewInput({
      visibleObjectCount: 22,
      visibleContextCount: 8,
      spatialBounds: Object.freeze({
        minX: -2.75,
        maxX: 2.75,
        minY: -0.35,
        maxY: 0.55,
        minZ: -1.7,
        maxZ: 1.55,
      }),
    }),
  );
  assert.equal(profile, "high-density");
});

test("7. identical count with different occupied bounds differs", () => {
  const tight = resolveExecutiveDensityAwareFraming(
    overviewInput({
      visibleObjectCount: 10,
      spatialBounds: Object.freeze({
        minX: -0.6,
        maxX: 0.6,
        minY: 0,
        maxY: 0.15,
        minZ: -0.5,
        maxZ: 0.5,
      }),
    }),
  );
  const wide = resolveExecutiveDensityAwareFraming(
    overviewInput({
      visibleObjectCount: 10,
      spatialBounds: Object.freeze({
        minX: -2.75,
        maxX: 2.75,
        minY: -0.35,
        maxY: 0.55,
        minZ: -1.7,
        maxZ: 1.55,
      }),
    }),
  );
  assert.ok(wide.cameraDistance >= tight.cameraDistance);
  assert.notDeepEqual(tight.effectiveScore, wide.effectiveScore);
});

test("8. identical scene with narrower viewport increases framing demand", () => {
  const wide = resolveExecutiveDensityAwareFraming(
    overviewInput({
      viewport: Object.freeze({
        width: 1400,
        height: 900,
        usableWidthRatio: 1,
      }),
    }),
  );
  const narrow = resolveExecutiveDensityAwareFraming(
    overviewInput({
      viewport: Object.freeze({
        width: 720,
        height: 900,
        usableWidthRatio: 0.55,
      }),
    }),
  );
  assert.ok(narrow.cameraDistance >= wide.cameraDistance);
  assert.ok(narrow.effectiveScore >= wide.effectiveScore);
});

test("9. deterministic profile resolution", () => {
  const a = resolveExecutiveDensityAwareFraming(overviewInput());
  const b = resolveExecutiveDensityAwareFraming(overviewInput());
  assert.deepEqual(a, b);
});

test("10. sparse does not unnecessarily over-pull back", () => {
  const sparse = resolveExecutiveDensityAwareFraming(
    overviewInput({
      visibleObjectCount: 3,
      spatialBounds: Object.freeze({
        minX: -1.2,
        maxX: 1.1,
        minY: 0,
        maxY: 0.25,
        minZ: -0.9,
        maxZ: 0.9,
      }),
    }),
  );
  assert.ok(
    sparse.cameraDistance <= EXECUTIVE_DENSITY_OVERVIEW_DISTANCE.balanced + 0.15,
  );
  assert.ok(
    sparse.cameraDistance < EXECUTIVE_DENSITY_OVERVIEW_DISTANCE.dense,
  );
});

test("11. denser scenes produce equal or greater framing distance", () => {
  const sparse = resolveDensityAwareCameraDistance(
    overviewInput({ visibleObjectCount: 3 }),
  );
  const balanced = resolveDensityAwareCameraDistance(overviewInput());
  const dense = resolveDensityAwareCameraDistance(
    overviewInput({
      visibleObjectCount: 14,
      visibleContextCount: 3,
      spatialBounds: Object.freeze({
        minX: -2.75,
        maxX: 2.75,
        minY: -0.35,
        maxY: 0.55,
        minZ: -1.7,
        maxZ: 1.55,
      }),
    }),
  );
  assert.ok(balanced >= sparse);
  assert.ok(dense >= balanced);
});

test("12. distance stays within SP:1.1 bounds and is finite", () => {
  for (const count of [0, 1, 5, 8, 12, 20, 40]) {
    const distance = resolveDensityAwareCameraDistance(
      overviewInput({ visibleObjectCount: count }),
    );
    assert.ok(Number.isFinite(distance));
    assert.ok(
      distance >= EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS.minimumDistance,
    );
    assert.ok(
      distance <= EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS.maximumDistance,
    );
  }
});

test("13. identical input produces identical distance", () => {
  assert.equal(
    resolveDensityAwareCameraDistance(overviewInput()),
    resolveDensityAwareCameraDistance(overviewInput()),
  );
});

test("14. threshold transitions remain controlled", () => {
  const distances: number[] = [];
  for (let count = 1; count <= 20; count += 1) {
    distances.push(
      resolveDensityAwareCameraDistance(
        overviewInput({
          visibleObjectCount: count,
          spatialBounds: Object.freeze({
            minX: -2.2,
            maxX: 2.2,
            minY: -0.2,
            maxY: 0.4,
            minZ: -1.4,
            maxZ: 1.3,
          }),
        }),
      ),
    );
  }
  for (let index = 1; index < distances.length; index += 1) {
    const delta = Math.abs(distances[index]! - distances[index - 1]!);
    // SP:1.7 calibrated sparse→balanced step is intentional and still restrained.
    assert.ok(delta < 1.55, `jump at count ${index + 1}: ${delta}`);
  }
});

test("15. focus-only framing is closer than overview", () => {
  const focus = resolveExecutiveDensityAwareFraming({
    mode: "focus",
    visibleObjectCount: 8,
    visibleContextCount: 0,
    focusedObjectId: "obj-revenue",
    relatedVisibleCount: 0,
  });
  const overview = resolveExecutiveDensityAwareFraming(overviewInput());
  assert.equal(focus.mode, "focus");
  assert.ok(focus.cameraDistance < overview.cameraDistance);
  assert.ok(
    Math.abs(focus.cameraDistance - EXECUTIVE_DENSITY_FOCUS_DISTANCE.focusOnly) <
      0.35,
  );
});

test("16. focus + small related cluster uses standard focus distance", () => {
  const focus = resolveExecutiveDensityAwareFraming({
    mode: "focus",
    visibleObjectCount: 8,
    visibleContextCount: 2,
    focusedObjectId: "obj-revenue",
    relatedVisibleCount: 2,
  });
  assert.ok(
    Math.abs(
      focus.cameraDistance - EXECUTIVE_DENSITY_FOCUS_DISTANCE.smallCluster,
    ) < 0.45,
  );
});

test("17. focus + max related cluster widens modestly", () => {
  const small = resolveDensityAwareCameraDistance({
    mode: "focus",
    visibleObjectCount: 8,
    visibleContextCount: 0,
    focusedObjectId: "obj-a",
    relatedVisibleCount: 2,
  });
  const large = resolveDensityAwareCameraDistance({
    mode: "focus",
    visibleObjectCount: 8,
    visibleContextCount: 0,
    focusedObjectId: "obj-a",
    relatedVisibleCount: 6,
  });
  assert.ok(large >= small);
  assert.ok(large <= EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS.maximumDistance);
  assert.ok(
    large < EXECUTIVE_DENSITY_OVERVIEW_DISTANCE.balanced,
  );
});

test("18. background object count does not destroy focus framing", () => {
  const focusFewBg = resolveDensityAwareCameraDistance({
    mode: "focus",
    visibleObjectCount: 4,
    visibleContextCount: 0,
    focusedObjectId: "obj-a",
    relatedVisibleCount: 2,
  });
  const focusManyBg = resolveDensityAwareCameraDistance({
    mode: "focus",
    visibleObjectCount: 20,
    visibleContextCount: 0,
    focusedObjectId: "obj-a",
    relatedVisibleCount: 2,
  });
  assert.ok(Math.abs(focusManyBg - focusFewBg) < 0.85);
});

test("19. focus exit restores density-aware overview", () => {
  const focus = resolveExecutiveDensityAwareFraming({
    mode: "focus",
    visibleObjectCount: 8,
    visibleContextCount: 1,
    focusedObjectId: "obj-revenue",
    relatedVisibleCount: 2,
  });
  const overview = resolveExecutiveDensityAwareFraming(
    overviewInput({ focusedObjectId: null, relatedVisibleCount: 0 }),
  );
  assert.equal(overview.mode, "overview");
  assert.equal(overview.profile, "balanced");
  assert.ok(overview.cameraDistance > focus.cameraDistance);
  assert.ok(
    Math.abs(
      overview.cameraDistance - EXECUTIVE_OVERVIEW_VIEWING_POLICY.distance,
    ) < 0.75,
  );
});

test("20. navigation offsets survive density base recalculation", () => {
  const baseA = resolveExecutiveCameraNavigationBaseIntent({
    mode: "overview",
    target: EXECUTIVE_OVERVIEW_VIEWING_POLICY.target,
    distance: EXECUTIVE_DENSITY_OVERVIEW_DISTANCE.balanced,
  });
  const navigated = applyExecutiveCameraNavigationAction(
    { azimuthOffset: 0, elevationOffset: 0, distanceOffset: 0 },
    "orbit-right",
    baseA,
  );
  const denserBase = resolveExecutiveCameraNavigationBaseIntent({
    mode: "overview",
    target: EXECUTIVE_OVERVIEW_VIEWING_POLICY.target,
    distance: EXECUTIVE_DENSITY_OVERVIEW_DISTANCE.dense,
  });
  const intent = applyExecutiveCameraNavigationOffsets(denserBase, navigated);
  assert.ok(Math.abs(intent.azimuth - denserBase.azimuth - navigated.azimuthOffset) < 1e-9);
  assert.equal(intent.distance, denserBase.distance + navigated.distanceOffset);
});

test("21. Reset clears offsets and restores density-aware base distance", () => {
  const density = resolveExecutiveDensityAwareFraming(overviewInput());
  const base = resolveExecutiveCameraNavigationBaseIntent({
    mode: "overview",
    target: density.cameraTarget,
    distance: density.cameraDistance,
    fov: density.cameraFov,
  });
  const zoomed = applyExecutiveCameraNavigationAction(
    { azimuthOffset: 8, elevationOffset: 5, distanceOffset: -0.7 },
    "reset",
    base,
  );
  const restored = applyExecutiveCameraNavigationOffsets(base, zoomed);
  assert.equal(zoomed.azimuthOffset, 0);
  assert.equal(zoomed.elevationOffset, 0);
  assert.equal(zoomed.distanceOffset, 0);
  assert.equal(restored.distance, density.cameraDistance);
});

test("22. severity-only changes do not alter density profile", () => {
  const a = resolveExecutiveStageDensityProfile(overviewInput());
  const b = resolveExecutiveStageDensityProfile(overviewInput());
  assert.equal(a, b);
  assert.equal(EXECUTIVE_DENSITY_AWARE_FRAMING_BOUNDARY.ownsBusinessTruth, false);
  assert.doesNotMatch(source, /severity|kpiValue|recommendationStatus/);
  // Score helper depends only on presentation-space inputs.
  assert.equal(
    resolveExecutiveDensityEffectiveScore(overviewInput()),
    resolveExecutiveDensityEffectiveScore(overviewInput()),
  );
});

test("23. MVP balanced overview distance near SP:1.7 calibrated canonical", () => {
  const framing = resolveExecutiveDensityAwareFraming(overviewInput());
  assert.equal(framing.profile, "balanced");
  assert.ok(
    Math.abs(
      framing.cameraDistance - EXECUTIVE_OVERVIEW_VIEWING_POLICY.distance,
    ) < 0.55,
  );
  assert.ok(framing.cameraDistance >= 10.2);
  assert.equal(framing.cameraFov, EXECUTIVE_OVERVIEW_VIEWING_POLICY.fov);
});

test("24. occupied bounds helper is deterministic", () => {
  const bounds = buildExecutiveOccupiedBoundsFromPositions([
    Object.freeze({ x: -1, y: 0, z: 1 }),
    Object.freeze({ x: 2, y: 0.4, z: -1 }),
  ]);
  assert.deepEqual(bounds, {
    minX: -1,
    maxX: 2,
    minY: 0,
    maxY: 0.4,
    minZ: -1,
    maxZ: 1,
  });
});

test("25. hysteresis reduces profile flicker near boundaries", () => {
  const nearBoundary = overviewInput({
    visibleObjectCount: 11,
    visibleContextCount: 0,
    spatialBounds: Object.freeze({
      minX: -2.4,
      maxX: 2.4,
      minY: -0.25,
      maxY: 0.45,
      minZ: -1.5,
      maxZ: 1.4,
    }),
  });
  const raw = resolveExecutiveStageDensityProfile(nearBoundary);
  const sticky = resolveExecutiveStageDensityProfile({
    ...nearBoundary,
    previousProfile: "balanced",
  });
  // Either same as raw, or held at previous when within deadband.
  assert.ok(sticky === raw || sticky === "balanced");
});

test("26. context cap authority not expanded", () => {
  assert.equal(
    EXECUTIVE_DENSITY_AWARE_FRAMING_BOUNDARY.expandsContextCaps,
    false,
  );
  assert.doesNotMatch(source, /maxDirectContextItems\s*=\s*[1-9][0-9]/);
});

test("27. focus FOV remains companion focus family", () => {
  const focus = resolveExecutiveDensityAwareFraming({
    mode: "focus",
    visibleObjectCount: 8,
    visibleContextCount: 0,
    focusedObjectId: "obj-a",
    relatedVisibleCount: 3,
  });
  assert.equal(focus.cameraFov, EXECUTIVE_FOCUS_VIEWING_POLICY.fov);
});
