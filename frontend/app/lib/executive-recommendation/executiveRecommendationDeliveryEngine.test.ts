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
  initializeRecommendationOptimizationEngine,
  optimizeExecutiveRecommendations,
  resetExecutiveRecommendationOptimizationEngineForTests,
} from "./executiveRecommendationOptimizationEngine.ts";
import {
  EXECUTIVE_RECOMMENDATION_DELIVERY_CONSUMER_TARGETS,
  EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_PUBLIC_API_RULES,
  EXECUTIVE_RECOMMENDATION_DELIVERY_INTERACTION_CAPABILITY_KEYS,
  EXECUTIVE_RECOMMENDATION_DELIVERY_PIPELINE_STAGES,
} from "./executiveRecommendationDeliveryEngineConstants.ts";
import {
  ExecutiveRecommendationDeliveryEngine,
  buildRecommendationDeliveryPackages,
  getRecommendationDelivery,
  getRecommendationDeliveries,
  initializeRecommendationDeliveryEngine,
  prepareExecutiveRecommendationDelivery,
  registerRecommendationDelivery,
  resetExecutiveRecommendationDeliveryEngineForTests,
  unregisterRecommendationDelivery,
  validateRecommendationDelivery,
  recommendationDeliveryExists,
  EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_SELF_MANIFEST,
} from "./executiveRecommendationDeliveryEngine.ts";
import { getRecommendationDeliveryRegistrySnapshot } from "./executiveRecommendationDeliveryEngineRegistry.ts";
import {
  bootstrapRecommendationDeliveryPlatform,
  resetExecutiveRecommendationDeliveryEnginePlatformForTests,
  runRecommendationDeliveryCertification,
} from "./executiveRecommendationDeliveryEngineRunner.ts";
import {
  hasDuplicateDeliveryIds,
  validateRecommendationDeliveryProvenance,
  validateExecutiveRecommendationDeliveryRecord,
} from "./executiveRecommendationDeliveryEngineValidation.ts";
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

function generateTestOptimizations() {
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
  const governance = validateExecutiveRecommendationGovernance(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "governance-session",
      sessionLabel: "Governance Session",
      explanations: explanation.explanations,
      governanceTimestamp: FIXED_TIME,
    })
  );
  return optimizeExecutiveRecommendations(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "optimization-session",
      sessionLabel: "Optimization Session",
      governanceRecords: governance.governanceRecords,
      optimizationTimestamp: FIXED_TIME,
    })
  );
}

test.beforeEach(() => {
  bootstrapRecommendationDeliveryPlatform(FIXED_TIME);
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/executive-recommendation/executiveRecommendationDeliveryEngine.ts",
    allowedFiles: EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("prepares executive recommendation delivery from APP-12:6 optimizations", () => {
  const optimization = generateTestOptimizations();
  const result = prepareExecutiveRecommendationDelivery(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "delivery-session-001",
      sessionLabel: "Executive Delivery Session",
      optimizations: optimization.optimizations,
      deliveryTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, true, result.reason);
  assert.equal(result.deliveries.length, 3);
  assert.equal(result.pipelineStages.length, EXECUTIVE_RECOMMENDATION_DELIVERY_PIPELINE_STAGES.length);
  assert.equal(Object.isFrozen(result), true);
  assert.ok(result.deliveries.every((entry) => Object.isFrozen(entry) && entry.readOnly === true));
});

test("includes all eight interaction capabilities per delivery", () => {
  const optimization = generateTestOptimizations();
  const result = prepareExecutiveRecommendationDelivery(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "delivery-interactions",
      sessionLabel: "Interaction Session",
      optimizations: optimization.optimizations.slice(0, 1),
      deliveryTimestamp: FIXED_TIME,
    })
  );
  const delivery = result.deliveries[0];
  assert.ok(delivery);
  assert.equal(
    delivery.package.interactionProfile.capabilities.length,
    EXECUTIVE_RECOMMENDATION_DELIVERY_INTERACTION_CAPABILITY_KEYS.length
  );
  assert.ok(delivery.package.interactionProfile.capabilities.every((entry) => entry.rationale.length > 0));
});

