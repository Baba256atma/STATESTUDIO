import assert from "node:assert/strict";
import test from "node:test";

import { auditArchitectureBoundaries } from "./architectureBoundaryAudit.ts";
import { buildD2ProductionReadinessReport } from "./d2ProductionReadinessReport.ts";
import { evaluateFaultIsolationCoverage, listFaultIsolationRules } from "./faultIsolationRules.ts";
import {
  buildProductionLogSignature,
  shouldEmitProductionLog,
} from "./productionLoggingPolicy.ts";
import { buildProductionReadinessChecklist } from "./productionReadinessChecklist.ts";

test("architecture boundary audit is deterministic and non-blocking", () => {
  const first = auditArchitectureBoundaries();
  const second = auditArchitectureBoundaries();

  assert.deepEqual(first, second);
  assert.equal(first.some((warning) => warning.severity === "high"), false);
});

test("fault isolation covers key production domains", () => {
  const rules = listFaultIsolationRules();
  const coverage = evaluateFaultIsolationCoverage([
    "connector_ingress",
    "scene",
    "overlay",
    "panel",
    "executive_intelligence",
    "logging",
  ]);

  assert.equal(rules.length >= 5, true);
  assert.equal(coverage.covered, true);
});

test("production logging policy suppresses duplicate and dev-only production logs", () => {
  const signature = buildProductionLogSignature({
    eventName: "ExecutiveUX",
    channel: "executive_ux",
    payload: { focus: "supplier" },
  });

  assert.equal(
    shouldEmitProductionLog({
      channel: "executive_ux",
      isProduction: true,
      nextSignature: signature,
    }),
    false
  );
  assert.equal(
    shouldEmitProductionLog({
      channel: "production_safe_telemetry",
      isProduction: true,
      previousSignature: signature,
      nextSignature: signature,
    }),
    false
  );
});

test("production readiness checklist and D2 report are D3-ready without scene mutation", () => {
  const checklist = buildProductionReadinessChecklist();
  const report = buildD2ProductionReadinessReport();

  assert.equal(checklist.failCount, 0);
  assert.equal(checklist.ready, true);
  assert.equal(report.readyForD3, true);
  assert.equal(report.connectorReadiness, "ready");
  assert.equal(report.d3ReadinessNotes.some((note) => note.includes("Connector ingress")), true);
});
