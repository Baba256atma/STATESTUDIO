import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY } from "../cross-scenario-learning/crossScenarioLearningContracts.ts";
import { CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY } from "../confidence-evolution/confidenceEvolutionContracts.ts";
import {
  evaluateExecutiveRecommendations,
  initializeRecommendationEvaluationEngine,
  resetExecutiveRecommendationEvaluationEngineForTests,
} from "./executiveRecommendationEvaluationEngine.ts";
import {
  explainExecutiveRecommendations,
  initializeRecommendationExplainabilityEngine,
  resetExecutiveRecommendationExplainabilityEngineForTests,
} from "./executiveRecommendationExplainabilityEngine.ts";
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
  initializeRecommendationGovernanceEngine,
  resetExecutiveRecommendationGovernanceEngineForTests,
  validateExecutiveRecommendationGovernance,
} from "./executiveRecommendationGovernanceEngine.ts";
import {
  EXECUTIVE_RECOMMENDATION_OPTIMIZATION_DIMENSION_KEYS,
  EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_PUBLIC_API_RULES,
  EXECUTIVE_RECOMMENDATION_OPTIMIZATION_PIPELINE_STAGES,
} from "./executiveRecommendationOptimizationEngineConstants.ts";
import {
  ExecutiveRecommendationOptimizationEngine,
  buildRecommendationOptimizations,
  getRecommendationOptimization,
  getRecommendationOptimizations,
  initializeRecommendationOptimizationEngine,
  optimizeExecutiveRecommendations,
  registerRecommendationOptimization,
  resetExecutiveRecommendationOptimizationEngineForTests,
  unregisterRecommendationOptimization,
  validateRecommendationOptimization,
  recommendationOptimizationExists,
  EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_SELF_MANIFEST,
} from "./executiveRecommendationOptimizationEngine.ts";
import { getRecommendationOptimizationRegistrySnapshot } from "./executiveRecommendationOptimizationEngineRegistry.ts";
import {
  bootstrapRecommendationOptimizationPlatform,
  resetExecutiveRecommendationOptimizationEnginePlatformForTests,
  runRecommendationOptimizationCertification,
} from "./executiveRecommendationOptimizationEngineRunner.ts";
import {
  hasDuplicateOptimizationIds,
  validateRecommendationOptimizationProvenance,
  validateRecommendationOptimizationRecord,
} from "./executiveRecommendationOptimizationEngineValidation.ts";
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

function generateTestGovernanceRecords() {
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
  const evaluation = evaluateExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "evaluation-session",
      sessionLabel: "Evaluation Session",
      candidates: generation.candidates,
      evaluationTimestamp: FIXED_TIME,
    })
  );
  const explanation = explainExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "explainability-session",
      sessionLabel: "Explainability Session",
      evaluations: evaluation.evaluations,
      explanationTimestamp: FIXED_TIME,
    })
  );
  return validateExecutiveRecommendationGovernance(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "governance-session",
      sessionLabel: "Governance Session",
      explanations: explanation.explanations,
      governanceTimestamp: FIXED_TIME,
    })
  );
}

test.beforeEach(() => {
  bootstrapRecommendationOptimizationPlatform(FIXED_TIME);
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/executive-recommendation/executiveRecommendationOptimizationEngine.ts",
    allowedFiles: EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("optimizes executive recommendations from APP-12:5 governance records", () => {
  const governance = generateTestGovernanceRecords();
  const result = optimizeExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "optimization-session-001",
      sessionLabel: "Executive Optimization Session",
      governanceRecords: governance.governanceRecords,
      optimizationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, true, result.reason);
  assert.equal(result.optimizations.length, 3);
  assert.equal(result.pipelineStages.length, EXECUTIVE_RECOMMENDATION_OPTIMIZATION_PIPELINE_STAGES.length);
  assert.equal(Object.isFrozen(result), true);
  assert.ok(result.optimizations.every((entry) => Object.isFrozen(entry) && entry.readOnly === true));
});

test("evaluates all ten optimization dimensions per recommendation", () => {
  const governance = generateTestGovernanceRecords();
  const result = optimizeExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "optimization-dimensions",
      sessionLabel: "Dimension Session",
      governanceRecords: governance.governanceRecords.slice(0, 1),
      optimizationTimestamp: FIXED_TIME,
    })
  );
  const optimization = result.optimizations[0];
  assert.ok(optimization);
  assert.equal(optimization.dimensions.length, EXECUTIVE_RECOMMENDATION_OPTIMIZATION_DIMENSION_KEYS.length);
  assert.ok(optimization.dimensions.every((entry) => entry.rationale.length > 0));
});

test("preserves governance and intent on optimization variants", () => {
  const governance = generateTestGovernanceRecords();
  const result = optimizeExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "optimization-governance",
      sessionLabel: "Governance Preservation Session",
      governanceRecords: governance.governanceRecords.slice(0, 1),
      optimizationTimestamp: FIXED_TIME,
    })
  );
  const optimization = result.optimizations[0];
  assert.ok(optimization);
  assert.equal(optimization.variant.intentPreserved, true);
  assert.equal(optimization.variant.governancePreserved, true);
  assert.ok(optimization.variant.proposedAdjustments.length > 0);
});

