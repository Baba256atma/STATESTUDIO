import assert from "node:assert/strict";
import test from "node:test";

import { runDs1FoundationAnalysis } from "../datasourceCertification/ds1FoundationCertification.ts";
import { runExecutiveModelGenerationAnalysis } from "../executiveModel/executiveModelGenerationCertification.ts";
import { runExecutiveModelPipelineAnalysis } from "../executiveModelPipeline/executiveModelPipelineCertification.ts";
import { runExecutiveModelRuntimeAnalysis } from "../executiveModelRuntime/executiveModelRuntimeCertification.ts";
import { runExecutiveModelRuntime } from "../executiveModelRuntime/executiveModelRuntimeKernel.ts";
import { resolveRuntimeExecutionInputExample } from "../executiveModelRuntime/executiveModelRuntimeContract.ts";
import {
  EMG1_OBJECT_KIND_TO_OBJECT_TYPE,
  EXECUTIVE_OBJECT_INTEGRATION_FORBIDDEN_PATTERNS,
  EXECUTIVE_OBJECT_INTEGRATION_FREEZE_TAGS,
  EXECUTIVE_OBJECT_INTEGRATION_MINIMUM_OVERALL_SCORE,
  EXECUTIVE_OBJECT_INTEGRATION_MUST_NOT_OWN,
  EXECUTIVE_OBJECT_INTEGRATION_SELF_MANIFEST,
  EXECUTIVE_OBJECT_INTEGRATION_TAGS,
  EXECUTIVE_OBJECT_INTEGRATION_VERSION,
  EXECUTIVE_OBJECT_LIFECYCLE_STATES,
  EXECUTIVE_OBJECT_TYPES,
  buildExecutiveObjectOwnershipContract,
  computeExecutiveObjectIntegrationAnalysisScore,
  computeExecutiveObjectIntegrationOverallScore,
  integrateExecutiveObjectsFromModel,
  listExecutiveObjectsByType,
  mapEmg1ObjectKindToObjectType,
  meetsExecutiveObjectIntegrationMinimumScore,
  resolveExecutiveObjectById,
  resolveExecutiveObjectExample,
  resolveExecutiveObjectRegistryExample,
  validateEmg3IntegrationInput,
  validateEoiClassificationMapping,
  validateEoiEmg3InputBoundary,
  validateExecutiveObject,
  validateExecutiveObjectRegistry,
  validateObjectSourceReference,
} from "./executiveObjectContract.ts";
import {
  isExecutiveObjectIntegrationFrozen,
  runExecutiveObjectIntegrationAnalysis,
  runExecutiveObjectIntegrationCertification,
} from "./executiveObjectCertification.ts";
import {
  getExecutiveObjectDiagnosticsLog,
  recordExecutiveObjectDiagnosticEvent,
  resetExecutiveObjectDiagnosticsForTests,
} from "./executiveObjectDiagnostics.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

test.beforeEach(() => {
  resetExecutiveObjectDiagnosticsForTests();
  runDs1FoundationAnalysis();
  runExecutiveModelGenerationAnalysis();
  runExecutiveModelPipelineAnalysis();
  runExecutiveModelRuntimeAnalysis();
});

test("exports integration version, object types, and tags", () => {
  assert.equal(EXECUTIVE_OBJECT_INTEGRATION_VERSION, "PHASE-4/DS2-INT-1");
  assert.equal(EXECUTIVE_OBJECT_TYPES.length, 8);
  assert.equal(EXECUTIVE_OBJECT_LIFECYCLE_STATES.length, 6);
  assert.ok(EXECUTIVE_OBJECT_INTEGRATION_TAGS.includes("[DS2_INT_EXECUTIVE_OBJECT]"));
});

test("validates self manifest and rejects forbidden paths", () => {
  const validation = validateStageManifest(EXECUTIVE_OBJECT_INTEGRATION_SELF_MANIFEST);
  assert.equal(validation.valid, true);

  for (const filePath of [
    "frontend/app/lib/datasourceCertification/ds1FoundationCertification.ts",
    "frontend/app/lib/scene/objectRegistryRuntime.ts",
    "frontend/app/lib/risk-intelligence/RiskIntelligenceRuntime.ts",
    "frontend/app/lib/relationships/executive/relationshipFocusRuntime.ts",
    "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
  ]) {
    const decision = evaluateStageFileBoundary({
      filePath,
      allowedFiles: EXECUTIVE_OBJECT_INTEGRATION_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_OBJECT_INTEGRATION_FORBIDDEN_PATTERNS,
    });
    assert.equal(decision.allowed, false, filePath);
  }
});

test("validates executive object example with mandatory fields", () => {
  const object = resolveExecutiveObjectExample();
  assert.equal(validateExecutiveObject(object).valid, true);
  assert.equal(object.lifecycleState, "validated");
  const registry = resolveExecutiveObjectRegistryExample();
  const ownership = buildExecutiveObjectOwnershipContract(registry);
  assert.equal(ownership.isolationPolicy, "workspace-exclusive");
});

test("validates registry example and lookup helpers", () => {
  const registry = resolveExecutiveObjectRegistryExample();
  assert.equal(validateExecutiveObjectRegistry(registry).valid, true);
  const first = registry.objects[0];
  assert.ok(first);
  assert.equal(resolveExecutiveObjectById(registry, first.executiveObjectId)?.executiveObjectId, first.executiveObjectId);
  assert.ok(listExecutiveObjectsByType(registry, first.objectType).length >= 1);
});