test("packages all four consumer targets per delivery", () => {
  const optimization = generateTestOptimizations();
  const result = prepareExecutiveRecommendationDelivery(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "delivery-consumers",
      sessionLabel: "Consumer Session",
      optimizations: optimization.optimizations.slice(0, 1),
      deliveryTimestamp: FIXED_TIME,
    })
  );
  const delivery = result.deliveries[0];
  assert.ok(delivery);
  assert.equal(delivery.package.consumerTargets.length, EXECUTIVE_RECOMMENDATION_DELIVERY_CONSUMER_TARGETS.length);
  assert.deepEqual([...delivery.package.consumerTargets], [...EXECUTIVE_RECOMMENDATION_DELIVERY_CONSUMER_TARGETS]);
});

test("preserves complete provenance on delivery records", () => {
  const optimization = generateTestOptimizations();
  const result = prepareExecutiveRecommendationDelivery(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "delivery-provenance",
      sessionLabel: "Provenance Session",
      optimizations: optimization.optimizations.slice(0, 1),
      deliveryTimestamp: FIXED_TIME,
    })
  );
  const delivery = result.deliveries[0];
  assert.ok(delivery);
  assert.equal(validateRecommendationDeliveryProvenance(delivery.provenance).valid, true);
  assert.equal(delivery.provenance.foundationVersion, "APP-12/1");
  assert.equal(delivery.provenance.generationVersion, "APP-12/2");
  assert.equal(delivery.provenance.evaluationVersion, "APP-12/3");
  assert.equal(delivery.provenance.explanationVersion, "APP-12/4");
  assert.equal(delivery.provenance.governanceVersion, "APP-12/5");
  assert.equal(delivery.provenance.optimizationVersion, "APP-12/6");
  assert.equal(delivery.provenance.deliveryVersion, "APP-12/7");
});

test("registers retrieves and unregisters delivery records", () => {
  const optimization = generateTestOptimizations();
  const result = prepareExecutiveRecommendationDelivery(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "delivery-registry",
      sessionLabel: "Registry Session",
      optimizations: optimization.optimizations.slice(0, 1),
      deliveryTimestamp: FIXED_TIME,
    })
  );
  const deliveryId = result.registeredDeliveryIds[0];
  assert.ok(deliveryId);
  assert.equal(recommendationDeliveryExists(deliveryId), true);
  assert.ok(getRecommendationDelivery(deliveryId));
  assert.equal(getRecommendationDeliveries(WORKSPACE).length, 1);
  const removed = unregisterRecommendationDelivery(deliveryId);
  assert.equal(removed.success, true);
  assert.equal(recommendationDeliveryExists(deliveryId), false);
});

test("rejects duplicate delivery registration", () => {
  const optimization = generateTestOptimizations();
  const result = prepareExecutiveRecommendationDelivery(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "delivery-duplicate",
      sessionLabel: "Duplicate Session",
      optimizations: optimization.optimizations.slice(0, 1),
      deliveryTimestamp: FIXED_TIME,
    })
  );
  const delivery = result.deliveries[0];
  assert.ok(delivery);
  const duplicate = registerRecommendationDelivery(delivery);
  assert.equal(duplicate.success, false);
  assert.equal(duplicate.error?.code, "duplicate_delivery");
});

