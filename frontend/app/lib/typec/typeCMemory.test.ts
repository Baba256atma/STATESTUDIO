import test from "node:test";
import assert from "node:assert/strict";

import {
  addTypeCMemoryEntry,
  buildTypeCMemoryEntry,
  clearTypeCMemory,
  createEmptyTypeCMemoryState,
  deriveTypeCLearningSignals,
  type TypeCMemoryEntry,
  type TypeCMemoryState,
} from "./typeCMemory.ts";
import type { TypeCExecutionState } from "./typeCExecutionState.ts";

function entry(overrides: Partial<TypeCMemoryEntry> = {}): TypeCMemoryEntry {
  return {
    id: "memory_1",
    scenarioId: "scenario_supply",
    decisionSummary: "Monitor supplier pressure.",
    riskLevel: "medium",
    outcome: "unknown",
    signalsObserved: ["Supplier delay risk"],
    timestamp: 1,
    ...overrides,
  };
}

function execution(overrides: Partial<TypeCExecutionState> = {}): TypeCExecutionState {
  return {
    scenarioId: "scenario_supply",
    status: "running",
    startedAt: 100,
    monitoredSignals: ["Supplier delay risk", "Inventory instability"],
    riskLevel: "high",
    ...overrides,
  };
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

test("addTypeCMemoryEntry adds memory entry", () => {
  const state = createEmptyTypeCMemoryState();
  const next = addTypeCMemoryEntry(state, entry());
  assert.equal(next.entries.length, 1);
  assert.equal(next.entries[0]?.scenarioId, "scenario_supply");
});

test("addTypeCMemoryEntry does not duplicate entries", () => {
  const state = addTypeCMemoryEntry(createEmptyTypeCMemoryState(), entry());
  const next = addTypeCMemoryEntry(state, entry());
  assert.equal(next.entries.length, 1);
});

test("addTypeCMemoryEntry caps memory size", () => {
  let state: TypeCMemoryState = createEmptyTypeCMemoryState();
  for (let index = 0; index < 25; index += 1) {
    state = addTypeCMemoryEntry(state, entry({ id: `memory_${index}`, timestamp: index }));
  }
  assert.equal(state.entries.length, 20);
  assert.equal(state.entries[0]?.id, "memory_24");
});

test("clearTypeCMemory resets entries", () => {
  const state = addTypeCMemoryEntry(createEmptyTypeCMemoryState(), entry());
  assert.equal(state.entries.length, 1);
  assert.deepEqual(clearTypeCMemory(), { entries: [] });
});

test("deriveTypeCLearningSignals detects repeated signals", () => {
  const state: TypeCMemoryState = {
    entries: [
      entry({ id: "a", signalsObserved: ["Supplier delay risk"] }),
      entry({ id: "b", signalsObserved: ["Supplier delay risk"] }),
    ],
  };
  const signals = deriveTypeCLearningSignals(state);
  assert.deepEqual(signals.repeatedRisks, ["Recurring Supplier delay risk detected"]);
});

test("deriveTypeCLearningSignals classifies stable patterns", () => {
  const state: TypeCMemoryState = {
    entries: [
      entry({ id: "a", outcome: "stable" }),
      entry({ id: "b", outcome: "stable" }),
      entry({ id: "c", outcome: "unknown" }),
    ],
  };
  assert.deepEqual(deriveTypeCLearningSignals(state).stablePatterns, [
    "Pattern shows consistent stability under similar conditions",
  ]);
});

test("deriveTypeCLearningSignals classifies unstable patterns", () => {
  const state: TypeCMemoryState = {
    entries: [
      entry({ id: "a", outcome: "unstable" }),
      entry({ id: "b", outcome: "unstable" }),
    ],
  };
  assert.deepEqual(deriveTypeCLearningSignals(state).unstablePatterns, [
    "System shows fragility under repeated execution",
  ]);
});

test("buildTypeCMemoryEntry derives outcome from risk", () => {
  const memory = buildTypeCMemoryEntry({
    executionState: execution({ riskLevel: "low" }),
    timestamp: 200,
  });
  assert.equal(memory?.outcome, "stable");
  assert.equal(memory?.timestamp, 200);
});

test("buildTypeCMemoryEntry returns null without scenario", () => {
  assert.equal(buildTypeCMemoryEntry({ executionState: execution({ scenarioId: "" }) }), null);
});

test("memory helpers do not mutate unrelated state", () => {
  const state = addTypeCMemoryEntry(createEmptyTypeCMemoryState(), entry());
  const before = clone(state);
  addTypeCMemoryEntry(state, entry({ id: "memory_2" }));
  deriveTypeCLearningSignals(state);
  assert.deepEqual(state, before);
});
