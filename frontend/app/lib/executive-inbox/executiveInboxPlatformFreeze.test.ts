import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  ExecutiveInboxPlatformFreeze,
  buildExecutiveInboxPlatformFreezeManifest,
  EXECUTIVE_INBOX_PLATFORM_FREEZE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_PLATFORM_FREEZE_SELF_MANIFEST,
  freezeExecutiveInboxPlatform,
  getExecutiveInboxCompatibility,
  getExecutiveInboxPlatformFreezeManifest,
  getExecutiveInboxPlatformRegistry,
  resetExecutiveInboxPlatformFreezeForTests,
  runExecutiveInboxPlatformFreeze,
  validateExecutiveInboxPlatformFreeze,
} from "./executiveInboxPlatformFreeze.ts";
import {
  EXECUTIVE_INBOX_PLATFORM_ALLOWED_FUTURE_EXTENSIONS,
  EXECUTIVE_INBOX_PLATFORM_FORBIDDEN_CHANGES,
  EXECUTIVE_INBOX_PLATFORM_FROZEN_PHASES,
  EXECUTIVE_INBOX_PLATFORM_FROZEN_PUBLIC_APIS,
  EXECUTIVE_INBOX_PLATFORM_RELEASE_TAG,
} from "./executiveInboxPlatformFreezeRegistry.ts";
import { validateExecutiveInboxFreezeManifest } from "./executiveInboxPlatformFreezeManifest.ts";
import { validateExecutiveInboxPlatformFreeze as validateFreezeManifest } from "./executiveInboxPlatformFreezeValidation.ts";
import type { ExecutiveInboxPlatformFreezeCertificationDependency } from "./executiveInboxPlatformFreezeTypes.ts";
import { resetExecutiveInboxPlatformCertificationForTests } from "./executiveInboxPlatformCertificationRunner.ts";
import { resetExecutiveInboxSchedulingEnginePlatformForTests } from "./executiveInboxSchedulingEngineRunner.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetExecutiveInboxSchedulingEnginePlatformForTests();
  resetExecutiveInboxPlatformCertificationForTests();
  resetExecutiveInboxPlatformFreezeForTests();
});

test("exports APP-11/8 freeze contract metadata", () => {
  assert.equal(EXECUTIVE_INBOX_PLATFORM_FREEZE_CONTRACT_VERSION, "APP-11/8");
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(EXECUTIVE_INBOX_PLATFORM_FREEZE_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/executive-inbox/executiveInboxPlatformFreeze.ts",
    allowedFiles: EXECUTIVE_INBOX_PLATFORM_FREEZE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: EXECUTIVE_INBOX_PLATFORM_FREEZE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("publishes compatibility matrix", () => {
  const compatibility = getExecutiveInboxCompatibility();
  assert.equal(compatibility.backwardCompatibility.guaranteed, true);
  assert.equal(compatibility.app11Platform.compatible, true);
  assert.equal(compatibility.app5ScenarioTimeline.directInternalCouplingForbidden, true);
  assert.equal(compatibility.app10CrossScenarioLearning.directInternalCouplingForbidden, true);
  assert.equal(compatibility.intPlatform.readOnlyReferenceOnly, true);
  assert.equal(compatibility.dsPlatform.metadataOnly, true);
  assert.equal(compatibility.layPlatform.extendOnly, true);
  assert.equal(compatibility.dashboardConsumer.integrationPath, "future APP-11 API facade");
  assert.equal(compatibility.workspaceConsumer.workspaceIsolationRequired, true);
});

test("consumes APP-11:7 certification", () => {
  const result = runExecutiveInboxPlatformFreeze(FIXED_TIME);
  assert.equal(result.certification.certified, true);
  assert.equal(result.certification.report.contractVersion, "APP-11/7");
  assert.equal(result.manifest?.consumedCertification, "APP-11/7");
});

test("rejects freeze when certification fails", () => {
  const blockedCertification = Object.freeze({
    certified: false,
    readyForFreeze: false,
    report: Object.freeze({
      certified: false,
      phase: "APP-11/7" as const,
      contractVersion: "APP-11/7" as const,
      platformVersion: "APP-11/7" as const,
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
        layersTotal: 6,
        summary: "failed",
        layerResults: Object.freeze([]),
        priorPhasesPreserved: false,
        readOnly: true as const,
      }),
      status: Object.freeze({
        certified: false,
        readyForFreeze: false,
        certificationTimestamp: null,
        contractVersion: "APP-11/7" as const,
        readOnly: true as const,
      }),
      timestamp: FIXED_TIME,
      readOnly: true as const,
    }),
    readOnly: true as const,
  }) satisfies ExecutiveInboxPlatformFreezeCertificationDependency;

  const validation = validateFreezeManifest(blockedCertification, null);
  assert.equal(validation.valid, false);
  assert.equal(validation.certificationDependencyPass, false);
  assert.ok(validation.issues.some((issue) => issue.code === "not_ready_for_freeze"));
});

test("runs official platform freeze with APP-11:7 certification dependency", () => {
  const result = runExecutiveInboxPlatformFreeze(FIXED_TIME);
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
  runExecutiveInboxPlatformFreeze(FIXED_TIME);
  const manifest = getExecutiveInboxPlatformFreezeManifest();
  assert.ok(manifest);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest?.metadataOnly, true);
  assert.equal(manifest?.releaseTag, EXECUTIVE_INBOX_PLATFORM_RELEASE_TAG);
  assert.equal(manifest?.consumedCertification, "APP-11/7");
  assert.equal(manifest?.releaseStatus.certified, true);
  assert.equal(manifest?.releaseStatus.frozen, true);
  assert.equal(manifest?.releaseStatus.released, true);
  assert.equal(manifest?.readyForRelease, true);
  assert.equal(manifest?.certifiedPhases.length, 8);
  assert.equal(manifest?.consumers.length, 4);

  const manifestValidation = validateExecutiveInboxFreezeManifest(manifest);
  assert.equal(manifestValidation.valid, true, manifestValidation.issues.join("; "));

  const registry = getExecutiveInboxPlatformRegistry();
  assert.equal(registry.frozen, true);
  assert.equal(registry.phaseCount, EXECUTIVE_INBOX_PLATFORM_FROZEN_PHASES.length);
  assert.equal(registry.publicApiCount, EXECUTIVE_INBOX_PLATFORM_FROZEN_PUBLIC_APIS.length);
  assert.equal(registry.consumerCount, 4);

  const validation = validateExecutiveInboxPlatformFreeze();
  assert.equal(validation.valid, true);
});

