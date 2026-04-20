/**
 * B.14 — audit builder smoke tests.
 */

import test from "node:test";
import assert from "node:assert/strict";

import { buildNexoraAuditRecord, buildNexoraAuditSignature } from "./nexoraAuditBuilder.ts";
import { createInitialPipelineStatusUi } from "./nexoraPipelineStatus.ts";
import { serializeAudit } from "../lib/audit/nexoraAuditContract.ts";

test("buildNexoraAuditRecord: multi-source + decision + trust", () => {
  const record = buildNexoraAuditRecord({
    multiSourceResult: {
      ok: true,
      errors: [],
      bundle: {
        sources: [
          { connector_id: "a", ok: true, bundle: null, errors: [], metadata: {} },
          { connector_id: "b", ok: false, bundle: null, errors: ["x"], metadata: {} },
        ],
        signals: [
          { id: "1", type: "risk", label: "L", description: "d", strength: 0.5, entities: [], source_id: "s" },
          { id: "2", type: "risk", label: "L2", description: "d2", strength: 0.4, entities: [], source_id: "s" },
        ],
        summary: "ok",
        warnings: [],
        merge_meta: {
          source_count: 2,
          successful_source_count: 1,
          merged_signal_count: 2,
          source_trust_summary: "a:high;b:low",
          source_weights: { a: 0.9, b: 0.5 },
        },
      },
    },
    pipelineStatus: {
      ...createInitialPipelineStatusUi(),
      status: "ready",
      source: "ingestion",
      signalsCount: 2,
      mappedObjectsCount: 1,
      fragilityLevel: "medium",
      summary: "S",
      insightLine: null,
      decisionPosture: "Hold",
      decisionTradeoff: "T",
      decisionNextMove: "N",
      decisionTone: "steady",
      updatedAt: 1_700_000_000_000,
      errorMessage: null,
      lastBridgeSource: "multi_source",
      multiSourceSourceCount: 2,
      multiSourceSuccessfulCount: 1,
      multiSourceMergedSignalCount: 2,
      confidenceTier: "medium",
      confidenceScore: 0.55,
      validationWarnings: ["Partial source failure — not all inputs contributed."],
      trustSummaryLine: "Partial source failure; treat the result cautiously.",
    },
    decisionContext: {
      posture: "Hold",
      tradeoff: "T",
      nextMove: "N",
      driverLabels: ["d1", "d2"],
    },
    domain: "retail",
  });
  assert.equal(record.sources.length, 2);
  assert.equal(record.merge.successfulSourceCount, 1);
  assert.equal(record.signals.topTypes[0], "risk");
  assert.ok(record.scanner.drivers?.includes("d1"));
  assert.equal(record.trust.confidenceTier, "medium");
  assert.equal(record.decision?.posture, "Hold");
  const json = serializeAudit(record);
  assert.ok(json.includes('"runId"'));
  assert.equal(buildNexoraAuditSignature(record), buildNexoraAuditSignature({ ...record }));
});

test("buildNexoraAuditRecord: omits decision when empty context", () => {
  const record = buildNexoraAuditRecord({
    pipelineStatus: {
      ...createInitialPipelineStatusUi(),
      status: "ready",
      source: "scanner",
      signalsCount: 1,
      mappedObjectsCount: 0,
      fragilityLevel: "low",
      summary: null,
      insightLine: null,
      decisionPosture: null,
      decisionTradeoff: null,
      decisionNextMove: null,
      decisionTone: null,
      updatedAt: 100,
      errorMessage: null,
      lastBridgeSource: "fragility_scan",
      multiSourceSourceCount: null,
      multiSourceSuccessfulCount: null,
      multiSourceMergedSignalCount: null,
      confidenceTier: null,
      confidenceScore: null,
      validationWarnings: [],
      trustSummaryLine: null,
    },
    decisionContext: null,
  });
  assert.equal(record.decision, undefined);
});