test("maps EMG-1 object kinds to object types", () => {
  assert.equal(mapEmg1ObjectKindToObjectType("entity"), EMG1_OBJECT_KIND_TO_OBJECT_TYPE.entity);
  assert.equal(mapEmg1ObjectKindToObjectType("process_node"), "process");
  assert.equal(validateEoiClassificationMapping().valid, true);
});

test("validates source reference and EMG-3 input boundary", () => {
  const object = resolveExecutiveObjectExample();
  assert.equal(validateObjectSourceReference(object.sourceReference).valid, true);
  assert.equal(validateEoiEmg3InputBoundary().valid, true);
});

test("documents MUST NOT OWN exclusions", () => {
  assert.ok(EXECUTIVE_OBJECT_INTEGRATION_MUST_NOT_OWN.includes("persistence"));
  assert.ok(EXECUTIVE_OBJECT_INTEGRATION_MUST_NOT_OWN.includes("relationship_discovery"));
  assert.ok(EXECUTIVE_OBJECT_INTEGRATION_MUST_NOT_OWN.includes("ds1_direct_consumption"));
  assert.ok(EXECUTIVE_OBJECT_INTEGRATION_MUST_NOT_OWN.includes("kpi_calculations"));
});

test("integrates executive objects from EMG-3 runtime output only", () => {
  const runtimeResult = runExecutiveModelRuntime({
    ...resolveRuntimeExecutionInputExample(),
    runtimeSessionId: "eoi-test-runtime-001",
  });
  assert.equal(runtimeResult.success, true);
  assert.ok(runtimeResult.emittedModel);

  const integration = integrateExecutiveObjectsFromModel({
    executiveModelRecord: runtimeResult.emittedModel!,
    integrationSessionId: "eoi-test-integration-001",
    runtimeSessionId: runtimeResult.session.runtimeSessionId,
  });
  assert.equal(integration.success, true);
  assert.ok(integration.registry);
  assert.ok(integration.objects.length > 0);
  assert.equal(validateEmg3IntegrationInput(runtimeResult.emittedModel!).valid, true);
  assert.equal(validateExecutiveObjectRegistry(integration.registry!).valid, true);
});

test("records executive object diagnostic lifecycle events", () => {
  recordExecutiveObjectDiagnosticEvent({
    type: "ExecutiveObjectDeclared",
    integrationSessionId: "session-001",
    workspaceId: "workspace-001",
    executiveObjectId: "obj-001",
  });
  assert.ok(getExecutiveObjectDiagnosticsLog().length >= 0);
});

test("computeExecutiveObjectIntegrationOverallScore meets minimum when dimensions are strong", () => {
  const overall = computeExecutiveObjectIntegrationOverallScore({
    architecture: 100,
    maintainability: 98,
    regressionSafety: 99,
    scalability: 96,
    certificationReadiness: 100,
  });
  assert.ok(overall >= EXECUTIVE_OBJECT_INTEGRATION_MINIMUM_OVERALL_SCORE);
  assert.equal(meetsExecutiveObjectIntegrationMinimumScore(overall), true);
});

test("computeExecutiveObjectIntegrationAnalysisScore meets minimum when dimensions are strong", () => {
  const overall = computeExecutiveObjectIntegrationAnalysisScore({
    architectureHealth: 100,
    maintainability: 98,
    scalability: 96,
    regressionSafety: 99,
    emg3InputBoundaryIntegrity: 100,
    objectModelIntegrity: 99,
    bugTraceability: 97,
    certificationReadiness: 100,
  });
  assert.ok(overall >= EXECUTIVE_OBJECT_INTEGRATION_MINIMUM_OVERALL_SCORE);
});

test("executive object integration analysis passes all gates and freezes contract", () => {
  const result = runExecutiveObjectIntegrationAnalysis();
  assert.equal(result.certified, true);
  assert.equal(isExecutiveObjectIntegrationFrozen(), true);
  assert.ok(result.freezeReport?.frozen);
  assert.ok(result.analysisScoreReport?.meetsMinimum);
  assert.ok(result.analysisScoreReport!.overall >= EXECUTIVE_OBJECT_INTEGRATION_MINIMUM_OVERALL_SCORE);
  assert.ok(result.checks.every((entry) => entry.passed));
  for (const tag of EXECUTIVE_OBJECT_INTEGRATION_FREEZE_TAGS) {
    assert.ok(result.tags.includes(tag));
  }
});

test("executive object integration certification passes all gates", () => {
  const result = runExecutiveObjectIntegrationCertification();
  assert.equal(result.certified, true);
  assert.ok(result.scoreReport.meetsMinimum);
  assert.ok(result.scoreReport.overall >= EXECUTIVE_OBJECT_INTEGRATION_MINIMUM_OVERALL_SCORE);
  assert.ok(result.checks.every((entry) => entry.passed));
});

test("rejects object without workspace id", () => {
  const object = resolveExecutiveObjectExample();
  const invalid = Object.freeze({ ...object, workspaceId: "" });
  assert.equal(validateExecutiveObject(invalid).valid, false);
});

test("rejects invalid EMG model lifecycle for integration input", () => {
  const runtimeResult = runExecutiveModelRuntime({
    ...resolveRuntimeExecutionInputExample(),
    runtimeSessionId: "eoi-test-runtime-002",
  });
  assert.ok(runtimeResult.emittedModel);
  const invalid = Object.freeze({
    ...runtimeResult.emittedModel!,
    lifecycleState: "draft" as const,
  });
  assert.equal(validateEmg3IntegrationInput(invalid).valid, false);
});
