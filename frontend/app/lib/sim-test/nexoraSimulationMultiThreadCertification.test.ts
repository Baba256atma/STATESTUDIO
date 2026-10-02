/** Preserves the immutable pre-FIX SIM-TEST:9 blocking evidence. */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

type BlockingEvidence = {
  readonly phase: string;
  readonly status: string;
  readonly summary: { readonly managerTurns: number; readonly replayMismatches: number };
  readonly blocker: {
    readonly id: string;
    readonly severity: string;
    readonly canonicalSubjectId: string;
    readonly l1SubjectId: string;
    readonly stageSubjectId: string;
    readonly advisorSubjectId: string;
    readonly decisionId: string;
    readonly executionId: string;
  };
  readonly counts: {
    readonly productS1: number;
    readonly productS2: number;
    readonly leakHits: number;
  };
  readonly deterministicReplay: {
    readonly first: string;
    readonly second: string;
    readonly matched: boolean;
  };
  readonly architecture: {
    readonly productionFilesChanged: number;
  };
};

test("SIM-TEST:9 preserves the original deterministic blocking evidence", () => {
  const evidenceUrl = new URL(
    "../../../artifacts/sim-test/SIM-TEST-9/blocking-run.json",
    import.meta.url,
  );
  const evidence = JSON.parse(readFileSync(evidenceUrl, "utf8")) as BlockingEvidence;

  assert.equal(evidence.phase, "NPA-T SIM-TEST:9");
  assert.equal(evidence.status, "NOT CERTIFIED");
  assert.equal(evidence.summary.managerTurns, 8);
  assert.equal(evidence.summary.replayMismatches, 0);
  assert.deepEqual(evidence.deterministicReplay, {
    first: "fnv1a32:61197640",
    second: "fnv1a32:61197640",
    matched: true,
  });
  assert.equal(evidence.blocker.id, "ST9-S1-WRONG-EXECUTION-BINDING");
  assert.equal(evidence.blocker.severity, "S1");
  assert.equal(evidence.blocker.canonicalSubjectId, "obj-delivery");
  assert.equal(evidence.blocker.l1SubjectId, "obj-delivery");
  assert.equal(evidence.blocker.stageSubjectId, "obj-delivery");
  assert.equal(evidence.blocker.advisorSubjectId, "obj-delivery");
  assert.equal(evidence.blocker.decisionId, "cc10:decision:cc9:scenario:do-nothing:do-nothing:v1");
  assert.equal(evidence.blocker.executionId, "execution-cc10:decision:cc9:scenario:do-nothing:do-nothing:v1");
  assert.equal(evidence.counts.productS1, 1);
  assert.equal(evidence.counts.productS2, 1);
  assert.equal(evidence.counts.leakHits, 0);
  assert.equal(evidence.architecture.productionFilesChanged, 0);
});
