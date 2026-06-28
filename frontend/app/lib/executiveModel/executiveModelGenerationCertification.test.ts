import assert from "node:assert/strict";
import test from "node:test";

import { runDs1FoundationAnalysis } from "../datasourceCertification/ds1FoundationCertification.ts";
import {
  BKL_CONCEPT_TO_MODEL_FAMILY_HINTS,
  EXECUTIVE_MODEL_FAMILY_IDS,
  EXECUTIVE_MODEL_GENERATION_FORBIDDEN_PATTERNS,
  EXECUTIVE_MODEL_GENERATION_FREEZE_TAGS,
  EXECUTIVE_MODEL_GENERATION_MINIMUM_OVERALL_SCORE,
  EXECUTIVE_MODEL_GENERATION_MUST_NOT_OWN,
  EXECUTIVE_MODEL_GENERATION_SELF_MANIFEST,
  EXECUTIVE_MODEL_GENERATION_STAGES,
  EXECUTIVE_MODEL_GENERATION_TAGS,
  EXECUTIVE_MODEL_GENERATION_VERSION,
  EXECUTIVE_MODEL_LIFECYCLE_STATES,
  EXECUTIVE_MODEL_SOURCE_FOUNDATION_ID,
  buildExecutiveModelOwnershipContract,
  computeExecutiveModelGenerationAnalysisScore,
  computeExecutiveModelGenerationOverallScore,
  meetsExecutiveModelGenerationMinimumScore,
  resolveExecutiveModelExample,
  validateEmgBklBindingIntegration,
  validateEmgEbdsCorrelationIntegration,
  validateEmgWorkspaceIsolation,
  validateExecutiveModelRecord,
} from "./executiveModelGenerationContract.ts";
import {
  isExecutiveModelGenerationFrozen,
  runExecutiveModelGenerationAnalysis,
  runExecutiveModelGenerationCertification,
} from "./executiveModelGenerationCertification.ts";
import {
  getExecutiveModelGenerationDiagnosticsLog,
  getExecutiveModelGenerationEvents,
  recordExecutiveModelGenerationEvent,
  resetExecutiveModelGenerationDiagnosticsForTests,
} from "./executiveModelGenerationDiagnostics.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

test.beforeEach(() => {
  resetExecutiveModelGenerationDiagnosticsForTests();
  runDs1FoundationAnalysis();
});

test("exports executive model generation version, families, and tags", () => {
  assert.equal(EXECUTIVE_MODEL_GENERATION_VERSION, "PHASE-3/EMG-1");
  assert.equal(EXECUTIVE_MODEL_FAMILY_IDS.length, 7);
  assert.equal(EXECUTIVE_MODEL_GENERATION_STAGES.length, 6);
  assert.ok(EXECUTIVE_MODEL_GENERATION_TAGS.includes("[EMG1_EXECUTIVE_MODEL]"));
});

test("validates self manifest and rejects forbidden paths", () => {
  const validation = validateStageManifest(EXECUTIVE_MODEL_GENERATION_SELF_MANIFEST);
  assert.equal(validation.valid, true);

  for (const filePath of [
    "frontend/app/lib/scene/objectRegistryRuntime.ts",
    "frontend/app/lib/scenario-intelligence/ScenarioGenerationRuntime.ts",
    "frontend/app/lib/risk-intelligence/RiskIntelligenceRuntime.ts",
    "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
  ]) {
    const decision = evaluateStageFileBoundary({
      filePath,
      allowedFiles: EXECUTIVE_MODEL_GENERATION_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_MODEL_GENERATION_FORBIDDEN_PATTERNS,
    });
    assert.equal(decision.allowed, false, filePath);
  }
});

test("validates executive model example with mandatory fields", () => {
  const model = resolveExecutiveModelExample();
  assert.equal(validateExecutiveModelRecord(model).valid, true);
  assert.equal(model.sourceFoundationId, EXECUTIVE_MODEL_SOURCE_FOUNDATION_ID);
  assert.equal(model.modelFamilies.objects.length > 0, true);
  assert.equal(model.generationPipeline.stages.length, 6);
  const ownership = buildExecutiveModelOwnershipContract(model);
  assert.equal(ownership.isolationPolicy, "workspace-exclusive");
});

