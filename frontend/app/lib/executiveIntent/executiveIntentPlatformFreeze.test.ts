import assert from "node:assert/strict";
import test from "node:test";

import { EXECUTIVE_INTENT_ASSISTANT_INTEGRATION_RULES } from "./executiveIntentAssistantIntegration.ts";
import { EXECUTIVE_INTENT_DASHBOARD_INTEGRATION_RULES } from "./executiveIntentDashboardIntegration.ts";
import {
  buildExecutiveIntentPlatformFreezeManifest,
  EXECUTIVE_INTENT_PLATFORM_COMPATIBILITY_MANIFEST,
  EXECUTIVE_INTENT_PLATFORM_FORBIDDEN_CONSUMER_IMPORTS,
  EXECUTIVE_INTENT_PLATFORM_FREEZE_RULES,
  EXECUTIVE_INTENT_PLATFORM_FREEZE_VERSION,
  EXECUTIVE_INTENT_PLATFORM_FROZEN_PUBLIC_SURFACE,
  EXECUTIVE_INTENT_PLATFORM_RELEASE_TAGS,
  EXECUTIVE_INTENT_PLATFORM_STATUS,
} from "./executiveIntentPlatformFreezeManifest.ts";
import {
  runExecutiveIntentPlatformFinalCertification,
  EXECUTIVE_INTENT_PLATFORM_FINAL_TAGS,
} from "./executiveIntentPlatformFinalCertification.ts";
import { runExecutiveIntentPlatformFreezeRegression } from "./executiveIntentPlatformFreezeRegression.ts";
import {
  ExecutiveIntentPlatformRunner,
  getExecutiveIntentPlatformManifest,
  runExecutiveIntentPlatform,
  runExecutiveIntentPlatformCertification,
  runExecutiveIntentPlatformRegression,
} from "./executiveIntentPlatformRunner.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test("builds immutable freeze manifest", () => {
  const manifest = buildExecutiveIntentPlatformFreezeManifest(FIXED_TIME);

  assert.equal(manifest.freezeVersion, "APP-3/15");
  assert.equal(manifest.platformStatus, EXECUTIVE_INTENT_PLATFORM_STATUS);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(Object.isFrozen(manifest.frozenComponents), true);
  assert.ok(manifest.architectureHash.startsWith("arch-"));
  assert.ok(manifest.frozenPublicSurface.includes("ExecutiveIntentPlatformRunner"));
  assert.equal(manifest.frozenLayers.integration.length, 2);
  assert.equal(manifest.certificationVersion, "APP-3/14");
});

test("declares required release tags", () => {
  assert.ok(EXECUTIVE_INTENT_PLATFORM_RELEASE_TAGS.includes("[APP3_15]"));
  assert.ok(EXECUTIVE_INTENT_PLATFORM_RELEASE_TAGS.includes("[EXECUTIVE_INTENT_PLATFORM_FROZEN]"));
  assert.ok(EXECUTIVE_INTENT_PLATFORM_RELEASE_TAGS.includes("[PLATFORM_FREEZE]"));
  assert.ok(EXECUTIVE_INTENT_PLATFORM_RELEASE_TAGS.includes("[IMMUTABLE_PLATFORM]"));
  assert.ok(EXECUTIVE_INTENT_PLATFORM_RELEASE_TAGS.includes("[PUBLIC_PLATFORM]"));
  assert.ok(EXECUTIVE_INTENT_PLATFORM_RELEASE_TAGS.includes("[ARCHITECTURE_FROZEN]"));
  assert.ok(EXECUTIVE_INTENT_PLATFORM_RELEASE_TAGS.includes("[CERTIFIED]"));
  assert.ok(EXECUTIVE_INTENT_PLATFORM_RELEASE_TAGS.includes("[RELEASE_READY]"));
});

test("runs complete APP-3:1 through APP-3:14 freeze regression", () => {
  const regression = runExecutiveIntentPlatformFreezeRegression(FIXED_TIME);

  assert.equal(regression.certified, true);
  assert.equal(regression.status, "PASS");
  assert.equal(regression.phaseCount, 14);
  assert.equal(regression.failedPhases.length, 0);
  assert.equal(regression.architectureDriftDetected, false);
  assert.equal(regression.apiDriftDetected, false);
  assert.equal(regression.consumerDriftDetected, false);
  assert.ok(regression.phases.some((phase) => phase.phaseId === "APP-3/14"));
  assert.ok(regression.phases.some((phase) => phase.phaseId === "APP-3/3" && phase.skipped));
});

test("declares compatibility manifest without implementation", () => {
  assert.equal(EXECUTIVE_INTENT_PLATFORM_COMPATIBILITY_MANIFEST.backwardCompatible.compatible, true);
  assert.equal(EXECUTIVE_INTENT_PLATFORM_COMPATIBILITY_MANIFEST.forwardCompatible.compatible, true);
  assert.equal(EXECUTIVE_INTENT_PLATFORM_COMPATIBILITY_MANIFEST.assistant.mustUseReasoningOrRunner, true);
  assert.equal(EXECUTIVE_INTENT_PLATFORM_COMPATIBILITY_MANIFEST.dashboard.mustUseReasoningOrRunner, true);
  assert.equal(EXECUTIVE_INTENT_PLATFORM_COMPATIBILITY_MANIFEST.executiveTime.runtimeBehaviorChanged, false);
});

