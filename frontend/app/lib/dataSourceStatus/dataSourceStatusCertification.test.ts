import assert from "node:assert/strict";
import test from "node:test";

import { runExecutiveBusinessDataSourceAnalysis } from "../datasource/executiveBusinessDataSourceCertification.ts";
import { runWorkspaceRegistryAdapterAnalysis } from "../datasource/workspaceDataSourceRegistryAdapterCertification.ts";
import { runBusinessKnowledgeLayerAnalysis } from "../businessKnowledge/businessKnowledgeLayerCertification.ts";
import { runInputDataSourceCenterAnalysis } from "../inputCenter/inputDataSourceCenterCertification.ts";
import { runManageWizardIntegrationAnalysis } from "../manageWizard/manageWizardIntegrationCertification.ts";
import {
  DATA_SOURCE_EXECUTIVE_STATUSES,
  DATA_SOURCE_HEALTH_STATES,
  DATA_SOURCE_STATUS_FORBIDDEN_PATTERNS,
  DATA_SOURCE_STATUS_FREEZE_TAGS,
  DATA_SOURCE_STATUS_MUST_NOT_OWN,
  DATA_SOURCE_STATUS_SELF_MANIFEST,
  DATA_SOURCE_STATUS_TAGS,
  DATA_SOURCE_STATUS_VERSION,
  EBDS_LIFECYCLE_TO_DSS_STATUS_HINTS,
  buildDataSourceStatusOwnershipContract,
  computeDataSourceStatusOverallScore,
  meetsDataSourceStatusMinimumScore,
  resolveDataSourceStatusSnapshotExample,
  resolveDataSourceStatusSnapshotExampleForStatus,
  validateDataSourceStatusSnapshot,
} from "./dataSourceStatusContract.ts";
import {
  isDataSourceStatusFrozen,
  runDataSourceStatusAnalysis,
  runDataSourceStatusCertification,
} from "./dataSourceStatusCertification.ts";
import {
  getDataSourceStatusDiagnosticsLog,
  getDataSourceStatusEvents,
  recordDataSourceStatusEvent,
  resetDataSourceStatusDiagnosticsForTests,
} from "./dataSourceStatusDiagnostics.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { STAGE_MINIMUM_OVERALL_SCORE } from "../stage/stageArchitectureContract.ts";

test.beforeEach(() => {
  resetDataSourceStatusDiagnosticsForTests();
  runExecutiveBusinessDataSourceAnalysis();
  runWorkspaceRegistryAdapterAnalysis();
  runBusinessKnowledgeLayerAnalysis();
  runInputDataSourceCenterAnalysis();
  runManageWizardIntegrationAnalysis();
});

test("exports data source status version, statuses, and tags", () => {
  assert.equal(DATA_SOURCE_STATUS_VERSION, "PHASE-2/DS1:6");
  assert.equal(DATA_SOURCE_EXECUTIVE_STATUSES.length, 11);
  assert.equal(DATA_SOURCE_HEALTH_STATES.length, 4);
  assert.ok(DATA_SOURCE_STATUS_TAGS.includes("[DS16_DATA_SOURCE_STATUS]"));
});

test("validates self manifest and rejects forbidden paths", () => {
  const validation = validateStageManifest(DATA_SOURCE_STATUS_SELF_MANIFEST);
  assert.equal(validation.valid, true);

  for (const filePath of [
    "frontend/app/lib/inputCenter/inputDataSourceCenterContract.ts",
    "frontend/app/lib/manageWizard/manageWizardIntegrationContract.ts",
    "frontend/app/lib/sync/SynchronizationEngine.ts",
    "frontend/app/components/wizard/ManageWizardPanel.tsx",
  ]) {
    const decision = evaluateStageFileBoundary({
      filePath,
      allowedFiles: DATA_SOURCE_STATUS_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: DATA_SOURCE_STATUS_FORBIDDEN_PATTERNS,
    });
    assert.equal(decision.allowed, false, filePath);
  }
});

