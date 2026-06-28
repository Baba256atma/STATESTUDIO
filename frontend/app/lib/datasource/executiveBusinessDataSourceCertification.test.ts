import assert from "node:assert/strict";
import test from "node:test";

import {
  EXECUTIVE_BUSINESS_DATA_SOURCE_CATEGORIES,
  EXECUTIVE_BUSINESS_DATA_SOURCE_FORBIDDEN_PATTERNS,
  EXECUTIVE_BUSINESS_DATA_SOURCE_FREEZE_TAGS,
  EXECUTIVE_BUSINESS_DATA_SOURCE_LIFECYCLE_STATES,
  EXECUTIVE_BUSINESS_DATA_SOURCE_SELF_MANIFEST,
  EXECUTIVE_BUSINESS_DATA_SOURCE_TAGS,
  EXECUTIVE_BUSINESS_DATA_SOURCE_VERSION,
  buildExecutiveBusinessDataSourceOwnershipContract,
  computeExecutiveBusinessDataSourceOverallScore,
  meetsExecutiveBusinessDataSourceMinimumScore,
  resolveExecutiveBusinessDataSourceExample,
  validateExecutiveBusinessDataSourceOwnership,
  validateExecutiveBusinessDataSourceRecord,
} from "./executiveBusinessDataSourceContract.ts";
import {
  isExecutiveBusinessDataSourceFrozen,
  resetExecutiveBusinessDataSourceFreezeForTests,
  runExecutiveBusinessDataSourceAnalysis,
  runExecutiveBusinessDataSourceCertification,
} from "./executiveBusinessDataSourceCertification.ts";
import {
  getExecutiveBusinessDataSourceDiagnosticsLog,
  getExecutiveBusinessDataSourceEvents,
  recordExecutiveBusinessDataSourceEvent,
  resetExecutiveBusinessDataSourceDiagnosticsForTests,
} from "./executiveBusinessDataSourceDiagnostics.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { STAGE_MINIMUM_OVERALL_SCORE } from "../stage/stageArchitectureContract.ts";

test.beforeEach(() => {
  resetExecutiveBusinessDataSourceDiagnosticsForTests();
  resetExecutiveBusinessDataSourceFreezeForTests();
});

test("exports executive business data source version, categories, and tags", () => {
  assert.equal(EXECUTIVE_BUSINESS_DATA_SOURCE_VERSION, "PHASE-2/DS1:1");
  assert.equal(EXECUTIVE_BUSINESS_DATA_SOURCE_CATEGORIES.length, 8);
  assert.ok(EXECUTIVE_BUSINESS_DATA_SOURCE_TAGS.includes("[DS11_BUSINESS_CONTRACT]"));
  assert.equal(EXECUTIVE_BUSINESS_DATA_SOURCE_LIFECYCLE_STATES.length, 8);
});

test("validates self manifest and rejects forbidden runtime paths", () => {
  const validation = validateStageManifest(EXECUTIVE_BUSINESS_DATA_SOURCE_SELF_MANIFEST);
  assert.equal(validation.valid, true);

  const dsRuntimeDecision = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/data-sources/dataSourceRegistryRuntime.ts",
    allowedFiles: EXECUTIVE_BUSINESS_DATA_SOURCE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: EXECUTIVE_BUSINESS_DATA_SOURCE_FORBIDDEN_PATTERNS,
  });
  assert.equal(dsRuntimeDecision.allowed, false);
  assert.equal(dsRuntimeDecision.reason, "forbidden_pattern");
});

test("rejects workspace registry store paths", () => {
  const decision = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/workspace/workspaceRegistryStore.ts",
    allowedFiles: EXECUTIVE_BUSINESS_DATA_SOURCE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: EXECUTIVE_BUSINESS_DATA_SOURCE_FORBIDDEN_PATTERNS,
  });
  assert.equal(decision.allowed, false);
});

test("validates category examples and ownership contract", () => {
  for (const category of EXECUTIVE_BUSINESS_DATA_SOURCE_CATEGORIES) {
    const record = resolveExecutiveBusinessDataSourceExample(category);
    const validation = validateExecutiveBusinessDataSourceRecord(record);
    assert.equal(validation.valid, true, category);
    const ownership = buildExecutiveBusinessDataSourceOwnershipContract(record);
    assert.equal(ownership.isolationPolicy, "workspace-exclusive");
  }
});

test("rejects records without workspace ownership", () => {
  const validation = validateExecutiveBusinessDataSourceOwnership({
    record: { businessDataSourceId: "ebds-missing-workspace", workspaceId: "" },
    expectedWorkspaceId: "workspace-001",
  });
  assert.equal(validation.valid, false);
  assert.ok(validation.issues.some((entry) => entry.code === "missing_workspace_id"));
});

test("records lifecycle diagnostic events", () => {
  recordExecutiveBusinessDataSourceEvent({
    type: "BusinessDataSourceCreated",
    businessDataSourceId: "ebds-001",
    workspaceId: "workspace-001",
  });
  recordExecutiveBusinessDataSourceEvent({ type: "BusinessDataSourceActivated", businessDataSourceId: "ebds-001" });
  assert.equal(getExecutiveBusinessDataSourceEvents().length, 2);
});

test("computeExecutiveBusinessDataSourceOverallScore meets minimum when dimensions are strong", () => {
  const overall = computeExecutiveBusinessDataSourceOverallScore({
    architecture: 97,
    maintainability: 97,
    regressionSafety: 98,
    scalability: 95,
    certificationReadiness: 98,
  });
  assert.ok(overall >= STAGE_MINIMUM_OVERALL_SCORE);
  assert.equal(meetsExecutiveBusinessDataSourceMinimumScore(overall), true);
});

test("executive business data source certification passes all gates", () => {
  const result = runExecutiveBusinessDataSourceCertification();
  assert.equal(result.certified, true);
  assert.ok(result.scoreReport.meetsMinimum);
  assert.ok(result.scoreReport.overall >= STAGE_MINIMUM_OVERALL_SCORE);
  assert.ok(result.checks.every((entry) => entry.passed));
  assert.ok(getExecutiveBusinessDataSourceDiagnosticsLog().length > 0);
});

test("executive business data source analysis freezes contract on pass", () => {
  const result = runExecutiveBusinessDataSourceAnalysis();
  assert.equal(result.certified, true);
  assert.equal(isExecutiveBusinessDataSourceFrozen(), true);
  assert.ok(result.scoreReport.overall >= STAGE_MINIMUM_OVERALL_SCORE);
  for (const tag of EXECUTIVE_BUSINESS_DATA_SOURCE_FREEZE_TAGS) {
    assert.ok(result.tags.includes(tag));
  }
});