test("preserves complete provenance on optimization records", () => {
  const governance = generateTestGovernanceRecords();
  const result = optimizeExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "optimization-provenance",
      sessionLabel: "Provenance Session",
      governanceRecords: governance.governanceRecords.slice(0, 1),
      optimizationTimestamp: FIXED_TIME,
    })
  );
  const optimization = result.optimizations[0];
  assert.ok(optimization);
  assert.equal(validateRecommendationOptimizationProvenance(optimization.provenance).valid, true);
  assert.equal(optimization.provenance.foundationVersion, "APP-12/1");
  assert.equal(optimization.provenance.generationVersion, "APP-12/2");
  assert.equal(optimization.provenance.evaluationVersion, "APP-12/3");
  assert.equal(optimization.provenance.explanationVersion, "APP-12/4");
  assert.equal(optimization.provenance.governanceVersion, "APP-12/5");
  assert.equal(optimization.provenance.optimizationVersion, "APP-12/6");
});

test("registers retrieves and unregisters optimization records", () => {
  const governance = generateTestGovernanceRecords();
  const result = optimizeExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "optimization-registry",
      sessionLabel: "Registry Session",
      governanceRecords: governance.governanceRecords.slice(0, 1),
      optimizationTimestamp: FIXED_TIME,
    })
  );
  const optimizationId = result.registeredOptimizationIds[0];
  assert.ok(optimizationId);
  assert.equal(recommendationOptimizationExists(optimizationId), true);
  assert.ok(getRecommendationOptimization(optimizationId));
  assert.equal(getRecommendationOptimizations(WORKSPACE).length, 1);
  const removed = unregisterRecommendationOptimization(optimizationId);
  assert.equal(removed.success, true);
  assert.equal(recommendationOptimizationExists(optimizationId), false);
});

test("rejects duplicate optimization registration", () => {
  const governance = generateTestGovernanceRecords();
  const result = optimizeExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "optimization-duplicate",
      sessionLabel: "Duplicate Session",
      governanceRecords: governance.governanceRecords.slice(0, 1),
      optimizationTimestamp: FIXED_TIME,
    })
  );
  const optimization = result.optimizations[0];
  assert.ok(optimization);
  const duplicate = registerRecommendationOptimization(optimization);
  assert.equal(duplicate.success, false);
  assert.equal(duplicate.error?.code, "duplicate_optimization");
});

test("detects duplicate recommendation ids in optimization request", () => {
  const governance = generateTestGovernanceRecords();
  const governanceRecord = governance.governanceRecords[0];
  assert.ok(governanceRecord);
  const result = optimizeExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "optimization-dup-governance",
      sessionLabel: "Duplicate Governance Session",
      governanceRecords: Object.freeze([governanceRecord, governanceRecord]),
      optimizationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
});

test("rejects workspace mismatch during optimization validation", () => {
  const governance = generateTestGovernanceRecords();
  const governanceRecord = governance.governanceRecords[0];
  assert.ok(governanceRecord);
  const result = optimizeExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "optimization-ws-mismatch",
      sessionLabel: "Workspace Mismatch Session",
      governanceRecords: Object.freeze([
        Object.freeze({
          ...governanceRecord,
          provenance: Object.freeze({
            ...governanceRecord.provenance,
            workspaceId: "ws-other",
          }),
        }),
      ]),
      optimizationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
});

test("requires APP-12:1 through APP-12:5 before optimization", () => {
  resetExecutiveRecommendationPlatformForTests();
  resetExecutiveRecommendationGenerationEngineForTests();
  resetExecutiveRecommendationEvaluationEngineForTests();
  resetExecutiveRecommendationExplainabilityEngineForTests();
  resetExecutiveRecommendationGovernanceEngineForTests();
  resetExecutiveRecommendationOptimizationEngineForTests();
  const governance = generateTestGovernanceRecords();
  assert.equal(governance.success, false);
});

test("requires APP-12:5 governance engine before optimization", () => {
  resetExecutiveRecommendationOptimizationEnginePlatformForTests();
  buildExecutiveRecommendationFoundation(FIXED_TIME);
  initializeRecommendationGenerationEngine(FIXED_TIME);
  initializeRecommendationEvaluationEngine(FIXED_TIME);
  initializeRecommendationExplainabilityEngine(FIXED_TIME);
  initializeRecommendationOptimizationEngine(FIXED_TIME);
  const result = optimizeExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "optimization-no-governance",
      sessionLabel: "No Governance Session",
      governanceRecords: Object.freeze([]),
      optimizationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
  assert.match(result.reason, /Governance/);
});

test("exports pipeline stages and optimization dimensions", () => {
  assert.equal(EXECUTIVE_RECOMMENDATION_OPTIMIZATION_PIPELINE_STAGES.length, 10);
  assert.equal(EXECUTIVE_RECOMMENDATION_OPTIMIZATION_DIMENSION_KEYS.length, 10);
  assert.equal(EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_CONTRACT_VERSION, "APP-12/6");
});

