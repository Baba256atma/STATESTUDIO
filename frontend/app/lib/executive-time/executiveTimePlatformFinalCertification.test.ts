import assert from "node:assert/strict";
import test from "node:test";

import { EXECUTIVE_TIME_FORBIDDEN_PATTERNS } from "./executiveTimeContract.ts";
import { listConsumerIds } from "./executiveTimeConsumerRegistry.ts";
import { EXECUTIVE_TIME_INTEGRATION_FUTURE_BINDINGS } from "./executiveTimeIntegration.ts";
import { rejectDirectEngineAccess } from "./executiveTimeIntegrationResolver.ts";
import {
  buildExecutiveTimePlatformFreezeManifest,
  EXECUTIVE_TIME_PLATFORM_FREEZE_VERSION,
  EXECUTIVE_TIME_PLATFORM_STATUS,
} from "./executiveTimePlatformFreezeManifest.ts";
import {
  EXECUTIVE_TIME_PLATFORM_FINAL_TAGS,
  runExecutiveTimePlatformFinalCertification,
} from "./executiveTimePlatformFinalCertification.ts";
import {
  runExecutiveTimePlatformCertificationSuite,
  runExecutiveTimePlatformRegressionOnly,
} from "./executiveTimePlatformCertificationRunner.ts";
import { runExecutiveTimePlatformRegression } from "./executiveTimePlatformRegression.ts";
import {
  EXECUTIVE_TIME_PLATFORM_CONSUMER_CONTRACT,
  EXECUTIVE_TIME_PLATFORM_FORBIDDEN_ENGINE_IMPORTS,
} from "./executiveTimePlatformApi.ts";
import { evaluateStageFileBoundary } from "../stage/stageArchitectureGuards.ts";

test("builds immutable freeze manifest", () => {
  const manifest = buildExecutiveTimePlatformFreezeManifest(new Date().toISOString());
  assert.equal(manifest.freezeVersion, "APP-1/10");
  assert.equal(manifest.platformStatus, EXECUTIVE_TIME_PLATFORM_STATUS);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(Object.isFrozen(manifest.frozenEngines), true);
  assert.ok(manifest.architectureHash.startsWith("arch-"));
  assert.ok(manifest.frozenPublicApis.includes("ExecutiveTimePlatform"));
  assert.ok(manifest.supportedConsumers.length >= 11);
});

test("runs complete APP-1:1 through APP-1:9 regression", () => {
  const regression = runExecutiveTimePlatformRegression();
  assert.equal(regression.certified, true);
  assert.equal(regression.phases.length, 14);
  assert.equal(regression.failedPhases.length, 0);
  assert.equal(regression.architectureDriftDetected, false);
});

test("runs regression-only helper", () => {
  const regression = runExecutiveTimePlatformRegressionOnly();
  assert.equal(regression.status, "PASS");
});

test("rejects direct engine access paths", () => {
  for (const fragment of EXECUTIVE_TIME_PLATFORM_FORBIDDEN_ENGINE_IMPORTS) {
    const result = rejectDirectEngineAccess(`frontend/app/lib/executive-time/${fragment}.ts`);
    assert.equal(result.directEngineAccessRejected, true, fragment);
  }
});

test("validates consumer compatibility bindings", () => {
  const consumers = [
    "dashboard",
    "assistant",
    "timeline",
    "executive_memory",
    "recommendation",
    "scenario",
    "audit",
    "ds",
    "int",
    "app",
    "lay",
  ] as const;
  for (const consumerId of consumers) {
    assert.ok(listConsumerIds().includes(consumerId), consumerId);
    const bindingKey =
      consumerId === "executive_memory"
        ? "executiveMemory"
        : (consumerId as keyof typeof EXECUTIVE_TIME_INTEGRATION_FUTURE_BINDINGS);
    assert.equal(EXECUTIVE_TIME_INTEGRATION_FUTURE_BINDINGS[bindingKey].mustUsePlatformGateway, true);
  }
});

test("verifies public API consumer contract", () => {
  assert.equal(EXECUTIVE_TIME_PLATFORM_CONSUMER_CONTRACT.mustUsePlatformApi, true);
  assert.equal(EXECUTIVE_TIME_PLATFORM_CONSUMER_CONTRACT.permittedEntryPoint, "ExecutiveTimePlatform");
  assert.equal(EXECUTIVE_TIME_PLATFORM_CONSUMER_CONTRACT.directEngineAccessPermitted, false);
});

test("certification suite returns freeze manifest", () => {
  const suite = runExecutiveTimePlatformCertificationSuite();
  assert.equal(suite.freezeVersion, EXECUTIVE_TIME_PLATFORM_FREEZE_VERSION);
  assert.equal(suite.freezeManifest.platformStatus, "FROZEN");
  assert.equal(suite.regressionStatus, "PASS");
});

test("blocks UI mutation paths", () => {
  assert.equal(
    evaluateStageFileBoundary({
      filePath: "frontend/app/components/assistant/ExecutiveAssistantPanel.tsx",
      allowedFiles: Object.freeze(["frontend/app/lib/executive-time/executiveTimePlatformFinalCertification.ts"]),
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed,
    false
  );
});

test("APP-1:10 final certification passes all gates", () => {
  const result = runExecutiveTimePlatformFinalCertification();
  assert.equal(result.certified, true);
  assert.equal(result.released, true);
  assert.deepEqual([...result.tags], [...EXECUTIVE_TIME_PLATFORM_FINAL_TAGS]);
  assert.equal(result.failedChecks.length, 0);
  assert.equal(result.regression.certified, true);
  assert.equal(result.publicApiValidation.directEngineAccessRejected, true);
  assert.equal(result.uiIsolationVerified, true);
});
