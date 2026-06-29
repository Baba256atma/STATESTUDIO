import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { BUSINESS_TIMELINE_PLATFORM_IDENTITY } from "../business-timeline/businessTimelineContracts.ts";
import { CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY } from "../confidence-evolution/confidenceEvolutionContracts.ts";
import { DECISION_JOURNAL_PLATFORM_IDENTITY } from "../decision-journal/decisionJournalContracts.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "../decision-timeline/decisionTimelineContracts.ts";
import {
  SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
  SCENARIO_TIMELINE_PLATFORM_IDENTITY,
} from "../scenario-timeline/scenarioTimelinePlatformContracts.ts";
import {
  CROSS_SCENARIO_LEARNING_COMPATIBILITY_REGISTRY,
  CROSS_SCENARIO_LEARNING_CONSUMER_REGISTRY,
  CROSS_SCENARIO_LEARNING_EXTENSION_REGISTRY,
  CROSS_SCENARIO_LEARNING_FUTURE_COMPATIBILITY,
  CROSS_SCENARIO_LEARNING_FUTURE_ENGINE_REGISTRY,
  CROSS_SCENARIO_LEARNING_FUTURE_PHASE_KEYS,
  CROSS_SCENARIO_LEARNING_MUST_NOT_OWN,
  CROSS_SCENARIO_LEARNING_PLATFORM_CAPABILITIES,
  CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION,
  CROSS_SCENARIO_LEARNING_PLATFORM_PRINCIPLES,
  CROSS_SCENARIO_LEARNING_RELEASE_METADATA,
  CROSS_SCENARIO_LEARNING_SOURCE_KEYS,
} from "./crossScenarioLearningConstants.ts";
import {
  CROSS_SCENARIO_LEARNING_FREEZE_RULES,
  CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY,
  CROSS_SCENARIO_LEARNING_PLATFORM_SELF_MANIFEST,
  CROSS_SCENARIO_LEARNING_PUBLIC_API_RULES,
  CrossScenarioLearningPlatformContract,
  buildCrossScenarioLearningFoundation,
  createCrossScenarioLearningFoundation,
  getCrossScenarioLearningContractVersionMetadata,
  getCrossScenarioLearningFutureCompatibility,
  getCrossScenarioLearningManifest,
  isCrossScenarioLearningReady,
  registerLearningCandidate,
  registerLearningSession,
  resolveLearningCandidateExample,
  resolveLearningContextExample,
  resolveLearningSessionExample,
  resolveLearningSourceExample,
  resolveScenarioSnapshotExample,
  validateCrossScenarioLearningDependencies,
  validateCrossScenarioLearningFoundation,
} from "./crossScenarioLearningContracts.ts";
import {
  CrossScenarioLearningFoundation,
  getCrossScenarioLearning,
  isCrossScenarioLearningPlatformInitialized,
} from "./crossScenarioLearningFoundation.ts";
import {
  getCrossScenarioLearningRegistry,
  registerMetadataExtension,
} from "./crossScenarioLearningRegistry.ts";
import {
  resetCrossScenarioLearningPlatformForTests,
  runCrossScenarioLearningFoundation,
} from "./crossScenarioLearningRunner.ts";
import {
  hasDuplicateIds,
  isLearningSourceType,
  isReservedLearningSessionId,
  validateLearningCandidateContractShape,
  validateLearningContextContractShape,
  validateLearningCandidateRegistration,
  validateLearningSessionRegistration,
  validateLearningSessionContractShape,
  validatePlatformIdentity,
  validateScenarioSnapshotContractShape,
  validateSessionIdentity,
  validateWorkspaceIsolation,
} from "./crossScenarioLearningValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetCrossScenarioLearningPlatformForTests();
});

test("exports APP-10 identity and contract vocabulary", () => {
  assert.equal(CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY.appId, "APP-10");
  assert.equal(CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY.title, "Cross-Scenario Learning");
  assert.equal(CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY.platformId, "cross-scenario-learning-platform");
  assert.equal(CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY.version, CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION);
  assert.equal(CROSS_SCENARIO_LEARNING_SOURCE_KEYS.length, 8);
});

