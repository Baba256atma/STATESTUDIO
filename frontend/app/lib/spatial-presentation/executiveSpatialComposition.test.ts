/**
 * SP:1.4 — Spatial Object Composition tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { NEXORA_MVP_STAGE_OBJECT_FIXTURES } from "../nex-mvp/nexoraMVPStageFixtures.ts";
import {
  EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS,
  EXECUTIVE_SPATIAL_COMPOSITION_BOUNDARY,
  EXECUTIVE_SPATIAL_RESERVED_CENTER,
  buildExecutiveSpatialCompositionPositionMap,
  clampExecutiveSpatialVector,
  executiveSpatialCompositionIdentity,
  executiveSpatialCompositionUpstreamCameraFoundationIdentity,
  executiveSpatialCompositionUpstreamCameraNavigationIdentity,
  executiveSpatialCompositionUpstreamViewingAngleIdentity,
  executiveSpatialCompositionVersion,
  getExecutiveSpatialCompositionIdentity,
  hasExecutiveSpatialDepthVariation,
  resolveExecutiveSpatialComposition,
  verifyExecutiveSpatialComposition,
  type ExecutiveSpatialObjectInput,
} from "./executiveSpatialComposition.ts";

const source = readFileSync(
  new URL("./executiveSpatialComposition.ts", import.meta.url),
  "utf8",
);

function fixtureInputs(): readonly ExecutiveSpatialObjectInput[] {
  return NEXORA_MVP_STAGE_OBJECT_FIXTURES.map((entry) =>
    Object.freeze({
      objectId: entry.id,
      preferredPosition: Object.freeze({
        x: entry.position[0],
        y: entry.position[1],
        z: entry.position[2],
      }),
    }),
  );
}

test("1. SP:1.4 identity depends on SP:1.1–1.3", () => {
  const identity = getExecutiveSpatialCompositionIdentity();
  assert.equal(
    executiveSpatialCompositionIdentity,
    "SP:1.4/ExecutiveSpatialComposition",
  );
  assert.equal(executiveSpatialCompositionVersion, "1.4.0");
  assert.equal(
    executiveSpatialCompositionUpstreamCameraFoundationIdentity,
    "SP:1.1/ExecutiveCameraFoundation",
  );
  assert.equal(
    executiveSpatialCompositionUpstreamViewingAngleIdentity,
    "SP:1.2/ExecutiveViewingAngle",
  );
  assert.equal(
    executiveSpatialCompositionUpstreamCameraNavigationIdentity,
    "SP:1.3/ExecutiveCameraNavigation",
  );
  assert.equal(
    identity.upstreamCameraNavigation,
    "SP:1.3/ExecutiveCameraNavigation",
  );
});

test("2. identical inputs produce identical XYZ positions", () => {
  const input = { objects: fixtureInputs() };
  const a = resolveExecutiveSpatialComposition(input);
  const b = resolveExecutiveSpatialComposition(input);
  assert.deepEqual(a, b);
});

test("3. every object retains its canonical objectId", () => {
  const result = resolveExecutiveSpatialComposition({
    objects: fixtureInputs(),
  });
  assert.deepEqual(
    result.objects.map((entry) => entry.objectId).sort(),
    NEXORA_MVP_STAGE_OBJECT_FIXTURES.map((entry) => entry.id).sort(),
  );
});

test("4. positions are finite numbers", () => {
  const result = resolveExecutiveSpatialComposition({
    objects: fixtureInputs(),
  });
  for (const entry of result.objects) {
    assert.ok(Number.isFinite(entry.position.x));
    assert.ok(Number.isFinite(entry.position.y));
    assert.ok(Number.isFinite(entry.position.z));
  }
});

test("5. positions stay inside approved spatial bounds", () => {
  const result = resolveExecutiveSpatialComposition({
    objects: fixtureInputs(),
  });
  const bounds = EXECUTIVE_SPATIAL_COMPOSITION_BOUNDS;
  for (const entry of result.objects) {
    assert.ok(entry.position.x >= bounds.minX && entry.position.x <= bounds.maxX);
    assert.ok(entry.position.y >= bounds.minY && entry.position.y <= bounds.maxY);
    assert.ok(entry.position.z >= bounds.minZ && entry.position.z <= bounds.maxZ);
  }
});

test("6. objects are not assigned duplicate positions where avoidable", () => {
  const result = resolveExecutiveSpatialComposition({
    objects: fixtureInputs(),
  });
  const keys = result.objects.map(
    (entry) =>
      `${entry.position.x}:${entry.position.y}:${entry.position.z}`,
  );
  assert.equal(new Set(keys).size, keys.length);
});

test("7. Z-depth variation exists for multi-object scenes", () => {
  const result = resolveExecutiveSpatialComposition({
    objects: fixtureInputs(),
  });
  assert.equal(hasExecutiveSpatialDepthVariation(result), true);
  const layers = new Set(result.objects.map((entry) => entry.layer));
  assert.ok(layers.has("foreground"));
  assert.ok(layers.has("midground"));
  assert.ok(layers.has("background"));
});

test("8. layout does not mutate input objects", () => {
  const objects = fixtureInputs().map((entry) => ({ ...entry }));
  const before = JSON.stringify(objects);
  resolveExecutiveSpatialComposition({ objects });
  assert.equal(JSON.stringify(objects), before);
});

test("9. stable canonical order produces stable slot assignment", () => {
  const shuffled = [...fixtureInputs()].reverse();
  const a = resolveExecutiveSpatialComposition({ objects: fixtureInputs() });
  const b = resolveExecutiveSpatialComposition({ objects: shuffled });
  assert.deepEqual(
    Object.fromEntries(
      a.objects.map((entry) => [entry.objectId, entry.slotId]),
    ),
    Object.fromEntries(
      b.objects.map((entry) => [entry.objectId, entry.slotId]),
    ),
  );
});

test("10. changing unrelated business severity does not change neutral base composition", () => {
  // Composition API accepts no severity/attention — only geometry hints.
  const geometric = resolveExecutiveSpatialComposition({
    objects: fixtureInputs(),
  });
  const again = resolveExecutiveSpatialComposition({
    objects: fixtureInputs().map((entry) =>
      Object.freeze({
        objectId: entry.objectId,
        preferredPosition: entry.preferredPosition,
      }),
    ),
  });
  assert.deepEqual(geometric, again);
  assert.equal(EXECUTIVE_SPATIAL_COMPOSITION_BOUNDARY.ownsSeverity, false);
  assert.doesNotMatch(source, /executiveVisualState|severityScore|attentionLevel/);
});

test("11. relationship truth is not modified", () => {
  assert.equal(EXECUTIVE_SPATIAL_COMPOSITION_BOUNDARY.ownsRelationships, false);
  assert.equal(EXECUTIVE_SPATIAL_COMPOSITION_BOUNDARY.inventsRelationships, false);
  assert.doesNotMatch(source, /createEdge|inventRelation|sourceId.*targetId/);
});

test("12. unknown/extra object counts degrade safely", () => {
  const many: ExecutiveSpatialObjectInput[] = Array.from(
    { length: 14 },
    (_, index) =>
      Object.freeze({
        objectId: `obj-extra-${String(index).padStart(2, "0")}`,
        preferredPosition: Object.freeze({
          x: (index % 5) - 2,
          y: 0.1,
          z: (index % 3) - 1,
        }),
      }),
  );
  const result = resolveExecutiveSpatialComposition({ objects: many });
  assert.equal(result.objects.length, 14);
  assert.ok(result.objects.some((entry) => entry.slotId === "overflow"));
  for (const entry of result.objects) {
    const clamped = clampExecutiveSpatialVector(entry.position);
    assert.deepEqual(entry.position, clamped);
  }
});

test("13. single-object scenes remain valid", () => {
  const result = resolveExecutiveSpatialComposition({
    objects: [
      Object.freeze({
        objectId: "obj-solo",
        preferredPosition: Object.freeze({ x: 1, y: 0.2, z: 0.5 }),
      }),
    ],
  });
  assert.equal(result.objects.length, 1);
  assert.equal(result.objects[0]?.objectId, "obj-solo");
  assert.ok(Number.isFinite(result.objects[0]!.position.x));
  assert.deepEqual(result.reservedCenter, EXECUTIVE_SPATIAL_RESERVED_CENTER);
  assert.equal(hasExecutiveSpatialDepthVariation(result), true);
});

test("14. center remains strategically available and map helper works", () => {
  const result = resolveExecutiveSpatialComposition({
    objects: fixtureInputs(),
  });
  for (const entry of result.objects) {
    const dx = entry.position.x - EXECUTIVE_SPATIAL_RESERVED_CENTER.x;
    const dz = entry.position.z - EXECUTIVE_SPATIAL_RESERVED_CENTER.z;
    assert.ok(Math.hypot(dx, dz) > 0.55);
  }
  const map = buildExecutiveSpatialCompositionPositionMap(result);
  assert.equal(map.size, result.objects.length);
  assert.equal(verifyExecutiveSpatialComposition().ok, true);
  assert.equal(
    EXECUTIVE_SPATIAL_COMPOSITION_BOUNDARY.introducesFocusChoreography,
    false,
  );
  assert.doesNotMatch(source, /from\s+["']three["']/);
  assert.doesNotMatch(source, /@react-three\/fiber/);
});
