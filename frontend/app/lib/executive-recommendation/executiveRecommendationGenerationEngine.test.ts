import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY } from "../cross-scenario-learning/crossScenarioLearningContracts.ts";
import { CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY } from "../confidence-evolution/confidenceEvolutionContracts.ts";
import { buildExecutiveRecommendationFoundation } from "./executiveRecommendationFoundation.ts";
import {
  EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_PUBLIC_API_RULES,
  EXECUTIVE_RECOMMENDATION_GENERATION_PIPELINE_STAGES,
  EXECUTIVE_RECOMMENDATION_GENERATION_SOURCE_PROVIDER_MAP,
} from "./executiveRecommendationGenerationEngineConstants.ts";
import {
  ExecutiveRecommendationGenerationEngine,
  buildRecommendationCandidates,
  generateExecutiveRecommendations,
  getRecommendationCandidate,
  getRecommendationCandidates,
  initializeRecommendationGenerationEngine,
  recommendationCandidateExists,
  registerRecommendationCandidate,
  resetExecutiveRecommendationGenerationEngineForTests,
  unregisterRecommendationCandidate,
  validateExecutiveRecommendations,
  validateRecommendationGeneration,
  EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_SELF_MANIFEST,
} from "./executiveRecommendationGenerationEngine.ts";
import { buildRecommendationCandidatesFromRecords } from "./executiveRecommendationGenerationCandidateBuilder.ts";
import { getRecommendationRegistrySnapshot } from "./executiveRecommendationGenerationEngineRegistry.ts";
import {
  normalizeRecommendationSourceRecords,
  sortNormalizedRecordsDeterministically,
} from "./executiveRecommendationGenerationNormalizer.ts";
import {
  resetExecutiveRecommendationGenerationEnginePlatformForTests,
  runRecommendationGenerationCertification,
} from "./executiveRecommendationGenerationEngineRunner.ts";
import type { CertifiedRecommendationSourceRecordInput } from "./executiveRecommendationGenerationEngineTypes.ts";
import {
  hasDuplicateIds,
  validateCertifiedRecommendationSourceRecordInput,
  validateRecommendationCandidate,
  validateRecommendationCandidateProvenance,
} from "./executiveRecommendationGenerationEngineValidation.ts";
import { isExecutiveRecommendationDomain } from "./executiveRecommendationValidation.ts";
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

test.beforeEach(() => {
  resetExecutiveRecommendationGenerationEnginePlatformForTests();
  buildExecutiveRecommendationFoundation(FIXED_TIME);
  initializeRecommendationGenerationEngine(FIXED_TIME);
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/executive-recommendation/executiveRecommendationGenerationEngine.ts",
    allowedFiles: EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("generates executive recommendation candidates from certified sources", () => {
  const result = generateExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "recommendation-session-001",
      sessionLabel: "Executive Advisory Session",
      sourceRecords: Object.freeze([
        sourceRecord("scenario-intelligence-provider", "001"),
        sourceRecord("decision-journal-provider", "002"),
        sourceRecord("executive-inbox-provider", "003"),
      ]),
      generationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, true, result.reason);
  assert.equal(result.candidates.length, 3);
  assert.equal(result.pipelineStages.length, EXECUTIVE_RECOMMENDATION_GENERATION_PIPELINE_STAGES.length);
  assert.equal(Object.isFrozen(result), true);
  assert.ok(result.candidates.every((entry) => Object.isFrozen(entry) && entry.readOnly === true));
});

test("normalizes source records into immutable recommendation candidates", () => {
  const normalized = sortNormalizedRecordsDeterministically(
    normalizeRecommendationSourceRecords(Object.freeze([sourceRecord("scenario-timeline-provider", "004")]))
  );
  const candidates = buildRecommendationCandidatesFromRecords(normalized, FIXED_TIME);
  assert.equal(candidates.length, 1);
  const candidate = candidates[0];
  assert.ok(candidate);
  assert.equal(candidate.category, "timeline");
  assert.equal(candidate.engineVersion, "APP-12/2");
  assert.equal(validateRecommendationCandidate(candidate).valid, true);
});

test("preserves complete provenance on generated candidates", () => {
  const result = generateExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "recommendation-session-provenance",
      sessionLabel: "Provenance Session",
      sourceRecords: Object.freeze([sourceRecord("confidence-evolution-provider", "005")]),
      generationTimestamp: FIXED_TIME,
    })
  );
  const candidate = result.candidates[0];
  assert.ok(candidate);
  assert.equal(validateRecommendationCandidateProvenance(candidate.provenance).valid, true);
  assert.equal(candidate.provenance.foundationVersion, "APP-12/1");
  assert.equal(candidate.provenance.generationVersion, "APP-12/2");
  assert.ok(Object.keys(candidate.provenance.dependencyVersions).includes("APP-10"));
});