test("validates learning source enum guards", () => {
  assert.equal(isLearningSourceType("completed_scenario"), true);
  assert.equal(isLearningSourceType("confidence_evolution"), true);
  assert.equal(isLearningSourceType("invalid"), false);
});

test("validates learning contract example shapes", () => {
  assert.equal(validateScenarioSnapshotContractShape(resolveScenarioSnapshotExample(FIXED_TIME)).valid, true);
  assert.equal(validateLearningCandidateContractShape(resolveLearningCandidateExample(FIXED_TIME)).valid, true);
  assert.equal(validateLearningContextContractShape(resolveLearningContextExample(FIXED_TIME)).valid, true);
  assert.equal(validateLearningSessionContractShape(resolveLearningSessionExample(FIXED_TIME)).valid, true);
  assert.equal(resolveLearningSourceExample(FIXED_TIME).consumerOnly, true);
  assert.equal(resolveScenarioSnapshotExample(FIXED_TIME).version, "APP-10/1");
});

test("creates cross-scenario learning foundation correctly", () => {
  assert.equal(isCrossScenarioLearningReady(), false);
  const init = createCrossScenarioLearningFoundation(FIXED_TIME);
  assert.equal(init.success, true);
  assert.equal(isCrossScenarioLearningPlatformInitialized(), true);
  assert.equal(init.data?.contractVersion, "APP-10/1");
  assert.equal(init.data?.supportedSourceTypes.length, 8);
});

test("registers learning session and candidate", () => {
  createCrossScenarioLearningFoundation(FIXED_TIME);
  const session = registerLearningSession(
    Object.freeze({
      sessionId: "cross-scenario-learning-ws-test-001",
      workspaceId: "ws-test-001",
      label: "Test Learning Session",
      description: "Primary learning session for test workspace.",
      sourceTypes: Object.freeze(["completed_scenario", "final_outcome"]),
    }),
    FIXED_TIME
  );
  assert.equal(session.success, true);
  assert.equal(getCrossScenarioLearningRegistry().sessions.length, 1);

  const candidate = registerLearningCandidate(
    Object.freeze({
      candidateId: "learning-candidate-test-001",
      workspaceId: "ws-test-001",
      sessionId: "cross-scenario-learning-ws-test-001",
      snapshotId: "scenario-snapshot-test-001",
      sourceType: "completed_scenario",
      label: "Test Candidate",
      description: "Test learning candidate.",
    }),
    FIXED_TIME
  );
  assert.equal(candidate.success, true);
  assert.equal(getCrossScenarioLearningRegistry().candidates.length, 1);
});

test("rejects reserved learning session ids", () => {
  createCrossScenarioLearningFoundation(FIXED_TIME);
  assert.equal(isReservedLearningSessionId("cross-scenario-learning-system"), true);
  const rejected = registerLearningSession(
    Object.freeze({
      sessionId: "cross-scenario-learning-system",
      workspaceId: "ws-test-001",
      label: "Reserved",
      description: "Should fail.",
      sourceTypes: Object.freeze(["completed_scenario"]),
    }),
    FIXED_TIME
  );
  assert.equal(rejected.success, false);
});

test("builds immutable cross-scenario learning manifest", () => {
  createCrossScenarioLearningFoundation(FIXED_TIME);
  const manifest = getCrossScenarioLearningManifest(FIXED_TIME);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.manifestVersion, "APP-10/1");
  assert.equal(manifest.extensionRegistry.length, 6);
  assert.equal(manifest.consumerRegistry.length, 4);
  assert.equal(manifest.futureEngineRegistry.length, 6);
  assert.equal(manifest.platformPrinciples.length, 12);
  assert.equal(manifest.dependencyValidation.valid, true);
});

test("validates cross-scenario learning foundation", () => {
  const report = validateCrossScenarioLearningFoundation(FIXED_TIME);
  assert.equal(report.valid, true);
  assert.equal(report.platformInitialized, true);
  assert.equal(report.manifestValid, true);
  assert.equal(report.compatibilityValid, true);
  assert.equal(report.dependencyValid, true);
  assert.equal(report.workspaceIsolationValid, true);
  assert.equal(report.sessionIdentityValid, true);
});

