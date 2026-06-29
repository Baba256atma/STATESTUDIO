import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  DecisionTimelinePlatformFreeze,
  DECISION_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION,
  DECISION_TIMELINE_PLATFORM_FREEZE_SELF_MANIFEST,
  getDecisionTimelineCompatibility,
  getDecisionTimelineFreezeManifest,
  getDecisionTimelinePlatformRegistry,
  resetDecisionTimelinePlatformFreezeForTests,
  runDecisionTimelinePlatformFreeze,
  validateDecisionTimelinePlatformFreeze,
} from "./decisionTimelinePlatformFreeze.ts";
import { DECISION_TIMELINE_PLATFORM_RELEASE_TAG } from "./decisionTimelinePlatformFreezeRegistry.ts";
import { validateDecisionTimelinePlatformFreeze as validateFreezeManifest } from "./decisionTimelinePlatformFreezeValidation.ts";
import type { DecisionTimelinePlatformCertificationResult } from "./decisionTimelinePlatformCertification.ts";

test.beforeEach(() => {
  resetDecisionTimelinePlatformFreezeForTests();
});

test("exports APP-6/12 freeze contract metadata", () => {
  assert.equal(DECISION_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION, "APP-6/12");
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(DECISION_TIMELINE_PLATFORM_FREEZE_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/decision-timeline/decisionTimelinePlatformFreeze.ts",
    allowedFiles: DECISION_TIMELINE_PLATFORM_FREEZE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: DECISION_TIMELINE_PLATFORM_FREEZE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("publishes compatibility matrix", () => {
  const compatibility = getDecisionTimelineCompatibility();
  assert.equal(compatibility.backwardCompatibility.guaranteed, true);
  assert.equal(compatibility.app6Platform.compatible, true);
  assert.equal(compatibility.intPlatform.compatible, true);
  assert.equal(compatibility.dashboardPlatform.integrationLayer, "APP-6/9");
  assert.equal(compatibility.assistantPlatform.integrationLayer, "APP-6/10");
  assert.equal(compatibility.workspacePlatform.workspaceIsolationRequired, true);
});

test("rejects freeze when readyForFreeze is false", () => {
  const blockedCertification = Object.freeze({
    certified: false,
    readyForFreeze: false,
    certificationScore: 0,
    warnings: Object.freeze([]),
    failures: Object.freeze([Object.freeze({ code: "blocked", message: "blocked", readOnly: true as const })]),
    status: "FAIL" as const,
    summary: "blocked",
    report: Object.freeze({
      platformIdentity: "APP-6",
      certificationVersion: "APP-6/11",
      certificationTimestamp: "2026-01-01T00:00:00.000Z",
      certificationScore: 0,
      groups: Object.freeze([]),
      regressionSummary: "failed",
      layerRegressionResults: Object.freeze([]),
      certifiedModules: Object.freeze([]),
      warnings: Object.freeze([]),
      failures: Object.freeze([]),
      certified: false,
      readyForFreeze: false,
      finalPlatformStatus: "NOT_CERTIFIED" as const,
      readOnly: true as const,
    }),
    readOnly: true as const,
  }) satisfies DecisionTimelinePlatformCertificationResult;

  const validation = validateFreezeManifest(blockedCertification, null);
  assert.equal(validation.valid, false);
  assert.equal(validation.certificationDependencyPass, false);
  assert.ok(validation.issues.some((issue) => issue.code === "not_ready_for_freeze"));
});

test("runs official platform freeze with APP-6:11 certification dependency", () => {
  const result = runDecisionTimelinePlatformFreeze("2026-01-01T00:00:00.000Z");
  assert.equal(result.status, "PASS", result.summary);
  assert.equal(result.frozen, true);
  assert.equal(result.releaseReady, true);
  assert.equal(result.productionReady, true);
  assert.equal(result.certification.readyForFreeze, true);
  assert.equal(result.validation.certificationDependencyPass, true);
  assert.equal(result.validation.manifestPass, true);
  assert.equal(result.validation.registryPass, true);
  assert.equal(result.validation.compatibilityPass, true);
  assert.equal(result.validation.frozenPass, true);
  assert.ok(result.validation.checks.every((entry) => entry.passed));
});

test("publishes immutable freeze manifest and registry", () => {
  runDecisionTimelinePlatformFreeze("2026-01-01T00:00:00.000Z");
  const manifest = getDecisionTimelineFreezeManifest();
  assert.ok(manifest);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest?.frozen, true);
  assert.equal(manifest?.releaseTag, DECISION_TIMELINE_PLATFORM_RELEASE_TAG);
  assert.equal(manifest?.certificationReference, "APP-6/11");
  assert.equal(manifest?.platformStatus.frozen, "FROZEN");
  assert.ok((manifest?.certifiedModules.length ?? 0) >= 12);

  const registry = getDecisionTimelinePlatformRegistry();
  assert.equal(registry.frozen, true);
  assert.ok(registry.publicApiCount >= 20);

  const validation = validateDecisionTimelinePlatformFreeze();
  assert.equal(validation.valid, true);
});

test("DecisionTimelinePlatformFreeze namespace exposes public APIs", () => {
  assert.equal(typeof DecisionTimelinePlatformFreeze.runDecisionTimelinePlatformFreeze, "function");
  assert.equal(typeof DecisionTimelinePlatformFreeze.validateDecisionTimelinePlatformFreeze, "function");
  assert.equal(typeof DecisionTimelinePlatformFreeze.getDecisionTimelineFreezeManifest, "function");
  assert.equal(typeof DecisionTimelinePlatformFreeze.getDecisionTimelineCompatibility, "function");
  assert.equal(typeof DecisionTimelinePlatformFreeze.getDecisionTimelinePlatformRegistry, "function");
});
