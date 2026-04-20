import test from "node:test";
import assert from "node:assert/strict";

import type { NexoraAuditRecord } from "../lib/audit/nexoraAuditContract.ts";
import { buildNexoraReplaySnapshot } from "./nexoraReplaySnapshot.ts";
import { createInitialPipelineStatusUi } from "./nexoraPipelineStatus.ts";

test("buildNexoraReplaySnapshot omits decision when audit has none", () => {
  const audit: NexoraAuditRecord = {
    runId: "r1",
    timestamp: 50,
    sources: [],
    merge: { sourceCount: 2, successfulSourceCount: 1, mergedSignalCount: 3 },
    signals: { count: 3, topTypes: ["risk"] },
    scanner: { fragilityLevel: "high" },
    trust: { confidenceTier: "low", summary: "x" },
  };
  const snap = buildNexoraReplaySnapshot({
    audit,
    pipelineStatus: {
      ...createInitialPipelineStatusUi(),
      status: "ready",
      fragilityLevel: "high",
      confidenceTier: "low",
      signalsCount: 3,
    },
    focusedObjectId: "obj_a",
    highlightedObjectIds: ["obj_a", "obj_b", "obj_a"],
  });
  assert.equal(snap.decision, undefined);
  assert.deepEqual(snap.scene.highlightedObjectIds, ["obj_a", "obj_b"]);
  assert.equal(snap.scene.focusedObjectId, "obj_a");
  assert.equal(snap.sources.successful, 1);
});
