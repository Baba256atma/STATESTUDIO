import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  ConfidenceEvolutionPlatformFreeze,
  buildConfidenceEvolutionPlatformFreezeManifest,
  CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_CONTRACT_VERSION,
  CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_SELF_MANIFEST,
  getConfidenceEvolutionCompatibility,
  getConfidenceEvolutionFreezeManifest,
  getConfidenceEvolutionPlatformRegistry,
  resetConfidenceEvolutionPlatformFreezeForTests,
  runConfidenceEvolutionPlatformFreeze,
  validateConfidenceEvolutionPlatformFreeze,
} from "./confidenceEvolutionPlatformFreeze.ts";
import {
  CONFIDENCE_EVOLUTION_PLATFORM_ALLOWED_FUTURE_EXTENSIONS,
  CONFIDENCE_EVOLUTION_PLATFORM_FORBIDDEN_CHANGES,
  CONFIDENCE_EVOLUTION_PLATFORM_FROZEN_PHASES,
  CONFIDENCE_EVOLUTION_PLATFORM_FROZEN_PUBLIC_APIS,
  CONFIDENCE_EVOLUTION_PLATFORM_RELEASE_TAG,
} from "./confidenceEvolutionPlatformFreezeRegistry.ts";
import { validateConfidenceEvolutionFreezeManifest } from "./confidenceEvolutionPlatformFreezeManifest.ts";
import { validateConfidenceEvolutionPlatformFreeze as validateFreezeManifest } from "./confidenceEvolutionPlatformFreezeValidation.ts";
import type { ConfidenceEvolutionPlatformCertificationResult } from "./confidenceEvolutionPlatformCertification.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetConfidenceEvolutionPlatformFreezeForTests();
});

test("exports APP-9/9 freeze contract metadata", () => {
  assert.equal(CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_CONTRACT_VERSION, "APP-9/9");
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/confidence-evolution/confidenceEvolutionPlatformFreeze.ts",
    allowedFiles: CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("publishes compatibility matrix", () => {
  const compatibility = getConfidenceEvolutionCompatibility();
  assert.equal(compatibility.backwardCompatibility.guaranteed, true);
  assert.equal(compatibility.app9Platform.compatible, true);
  assert.equal(compatibility.app6DecisionTimeline.directInternalCouplingForbidden, true);
  assert.equal(compatibility.app7BusinessTimeline.directInternalCouplingForbidden, true);
  assert.equal(compatibility.app8DecisionJournal.directInternalCouplingForbidden, true);
  assert.equal(compatibility.dashboardConsumer.integrationPath, "APP-9:7 facade");
  assert.equal(compatibility.workspaceConsumer.workspaceIsolationRequired, true);
});

test("consumes APP-9:8 certification", () => {
  const result = runConfidenceEvolutionPlatformFreeze(FIXED_TIME);
  assert.equal(result.certification.status, "PASS");
  assert.equal(result.certification.report.certificationVersion, "APP-9/8");
  assert.equal(result.manifest?.consumedCertification, "APP-9/8");
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
      platformIdentity: "APP-9",
      certificationVersion: "APP-9/8",
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
  }) satisfies ConfidenceEvolutionPlatformCertificationResult;

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
      platformIdentity: "APP-9",
      certificationVersion: "APP-9/8",
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
  }) satisfies ConfidenceEvolutionPlatformCertificationResult;

  const validation = validateFreezeManifest(notReadyCertification, null);
  assert.equal(validation.valid, false);
  assert.equal(validation.certificationDependencyPass, false);
});

