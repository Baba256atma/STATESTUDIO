import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  ExecutiveRecommendationPlatformFreeze,
  buildExecutiveRecommendationPlatformFreezeManifest,
  EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_SELF_MANIFEST,
  freezeExecutiveRecommendationPlatform,
  getExecutiveRecommendationCompatibility,
  getExecutiveRecommendationPlatformFreezeManifest,
  getExecutiveRecommendationPlatformRegistry,
  resetExecutiveRecommendationPlatformFreezeForTests,
  runExecutiveRecommendationPlatformFreeze,
  validateExecutiveRecommendationPlatformFreeze,
} from "./executiveRecommendationPlatformFreeze.ts";
import {
  EXECUTIVE_RECOMMENDATION_PLATFORM_ALLOWED_FUTURE_EXTENSIONS,
  EXECUTIVE_RECOMMENDATION_PLATFORM_FORBIDDEN_CHANGES,
  EXECUTIVE_RECOMMENDATION_PLATFORM_FROZEN_PHASES,
  EXECUTIVE_RECOMMENDATION_PLATFORM_FROZEN_PUBLIC_APIS,
  EXECUTIVE_RECOMMENDATION_PLATFORM_RELEASE_TAG,
} from "./executiveRecommendationPlatformFreezeRegistry.ts";
import { validateExecutiveRecommendationFreezeManifest } from "./executiveRecommendationPlatformFreezeManifest.ts";
import { validateExecutiveRecommendationPlatformFreeze as validateFreezeManifest } from "./executiveRecommendationPlatformFreezeValidation.ts";
import type { ExecutiveRecommendationPlatformFreezeCertificationDependency } from "./executiveRecommendationPlatformFreezeTypes.ts";
import { resetExecutiveRecommendationPlatformCertificationForTests } from "./executiveRecommendationPlatformCertificationRunner.ts";
import { resetExecutiveRecommendationDeliveryEnginePlatformForTests } from "./executiveRecommendationDeliveryEngineRunner.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetExecutiveRecommendationDeliveryEnginePlatformForTests();
  resetExecutiveRecommendationPlatformCertificationForTests();
  resetExecutiveRecommendationPlatformFreezeForTests();
});

