import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY } from "../cross-scenario-learning/crossScenarioLearningContracts.ts";
import { CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY } from "../confidence-evolution/confidenceEvolutionContracts.ts";
import {
  generateExecutiveRecommendations,
  initializeRecommendationGenerationEngine,
  resetExecutiveRecommendationGenerationEngineForTests,
} from "./executiveRecommendationGenerationEngine.ts";
import {
  EXECUTIVE_RECOMMENDATION_GENERATION_SOURCE_PROVIDER_MAP,
} from "./executiveRecommendationGenerationEngineConstants.ts";
import type { CertifiedRecommendationSourceRecordInput } from "./executiveRecommendationGenerationEngineTypes.ts";
import {
  EXECUTIVE_RECOMMENDATION_EVALUATION_DIMENSION_KEYS,
  EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_PUBLIC_API_RULES,
  EXECUTIVE_RECOMMENDATION_EVALUATION_PIPELINE_STAGES,
} from "./executiveRecommendationEvaluationEngineConstants.ts";
import {
  ExecutiveRecommendationEvaluationEngine,
  buildRecommendationEvaluations,
  evaluateExecutiveRecommendations,
  getRecommendationEvaluation,
  getRecommendationEvaluations,
  initializeRecommendationEvaluationEngine,
  recommendationEvaluationExists,
  registerRecommendationEvaluation,
  resetExecutiveRecommendationEvaluationEngineForTests,
  unregisterRecommendationEvaluation,
  validateRecommendationEvaluation,
  EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_SELF_MANIFEST,
} from "./executiveRecommendationEvaluationEngine.ts";
import { getRecommendationEvaluationRegistrySnapshot } from "./executiveRecommendationEvaluationEngineRegistry.ts";
import {
  bootstrapRecommendationEvaluationPlatform,
  resetExecutiveRecommendationEvaluationEnginePlatformForTests,
  runRecommendationEvaluationCertification,
} from "./executiveRecommendationEvaluationEngineRunner.ts";
import {
  hasDuplicateEvaluationIds,
  validateRecommendationEvaluationProvenance,
  validateRecommendationEvaluationRecord,
} from "./executiveRecommendationEvaluationEngineValidation.ts";
import { buildExecutiveRecommendationFoundation } from "./executiveRecommendationFoundation.ts";
import { resetExecutiveRecommendationPlatformForTests } from "./executiveRecommendationRunner.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-test-001";

function sourceRecord(
  providerId: keyof typeof EXECUTIVE_RECOMMENDATION_GENERATION_SOURCE_PROVIDER_MAP,
  suffix: string
): CertifiedRecommendationSourceRecordInput {
  const mapping = EXECUTIVE_RECOMMENDATION_GENERATION_SOURCE_PROVIDER_MAP[providerId];
  return Object.freeze({
    sourceId: `recommendation-source-${providerId}-${suffix}`,
    providerId,
    domain: mapping.defaultDomain,
    workspaceId: WORKSPACE,
    platformId: mapping.platformId,
    appId: mapping.defaultAppId,
    recordId: `${providerId}-record-${suffix}`,
    businessContext: `Executive advisory context for ${providerId} ${suffix}.`,
    summary: `Review ${providerId} matter ${suffix} from certified platform.`,
    sourceVersion: mapping.defaultAppId === "APP-5" ? "APP-5/1" : "APP-10/1",
    sourceApps: Object.freeze(["APP-5", "APP-6", "APP-8", "APP-9", "APP-10", "APP-11"]),
  });
}

function generateTestCandidates() {
  return generateExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "generation-session",
      sessionLabel: "Generation Session",
      sourceRecords: Object.freeze([
        sourceRecord("scenario-intelligence-provider", "001"),
        sourceRecord("decision-journal-provider", "002"),
        sourceRecord("executive-inbox-provider", "003"),
      ]),
      generationTimestamp: FIXED_TIME,
    })
  );
}

test.beforeEach(() => {
  bootstrapRecommendationEvaluationPlatform(FIXED_TIME);
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/executive-recommendation/executiveRecommendationEvaluationEngine.ts",
    allowedFiles: EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("evaluates executive recommendation candidates from APP-12:2", () => {
  const generation = generateTestCandidates();
  const result = evaluateExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "evaluation-session-001",
      sessionLabel: "Executive Evaluation Session",
      candidates: generation.candidates,
      evaluationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, true, result.reason);
  assert.equal(result.evaluations.length, 3);
  assert.equal(result.pipelineStages.length, EXECUTIVE_RECOMMENDATION_EVALUATION_PIPELINE_STAGES.length);
  assert.equal(Object.isFrozen(result), true);
  assert.ok(result.evaluations.every((entry) => Object.isFrozen(entry) && entry.readOnly === true));
});

test("evaluates all ten deterministic dimensions per candidate", () => {
  const generation = generateTestCandidates();
  const result = evaluateExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "evaluation-dimensions",
      sessionLabel: "Dimension Session",
      candidates: generation.candidates.slice(0, 1),
      evaluationTimestamp: FIXED_TIME,
    })
  );
  const evaluation = result.evaluations[0];
  assert.ok(evaluation);
  assert.equal(evaluation.dimensions.length, EXECUTIVE_RECOMMENDATION_EVALUATION_DIMENSION_KEYS.length);
  assert.ok(evaluation.dimensions.every((entry) => entry.rationale.length > 0));
});

