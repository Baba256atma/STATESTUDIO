/**
 * SP:1.5 — Focus Camera Choreography tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS,
  EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS,
} from "./executiveCameraFoundation.ts";
import {
  EXECUTIVE_FOCUS_CHOREOGRAPHY_BOUNDARY,
  EXECUTIVE_FOCUS_REGION,
  EXECUTIVE_FOCUS_RELATED_LIMITS,
  executiveFocusChoreographyIdentity,
  executiveFocusChoreographyVersion,
  getExecutiveFocusChoreographyIdentity,
  resolveExecutiveFocusChoreography,
  resolveExecutiveFocusRelatedObjectIds,
  verifyExecutiveFocusChoreography,
  type ExecutiveFocusChoreographyInput,
  type ExecutiveFocusObjectInput,
} from "./executiveFocusChoreography.ts";

const source = readFileSync(
  new URL("./executiveFocusChoreography.ts", import.meta.url),
  "utf8",
);

function sampleObjects(): readonly ExecutiveFocusObjectInput[] {
  return Object.freeze([
    Object.freeze({
      objectId: "obj-revenue",
      basePosition: Object.freeze({ x: -2.35, y: 0.08, z: 0.05 }),
    }),
    Object.freeze({
      objectId: "obj-capacity",
      basePosition: Object.freeze({ x: 0.75, y: 0.16, z: 1.15 }),
      retainDiscoverability: true,
    }),
    Object.freeze({
      objectId: "obj-customer",
      basePosition: Object.freeze({ x: 2.0, y: 0.3, z: -1.35 }),
    }),
    Object.freeze({
      objectId: "obj-delivery",
      basePosition: Object.freeze({ x: 1.15, y: -0.2, z: 0.55 }),
    }),
    Object.freeze({
      objectId: "obj-inventory",
      basePosition: Object.freeze({ x: -2.05, y: 0.38, z: -1.4 }),
    }),
  ]);
}

/** Canonical edges — intentionally NO revenue↔capacity edge. */
const SAMPLE_CONNECTIONS = Object.freeze([
  Object.freeze({
    id: "rel-customer-revenue",
    sourceId: "obj-customer",
    targetId: "obj-revenue",
  }),
  Object.freeze({
    id: "rel-delivery-customer",
    sourceId: "obj-delivery",
    targetId: "obj-customer",
  }),
  Object.freeze({
    id: "rel-capacity-delivery",
    sourceId: "obj-capacity",
    targetId: "obj-delivery",
  }),
]);

function focusRevenueInput(
  overrides: Partial<ExecutiveFocusChoreographyInput> = {},
): ExecutiveFocusChoreographyInput {
  return {
    focusedObjectId: "obj-revenue",
    objects: sampleObjects(),
    connections: SAMPLE_CONNECTIONS,
    ...overrides,
  };
}

test("1. SP:1.5 identity depends on SP:1.1–1.4", () => {
  const identity = getExecutiveFocusChoreographyIdentity();
  assert.equal(
    executiveFocusChoreographyIdentity,
    "SP:1.5/ExecutiveFocusChoreography",
  );
  assert.equal(executiveFocusChoreographyVersion, "1.5.0");
  assert.equal(
    identity.upstreamCameraFoundation,
    "SP:1.1/ExecutiveCameraFoundation",
  );
  assert.equal(identity.upstreamViewingAngle, "SP:1.2/ExecutiveViewingAngle");
  assert.equal(
    identity.upstreamCameraNavigation,
    "SP:1.3/ExecutiveCameraNavigation",
  );
  assert.equal(
    identity.upstreamSpatialComposition,
    "SP:1.4/ExecutiveSpatialComposition",
  );
});

test("2. null focus returns base/no-focus choreography", () => {
  const result = resolveExecutiveFocusChoreography({
    focusedObjectId: null,
    objects: sampleObjects(),
    connections: SAMPLE_CONNECTIONS,
  });
  assert.equal(result.focusedObjectId, null);
  assert.equal(result.relatedObjectIds.length, 0);
  assert.ok(
    result.objects.every(
      (entry) =>
        entry.role === "background" &&
        JSON.stringify(entry.targetPosition) ===
          JSON.stringify(entry.basePosition),
    ),
  );
});

test("3. valid focus produces exactly one focus role", () => {
  const result = resolveExecutiveFocusChoreography(focusRevenueInput());
  assert.equal(
    result.objects.filter((entry) => entry.role === "focus").length,
    1,
  );
  assert.equal(
    result.objects.find((entry) => entry.role === "focus")?.objectId,
    "obj-revenue",
  );
});

