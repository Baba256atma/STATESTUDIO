import assert from "node:assert/strict";
import test from "node:test";

import { resetExecutiveConflictEngineForTests } from "./executiveConflictEngine.ts";
import { resetExecutiveEventRegistryForTests } from "./executiveEventRegistry.ts";
import { resetExecutiveTimeCameraForTests } from "./executiveTimeCameraEngine.ts";
import { EXECUTIVE_TIME_FORBIDDEN_PATTERNS } from "./executiveTimeContract.ts";
import { resetExecutiveTimeContextStoreForTests } from "./executiveTimeContextStore.ts";
import {
  getConsumer,
  listConsumers,
  registerConsumer,
  resetExecutiveTimeConsumerRegistryForTests,
} from "./executiveTimeConsumerRegistry.ts";
import {
  EXECUTIVE_TIME_INTEGRATION_FUTURE_BINDINGS,
  getConsumerCapabilities,
  getPlatformCapabilities,
} from "./executiveTimeIntegration.ts";
import {
  EXECUTIVE_TIME_INTEGRATION_MANIFEST,
  EXECUTIVE_TIME_INTEGRATION_TAGS,
  runExecutiveTimeIntegrationCertification,
} from "./executiveTimeIntegrationCertification.ts";
import {
  rejectDirectEngineAccess,
  resolveCompatibility,
  resolveConsumerRequest,
  resolvePlatformService,
  resolveSupportedFeatures,
  validateApiAccess,
  validateConsumer,
  validateConsumerCapabilities,
  validatePlatformCompatibility,
} from "./executiveTimeIntegrationResolver.ts";
import { ExecutiveTimePlatformGateway } from "./executiveTimePlatformGateway.ts";
import { runExecutiveTimePlatformCertification } from "./executiveTimePlatformCertification.ts";
import { resetExecutiveTimeRegistryForTests } from "./executiveTimeRegistry.ts";
import { resetExecutiveTimeEntityStateStoreForTests } from "./executiveTimeStateMutation.ts";
import { resetExecutiveTimeStateRegistryForTests } from "./executiveTimeStateRegistry.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

const workspaceId = "ws-integration-test";

function resetEnvironment(): void {
  resetExecutiveTimeRegistryForTests();
  resetExecutiveTimeContextStoreForTests();
  resetExecutiveTimeCameraForTests();
  resetExecutiveTimeStateRegistryForTests();
  resetExecutiveTimeEntityStateStoreForTests();
  resetExecutiveEventRegistryForTests();
  resetExecutiveConflictEngineForTests();
  resetExecutiveTimeConsumerRegistryForTests();
}

test.beforeEach(resetEnvironment);

test("registers default platform consumers", () => {
  const consumers = listConsumers();
  assert.ok(consumers.length >= 11);
  assert.ok(getConsumer("dashboard") !== null);
  assert.ok(getConsumer("assistant") !== null);
  assert.ok(getConsumer("timeline") !== null);
  assert.equal(getConsumer("dashboard")?.platformVersion, "APP-1/8.5");
});

test("registers custom consumer metadata", () => {
  const custom = registerConsumer(
    Object.freeze({
      id: "custom",
      version: "0.1.0",
      capabilities: Object.freeze(["context"] as const),
      accessLevel: "read",
      platformVersion: "APP-1/8.5",
      minimumPlatformVersion: "APP-1/8.5",
      metadata: Object.freeze({ label: "Custom integration probe" }),
    })
  );
  assert.equal(custom.id, "custom");
  assert.equal(Object.isFrozen(custom.capabilities), true);
});

test("routes gateway requests for app consumer", () => {
  const context = Object.freeze({ consumerId: "app" as const });
  const switched = ExecutiveTimePlatformGateway.switchContext(context, {
    workspaceId,
    contextId: "this_quarter",
  });
  assert.equal(switched.success, true);
  const current = ExecutiveTimePlatformGateway.getCurrentContext(context, { workspaceId });
  assert.equal(current.success, true);
  assert.equal(current.data?.id, "this_quarter");
});

