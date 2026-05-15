import { test } from "node:test";
import * as assert from "node:assert/strict";

import {
  createStrategicMemoryStore,
  mergeStrategicMemoryRecords,
} from "./strategicMemoryStore.ts";
import type { StrategicMemoryRecord } from "./strategicMemoryTypes.ts";

const supplierMemory: StrategicMemoryRecord = {
  id: "memory_supplier",
  category: "dependency",
  title: "Supplier dependency recurrence",
  summary: "Supplier dependency keeps recurring.",
  relatedObjectIds: ["supplier"],
  severity: "high",
  confidence: 0.8,
  recurrenceCount: 1,
  firstObservedAt: 1,
  lastObservedAt: 1,
};

test("strategic memory store merges duplicate records", () => {
  const store = createStrategicMemoryStore();
  store.addRecords([supplierMemory], 1);
  const state = store.addRecords([{ ...supplierMemory, lastObservedAt: 3, relatedObjectIds: ["supplier", "inventory"] }], 3);

  assert.equal(state.records.length, 1);
  assert.equal(state.records[0].recurrenceCount, 2);
  assert.deepEqual(state.records[0].relatedObjectIds, ["supplier", "inventory"]);
  assert.equal(state.updatedAt, 3);
});

test("strategic memory store clear resets session memory", () => {
  const store = createStrategicMemoryStore();
  store.addRecords([supplierMemory], 1);
  const cleared = store.clear();

  assert.deepEqual(cleared.records, []);
  assert.equal(cleared.updatedAt, 0);
});

test("mergeStrategicMemoryRecords is deterministic and capped", () => {
  const incoming = Array.from({ length: 40 }, (_, index) => ({
    ...supplierMemory,
    id: `memory_${index}`,
    title: `Memory ${index}`,
    relatedObjectIds: [`object_${index}`],
    lastObservedAt: index,
  }));
  const merged = mergeStrategicMemoryRecords({ incoming, limit: 10 });

  assert.equal(merged.length, 10);
  assert.deepEqual(merged, mergeStrategicMemoryRecords({ incoming, limit: 10 }));
});