test("validates DS-1 foundation integration probes", () => {
  assert.equal(validateEmgBklBindingIntegration().valid, true);
  assert.equal(validateEmgEbdsCorrelationIntegration().valid, true);
  assert.equal(validateEmgWorkspaceIsolation().valid, true);
});

test("documents BKL concept to family mapping hints", () => {
  assert.equal(BKL_CONCEPT_TO_MODEL_FAMILY_HINTS.kpi_definition, "kpis");
  assert.equal(BKL_CONCEPT_TO_MODEL_FAMILY_HINTS.business_entity, "objects");
});

test("documents MUST NOT OWN exclusions", () => {
  assert.ok(EXECUTIVE_MODEL_GENERATION_MUST_NOT_OWN.includes("kpi_calculations"));
  assert.ok(EXECUTIVE_MODEL_GENERATION_MUST_NOT_OWN.includes("object_persistence"));
  assert.ok(EXECUTIVE_MODEL_GENERATION_MUST_NOT_OWN.includes("intelligence_reasoning"));
});

test("documents lifecycle states", () => {
  assert.ok(EXECUTIVE_MODEL_LIFECYCLE_STATES.includes("generated"));
  assert.ok(EXECUTIVE_MODEL_LIFECYCLE_STATES.includes("published"));
});

test("records executive model diagnostic lifecycle events", () => {
  recordExecutiveModelGenerationEvent({
    type: "ExecutiveModelDraftCreated",
    executiveModelId: "emg-model-001",
    workspaceId: "workspace-001",
  });
  recordExecutiveModelGenerationEvent({ type: "GenerationStageDeclared", executiveModelId: "emg-model-001" });
  assert.equal(getExecutiveModelGenerationEvents().length, 2);
});

test("computeExecutiveModelGenerationOverallScore meets minimum when dimensions are strong", () => {
  const overall = computeExecutiveModelGenerationOverallScore({
    architecture: 100,
    maintainability: 98,
    regressionSafety: 99,
    scalability: 96,
    certificationReadiness: 100,
  });
  assert.ok(overall >= EXECUTIVE_MODEL_GENERATION_MINIMUM_OVERALL_SCORE);
  assert.equal(meetsExecutiveModelGenerationMinimumScore(overall), true);
});

test("computeExecutiveModelGenerationAnalysisScore meets minimum when dimensions are strong", () => {
  const overall = computeExecutiveModelGenerationAnalysisScore({
    architectureHealth: 100,
    maintainability: 98,
    scalability: 96,
    regressionSafety: 99,
    definitionBoundaryIntegrity: 100,
    modelIntegrity: 99,
    bugTraceability: 97,
    certificationReadiness: 100,
  });
  assert.ok(overall >= EXECUTIVE_MODEL_GENERATION_MINIMUM_OVERALL_SCORE);
});

test("executive model generation analysis passes all gates and freezes contract", () => {
  const result = runExecutiveModelGenerationAnalysis();
  assert.equal(result.certified, true);
  assert.equal(isExecutiveModelGenerationFrozen(), true);
  assert.ok(result.freezeReport?.frozen);
  assert.ok(result.analysisScoreReport?.meetsMinimum);
  assert.ok(result.analysisScoreReport!.overall >= EXECUTIVE_MODEL_GENERATION_MINIMUM_OVERALL_SCORE);
  assert.ok(result.checks.every((entry) => entry.passed));
  for (const tag of EXECUTIVE_MODEL_GENERATION_FREEZE_TAGS) {
    assert.ok(result.tags.includes(tag));
  }
});

test("executive model generation certification passes all gates", () => {
  const result = runExecutiveModelGenerationCertification();
  assert.equal(result.certified, true);
  assert.ok(result.scoreReport.meetsMinimum);
  assert.ok(result.scoreReport.overall >= EXECUTIVE_MODEL_GENERATION_MINIMUM_OVERALL_SCORE);
  assert.ok(result.checks.every((entry) => entry.passed));
  assert.ok(getExecutiveModelGenerationDiagnosticsLog().length > 0);
  assert.equal(resolveExecutiveModelExample().lifecycleState, "generated");
});

test("rejects model without workspace id", () => {
  const model = resolveExecutiveModelExample();
  const invalid = Object.freeze({ ...model, workspaceId: "" });
  assert.equal(validateExecutiveModelRecord(invalid).valid, false);
});
