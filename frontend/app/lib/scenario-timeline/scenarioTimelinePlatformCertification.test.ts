import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  SCENARIO_TIMELINE_PLATFORM_VALIDATION_GATE_KEYS,
} from "./scenarioTimelinePlatformCertificationConstants.ts";
import { SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST } from "./scenarioTimelinePlatformCertificationContracts.ts";
import {
  certifyScenarioTimelinePlatform,
  getScenarioTimelinePlatformCertificationReport,
  getScenarioTimelinePlatformHealth,
  resetScenarioTimelinePlatformCertificationReportForTests,
  runScenarioTimelineEndToEndCertification,
  runScenarioTimelinePlatformCertification,
  runScenarioTimelinePlatformRegression,
} from "./scenarioTimelinePlatformCertification.ts";

test.beforeEach(() => {
  resetScenarioTimelinePlatformCertificationReportForTests();
});

test("exports APP-5/9 platform certification contract", () => {
  assert.equal(SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION, "APP-5/9");
  assert.equal(SCENARIO_TIMELINE_PLATFORM_VALIDATION_GATE_KEYS.length, 26);
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/scenario-timeline/scenarioTimelinePlatformCertification.ts",
    allowedFiles: SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("runs end-to-end certification through public APIs", () => {
  const result = runScenarioTimelineEndToEndCertification();
  assert.equal(result.success, true, result.summary);
  assert.ok(result.stagesExecuted.includes("public_api"));
  assert.ok(result.stagesExecuted.includes("assistant_context"));
  assert.ok(result.stagesExecuted.includes("dashboard_viewmodel"));
});

test("runs platform regression checks", () => {
  const regression = runScenarioTimelinePlatformRegression();
  assert.equal(regression.success, true);
  assert.ok(regression.checks.every((entry) => entry.passed));
});

test("reports platform health", () => {
  const health = getScenarioTimelinePlatformHealth("2026-01-01T00:00:00.000Z");
  assert.equal(health.readOnly, true);
  assert.equal(health.healthy, true);
  assert.equal(health.allEnginesReady, true);
});

test("certifies complete APP-5 platform", () => {
  const certification = certifyScenarioTimelinePlatform("2026-01-01T00:00:00.000Z");
  assert.equal(certification.status, "PASS", certification.summary);
  assert.equal(certification.certified, true);
  assert.equal(certification.report.finalPlatformStatus, "CERTIFIED");
  assert.equal(certification.report.readyForFreeze, true);
  assert.equal(certification.report.validationGates.length, 26);
  assert.ok(certification.report.validationGates.every((gate) => gate.passed));

  const cached = getScenarioTimelinePlatformCertificationReport();
  assert.ok(cached);
  assert.equal(cached?.certificationVersion, "APP-5/9");
});

test("runScenarioTimelinePlatformCertification matches certifyScenarioTimelinePlatform", () => {
  const direct = runScenarioTimelinePlatformCertification("2026-01-01T00:00:00.000Z");
  assert.equal(direct.certified, true);
  assert.ok(direct.report.compatibilitySummary.length >= 8);
});
