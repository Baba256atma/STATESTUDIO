/**
 * B.20 — execution outcome evaluation + store.
 */

import test from "node:test";
import assert from "node:assert/strict";

import { evaluateExecutionOutcome, normalizeOutcomeFragilityInput } from "./nexoraExecutionOutcome.ts";
import type { NexoraExecutionOutcome } from "./nexoraExecutionOutcome.ts";
import { loadExecutionOutcomes, saveExecutionOutcome } from "./nexoraExecutionStore.ts";

const store = new Map<string, string>();

function installMockWindow(): void {
  store.clear();
  (globalThis as unknown as { window: { localStorage: Storage } }).window = {
    localStorage: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
      clear: () => void store.clear(),
      key: () => null,
      length: 0,
    } as Storage,
  };
}

test("evaluateExecutionOutcome ranks and labels deterministically", () => {
  assert.deepEqual(evaluateExecutionOutcome("high", "low"), { score: 1, label: "better" });
  assert.deepEqual(evaluateExecutionOutcome("medium", "medium"), { score: 0, label: "same" });
  assert.deepEqual(evaluateExecutionOutcome("low", "high"), { score: -1, label: "worse" });
});

test("normalizeOutcomeFragilityInput accepts moderate", () => {
  assert.equal(normalizeOutcomeFragilityInput("MODERATE"), "medium");
});

test("saveExecutionOutcome dedupes by runId and caps", () => {
  installMockWindow();
  for (let i = 0; i < 35; i++) {
    const o: NexoraExecutionOutcome = {
      runId: `r${i}`,
      outcomeScore: 0,
      outcomeLabel: "same",
      recordedAt: i,
    };
    saveExecutionOutcome(o);
  }
  assert.ok(loadExecutionOutcomes().length <= 30);
  saveExecutionOutcome({
    runId: "r5",
    outcomeScore: 1,
    outcomeLabel: "better",
    recordedAt: 999,
  });
  assert.equal(loadExecutionOutcomes()[0]?.runId, "r5");
  assert.equal(loadExecutionOutcomes()[0]?.outcomeLabel, "better");
});
