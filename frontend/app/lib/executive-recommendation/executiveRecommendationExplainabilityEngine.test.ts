import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY } from "../cross-scenario-learning/crossScenarioLearningContracts.ts";
import { CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY } from "../confidence-evolution/confidenceEvolutionContracts.ts";
import {
  evaluateExecutiveRecommendations,
} from "./executiveRecommendationEvaluationEngine.ts";
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
  EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_PUBLIC_API_RULES,
  EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_PIPELINE_STAGES,
  EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_SECTION_KEYS,
} from "./executiveRecommendationExplainabilityEngineConstants.ts";
import {
  ExecutiveRecommendationExplainabilityEngine,
  buildRecommendationExplanations,
  explainExecutiveRecommendations,
  getRecommendationExplanation,
  getRecommendationExplanations,
  initializeRecommendationExplainabilityEngine,
  recommendationExplanationExists,
  registerRecommendationExplanation,
  resetExecutiveRecommendationExplainabilityEngineForTests,
  unregisterRecommendationExplanation,
  validateRecommendationExplanation,
  EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_SELF_MANIFEST,
} from "./executiveRecommendationExplainabilityEngine.ts";
import { getRecommendationExplanationRegistrySnapshot } from "./executiveRecommendationExplainabilityEngineRegistry.ts";
import {
  bootstrapRecommendationExplainabilityPlatform,
  resetExecutiveRecommendationExplainabilityEnginePlatformForTests,
  runRecommendationExplainabilityCertification,
} from "./executiveRecommendationExplainabilityEngineRunner.ts";
import {
  hasDuplicateExplanationIds,
  validateRecommendationExplanationProvenance,
  validateRecommendationExplanationRecord,
} from "./executiveRecommendationExplainabilityEngineValidation.ts";
import { resetExecutiveRecommendationEvaluationEngineForTests } from "./executiveRecommendationEvaluationEngine.ts";
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

function generateTestEvaluations() {
  const generation = generateExecutiveRecommendations(
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
  return evaluateExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "evaluation-session",
      sessionLabel: "Evaluation Session",
      candidates: generation.candidates,
      evaluationTimestamp: FIXED_TIME,
    })
  );
}

test.beforeEach(() => {
  bootstrapRecommendationExplainabilityPlatform(FIXED_TIME);
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/executive-recommendation/executiveRecommendationExplainabilityEngine.ts",
    allowedFiles: EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("explains executive recommendations from APP-12:3 evaluations", () => {
  const evaluation = generateTestEvaluations();
  const result = explainExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "explainability-session-001",
      sessionLabel: "Executive Explainability Session",
      evaluations: evaluation.evaluations,
      explanationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, true, result.reason);
  assert.equal(result.explanations.length, 3);
  assert.equal(result.pipelineStages.length, EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_PIPELINE_STAGES.length);
  assert.equal(Object.isFrozen(result), true);
  assert.ok(result.explanations.every((entry) => Object.isFrozen(entry) && entry.readOnly === true));
});

test("generates all ten deterministic explanation sections per recommendation", () => {
  const evaluation = generateTestEvaluations();
  const result = explainExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "explainability-sections",
      sessionLabel: "Section Session",
      evaluations: evaluation.evaluations.slice(0, 1),
      explanationTimestamp: FIXED_TIME,
    })
  );
  const explanation = result.explanations[0];
  assert.ok(explanation);
  assert.equal(explanation.sections.length, EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_SECTION_KEYS.length);
  assert.ok(explanation.sections.every((section) => section.content.length > 0));
});

test("preserves complete provenance on explanations", () => {
  const evaluation = generateTestEvaluations();
  const result = explainExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "explainability-provenance",
      sessionLabel: "Provenance Session",
      evaluations: evaluation.evaluations.slice(0, 1),
      explanationTimestamp: FIXED_TIME,
    })
  );
  const explanation = result.explanations[0];
  assert.ok(explanation);
  assert.equal(validateRecommendationExplanationProvenance(explanation.provenance).valid, true);
  assert.equal(explanation.provenance.foundationVersion, "APP-12/1");
  assert.equal(explanation.provenance.generationVersion, "APP-12/2");
  assert.equal(explanation.provenance.evaluationVersion, "APP-12/3");
  assert.equal(explanation.provenance.explanationVersion, "APP-12/4");
});

