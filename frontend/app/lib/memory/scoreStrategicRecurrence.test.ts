import { test } from "node:test";
import * as assert from "node:assert/strict";

import {
  resolveStrategicMemoryState,
  scoreStrategicRecurrence,
} from "./scoreStrategicRecurrence.ts";
import type { StrategicMemoryRecord } from "./strategicMemoryTypes.ts";

const record: StrategicMemoryRecord = {
  id: "memory_supplier",
  category: "dependency",
  title: "Supplier dependency recurrence",
  summary: "Supplier dependency keeps recurring.",
  relatedObjectIds: ["supplier", "inventory"],
  severity: "critical",
  confidence: 0.88,
  recurrenceCount: 3,
  firstObservedAt: 1,
  lastObservedAt: 5,
  domainId: "supply_chain",
};

test("recurrence score is stable and clamped", () => {
  const first = scoreStrategicRecurrence(record);
  const second = scoreStrategicRecurrence(record);

  assert.deepEqual(second, first);
  assert.ok(first.recurrenceScore >= 0 && first.recurrenceScore <= 1);
  assert.equal(first.memoryState, "persistent");
  assert.equal(first.persistenceDuration, 4);
});

test("memory state resolves strategic lifecycle", () => {
  assert.equal(resolveStrategicMemoryState({ recurrenceCount: 1 }), "emerging");
  assert.equal(resolveStrategicMemoryState({ recurrenceCount: 3, severity: "high" }), "persistent");
  assert.equal(resolveStrategicMemoryState({ recurrenceCount: 2, improving: true }), "stabilizing");
  assert.equal(resolveStrategicMemoryState({ recurrenceCount: 2, severity: "low", confidence: 0.7 }), "monitoring");
});
