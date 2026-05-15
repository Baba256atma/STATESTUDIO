import assert from "node:assert/strict";
import test from "node:test";

import {
  listD2ValidationRegistry,
  validateD2RegistryCoverage,
} from "./d2ValidationRegistry.ts";
import { evaluateD3LaunchGate } from "./d3LaunchGate.ts";
import { buildFinalD2CertificationReport } from "./finalD2CertificationReport.ts";
import { validateTypeCIntegrity } from "./typeCIntegrityValidation.ts";

test("D2 validation registry covers all final certification categories", () => {
  const registry = listD2ValidationRegistry();
  const coverage = validateD2RegistryCoverage();

  assert.equal(registry.length >= 12, true);
  assert.equal(coverage.valid, true);
  assert.deepEqual(coverage.missingCategories, []);
  assert.equal(registry.every((entry) => entry.requiredForD3), true);
});

test("Type-C integrity validates operating philosophy and harmonization", () => {
  const integrity = validateTypeCIntegrity();

  assert.equal(integrity.valid, true);
  assert.equal(integrity.dimensions.calm_intelligence, "pass");
  assert.equal(integrity.dimensions.overlay_based_architecture, "pass");
  assert.deepEqual(integrity.warnings, []);
});

test("final D2 certification report approves D3 launch readiness", () => {
  const report = buildFinalD2CertificationReport();

  assert.equal(report.status, "READY");
  assert.equal(report.d3LaunchReadiness, true);
  assert.equal(report.typeCIntegrity, "preserved");
  assert.equal(report.connectorReadiness, "ready");
  assert.equal(report.productionConfidence, 100);
});

test("D3 launch gate passes only when certification conditions are met", () => {
  const gate = evaluateD3LaunchGate();

  assert.equal(gate.approved, true);
  assert.deepEqual(gate.blockers, []);
  assert.equal(Object.values(gate.conditions).every(Boolean), true);
});
