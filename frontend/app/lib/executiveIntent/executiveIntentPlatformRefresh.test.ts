import assert from "node:assert/strict";
import test from "node:test";

import { EXECUTIVE_INTENT_CONTEXT_ENGINE_VERSION } from "./executiveIntentContextTypes.ts";
import {
  buildExecutiveIntentPlatformRefreshManifest,
  EXECUTIVE_INTENT_PLATFORM_EXTENSION_REGISTRY,
  EXECUTIVE_INTENT_PLATFORM_REFRESH_COMPATIBILITY_MATRIX,
  EXECUTIVE_INTENT_PLATFORM_REFRESH_CONSUMER_RULES,
  EXECUTIVE_INTENT_PLATFORM_REFRESH_TAGS,
  EXECUTIVE_INTENT_PLATFORM_REFRESH_VERSION,
  EXECUTIVE_INTENT_PLATFORM_RUNNER_REFRESH_METADATA,
  EXECUTIVE_INTENT_PLATFORM_REFRESH_STATUS,
} from "./executiveIntentPlatformRefreshManifest.ts";
import {
  runExecutiveIntentPlatformRefreshCertification,
} from "./executiveIntentPlatformRefreshCertification.ts";
import {
  ExecutiveIntentPlatformRefresh,
  buildPlatformRefreshSummary,
  getExecutiveIntentPlatformRefreshManifest,
  runExecutiveIntentPlatformRefresh,
  runExecutiveIntentPlatformRefreshRegression,
} from "./executiveIntentPlatformRefresh.ts";
import { runExecutiveIntentPlatform } from "./executiveIntentPlatformRunner.ts";
import { ExecutiveIntentPlatformRunner } from "./executiveIntentPlatformRunner.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test("builds immutable refresh manifest with context extension", () => {
  const manifest = buildExecutiveIntentPlatformRefreshManifest(FIXED_TIME);

  assert.equal(manifest.refreshVersion, "APP-3.15.1");
  assert.equal(manifest.refreshStatus, EXECUTIVE_INTENT_PLATFORM_REFRESH_STATUS);
  assert.equal(manifest.contextEngineVersion, EXECUTIVE_INTENT_CONTEXT_ENGINE_VERSION);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(Object.isFrozen(manifest.extensionRegistry), true);
  assert.ok(manifest.refreshHash.startsWith("refresh-"));
  assert.equal(manifest.freezeManifest.platformStatus, "FROZEN");
});

test("declares required refresh release tags", () => {
  assert.ok(EXECUTIVE_INTENT_PLATFORM_REFRESH_TAGS.includes("[APP3_15_1]"));
  assert.ok(EXECUTIVE_INTENT_PLATFORM_REFRESH_TAGS.includes("[EXECUTIVE_INTENT_PLATFORM_REFRESH]"));
  assert.ok(EXECUTIVE_INTENT_PLATFORM_REFRESH_TAGS.includes("[PLATFORM_REFRESH]"));
  assert.ok(EXECUTIVE_INTENT_PLATFORM_REFRESH_TAGS.includes("[MAINTENANCE_CERTIFIED]"));
  assert.ok(EXECUTIVE_INTENT_PLATFORM_REFRESH_TAGS.includes("[CONTEXT_EXTENSION_REGISTERED]"));
  assert.ok(EXECUTIVE_INTENT_PLATFORM_REFRESH_TAGS.includes("[ARCHITECTURE_REFRESHED]"));
  assert.ok(EXECUTIVE_INTENT_PLATFORM_REFRESH_TAGS.includes("[BACKWARD_COMPATIBLE]"));
  assert.ok(EXECUTIVE_INTENT_PLATFORM_REFRESH_TAGS.includes("[RELEASE_READY]"));
});

