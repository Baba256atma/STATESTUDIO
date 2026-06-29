import assert from "node:assert/strict";
import test from "node:test";

import { resetExecutiveConflictEngineForTests } from "./executiveConflictEngine.ts";
import { resetExecutiveEventRegistryForTests } from "./executiveEventRegistry.ts";
import { authorizeTransition } from "./executiveTimeTransitionAuthority.ts";
import { resetExecutiveTimeCameraForTests } from "./executiveTimeCameraEngine.ts";
import { EXECUTIVE_TIME_FORBIDDEN_PATTERNS } from "./executiveTimeContract.ts";
import { resetExecutiveTimeContextStoreForTests } from "./executiveTimeContextStore.ts";
import { resetExecutiveTimeRegistryForTests } from "./executiveTimeRegistry.ts";
import {
  EXECUTIVE_TIME_PLATFORM_CONSUMER_CONTRACT,
  EXECUTIVE_TIME_PLATFORM_FUTURE_INTEGRATIONS,
  ExecutiveTimePlatform,
  getApiCapabilities,
  getCapabilities,
  getCompatibilityVersion,
  getEngineVersions,
  getPlatformVersion,
  getPlatformVersionMetadata,
  validatePlatformConsumerAccess,
} from "./executiveTimePlatformApi.ts";
import {
  EXECUTIVE_TIME_PLATFORM_MANIFEST,
  EXECUTIVE_TIME_PLATFORM_TAGS,
  runExecutiveTimePlatformCertification,
} from "./executiveTimePlatformCertification.ts";
import { runExecutivePredictionCertification } from "./executivePredictionCertification.ts";
import { resetExecutiveTimeEntityStateStoreForTests } from "./executiveTimeStateMutation.ts";
import { resetExecutiveTimeStateRegistryForTests } from "./executiveTimeStateRegistry.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

const workspaceId = "ws-platform-test";

function resetEnvironment(): void {
  resetExecutiveTimeRegistryForTests();
  resetExecutiveTimeContextStoreForTests();
  resetExecutiveTimeCameraForTests();
  resetExecutiveTimeStateRegistryForTests();
  resetExecutiveTimeEntityStateStoreForTests();
  resetExecutiveEventRegistryForTests();
  resetExecutiveConflictEngineForTests();
}

test.beforeEach(resetEnvironment);

test("routes context through platform facade", () => {
  const switched = ExecutiveTimePlatform.switchContext({ workspaceId, contextId: "this_quarter" });
  assert.equal(switched.success, true);
  const context = ExecutiveTimePlatform.getCurrentContext({ workspaceId });
  assert.equal(context.id, "this_quarter");
  assert.ok(context.id.length > 0);
});

test("routes camera through platform facade", () => {
  ExecutiveTimePlatform.switchContext({ workspaceId, contextId: "this_week" });
  const moved = ExecutiveTimePlatform.moveCamera({
    workspaceId,
    contextId: "this_month",
    source: "user",
    reason: "manual_selection",
  });
  assert.equal(moved.success, true);
  const camera = ExecutiveTimePlatform.getCamera(workspaceId);
  assert.equal(camera?.currentContext, "this_month");
});

test("routes state and transition through platform facade", () => {
  const state = ExecutiveTimePlatform.getState({
    workspaceId,
    entityType: "kpi",
    entityId: "kpi-platform-001",
    fallbackState: "inactive",
  });
  assert.equal(state.readOnly, true);
  assert.equal(state.currentState, "inactive");

  const evaluation = ExecutiveTimePlatform.evaluateTransition({
    workspaceId,
    entityId: "kpi-platform-001",
    entityType: "kpi",
    currentState: "inactive",
    targetState: "active",
    actor: "executive",
    transitionReason: "Activation probe",
  });
  assert.equal(typeof evaluation.valid, "boolean");
  assert.ok(evaluation.explanation.length > 0);
});

