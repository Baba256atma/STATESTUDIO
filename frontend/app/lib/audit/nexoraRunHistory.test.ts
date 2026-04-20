/**
 * B.15.c — run history localStorage behavior (mocked).
 */

import test from "node:test";
import assert from "node:assert/strict";

import type { NexoraAuditRecord } from "./nexoraAuditContract.ts";
import { appendNexoraRunHistory, clearNexoraRunHistory, loadNexoraRunHistory } from "./nexoraRunHistory.ts";
import type { NexoraReplaySnapshot } from "../../screens/nexoraReplaySnapshot.ts";

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

function entry(runId: string): import("./nexoraRunHistory.ts").NexoraRunHistoryEntry {
  const record: NexoraAuditRecord = {
    runId,
    timestamp: 1,
    sources: [],
    merge: { sourceCount: 1, successfulSourceCount: 1, mergedSignalCount: 0 },
    signals: { count: 0, topTypes: [] },
    scanner: {},
    trust: {},
  };
  const replay: NexoraReplaySnapshot = {
    runId,
    timestamp: 1,
    scene: { highlightedObjectIds: [], fragilityLevel: null },
    trust: {},
    sources: { total: 1, successful: 1 },
  };
  return { savedAt: Date.now(), record, replaySnapshot: replay };
}

test("append dedupes by runId and caps length", () => {
  installMockWindow();
  clearNexoraRunHistory();
  for (let i = 0; i < 25; i++) appendNexoraRunHistory(entry(`run_${i}`));
  const h = loadNexoraRunHistory();
  assert.ok(h.length <= 15);
  appendNexoraRunHistory(entry("run_5"));
  const h2 = loadNexoraRunHistory();
  assert.equal(h2[0].record.runId, "run_5");
});