test("exports APP-12/9 freeze contract metadata", () => {
  assert.equal(EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_CONTRACT_VERSION, "APP-12/9");
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/executive-recommendation/executiveRecommendationPlatformFreeze.ts",
    allowedFiles: EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("publishes compatibility matrix", () => {
  const compatibility = getExecutiveRecommendationCompatibility();
  assert.equal(compatibility.backwardCompatibility.guaranteed, true);
  assert.equal(compatibility.app12Platform.compatible, true);
  assert.equal(compatibility.app5ScenarioTimeline.directInternalCouplingForbidden, true);
  assert.equal(compatibility.app10CrossScenarioLearning.directInternalCouplingForbidden, true);
  assert.equal(compatibility.app11ExecutiveInbox.directInternalCouplingForbidden, true);
  assert.equal(compatibility.intPlatform.readOnlyReferenceOnly, true);
  assert.equal(compatibility.dsPlatform.metadataOnly, true);
  assert.equal(compatibility.layPlatform.extendOnly, true);
  assert.equal(compatibility.dashboardConsumer.integrationPath, "future APP-12 API facade");
  assert.equal(compatibility.workspaceConsumer.workspaceIsolationRequired, true);
});

test("consumes APP-12:8 certification", () => {
  const result = runExecutiveRecommendationPlatformFreeze(FIXED_TIME);
  assert.equal(result.certification.certified, true);
  assert.equal(result.certification.report.contractVersion, "APP-12/8");
  assert.equal(result.manifest?.consumedCertification, "APP-12/8");
});

test("rejects freeze when certification fails", () => {
  const blockedCertification = Object.freeze({
    certified: false,
    readyForFreeze: false,
    report: Object.freeze({
      certified: false,
      phase: "APP-12/8" as const,
      contractVersion: "APP-12/8" as const,
      platformVersion: "APP-12/8" as const,
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
      summary: Object.freeze({
        certified: false,
        readyForFreeze: false,
        certificationTimestamp: null,
        contractVersion: "APP-12/8" as const,
        readOnly: true as const,
      }),
      timestamp: FIXED_TIME,
      readOnly: true as const,
    }),
    readOnly: true as const,
  }) satisfies ExecutiveRecommendationPlatformFreezeCertificationDependency;

  const validation = validateFreezeManifest(blockedCertification, null);
  assert.equal(validation.valid, false);
  assert.equal(validation.certificationDependencyPass, false);
  assert.ok(validation.issues.some((issue) => issue.code === "not_ready_for_freeze"));
});

test("runs official platform freeze with APP-12:8 certification dependency", () => {
  const result = runExecutiveRecommendationPlatformFreeze(FIXED_TIME);
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
  runExecutiveRecommendationPlatformFreeze(FIXED_TIME);
  const manifest = getExecutiveRecommendationPlatformFreezeManifest();
  assert.ok(manifest);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest?.metadataOnly, true);
  assert.equal(manifest?.releaseTag, EXECUTIVE_RECOMMENDATION_PLATFORM_RELEASE_TAG);
  assert.equal(manifest?.consumedCertification, "APP-12/8");
  assert.equal(manifest?.releaseStatus.certified, true);
  assert.equal(manifest?.releaseStatus.frozen, true);
  assert.equal(manifest?.releaseStatus.released, true);
  assert.equal(manifest?.readyForRelease, true);
  assert.equal(manifest?.certifiedPhases.length, 9);
  assert.equal(manifest?.consumers.length, 4);

  const manifestValidation = validateExecutiveRecommendationFreezeManifest(manifest);
  assert.equal(manifestValidation.valid, true, manifestValidation.issues.join("; "));

  const registry = getExecutiveRecommendationPlatformRegistry();
  assert.equal(registry.frozen, true);
  assert.equal(registry.phaseCount, EXECUTIVE_RECOMMENDATION_PLATFORM_FROZEN_PHASES.length);
  assert.equal(registry.publicApiCount, EXECUTIVE_RECOMMENDATION_PLATFORM_FROZEN_PUBLIC_APIS.length);
  assert.equal(registry.consumerCount, 4);

  const validation = validateExecutiveRecommendationPlatformFreeze();
  assert.equal(validation.valid, true);
});

test("registers certified phases, public APIs, and extension policy", () => {
  const result = runExecutiveRecommendationPlatformFreeze(FIXED_TIME);
  const manifest = result.manifest;
  assert.ok(manifest);
  assert.equal(manifest?.certifiedPhases[0]?.phaseId, "APP-12/1");
  assert.equal(manifest?.certifiedPhases[8]?.phaseId, "APP-12/9");
  assert.ok(manifest?.publicApis.includes("optimizeExecutiveRecommendations"));
  assert.ok(manifest?.publicApis.includes("runExecutiveRecommendationPlatformFreeze"));
  assert.equal(manifest?.allowedFutureExtensions.length, EXECUTIVE_RECOMMENDATION_PLATFORM_ALLOWED_FUTURE_EXTENSIONS.length);
  assert.equal(manifest?.forbiddenChanges.length, EXECUTIVE_RECOMMENDATION_PLATFORM_FORBIDDEN_CHANGES.length);
  assert.equal(manifest?.extensionPolicy.facadeRequired, true);
  assert.equal(manifest?.extensionPolicy.layCompatibilityRequired, true);
  assert.ok(manifest?.forbiddenChanges.includes("adding_recommendation_execution_inside_frozen_core"));
  assert.ok(manifest?.allowedFutureExtensions.includes("lay_recommendation_adapter_modules"));
});

test("freezeExecutiveRecommendationPlatform publishes release metadata", () => {
  const result = freezeExecutiveRecommendationPlatform(FIXED_TIME);
  assert.equal(result.certified, true);
  assert.equal(result.frozen, true);
  assert.equal(result.released, true);
  assert.equal(result.readyForRelease, true);
  assert.ok(result.manifest);
});

test("ExecutiveRecommendationPlatformFreeze namespace exposes public APIs", () => {
  assert.equal(typeof ExecutiveRecommendationPlatformFreeze.runExecutiveRecommendationPlatformFreeze, "function");
  assert.equal(typeof ExecutiveRecommendationPlatformFreeze.validateExecutiveRecommendationPlatformFreeze, "function");
  assert.equal(typeof ExecutiveRecommendationPlatformFreeze.freezeExecutiveRecommendationPlatform, "function");
  assert.equal(typeof ExecutiveRecommendationPlatformFreeze.getExecutiveRecommendationPlatformFreezeManifest, "function");
  assert.equal(typeof ExecutiveRecommendationPlatformFreeze.getExecutiveRecommendationCompatibility, "function");
  assert.equal(typeof ExecutiveRecommendationPlatformFreeze.getExecutiveRecommendationPlatformRegistry, "function");
});

test("buildExecutiveRecommendationPlatformFreezeManifest requires ready certification", () => {
  runExecutiveRecommendationPlatformFreeze(FIXED_TIME);
  const report = ExecutiveRecommendationPlatformFreeze.getExecutiveRecommendationPlatformFreezeReport();
  assert.ok(report?.manifest);
  const rebuilt = buildExecutiveRecommendationPlatformFreezeManifest(report!.certification, FIXED_TIME);
  assert.equal(rebuilt.readyForRelease, true);
  assert.equal(rebuilt.appId, "APP-12");
});
