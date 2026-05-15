import assert from "node:assert/strict";
import test from "node:test";

import { buildAsyncConnectorBatch, shouldRecomputeConnectorIntelligence } from "./asyncOrchestrationSafeguards.ts";
import { resolveConnectorDomainHints } from "./connectorDomainMapping.ts";
import { runConnectorIngressBoundary } from "./connectorIngressBoundary.ts";
import { getNexoraConnector, listNexoraConnectors } from "./nexoraLiveConnectorRegistry.ts";
import { buildD2ToD3BridgeReport } from "./d2ToD3BridgeReport.ts";
import { buildD3ConnectorReadinessChecklist } from "./d3ConnectorReadinessChecklist.ts";
import { normalizeExternalSignal, normalizeExternalSignals } from "./normalizeExternalSignals.ts";
import { dedupeExternalSignals, validateExternalSignal, validateExternalSignals } from "./validateExternalSignal.ts";

test("connector registry defines canonical disabled-by-default live connectors", () => {
  const connectors = listNexoraConnectors();

  assert.equal(connectors.some((connector) => connector.id === "jira" && connector.sourceType === "api"), true);
  assert.equal(getNexoraConnector("datadog")?.domainHints?.[0], "saas_devops");
  assert.equal(connectors.filter((connector) => connector.enabled && connector.id !== "manual_ingest").length, 0);
});

test("domain mapping resolves connector and explicit hints safely", () => {
  assert.deepEqual(resolveConnectorDomainHints({ connectorId: "jira" }), ["pmo"]);
  assert.deepEqual(resolveConnectorDomainHints({ connectorId: "unknown", domainHints: ["DevOps"] }), ["saas_devops"]);
  assert.deepEqual(resolveConnectorDomainHints({ connectorId: "" }), ["general"]);
});

test("external signals normalize deterministically across raw payload types", () => {
  const first = normalizeExternalSignal({
    connectorId: "datadog",
    rawSignal: {
      id: "incident-1",
      type: "outage",
      severity: "0.9",
      objectHints: ["api", "db"],
      timestamp: 100,
    },
  });
  const second = normalizeExternalSignal({
    connectorId: "datadog",
    rawSignal: {
      id: "incident-1",
      type: "outage",
      severity: "0.9",
      objectHints: ["api", "db"],
      timestamp: 100,
    },
  });

  assert.equal(first.signalType, "outage");
  assert.equal(first.severity, 0.9);
  assert.equal(first.ingestionSignature, second.ingestionSignature);
  assert.deepEqual(first.domainHints, ["saas_devops"]);
});

test("validation rejects stale signals and dedupes repeated ingestion", () => {
  const signals = normalizeExternalSignals({
    connectorId: "jira",
    rawSignals: [
      { id: "ticket-1", type: "ticket escalation", timestamp: 45 },
      { id: "ticket-1", type: "ticket escalation", timestamp: 45 },
      { id: "ticket-2", type: "delay", timestamp: 1 },
    ],
  });
  const validation = validateExternalSignals({ signals, now: 50, maxAgeMs: 20 });

  assert.equal(dedupeExternalSignals(signals).length, 2);
  assert.equal(validation.validSignals.length, 1);
  assert.equal(validation.rejectedSignals.length, 1);
  assert.equal(validation.warnings.some((warning) => warning.includes("Deduped")), true);
  assert.equal(validateExternalSignal({ signal: signals[0], now: 10 }).valid, true);
});

test("connector ingress boundary emits intelligence contracts without scene mutation", () => {
  const result = runConnectorIngressBoundary({
    connectorId: "erp",
    rawSignals: [{ id: "inventory-drop", type: "inventory drop", severity: 0.8, objectHints: ["inventory"], timestamp: 100 }],
    receivedAt: 100,
    now: 100,
  });

  assert.equal(result.success, true);
  assert.equal(result.envelope.boundaryRules.includes("no_direct_scene_mutation"), true);
  assert.equal(result.canonicalSignals.length, 1);
  assert.equal(result.canonicalSignals[0].overlay, undefined);
});

test("async safeguards batch bursts, stale signals, and duplicate signatures", () => {
  const signals = normalizeExternalSignals({
    connectorId: "datadog",
    rawSignals: [
      { id: "a", type: "outage", timestamp: 100 },
      { id: "b", type: "latency", timestamp: 90 },
      { id: "c", type: "error", timestamp: 1 },
    ],
  });
  const batch = buildAsyncConnectorBatch({
    signals,
    previousSignatures: [signals[0].ingestionSignature],
    now: 120,
    maxAgeMs: 50,
    maxBatchSize: 1,
  });

  assert.deepEqual(batch.signals.map((signal) => signal.id), ["b"]);
  assert.equal(batch.droppedSignalIds.includes("a"), true);
  assert.equal(batch.droppedSignalIds.includes("c"), true);
  assert.equal(shouldRecomputeConnectorIntelligence({ previousBatchId: null, nextBatch: batch }), true);
  assert.equal(shouldRecomputeConnectorIntelligence({ previousBatchId: batch.batchId, nextBatch: batch }), false);
});

test("D3 connector checklist and bridge report are ready but honest about non-goals", () => {
  const checklist = buildD3ConnectorReadinessChecklist();
  const report = buildD2ToD3BridgeReport();

  assert.equal(checklist.readyForD3, true);
  assert.equal(report.readyForD3, true);
  assert.equal(report.connectorReadiness, "ready");
  assert.equal(report.unresolvedIngestionRisks.some((risk) => risk.includes("not implemented in D2")), true);
});