test("detects duplicate recommendation ids in delivery request", () => {
  const optimization = generateTestOptimizations();
  const optimizationRecord = optimization.optimizations[0];
  assert.ok(optimizationRecord);
  const result = prepareExecutiveRecommendationDelivery(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "delivery-dup-optimization",
      sessionLabel: "Duplicate Optimization Session",
      optimizations: Object.freeze([optimizationRecord, optimizationRecord]),
      deliveryTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
});

test("rejects workspace mismatch during delivery validation", () => {
  const optimization = generateTestOptimizations();
  const optimizationRecord = optimization.optimizations[0];
  assert.ok(optimizationRecord);
  const result = prepareExecutiveRecommendationDelivery(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "delivery-ws-mismatch",
      sessionLabel: "Workspace Mismatch Session",
      optimizations: Object.freeze([
        Object.freeze({
          ...optimizationRecord,
          provenance: Object.freeze({
            ...optimizationRecord.provenance,
            workspaceId: "ws-other",
          }),
        }),
      ]),
      deliveryTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
});

test("requires APP-12:1 through APP-12:6 before delivery", () => {
  resetExecutiveRecommendationPlatformForTests();
  resetExecutiveRecommendationGenerationEngineForTests();
  resetExecutiveRecommendationEvaluationEngineForTests();
  resetExecutiveRecommendationExplainabilityEngineForTests();
  resetExecutiveRecommendationGovernanceEngineForTests();
  resetExecutiveRecommendationOptimizationEngineForTests();
  resetExecutiveRecommendationDeliveryEngineForTests();
  const optimization = generateTestOptimizations();
  assert.equal(optimization.success, false);
});

test("requires APP-12:6 optimization engine before delivery", () => {
  resetExecutiveRecommendationDeliveryEnginePlatformForTests();
  buildExecutiveRecommendationFoundation(FIXED_TIME);
  initializeRecommendationGenerationEngine(FIXED_TIME);
  initializeRecommendationEvaluationEngine(FIXED_TIME);
  initializeRecommendationExplainabilityEngine(FIXED_TIME);
  initializeRecommendationGovernanceEngine(FIXED_TIME);
  initializeRecommendationDeliveryEngine(FIXED_TIME);
  const result = prepareExecutiveRecommendationDelivery(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "delivery-no-optimization",
      sessionLabel: "No Optimization Session",
      optimizations: Object.freeze([]),
      deliveryTimestamp: FIXED_TIME,
    })
  );
  assert.equal(result.success, false);
  assert.match(result.reason, /Optimization/);
});

test("exports pipeline stages and consumer targets", () => {
  assert.equal(EXECUTIVE_RECOMMENDATION_DELIVERY_PIPELINE_STAGES.length, 9);
  assert.equal(EXECUTIVE_RECOMMENDATION_DELIVERY_CONSUMER_TARGETS.length, 4);
  assert.equal(EXECUTIVE_RECOMMENDATION_DELIVERY_INTERACTION_CAPABILITY_KEYS.length, 8);
  assert.equal(EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_CONTRACT_VERSION, "APP-12/7");
});

test("enforces public API rules without execution notifications or UI", () => {
  assert.equal(EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_PUBLIC_API_RULES.noExecution, true);
  assert.equal(EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_PUBLIC_API_RULES.noNotifications, true);
  assert.equal(EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_PUBLIC_API_RULES.noUiRendering, true);
  assert.equal(EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_PUBLIC_API_RULES.noOriginalMutation, true);
  assert.equal(EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_PUBLIC_API_RULES.metadataOnly, true);
  assert.equal(EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_PUBLIC_API_RULES.consumerOnly, true);
});

test("detects duplicate delivery ids", () => {
  assert.equal(hasDuplicateDeliveryIds(["a", "b", "a"]), true);
  assert.equal(hasDuplicateDeliveryIds(["a", "b"]), false);
});

test("registry snapshot reflects registered delivery records", () => {
  const optimization = generateTestOptimizations();
  prepareExecutiveRecommendationDelivery(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "delivery-snapshot",
      sessionLabel: "Snapshot Session",
      optimizations: optimization.optimizations.slice(0, 1),
      deliveryTimestamp: FIXED_TIME,
    })
  );
  const snapshot = getRecommendationDeliveryRegistrySnapshot();
  assert.equal(snapshot.deliveryCount, 1);
  assert.equal(snapshot.registryVersion, "APP-12/7");
});

