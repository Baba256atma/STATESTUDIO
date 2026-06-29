import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  BusinessTimelinePlatformFreeze,
  buildBusinessTimelinePlatformFreezeManifest,
  BUSINESS_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION,
  BUSINESS_TIMELINE_PLATFORM_FREEZE_SELF_MANIFEST,
  getBusinessTimelineCompatibility,
  getBusinessTimelineFreezeManifest,
  getBusinessTimelinePlatformRegistry,
  resetBusinessTimelinePlatformFreezeForTests,
  runBusinessTimelinePlatformFreeze,
  validateBusinessTimelinePlatformFreeze,
} from "./businessTimelinePlatformFreeze.ts";
import {
  BUSINESS_TIMELINE_PLATFORM_ALLOWED_FUTURE_EXTENSIONS,
  BUSINESS_TIMELINE_PLATFORM_FORBIDDEN_CHANGES,
  BUSINESS_TIMELINE_PLATFORM_FROZEN_PHASES,
  BUSINESS_TIMELINE_PLATFORM_FROZEN_PUBLIC_APIS,
  BUSINESS_TIMELINE_PLATFORM_RELEASE_TAG,
} from "./businessTimelinePlatformFreezeRegistry.ts";
import { validateBusinessTimelineFreezeManifest } from "./businessTimelinePlatformFreezeManifest.ts";
import { validateBusinessTimelinePlatformFreeze as validateFreezeManifest } from "./businessTimelinePlatformFreezeValidation.ts";
import type { BusinessTimelinePlatformCertificationResult } from "./businessTimelinePlatformCertification.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetBusinessTimelinePlatformFreezeForTests();
});