test("registers ExecutiveIntentContextEngine as optional extension", () => {
  const entry = EXECUTIVE_INTENT_PLATFORM_EXTENSION_REGISTRY.find(
    (item) => item.exportName === "ExecutiveIntentContextEngine"
  );
  assert.ok(entry);
  assert.equal(entry?.status, "optional_extension");
  assert.equal(entry?.certified, true);
  assert.equal(entry?.nonBreaking, true);
  assert.equal(entry?.readOnly, true);
  assert.equal(entry?.primaryIntelligence, false);
});

test("declares refresh compatibility matrix", () => {
  assert.equal(EXECUTIVE_INTENT_PLATFORM_REFRESH_COMPATIBILITY_MATRIX.app315Freeze.compatible, true);
  assert.equal(EXECUTIVE_INTENT_PLATFORM_REFRESH_COMPATIBILITY_MATRIX.app331ContextEngine.compatible, true);
  assert.equal(EXECUTIVE_INTENT_PLATFORM_REFRESH_COMPATIBILITY_MATRIX.assistant.compatible, true);
  assert.equal(EXECUTIVE_INTENT_PLATFORM_REFRESH_COMPATIBILITY_MATRIX.dashboard.compatible, true);
  assert.equal(EXECUTIVE_INTENT_PLATFORM_REFRESH_COMPATIBILITY_MATRIX.executiveTime.compatible, true);
  assert.equal(EXECUTIVE_INTENT_PLATFORM_REFRESH_COMPATIBILITY_MATRIX.scenarioIntelligence.compatible, true);
  assert.equal(EXECUTIVE_INTENT_PLATFORM_REFRESH_COMPATIBILITY_MATRIX.executiveMemory.compatible, true);
  assert.equal(EXECUTIVE_INTENT_PLATFORM_REFRESH_COMPATIBILITY_MATRIX.governance.compatible, true);
  assert.equal(EXECUTIVE_INTENT_PLATFORM_REFRESH_COMPATIBILITY_MATRIX.layArchitecture.compatible, true);
});

test("declares refresh consumer rules with reasoning primary", () => {
  assert.equal(
    EXECUTIVE_INTENT_PLATFORM_REFRESH_CONSUMER_RULES.primaryIntelligenceInterface,
    "ExecutiveIntentReasoning"
  );
  assert.ok(
    EXECUTIVE_INTENT_PLATFORM_REFRESH_CONSUMER_RULES.optionalExtensions.includes(
      "ExecutiveIntentContextEngine"
    )
  );
  assert.ok(
    EXECUTIVE_INTENT_PLATFORM_REFRESH_CONSUMER_RULES.permittedConsumers.includes(
      "ExecutiveIntentPlatformRunner"
    )
  );
});

test("extends platform runner metadata without runtime changes", () => {
  assert.equal(EXECUTIVE_INTENT_PLATFORM_RUNNER_REFRESH_METADATA.runtimeBehaviorChanged, false);
  assert.equal(EXECUTIVE_INTENT_PLATFORM_RUNNER_REFRESH_METADATA.runnerVersion, "APP-3/15");
  assert.equal(EXECUTIVE_INTENT_PLATFORM_RUNNER_REFRESH_METADATA.refreshVersion, "APP-3.15.1");
  assert.ok(
    EXECUTIVE_INTENT_PLATFORM_RUNNER_REFRESH_METADATA.registeredExtensions.includes(
      "ExecutiveIntentContextEngine"
    )
  );
  assert.equal(ExecutiveIntentPlatformRunner.version, "APP-3/15");
});

test("runs refresh regression across APP-3:1 through APP-3.15.1", () => {
  const regression = runExecutiveIntentPlatformRefreshRegression(FIXED_TIME);

  assert.equal(regression.certified, true);
  assert.equal(regression.status, "PASS");
  assert.equal(regression.failedPhases.length, 0);
  assert.equal(regression.architectureDriftDetected, false);
  assert.equal(regression.apiDriftDetected, false);
  assert.equal(regression.certificationDriftDetected, false);
  assert.ok(regression.phases.some((phase) => phase.phaseId === "APP-3/15"));
  assert.ok(regression.phases.some((phase) => phase.phaseId === "APP-3.3.1"));
  assert.ok(regression.phases.some((phase) => phase.phaseId === "APP-3.15.1"));
});