test("preserves complete provenance on evaluations", () => {
  const generation = generateTestCandidates();
  const result = evaluateExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "evaluation-provenance",
      sessionLabel: "Provenance Session",
      candidates: generation.candidates.slice(0, 1),
      evaluationTimestamp: FIXED_TIME,
    })
  );
  const evaluation = result.evaluations[0];
  assert.ok(evaluation);
  assert.equal(validateRecommendationEvaluationProvenance(evaluation.provenance).valid, true);
  assert.equal(evaluation.provenance.foundationVersion, "APP-12/1");
  assert.equal(evaluation.provenance.generationVersion, "APP-12/2");
  assert.equal(evaluation.provenance.evaluationVersion, "APP-12/3");
});

test("registers retrieves and unregisters evaluations", () => {
  const generation = generateTestCandidates();
  const result = evaluateExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "evaluation-registry",
      sessionLabel: "Registry Session",
      candidates: generation.candidates.slice(0, 1),
      evaluationTimestamp: FIXED_TIME,
    })
  );
  const evaluationId = result.registeredEvaluationIds[0];
  assert.ok(evaluationId);
  assert.equal(recommendationEvaluationExists(evaluationId), true);
  assert.ok(getRecommendationEvaluation(evaluationId));
  assert.equal(getRecommendationEvaluations(WORKSPACE).length, 1);
  const removed = unregisterRecommendationEvaluation(evaluationId);
  assert.equal(removed.success, true);
  assert.equal(recommendationEvaluationExists(evaluationId), false);
});

test("rejects duplicate evaluation registration", () => {
  const generation = generateTestCandidates();
  const result = evaluateExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "evaluation-duplicate",
      sessionLabel: "Duplicate Session",
      candidates: generation.candidates.slice(0, 1),
      evaluationTimestamp: FIXED_TIME,
    })
  );
  const evaluation = result.evaluations[0];
  assert.ok(evaluation);
  const duplicate = registerRecommendationEvaluation(evaluation);
  assert.equal(duplicate.success, false);
  assert.equal(duplicate.error?.code, "duplicate_evaluation");
});

test("detects duplicate recommendation ids in evaluation request", () => {
  const generation = generateTestCandidates();
  const candidate = generation.candidates[0];
  assert.ok(candidate);
  const result = evaluateExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "evaluation-dup-candidate",
      sessionLabel: "Duplicate Candidate Session",
      candidates: Object.freeze([candidate, candidate]),
      evaluationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
});

test("rejects workspace mismatch during evaluation", () => {
  const generation = generateTestCandidates();
  const candidate = generation.candidates[0];
  assert.ok(candidate);
  const result = evaluateExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "evaluation-ws-mismatch",
      sessionLabel: "Workspace Mismatch Session",
      candidates: Object.freeze([
        Object.freeze({
          ...candidate,
          provenance: Object.freeze({
            ...candidate.provenance,
            workspaceId: "ws-other",
          }),
        }),
      ]),
      evaluationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
});

test("requires APP-12:1 foundation and APP-12:2 generation before evaluation", () => {
  resetExecutiveRecommendationPlatformForTests();
  resetExecutiveRecommendationGenerationEngineForTests();
  resetExecutiveRecommendationEvaluationEngineForTests();
  initializeRecommendationEvaluationEngine(FIXED_TIME);
  const generation = generateExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "orphan-generation",
      sessionLabel: "Orphan",
      sourceRecords: Object.freeze([sourceRecord("executive-intent-provider", "004")]),
      generationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(generation.success, false);
});

test("requires APP-12:2 generation engine before evaluation", () => {
  resetExecutiveRecommendationEvaluationEnginePlatformForTests();
  buildExecutiveRecommendationFoundation(FIXED_TIME);
  initializeRecommendationEvaluationEngine(FIXED_TIME);
  const generation = generateTestCandidates();
  assert.equal(generation.success, false);
  const result = evaluateExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "evaluation-no-generation",
      sessionLabel: "No Generation Session",
      candidates: Object.freeze([]),
      evaluationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
  assert.match(result.reason, /Generation/);
});

test("exports pipeline stages and evaluation dimensions", () => {
  assert.equal(EXECUTIVE_RECOMMENDATION_EVALUATION_PIPELINE_STAGES.length, 9);
  assert.equal(EXECUTIVE_RECOMMENDATION_EVALUATION_DIMENSION_KEYS.length, 10);
  assert.equal(EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_CONTRACT_VERSION, "APP-12/3");
});