test("routes priority events and prediction through platform facade", () => {
  ExecutiveTimePlatform.switchContext({ workspaceId, contextId: "this_week" });
  const priority = ExecutiveTimePlatform.evaluatePriority({
    workspaceId,
    entityId: "risk-platform-001",
    entityType: "risk",
    currentState: "detected",
    actor: "executive",
    reason: "Priority probe",
  });
  assert.ok(priority.priority.length > 0);

  const event = ExecutiveTimePlatform.createExecutiveEvent(
    Object.freeze({
      eventType: "manual",
      category: "temporal",
      sourceModule: "executive-time-platform",
      sourceComponent: "platform-test",
      entityType: "risk",
      entityId: "risk-platform-001",
      workspaceId,
      timestamp: new Date().toISOString(),
      actor: "executive",
      reason: "Event probe",
    })
  );
  assert.equal(event.success, true);
  assert.equal(Object.isFrozen(event.event), true);
  assert.equal(ExecutiveTimePlatform.resolveEvent(event.event!.id)?.id, event.event!.id);

  const prediction = ExecutiveTimePlatform.generatePrediction(
    Object.freeze({
      id: "pred-platform-test-001",
      predictionType: "conflict_detection",
      entityType: "risk",
      entityId: "risk-platform-001",
      workspaceId,
      requestedBy: "executive",
      predictionContext: "Prediction probe",
      predictionScope: "entity",
      currentTimeContext: "this_month",
      currentCameraContext: "this_week",
      metadata: Object.freeze({}),
    })
  );
  assert.equal(prediction.success, true);
  assert.equal(Object.isFrozen(prediction.prediction), true);

  const conflict = ExecutiveTimePlatform.detectConflict(
    Object.freeze({
      id: "pred-platform-test-002",
      predictionType: "conflict_detection",
      entityType: "risk",
      entityId: "risk-platform-001",
      workspaceId,
      requestedBy: "executive",
      predictionContext: "Conflict probe",
      predictionScope: "entity",
      currentTimeContext: "this_month",
      currentCameraContext: "this_week",
      metadata: Object.freeze({}),
    })
  );
  assert.ok(conflict === null || Object.isFrozen(conflict));
});

test("applies approved transition through platform facade", () => {
  const authority = authorizeTransition({
    workspaceId,
    entityId: "scenario-platform-001",
    entityType: "scenario",
    currentState: "draft",
    requestedState: "active",
    actor: "executive",
    transitionReason: "Platform mutation probe",
    requiresApproval: false,
    approvalGranted: true,
    metadata: Object.freeze({}),
  });
  const mutation = ExecutiveTimePlatform.applyApprovedTransition({
    authorityResult: authority,
    actor: "executive",
    timestamp: new Date().toISOString(),
  });
  assert.equal(mutation.success, true);
  assert.equal(
    ExecutiveTimePlatform.getState({
      workspaceId,
      entityType: "scenario",
      entityId: "scenario-platform-001",
    }).currentState,
    "active"
  );
});

test("exposes capability discovery and version metadata", () => {
  const capabilities = getCapabilities();
  assert.equal(capabilities.length, 7);
  assert.deepEqual(getApiCapabilities(), [
    "context",
    "camera",
    "state",
    "transition",
    "priority",
    "events",
    "prediction",
  ]);
  assert.equal(getPlatformVersion(), "APP-1/8.5");
  assert.equal(getCompatibilityVersion(), "APP-1/8.5-compat");
  const engines = getEngineVersions();
  assert.equal(engines.platform, "APP-1/8.5");
  assert.equal(engines.prediction, "APP-1/8");
  const metadata = getPlatformVersionMetadata();
  assert.equal(Object.isFrozen(metadata), true);
  assert.equal(metadata.metadataOnly, true);
  assert.ok(metadata.futureCapabilities.length > 0);
});

test("enforces consumer engine isolation contract", () => {
  assert.equal(EXECUTIVE_TIME_PLATFORM_CONSUMER_CONTRACT.directEngineAccessPermitted, false);
  assert.equal(EXECUTIVE_TIME_PLATFORM_CONSUMER_CONTRACT.permittedEntryPoint, "ExecutiveTimePlatform");
  assert.equal(
    validatePlatformConsumerAccess({
      importPath: "frontend/app/lib/executive-time/executivePredictionEngine.ts",
    }).bypassDetected,
    true
  );
  assert.equal(
    validatePlatformConsumerAccess({
      importPath: "frontend/app/lib/executive-time/executiveTimePlatformApi.ts",
    }).valid,
    true
  );
});

test("manifest blocks UI paths", () => {
  assert.equal(validateStageManifest(EXECUTIVE_TIME_PLATFORM_MANIFEST).valid, true);
  assert.equal(
    evaluateStageFileBoundary({
      filePath: "frontend/app/components/main-right-panel/timeline/TimelinePanel.tsx",
      allowedFiles: EXECUTIVE_TIME_PLATFORM_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed,
    false
  );
  assert.equal(EXECUTIVE_TIME_PLATFORM_FUTURE_INTEGRATIONS.lay.mustUsePlatformApi, true);
});

test("APP-1:8 prediction engine still certifies", () => {
  assert.equal(runExecutivePredictionCertification().certified, true);
});

test("APP-1:8.5 platform certification passes all gates", () => {
  const result = runExecutiveTimePlatformCertification();
  assert.equal(result.certified, true);
  assert.deepEqual([...result.tags], [...EXECUTIVE_TIME_PLATFORM_TAGS]);
  assert.equal(result.failedChecks.length, 0);
});