test("ExecutiveRecommendationDeliveryEngine namespace exposes public APIs", () => {
  assert.equal(typeof ExecutiveRecommendationDeliveryEngine.prepareExecutiveRecommendationDelivery, "function");
  assert.equal(typeof ExecutiveRecommendationDeliveryEngine.buildRecommendationDeliveryPackages, "function");
  assert.equal(typeof ExecutiveRecommendationDeliveryEngine.validateRecommendationDelivery, "function");
  assert.equal(ExecutiveRecommendationDeliveryEngine.version, "APP-12/7");
  assert.equal(ExecutiveRecommendationDeliveryEngine.optimizationVersion, "APP-12/6");
});

test("buildRecommendationDeliveryPackages produces packages without registry side effects", () => {
  const optimization = generateTestOptimizations();
  const packages = buildRecommendationDeliveryPackages(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "build-only-session",
      sessionLabel: "Build Only",
      optimizations: optimization.optimizations.slice(0, 1),
      deliveryTimestamp: FIXED_TIME,
    })
  );
  assert.equal(packages.length, 1);
  assert.equal(getRecommendationDeliveryRegistrySnapshot().deliveryCount, 0);
});

test("delivery is deterministic for identical inputs", () => {
  const optimization = generateTestOptimizations();
  const request = Object.freeze({
    workspaceId: WORKSPACE,
    sessionId: "deterministic-session",
    sessionLabel: "Deterministic Session",
    optimizations: optimization.optimizations,
    deliveryTimestamp: FIXED_TIME,
  });
  bootstrapRecommendationDeliveryPlatform(FIXED_TIME);
  const firstOptimization = generateTestOptimizations();
  const first = prepareExecutiveRecommendationDelivery(
    Object.freeze({ ...request, optimizations: firstOptimization.optimizations })
  );
  bootstrapRecommendationDeliveryPlatform(FIXED_TIME);
  const secondOptimization = generateTestOptimizations();
  const second = prepareExecutiveRecommendationDelivery(
    Object.freeze({ ...request, optimizations: secondOptimization.optimizations })
  );
  assert.deepEqual(
    first.deliveries.map((entry) => entry.deliveryId),
    second.deliveries.map((entry) => entry.deliveryId)
  );
});

test("regression: APP-9 and APP-10 platforms remain valid", () => {
  assert.equal(CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId, "APP-9");
  assert.equal(CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY.appId, "APP-10");
});

test("runs executive recommendation delivery engine certification", () => {
  const result = runRecommendationDeliveryCertification(FIXED_TIME);
  assert.equal(
    result.certified,
    true,
    result.checks.filter((entry) => !entry.passed).map((entry) => entry.id).join(", ")
  );
  assert.equal(result.failedCount, 0);
  assert.ok(result.passedCount >= 20);
  assert.equal(result.phase, "APP-12/7");
});

test("validateRecommendationDelivery validates delivery requests", () => {
  const optimization = generateTestOptimizations();
  const validation = validateRecommendationDelivery(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "validation-request",
      sessionLabel: "Validation Request",
      optimizations: optimization.optimizations.slice(0, 1),
    })
  );
  assert.equal(validation.valid, true);
});

test("delivery summary confirms metadata-only consumer packaging", () => {
  const optimization = generateTestOptimizations();
  const result = prepareExecutiveRecommendationDelivery(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "delivery-summary",
      sessionLabel: "Summary Session",
      optimizations: optimization.optimizations.slice(0, 1),
      deliveryTimestamp: FIXED_TIME,
    })
  );
  const delivery = result.deliveries[0];
  assert.ok(delivery);
  assert.equal(validateExecutiveRecommendationDeliveryRecord(delivery).valid, true);
  assert.ok(delivery.summary.narrative.includes("No execution performed"));
  assert.ok(delivery.package.executiveSummary.includes("not modified"));
});