test("enforces public API rules without ranking optimization or execution", () => {
  assert.equal(EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_PUBLIC_API_RULES.noRanking, true);
  assert.equal(EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_PUBLIC_API_RULES.noOptimization, true);
  assert.equal(EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_PUBLIC_API_RULES.noExecution, true);
  assert.equal(EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_PUBLIC_API_RULES.noComparison, true);
  assert.equal(EXECUTIVE_RECOMMENDATION_EVALUATION_ENGINE_PUBLIC_API_RULES.consumerOnly, true);
});

test("detects duplicate evaluation ids", () => {
  assert.equal(hasDuplicateEvaluationIds(["a", "b", "a"]), true);
  assert.equal(hasDuplicateEvaluationIds(["a", "b"]), false);
});

test("registry snapshot reflects registered evaluations", () => {
  const generation = generateTestCandidates();
  evaluateExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "evaluation-snapshot",
      sessionLabel: "Snapshot Session",
      candidates: generation.candidates.slice(0, 1),
      evaluationTimestamp: FIXED_TIME,
    })
  );
  const snapshot = getRecommendationEvaluationRegistrySnapshot();
  assert.equal(snapshot.evaluationCount, 1);
  assert.equal(snapshot.registryVersion, "APP-12/3");
});

test("ExecutiveRecommendationEvaluationEngine namespace exposes public APIs", () => {
  assert.equal(typeof ExecutiveRecommendationEvaluationEngine.evaluateExecutiveRecommendations, "function");
  assert.equal(typeof ExecutiveRecommendationEvaluationEngine.buildRecommendationEvaluations, "function");
  assert.equal(typeof ExecutiveRecommendationEvaluationEngine.validateRecommendationEvaluation, "function");
  assert.equal(ExecutiveRecommendationEvaluationEngine.version, "APP-12/3");
  assert.equal(ExecutiveRecommendationEvaluationEngine.foundationVersion, "APP-12/1");
  assert.equal(ExecutiveRecommendationEvaluationEngine.generationVersion, "APP-12/2");
});

test("buildRecommendationEvaluations produces evaluations without registry side effects", () => {
  const generation = generateTestCandidates();
  const evaluations = buildRecommendationEvaluations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "build-only-session",
      sessionLabel: "Build Only",
      candidates: generation.candidates.slice(0, 1),
      evaluationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(evaluations.length, 1);
  assert.equal(getRecommendationEvaluationRegistrySnapshot().evaluationCount, 0);
});

test("evaluation is deterministic for identical inputs", () => {
  const generation = generateTestCandidates();
  const request = Object.freeze({
    workspaceId: WORKSPACE,
    sessionId: "deterministic-session",
    sessionLabel: "Deterministic Session",
    candidates: generation.candidates,
    evaluationTimestamp: FIXED_TIME,
  });
  bootstrapRecommendationEvaluationPlatform(FIXED_TIME);
  const firstGen = generateTestCandidates();
  const first = evaluateExecutiveRecommendations(Object.freeze({ ...request, candidates: firstGen.candidates }));
  bootstrapRecommendationEvaluationPlatform(FIXED_TIME);
  const secondGen = generateTestCandidates();
  const second = evaluateExecutiveRecommendations(Object.freeze({ ...request, candidates: secondGen.candidates }));
  assert.deepEqual(
    first.evaluations.map((entry) => entry.evaluationId),
    second.evaluations.map((entry) => entry.evaluationId)
  );
});

test("regression: APP-9 and APP-10 platforms remain valid", () => {
  assert.equal(CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId, "APP-9");
  assert.equal(CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY.appId, "APP-10");
});

test("runs executive recommendation evaluation engine certification", () => {
  const result = runRecommendationEvaluationCertification(FIXED_TIME);
  assert.equal(
    result.certified,
    true,
    result.checks.filter((entry) => !entry.passed).map((entry) => entry.id).join(", ")
  );
  assert.equal(result.failedCount, 0);
  assert.ok(result.passedCount >= 20);
  assert.equal(result.phase, "APP-12/3");
});

test("validateRecommendationEvaluation validates evaluation requests", () => {
  const generation = generateTestCandidates();
  const validation = validateRecommendationEvaluation(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "validation-request",
      sessionLabel: "Validation Request",
      candidates: generation.candidates.slice(0, 1),
    })
  );
  assert.equal(validation.valid, true);
});

test("each evaluation includes explainable dimension rationales", () => {
  const generation = generateTestCandidates();
  const result = evaluateExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "evaluation-explainability",
      sessionLabel: "Explainability Session",
      candidates: generation.candidates.slice(0, 1),
      evaluationTimestamp: FIXED_TIME,
    })
  );
  const evaluation = result.evaluations[0];
  assert.ok(evaluation);
  assert.equal(validateRecommendationEvaluationRecord(evaluation).valid, true);
  assert.ok(evaluation.evaluationNotes.some((note) => note.includes("without ranking")));
});
