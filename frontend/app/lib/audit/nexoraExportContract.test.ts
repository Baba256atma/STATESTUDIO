/**
 * B.15 — export bundle serialization.
 */

import test from "node:test";
import assert from "node:assert/strict";

import type { NexoraAuditRecord } from "./nexoraAuditContract.ts";
import {
  buildNexoraExportBundle,
  exportBundleStableSignature,
  serializeExportBundle,
} from "./nexoraExportContract.ts";
import type { NexoraReplaySnapshot } from "../../screens/nexoraReplaySnapshot.ts";

const minimalRecord: NexoraAuditRecord = {
  runId: "nr_test",
  timestamp: 100,
  sources: [],
  merge: { sourceCount: 1, successfulSourceCount: 1, mergedSignalCount: 1 },
  signals: { count: 1, topTypes: [] },
  scanner: {},
  trust: {},
};

const minimalSnapshot: NexoraReplaySnapshot = {
  runId: "nr_test",
  timestamp: 100,
  scene: { focusedObjectId: null, highlightedObjectIds: [], fragilityLevel: "low" },
  trust: { confidenceTier: "medium", summary: null },
  sources: { total: 1, successful: 1 },
};

test("serializeExportBundle is deterministic for same logical bundle", () => {
  const a = buildNexoraExportBundle({ record: minimalRecord, replaySnapshot: minimalSnapshot, exportedAt: 1 });
  const b = buildNexoraExportBundle({ record: minimalRecord, replaySnapshot: minimalSnapshot, exportedAt: 99 });
  assert.notEqual(serializeExportBundle(a), serializeExportBundle(b));
  assert.equal(exportBundleStableSignature(a), exportBundleStableSignature(b));
});