test("runExecutiveIntentPlatformRefreshCertification passes all gates A-Z", () => {
  const result = runExecutiveIntentPlatformRefreshCertification(FIXED_TIME);

  assert.equal(result.certified, true);
  assert.equal(result.released, true);
  assert.equal(result.failedChecks.length, 0);
  assert.equal(result.checks.length, 26);
  assert.equal(result.regression.certified, true);
  assert.equal(result.platformFreeze.certified, true);
  assert.equal(result.readOnly, true);
});

test("runExecutiveIntentPlatformRefresh returns certified refresh result", () => {
  const result = runExecutiveIntentPlatformRefresh(FIXED_TIME);

  assert.equal(result.certified, true);
  assert.equal(result.released, true);
  assert.equal(result.status, "PASS");
  assert.equal(result.summary.passed, true);
  assert.equal(result.summary.platformFreezePreserved, true);
  assert.equal(result.summary.contextExtensionRegistered, true);
  assert.equal(Object.isFrozen(result), true);
});

test("buildPlatformRefreshSummary reflects certification outcomes", () => {
  const certification = runExecutiveIntentPlatformRefreshCertification(FIXED_TIME);
  const summary = buildPlatformRefreshSummary({ certification, timestamp: FIXED_TIME });

  assert.equal(summary.passed, true);
  assert.equal(summary.totalChecks, 26);
  assert.equal(summary.regressionPassed, true);
  assert.equal(summary.readOnly, true);
});

test("getExecutiveIntentPlatformRefreshManifest returns refresh manifest", () => {
  const manifest = getExecutiveIntentPlatformRefreshManifest(FIXED_TIME);
  assert.equal(manifest.refreshVersion, EXECUTIVE_INTENT_PLATFORM_REFRESH_VERSION);
  assert.equal(manifest.compatibilityVersion, "APP-3.15.1-compat");
});

test("ExecutiveIntentPlatformRefresh exposes public refresh APIs", () => {
  assert.equal(typeof ExecutiveIntentPlatformRefresh.runExecutiveIntentPlatformRefresh, "function");
  assert.equal(typeof ExecutiveIntentPlatformRefresh.runExecutiveIntentPlatformRefreshCertification, "function");
  assert.equal(typeof ExecutiveIntentPlatformRefresh.runExecutiveIntentPlatformRefreshRegression, "function");
  assert.equal(typeof ExecutiveIntentPlatformRefresh.buildPlatformRefreshSummary, "function");
  assert.equal(typeof ExecutiveIntentPlatformRefresh.getExecutiveIntentPlatformRefreshManifest, "function");
  assert.equal(ExecutiveIntentPlatformRefresh.version, "APP-3.15.1");
});

test("APP-3:15 platform freeze remains certified after refresh", () => {
  const platform = runExecutiveIntentPlatform(FIXED_TIME);
  assert.equal(platform.certified, true);
  assert.equal(platform.platformStatus, "FROZEN");
});

test("refresh result preserves frozen public API surface", () => {
  const manifest = getExecutiveIntentPlatformRefreshManifest(FIXED_TIME);
  assert.ok(manifest.runnerMetadata.frozenPublicApis.includes("runExecutiveIntentPlatform"));
  assert.ok(manifest.runnerMetadata.publicSurface.includes("ExecutiveIntentPlatformRunner"));
  assert.ok(manifest.runnerMetadata.publicSurface.includes("ExecutiveIntentContextEngine"));
});

test("refresh certification result is frozen and read-only", () => {
  const result = runExecutiveIntentPlatformRefreshCertification(FIXED_TIME);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.checks), true);
  assert.equal(Object.isFrozen(result.refreshManifest), true);
});