test("registers retrieves and unregisters recommendation candidates", () => {
  const result = generateExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "recommendation-session-registry",
      sessionLabel: "Registry Session",
      sourceRecords: Object.freeze([sourceRecord("executive-intent-provider", "006")]),
      generationTimestamp: FIXED_TIME,
    })
  );
  const recommendationId = result.registeredRecommendationIds[0];
  assert.ok(recommendationId);
  assert.equal(recommendationCandidateExists(recommendationId), true);
  assert.ok(getRecommendationCandidate(recommendationId));
  assert.equal(getRecommendationCandidates(WORKSPACE).length, 1);
  const removed = unregisterRecommendationCandidate(recommendationId);
  assert.equal(removed.success, true);
  assert.equal(recommendationCandidateExists(recommendationId), false);
});

test("rejects duplicate recommendation candidate registration", () => {
  const result = generateExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "recommendation-session-duplicate",
      sessionLabel: "Duplicate Session",
      sourceRecords: Object.freeze([sourceRecord("executive-memory-provider", "007")]),
      generationTimestamp: FIXED_TIME,
    })
  );
  const candidate = result.candidates[0];
  assert.ok(candidate);
  const duplicate = registerRecommendationCandidate(candidate);
  assert.equal(duplicate.success, false);
  assert.equal(duplicate.error?.code, "duplicate_candidate");
});

test("detects duplicate source ids in generation request", () => {
  const record = sourceRecord("business-timeline-provider", "008");
  const result = generateExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "recommendation-session-dup-source",
      sessionLabel: "Duplicate Source Session",
      sourceRecords: Object.freeze([record, record]),
      generationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
});

test("rejects invalid certified source input", () => {
  const validation = validateCertifiedRecommendationSourceRecordInput(
    Object.freeze({
      ...sourceRecord("cross-scenario-learning-provider", "009"),
      sourceApps: Object.freeze([]),
    })
  );
  assert.equal(validation.valid, false);
});

test("rejects workspace mismatch during generation", () => {
  const result = generateExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "recommendation-session-ws-mismatch",
      sessionLabel: "Workspace Mismatch Session",
      sourceRecords: Object.freeze([
        Object.freeze({ ...sourceRecord("scenario-intelligence-provider", "010"), workspaceId: "ws-other" }),
      ]),
      generationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
});

test("requires APP-12:1 foundation before generation", () => {
  resetExecutiveRecommendationPlatformForTests();
  resetExecutiveRecommendationGenerationEngineForTests();
  initializeRecommendationGenerationEngine(FIXED_TIME);
  const result = generateExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "recommendation-session-no-foundation",
      sessionLabel: "No Foundation Session",
      sourceRecords: Object.freeze([sourceRecord("decision-journal-provider", "011")]),
      generationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
  assert.match(result.reason, /Foundation/);
});

test("validates batch executive recommendation generation", () => {
  const result = generateExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "recommendation-session-validation",
      sessionLabel: "Validation Session",
      sourceRecords: Object.freeze([
        sourceRecord("scenario-intelligence-provider", "012"),
        sourceRecord("decision-journal-provider", "013"),
      ]),
      generationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(validateExecutiveRecommendations(result.recommendations).valid, true);
});

test("exports pipeline stages and domain vocabulary", () => {
  assert.equal(EXECUTIVE_RECOMMENDATION_GENERATION_PIPELINE_STAGES.length, 9);
  assert.equal(isExecutiveRecommendationDomain("strategic"), true);
  assert.equal(isExecutiveRecommendationDomain("mixed"), true);
  assert.equal(EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_CONTRACT_VERSION, "APP-12/2");
});

