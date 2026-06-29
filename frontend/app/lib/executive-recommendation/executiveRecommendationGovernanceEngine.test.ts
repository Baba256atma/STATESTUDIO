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
  EXECUTIVE_RECOMMENDATION_GOVERNANCE_DIMENSION_KEYS,
  EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_PUBLIC_API_RULES,
  EXECUTIVE_RECOMMENDATION_GOVERNANCE_PIPELINE_STAGES,
} from "./executiveRecommendationGovernanceEngineConstants.ts";
import {
  ExecutiveRecommendationGovernanceEngine,
  buildRecommendationGovernanceProfiles,
  getRecommendationGovernance,
  getRecommendationGovernances,
  registerRecommendationGovernance,
  resetExecutiveRecommendationGovernanceEngineForTests,
  unregisterRecommendationGovernance,
  validateExecutiveRecommendationGovernance,
  validateRecommendationGovernance,
  recommendationGovernanceExists,
  initializeRecommendationGovernanceEngine,
  EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_SELF_MANIFEST,
} from "./executiveRecommendationGovernanceEngine.ts";
import { getRecommendationGovernanceRegistrySnapshot } from "./executiveRecommendationGovernanceEngineRegistry.ts";
import {
  bootstrapRecommendationGovernancePlatform,
  resetExecutiveRecommendationGovernanceEnginePlatformForTests,
  runRecommendationGovernanceCertification,
} from "./executiveRecommendationGovernanceEngineRunner.ts";
import {
  hasDuplicateGovernanceIds,
  validateRecommendationGovernanceProvenance,
  validateRecommendationGovernanceRecord,
} from "./executiveRecommendationGovernanceEngineValidation.ts";
import { resetExecutiveRecommendationExplainabilityEngineForTests } from "./executiveRecommendationExplainabilityEngine.ts";
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

function generateTestExplanations() {
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
  return explainExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "explainability-session",
      sessionLabel: "Explainability Session",
      evaluations: evaluation.evaluations,
      explanationTimestamp: FIXED_TIME,
    })
  );
}

test.beforeEach(() => {
  bootstrapRecommendationGovernancePlatform(FIXED_TIME);
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/executive-recommendation/executiveRecommendationGovernanceEngine.ts",
    allowedFiles: EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("validates governance for executive recommendations from APP-12:4 explanations", () => {
  const explanation = generateTestExplanations();
  const result = validateExecutiveRecommendationGovernance(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "governance-session-001",
      sessionLabel: "Executive Governance Session",
      explanations: explanation.explanations,
      governanceTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, true, result.reason);
  assert.equal(result.governanceRecords.length, 3);
  assert.equal(result.pipelineStages.length, EXECUTIVE_RECOMMENDATION_GOVERNANCE_PIPELINE_STAGES.length);
  assert.equal(Object.isFrozen(result), true);
  assert.ok(result.governanceRecords.every((entry) => Object.isFrozen(entry) && entry.readOnly === true));
});

test("evaluates all ten governance dimensions per recommendation", () => {
  const explanation = generateTestExplanations();
  const result = validateExecutiveRecommendationGovernance(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "governance-dimensions",
      sessionLabel: "Dimension Session",
      explanations: explanation.explanations.slice(0, 1),
      governanceTimestamp: FIXED_TIME,
    })
  );
  const governance = result.governanceRecords[0];
  assert.ok(governance);
  assert.equal(governance.dimensions.length, EXECUTIVE_RECOMMENDATION_GOVERNANCE_DIMENSION_KEYS.length);
  assert.ok(governance.dimensions.every((entry) => entry.rationale.length > 0));
});

test("validates constraints and policies independently", () => {
  const explanation = generateTestExplanations();
  const result = validateExecutiveRecommendationGovernance(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "governance-constraints",
      sessionLabel: "Constraint Session",
      explanations: explanation.explanations.slice(0, 1),
      governanceTimestamp: FIXED_TIME,
    })
  );
  const governance = result.governanceRecords[0];
  assert.ok(governance);
  assert.equal(governance.constraintResults.length, 4);
  assert.equal(governance.policyResults.length, 4);
  assert.ok(governance.constraintResults.every((entry) => entry.rationale.length > 0));
  assert.ok(governance.policyResults.every((entry) => entry.rationale.length > 0));
});

