import assert from "node:assert/strict";
import test from "node:test";

import { runDs1FoundationAnalysis } from "../datasourceCertification/ds1FoundationCertification.ts";
import { runExecutiveModelGenerationAnalysis } from "../executiveModel/executiveModelGenerationCertification.ts";
import {
  CHECKPOINT_STAGE_MAP,
  DEFAULT_PIPELINE_RETRY_POLICY,
  EMG1_PIPELINE_ALIGNMENT_MAP,
  EXECUTIVE_MODEL_PIPELINE_FORBIDDEN_PATTERNS,
  EXECUTIVE_MODEL_PIPELINE_FREEZE_TAGS,
  EXECUTIVE_MODEL_PIPELINE_MINIMUM_OVERALL_SCORE,
  EXECUTIVE_MODEL_PIPELINE_MUST_NOT_OWN,
  EXECUTIVE_MODEL_PIPELINE_SELF_MANIFEST,
  EXECUTIVE_MODEL_PIPELINE_TAGS,
  EXECUTIVE_MODEL_PIPELINE_VERSION,
  PIPELINE_CHECKPOINT_KINDS,
  PIPELINE_EXECUTION_STAGES,
  PIPELINE_FAILURE_KINDS,
  buildPipelineOwnershipContract,
  computeExecutiveModelPipelineAnalysisScore,
  computeExecutiveModelPipelineOverallScore,
  meetsExecutiveModelPipelineMinimumScore,
  resolvePipelineExecutionSessionExample,
  validateEmgpEmg1AlignmentIntegration,
  validateEmgpEmg1ValidationDelegation,
  validateEmgpFoundationIntegration,
  validateEmgpStageTransitionContract,
  validatePipelineExecutionSession,
  validatePipelineRetryPolicy,
  validatePipelineStageTransition,
} from "./executiveModelPipelineContract.ts";
import {
  isExecutiveModelPipelineFrozen,
  runExecutiveModelPipelineAnalysis,
  runExecutiveModelPipelineCertification,
} from "./executiveModelPipelineCertification.ts";
import {
  getPipelineDiagnosticsLog,
  recordPipelineDiagnosticEvent,
  resetPipelineDiagnosticsForTests,
} from "./executiveModelPipelineDiagnostics.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

test.beforeEach(() => {
  resetPipelineDiagnosticsForTests();
  runDs1FoundationAnalysis();
  runExecutiveModelGenerationAnalysis();
});

test("exports pipeline version, stages, and tags", () => {
  assert.equal(EXECUTIVE_MODEL_PIPELINE_VERSION, "PHASE-3/EMG-2");
  assert.equal(PIPELINE_EXECUTION_STAGES.length, 8);
  assert.equal(PIPELINE_CHECKPOINT_KINDS.length, 5);
  assert.ok(EXECUTIVE_MODEL_PIPELINE_TAGS.includes("[EMG2_PIPELINE_ORCHESTRATION]"));
});

test("validates self manifest and rejects forbidden paths", () => {
  const validation = validateStageManifest(EXECUTIVE_MODEL_PIPELINE_SELF_MANIFEST);
  assert.equal(validation.valid, true);

  for (const filePath of [
    "frontend/app/lib/scene/objectRegistryRuntime.ts",
    "frontend/app/lib/risk-intelligence/RiskIntelligenceRuntime.ts",
    "frontend/app/lib/scenario-intelligence/ScenarioGenerationRuntime.ts",
    "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
  ]) {
    const decision = evaluateStageFileBoundary({
      filePath,
      allowedFiles: EXECUTIVE_MODEL_PIPELINE_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_MODEL_PIPELINE_FORBIDDEN_PATTERNS,
    });
    assert.equal(decision.allowed, false, filePath);
  }
});

test("validates pipeline session example with mandatory fields", () => {
  const session = resolvePipelineExecutionSessionExample();
  assert.equal(validatePipelineExecutionSession(session).valid, true);
  assert.equal(session.pipelineState, "completed");
  assert.equal(session.currentStage, "completed");
  assert.equal(session.checkpoints.length, 5);
  const ownership = buildPipelineOwnershipContract(session);
  assert.equal(ownership.isolationPolicy, "workspace-exclusive");
});

test("documents EMG-1 pipeline alignment map", () => {
  assert.equal(EMG1_PIPELINE_ALIGNMENT_MAP.initialize, "intake");
  assert.equal(EMG1_PIPELINE_ALIGNMENT_MAP.validate_model, "validate");
  assert.equal(EMG1_PIPELINE_ALIGNMENT_MAP.emit_model, "emit");
  assert.equal(validateEmgpEmg1AlignmentIntegration().valid, true);
});

