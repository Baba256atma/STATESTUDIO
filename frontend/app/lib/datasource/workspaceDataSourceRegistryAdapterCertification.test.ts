import assert from "node:assert/strict";
import test from "node:test";

import { runExecutiveBusinessDataSourceAnalysis } from "./executiveBusinessDataSourceCertification.ts";
import {
  EXECUTIVE_BUSINESS_DATA_SOURCE_CATEGORIES,
} from "./executiveBusinessDataSourceContract.ts";
import {
  WORKSPACE_REGISTRY_ADAPTER_DEFAULT_SYNC_PROFILE,
  WORKSPACE_REGISTRY_ADAPTER_FORBIDDEN_PATTERNS,
  WORKSPACE_REGISTRY_ADAPTER_FREEZE_TAGS,
  WORKSPACE_REGISTRY_ADAPTER_LIFECYCLE_STATES,
  WORKSPACE_REGISTRY_ADAPTER_SELF_MANIFEST,
  WORKSPACE_REGISTRY_ADAPTER_TAGS,
  WORKSPACE_REGISTRY_ADAPTER_VERSION,
  buildExecutiveToGlobalMappingPlan,
  buildExecutiveToWorkspaceMappingPlan,
  buildWorkspaceRegistryAdapterOwnershipContract,
  buildWorkspaceRegistryReferenceContract,
  computeWorkspaceRegistryAdapterOverallScore,
  mapExecutiveLifecycleToGlobalStatus,
  mapExecutiveLifecycleToWorkspaceStatus,
  meetsWorkspaceRegistryAdapterMinimumScore,
  resolveWorkspaceRegistryAdapterLinkExample,
  validateWorkspaceRegistryAdapterLinkRecord,
  validateWorkspaceRegistryAdapterOwnership,
  validateWorkspaceRegistryReferenceContract,
} from "./workspaceDataSourceRegistryAdapterContract.ts";
import {
  isWorkspaceRegistryAdapterFrozen,
  resetWorkspaceRegistryAdapterFreezeForTests,
  runWorkspaceRegistryAdapterAnalysis,
  runWorkspaceRegistryAdapterCertification,
} from "./workspaceDataSourceRegistryAdapterCertification.ts";
import {
  getWorkspaceRegistryAdapterDiagnosticsLog,
  getWorkspaceRegistryAdapterEvents,
  recordWorkspaceRegistryAdapterEvent,
  resetWorkspaceRegistryAdapterDiagnosticsForTests,
} from "./workspaceDataSourceRegistryAdapterDiagnostics.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { STAGE_MINIMUM_OVERALL_SCORE } from "../stage/stageArchitectureContract.ts";

test.beforeEach(() => {
  resetWorkspaceRegistryAdapterDiagnosticsForTests();
  resetWorkspaceRegistryAdapterFreezeForTests();
  runExecutiveBusinessDataSourceAnalysis();
});

test("exports adapter version, lifecycle states, and tags", () => {
  assert.equal(WORKSPACE_REGISTRY_ADAPTER_VERSION, "PHASE-2/DS1:2");
  assert.equal(WORKSPACE_REGISTRY_ADAPTER_LIFECYCLE_STATES.length, 7);
  assert.ok(WORKSPACE_REGISTRY_ADAPTER_TAGS.includes("[DS12_REGISTRY_ADAPTER]"));
});

test("validates self manifest and rejects forbidden registry runtime paths", () => {
  const validation = validateStageManifest(WORKSPACE_REGISTRY_ADAPTER_SELF_MANIFEST);
  assert.equal(validation.valid, true);

  const runtimeDecision = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/data-sources/dataSourceRegistryRuntime.ts",
    allowedFiles: WORKSPACE_REGISTRY_ADAPTER_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: WORKSPACE_REGISTRY_ADAPTER_FORBIDDEN_PATTERNS,
  });
  assert.equal(runtimeDecision.allowed, false);
  assert.equal(runtimeDecision.reason, "forbidden_pattern");
});

test("rejects workspace registry runtime paths", () => {
  const decision = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/workspace/workspaceDataSourceRegistry.ts",
    allowedFiles: WORKSPACE_REGISTRY_ADAPTER_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: WORKSPACE_REGISTRY_ADAPTER_FORBIDDEN_PATTERNS,
  });
  assert.equal(decision.allowed, false);
});