test("preserves complete provenance on governance records", () => {
  const explanation = generateTestExplanations();
  const result = validateExecutiveRecommendationGovernance(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "governance-provenance",
      sessionLabel: "Provenance Session",
      explanations: explanation.explanations.slice(0, 1),
      governanceTimestamp: FIXED_TIME,
    })
  );
  const governance = result.governanceRecords[0];
  assert.ok(governance);
  assert.equal(validateRecommendationGovernanceProvenance(governance.provenance).valid, true);
  assert.equal(governance.provenance.foundationVersion, "APP-12/1");
  assert.equal(governance.provenance.generationVersion, "APP-12/2");
  assert.equal(governance.provenance.evaluationVersion, "APP-12/3");
  assert.equal(governance.provenance.explanationVersion, "APP-12/4");
  assert.equal(governance.provenance.governanceVersion, "APP-12/5");
});

test("registers retrieves and unregisters governance records", () => {
  const explanation = generateTestExplanations();
  const result = validateExecutiveRecommendationGovernance(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "governance-registry",
      sessionLabel: "Registry Session",
      explanations: explanation.explanations.slice(0, 1),
      governanceTimestamp: FIXED_TIME,
    })
  );
  const governanceId = result.registeredGovernanceIds[0];
  assert.ok(governanceId);
  assert.equal(recommendationGovernanceExists(governanceId), true);
  assert.ok(getRecommendationGovernance(governanceId));
  assert.equal(getRecommendationGovernances(WORKSPACE).length, 1);
  const removed = unregisterRecommendationGovernance(governanceId);
  assert.equal(removed.success, true);
  assert.equal(recommendationGovernanceExists(governanceId), false);
});

test("rejects duplicate governance registration", () => {
  const explanation = generateTestExplanations();
  const result = validateExecutiveRecommendationGovernance(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "governance-duplicate",
      sessionLabel: "Duplicate Session",
      explanations: explanation.explanations.slice(0, 1),
      governanceTimestamp: FIXED_TIME,
    })
  );
  const governance = result.governanceRecords[0];
  assert.ok(governance);
  const duplicate = registerRecommendationGovernance(governance);
  assert.equal(duplicate.success, false);
  assert.equal(duplicate.error?.code, "duplicate_governance");
});

test("detects duplicate recommendation ids in governance request", () => {
  const explanation = generateTestExplanations();
  const explanationRecord = explanation.explanations[0];
  assert.ok(explanationRecord);
  const result = validateExecutiveRecommendationGovernance(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "governance-dup-explanation",
      sessionLabel: "Duplicate Explanation Session",
      explanations: Object.freeze([explanationRecord, explanationRecord]),
      governanceTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
});

test("rejects workspace mismatch during governance validation", () => {
  const explanation = generateTestExplanations();
  const explanationRecord = explanation.explanations[0];
  assert.ok(explanationRecord);
  const result = validateExecutiveRecommendationGovernance(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "governance-ws-mismatch",
      sessionLabel: "Workspace Mismatch Session",
      explanations: Object.freeze([
        Object.freeze({
          ...explanationRecord,
          provenance: Object.freeze({
            ...explanationRecord.provenance,
            workspaceId: "ws-other",
          }),
        }),
      ]),
      governanceTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
});

test("requires APP-12:1 through APP-12:4 before governance", () => {
  resetExecutiveRecommendationPlatformForTests();
  resetExecutiveRecommendationGenerationEngineForTests();
  resetExecutiveRecommendationEvaluationEngineForTests();
  resetExecutiveRecommendationExplainabilityEngineForTests();
  resetExecutiveRecommendationGovernanceEngineForTests();
  const explanation = generateTestExplanations();
  assert.equal(explanation.success, false);
});

test("requires APP-12:4 explainability engine before governance", () => {
  resetExecutiveRecommendationGovernanceEnginePlatformForTests();
  buildExecutiveRecommendationFoundation(FIXED_TIME);
  initializeRecommendationGenerationEngine(FIXED_TIME);
  initializeRecommendationEvaluationEngine(FIXED_TIME);
  initializeRecommendationGovernanceEngine(FIXED_TIME);
  const result = validateExecutiveRecommendationGovernance(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "governance-no-explainability",
      sessionLabel: "No Explainability Session",
      explanations: Object.freeze([]),
      governanceTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
  assert.match(result.reason, /Explainability/);
});

test("exports pipeline stages and governance dimensions", () => {
  assert.equal(EXECUTIVE_RECOMMENDATION_GOVERNANCE_PIPELINE_STAGES.length, 10);
  assert.equal(EXECUTIVE_RECOMMENDATION_GOVERNANCE_DIMENSION_KEYS.length, 10);
  assert.equal(EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_CONTRACT_VERSION, "APP-12/5");
});

test("enforces public API rules without modification optimization or approval", () => {
  assert.equal(EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_PUBLIC_API_RULES.noModification, true);
  assert.equal(EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_PUBLIC_API_RULES.noOptimization, true);
  assert.equal(EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_PUBLIC_API_RULES.noApproval, true);
  assert.equal(EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_PUBLIC_API_RULES.noGeneration, true);
  assert.equal(EXECUTIVE_RECOMMENDATION_GOVERNANCE_ENGINE_PUBLIC_API_RULES.consumerOnly, true);
});

test("detects duplicate governance ids", () => {
  assert.equal(hasDuplicateGovernanceIds(["a", "b", "a"]), true);
  assert.equal(hasDuplicateGovernanceIds(["a", "b"]), false);
});

test("registry snapshot reflects registered governance records", () => {
  const explanation = generateTestExplanations();
  validateExecutiveRecommendationGovernance(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "governance-snapshot",
      sessionLabel: "Snapshot Session",
      explanations: explanation.explanations.slice(0, 1),
      governanceTimestamp: FIXED_TIME,
    })
  );
  const snapshot = getRecommendationGovernanceRegistrySnapshot();
  assert.equal(snapshot.governanceCount, 1);
  assert.equal(snapshot.registryVersion, "APP-12/5");
});

test("ExecutiveRecommendationGovernanceEngine namespace exposes public APIs", () => {
  assert.equal(typeof ExecutiveRecommendationGovernanceEngine.validateExecutiveRecommendationGovernance, "function");
  assert.equal(typeof ExecutiveRecommendationGovernanceEngine.buildRecommendationGovernanceProfiles, "function");
  assert.equal(typeof ExecutiveRecommendationGovernanceEngine.validateRecommendationGovernance, "function");
  assert.equal(ExecutiveRecommendationGovernanceEngine.version, "APP-12/5");
  assert.equal(ExecutiveRecommendationGovernanceEngine.explainabilityVersion, "APP-12/4");
});

test("buildRecommendationGovernanceProfiles produces profiles without registry side effects", () => {
  const explanation = generateTestExplanations();
  const profiles = buildRecommendationGovernanceProfiles(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "build-only-session",
      sessionLabel: "Build Only",
      explanations: explanation.explanations.slice(0, 1),
      governanceTimestamp: FIXED_TIME,
    })
  );
  assert.equal(profiles.length, 1);
  assert.equal(getRecommendationGovernanceRegistrySnapshot().governanceCount, 0);
});

