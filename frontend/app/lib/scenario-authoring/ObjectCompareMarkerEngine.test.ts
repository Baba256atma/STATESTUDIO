import test from "node:test";
import assert from "node:assert/strict";

import {
  buildObjectDifferenceProfile,
  C2_OBJECT_MARKERS_COMPLETE_TAG,
  generateObjectCompareMarkers,
  getObjectCompareMarkerEngineResult,
  OBJECT_COMPARE_MARKERS_DIAGNOSTIC,
  OBJECT_COMPARE_MARKERS_READY_DIAGNOSTIC,
  ObjectCompareMarkerEngine,
  resetObjectCompareMarkerEngineForTests,
  type ObjectDifferenceProfile,
} from "./ObjectCompareMarkerEngine.ts";

function objectDifference(
  objectId: string,
  objectHealthDelta: number,
  objectImpactDelta: number,
  position = Object.freeze({ x: 10, y: 20, z: 3 })
): ObjectDifferenceProfile {
  return buildObjectDifferenceProfile({
    differenceId: `diff:${objectId}`,
    comparisonId: "compare:objects",
    scenarioAId: "scenario-a",
    scenarioBId: "scenario-b",
    objectId,
    objectLabel: objectId,
    objectPosition: position,
    topologyFingerprint: "topology:v1",
    objectHealthDelta,
    objectImpactDelta,
    confidence: 88,
    summary: `${objectId} comparison marker`,
  });
}

test.beforeEach(() => {
  resetObjectCompareMarkerEngineForTests();
});

test("exports C2 object marker tag and diagnostics", () => {
  assert.equal(C2_OBJECT_MARKERS_COMPLETE_TAG, "[C2_OBJECT_MARKERS_COMPLETE]");
  assert.equal(OBJECT_COMPARE_MARKERS_DIAGNOSTIC, "[OBJECT_COMPARE_MARKERS]");
  assert.equal(OBJECT_COMPARE_MARKERS_READY_DIAGNOSTIC, "[OBJECT_COMPARE_MARKERS_READY]");
  assert.deepEqual(ObjectCompareMarkerEngine.diagnostics, [
    "[OBJECT_COMPARE_MARKERS]",
    "[OBJECT_COMPARE_MARKERS_READY]",
  ]);
});

test("generates improved declined and neutral visual-only object markers", () => {
  const result = generateObjectCompareMarkers({
    differences: [
      objectDifference("improved-object", 8, 2),
      objectDifference("declined-object", -5, -3),
      objectDifference("neutral-object", 4, -4),
    ],
  });

  assert.equal(result.markerCount, 3);
  assert.equal(result.improvedObjectCount, 1);
  assert.equal(result.declinedObjectCount, 1);
  assert.equal(result.neutralObjectCount, 1);
  assert.deepEqual(result.markers.map((marker) => marker.display), [
    "Improved Object",
    "Declined Object",
    "Neutral Object",
  ]);
  assert.equal(result.visualOnly, true);
  assert.equal(result.objectMovement, false);
  assert.equal(result.objectMutation, false);
  assert.equal(result.sceneMutation, false);
  assert.equal(result.topologyMutation, false);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.markers), true);
  assert.throws(() => {
    (result.markers as unknown as object[]).push({});
  }, TypeError);
});

test("preserves object positions and topology fingerprints", () => {
  const originalPosition = Object.freeze({ x: -14, y: 7, z: 2 });
  const difference = objectDifference("positioned-object", 3, 0, originalPosition);
  const before = JSON.stringify(difference);

  const result = generateObjectCompareMarkers({ differences: [difference] });
  const marker = result.markers[0];

  assert.deepEqual(marker?.position, originalPosition);
  assert.notEqual(marker?.position, originalPosition);
  assert.equal(marker?.topologyFingerprint, "topology:v1");
  assert.equal(marker?.objectMovement, false);
  assert.equal(marker?.topologyMutation, false);
  assert.equal(JSON.stringify(difference), before);
  assert.equal(getObjectCompareMarkerEngineResult(), result);
});
