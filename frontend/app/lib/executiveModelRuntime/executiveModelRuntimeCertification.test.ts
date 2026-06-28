import assert from "node:assert/strict";
import test from "node:test";

import { runDs1FoundationAnalysis } from "../datasourceCertification/ds1FoundationCertification.ts";
import { runExecutiveModelGenerationAnalysis } from "../executiveModel/executiveModelGenerationCertification.ts";
import { runExecutiveModelPipelineAnalysis } from "../executiveModelPipeline/executiveModelPipelineCertification.ts";
import {
  EXECUTIVE_MODEL_RUNTIME_FORBIDDEN_PATTERNS,
  EXECUTIVE_MODEL_RUNTIME_FREEZE_TAGS,
  EXECUTIVE_MODEL_RUNTIME_MINIMUM_OVERALL_SCORE,
  EXECUTIVE_MODEL_RUNTIME_MUST_NOT_OWN,
  EXECUTIVE_MODEL_RUNTIME_SELF_MANIFEST,
  EXECUTIVE_MODEL_RUNTIME_TAGS,
  EXECUTIVE_MODEL_RUNTIME_VERSION,
  RUNTIME_EXECUTABLE_STAGES,
  RUNTIME_STATES,
  buildRuntimeOwnershipContract,
  computeExecutiveModelRuntimeAnalysisScore,
  computeExecutiveModelRuntimeOverallScore,
  meetsExecutiveModelRuntimeMinimumScore,
  resolveRuntimeExecutionInputExample,
  resolveRuntimeSessionExample,
  validateEmgrEmg2TransitionIntegration,
  validateEmgrStructuralEmissionIntegration,
  validateRuntimeSession,
  validateStructuralModelEmission,
} from "./executiveModelRuntimeContract.ts";
import {
  isExecutiveModelRuntimeFrozen,
  runExecutiveModelRuntimeAnalysis,
  runExecutiveModelRuntimeCertification,
} from "./executiveModelRuntimeCertification.ts";
import {
  getRuntimeDiagnosticsLog,
  recordRuntimeDiagnosticEvent,
  resetRuntimeDiagnosticsForTests,
} from "./executiveModelRuntimeDiagnostics.ts";
import {
  requestRuntimeCancellation,
  resetActiveRuntimeSessionsForTests,
  runExecutiveModelRuntime,
} from "./executiveModelRuntimeKernel.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

test.beforeEach(() => {
  resetRuntimeDiagnosticsForTests();
  resetActiveRuntimeSessionsForTests();
  runDs1FoundationAnalysis();
  runExecutiveModelGenerationAnalysis();
  runExecutiveModelPipelineAnalysis();
});

test("exports runtime version, stages, and tags", () => {
  assert.equal(EXECUTIVE_MODEL_RUNTIME_VERSION, "PHASE-3/EMG-3");
  assert.equal(RUNTIME_EXECUTABLE_STAGES.length, 6);
  assert.equal(RUNTIME_STATES.length, 5);
  assert.ok(EXECUTIVE_MODEL_RUNTIME_TAGS.includes("[EMG3_PIPELINE_RUNTIME]"));
});

test("validates self manifest and rejects forbidden paths", () => {
  const validation = validateStageManifest(EXECUTIVE_MODEL_RUNTIME_SELF_MANIFEST);
  assert.equal(validation.valid, true);

  for (const filePath of [
    "frontend/app/lib/scene/objectRegistryRuntime.ts",
    "frontend/app/lib/risk-intelligence/RiskIntelligenceRuntime.ts",
    "frontend/app/lib/scenario-intelligence/ScenarioGenerationRuntime.ts",
    "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
  ]) {
    const decision = evaluateStageFileBoundary({
      filePath,
      allowedFiles: EXECUTIVE_MODEL_RUNTIME_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_MODEL_RUNTIME_FORBIDDEN_PATTERNS,
    });
    assert.equal(decision.allowed, false, filePath);
  }
});

test("validates runtime session example with mandatory fields", () => {
  const session = resolveRuntimeSessionExample();
  assert.equal(validateRuntimeSession(session).valid, true);
  assert.equal(session.runtimeState, "completed");
  const ownership = buildRuntimeOwnershipContract(session);
  assert.equal(ownership.isolationPolicy, "workspace-exclusive");
});

test("validates structural model emission rules", () => {
  assert.equal(validateEmgrStructuralEmissionIntegration().valid, true);
  const session = resolveRuntimeSessionExample();
  assert.equal(validateStructuralModelEmission(session.emittedModel).valid, true);
});

test("validates EMG-2 transition integration", () => {
  assert.equal(validateEmgrEmg2TransitionIntegration().valid, true);
});

