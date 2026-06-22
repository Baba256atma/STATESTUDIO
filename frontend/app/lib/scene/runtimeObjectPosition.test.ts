import test from "node:test";
import assert from "node:assert/strict";

import type { SceneObject } from "../../sceneTypes.ts";
import { bindTopologyToSceneObjects } from "./topology/topologySceneBinding.ts";
import { buildTopologyRuntimeLayoutPositions } from "./topology/topologyScenePositioning.ts";
import { resetRuntimeObjectPositionDevLogsForTests } from "./runtimeObjectPositionDevLog.ts";
import { resetRelationshipPositionCacheDevLogsForTests } from "./relationshipPositionCacheDevLog.ts";
import {
  buildRuntimeObjectPositionLookupCache,
  buildRuntimeObjectPositionLookupSignature,
  getRuntimeObjectPositionFromLookup,
  resolveRuntimeObjectPosition,
  resolveRuntimeObjectPositionWithLookup,
} from "./runtimeObjectPosition.ts";

test.beforeEach(() => {
  resetRuntimeObjectPositionDevLogsForTests();
  resetRelationshipPositionCacheDevLogsForTests();
});

test("resolveRuntimeObjectPosition prefers topology runtime layout positions", () => {
  const objects: SceneObject[] = [
    { id: "buf-1", name: "Capacity Buffer", label: "Capacity Buffer", position: [0, 0, 0] },
    { id: "sat-a", label: "Sat A", position: [9, 0, 9] },
  ];
  const binding = bindTopologyToSceneObjects({ sceneObjects: objects, topologyMode: "flow" });
  const topologyRuntimeLayoutPositions = buildTopologyRuntimeLayoutPositions({
    sceneObjects: objects,
    binding,
  });
  assert.ok(topologyRuntimeLayoutPositions);

  const resolved = resolveRuntimeObjectPosition({
    objectId: "Capacity Buffer",
    sceneObjects: objects,
    topologyRuntimeLayoutPositions,
    logProvider: false,
  });

  assert.equal(resolved.provider, "topologyRuntime.position");
  assert.deepEqual(resolved.position, {
    x: topologyRuntimeLayoutPositions["buf-1"]![0],
    y: topologyRuntimeLayoutPositions["buf-1"]![1],
    z: topologyRuntimeLayoutPositions["buf-1"]![2],
  });
});

test("resolveRuntimeObjectPosition falls back to scene JSON when runtime layout missing", () => {
  const objects: SceneObject[] = [{ id: "legacy-a", position: [2, 3, 4] }];
  const resolved = resolveRuntimeObjectPosition({
    objectId: "legacy-a",
    sceneObjects: objects,
    logProvider: false,
  });
  assert.equal(resolved.provider, "sceneObject.position");
  assert.deepEqual(resolved.position, { x: 2, y: 3, z: 4 });
});

test("resolveRuntimeObjectPosition uses layoutPositions when topology map absent", () => {
  const objects: SceneObject[] = [{ id: "obj-a", position: [1, 1, 1] }];
  const resolved = resolveRuntimeObjectPosition({
    objectId: "obj-a",
    sceneObjects: objects,
    layoutPositions: { "obj-a": [5, 6, 7] },
    logProvider: false,
  });
  assert.equal(resolved.provider, "layoutEngine.position");
  assert.deepEqual(resolved.position, { x: 5, y: 6, z: 7 });
});

test("buildRuntimeObjectPositionLookupCache indexes object aliases for O(1) lookup", () => {
  const objects: SceneObject[] = [
    {
      id: "draft_revenue_1",
      name: "Revenue",
      label: "Revenue",
      position: [1, 0, 2],
    },
  ];
  const cache = buildRuntimeObjectPositionLookupCache({
    sceneObjects: objects,
    logBuilt: false,
  });

  assert.equal(cache.sceneObjectCount, 1);
  assert.ok(cache.lookup.get("draft_revenue_1"));
  assert.ok(cache.lookup.get("Revenue"));
  assert.deepEqual(getRuntimeObjectPositionFromLookup(cache, "draft_revenue_1")?.position, {
    x: 1,
    y: 0,
    z: 2,
  });
});

test("resolveRuntimeObjectPositionWithLookup returns cached positions without rescanning", () => {
  const objects: SceneObject[] = [
    { id: "source-a", position: [0, 0, 0] },
    { id: "target-b", position: [4, 0, 4] },
  ];
  const cache = buildRuntimeObjectPositionLookupCache({
    sceneObjects: objects,
    logBuilt: false,
  });

  const direct = resolveRuntimeObjectPosition({
    objectId: "target-b",
    sceneObjects: objects,
    logProvider: false,
  });
  const cached = resolveRuntimeObjectPositionWithLookup({
    objectId: "target-b",
    sceneObjects: objects,
    positionLookup: cache,
    logProvider: false,
  });

  assert.deepEqual(cached.position, direct.position);
  assert.equal(cached.provider, direct.provider);
});

test("buildRuntimeObjectPositionLookupSignature changes when object positions change", () => {
  const objectsA: SceneObject[] = [{ id: "obj-a", position: [1, 0, 0] }];
  const objectsB: SceneObject[] = [{ id: "obj-a", position: [2, 0, 0] }];
  const signatureA = buildRuntimeObjectPositionLookupSignature(objectsA);
  const signatureB = buildRuntimeObjectPositionLookupSignature(objectsB);
  assert.notEqual(signatureA, signatureB);
});

test("resolveRuntimeObjectPositionWithLookup falls back when cache misses external ids", () => {
  const objects: SceneObject[] = [{ id: "obj-a", position: [1, 2, 3] }];
  const cache = buildRuntimeObjectPositionLookupCache({
    sceneObjects: objects,
    logBuilt: false,
  });
  const fallback = resolveRuntimeObjectPositionWithLookup({
    objectId: "missing-relationship-endpoint",
    sceneObjects: objects,
    positionLookup: cache,
    logProvider: false,
  });
  const direct = resolveRuntimeObjectPosition({
    objectId: "missing-relationship-endpoint",
    sceneObjects: objects,
    logProvider: false,
  });
  assert.deepEqual(fallback.position, direct.position);
});
