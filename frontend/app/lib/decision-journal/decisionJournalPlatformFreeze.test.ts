import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  DecisionJournalPlatformFreeze,
  buildDecisionJournalPlatformFreezeManifest,
  DECISION_JOURNAL_PLATFORM_FREEZE_CONTRACT_VERSION,
  DECISION_JOURNAL_PLATFORM_FREEZE_SELF_MANIFEST,
  getDecisionJournalCompatibility,
  getDecisionJournalFreezeManifest,
  getDecisionJournalPlatformRegistry,
  resetDecisionJournalPlatformFreezeForTests,
  runDecisionJournalPlatformFreeze,
  validateDecisionJournalPlatformFreeze,
} from "./decisionJournalPlatformFreeze.ts";
import {
  DECISION_JOURNAL_PLATFORM_ALLOWED_FUTURE_EXTENSIONS,
  DECISION_JOURNAL_PLATFORM_FORBIDDEN_CHANGES,
  DECISION_JOURNAL_PLATFORM_FROZEN_PHASES,
  DECISION_JOURNAL_PLATFORM_FROZEN_PUBLIC_APIS,
  DECISION_JOURNAL_PLATFORM_RELEASE_TAG,
} from "./decisionJournalPlatformFreezeRegistry.ts";
import { validateDecisionJournalFreezeManifest } from "./decisionJournalPlatformFreezeManifest.ts";
import { validateDecisionJournalPlatformFreeze as validateFreezeManifest } from "./decisionJournalPlatformFreezeValidation.ts";
import type { DecisionJournalPlatformCertificationResult } from "./decisionJournalPlatformCertification.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetDecisionJournalPlatformFreezeForTests();
});

test("exports APP-8/9 freeze contract metadata", () => {
  assert.equal(DECISION_JOURNAL_PLATFORM_FREEZE_CONTRACT_VERSION, "APP-8/9");
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(DECISION_JOURNAL_PLATFORM_FREEZE_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/decision-journal/decisionJournalPlatformFreeze.ts",
    allowedFiles: DECISION_JOURNAL_PLATFORM_FREEZE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: DECISION_JOURNAL_PLATFORM_FREEZE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("publishes compatibility matrix", () => {
  const compatibility = getDecisionJournalCompatibility();
  assert.equal(compatibility.backwardCompatibility.guaranteed, true);
  assert.equal(compatibility.app8Platform.compatible, true);
  assert.equal(compatibility.app6DecisionTimeline.directInternalCouplingForbidden, true);
  assert.equal(compatibility.app6DecisionTimeline.facadeOnlyLinkAdapterAllowed, true);
  assert.equal(compatibility.dashboardConsumer.integrationPath, "APP-8:7 facade");
  assert.equal(compatibility.workspaceConsumer.workspaceIsolationRequired, true);
});

test("consumes APP-8:8 certification", () => {
  const result = runDecisionJournalPlatformFreeze(FIXED_TIME);
  assert.equal(result.certification.status, "PASS");
  assert.equal(result.certification.report.certificationVersion, "APP-8/8");
  assert.equal(result.manifest?.consumedCertification, "APP-8/8");
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
      platformIdentity: "APP-8",
      certificationVersion: "APP-8/8",
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
  }) satisfies DecisionJournalPlatformCertificationResult;

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
      platformIdentity: "APP-8",
      certificationVersion: "APP-8/8",
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
  }) satisfies DecisionJournalPlatformCertificationResult;

  const validation = validateFreezeManifest(notReadyCertification, null);
  assert.equal(validation.valid, false);
  assert.equal(validation.certificationDependencyPass, false);
});

test("runs official platform freeze with APP-8:8 certification dependency", () => {
  const result = runDecisionJournalPlatformFreeze(FIXED_TIME);
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
  runDecisionJournalPlatformFreeze(FIXED_TIME);
  const manifest = getDecisionJournalFreezeManifest();
  assert.ok(manifest);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest?.metadataOnly, true);
  assert.equal(manifest?.releaseTag, DECISION_JOURNAL_PLATFORM_RELEASE_TAG);
  assert.equal(manifest?.consumedCertification, "APP-8/8");
  assert.equal(manifest?.releaseStatus.certified, true);
  assert.equal(manifest?.releaseStatus.frozen, true);
  assert.equal(manifest?.releaseStatus.released, true);
  assert.equal(manifest?.readyForRelease, true);
  assert.equal(manifest?.certifiedPhases.length, 9);
  assert.equal(manifest?.consumers.length, 7);

  const manifestValidation = validateDecisionJournalFreezeManifest(manifest);
  assert.equal(manifestValidation.valid, true, manifestValidation.issues.join("; "));

  const registry = getDecisionJournalPlatformRegistry();
  assert.equal(registry.frozen, true);
  assert.equal(registry.phaseCount, DECISION_JOURNAL_PLATFORM_FROZEN_PHASES.length);
  assert.equal(registry.publicApiCount, DECISION_JOURNAL_PLATFORM_FROZEN_PUBLIC_APIS.length);
  assert.equal(registry.consumerCount, 7);

  const validation = validateDecisionJournalPlatformFreeze();
  assert.equal(validation.valid, true);
});

test("registers certified phases, public APIs, and extension policy", () => {
  const result = runDecisionJournalPlatformFreeze(FIXED_TIME);
  const manifest = result.manifest;
  assert.ok(manifest);
  assert.equal(manifest?.certifiedPhases[0]?.phaseId, "APP-8/1");
  assert.equal(manifest?.certifiedPhases[8]?.phaseId, "APP-8/9");
  assert.ok(manifest?.publicApis.includes("createDecisionJournalApi"));
  assert.ok(manifest?.publicApis.includes("runDecisionJournalPlatformFreeze"));
  assert.equal(manifest?.allowedFutureExtensions.length, DECISION_JOURNAL_PLATFORM_ALLOWED_FUTURE_EXTENSIONS.length);
  assert.equal(manifest?.forbiddenChanges.length, DECISION_JOURNAL_PLATFORM_FORBIDDEN_CHANGES.length);
  assert.equal(manifest?.extensionPolicy.facadeRequired, true);
  assert.ok(manifest?.forbiddenChanges.includes("bypassing_app8_7_api_facade"));
  assert.ok(manifest?.allowedFutureExtensions.includes("app6_link_adapter_facade_only"));
});

test("DecisionJournalPlatformFreeze namespace exposes public APIs", () => {
  assert.equal(typeof DecisionJournalPlatformFreeze.runDecisionJournalPlatformFreeze, "function");
  assert.equal(typeof DecisionJournalPlatformFreeze.validateDecisionJournalPlatformFreeze, "function");
  assert.equal(typeof DecisionJournalPlatformFreeze.getDecisionJournalFreezeManifest, "function");
  assert.equal(typeof DecisionJournalPlatformFreeze.getDecisionJournalCompatibility, "function");
  assert.equal(typeof DecisionJournalPlatformFreeze.getDecisionJournalPlatformRegistry, "function");
});

test("buildDecisionJournalPlatformFreezeManifest requires ready certification", () => {
  runDecisionJournalPlatformFreeze(FIXED_TIME);
  const report = DecisionJournalPlatformFreeze.getDecisionJournalPlatformFreezeReport();
  assert.ok(report?.manifest);
  const rebuilt = buildDecisionJournalPlatformFreezeManifest(report!.certification, FIXED_TIME);
  assert.equal(rebuilt.readyForRelease, true);
  assert.equal(rebuilt.appId, "APP-8");
});
