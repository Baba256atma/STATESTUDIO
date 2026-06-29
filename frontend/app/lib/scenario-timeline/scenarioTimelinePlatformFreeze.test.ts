import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  SCENARIO_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION,
  SCENARIO_TIMELINE_PLATFORM_FREEZE_SELF_MANIFEST,
  SCENARIO_TIMELINE_PLATFORM_FUTURE_EXTENSION_POLICY,
  SCENARIO_TIMELINE_PLATFORM_RELEASE_TAG,
} from "./scenarioTimelinePlatformFreezeContracts.ts";
import { getScenarioTimelinePlatformCompatibility } from "./scenarioTimelinePlatformFreezeCompatibility.ts";
import {
  getScenarioTimelinePlatformExtensionPolicy,
  getScenarioTimelinePlatformFreezeManifest,
  getScenarioTimelinePlatformRelease,
} from "./scenarioTimelinePlatformFreezeManifest.ts";
import {
  resetScenarioTimelinePlatformFreezeForTests,
  runScenarioTimelinePlatformFreeze,
  runScenarioTimelinePlatformFreezeCertification,
} from "./scenarioTimelinePlatformFreezeRunner.ts";

test.beforeEach(() => {
  resetScenarioTimelinePlatformFreezeForTests();
});

test("exports APP-5/10 freeze manifest metadata", () => {
  const manifest = getScenarioTimelinePlatformFreezeManifest("2026-01-01T00:00:00.000Z");
  assert.equal(manifest.freezeVersion, SCENARIO_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION);
  assert.equal(manifest.platformStatus.frozen, "FROZEN");
  assert.equal(manifest.releaseTag, SCENARIO_TIMELINE_PLATFORM_RELEASE_TAG);
  assert.equal(manifest.metadataOnly, true);
  assert.equal(manifest.readOnly, true);
  assert.ok(manifest.certifiedPhases.length >= 10);
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(SCENARIO_TIMELINE_PLATFORM_FREEZE_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/scenario-timeline/scenarioTimelinePlatformFreezeRunner.ts",
    allowedFiles: SCENARIO_TIMELINE_PLATFORM_FREEZE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: SCENARIO_TIMELINE_PLATFORM_FREEZE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("publishes compatibility matrix and extension policy", () => {
  const compatibility = getScenarioTimelinePlatformCompatibility();
  assert.equal(compatibility.backwardCompatibility.guaranteed, true);
  assert.equal(compatibility.app5ApiLayer.singleIntegrationBoundary, true);

  const policy = getScenarioTimelinePlatformExtensionPolicy();
  assert.equal(policy.integrationBoundary, "APP-5:6 Public API Layer");
  assert.equal(policy, SCENARIO_TIMELINE_PLATFORM_FUTURE_EXTENSION_POLICY);
});

test("publishes release metadata", () => {
  const release = getScenarioTimelinePlatformRelease("2026-06-28T00:00:00.000Z");
  assert.equal(release.productionReady, true);
  assert.equal(release.releaseTag, SCENARIO_TIMELINE_PLATFORM_RELEASE_TAG);
  assert.equal(release.readOnly, true);
});

test("certifies platform freeze with APP-5:9 confirmation", () => {
  const certification = runScenarioTimelinePlatformFreezeCertification("2026-01-01T00:00:00.000Z");
  assert.equal(certification.status, "PASS", certification.summary);
  assert.equal(certification.certified, true);
  assert.equal(certification.frozen, true);
  assert.equal(certification.released, true);
  assert.equal(certification.productionReady, true);
  assert.equal(certification.priorCertificationStatus, "PASS");
  assert.equal(certification.regressionStatus, "PASS");
  assert.ok(certification.checks.every((entry) => entry.passed));
  assert.equal(certification.platformScore, 100);
});

test("runs official platform freeze", () => {
  const result = runScenarioTimelinePlatformFreeze("2026-01-01T00:00:00.000Z");
  assert.equal(result.status, "PASS");
  assert.equal(result.frozen, true);
  assert.equal(result.productionReady, true);
  assert.equal(result.manifest.platformStatus.productionReady, "PRODUCTION_READY");
});