test("lists forbidden consumer engine imports", () => {
  assert.ok(EXECUTIVE_INTENT_PLATFORM_FORBIDDEN_CONSUMER_IMPORTS.includes("extractExecutiveIntent"));
  assert.ok(EXECUTIVE_INTENT_PLATFORM_FORBIDDEN_CONSUMER_IMPORTS.includes("buildExecutiveIntentSemanticModel"));
  assert.ok(EXECUTIVE_INTENT_PLATFORM_FORBIDDEN_CONSUMER_IMPORTS.includes("ExecutiveIntentConflictEngine"));
});

test("validates frozen integration consumer rules", () => {
  assert.equal(EXECUTIVE_INTENT_ASSISTANT_INTEGRATION_RULES.reasoningConsumerOnly, true);
  assert.equal(EXECUTIVE_INTENT_DASHBOARD_INTEGRATION_RULES.reasoningConsumerOnly, true);
  assert.equal(EXECUTIVE_INTENT_PLATFORM_FREEZE_RULES.internalEnginesPrivate, true);
  assert.equal(EXECUTIVE_INTENT_PLATFORM_FREEZE_RULES.breakingChangesForbidden, true);
});

test("platform runner exposes official entry point", () => {
  assert.equal(ExecutiveIntentPlatformRunner.version, EXECUTIVE_INTENT_PLATFORM_FREEZE_VERSION);
  assert.equal(typeof ExecutiveIntentPlatformRunner.runExecutiveIntentPlatform, "function");
  assert.equal(typeof ExecutiveIntentPlatformRunner.runExecutiveIntentPlatformCertification, "function");
  assert.equal(typeof ExecutiveIntentPlatformRunner.runExecutiveIntentPlatformRegression, "function");
  assert.equal(typeof ExecutiveIntentPlatformRunner.getExecutiveIntentPlatformManifest, "function");
  assert.equal(ExecutiveIntentPlatformRunner.platformStatus, "FROZEN");
});

test("getExecutiveIntentPlatformManifest returns frozen manifest", () => {
  const manifest = getExecutiveIntentPlatformManifest(FIXED_TIME);
  assert.equal(manifest.platformStatus, "FROZEN");
  assert.deepEqual([...manifest.frozenPublicSurface], [...EXECUTIVE_INTENT_PLATFORM_FROZEN_PUBLIC_SURFACE]);
});

test("runExecutiveIntentPlatform returns freeze certification result", () => {
  const result = runExecutiveIntentPlatform(FIXED_TIME);

  assert.equal(result.certified, true);
  assert.equal(result.released, true);
  assert.equal(result.status, "PASS");
  assert.equal(result.regressionStatus, "PASS");
  assert.equal(result.freezeManifest.platformStatus, "FROZEN");
  assert.equal(Object.isFrozen(result), true);
});

test("runExecutiveIntentPlatformCertification delegates to APP-3:14", () => {
  const result = runExecutiveIntentPlatformCertification(FIXED_TIME);
  assert.equal(result.passed, true);
  assert.equal(result.gates.length, 26);
});

test("runExecutiveIntentPlatformRegression delegates to freeze regression", () => {
  const result = runExecutiveIntentPlatformRegression(FIXED_TIME);
  assert.equal(result.certified, true);
  assert.equal(result.phaseCount, 14);
});

test("APP-3:15 final certification passes all gates A-Z", () => {
  const result = runExecutiveIntentPlatformFinalCertification(FIXED_TIME);

  assert.equal(result.certified, true);
  assert.equal(result.released, true);
  assert.deepEqual([...result.tags], [...EXECUTIVE_INTENT_PLATFORM_FINAL_TAGS]);
  assert.equal(result.failedChecks.length, 0);
  assert.equal(result.checks.length, 26);
  assert.equal(result.regression.certified, true);
  assert.equal(result.platformCertification.passed, true);
  assert.equal(result.publicApiValidation.reasoningConsumerOnly, true);
  assert.equal(EXECUTIVE_INTENT_PLATFORM_FREEZE_RULES.noNewIntelligence, true);
});

test("final certification result is read-only and frozen", () => {
  const result = runExecutiveIntentPlatformFinalCertification(FIXED_TIME);
  assert.equal(result.readOnly, true);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.checks), true);
  assert.equal(Object.isFrozen(result.freezeManifest), true);
});

test("platform runner public surface includes four official exports", () => {
  const surface = ExecutiveIntentPlatformRunner.publicSurface;
  assert.equal(typeof surface.ExecutiveIntentReasoning, "object");
  assert.equal(typeof surface.ExecutiveIntentAssistantIntegration, "object");
  assert.equal(typeof surface.ExecutiveIntentDashboardIntegration, "object");
  assert.equal(EXECUTIVE_INTENT_PLATFORM_FROZEN_PUBLIC_SURFACE.length, 4);
});