test("enforces public API rules without evaluation ranking or execution", () => {
  assert.equal(EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_PUBLIC_API_RULES.noEvaluation, true);
  assert.equal(EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_PUBLIC_API_RULES.noRanking, true);
  assert.equal(EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_PUBLIC_API_RULES.noExecution, true);
  assert.equal(EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_PUBLIC_API_RULES.consumerOnly, true);
  assert.equal(EXECUTIVE_RECOMMENDATION_GENERATION_ENGINE_PUBLIC_API_RULES.immutableCandidates, true);
});

test("detects duplicate ids", () => {
  assert.equal(hasDuplicateIds(["a", "b", "a"]), true);
  assert.equal(hasDuplicateIds(["a", "b"]), false);
});

test("registry snapshot reflects registered candidates", () => {
  generateExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "recommendation-session-snapshot",
      sessionLabel: "Snapshot Session",
      sourceRecords: Object.freeze([sourceRecord("executive-inbox-provider", "014")]),
      generationTimestamp: FIXED_TIME,
    })
  );
  const snapshot = getRecommendationRegistrySnapshot();
  assert.equal(snapshot.candidateCount, 1);
  assert.equal(snapshot.registryVersion, "APP-12/2");
});

test("ExecutiveRecommendationGenerationEngine namespace exposes public APIs", () => {
  assert.equal(typeof ExecutiveRecommendationGenerationEngine.generateExecutiveRecommendations, "function");
  assert.equal(typeof ExecutiveRecommendationGenerationEngine.buildRecommendationCandidates, "function");
  assert.equal(typeof ExecutiveRecommendationGenerationEngine.validateRecommendationGeneration, "function");
  assert.equal(ExecutiveRecommendationGenerationEngine.version, "APP-12/2");
  assert.equal(ExecutiveRecommendationGenerationEngine.foundationVersion, "APP-12/1");
});

test("buildRecommendationCandidates produces candidates without registry side effects when called directly", () => {
  const candidates = buildRecommendationCandidates(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "build-only-session",
      sessionLabel: "Build Only",
      sourceRecords: Object.freeze([sourceRecord("executive-time-provider", "015")]),
      generationTimestamp: FIXED_TIME,
    })
  );
  assert.equal(candidates.length, 1);
  assert.equal(getRecommendationRegistrySnapshot().candidateCount, 0);
});

test("generation is deterministic for identical inputs", () => {
  const request = Object.freeze({
    workspaceId: WORKSPACE,
    sessionId: "deterministic-session",
    sessionLabel: "Deterministic Session",
    sourceRecords: Object.freeze([
      sourceRecord("scenario-intelligence-provider", "016"),
      sourceRecord("decision-journal-provider", "017"),
    ]),
    generationTimestamp: FIXED_TIME,
  });
  resetExecutiveRecommendationGenerationEnginePlatformForTests();
  buildExecutiveRecommendationFoundation(FIXED_TIME);
  initializeRecommendationGenerationEngine(FIXED_TIME);
  const first = generateExecutiveRecommendations(request);
  resetExecutiveRecommendationGenerationEnginePlatformForTests();
  buildExecutiveRecommendationFoundation(FIXED_TIME);
  initializeRecommendationGenerationEngine(FIXED_TIME);
  const second = generateExecutiveRecommendations(request);
  assert.deepEqual(
    first.candidates.map((entry) => entry.recommendationId),
    second.candidates.map((entry) => entry.recommendationId)
  );
});

test("regression: APP-9 and APP-10 platforms remain valid", () => {
  assert.equal(CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId, "APP-9");
  assert.equal(CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY.appId, "APP-10");
});

test("runs executive recommendation generation engine certification", () => {
  const result = runRecommendationGenerationCertification(FIXED_TIME);
  assert.equal(
    result.certified,
    true,
    result.checks.filter((entry) => !entry.passed).map((entry) => entry.id).join(", ")
  );
  assert.equal(result.failedCount, 0);
  assert.ok(result.passedCount >= 20);
  assert.equal(result.phase, "APP-12/2");
});

test("validateRecommendationGeneration validates generation requests", () => {
  const validation = validateRecommendationGeneration(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "validation-request",
      sessionLabel: "Validation Request",
      sourceRecords: Object.freeze([sourceRecord("ds-platform-provider", "018")]),
    })
  );
  assert.equal(validation.valid, true);
});
