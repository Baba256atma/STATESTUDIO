import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  CrossScenarioLearningPlatformFreeze,
  buildCrossScenarioLearningPlatformFreezeManifest,
  CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_CONTRACT_VERSION,
  CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_SELF_MANIFEST,
  freezeCrossScenarioLearningPlatform,
  getCrossScenarioLearningCompatibility,
  getCrossScenarioLearningPlatformFreezeManifest,
  getCrossScenarioLearningPlatformRegistry,
  resetCrossScenarioLearningPlatformFreezeForTests,
  runCrossScenarioLearningPlatformFreeze,
  validateCrossScenarioLearningPlatformFreeze,
} from "./crossScenarioLearningPlatformFreeze.ts";
import {
  CROSS_SCENARIO_LEARNING_PLATFORM_ALLOWED_FUTURE_EXTENSIONS,
  CROSS_SCENARIO_LEARNING_PLATFORM_FORBIDDEN_CHANGES,
  CROSS_SCENARIO_LEARNING_PLATFORM_FROZEN_PHASES,
  CROSS_SCENARIO_LEARNING_PLATFORM_FROZEN_PUBLIC_APIS,
  CROSS_SCENARIO_LEARNING_PLATFORM_RELEASE_TAG,
} from "./crossScenarioLearningPlatformFreezeRegistry.ts";
import { validateCrossScenarioLearningFreezeManifest } from "./crossScenarioLearningPlatformFreezeManifest.ts";
import { validateCrossScenarioLearningPlatformFreeze as validateFreezeManifest } from "./crossScenarioLearningPlatformFreezeValidation.ts";
import type { CrossScenarioLearningPlatformFreezeCertificationDependency } from "./crossScenarioLearningPlatformFreezeTypes.ts";
import {
  resetCrossScenarioLearningPlatformCertificationForTests,
} from "./crossScenarioLearningPlatformCertificationRunner.ts";
import { resetRecommendationLearningEnginePlatformForTests } from "./recommendationLearningEngineRunner.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetRecommendationLearningEnginePlatformForTests();
  resetCrossScenarioLearningPlatformCertificationForTests();
  resetCrossScenarioLearningPlatformFreezeForTests();
});