test("maps executive lifecycle to workspace and global status hints", () => {
  assert.equal(mapExecutiveLifecycleToWorkspaceStatus("defined"), "empty");
  assert.equal(mapExecutiveLifecycleToWorkspaceStatus("active"), "connected");
  assert.equal(mapExecutiveLifecycleToGlobalStatus("active"), "active");
  assert.equal(mapExecutiveLifecycleToGlobalStatus("suspended"), "inactive");
  assert.equal(mapExecutiveLifecycleToGlobalStatus("removed"), null);

  const workspacePlan = buildExecutiveToWorkspaceMappingPlan({ category: "sales", lifecycleState: "connected" });
  const globalPlan = buildExecutiveToGlobalMappingPlan({ category: "sales", lifecycleState: "connected" });
  assert.equal(workspacePlan.workspaceTypeHint, "csv");
  assert.equal(globalPlan.globalTypeHint, "csv");
});

test("validates adapter link examples, ownership, and registry reference", () => {
  for (const category of EXECUTIVE_BUSINESS_DATA_SOURCE_CATEGORIES) {
    const link = resolveWorkspaceRegistryAdapterLinkExample(category);
    assert.equal(validateWorkspaceRegistryAdapterLinkRecord(link).valid, true, category);
    const ownership = buildWorkspaceRegistryAdapterOwnershipContract(link);
    assert.equal(ownership.isolationPolicy, "workspace-exclusive");
    const reference = buildWorkspaceRegistryReferenceContract(link);
    assert.equal(reference.globalRegistryWorkspaceContext, "adapter-link-only");
    assert.equal(validateWorkspaceRegistryReferenceContract(reference).valid, true);
  }
});

test("rejects adapter links without workspace ownership", () => {
  const validation = validateWorkspaceRegistryAdapterOwnership({
    record: { adapterLinkId: "link-001", workspaceId: "", businessDataSourceId: "ebds-001" },
    expectedWorkspaceId: "workspace-001",
  });
  assert.equal(validation.valid, false);
  assert.ok(validation.issues.some((entry) => entry.code === "missing_workspace_id"));
});

test("enforces sync boundary contract defaults", () => {
  assert.equal(WORKSPACE_REGISTRY_ADAPTER_DEFAULT_SYNC_PROFILE.allowStatusMirror, false);
});

test("records adapter diagnostic lifecycle events", () => {
  recordWorkspaceRegistryAdapterEvent({
    type: "LinkCreated",
    adapterLinkId: "link-001",
    workspaceId: "workspace-001",
  });
  recordWorkspaceRegistryAdapterEvent({ type: "SyncPending", adapterLinkId: "link-001" });
  assert.equal(getWorkspaceRegistryAdapterEvents().length, 2);
});

test("computeWorkspaceRegistryAdapterOverallScore meets minimum when dimensions are strong", () => {
  const overall = computeWorkspaceRegistryAdapterOverallScore({
    architecture: 97,
    maintainability: 97,
    regressionSafety: 98,
    scalability: 95,
    certificationReadiness: 98,
  });
  assert.ok(overall >= STAGE_MINIMUM_OVERALL_SCORE);
  assert.equal(meetsWorkspaceRegistryAdapterMinimumScore(overall), true);
});

test("workspace registry adapter certification passes all gates", () => {
  const result = runWorkspaceRegistryAdapterCertification();
  assert.equal(result.certified, true);
  assert.ok(result.scoreReport.meetsMinimum);
  assert.ok(result.scoreReport.overall >= STAGE_MINIMUM_OVERALL_SCORE);
  assert.ok(result.checks.every((entry) => entry.passed));
  assert.ok(getWorkspaceRegistryAdapterDiagnosticsLog().length > 0);
});

test("workspace registry adapter analysis freezes contract on pass", () => {
  const result = runWorkspaceRegistryAdapterAnalysis();
  assert.equal(result.certified, true);
  assert.equal(isWorkspaceRegistryAdapterFrozen(), true);
  assert.ok(result.scoreReport.overall >= STAGE_MINIMUM_OVERALL_SCORE);
  for (const tag of WORKSPACE_REGISTRY_ADAPTER_FREEZE_TAGS) {
    assert.ok(result.tags.includes(tag));
  }
});