test("enforces public API rules without execution approval or original mutation", () => {
  assert.equal(EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_PUBLIC_API_RULES.noOriginalMutation, true);
  assert.equal(EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_PUBLIC_API_RULES.noExecution, true);
  assert.equal(EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_PUBLIC_API_RULES.noApproval, true);
  assert.equal(EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_PUBLIC_API_RULES.noGeneration, true);
  assert.equal(EXECUTIVE_RECOMMENDATION_OPTIMIZATION_ENGINE_PUBLIC_API_RULES.consumerOnly, true);
});

test("detects duplicate optimization ids", () => {
  assert.equal(hasDuplicateOptimizationIds(["a", "b", "a"]), true);
  assert.equal(hasDuplicateOptimizationIds(["a", "b"]), false);
});

test("registry snapshot reflects registered optimization records", () => {
  const governance = generateTestGovernanceRecords();
  optimizeExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "optimization-snapshot",
      sessionLabel: "Snapshot Session",
      governanceRecords: governance.governanceRecords.slice(0, 1),
      optimizationTimestamp: FIXED_TIME,
    })
  );
  const snapshot = getRecommendationOptimizationRegistrySnapshot();
  assert.equal(snapshot.optimizationCount, 1);
  assert.equal(snapshot.registryVersion, "APP-12/6");
});

test("ExecutiveRecommendationOptimizationEngine namespace exposes public APIs", () => {
  assert.equal(typeof ExecutiveRecommendationOptimizationEngine.optimizeExecutiveRecommendations, "function");
  assert.equal(typeof ExecutiveRecommendationOptimizationEngine.buildRecommendationOptimizations, "function");
  assert.equal(typeof ExecutiveRecommendationOptimizationEngine.validateRecommendationOptimization, "function");
  assert.equal(ExecutiveRecommendationOptimizationEngine.version, "APP-12/6");
  assert.equal(ExecutiveRecommendationOptimizationEngine.governanceVersion, "APP-12/5");
});

test("buildRecommendationOptimizations produces profiles without registry side effects", () => {
  const governance = generateTestGovernanceRecords();
  const optimizations = buildRecommendationOptimizations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "build-only-session",
      sessionLabel: "Build Only",
      governanceRecords: governance.governanceRecords.slice(0, 1),
      optimizationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(optimizations.length, 1);
  assert.equal(getRecommendationOptimizationRegistrySnapshot().optimizationCount, 0);
});

test("optimization is deterministic for identical inputs", () => {
  const governance = generateTestGovernanceRecords();
  const request = Object.freeze({
    workspaceId: WORKSPACE,
    sessionId: "deterministic-session",
    sessionLabel: "Deterministic Session",
    governanceRecords: governance.governanceRecords,
    optimizationTimestamp: FIXED_TIME,
  });
  bootstrapRecommendationOptimizationPlatform(FIXED_TIME);
  const firstGovernance = generateTestGovernanceRecords();
  const first = optimizeExecutiveRecommendations(
    Object.freeze({ ...request, governanceRecords: firstGovernance.governanceRecords })
  );
  bootstrapRecommendationOptimizationPlatform(FIXED_TIME);
  const secondGovernance = generateTestGovernanceRecords();
  const second = optimizeExecutiveRecommendations(
    Object.freeze({ ...request, governanceRecords: secondGovernance.governanceRecords })
  );
  assert.deepEqual(
    first.optimizations.map((entry) => entry.optimizationId),
    second.optimizations.map((entry) => entry.optimizationId)
  );
});

test("regression: APP-9 and APP-10 platforms remain valid", () => {
  assert.equal(CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId, "APP-9");
  assert.equal(CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY.appId, "APP-10");
});

test("runs executive recommendation optimization engine certification", () => {
  const result = runRecommendationOptimizationCertification(FIXED_TIME);
  assert.equal(
    result.certified,
    true,
    result.checks.filter((entry) => !entry.passed).map((entry) => entry.id).join(", ")
  );
  assert.equal(result.failedCount, 0);
  assert.ok(result.passedCount >= 20);
  assert.equal(result.phase, "APP-12/6");
});

test("validateRecommendationOptimization validates optimization requests", () => {
  const governance = generateTestGovernanceRecords();
  const validation = validateRecommendationOptimization(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "validation-request",
      sessionLabel: "Validation Request",
      governanceRecords: governance.governanceRecords.slice(0, 1),
    })
  );
  assert.equal(validation.valid, true);
});

test("optimization summary confirms original recommendation not modified", () => {
  const governance = generateTestGovernanceRecords();
  const result = optimizeExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "optimization-summary",
      sessionLabel: "Summary Session",
      governanceRecords: governance.governanceRecords.slice(0, 1),
      optimizationTimestamp: FIXED_TIME,
    })
  );
  const optimization = result.optimizations[0];
  assert.ok(optimization);
  assert.equal(validateRecommendationOptimizationRecord(optimization).valid, true);
  assert.ok(optimization.summary.narrative.includes("preserved"));
});
