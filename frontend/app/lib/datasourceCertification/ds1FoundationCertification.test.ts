import assert from "node:assert/strict";
import test from "node:test";

import {
  DS1_FOUNDATION_CERTIFICATION_TAGS,
  DS1_FOUNDATION_CERTIFICATION_VERSION,
  DS1_FOUNDATION_FORBIDDEN_PATTERNS,
  DS1_FOUNDATION_FREEZE_TAGS,
  DS1_FOUNDATION_LAYER_CHAIN,
  DS1_FOUNDATION_MINIMUM_OVERALL_SCORE,
  DS1_FOUNDATION_MUST_NOT_OWN,
  DS1_FOUNDATION_SELF_MANIFEST,
  computeDs1FoundationOverallScore,
  meetsDs1FoundationMinimumScore,
  validateEbdsAdapterIntegration,
  validateEbdsBklIntegration,
  validateFoundationWorkspaceIsolation,
  validateIdscDssIntegration,
  validateIdscMwiIntegration,
  validateMwiDssIntegration,
} from "./ds1FoundationCertificationContract.ts";
import {
  isDs1FoundationFrozen,
  runDs1FoundationAnalysis,
  runDs1FoundationCertification,
} from "./ds1FoundationCertification.ts";
import {
  getDs1FoundationDiagnosticsLog,
  getDs1FoundationEvents,
  recordDs1FoundationEvent,
  resetDs1FoundationDiagnosticsForTests,
} from "./ds1FoundationCertificationDiagnostics.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

test.beforeEach(() => {
  resetDs1FoundationDiagnosticsForTests();
});

test("exports foundation certification version, layer chain, and tags", () => {
  assert.equal(DS1_FOUNDATION_CERTIFICATION_VERSION, "PHASE-2/DS1:7");
  assert.equal(DS1_FOUNDATION_LAYER_CHAIN.length, 6);
  assert.ok(DS1_FOUNDATION_CERTIFICATION_TAGS.includes("[DS17_FOUNDATION_CERTIFICATION]"));
});

test("validates self manifest and rejects forbidden paths", () => {
  const validation = validateStageManifest(DS1_FOUNDATION_SELF_MANIFEST);
  assert.equal(validation.valid, true);

  for (const filePath of [
    "frontend/app/lib/parser/ParserEngine.ts",
    "frontend/app/lib/sync/SynchronizationEngine.ts",
    "frontend/app/lib/data-sources/dataSourceRegistryRuntime.ts",
    "frontend/app/components/wizard/ManageWizardPanel.tsx",
  ]) {
    const decision = evaluateStageFileBoundary({
      filePath,
      allowedFiles: DS1_FOUNDATION_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: DS1_FOUNDATION_FORBIDDEN_PATTERNS,
    });
    assert.equal(decision.allowed, false, filePath);
  }
});

test("validates cross-layer integration probes", () => {
  assert.equal(validateEbdsAdapterIntegration().valid, true);
  assert.equal(validateEbdsBklIntegration().valid, true);
  assert.equal(validateIdscMwiIntegration().valid, true);
  assert.equal(validateIdscDssIntegration().valid, true);
  assert.equal(validateMwiDssIntegration().valid, true);
  assert.equal(validateFoundationWorkspaceIsolation().valid, true);
});

test("documents MUST NOT OWN exclusions", () => {
  assert.ok(DS1_FOUNDATION_MUST_NOT_OWN.includes("parsing"));
  assert.ok(DS1_FOUNDATION_MUST_NOT_OWN.includes("registry_mutation"));
  assert.ok(DS1_FOUNDATION_MUST_NOT_OWN.includes("upload_execution"));
});

test("records foundation diagnostic lifecycle events", () => {
  recordDs1FoundationEvent({ type: "FoundationCertificationStarted" });
  recordDs1FoundationEvent({ type: "LayerCertificationStarted", layerId: "DS1:1" });
  assert.equal(getDs1FoundationEvents().length, 2);
});

test("computeDs1FoundationOverallScore meets minimum when dimensions are strong", () => {
  const overall = computeDs1FoundationOverallScore({
    architecture: 100,
    maintainability: 98,
    regressionSafety: 99,
    scalability: 96,
    certificationReadiness: 100,
  });
  assert.ok(overall >= DS1_FOUNDATION_MINIMUM_OVERALL_SCORE);
  assert.equal(meetsDs1FoundationMinimumScore(overall), true);
});

test("delegated layer chain produces six layer results", () => {
  const result = runDs1FoundationCertification();
  assert.equal(result.layerResults.length, 6);
  assert.equal(result.layerResults[0]?.layerId, "DS1:1");
  assert.equal(result.layerResults[5]?.layerId, "DS1:6");
});

test("foundation certification passes all gates", () => {
  const result = runDs1FoundationCertification();
  assert.equal(result.certified, true);
  assert.ok(result.scoreReport.meetsMinimum);
  assert.ok(result.scoreReport.overall >= DS1_FOUNDATION_MINIMUM_OVERALL_SCORE);
  assert.ok(result.checks.every((entry) => entry.passed));
  assert.equal(result.freezeReport.allLayersFrozen, true);
  assert.equal(result.failureReport, null);
  assert.ok(getDs1FoundationDiagnosticsLog().length > 0);
});

test("integration gates I1 through I8 are present and passing", () => {
  const result = runDs1FoundationCertification();
  for (const gateId of ["I1", "I2", "I3", "I4", "I5", "I6", "I7", "I8"]) {
    const gate = result.checks.find((entry) => entry.id === gateId);
    assert.ok(gate, gateId);
    assert.equal(gate.passed, true, gateId);
  }
});

test("foundation analysis freezes contract on pass", () => {
  const result = runDs1FoundationAnalysis();
  assert.equal(result.certified, true);
  assert.equal(isDs1FoundationFrozen(), true);
  assert.ok(result.scoreReport.overall >= DS1_FOUNDATION_MINIMUM_OVERALL_SCORE);
  for (const tag of DS1_FOUNDATION_FREEZE_TAGS) {
    assert.ok(result.tags.includes(tag));
  }
});