test("rejects unsupported consumer capabilities", () => {
  const access = validateApiAccess({
    consumerId: "dashboard",
    operation: "generatePrediction",
  });
  assert.equal(access.permitted, false);
  assert.equal(access.directEngineAccessRejected, false);

  const gateway = ExecutiveTimePlatformGateway.generatePrediction(
    { consumerId: "dashboard" },
    Object.freeze({
      id: "pred-reject-001",
      predictionType: "conflict_detection",
      entityType: "decision",
      entityId: "decision-001",
      workspaceId,
      requestedBy: "executive",
      predictionContext: "Should reject",
      predictionScope: "entity",
      currentTimeContext: "this_week",
      currentCameraContext: "this_week",
      metadata: Object.freeze({}),
    })
  );
  assert.equal(gateway.success, false);
});

test("rejects direct engine import paths", () => {
  const rejected = rejectDirectEngineAccess("frontend/app/lib/executive-time/executivePredictionEngine.ts");
  assert.equal(rejected.directEngineAccessRejected, true);
  assert.equal(rejected.permitted, false);

  const allowed = rejectDirectEngineAccess("frontend/app/lib/executive-time/executiveTimePlatformApi.ts");
  assert.equal(allowed.permitted, true);
});

test("discovers platform and consumer capabilities", () => {
  assert.equal(getPlatformCapabilities().length, 7);
  assert.ok(getConsumerCapabilities("scenario").includes("transition"));
  const features = resolveSupportedFeatures("timeline");
  assert.ok(features.includes("getCurrentContext"));
  assert.ok(features.includes("resolveEvent"));
});

test("validates compatibility metadata", () => {
  const validation = validatePlatformCompatibility({
    consumerId: "assistant",
    consumerVersion: getConsumer("assistant")!.version,
  });
  assert.equal(validation.compatible, true);
  const resolved = resolveCompatibility("assistant");
  assert.equal(resolved.compatibilityStatus, "compatible");
  assert.ok(resolved.futureFeatures.length > 0);
});

test("resolves consumer requests and platform services", () => {
  const request = resolveConsumerRequest({
    consumerId: "timeline",
    operation: "resolveEvent",
  });
  assert.equal(request.accepted, true);
  const service = resolvePlatformService("int");
  assert.equal(service.available, true);
  assert.ok(service.capabilities.includes("prediction"));
});

test("validates consumer capability requirements", () => {
  const valid = validateConsumerCapabilities({
    consumerId: "recommendation",
    requiredCapabilities: Object.freeze(["prediction"]),
  });
  assert.equal(valid.valid, true);
  const invalid = validateConsumerCapabilities({
    consumerId: "audit",
    requiredCapabilities: Object.freeze(["camera"]),
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.missingCapabilities.includes("camera"));
});

test("future bindings require platform gateway", () => {
  assert.equal(EXECUTIVE_TIME_INTEGRATION_FUTURE_BINDINGS.dashboard.mustUsePlatformGateway, true);
  assert.equal(EXECUTIVE_TIME_INTEGRATION_FUTURE_BINDINGS.scenario.runtimeBehaviorChanged, false);
  assert.equal(validateConsumer({ consumerId: "lay" }).valid, true);
});

test("manifest blocks UI paths", () => {
  assert.equal(validateStageManifest(EXECUTIVE_TIME_INTEGRATION_MANIFEST).valid, true);
  assert.equal(
    evaluateStageFileBoundary({
      filePath: "frontend/app/components/assistant/ExecutiveAssistantPanel.tsx",
      allowedFiles: EXECUTIVE_TIME_INTEGRATION_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed,
    false
  );
});

test("APP-1:8.5 platform still certifies", () => {
  assert.equal(runExecutiveTimePlatformCertification().certified, true);
});

test("APP-1:9 integration certification passes all gates", () => {
  const result = runExecutiveTimeIntegrationCertification();
  assert.equal(result.certified, true);
  assert.deepEqual([...result.tags], [...EXECUTIVE_TIME_INTEGRATION_TAGS]);
  assert.equal(result.failedChecks.length, 0);
});