test("4. canonical related objects resolve as related", () => {
  const related = resolveExecutiveFocusRelatedObjectIds({
    focusedObjectId: "obj-revenue",
    connections: SAMPLE_CONNECTIONS,
  });
  assert.deepEqual(related, ["obj-customer"]);
  const result = resolveExecutiveFocusChoreography(focusRevenueInput());
  assert.deepEqual(result.relatedObjectIds, ["obj-customer"]);
  assert.equal(
    result.objects.find((entry) => entry.objectId === "obj-customer")?.role,
    "related",
  );
});

test("5. non-related objects remain background", () => {
  const result = resolveExecutiveFocusChoreography(focusRevenueInput());
  assert.equal(
    result.objects.find((entry) => entry.objectId === "obj-inventory")?.role,
    "background",
  );
  assert.equal(
    result.objects.find((entry) => entry.objectId === "obj-delivery")?.role,
    "background",
  );
});

test("6. no synthetic connections are produced", () => {
  assert.equal(EXECUTIVE_FOCUS_CHOREOGRAPHY_BOUNDARY.inventsRelationships, false);
  assert.doesNotMatch(source, /createEdge|inventRelation|fabricate/);
  const result = resolveExecutiveFocusChoreography(focusRevenueInput());
  assert.equal(result.relatedObjectIds.includes("obj-capacity"), false);
});

test("7. 1-hop discipline is preserved", () => {
  // delivery is 2-hop from revenue via customer — must not appear as related.
  const result = resolveExecutiveFocusChoreography(focusRevenueInput());
  assert.equal(result.relatedObjectIds.includes("obj-delivery"), false);
  assert.equal(EXECUTIVE_FOCUS_CHOREOGRAPHY_BOUNDARY.oneHopDefault, true);
  assert.equal(
    EXECUTIVE_FOCUS_CHOREOGRAPHY_BOUNDARY.introducesMultiHopExpansion,
    false,
  );
});

test("8. focused object receives deterministic focus target", () => {
  const result = resolveExecutiveFocusChoreography(focusRevenueInput());
  const focus = result.objects.find((entry) => entry.objectId === "obj-revenue");
  assert.deepEqual(focus?.targetPosition, EXECUTIVE_FOCUS_REGION);
});

test("9. related slot assignment is deterministic", () => {
  const a = resolveExecutiveFocusChoreography(focusRevenueInput());
  const b = resolveExecutiveFocusChoreography(focusRevenueInput());
  assert.deepEqual(
    a.objects.map((entry) => ({
      id: entry.objectId,
      role: entry.role,
      slot: entry.relatedSlotIndex,
      target: entry.targetPosition,
    })),
    b.objects.map((entry) => ({
      id: entry.objectId,
      role: entry.role,
      slot: entry.relatedSlotIndex,
      target: entry.targetPosition,
    })),
  );
});

test("10. base positions are not mutated", () => {
  const objects = sampleObjects().map((entry) => ({ ...entry }));
  const before = JSON.stringify(objects);
  const result = resolveExecutiveFocusChoreography({
    focusedObjectId: "obj-revenue",
    objects,
    connections: SAMPLE_CONNECTIONS,
  });
  assert.equal(JSON.stringify(objects), before);
  for (const entry of result.objects) {
    const sourceObject = objects.find(
      (object) => object.objectId === entry.objectId,
    )!;
    assert.deepEqual(entry.basePosition, sourceObject.basePosition);
  }
  assert.equal(
    EXECUTIVE_FOCUS_CHOREOGRAPHY_BOUNDARY.mutatesBaseComposition,
    false,
  );
});

test("11. camera target resolves toward focus cluster", () => {
  const result = resolveExecutiveFocusChoreography(focusRevenueInput());
  assert.ok(
    Math.abs(result.cameraIntent.target.y - EXECUTIVE_FOCUS_REGION.y) < 0.25,
  );
  assert.ok(
    Math.hypot(
      result.cameraIntent.target.x - EXECUTIVE_FOCUS_REGION.x,
      result.cameraIntent.target.z - EXECUTIVE_FOCUS_REGION.z,
    ) < 1.2,
  );
});