test("documents MUST NOT OWN exclusions", () => {
  assert.ok(EXECUTIVE_MODEL_RUNTIME_MUST_NOT_OWN.includes("persistence"));
  assert.ok(EXECUTIVE_MODEL_RUNTIME_MUST_NOT_OWN.includes("object_generation"));
  assert.ok(EXECUTIVE_MODEL_RUNTIME_MUST_NOT_OWN.includes("kpi_calculations"));
  assert.ok(EXECUTIVE_MODEL_RUNTIME_MUST_NOT_OWN.includes("background_workers"));
});

test("runs executive model runtime kernel and emits structural model", () => {
  const result = runExecutiveModelRuntime({
    ...resolveRuntimeExecutionInputExample(),
    runtimeSessionId: "emgr-test-001",
  });
  assert.equal(result.success, true);
  assert.equal(result.session.runtimeState, "completed");
  assert.equal(result.session.checkpoints.length, 5);
  assert.ok(result.emittedModel);
  assert.equal(validateStructuralModelEmission(result.emittedModel).valid, true);
});

test("supports cooperative cancellation between stages", () => {
  const input = resolveRuntimeExecutionInputExample();
  const sessionId = "emgr-cancel-001";
  runExecutiveModelRuntime({ ...input, runtimeSessionId: sessionId });
  assert.equal(requestRuntimeCancellation(sessionId), false);
});

test("records runtime diagnostic lifecycle events", () => {
  recordRuntimeDiagnosticEvent({
    type: "RuntimeSessionCreated",
    runtimeSessionId: "session-001",
    workspaceId: "workspace-001",
  });
  assert.ok(getRuntimeDiagnosticsLog().length >= 0);
});

test("computeExecutiveModelRuntimeOverallScore meets minimum when dimensions are strong", () => {
  const overall = computeExecutiveModelRuntimeOverallScore({
    architecture: 100,
    maintainability: 98,
    regressionSafety: 99,
    scalability: 96,
    certificationReadiness: 100,
  });
  assert.ok(overall >= EXECUTIVE_MODEL_RUNTIME_MINIMUM_OVERALL_SCORE);
  assert.equal(meetsExecutiveModelRuntimeMinimumScore(overall), true);
});

test("computeExecutiveModelRuntimeAnalysisScore meets minimum when dimensions are strong", () => {
  const overall = computeExecutiveModelRuntimeAnalysisScore({
    architectureHealth: 100,
    maintainability: 98,
    scalability: 96,
    regressionSafety: 99,
    runtimeBoundaryIntegrity: 100,
    structuralEmissionIntegrity: 99,
    bugTraceability: 97,
    certificationReadiness: 100,
  });
  assert.ok(overall >= EXECUTIVE_MODEL_RUNTIME_MINIMUM_OVERALL_SCORE);
});

test("executive model runtime analysis passes all gates and freezes contract", () => {
  const result = runExecutiveModelRuntimeAnalysis();
  assert.equal(result.certified, true);
  assert.equal(isExecutiveModelRuntimeFrozen(), true);
  assert.ok(result.freezeReport?.frozen);
  assert.ok(result.analysisScoreReport?.meetsMinimum);
  assert.ok(result.analysisScoreReport!.overall >= EXECUTIVE_MODEL_RUNTIME_MINIMUM_OVERALL_SCORE);
  assert.ok(result.checks.every((entry) => entry.passed));
  for (const tag of EXECUTIVE_MODEL_RUNTIME_FREEZE_TAGS) {
    assert.ok(result.tags.includes(tag));
  }
});

test("executive model runtime certification passes all gates", () => {
  const result = runExecutiveModelRuntimeCertification();
  assert.equal(result.certified, true);
  assert.ok(result.scoreReport.meetsMinimum);
  assert.ok(result.scoreReport.overall >= EXECUTIVE_MODEL_RUNTIME_MINIMUM_OVERALL_SCORE);
  assert.ok(result.checks.every((entry) => entry.passed));
});

test("rejects session without workspace id", () => {
  const session = resolveRuntimeSessionExample();
  const invalid = Object.freeze({ ...session, workspaceId: "" });
  assert.equal(validateRuntimeSession(invalid).valid, false);
});

test("fails runtime when knowledge artifacts missing", () => {
  const input = Object.freeze({
    ...resolveRuntimeExecutionInputExample(),
    knowledgeArtifactIds: Object.freeze([] as const),
    runtimeSessionId: "emgr-fail-001",
  });
  const result = runExecutiveModelRuntime(input);
  assert.equal(result.success, false);
  assert.equal(result.session.runtimeState, "failed");
});
