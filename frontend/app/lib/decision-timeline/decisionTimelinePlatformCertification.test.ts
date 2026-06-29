import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  DECISION_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  DECISION_TIMELINE_PLATFORM_CERTIFICATION_GROUP_KEYS,
  DECISION_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST,
} from "./decisionTimelinePlatformCertificationManifest.ts";
import {
  DecisionTimelinePlatformCertification,
  getDecisionTimelineCertificationManifest,
  getDecisionTimelineCertificationReport,
  resetDecisionTimelinePlatformCertificationReportForTests,
  runDecisionTimelinePlatformCertification,
  runDecisionTimelinePlatformRegression,
  validateDecisionTimelinePlatform,
} from "./decisionTimelinePlatformCertification.ts";

test.beforeEach(() => {
  resetDecisionTimelinePlatformCertificationReportForTests();
});

test("exports APP-6/11 platform certification contract", () => {
  assert.equal(DECISION_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION, "APP-6/11");
  assert.equal(DECISION_TIMELINE_PLATFORM_CERTIFICATION_GROUP_KEYS.length, 10);
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(DECISION_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/decision-timeline/decisionTimelinePlatformCertification.ts",
    allowedFiles: DECISION_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: DECISION_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("returns certification manifest with ten certified modules", () => {
  const manifest = getDecisionTimelineCertificationManifest();
  assert.equal(manifest.contractVersion, "APP-6/11");
  assert.equal(manifest.certifiedModules.length, 10);
  assert.equal(manifest.certificationGroups.length, 10);
  assert.equal(manifest.certifiedModules[0]?.layerId, "APP-6/1");
  assert.equal(manifest.certifiedModules[9]?.layerId, "APP-6/10");
});

test("validates decision timeline platform without mutation", () => {
  const validation = validateDecisionTimelinePlatform("2026-01-01T00:00:00.000Z");
  assert.equal(validation.valid, true, validation.issues.map((issue) => issue.message).join("; "));
  assert.equal(validation.readOnly, true);
});

test("runs platform regression across APP-6:1 through APP-6:10", () => {
  const regression = runDecisionTimelinePlatformRegression();
  assert.equal(regression.success, true, regression.summary);
  assert.equal(regression.layersTotal, 10);
  assert.equal(regression.layersPassed, 10);
  assert.equal(regression.priorPhasesPreserved, true);
  assert.ok(regression.layerResults.every((entry) => entry.certified));
});

test("certifies complete APP-6 decision timeline platform", () => {
  const certification = runDecisionTimelinePlatformCertification("2026-01-01T00:00:00.000Z");
  assert.equal(certification.status, "PASS", certification.summary);
  assert.equal(certification.certified, true);
  assert.equal(certification.readyForFreeze, true);
  assert.equal(certification.certificationScore, 100);
  assert.equal(certification.report.finalPlatformStatus, "CERTIFIED");
  assert.equal(certification.report.groups.length, 10);
  assert.ok(certification.report.groups.every((group) => group.passed));
  assert.equal(certification.failures.length, 0);

  const cached = getDecisionTimelineCertificationReport();
  assert.ok(cached);
  assert.equal(cached?.certificationVersion, "APP-6/11");
});

test("DecisionTimelinePlatformCertification namespace exposes public APIs", () => {
  assert.equal(typeof DecisionTimelinePlatformCertification.runDecisionTimelinePlatformCertification, "function");
  assert.equal(typeof DecisionTimelinePlatformCertification.runDecisionTimelinePlatformRegression, "function");
  assert.equal(typeof DecisionTimelinePlatformCertification.getDecisionTimelineCertificationManifest, "function");
  assert.equal(typeof DecisionTimelinePlatformCertification.validateDecisionTimelinePlatform, "function");
  assert.equal(typeof DecisionTimelinePlatformCertification.getDecisionTimelineCertificationReport, "function");
});
