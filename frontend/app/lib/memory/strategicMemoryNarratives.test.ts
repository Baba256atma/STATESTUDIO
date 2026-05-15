import { test } from "node:test";
import * as assert from "node:assert/strict";

import {
  buildStrategicContinuityLine,
  buildStrategicMemoryTitle,
  describeStrategicMemoryRecord,
  describeStrategicMemoryState,
} from "./strategicMemoryNarratives.ts";
import type { StrategicMemoryRecord } from "./strategicMemoryTypes.ts";

const record: StrategicMemoryRecord = {
  id: "memory_supplier",
  category: "fragility",
  title: "Supplier fragility recurrence",
  summary: "Supplier fragility has recurred.",
  relatedObjectIds: ["supplier"],
  recurrenceCount: 3,
  firstObservedAt: 0,
  lastObservedAt: 3,
};

test("strategic memory narratives are executive and historical", () => {
  assert.equal(buildStrategicMemoryTitle({ category: "fragility", focus: "Supplier" }), "Supplier fragility recurrence");
  const summary = describeStrategicMemoryRecord(record);

  assert.ok(summary.includes("recurring operational pressure"));
  assert.ok(summary.includes("3 cycles"));
});

test("strategic memory state descriptions are stable", () => {
  assert.ok(describeStrategicMemoryState("persistent", record).includes("persistent"));
  assert.ok(describeStrategicMemoryState("stabilizing", record).includes("stabilizing"));
});

test("continuity line handles empty and populated memory", () => {
  assert.equal(buildStrategicContinuityLine([]), "No strategic memory pattern is available yet.");
  assert.ok(buildStrategicContinuityLine([record]).includes("Supplier"));
});