test("registers certified phases, public APIs, and extension policy", () => {
  const result = runExecutiveInboxPlatformFreeze(FIXED_TIME);
  const manifest = result.manifest;
  assert.ok(manifest);
  assert.equal(manifest?.certifiedPhases[0]?.phaseId, "APP-11/1");
  assert.equal(manifest?.certifiedPhases[7]?.phaseId, "APP-11/8");
  assert.ok(manifest?.publicApis.includes("generateExecutiveScheduleIntents"));
  assert.ok(manifest?.publicApis.includes("runExecutiveInboxPlatformFreeze"));
  assert.equal(manifest?.allowedFutureExtensions.length, EXECUTIVE_INBOX_PLATFORM_ALLOWED_FUTURE_EXTENSIONS.length);
  assert.equal(manifest?.forbiddenChanges.length, EXECUTIVE_INBOX_PLATFORM_FORBIDDEN_CHANGES.length);
  assert.equal(manifest?.extensionPolicy.facadeRequired, true);
  assert.equal(manifest?.extensionPolicy.layCompatibilityRequired, true);
  assert.ok(manifest?.forbiddenChanges.includes("adding_scheduling_execution_inside_frozen_core"));
  assert.ok(manifest?.allowedFutureExtensions.includes("lay_inbox_adapter_modules"));
});

test("freezeExecutiveInboxPlatform publishes release metadata", () => {
  const result = freezeExecutiveInboxPlatform(FIXED_TIME);
  assert.equal(result.certified, true);
  assert.equal(result.frozen, true);
  assert.equal(result.released, true);
  assert.equal(result.readyForRelease, true);
  assert.ok(result.manifest);
});

test("ExecutiveInboxPlatformFreeze namespace exposes public APIs", () => {
  assert.equal(typeof ExecutiveInboxPlatformFreeze.runExecutiveInboxPlatformFreeze, "function");
  assert.equal(typeof ExecutiveInboxPlatformFreeze.validateExecutiveInboxPlatformFreeze, "function");
  assert.equal(typeof ExecutiveInboxPlatformFreeze.freezeExecutiveInboxPlatform, "function");
  assert.equal(typeof ExecutiveInboxPlatformFreeze.getExecutiveInboxPlatformFreezeManifest, "function");
  assert.equal(typeof ExecutiveInboxPlatformFreeze.getExecutiveInboxCompatibility, "function");
  assert.equal(typeof ExecutiveInboxPlatformFreeze.getExecutiveInboxPlatformRegistry, "function");
});

test("buildExecutiveInboxPlatformFreezeManifest requires ready certification", () => {
  runExecutiveInboxPlatformFreeze(FIXED_TIME);
  const report = ExecutiveInboxPlatformFreeze.getExecutiveInboxPlatformFreezeReport();
  assert.ok(report?.manifest);
  const rebuilt = buildExecutiveInboxPlatformFreezeManifest(report!.certification, FIXED_TIME);
  assert.equal(rebuilt.readyForRelease, true);
  assert.equal(rebuilt.appId, "APP-11");
});