test("12. camera intent stays within SP:1.1 constraints", () => {
  const result = resolveExecutiveFocusChoreography(focusRevenueInput());
  assert.ok(
    result.cameraIntent.distance >=
      EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS.minimumDistance,
  );
  assert.ok(
    result.cameraIntent.distance <=
      EXECUTIVE_CAMERA_DISTANCE_CONSTRAINTS.maximumDistance,
  );
  assert.ok(
    result.cameraIntent.elevation >=
      EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS.minimumElevation,
  );
  assert.ok(
    result.cameraIntent.elevation <=
      EXECUTIVE_CAMERA_ELEVATION_CONSTRAINTS.maximumElevation,
  );
});

test("13. CRITICAL NON-EDGE — capacity remains background critical/discoverable", () => {
  const result = resolveExecutiveFocusChoreography(focusRevenueInput());
  const capacity = result.objects.find(
    (entry) => entry.objectId === "obj-capacity",
  )!;
  assert.equal(capacity.role, "background");
  assert.equal(capacity.retainDiscoverability, true);
  assert.ok(capacity.emphasis >= 0.5);
  assert.equal(result.relatedObjectIds.includes("obj-capacity"), false);
  assert.notDeepEqual(capacity.targetPosition, EXECUTIVE_FOCUS_REGION);
  // Must not sit in related ring radius around focus (STAGE-2D:2 — XY plane).
  const radial = Math.hypot(
    capacity.targetPosition.x - EXECUTIVE_FOCUS_REGION.x,
    capacity.targetPosition.y - EXECUTIVE_FOCUS_REGION.y,
  );
  assert.ok(radial > EXECUTIVE_FOCUS_RELATED_LIMITS.relatedRadius + 0.4);
  assert.equal(capacity.targetPosition.z, 0);
});

test("14. identical inputs produce identical output", () => {
  const a = resolveExecutiveFocusChoreography(focusRevenueInput());
  const b = resolveExecutiveFocusChoreography(focusRevenueInput());
  assert.deepEqual(a, b);
});

test("15. rapid focus replacement uses latest resolved state cleanly", () => {
  const revenue = resolveExecutiveFocusChoreography(focusRevenueInput());
  const delivery = resolveExecutiveFocusChoreography({
    focusedObjectId: "obj-delivery",
    objects: sampleObjects(),
    connections: SAMPLE_CONNECTIONS,
  });
  assert.equal(revenue.focusedObjectId, "obj-revenue");
  assert.equal(delivery.focusedObjectId, "obj-delivery");
  assert.equal(
    delivery.objects.filter((entry) => entry.role === "focus").length,
    1,
  );
  assert.deepEqual(
    delivery.relatedObjectIds.slice().sort(),
    ["obj-capacity", "obj-customer"].sort(),
  );
});

test("16. isolated focused object resolves safely", () => {
  const result = resolveExecutiveFocusChoreography({
    focusedObjectId: "obj-inventory",
    objects: sampleObjects(),
    connections: SAMPLE_CONNECTIONS,
  });
  assert.equal(result.focusedObjectId, "obj-inventory");
  assert.equal(result.relatedObjectIds.length, 0);
  assert.deepEqual(
    result.objects.find((entry) => entry.objectId === "obj-inventory")
      ?.targetPosition,
    EXECUTIVE_FOCUS_REGION,
  );
});

test("17. overflow related context is handled deterministically", () => {
  const manyConnections = Object.freeze(
    Array.from({ length: 10 }, (_, index) =>
      Object.freeze({
        id: `rel-${index}`,
        sourceId: "obj-revenue",
        targetId: `obj-extra-${String(index).padStart(2, "0")}`,
      }),
    ),
  );
  const objects: ExecutiveFocusObjectInput[] = [
    ...sampleObjects(),
    ...Array.from({ length: 10 }, (_, index) =>
      Object.freeze({
        objectId: `obj-extra-${String(index).padStart(2, "0")}`,
        basePosition: Object.freeze({
          x: (index % 4) - 1.5,
          y: 0.1,
          z: (index % 3) - 1,
        }),
      }),
    ),
  ];
  const result = resolveExecutiveFocusChoreography({
    focusedObjectId: "obj-revenue",
    objects,
    connections: manyConnections,
    maxRelatedVisible: 4,
  });
  assert.equal(result.relatedObjectIds.length, 4);
  assert.equal(result.overflowRelatedObjectIds.length, 6);
  assert.ok(
    result.overflowRelatedObjectIds.every((objectId) =>
      result.objects.some(
        (entry) => entry.objectId === objectId && entry.role === "background",
      ),
    ),
  );
  assert.equal(verifyExecutiveFocusChoreography().ok, true);
});
