import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY } from "../cross-scenario-learning/crossScenarioLearningContracts.ts";
import {
  buildExecutiveInboxPlatformCertificationManifest,
  EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_GROUP_KEYS,
  EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_SELF_MANIFEST,
  EXECUTIVE_INBOX_PLATFORM_CERTIFIED_MODULES,
  validateExecutiveInboxPlatformCertificationManifest,
} from "./executiveInboxPlatformCertificationManifest.ts";
import {
  ExecutiveInboxPlatformCertification,
  certifyExecutiveInboxPlatform,
  getExecutiveInboxCertificationManifest,
  getExecutiveInboxPlatformCertificationReport,
  resetExecutiveInboxPlatformCertificationForTests,
  runExecutiveInboxPlatformCertification,
  runExecutiveInboxPlatformRegression,
  validateExecutiveInboxPlatform,
} from "./executiveInboxPlatformCertification.ts";
import { resetExecutiveInboxSchedulingEnginePlatformForTests } from "./executiveInboxSchedulingEngineRunner.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetExecutiveInboxSchedulingEnginePlatformForTests();
  resetExecutiveInboxPlatformCertificationForTests();
});

test("exports APP-11/7 platform certification contract", () => {
  assert.equal(EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_CONTRACT_VERSION, "APP-11/7");
  assert.equal(EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_GROUP_KEYS.length, 12);
  assert.equal(EXECUTIVE_INBOX_PLATFORM_CERTIFIED_MODULES.length, 6);
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/executive-inbox/executiveInboxPlatformCertification.ts",
    allowedFiles: EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("validates certification manifest structure", () => {
  const manifest = buildExecutiveInboxPlatformCertificationManifest(
    FIXED_TIME,
    true,
    Object.freeze({ layersPassed: 6, layersTotal: 6, success: true, readOnly: true as const }),
    FIXED_TIME
  );
  const validation = validateExecutiveInboxPlatformCertificationManifest(manifest);
  assert.equal(validation.valid, true, validation.issues.join("; "));
  assert.equal(manifest.phases.length, 6);
  assert.equal(manifest.appId, "APP-11");
  assert.equal(Object.isFrozen(manifest), true);
});

test("validates executive inbox platform without mutation", () => {
  const validation = validateExecutiveInboxPlatform(FIXED_TIME);
  assert.equal(validation.valid, true, validation.issues.join("; "));
  assert.equal(validation.readOnly, true);
});

test("runs full APP-11 platform regression", () => {
  const regression = runExecutiveInboxPlatformRegression(FIXED_TIME);
  assert.equal(regression.success, true, regression.summary);
  assert.equal(regression.layersTotal, 6);
  assert.equal(regression.layersPassed, 6);
  assert.equal(regression.priorPhasesPreserved, true);
  assert.ok(regression.layerResults.every((entry) => entry.certified));
});

test("dependency chain includes all APP-11 phases", () => {
  const regression = runExecutiveInboxPlatformRegression(FIXED_TIME);
  const layerIds = regression.layerResults.map((entry) => entry.layerId);
  assert.deepEqual(layerIds, [
    "APP-11/1",
    "APP-11/2",
    "APP-11/3",
    "APP-11/4",
    "APP-11/5",
    "APP-11/6",
  ]);
});

test("certifies complete APP-11 executive inbox platform", () => {
  const certification = runExecutiveInboxPlatformCertification(FIXED_TIME);
  assert.equal(certification.certified, true);
  assert.equal(certification.report.certified, true);
  assert.equal(certification.report.groups.length, 12);
  assert.ok(certification.report.groups.every((entry) => entry.passed));
  assert.equal(certification.report.failedCount, 0);
  assert.equal(certification.report.regression.success, true);

  const cached = getExecutiveInboxPlatformCertificationReport();
  assert.ok(cached);
  assert.equal(cached?.certified, true);
});

test("public certification APIs are available", () => {
  assert.equal(typeof certifyExecutiveInboxPlatform, "function");
  assert.equal(typeof validateExecutiveInboxPlatform, "function");
  assert.equal(typeof runExecutiveInboxPlatformCertification, "function");
  assert.equal(typeof getExecutiveInboxCertificationManifest, "function");
});

test("certifyExecutiveInboxPlatform returns manifest and readyForFreeze", () => {
  const result = certifyExecutiveInboxPlatform(FIXED_TIME);
  assert.equal(result.certified, true);
  assert.equal(result.readyForFreeze, true);
  assert.equal(result.manifest.certificationStatus.certified, true);
  assert.equal(result.manifest.certificationStatus.readyForFreeze, true);
  assert.ok(result.manifest.certificationStatus.certificationTimestamp);
});

test("platform certification bundle exports", () => {
  assert.equal(typeof ExecutiveInboxPlatformCertification.runExecutiveInboxPlatformCertification, "function");
  assert.equal(typeof ExecutiveInboxPlatformCertification.runExecutiveInboxPlatformRegression, "function");
  assert.equal(typeof ExecutiveInboxPlatformCertification.certifyExecutiveInboxPlatform, "function");
  assert.equal(ExecutiveInboxPlatformCertification.version, "APP-11/7");
});

test("getExecutiveInboxCertificationManifest caches after certification", () => {
  runExecutiveInboxPlatformCertification(FIXED_TIME);
  const manifest = getExecutiveInboxCertificationManifest(FIXED_TIME);
  assert.equal(manifest.platformVersion, "APP-11/7");
  assert.equal(manifest.regressionSummary.layersTotal, 6);
});

test("regression: APP-10 platform remains valid", () => {
  assert.equal(CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY.appId, "APP-10");
});
