import assert from "node:assert/strict";
import test from "node:test";

import {
  normalizeConnectorIngressEnvelope,
  validateConnectorIngressBoundary,
} from "./connectorIngressBoundaries.ts";

test("connector ingress normalizes payloads before orchestration", () => {
  const envelope = normalizeConnectorIngressEnvelope({
    connectorId: "Supply Chain Connector",
    rawPayload: { supplier: "A", risk: "high" },
    receivedAt: 123,
    signals: [
      {
        id: "supplier-risk",
        layerId: "monitoring",
        severity: "critical",
        confidence: 0.92,
        relatedObjectIds: ["supplier"],
        title: "Supplier pressure",
        summary: "Supplier pressure requires monitoring.",
      },
    ],
  });

  assert.equal(envelope.connectorId, "supply_chain_connector");
  assert.equal(envelope.normalizedSignals.length, 1);
  assert.equal(envelope.boundaryRules.includes("no_direct_scene_mutation"), true);
  assert.equal(validateConnectorIngressBoundary(envelope).valid, true);
});

test("connector ingress falls back safely for missing connector id", () => {
  const envelope = normalizeConnectorIngressEnvelope({
    rawPayload: null,
  });

  assert.equal(envelope.connectorId, "unknown_connector");
  assert.equal(validateConnectorIngressBoundary(envelope).valid, false);
  assert.equal(envelope.warnings.length > 0, true);
});