test("validates certified dependency gates", () => {
  const dependencies = validateCrossScenarioLearningDependencies();
  assert.equal(dependencies.valid, true);
  assert.equal(dependencies.dependencies.length, 5);
  assert.ok(dependencies.dependencies.every((entry) => entry.present));
  assert.ok(dependencies.dependencies.every((entry) => entry.consumerOnly));
});

test("validates APP-10:1 stage manifest and architecture boundaries", () => {
  assert.equal(validateStageManifest(CROSS_SCENARIO_LEARNING_PLATFORM_SELF_MANIFEST).valid, true);
  assert.equal(
    evaluateStageFileBoundary({
      filePath: "frontend/app/lib/cross-scenario-learning/crossScenarioLearningRegistry.ts",
      allowedFiles: CROSS_SCENARIO_LEARNING_PLATFORM_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: CROSS_SCENARIO_LEARNING_PLATFORM_SELF_MANIFEST.forbiddenPatterns,
    }).allowed,
    true
  );
});

test("exports extension, consumer, and compatibility registries", () => {
  assert.ok(CROSS_SCENARIO_LEARNING_EXTENSION_REGISTRY.some((entry) => entry.extensionId === "pattern-learning"));
  assert.ok(CROSS_SCENARIO_LEARNING_EXTENSION_REGISTRY.some((entry) => entry.extensionId === "similarity-engine"));
  assert.ok(CROSS_SCENARIO_LEARNING_CONSUMER_REGISTRY.some((entry) => entry.consumerId === "workspace-consumer"));
  assert.ok(CROSS_SCENARIO_LEARNING_COMPATIBILITY_REGISTRY.some((entry) => entry.guaranteeId === "consumer-only-platform"));
  assert.equal(CROSS_SCENARIO_LEARNING_FUTURE_COMPATIBILITY.metadataOnly, true);
  assert.equal(CROSS_SCENARIO_LEARNING_FUTURE_COMPATIBILITY.patternLearningReady, false);
  assert.equal(CROSS_SCENARIO_LEARNING_FUTURE_COMPATIBILITY.similarityEngineReady, false);
  assert.equal(CROSS_SCENARIO_LEARNING_FUTURE_COMPATIBILITY.recommendationLearningReady, false);
});

test("enforces public API and freeze rules", () => {
  assert.equal(CROSS_SCENARIO_LEARNING_PUBLIC_API_RULES.noMachineLearning, true);
  assert.equal(CROSS_SCENARIO_LEARNING_PUBLIC_API_RULES.noSimilarityEngine, true);
  assert.equal(CROSS_SCENARIO_LEARNING_PUBLIC_API_RULES.consumerOnly, true);
  assert.equal(CROSS_SCENARIO_LEARNING_FREEZE_RULES.noEmbeddings, true);
  assert.equal(CROSS_SCENARIO_LEARNING_FREEZE_RULES.noVectorSearch, true);
  assert.equal(CROSS_SCENARIO_LEARNING_FREEZE_RULES.publicInterfacesExtendOnly, true);
});

test("validates platform identity session identity and workspace isolation", () => {
  assert.equal(validatePlatformIdentity(CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY).valid, true);
  assert.equal(validateSessionIdentity("cross-scenario-learning-ws-001").valid, true);
  assert.equal(validateSessionIdentity("invalid-session").valid, false);
  assert.equal(validateWorkspaceIsolation("ws-001", "ws-001").valid, true);
  assert.equal(validateWorkspaceIsolation("ws-001", "ws-002").valid, false);
});

test("detects duplicate ids", () => {
  assert.equal(hasDuplicateIds(["a", "b", "a"]), true);
  assert.equal(hasDuplicateIds(["a", "b", "c"]), false);
});

test("regression: APP-5 through APP-9 platforms remain valid", () => {
  assert.equal(SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId, "APP-5");
  assert.equal(SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION, "APP-5/1");
  assert.equal(DECISION_TIMELINE_PLATFORM_IDENTITY.appId, "APP-6");
  assert.equal(BUSINESS_TIMELINE_PLATFORM_IDENTITY.appId, "APP-7");
  assert.equal(DECISION_JOURNAL_PLATFORM_IDENTITY.appId, "APP-8");
  assert.equal(CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId, "APP-9");
});

