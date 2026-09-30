import assert from "node:assert/strict";
import test from "node:test";

import { SIM_TEST_2_INGESTION_JOURNEYS } from "./nexoraSimulationIngestionJourneys.ts";
import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";

const reports = SIM_TEST_2_INGESTION_JOURNEYS.map((journey, index) =>
  runNexoraSimulationTestJourney({ journey, runId: `sim-test-2-fix1-${index}` }),
);
const manufacturing = reports[0]!;
const logistics = reports[2]!;
const service = reports[3]!;

function hasTrace(report: (typeof reports)[number], trace: string): boolean {
  return report.findings.some((finding) => finding.traceReferences.includes(trace));
}

test("S1-01 — manufacturing out-of-scope CRM observation is not a Data Reality publication failure", () => {
  assert.ok(manufacturing.checkpoints.some((checkpoint) =>
    checkpoint.operatorRecordIds.some((id) => id.includes(":requested_quantity:")),
  ));
  assert.equal(manufacturing.ingestion!.files.some((file) => file.sourceType === "CRM"), false);
  assert.equal(hasTrace(manufacturing, "m:bc:requested_quantity"), false);
});

test("S1-02 — logistics disabled Production source is not an Operator observation failure", () => {
  assert.equal(logistics.checkpoints.some((checkpoint) =>
    checkpoint.operatorRecordIds.some((id) => id.includes(":CAP_AV:")),
  ), false);
  assert.equal(logistics.ingestion!.files.some((file) => file.sourceType === "PRODUCTION"), false);
  assert.equal(hasTrace(logistics, "m:ab:CAP_AV"), false);
  assert.equal(hasTrace(logistics, "m:ab:produced_quantity"), false);
});

test("S1-03 — logistics out-of-scope CRM observation is not a Data Reality publication failure", () => {
  assert.ok(logistics.checkpoints.some((checkpoint) =>
    checkpoint.operatorRecordIds.some((id) => id.includes(":requested_quantity:")),
  ));
  assert.equal(logistics.ingestion!.files.some((file) => file.sourceType === "CRM"), false);
  assert.equal(hasTrace(logistics, "m:bc:requested_quantity"), false);
});

test("S1-04 — service disabled Production/PMO sources are not Operator observation failures", () => {
  assert.equal(service.checkpoints.some((checkpoint) =>
    checkpoint.operatorRecordIds.some((id) => id.includes(":produced_quantity:")),
  ), false);
  assert.equal(service.ingestion!.files.some((file) =>
    file.sourceType === "PRODUCTION" || file.sourceType === "PMO",
  ), false);
  assert.equal(hasTrace(service, "m:ab:produced_quantity"), false);
  assert.equal(hasTrace(service, "m:ab:actual_progress"), false);
  assert.equal(hasTrace(service, "m:ab:resource_usage"), false);
});

test("S1-05 — service out-of-scope ERP observation is not a Data Reality publication failure", () => {
  assert.ok(service.checkpoints.some((checkpoint) =>
    checkpoint.operatorRecordIds.some((id) => id.includes(":orders_received:")),
  ));
  assert.equal(service.ingestion!.files.some((file) => file.sourceType === "ERP"), false);
  assert.equal(hasTrace(service, "m:bc:orders_received"), false);
});

test("S1-06 — explicitly negated causal language is not an Advisor overclaim", () => {
  const evidenceTurn = manufacturing.checkpoints.find((checkpoint) =>
    checkpoint.managerTurn === 3 && checkpoint.kind === "NEXORA_TURN_COMPLETED",
  );
  assert.match(evidenceTurn?.nexoraResponse ?? "", /not a confirmed cause/i);
  assert.match(evidenceTurn?.nexoraResponse ?? "", /not enough evidence/i);
  assert.equal(hasTrace(manufacturing, "m:causal:3"), false);
});

test("FIX1 zero-unresolved gate — exact journeys have no S0, S1, or harness failure", () => {
  assert.ok(reports.every((report) => report.harnessStatus === "PASS"));
  assert.ok(reports.every((report) => report.findingCounts.S0 === 0));
  assert.ok(reports.every((report) => report.findingCounts.S1 === 0));
});
