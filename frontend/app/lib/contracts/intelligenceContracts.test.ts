import assert from "node:assert/strict";
import test from "node:test";

import {
  buildIntelligenceContractEnvelope,
  normalizeIntelligenceSummaryContract,
  validateIntelligenceContractEnvelope,
} from "./intelligenceContracts.ts";

test("normalizes intelligence summaries into bounded production contracts", () => {
  const summary = normalizeIntelligenceSummaryContract({
    title: "Supplier risk",
    summary: "Supplier will definitely fail unless inventory changes.",
    severity: "urgent",
    confidence: 3,
    relatedObjectIds: ["supplier", "supplier", "inventory"],
  });

  assert.equal(summary.severity, "high");
  assert.equal(summary.confidence, 1);
  assert.equal(summary.summary.includes("will definitely"), false);
  assert.deepEqual(summary.relatedObjectIds, ["supplier", "inventory"]);
});

test("builds overlay metadata as derived-only and non-mutating", () => {
  const envelope = buildIntelligenceContractEnvelope({
    id: "supplier-alert",
    sourceKind: "connector",
    layerId: "alerts",
    severity: "critical",
    confidence: 0.86,
    relatedObjectIds: ["supplier"],
    overlayId: "supplier-alert-overlay",
  });

  assert.equal(envelope.version, "intelligence-contract-v1");
  assert.equal(envelope.overlay?.derivedOnly, true);
  assert.equal(envelope.overlay?.mutatesScene, false);
  assert.equal(validateIntelligenceContractEnvelope(envelope).valid, true);
});

test("validation rejects malformed intelligence envelopes without throwing", () => {
  const result = validateIntelligenceContractEnvelope({
    version: "bad",
    confidence: 2,
    overlay: { derivedOnly: false, mutatesScene: true },
  });

  assert.equal(result.valid, false);
  assert.equal(result.warnings.length >= 3, true);
});
