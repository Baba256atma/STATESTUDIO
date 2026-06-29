import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY } from "../cross-scenario-learning/crossScenarioLearningContracts.ts";
import { CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY } from "../confidence-evolution/confidenceEvolutionContracts.ts";
import {
  buildExecutiveRecommendationPlatformCertificationManifest,
  EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_GROUP_KEYS,
  EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_SELF_MANIFEST,
  EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFIED_PHASES,
  validateExecutiveRecommendationPlatformCertificationManifest,
} from "./executiveRecommendationPlatformCertificationManifest.ts";
import {
  ExecutiveRecommendationPlatformCertification,
  certifyExecutiveRecommendationPlatform,
  getExecutiveRecommendationCertificationManifest,
  getExecutiveRecommendationPlatformCertificationReport,
  resetExecutiveRecommendationPlatformCertificationForTests,
  runExecutiveRecommendationPlatformCertification,
  runExecutiveRecommendationPlatformRegression,
  validateExecutiveRecommendationPlatform,
} from "./executiveRecommendationPlatformCertification.ts";
import { resetExecutiveRecommendationDeliveryEnginePlatformForTests } from "./executiveRecommendationDeliveryEngineRunner.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetExecutiveRecommendationDeliveryEnginePlatformForTests();
  resetExecutiveRecommendationPlatformCertificationForTests();
});

test("exports APP-12/8 platform certification contract", () => {
  assert.equal(EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_CONTRACT_VERSION, "APP-12/8");
  assert.equal(EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_GROUP_KEYS.length, 12);
  assert.equal(EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFIED_PHASES.length, 7);
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/executive-recommendation/executiveRecommendationPlatformCertification.ts",
    allowedFiles: EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("validates certification manifest structure", () => {
  const manifest = buildExecutiveRecommendationPlatformCertificationManifest(
    FIXED_TIME,
    true,
    Object.freeze({ layersPassed: 7, layersTotal: 7, success: true, readOnly: true as const }),
    FIXED_TIME
  );
  const validation = validateExecutiveRecommendationPlatformCertificationManifest(manifest);
  assert.equal(validation.valid, true, validation.issues.join("; "));
  assert.equal(manifest.phases.length, 7);
  assert.equal(manifest.appId, "APP-12");
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.certificationStatus.readyForFreeze, true);
});

test("validates executive recommendation platform without mutation", () => {
  const validation = validateExecutiveRecommendationPlatform(FIXED_TIME);
  assert.equal(validation.valid, true, validation.issues.join("; "));
  assert.equal(validation.readOnly, true);
});

test("runs full APP-12 platform regression", () => {
  const regression = runExecutiveRecommendationPlatformRegression(FIXED_TIME);
  assert.equal(regression.success, true, regression.summary);
  assert.equal(regression.layersTotal, 7);
  assert.equal(regression.layersPassed, 7);
  assert.equal(regression.priorPhasesPreserved, true);
  assert.ok(regression.layerResults.every((entry) => entry.certified));
});

test("dependency chain includes all APP-12 phases", () => {
  const regression = runExecutiveRecommendationPlatformRegression(FIXED_TIME);
  const layerIds = regression.layerResults.map((entry) => entry.layerId);
  assert.deepEqual(layerIds, [
    "APP-12/1",
    "APP-12/2",
    "APP-12/3",
    "APP-12/4",
    "APP-12/5",
    "APP-12/6",
    "APP-12/7",
  ]);
});

test("runs executive recommendation platform certification", () => {
  const result = runExecutiveRecommendationPlatformCertification(FIXED_TIME);
  assert.equal(
    result.certified,
    true,
    result.report.groups
      .filter((entry) => !entry.passed)
      .map((entry) => entry.groupKey)
      .join(", ")
  );
  assert.equal(result.report.failedCount, 0);
  assert.equal(result.report.groupCount, 12);
  assert.equal(result.report.groupsPassed, 12);
  assert.equal(result.report.phase, "APP-12/8");
  assert.equal(result.report.summary.readyForFreeze, true);
});

test("certifies executive recommendation platform with manifest", () => {
  const result = certifyExecutiveRecommendationPlatform(FIXED_TIME);
  assert.equal(result.certified, true);
  assert.equal(result.readyForFreeze, true);
  assert.equal(result.manifest.phases.length, 7);
  assert.equal(result.manifest.certificationStatus.certified, true);
  assert.equal(Object.isFrozen(result), true);
});

test("returns certification manifest via getter", () => {
  runExecutiveRecommendationPlatformCertification(FIXED_TIME);
  const manifest = getExecutiveRecommendationCertificationManifest(FIXED_TIME);
  assert.equal(manifest.platformVersion, "APP-12/8");
  assert.equal(manifest.publicApis.length >= 12, true);
  assert.equal(Object.isFrozen(manifest), true);
});

test("returns certification report via getter", () => {
  runExecutiveRecommendationPlatformCertification(FIXED_TIME);
  const report = getExecutiveRecommendationPlatformCertificationReport(FIXED_TIME);
  assert.equal(report.certified, true);
  assert.equal(report.regression.layersTotal, 7);
});

test("ExecutiveRecommendationPlatformCertification namespace exposes public APIs", () => {
  assert.equal(typeof ExecutiveRecommendationPlatformCertification.runExecutiveRecommendationPlatformCertification, "function");
  assert.equal(typeof ExecutiveRecommendationPlatformCertification.runExecutiveRecommendationPlatformRegression, "function");
  assert.equal(typeof ExecutiveRecommendationPlatformCertification.validateExecutiveRecommendationPlatform, "function");
  assert.equal(typeof ExecutiveRecommendationPlatformCertification.certifyExecutiveRecommendationPlatform, "function");
  assert.equal(ExecutiveRecommendationPlatformCertification.version, "APP-12/8");
});

test("regression: APP-9 and APP-10 platforms remain valid", () => {
  assert.equal(CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId, "APP-9");
  assert.equal(CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY.appId, "APP-10");
});

test("all certification groups report independently", () => {
  const result = runExecutiveRecommendationPlatformCertification(FIXED_TIME);
  assert.ok(result.report.groups.every((entry) => typeof entry.passed === "boolean"));
  assert.ok(result.report.groups.every((entry) => entry.checks.length > 0));
  assert.ok(result.report.groups.every((entry) => Object.isFrozen(entry)));
});

test("manifest includes compatibility matrix and consumers", () => {
  const manifest = buildExecutiveRecommendationPlatformCertificationManifest(
    FIXED_TIME,
    true,
    Object.freeze({ layersPassed: 7, layersTotal: 7, success: true, readOnly: true as const }),
    FIXED_TIME
  );
  assert.ok(manifest.compatibilityMatrix.length >= 5);
  assert.equal(manifest.supportedConsumers.length, 4);
  assert.ok(Object.keys(manifest.dependencyVersions).length === 7);
});