test("validates snapshot with all mandatory fields", () => {
  const snapshot = resolveDataSourceStatusSnapshotExample();
  assert.equal(validateDataSourceStatusSnapshot(snapshot).valid, true);
  assert.ok(snapshot.statusSnapshotId.length > 0);
  assert.ok(snapshot.workspaceId.length > 0);
  assert.ok(snapshot.businessDataSourceId.length > 0);
  assert.ok(snapshot.observedAt.length > 0);
  assert.ok(snapshot.observedFrom.length > 0);
  assert.equal(snapshot.aggregation.aggregationPolicy, "most_restrictive");
  const ownership = buildDataSourceStatusOwnershipContract(snapshot);
  assert.equal(ownership.isolationPolicy, "workspace-exclusive");
});

test("supports all eleven executive status values", () => {
  for (const status of DATA_SOURCE_EXECUTIVE_STATUSES) {
    const snapshot = resolveDataSourceStatusSnapshotExampleForStatus(status);
    assert.equal(snapshot.status, status);
    assert.equal(validateDataSourceStatusSnapshot(snapshot).valid, true, status);
  }
});

test("documents EBDS lifecycle to DSS status hints", () => {
  assert.equal(EBDS_LIFECYCLE_TO_DSS_STATUS_HINTS.active, "active");
  assert.equal(EBDS_LIFECYCLE_TO_DSS_STATUS_HINTS.registered, "registered");
  assert.equal(EBDS_LIFECYCLE_TO_DSS_STATUS_HINTS.suspended, "failed");
});

test("rejects snapshot without workspace id", () => {
  const snapshot = resolveDataSourceStatusSnapshotExample();
  const invalid = Object.freeze({ ...snapshot, workspaceId: "" });
  assert.equal(validateDataSourceStatusSnapshot(invalid).valid, false);
});

test("documents MUST NOT OWN exclusions", () => {
  assert.ok(DATA_SOURCE_STATUS_MUST_NOT_OWN.includes("polling"));
  assert.ok(DATA_SOURCE_STATUS_MUST_NOT_OWN.includes("synchronization"));
  assert.ok(DATA_SOURCE_STATUS_MUST_NOT_OWN.includes("upload_execution"));
});

test("records data source status diagnostic lifecycle events", () => {
  recordDataSourceStatusEvent({
    type: "StatusSnapshotCreated",
    statusSnapshotId: "dss-snapshot-001",
    workspaceId: "workspace-001",
  });
  recordDataSourceStatusEvent({ type: "StatusObserved", statusSnapshotId: "dss-snapshot-001" });
  assert.equal(getDataSourceStatusEvents().length, 2);
});

test("computeDataSourceStatusOverallScore meets minimum when dimensions are strong", () => {
  const overall = computeDataSourceStatusOverallScore({
    architecture: 97,
    maintainability: 97,
    regressionSafety: 98,
    scalability: 95,
    certificationReadiness: 98,
  });
  assert.ok(overall >= STAGE_MINIMUM_OVERALL_SCORE);
  assert.equal(meetsDataSourceStatusMinimumScore(overall), true);
});

test("data source status certification passes all gates", () => {
  const result = runDataSourceStatusCertification();
  assert.equal(result.certified, true);
  assert.ok(result.scoreReport.meetsMinimum);
  assert.ok(result.scoreReport.overall >= STAGE_MINIMUM_OVERALL_SCORE);
  assert.ok(result.checks.every((entry) => entry.passed));
  assert.ok(getDataSourceStatusDiagnosticsLog().length > 0);
  assert.equal(resolveDataSourceStatusSnapshotExample().health.healthState, "healthy");
});

test("data source status analysis freezes contract on pass", () => {
  const result = runDataSourceStatusAnalysis();
  assert.equal(result.certified, true);
  assert.equal(isDataSourceStatusFrozen(), true);
  assert.ok(result.scoreReport.overall >= STAGE_MINIMUM_OVERALL_SCORE);
  for (const tag of DATA_SOURCE_STATUS_FREEZE_TAGS) {
    assert.ok(result.tags.includes(tag));
  }
});