test("exports APP-7/8 freeze contract metadata", () => {
  assert.equal(BUSINESS_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION, "APP-7/8");
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(BUSINESS_TIMELINE_PLATFORM_FREEZE_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/business-timeline/businessTimelinePlatformFreeze.ts",
    allowedFiles: BUSINESS_TIMELINE_PLATFORM_FREEZE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: BUSINESS_TIMELINE_PLATFORM_FREEZE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("publishes compatibility matrix", () => {
  const compatibility = getBusinessTimelineCompatibility();
  assert.equal(compatibility.backwardCompatibility.guaranteed, true);
  assert.equal(compatibility.app7Platform.compatible, true);
  assert.equal(compatibility.app5ScenarioTimeline.directInternalCouplingForbidden, true);
  assert.equal(compatibility.app6DecisionTimeline.directInternalCouplingForbidden, true);
  assert.equal(compatibility.dashboardConsumer.integrationPath, "APP-7:6 facade");
  assert.equal(compatibility.workspaceConsumer.workspaceIsolationRequired, true);
});

test("rejects freeze when certification fails", () => {
  const blockedCertification = Object.freeze({
    certified: false,
    readyForFreeze: false,
    certificationScore: 0,
    warnings: Object.freeze([]),
    failures: Object.freeze([Object.freeze({ code: "blocked", message: "blocked", readOnly: true as const })]),
    status: "FAIL" as const,
    summary: "blocked",
    report: Object.freeze({
      platformIdentity: "APP-7",
      certificationVersion: "APP-7/7",
      certificationTimestamp: FIXED_TIME,
      certificationScore: 0,
      groups: Object.freeze([]),
      regressionSummary: "failed",
      layerRegressionResults: Object.freeze([]),
      readinessSummary: "not ready",
      readyForFreeze: false,
      certifiedModules: Object.freeze([]),
      warnings: Object.freeze([]),
      failures: Object.freeze([]),
      certified: false,
      finalPlatformStatus: "NOT_CERTIFIED" as const,
      readOnly: true as const,
    }),
    readOnly: true as const,
  }) satisfies BusinessTimelinePlatformCertificationResult;

  const validation = validateFreezeManifest(blockedCertification, null);
  assert.equal(validation.valid, false);
  assert.equal(validation.certificationDependencyPass, false);
  assert.ok(validation.issues.some((issue) => issue.code === "not_ready_for_freeze"));
});

test("rejects freeze when readyForFreeze is false", () => {
  const notReadyCertification = Object.freeze({
    certified: true,
    readyForFreeze: false,
    certificationScore: 100,
    warnings: Object.freeze([]),
    failures: Object.freeze([]),
    status: "PASS" as const,
    summary: "certified but not ready",
    report: Object.freeze({
      platformIdentity: "APP-7",
      certificationVersion: "APP-7/7",
      certificationTimestamp: FIXED_TIME,
      certificationScore: 100,
      groups: Object.freeze([]),
      regressionSummary: "passed",
      layerRegressionResults: Object.freeze([]),
      readinessSummary: "not ready",
      readyForFreeze: false,
      certifiedModules: Object.freeze([]),
      warnings: Object.freeze([]),
      failures: Object.freeze([]),
      certified: true,
      finalPlatformStatus: "CERTIFIED" as const,
      readOnly: true as const,
    }),
    readOnly: true as const,
  }) satisfies BusinessTimelinePlatformCertificationResult;

  const validation = validateFreezeManifest(notReadyCertification, null);
  assert.equal(validation.valid, false);
  assert.equal(validation.certificationDependencyPass, false);
});

test("runs official platform freeze with APP-7:7 certification dependency", () => {
  const result = runBusinessTimelinePlatformFreeze(FIXED_TIME);
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
  runBusinessTimelinePlatformFreeze(FIXED_TIME);
  const manifest = getBusinessTimelineFreezeManifest();
  assert.ok(manifest);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest?.metadataOnly, true);
  assert.equal(manifest?.releaseTag, BUSINESS_TIMELINE_PLATFORM_RELEASE_TAG);
  assert.equal(manifest?.consumedCertification, "APP-7/7");
  assert.equal(manifest?.releaseStatus.certified, true);
  assert.equal(manifest?.releaseStatus.frozen, true);
  assert.equal(manifest?.releaseStatus.released, true);
  assert.equal(manifest?.readyForRelease, true);
  assert.equal(manifest?.certifiedPhases.length, 8);
  assert.equal(manifest?.consumers.length, 7);

  const manifestValidation = validateBusinessTimelineFreezeManifest(manifest);
  assert.equal(manifestValidation.valid, true, manifestValidation.issues.join("; "));

  const registry = getBusinessTimelinePlatformRegistry();
  assert.equal(registry.frozen, true);
  assert.equal(registry.phaseCount, BUSINESS_TIMELINE_PLATFORM_FROZEN_PHASES.length);
  assert.equal(registry.publicApiCount, BUSINESS_TIMELINE_PLATFORM_FROZEN_PUBLIC_APIS.length);
  assert.equal(registry.consumerCount, 7);

  const validation = validateBusinessTimelinePlatformFreeze();
  assert.equal(validation.valid, true);
});

test("registers certified phases, public APIs, and extension policy", () => {
  const result = runBusinessTimelinePlatformFreeze(FIXED_TIME);
  const manifest = result.manifest;
  assert.ok(manifest);
  assert.equal(manifest?.certifiedPhases[0]?.phaseId, "APP-7/1");
  assert.equal(manifest?.certifiedPhases[7]?.phaseId, "APP-7/8");
  assert.ok(manifest?.publicApis.includes("createBusinessTimelineApi"));
  assert.ok(manifest?.publicApis.includes("runBusinessTimelinePlatformFreeze"));
  assert.equal(manifest?.allowedFutureExtensions.length, BUSINESS_TIMELINE_PLATFORM_ALLOWED_FUTURE_EXTENSIONS.length);
  assert.equal(manifest?.forbiddenChanges.length, BUSINESS_TIMELINE_PLATFORM_FORBIDDEN_CHANGES.length);
  assert.equal(manifest?.extensionPolicy.facadeRequired, true);
});

test("BusinessTimelinePlatformFreeze namespace exposes public APIs", () => {
  assert.equal(typeof BusinessTimelinePlatformFreeze.runBusinessTimelinePlatformFreeze, "function");
  assert.equal(typeof BusinessTimelinePlatformFreeze.validateBusinessTimelinePlatformFreeze, "function");
  assert.equal(typeof BusinessTimelinePlatformFreeze.getBusinessTimelineFreezeManifest, "function");
  assert.equal(typeof BusinessTimelinePlatformFreeze.getBusinessTimelineCompatibility, "function");
  assert.equal(typeof BusinessTimelinePlatformFreeze.getBusinessTimelinePlatformRegistry, "function");
});

test("buildBusinessTimelinePlatformFreezeManifest requires ready certification", () => {
  runBusinessTimelinePlatformFreeze(FIXED_TIME);
  const report = BusinessTimelinePlatformFreeze.getBusinessTimelinePlatformFreezeReport();
  assert.ok(report?.manifest);
  const rebuilt = buildBusinessTimelinePlatformFreezeManifest(report!.certification, FIXED_TIME);
  assert.equal(rebuilt.readyForRelease, true);
  assert.equal(rebuilt.appId, "APP-7");
});