test("governance validation is deterministic for identical inputs", () => {
  const explanation = generateTestExplanations();
  const request = Object.freeze({
    workspaceId: WORKSPACE,
    sessionId: "deterministic-session",
    sessionLabel: "Deterministic Session",
    explanations: explanation.explanations,
    governanceTimestamp: FIXED_TIME,
  });
  bootstrapRecommendationGovernancePlatform(FIXED_TIME);
  const firstExplanation = generateTestExplanations();
  const first = validateExecutiveRecommendationGovernance(
    Object.freeze({ ...request, explanations: firstExplanation.explanations })
  );
  bootstrapRecommendationGovernancePlatform(FIXED_TIME);
  const secondExplanation = generateTestExplanations();
  const second = validateExecutiveRecommendationGovernance(
    Object.freeze({ ...request, explanations: secondExplanation.explanations })
  );
  assert.deepEqual(
    first.governanceRecords.map((entry) => entry.governanceId),
    second.governanceRecords.map((entry) => entry.governanceId)
  );
});

test("regression: APP-9 and APP-10 platforms remain valid", () => {
  assert.equal(CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId, "APP-9");
  assert.equal(CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY.appId, "APP-10");
});

test("runs executive recommendation governance engine certification", () => {
  const result = runRecommendationGovernanceCertification(FIXED_TIME);
  assert.equal(
    result.certified,
    true,
    result.checks.filter((entry) => !entry.passed).map((entry) => entry.id).join(", ")
  );
  assert.equal(result.failedCount, 0);
  assert.ok(result.passedCount >= 20);
  assert.equal(result.phase, "APP-12/5");
});

test("validateRecommendationGovernance validates governance requests", () => {
  const explanation = generateTestExplanations();
  const validation = validateRecommendationGovernance(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "validation-request",
      sessionLabel: "Validation Request",
      explanations: explanation.explanations.slice(0, 1),
    })
  );
  assert.equal(validation.valid, true);
});

test("governance summary confirms recommendation not modified", () => {
  const explanation = generateTestExplanations();
  const result = validateExecutiveRecommendationGovernance(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "governance-summary",
      sessionLabel: "Summary Session",
      explanations: explanation.explanations.slice(0, 1),
      governanceTimestamp: FIXED_TIME,
    })
  );
  const governance = result.governanceRecords[0];
  assert.ok(governance);
  assert.equal(validateRecommendationGovernanceRecord(governance).valid, true);
  assert.ok(governance.summary.narrative.includes("not modified"));
});