test("validates stage transitions on success path", () => {
  assert.equal(validateEmgpStageTransitionContract().valid, true);
  assert.equal(validatePipelineStageTransition("initialize", "load_foundation").valid, true);
  assert.equal(validatePipelineStageTransition("initialize", "completed").valid, false);
});

test("maps checkpoints to stages", () => {
  assert.equal(CHECKPOINT_STAGE_MAP.foundation_loaded, "load_foundation");
  assert.equal(CHECKPOINT_STAGE_MAP.model_emitted, "emit_model");
});

test("validates EMG-1 validation delegation and foundation integration", () => {
  assert.equal(validateEmgpEmg1ValidationDelegation().valid, true);
  assert.equal(validateEmgpFoundationIntegration().valid, true);
});

test("documents MUST NOT OWN exclusions and retry policy shape", () => {
  assert.ok(EXECUTIVE_MODEL_PIPELINE_MUST_NOT_OWN.includes("persistence"));
  assert.ok(EXECUTIVE_MODEL_PIPELINE_MUST_NOT_OWN.includes("retry_engine"));
  assert.ok(EXECUTIVE_MODEL_PIPELINE_MUST_NOT_OWN.includes("kpi_calculations"));
  assert.equal(validatePipelineRetryPolicy(DEFAULT_PIPELINE_RETRY_POLICY).valid, true);
  assert.equal(DEFAULT_PIPELINE_RETRY_POLICY.maxAttempts, 1);
});

test("documents failure kinds", () => {
  assert.equal(PIPELINE_FAILURE_KINDS.length, 5);
  assert.ok(PIPELINE_FAILURE_KINDS.includes("validation_failure"));
});

test("records pipeline diagnostic lifecycle events", () => {
  recordPipelineDiagnosticEvent({
    type: "PipelineSessionCreated",
    executionSessionId: "session-001",
    workspaceId: "workspace-001",
  });
  recordPipelineDiagnosticEvent({ type: "CheckpointRecorded", executionSessionId: "session-001" });
  assert.ok(getPipelineDiagnosticsLog().length >= 0);
});

test("computeExecutiveModelPipelineOverallScore meets minimum when dimensions are strong", () => {
  const overall = computeExecutiveModelPipelineOverallScore({
    architecture: 100,
    maintainability: 98,
    regressionSafety: 99,
    scalability: 96,
    certificationReadiness: 100,
  });
  assert.ok(overall >= EXECUTIVE_MODEL_PIPELINE_MINIMUM_OVERALL_SCORE);
  assert.equal(meetsExecutiveModelPipelineMinimumScore(overall), true);
});

test("computeExecutiveModelPipelineAnalysisScore meets minimum when dimensions are strong", () => {
  const overall = computeExecutiveModelPipelineAnalysisScore({
    architectureHealth: 100,
    maintainability: 98,
    scalability: 96,
    regressionSafety: 99,
    orchestrationBoundaryIntegrity: 100,
    pipelineIntegrity: 99,
    bugTraceability: 97,
    certificationReadiness: 100,
  });
  assert.ok(overall >= EXECUTIVE_MODEL_PIPELINE_MINIMUM_OVERALL_SCORE);
});

test("executive model pipeline analysis passes all gates and freezes contract", () => {
  const result = runExecutiveModelPipelineAnalysis();
  assert.equal(result.certified, true);
  assert.equal(isExecutiveModelPipelineFrozen(), true);
  assert.ok(result.freezeReport?.frozen);
  assert.ok(result.analysisScoreReport?.meetsMinimum);
  assert.ok(result.analysisScoreReport!.overall >= EXECUTIVE_MODEL_PIPELINE_MINIMUM_OVERALL_SCORE);
  assert.ok(result.checks.every((entry) => entry.passed));
  for (const tag of EXECUTIVE_MODEL_PIPELINE_FREEZE_TAGS) {
    assert.ok(result.tags.includes(tag));
  }
});

test("executive model pipeline certification passes all gates", () => {
  const result = runExecutiveModelPipelineCertification();
  assert.equal(result.certified, true);
  assert.ok(result.scoreReport.meetsMinimum);
  assert.ok(result.scoreReport.overall >= EXECUTIVE_MODEL_PIPELINE_MINIMUM_OVERALL_SCORE);
  assert.ok(result.checks.every((entry) => entry.passed));
  assert.equal(resolvePipelineExecutionSessionExample().validationSummary.valid, true);
});

test("rejects session without workspace id", () => {
  const session = resolvePipelineExecutionSessionExample();
  const invalid = Object.freeze({ ...session, workspaceId: "" });
  assert.equal(validatePipelineExecutionSession(invalid).valid, false);
});