test("exports APP-10/9 freeze contract metadata", () => {
  assert.equal(CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_CONTRACT_VERSION, "APP-10/9");
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/cross-scenario-learning/crossScenarioLearningPlatformFreeze.ts",
    allowedFiles: CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("publishes compatibility matrix", () => {
  const compatibility = getCrossScenarioLearningCompatibility();
  assert.equal(compatibility.backwardCompatibility.guaranteed, true);
  assert.equal(compatibility.app10Platform.compatible, true);
  assert.equal(compatibility.app5ScenarioTimeline.directInternalCouplingForbidden, true);
  assert.equal(compatibility.app9ConfidenceEvolution.directInternalCouplingForbidden, true);
  assert.equal(compatibility.intPlatform.readOnlyReferenceOnly, true);
  assert.equal(compatibility.dsPlatform.metadataOnly, true);
  assert.equal(compatibility.layPlatform.extendOnly, true);
  assert.equal(compatibility.dashboardConsumer.integrationPath, "future APP-10 API facade");
  assert.equal(compatibility.workspaceConsumer.workspaceIsolationRequired, true);
});

test("consumes APP-10:8 certification", () => {
  const result = runCrossScenarioLearningPlatformFreeze(FIXED_TIME);
  assert.equal(result.certification.certified, true);
  assert.equal(result.certification.report.contractVersion, "APP-10/8");
  assert.equal(result.manifest?.consumedCertification, "APP-10/8");
});

test("rejects freeze when certification fails", () => {
  const blockedCertification = Object.freeze({
    certified: false,
    readyForFreeze: false,
    report: Object.freeze({
      certified: false,
      phase: "APP-10/8" as const,
      contractVersion: "APP-10/8" as const,
      platformVersion: "APP-10/8" as const,
      groups: Object.freeze([]),
      groupCount: 0,
      groupsPassed: 0,
      groupsFailed: 0,
      checkCount: 0,
      passedCount: 0,
      failedCount: 0,
      regression: Object.freeze({
        success: false,
        layersPassed: 0,
        layersTotal: 7,
        summary: "failed",
        layerResults: Object.freeze([]),
        priorPhasesPreserved: false,
        readOnly: true as const,
      }),
      status: Object.freeze({
        certified: false,
        readyForFreeze: false,
        certificationTimestamp: null,
        contractVersion: "APP-10/8" as const,
        readOnly: true as const,
      }),
      timestamp: FIXED_TIME,
      readOnly: true as const,
    }),
    readOnly: true as const,
  }) satisfies CrossScenarioLearningPlatformFreezeCertificationDependency;

  const validation = validateFreezeManifest(blockedCertification, null);
  assert.equal(validation.valid, false);
  assert.equal(validation.certificationDependencyPass, false);
  assert.ok(validation.issues.some((issue) => issue.code === "not_ready_for_freeze"));
});

test("runs official platform freeze with APP-10:8 certification dependency", () => {
  const result = runCrossScenarioLearningPlatformFreeze(FIXED_TIME);
  assert.equal(result.status, "PASS", result.summary);
  assert.equal(result.certified, true);
  assert.equal(result.frozen, true);
  assert.equal(result.released, true);
  assert.equal(result.readyForRelease, true);
  assert.equal(result.certification.readyForFreeze, true);
  assert.equal(result.validation.certificationDependencyPass, true);
  assert.equal(result.validation.manifestPass, true);
  assert.equal(result.validation.registryPass, true);
  assert.equal(result.validation.compatibilityPass, true);
  assert.equal(result.validation.releasePass, true);
  assert.ok(result.validation.checks.every((entry) => entry.passed));
  assert.ok(result.checks.every((entry) => entry.passed));
  assert.equal(result.score, 100);
});

test("publishes immutable freeze manifest and registry", () => {
  runCrossScenarioLearningPlatformFreeze(FIXED_TIME);
  const manifest = getCrossScenarioLearningPlatformFreezeManifest();
  assert.ok(manifest);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest?.metadataOnly, true);
  assert.equal(manifest?.releaseTag, CROSS_SCENARIO_LEARNING_PLATFORM_RELEASE_TAG);
  assert.equal(manifest?.consumedCertification, "APP-10/8");
  assert.equal(manifest?.releaseStatus.certified, true);
  assert.equal(manifest?.releaseStatus.frozen, true);
  assert.equal(manifest?.releaseStatus.released, true);
  assert.equal(manifest?.readyForRelease, true);
  assert.equal(manifest?.certifiedPhases.length, 9);
  assert.equal(manifest?.consumers.length, 4);

  const manifestValidation = validateCrossScenarioLearningFreezeManifest(manifest);
  assert.equal(manifestValidation.valid, true, manifestValidation.issues.join("; "));

  const registry = getCrossScenarioLearningPlatformRegistry();
  assert.equal(registry.frozen, true);
  assert.equal(registry.phaseCount, CROSS_SCENARIO_LEARNING_PLATFORM_FROZEN_PHASES.length);
  assert.equal(registry.publicApiCount, CROSS_SCENARIO_LEARNING_PLATFORM_FROZEN_PUBLIC_APIS.length);
  assert.equal(registry.consumerCount, 4);

  const validation = validateCrossScenarioLearningPlatformFreeze();
  assert.equal(validation.valid, true);
});

test("registers certified phases, public APIs, and extension policy", () => {
  const result = runCrossScenarioLearningPlatformFreeze(FIXED_TIME);
  const manifest = result.manifest;
  assert.ok(manifest);
  assert.equal(manifest?.certifiedPhases[0]?.phaseId, "APP-10/1");
  assert.equal(manifest?.certifiedPhases[8]?.phaseId, "APP-10/9");
  assert.ok(manifest?.publicApis.includes("learnHistoricalRecommendations"));
  assert.ok(manifest?.publicApis.includes("runCrossScenarioLearningPlatformFreeze"));
  assert.equal(manifest?.allowedFutureExtensions.length, CROSS_SCENARIO_LEARNING_PLATFORM_ALLOWED_FUTURE_EXTENSIONS.length);
  assert.equal(manifest?.forbiddenChanges.length, CROSS_SCENARIO_LEARNING_PLATFORM_FORBIDDEN_CHANGES.length);
  assert.equal(manifest?.extensionPolicy.facadeRequired, true);
  assert.equal(manifest?.extensionPolicy.layCompatibilityRequired, true);
  assert.ok(manifest?.forbiddenChanges.includes("adding_ml_embeddings_or_vector_search_inside_frozen_core"));
  assert.ok(manifest?.allowedFutureExtensions.includes("lay_learning_adapter_modules"));
});

test("freezeCrossScenarioLearningPlatform publishes release metadata", () => {
  const result = freezeCrossScenarioLearningPlatform(FIXED_TIME);
  assert.equal(result.certified, true);
  assert.equal(result.frozen, true);
  assert.equal(result.released, true);
  assert.equal(result.readyForRelease, true);
  assert.ok(result.manifest);
});

test("CrossScenarioLearningPlatformFreeze namespace exposes public APIs", () => {
  assert.equal(typeof CrossScenarioLearningPlatformFreeze.runCrossScenarioLearningPlatformFreeze, "function");
  assert.equal(typeof CrossScenarioLearningPlatformFreeze.validateCrossScenarioLearningPlatformFreeze, "function");
  assert.equal(typeof CrossScenarioLearningPlatformFreeze.freezeCrossScenarioLearningPlatform, "function");
  assert.equal(typeof CrossScenarioLearningPlatformFreeze.getCrossScenarioLearningPlatformFreezeManifest, "function");
  assert.equal(typeof CrossScenarioLearningPlatformFreeze.getCrossScenarioLearningCompatibility, "function");
  assert.equal(typeof CrossScenarioLearningPlatformFreeze.getCrossScenarioLearningPlatformRegistry, "function");
});

test("buildCrossScenarioLearningPlatformFreezeManifest requires ready certification", () => {
  runCrossScenarioLearningPlatformFreeze(FIXED_TIME);
  const report = CrossScenarioLearningPlatformFreeze.getCrossScenarioLearningPlatformFreezeReport();
  assert.ok(report?.manifest);
  const rebuilt = buildCrossScenarioLearningPlatformFreezeManifest(report!.certification, FIXED_TIME);
  assert.equal(rebuilt.readyForRelease, true);
  assert.equal(rebuilt.appId, "APP-10");
});