test("registers metadata extensions", () => {
  createCrossScenarioLearningFoundation(FIXED_TIME);
  const result = registerMetadataExtension(
    Object.freeze({
      extensionId: "learning-outcome-v1",
      label: "Outcome Metadata v1",
      description: "Outcome metadata extension.",
    })
  );
  assert.equal(result.success, true);
  assert.equal(getCrossScenarioLearningRegistry().metadataExtensions.length, 1);
});

test("getCrossScenarioLearning returns platform state", () => {
  createCrossScenarioLearningFoundation(FIXED_TIME);
  const state = getCrossScenarioLearning(FIXED_TIME);
  assert.equal(state.platformId, "cross-scenario-learning-platform");
  assert.equal(state.initialized, true);
});

test("runs cross-scenario learning foundation certification", () => {
  const result = runCrossScenarioLearningFoundation(FIXED_TIME);
  assert.equal(result.certified, true);
  assert.equal(result.failedCount, 0);
  assert.ok(result.passedCount >= 30);
  assert.equal(result.phase, "APP-10/1");
});

test("exports cross-scenario learning platform contract bundle", () => {
  assert.equal(CrossScenarioLearningPlatformContract.version, "APP-10/1");
  assert.equal(CrossScenarioLearningPlatformContract.identity.appId, "APP-10");
  assert.equal(getCrossScenarioLearningContractVersionMetadata().contractVersion, "APP-10/1");
  assert.equal(getCrossScenarioLearningFutureCompatibility().scenarioTimelineConsumerReady, true);
  assert.equal(CROSS_SCENARIO_LEARNING_MUST_NOT_OWN.includes("machine_learning"), true);
  assert.equal(CROSS_SCENARIO_LEARNING_MUST_NOT_OWN.includes("embeddings"), true);
  assert.equal(CROSS_SCENARIO_LEARNING_FUTURE_PHASE_KEYS.length, 10);
  assert.equal(CROSS_SCENARIO_LEARNING_PLATFORM_CAPABILITIES.length, 8);
  assert.equal(CROSS_SCENARIO_LEARNING_RELEASE_METADATA.freezeState, "open");
  assert.equal(CROSS_SCENARIO_LEARNING_PLATFORM_PRINCIPLES.includes("learning_is_deterministic_and_reproducible"), true);
});

test("CrossScenarioLearningFoundation namespace exposes public APIs", () => {
  assert.equal(typeof CrossScenarioLearningFoundation.buildCrossScenarioLearningFoundation, "function");
  assert.equal(typeof CrossScenarioLearningFoundation.validateCrossScenarioLearningFoundation, "undefined");
  assert.equal(typeof buildCrossScenarioLearningFoundation, "function");
  assert.equal(typeof validateCrossScenarioLearningFoundation, "function");
});

test("validates learning session and candidate registration shape", () => {
  assert.equal(
    validateLearningSessionRegistration(
      Object.freeze({
        sessionId: "cross-scenario-learning-ws-shape-001",
        workspaceId: "ws-shape-001",
        label: "Shape Test Session",
        description: "Registration shape validation.",
        sourceTypes: Object.freeze(["completed_scenario"]),
      })
    ).valid,
    true
  );
  assert.equal(
    validateLearningCandidateRegistration(
      Object.freeze({
        candidateId: "learning-candidate-shape-001",
        workspaceId: "ws-shape-001",
        sessionId: "cross-scenario-learning-ws-shape-001",
        snapshotId: "scenario-snapshot-shape-001",
        sourceType: "final_outcome",
        label: "Shape Candidate",
        description: "Candidate shape validation.",
      })
    ).valid,
    true
  );
});

test("future engine registry reserves learning engines without implementation", () => {
  assert.equal(CROSS_SCENARIO_LEARNING_FUTURE_ENGINE_REGISTRY.every((entry) => entry.status === "reserved"), true);
  assert.ok(CROSS_SCENARIO_LEARNING_FUTURE_ENGINE_REGISTRY.some((entry) => entry.engineId === "similarity-engine"));
  assert.ok(CROSS_SCENARIO_LEARNING_FUTURE_ENGINE_REGISTRY.some((entry) => entry.engineId === "pattern-learning-engine"));
});
