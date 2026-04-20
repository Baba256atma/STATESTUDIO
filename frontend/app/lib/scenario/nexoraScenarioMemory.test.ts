/**
 * B.19 — Scenario memory store + analyzer (deterministic, localStorage mocked).
 */

import test from "node:test";
import assert from "node:assert/strict";

import type { NexoraAuditRecord } from "../audit/nexoraAuditContract.ts";
import {
  analyzeScenarioMemory,
  appendScenarioMemory,
  clearScenarioMemory,
  fingerprintScenarioMemory,
  loadScenarioMemory,
  resolveNexoraB18WithMemory,
  type NexoraScenarioMemoryEntry,
} from "./nexoraScenarioMemory.ts";

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

function memEntry(partial: Partial<NexoraScenarioMemoryEntry> & Pick<NexoraScenarioMemoryEntry, "runId">): NexoraScenarioMemoryEntry {
  return {
    runId: partial.runId,
    timestamp: partial.timestamp ?? 1,
    fragilityLevel: partial.fragilityLevel,
    confidenceTier: partial.confidenceTier,
    decisionPosture: partial.decisionPosture,
    decisionTradeoff: partial.decisionTradeoff,
    decisionNextMove: partial.decisionNextMove,
    recommendedOptionId: partial.recommendedOptionId,
  };
}

function audit(runId: string, frag: string, posture?: string): NexoraAuditRecord {
  return {
    runId,
    timestamp: 10,
    sources: [],
    merge: { sourceCount: 1, successfulSourceCount: 1, mergedSignalCount: 1 },
    signals: { count: 1, topTypes: [] },
    scanner: { fragilityLevel: frag, drivers: ["d"] },
    trust: { confidenceTier: "medium", summary: "s" },
    decision: posture ? { posture } : undefined,
  };
}

test("append dedupes by runId and enforces max 20", () => {
  installMockWindow();
  clearScenarioMemory();
  for (let i = 0; i < 25; i++) {
    appendScenarioMemory(memEntry({ runId: `r${i}`, timestamp: i, recommendedOptionId: "balanced" }));
  }
  assert.ok(loadScenarioMemory().length <= 20);
  appendScenarioMemory(memEntry({ runId: "r5", timestamp: 99, recommendedOptionId: "aggressive" }));
  const h = loadScenarioMemory();
  assert.equal(h[0]?.runId, "r5");
  assert.equal(h[0]?.recommendedOptionId, "aggressive");
});

test("analyzeScenarioMemory: similarRuns, dominant option, deterministic", () => {
  const memory: NexoraScenarioMemoryEntry[] = [
    memEntry({ runId: "a", fragilityLevel: "medium", decisionPosture: "Hold", recommendedOptionId: "balanced", timestamp: 1 }),
    memEntry({ runId: "b", fragilityLevel: "medium", decisionPosture: "Hold", recommendedOptionId: "balanced", timestamp: 2 }),
    memEntry({ runId: "c", fragilityLevel: "high", decisionPosture: "Pivot", recommendedOptionId: "conservative", timestamp: 3 }),
  ];
  const cur = audit("current", "medium", "Hold");
  const i1 = analyzeScenarioMemory(memory, cur);
  const i2 = analyzeScenarioMemory(memory, cur);
  assert.deepEqual(i1, i2);
  assert.equal(i1.similarRuns, 2);
  assert.equal(i1.repeatedDecision, true);
  assert.equal(i1.dominantRecommendedOption, "balanced");
  assert.ok(i1.optionSeenCounts.balanced >= 2);
});

test("fingerprintScenarioMemory is deterministic", () => {
  const memory: NexoraScenarioMemoryEntry[] = [
    memEntry({ runId: "x", timestamp: 5, recommendedOptionId: "balanced" }),
    memEntry({ runId: "y", timestamp: 6, recommendedOptionId: "conservative" }),
  ];
  assert.equal(fingerprintScenarioMemory(memory), fingerprintScenarioMemory(memory));
});

test("resolveNexoraB18WithMemory includes memory suffix in signature", () => {
  const memory: NexoraScenarioMemoryEntry[] = [memEntry({ runId: "z", timestamp: 1, recommendedOptionId: "balanced" })];
  const a = audit("run-1", "medium", "p");
  const r1 = resolveNexoraB18WithMemory({
    audit: a,
    trust: { confidenceTier: "medium", summary: null },
    memory,
  });
  const r2 = resolveNexoraB18WithMemory({
    audit: a,
    trust: { confidenceTier: "medium", summary: null },
    memory: [],
  });
  assert.ok(r1.signature.includes("|m"));
  assert.notEqual(r1.signature, r2.signature);
});