test("runs official platform freeze with APP-9:8 certification dependency", () => {
  const result = runConfidenceEvolutionPlatformFreeze(FIXED_TIME);
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
  runConfidenceEvolutionPlatformFreeze(FIXED_TIME);
  const manifest = getConfidenceEvolutionFreezeManifest();
  assert.ok(manifest);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest?.metadataOnly, true);
  assert.equal(manifest?.releaseTag, CONFIDENCE_EVOLUTION_PLATFORM_RELEASE_TAG);
  assert.equal(manifest?.consumedCertification, "APP-9/8");
  assert.equal(manifest?.releaseStatus.certified, true);
  assert.equal(manifest?.releaseStatus.frozen, true);
  assert.equal(manifest?.releaseStatus.released, true);
  assert.equal(manifest?.readyForRelease, true);
  assert.equal(manifest?.certifiedPhases.length, 9);
  assert.equal(manifest?.consumers.length, 7);

  const manifestValidation = validateConfidenceEvolutionFreezeManifest(manifest);
  assert.equal(manifestValidation.valid, true, manifestValidation.issues.join("; "));

  const registry = getConfidenceEvolutionPlatformRegistry();
  assert.equal(registry.frozen, true);
  assert.equal(registry.phaseCount, CONFIDENCE_EVOLUTION_PLATFORM_FROZEN_PHASES.length);
  assert.equal(registry.publicApiCount, CONFIDENCE_EVOLUTION_PLATFORM_FROZEN_PUBLIC_APIS.length);
  assert.equal(registry.consumerCount, 7);

  const validation = validateConfidenceEvolutionPlatformFreeze();
  assert.equal(validation.valid, true);
});

test("registers certified phases, public APIs, and extension policy", () => {
  const result = runConfidenceEvolutionPlatformFreeze(FIXED_TIME);
  const manifest = result.manifest;
  assert.ok(manifest);
  assert.equal(manifest?.certifiedPhases[0]?.phaseId, "APP-9/1");
  assert.equal(manifest?.certifiedPhases[8]?.phaseId, "APP-9/9");
  assert.ok(manifest?.publicApis.includes("createConfidenceEvolutionApi"));
  assert.ok(manifest?.publicApis.includes("runConfidenceEvolutionPlatformFreeze"));
  assert.equal(manifest?.allowedFutureExtensions.length, CONFIDENCE_EVOLUTION_PLATFORM_ALLOWED_FUTURE_EXTENSIONS.length);
  assert.equal(manifest?.forbiddenChanges.length, CONFIDENCE_EVOLUTION_PLATFORM_FORBIDDEN_CHANGES.length);
  assert.equal(manifest?.extensionPolicy.facadeRequired, true);
  assert.ok(manifest?.forbiddenChanges.includes("bypassing_app9_7_api_facade"));
  assert.ok(manifest?.allowedFutureExtensions.includes("app6_app7_app8_link_adapters_facade_only"));
});

test("freeze modules contain no UI, dashboard, assistant, visualization, persistence, or prediction logic", () => {
  const result = runConfidenceEvolutionPlatformFreeze(FIXED_TIME);
  const forbiddenIds = [
    "no_ui",
    "no_dashboard",
    "no_assistant",
    "no_visualization",
    "no_persistence",
    "no_prediction_recommendation",
  ];
  for (const id of forbiddenIds) {
    const entry = result.checks.find((check) => check.id === id);
    assert.ok(entry, `missing check ${id}`);
    assert.equal(entry?.passed, true, entry?.evidence);
  }
  assert.equal(
    result.checks.find((entry) => entry.id === "S_no_app6_app7_app8_internal_coupling")?.passed,
    true
  );
});

test("ConfidenceEvolutionPlatformFreeze namespace exposes public APIs", () => {
  assert.equal(typeof ConfidenceEvolutionPlatformFreeze.runConfidenceEvolutionPlatformFreeze, "function");
  assert.equal(typeof ConfidenceEvolutionPlatformFreeze.validateConfidenceEvolutionPlatformFreeze, "function");
  assert.equal(typeof ConfidenceEvolutionPlatformFreeze.getConfidenceEvolutionFreezeManifest, "function");
  assert.equal(typeof ConfidenceEvolutionPlatformFreeze.getConfidenceEvolutionCompatibility, "function");
  assert.equal(typeof ConfidenceEvolutionPlatformFreeze.getConfidenceEvolutionPlatformRegistry, "function");
});

test("buildConfidenceEvolutionPlatformFreezeManifest requires ready certification", () => {
  runConfidenceEvolutionPlatformFreeze(FIXED_TIME);
  const report = ConfidenceEvolutionPlatformFreeze.getConfidenceEvolutionPlatformFreezeReport();
  assert.ok(report?.manifest);
  const rebuilt = buildConfidenceEvolutionPlatformFreezeManifest(report!.certification, FIXED_TIME);
  assert.equal(rebuilt.readyForRelease, true);
  assert.equal(rebuilt.appId, "APP-9");
});