test("registers retrieves and unregisters explanations", () => {
  const evaluation = generateTestEvaluations();
  const result = explainExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "explainability-registry",
      sessionLabel: "Registry Session",
      evaluations: evaluation.evaluations.slice(0, 1),
      explanationTimestamp: FIXED_TIME,
    })
  );
  const explanationId = result.registeredExplanationIds[0];
  assert.ok(explanationId);
  assert.equal(recommendationExplanationExists(explanationId), true);
  assert.ok(getRecommendationExplanation(explanationId));
  assert.equal(getRecommendationExplanations(WORKSPACE).length, 1);
  const removed = unregisterRecommendationExplanation(explanationId);
  assert.equal(removed.success, true);
  assert.equal(recommendationExplanationExists(explanationId), false);
});

test("rejects duplicate explanation registration", () => {
  const evaluation = generateTestEvaluations();
  const result = explainExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "explainability-duplicate",
      sessionLabel: "Duplicate Session",
      evaluations: evaluation.evaluations.slice(0, 1),
      explanationTimestamp: FIXED_TIME,
    })
  );
  const explanation = result.explanations[0];
  assert.ok(explanation);
  const duplicate = registerRecommendationExplanation(explanation);
  assert.equal(duplicate.success, false);
  assert.equal(duplicate.error?.code, "duplicate_explanation");
});

test("detects duplicate recommendation ids in explainability request", () => {
  const evaluation = generateTestEvaluations();
  const evalRecord = evaluation.evaluations[0];
  assert.ok(evalRecord);
  const result = explainExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "explainability-dup-eval",
      sessionLabel: "Duplicate Evaluation Session",
      evaluations: Object.freeze([evalRecord, evalRecord]),
      explanationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
});

test("rejects workspace mismatch during explanation", () => {
  const evaluation = generateTestEvaluations();
  const evalRecord = evaluation.evaluations[0];
  assert.ok(evalRecord);
  const result = explainExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "explainability-ws-mismatch",
      sessionLabel: "Workspace Mismatch Session",
      evaluations: Object.freeze([
        Object.freeze({
          ...evalRecord,
          provenance: Object.freeze({
            ...evalRecord.provenance,
            workspaceId: "ws-other",
          }),
        }),
      ]),
      explanationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
});

test("requires APP-12:1 APP-12:2 and APP-12:3 before explainability", () => {
  resetExecutiveRecommendationPlatformForTests();
  resetExecutiveRecommendationGenerationEngineForTests();
  resetExecutiveRecommendationEvaluationEngineForTests();
  resetExecutiveRecommendationExplainabilityEngineForTests();
  initializeRecommendationExplainabilityEngine(FIXED_TIME);
  const evaluation = generateTestEvaluations();
  assert.equal(evaluation.success, false);
});

test("requires APP-12:3 evaluation engine before explainability", () => {
  resetExecutiveRecommendationExplainabilityEnginePlatformForTests();
  buildExecutiveRecommendationFoundation(FIXED_TIME);
  initializeRecommendationGenerationEngine(FIXED_TIME);
  initializeRecommendationExplainabilityEngine(FIXED_TIME);
  const result = explainExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "explainability-no-evaluation",
      sessionLabel: "No Evaluation Session",
      evaluations: Object.freeze([]),
      explanationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
  assert.match(result.reason, /Evaluation/);
});

test("exports pipeline stages and explanation sections", () => {
  assert.equal(EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_PIPELINE_STAGES.length, 9);
  assert.equal(EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_SECTION_KEYS.length, 10);
  assert.equal(EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_CONTRACT_VERSION, "APP-12/4");
});

test("enforces public API rules without generation evaluation ranking or execution", () => {
  assert.equal(EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_PUBLIC_API_RULES.noGeneration, true);
  assert.equal(EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_PUBLIC_API_RULES.noEvaluation, true);
  assert.equal(EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_PUBLIC_API_RULES.noRanking, true);
  assert.equal(EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_PUBLIC_API_RULES.noLlmReasoning, true);
  assert.equal(EXECUTIVE_RECOMMENDATION_EXPLAINABILITY_ENGINE_PUBLIC_API_RULES.consumerOnly, true);
});

test("detects duplicate explanation ids", () => {
  assert.equal(hasDuplicateExplanationIds(["a", "b", "a"]), true);
  assert.equal(hasDuplicateExplanationIds(["a", "b"]), false);
});

