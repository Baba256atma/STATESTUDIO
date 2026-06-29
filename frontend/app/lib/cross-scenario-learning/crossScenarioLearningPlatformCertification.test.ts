import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  buildCrossScenarioLearningPlatformCertificationManifest,
  CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_GROUP_KEYS,
  CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_SELF_MANIFEST,
  CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFIED_MODULES,
  validateCrossScenarioLearningPlatformCertificationManifest,
} from "./crossScenarioLearningPlatformCertificationManifest.ts";
import {
  CrossScenarioLearningPlatformCertification,
  certifyCrossScenarioLearningPlatform,
  getCrossScenarioLearningCertificationManifest,
  getCrossScenarioLearningPlatformCertificationReport,
  resetCrossScenarioLearningPlatformCertificationForTests,
  runCrossScenarioLearningPlatformCertification,
  runCrossScenarioLearningPlatformRegression,
  validateCrossScenarioLearningPlatform,
} from "./crossScenarioLearningPlatformCertification.ts";
import { resetRecommendationLearningEnginePlatformForTests } from "./recommendationLearningEngineRunner.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetRecommendationLearningEnginePlatformForTests();
  resetCrossScenarioLearningPlatformCertificationForTests();
});

test("exports APP-10/8 platform certification contract", () => {
  assert.equal(CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_CONTRACT_VERSION, "APP-10/8");
  assert.equal(CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_GROUP_KEYS.length, 12);
  assert.equal(CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFIED_MODULES.length, 7);
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/cross-scenario-learning/crossScenarioLearningPlatformCertification.ts",
    allowedFiles: CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("validates certification manifest structure", () => {
  const manifest = buildCrossScenarioLearningPlatformCertificationManifest(
    FIXED_TIME,
    true,
    Object.freeze({ layersPassed: 7, layersTotal: 7, success: true, readOnly: true as const }),
    FIXED_TIME
  );
  const validation = validateCrossScenarioLearningPlatformCertificationManifest(manifest);
  assert.equal(validation.valid, true, validation.issues.join("; "));
  assert.equal(manifest.phases.length, 7);
  assert.equal(manifest.appId, "APP-10");
  assert.equal(Object.isFrozen(manifest), true);
});

test("validates cross-scenario learning platform without mutation", () => {
  const validation = validateCrossScenarioLearningPlatform(FIXED_TIME);
  assert.equal(validation.valid, true, validation.issues.join("; "));
  assert.equal(validation.readOnly, true);
});

test("runs full APP-10 platform regression", () => {
  const regression = runCrossScenarioLearningPlatformRegression(FIXED_TIME);
  assert.equal(regression.success, true, regression.summary);
  assert.equal(regression.layersTotal, 7);
  assert.equal(regression.layersPassed, 7);
  assert.equal(regression.priorPhasesPreserved, true);
  assert.ok(regression.layerResults.every((entry) => entry.certified));
});

test("dependency chain includes all APP-10 phases", () => {
  const regression = runCrossScenarioLearningPlatformRegression(FIXED_TIME);
  const layerIds = regression.layerResults.map((entry) => entry.layerId);
  assert.deepEqual(layerIds, [
    "APP-10/1",
    "APP-10/2",
    "APP-10/3",
    "APP-10/4",
    "APP-10/5",
    "APP-10/6",
    "APP-10/7",
  ]);
});

test("certifies complete APP-10 cross-scenario learning platform", () => {
  const certification = runCrossScenarioLearningPlatformCertification(FIXED_TIME);
  assert.equal(certification.certified, true);
  assert.equal(certification.report.certified, true);
  assert.equal(certification.report.groups.length, 12);
  assert.ok(certification.report.groups.every((entry) => entry.passed));
  assert.equal(certification.report.failedCount, 0);
  assert.equal(certification.report.regression.success, true);

  const cached = getCrossScenarioLearningPlatformCertificationReport();
  assert.ok(cached);
  assert.equal(cached?.certified, true);
});

test("public certification APIs are available", () => {
  assert.equal(typeof certifyCrossScenarioLearningPlatform, "function");
  assert.equal(typeof validateCrossScenarioLearningPlatform, "function");
  assert.equal(typeof runCrossScenarioLearningPlatformCertification, "function");
  assert.equal(typeof getCrossScenarioLearningCertificationManifest, "function");
});

test("certifyCrossScenarioLearningPlatform returns manifest and readyForFreeze", () => {
  const result = certifyCrossScenarioLearningPlatform(FIXED_TIME);
  assert.equal(result.certified, true);
  assert.equal(result.readyForFreeze, true);
  assert.equal(result.manifest.certificationStatus.certified, true);
  assert.equal(result.manifest.certificationStatus.readyForFreeze, true);
  assert.ok(result.manifest.certificationStatus.certificationTimestamp);
});

test("platform certification bundle exports", () => {
  assert.equal(
    typeof CrossScenarioLearningPlatformCertification.runCrossScenarioLearningPlatformCertification,
    "function"
  );
  assert.equal(typeof CrossScenarioLearningPlatformCertification.runCrossScenarioLearningPlatformRegression, "function");
  assert.equal(typeof CrossScenarioLearningPlatformCertification.certifyCrossScenarioLearningPlatform, "function");
  assert.equal(CrossScenarioLearningPlatformCertification.version, "APP-10/8");
});

test("getCrossScenarioLearningCertificationManifest caches after certification", () => {
  runCrossScenarioLearningPlatformCertification(FIXED_TIME);
  const manifest = getCrossScenarioLearningCertificationManifest(FIXED_TIME);
  assert.equal(manifest.platformVersion, "APP-10/8");
  assert.equal(manifest.regressionSummary.layersTotal, 7);
});
