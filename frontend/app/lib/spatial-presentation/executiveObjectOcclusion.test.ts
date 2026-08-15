/**
 * SP:1.8 — Occlusion-Aware Object Readability & Camera Navigation tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS,
  EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS,
  resolveExecutiveCameraPresentation,
  sanitizeExecutiveCameraIntent,
} from "./executiveCameraFoundation.ts";
import {
  EXECUTIVE_CAMERA_NAVIGATION_AZIMUTH_LIMITS,
  EXECUTIVE_CAMERA_NAVIGATION_STEPS,
  INITIAL_EXECUTIVE_CAMERA_NAVIGATION_STATE,
  applyExecutiveCameraNavigationAction,
  applyExecutiveCameraNavigationOffsets,
  resolveExecutiveCameraNavigationBaseIntent,
  resolveNavigatedExecutiveCameraIntent,
} from "./executiveCameraNavigation.ts";
import {
  EXECUTIVE_OBJECT_OCCLUSION_BOUNDARY,
  EXECUTIVE_OCCLUSION_NAVIGATION_AZIMUTH_LIMITS,
  executiveObjectOcclusionIdentity,
  getExecutiveObjectOcclusionIdentity,
  resolveExecutiveObjectOcclusion,
  resolveExecutiveOcclusionAwareFocusCameraIntent,
  resolveExecutiveOcclusionReadability,
  verifyExecutiveObjectOcclusion,
} from "./executiveObjectOcclusion.ts";
import {
  EXECUTIVE_OVERVIEW_VIEWING_POLICY,
} from "./executiveViewingAngle.ts";

const source = readFileSync(
  new URL("./executiveObjectOcclusion.ts", import.meta.url),
  "utf8",
);

const CAMERA = Object.freeze({
  position: Object.freeze({ x: 3.8, y: 5.2, z: 7.6 }),
  target: Object.freeze({ x: -0.22, y: 0.2, z: 0.02 }),
  fov: 38,
  aspect: 1.45,
});

test("1. SP:1.8 identity and presentation-only boundary", () => {
  const identity = getExecutiveObjectOcclusionIdentity();
  assert.equal(identity.id, executiveObjectOcclusionIdentity);
  assert.equal(identity.version, "1.8.0");
  assert.equal(EXECUTIVE_OBJECT_OCCLUSION_BOUNDARY.objectSpecificHacks, false);
  assert.equal(EXECUTIVE_OBJECT_OCCLUSION_BOUNDARY.mutatesBaseComposition, false);
  assert.equal(EXECUTIVE_OBJECT_OCCLUSION_BOUNDARY.autoMovesOverviewCamera, false);
  assert.equal(verifyExecutiveObjectOcclusion().ok, true);
  assert.doesNotMatch(source, /objectId\s*===\s*["']obj-delivery["']/);
  assert.doesNotMatch(source, /objectId\s*===\s*["']delivery["']/);
});

test("2. separated objects resolve clear", () => {
  const result = resolveExecutiveObjectOcclusion({
    objects: [
      Object.freeze({
        objectId: "a",
        position: Object.freeze({ x: -2, y: 0.1, z: 0 }),
      }),
      Object.freeze({
        objectId: "b",
        position: Object.freeze({ x: 2, y: 0.1, z: 0 }),
      }),
    ],
    cameraPosition: CAMERA.position,
    cameraTarget: CAMERA.target,
    fovDegrees: CAMERA.fov,
    aspect: CAMERA.aspect,
  });
  assert.equal(result.byId.get("a")?.state, "clear");
  assert.equal(result.byId.get("b")?.state, "clear");
});

test("3. overlapping rear object resolves partial/substantial", () => {
  // Place both near the look-ray so screen projections coincide.
  const result = resolveExecutiveObjectOcclusion({
    objects: [
      Object.freeze({
        objectId: "front",
        position: Object.freeze({ x: -0.1, y: 0.2, z: 0.9 }),
        radius: 0.7,
      }),
      Object.freeze({
        objectId: "rear",
        position: Object.freeze({ x: -0.12, y: 0.2, z: -0.8 }),
        radius: 0.65,
      }),
    ],
    cameraPosition: CAMERA.position,
    cameraTarget: CAMERA.target,
    fovDegrees: CAMERA.fov,
    aspect: CAMERA.aspect,
  });
  const rear = result.byId.get("rear")!;
  const front = result.byId.get("front")!;
  assert.ok(rear.state === "partial" || rear.state === "substantial");
  assert.equal(front.state, "clear");
  assert.ok(rear.occluderIds.includes("front"));
});

test("4. front object is identified correctly", () => {
  const result = resolveExecutiveObjectOcclusion({
    objects: [
      Object.freeze({
        objectId: "near",
        position: Object.freeze({ x: -0.2, y: 0.2, z: 1.0 }),
        radius: 0.7,
      }),
      Object.freeze({
        objectId: "far",
        position: Object.freeze({ x: -0.2, y: 0.2, z: -0.9 }),
        radius: 0.7,
      }),
    ],
    cameraPosition: CAMERA.position,
    cameraTarget: CAMERA.target,
    fovDegrees: CAMERA.fov,
    aspect: CAMERA.aspect,
  });
  assert.equal(result.byId.get("near")?.state, "clear");
  assert.ok(result.byId.get("far")?.occluderIds.includes("near"));
});

test("5. world proximity without screen overlap is not occlusion", () => {
  const result = resolveExecutiveObjectOcclusion({
    objects: [
      Object.freeze({
        objectId: "left",
        position: Object.freeze({ x: -1.6, y: 0.1, z: 0.2 }),
        radius: 0.35,
      }),
      Object.freeze({
        objectId: "right",
        position: Object.freeze({ x: 1.6, y: 0.1, z: 0.25 }),
        radius: 0.35,
      }),
    ],
    cameraPosition: CAMERA.position,
    cameraTarget: CAMERA.target,
    fovDegrees: CAMERA.fov,
    aspect: CAMERA.aspect,
  });
  assert.equal(result.byId.get("left")?.state, "clear");
  assert.equal(result.byId.get("right")?.state, "clear");
});

test("6. camera orbit can change occlusion classification", () => {
  const objects = [
    Object.freeze({
      objectId: "front",
      position: Object.freeze({ x: -0.1, y: 0.2, z: 0.9 }),
      radius: 0.7,
    }),
    Object.freeze({
      objectId: "rear",
      position: Object.freeze({ x: -0.12, y: 0.2, z: -0.8 }),
      radius: 0.65,
    }),
  ];
  const base = resolveExecutiveCameraNavigationBaseIntent({
    mode: "overview",
    target: CAMERA.target,
    distance: 10.35,
  });
  const overview = resolveExecutiveCameraPresentation(base);
  const before = resolveExecutiveObjectOcclusion({
    objects,
    cameraPosition: overview.position,
    cameraTarget: overview.target,
    fovDegrees: overview.fov,
    aspect: CAMERA.aspect,
  });
  assert.ok(
    before.byId.get("rear")?.state === "partial" ||
      before.byId.get("rear")?.state === "substantial",
  );

  let nav = INITIAL_EXECUTIVE_CAMERA_NAVIGATION_STATE;
  for (let i = 0; i < 4; i += 1) {
    nav = applyExecutiveCameraNavigationAction(nav, "orbit-right", base);
  }
  const orbited = resolveExecutiveCameraPresentation(
    applyExecutiveCameraNavigationOffsets(base, nav),
  );
  const after = resolveExecutiveObjectOcclusion({
    objects,
    cameraPosition: orbited.position,
    cameraTarget: orbited.target,
    fovDegrees: orbited.fov,
    aspect: CAMERA.aspect,
  });
  assert.notEqual(
    after.byId.get("rear")?.overlapRatio,
    before.byId.get("rear")?.overlapRatio,
  );
});

test("7. output is deterministic and input is not mutated", () => {
  const objects = [
    Object.freeze({
      objectId: "a",
      position: Object.freeze({ x: 0.2, y: 0.1, z: 1 }),
    }),
    Object.freeze({
      objectId: "b",
      position: Object.freeze({ x: 0.15, y: 0.1, z: -0.2 }),
    }),
  ];
  const before = JSON.stringify(objects);
  const a = resolveExecutiveObjectOcclusion({
    objects,
    cameraPosition: CAMERA.position,
    cameraTarget: CAMERA.target,
    fovDegrees: CAMERA.fov,
    aspect: CAMERA.aspect,
  });
  const b = resolveExecutiveObjectOcclusion({
    objects,
    cameraPosition: CAMERA.position,
    cameraTarget: CAMERA.target,
    fovDegrees: CAMERA.fov,
    aspect: CAMERA.aspect,
  });
  assert.deepEqual(a.objects, b.objects);
  assert.equal(JSON.stringify(objects), before);
});

test("8. object IDs do not affect geometry result", () => {
  const geometry = {
    cameraPosition: CAMERA.position,
    cameraTarget: CAMERA.target,
    fovDegrees: CAMERA.fov,
    aspect: CAMERA.aspect,
  };
  const named = resolveExecutiveObjectOcclusion({
    ...geometry,
    objects: [
      Object.freeze({
        objectId: "obj-delivery",
        position: Object.freeze({ x: 0.1, y: 0.1, z: -0.2 }),
        radius: 0.5,
      }),
      Object.freeze({
        objectId: "obj-capacity",
        position: Object.freeze({ x: 0.12, y: 0.1, z: 1.2 }),
        radius: 0.55,
      }),
    ],
  });
  const anonymous = resolveExecutiveObjectOcclusion({
    ...geometry,
    objects: [
      Object.freeze({
        objectId: "rear-object",
        position: Object.freeze({ x: 0.1, y: 0.1, z: -0.2 }),
        radius: 0.5,
      }),
      Object.freeze({
        objectId: "front-object",
        position: Object.freeze({ x: 0.12, y: 0.1, z: 1.2 }),
        radius: 0.55,
      }),
    ],
  });
  assert.equal(
    named.byId.get("obj-delivery")?.state,
    anonymous.byId.get("rear-object")?.state,
  );
  assert.ok(
    Math.abs(
      (named.byId.get("obj-delivery")?.overlapRatio ?? 0) -
        (anonymous.byId.get("rear-object")?.overlapRatio ?? 0),
    ) < 1e-9,
  );
});

test("9. multiple occluders degrade safely", () => {
  const result = resolveExecutiveObjectOcclusion({
    objects: [
      Object.freeze({
        objectId: "rear",
        position: Object.freeze({ x: 0, y: 0.1, z: -0.4 }),
        radius: 0.45,
      }),
      Object.freeze({
        objectId: "mid",
        position: Object.freeze({ x: 0.05, y: 0.1, z: 0.5 }),
        radius: 0.45,
      }),
      Object.freeze({
        objectId: "front",
        position: Object.freeze({ x: -0.05, y: 0.12, z: 1.3 }),
        radius: 0.45,
      }),
    ],
    cameraPosition: CAMERA.position,
    cameraTarget: CAMERA.target,
    fovDegrees: CAMERA.fov,
    aspect: CAMERA.aspect,
  });
  const rear = result.byId.get("rear")!;
  assert.ok(rear.occluderIds.length >= 1);
  assert.ok(rear.state === "partial" || rear.state === "substantial");
});

test("10. invalid geometry is handled safely", () => {
  const result = resolveExecutiveObjectOcclusion({
    objects: [
      Object.freeze({
        objectId: "ok",
        position: Object.freeze({ x: 1, y: 0, z: 0 }),
      }),
      Object.freeze({
        objectId: "",
        position: Object.freeze({ x: Number.NaN, y: 0, z: 0 }),
      }),
    ],
    cameraPosition: CAMERA.position,
    cameraTarget: CAMERA.target,
    fovDegrees: CAMERA.fov,
    aspect: CAMERA.aspect,
  });
  assert.equal(result.byId.has("ok"), true);
  assert.equal(result.byId.has(""), false);
});

test("11. navigation azimuth range supports useful parallax", () => {
  assert.ok(
    EXECUTIVE_CAMERA_NAVIGATION_AZIMUTH_LIMITS.maximumAzimuthOffset >=
      EXECUTIVE_OCCLUSION_NAVIGATION_AZIMUTH_LIMITS.maximumAzimuthOffset - 1e-9,
  );
  assert.ok(EXECUTIVE_CAMERA_NAVIGATION_STEPS.azimuthStep > 0);
  const base = resolveExecutiveCameraNavigationBaseIntent({
    mode: "overview",
    target: EXECUTIVE_OVERVIEW_VIEWING_POLICY.target,
    distance: EXECUTIVE_OVERVIEW_VIEWING_POLICY.distance,
  });
  let state = INITIAL_EXECUTIVE_CAMERA_NAVIGATION_STATE;
  for (let i = 0; i < 8; i += 1) {
    state = applyExecutiveCameraNavigationAction(state, "orbit-right", base);
  }
  assert.ok(
    state.azimuthOffset <=
      EXECUTIVE_CAMERA_NAVIGATION_AZIMUTH_LIMITS.maximumAzimuthOffset + 1e-9,
  );
  const intent = resolveNavigatedExecutiveCameraIntent({
    mode: "overview",
    target: EXECUTIVE_OVERVIEW_VIEWING_POLICY.target,
    navigation: state,
    distance: EXECUTIVE_OVERVIEW_VIEWING_POLICY.distance,
  });
  assert.ok(
    intent.distance >= EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS.minimumDistance,
  );
  assert.ok(
    intent.elevation >= EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS.minimumElevation,
  );
  assert.ok(
    intent.elevation <= EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS.maximumElevation,
  );
});

test("12. Reset restores canonical overview navigation offsets", () => {
  const base = resolveExecutiveCameraNavigationBaseIntent({
    mode: "overview",
    target: EXECUTIVE_OVERVIEW_VIEWING_POLICY.target,
    distance: EXECUTIVE_OVERVIEW_VIEWING_POLICY.distance,
  });
  let state = applyExecutiveCameraNavigationAction(
    INITIAL_EXECUTIVE_CAMERA_NAVIGATION_STATE,
    "orbit-left",
    base,
  );
  state = applyExecutiveCameraNavigationAction(state, "tilt-up", base);
  state = applyExecutiveCameraNavigationAction(state, "reset", base);
  assert.deepEqual(state, INITIAL_EXECUTIVE_CAMERA_NAVIGATION_STATE);
});

test("13. DELIVERY-like regression — occluded rear improves with orbit / focus", () => {
  // Generic rear/front pair (Delivery-class geometry) — no production ID hacks.
  const objects = [
    Object.freeze({
      objectId: "rear-target",
      position: Object.freeze({ x: 0.2, y: 0.05, z: 0.2 }),
      radius: 0.55,
    }),
    Object.freeze({
      objectId: "front-occluder",
      position: Object.freeze({ x: 0.15, y: 0.12, z: 1.2 }),
      radius: 0.65,
    }),
  ];
  const base = resolveExecutiveCameraNavigationBaseIntent({
    mode: "overview",
    target: EXECUTIVE_OVERVIEW_VIEWING_POLICY.target,
    distance: EXECUTIVE_OVERVIEW_VIEWING_POLICY.distance,
  });
  const overview = resolveExecutiveCameraPresentation(base);
  const overviewOcclusion = resolveExecutiveObjectOcclusion({
    objects,
    cameraPosition: overview.position,
    cameraTarget: overview.target,
    fovDegrees: overview.fov,
    aspect: CAMERA.aspect,
  });
  const rearOverview = overviewOcclusion.byId.get("rear-target")!;
  assert.ok(
    rearOverview.state === "partial" || rearOverview.state === "substantial",
  );
  assert.equal(rearOverview.readabilityAssist, true);

  let nav = INITIAL_EXECUTIVE_CAMERA_NAVIGATION_STATE;
  for (let i = 0; i < 4; i += 1) {
    nav = applyExecutiveCameraNavigationAction(nav, "orbit-right", base);
  }
  const orbited = resolveExecutiveCameraPresentation(
    applyExecutiveCameraNavigationOffsets(base, nav),
  );
  const orbitedOcclusion = resolveExecutiveObjectOcclusion({
    objects,
    cameraPosition: orbited.position,
    cameraTarget: orbited.target,
    fovDegrees: orbited.fov,
    aspect: CAMERA.aspect,
  });
  assert.ok(
    (orbitedOcclusion.byId.get("rear-target")?.overlapRatio ?? 1) <
      rearOverview.overlapRatio + 0.05,
  );

  const focusIntent = resolveExecutiveOcclusionAwareFocusCameraIntent({
    baseIntent: sanitizeExecutiveCameraIntent(
      Object.freeze({
        target: Object.freeze({ x: 0, y: 0.42, z: 0 }),
        distance: 7.15,
        azimuth: EXECUTIVE_OVERVIEW_VIEWING_POLICY.azimuth,
        elevation: EXECUTIVE_OVERVIEW_VIEWING_POLICY.elevation,
        fov: 36,
      }),
    ),
    focusedObjectId: "rear-target",
    objects: [
      Object.freeze({
        objectId: "rear-target",
        position: Object.freeze({ x: 0, y: 0.42, z: 0 }),
        radius: 0.48,
      }),
      Object.freeze({
        objectId: "front-occluder",
        position: Object.freeze({ x: 1.55, y: 0.52, z: 0 }),
        radius: 0.4,
      }),
    ],
  });
  const focusPresentation = resolveExecutiveCameraPresentation(focusIntent);
  const focusOcclusion = resolveExecutiveObjectOcclusion({
    objects: [
      Object.freeze({
        objectId: "rear-target",
        position: Object.freeze({ x: 0, y: 0.42, z: 0 }),
        radius: 0.48,
      }),
      Object.freeze({
        objectId: "front-occluder",
        position: Object.freeze({ x: 1.55, y: 0.52, z: 0 }),
        radius: 0.4,
      }),
    ],
    cameraPosition: focusPresentation.position,
    cameraTarget: focusPresentation.target,
    fovDegrees: focusPresentation.fov,
    aspect: CAMERA.aspect,
    focusedObjectId: "rear-target",
  });
  assert.ok(
    focusOcclusion.byId.get("rear-target")?.state === "clear" ||
      focusOcclusion.byId.get("rear-target")?.state === "partial",
  );
});

test("14. readability assist prefers labels for substantial occlusion", () => {
  const readability = resolveExecutiveOcclusionReadability({
    occlusion: Object.freeze({
      objectId: "x",
      state: "substantial",
      occluderIds: Object.freeze(["y"]),
      readabilityAssist: true,
      overlapRatio: 0.7,
    }),
    retainDiscoverability: true,
  });
  assert.equal(readability.labelProminence, "full");
  assert.equal(readability.silhouetteAssist, true);
});

test("15. focus best-view remains bounded", () => {
  const base = sanitizeExecutiveCameraIntent(
    Object.freeze({
      target: Object.freeze({ x: 0, y: 0.42, z: 0 }),
      distance: 7.15,
      azimuth: EXECUTIVE_OVERVIEW_VIEWING_POLICY.azimuth,
      elevation: EXECUTIVE_OVERVIEW_VIEWING_POLICY.elevation,
      fov: 36,
    }),
  );
  const adjusted = resolveExecutiveOcclusionAwareFocusCameraIntent({
    baseIntent: base,
    focusedObjectId: "focus",
    objects: [
      Object.freeze({
        objectId: "focus",
        position: Object.freeze({ x: 0, y: 0.42, z: 0 }),
      }),
      Object.freeze({
        objectId: "block",
        position: Object.freeze({ x: 0.05, y: 0.4, z: 0.1 }),
        radius: 0.7,
      }),
    ],
  });
  const delta = Math.abs(adjusted.azimuth - base.azimuth);
  assert.ok(delta <= 16 * (Math.PI / 180) + 1e-6);
  assert.ok(
    adjusted.elevation >= EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS.minimumElevation,
  );
  assert.ok(
    adjusted.elevation <= EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS.maximumElevation,
  );
});