test("registry snapshot reflects registered explanations", () => {
  const evaluation = generateTestEvaluations();
  explainExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "explainability-snapshot",
      sessionLabel: "Snapshot Session",
      evaluations: evaluation.evaluations.slice(0, 1),
      explanationTimestamp: FIXED_TIME,
    })
  );
  const snapshot = getRecommendationExplanationRegistrySnapshot();
  assert.equal(snapshot.explanationCount, 1);
  assert.equal(snapshot.registryVersion, "APP-12/4");
});

test("ExecutiveRecommendationExplainabilityEngine namespace exposes public APIs", () => {
  assert.equal(typeof ExecutiveRecommendationExplainabilityEngine.explainExecutiveRecommendations, "function");
  assert.equal(typeof ExecutiveRecommendationExplainabilityEngine.buildRecommendationExplanations, "function");
  assert.equal(typeof ExecutiveRecommendationExplainabilityEngine.validateRecommendationExplanation, "function");
  assert.equal(ExecutiveRecommendationExplainabilityEngine.version, "APP-12/4");
  assert.equal(ExecutiveRecommendationExplainabilityEngine.foundationVersion, "APP-12/1");
  assert.equal(ExecutiveRecommendationExplainabilityEngine.evaluationVersion, "APP-12/3");
});

test("buildRecommendationExplanations produces explanations without registry side effects", () => {
  const evaluation = generateTestEvaluations();
  const explanations = buildRecommendationExplanations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "build-only-session",
      sessionLabel: "Build Only",
      evaluations: evaluation.evaluations.slice(0, 1),
      explanationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(explanations.length, 1);
  assert.equal(getRecommendationExplanationRegistrySnapshot().explanationCount, 0);
});

test("explanation is deterministic for identical inputs", () => {
  const evaluation = generateTestEvaluations();
  const request = Object.freeze({
    workspaceId: WORKSPACE,
    sessionId: "deterministic-session",
    sessionLabel: "Deterministic Session",
    evaluations: evaluation.evaluations,
    explanationTimestamp: FIXED_TIME,
  });
  bootstrapRecommendationExplainabilityPlatform(FIXED_TIME);
  const firstEval = generateTestEvaluations();
  const first = explainExecutiveRecommendations(Object.freeze({ ...request, evaluations: firstEval.evaluations }));
  bootstrapRecommendationExplainabilityPlatform(FIXED_TIME);
  const secondEval = generateTestEvaluations();
  const second = explainExecutiveRecommendations(Object.freeze({ ...request, evaluations: secondEval.evaluations }));
  assert.deepEqual(
    first.explanations.map((entry) => entry.explanationId),
    second.explanations.map((entry) => entry.explanationId)
  );
});

test("regression: APP-9 and APP-10 platforms remain valid", () => {
  assert.equal(CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId, "APP-9");
  assert.equal(CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY.appId, "APP-10");
});

test("runs executive recommendation explainability engine certification", () => {
  const result = runRecommendationExplainabilityCertification(FIXED_TIME);
  assert.equal(
    result.certified,
    true,
    result.checks.filter((entry) => !entry.passed).map((entry) => entry.id).join(", ")
  );
  assert.equal(result.failedCount, 0);
  assert.ok(result.passedCount >= 20);
  assert.equal(result.phase, "APP-12/4");
});

test("validateRecommendationExplanation validates explainability requests", () => {
  const evaluation = generateTestEvaluations();
  const validation = validateRecommendationExplanation(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "validation-request",
      sessionLabel: "Validation Request",
      evaluations: evaluation.evaluations.slice(0, 1),
    })
  );
  assert.equal(validation.valid, true);
});

test("each explanation answers why evidence platforms and risks", () => {
  const evaluation = generateTestEvaluations();
  const result = explainExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "explainability-traceability",
      sessionLabel: "Traceability Session",
      evaluations: evaluation.evaluations.slice(0, 1),
      explanationTimestamp: FIXED_TIME,
    })
  );
  const explanation = result.explanations[0];
  assert.ok(explanation);
  assert.equal(validateRecommendationExplanationRecord(explanation).valid, true);
  const sectionKeys = explanation.sections.map((section) => section.sectionKey);
  assert.ok(sectionKeys.includes("executive_summary"));
  assert.ok(sectionKeys.includes("supporting_evidence"));
  assert.ok(sectionKeys.includes("risk_considerations"));
  assert.ok(sectionKeys.includes("provenance_summary"));
  assert.ok(explanation.summary.narrative.includes("No black-box"));
});
