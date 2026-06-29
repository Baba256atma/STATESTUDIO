import assert from "node:assert/strict";
import test from "node:test";

import {
  resolveScenarioIdentityExample,
  validateScenarioIdentityShape,
} from "../app-2-scenario-intelligence/scenarioIntelligenceContract.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  createTimelineEvent,
  initializeScenarioTimelineEventEngine,
  resetScenarioTimelineEventEngineForTests,
} from "./scenarioTimelineEventEngine.ts";
import type { ScenarioTimelineEvent } from "./scenarioTimelineEventTypes.ts";
import {
  SCENARIO_TIMELINE_LIFECYCLE_ENGINE_CONTRACT_VERSION,
  SCENARIO_TIMELINE_LIFECYCLE_MANDATORY_FIELDS,
} from "./scenarioTimelineLifecycleConstants.ts";
import { validateLifecycleEventCompatibility } from "./scenarioTimelineLifecycleCompatibility.ts";
import { certifyScenarioLifecycleEngine } from "./scenarioTimelineLifecycleCertification.ts";
import { SCENARIO_TIMELINE_LIFECYCLE_ENGINE_SELF_MANIFEST } from "./scenarioTimelineLifecycleContracts.ts";
import {
  buildScenarioLifecycle,
  calculateScenarioLifecycle,
  getLifecycleRegistry,
  getScenarioCurrentStage,
  getScenarioLifecycleContract,
  getScenarioProgress,
  getScenarioStatus,
  initializeScenarioTimelineLifecycleEngine,
  resetScenarioTimelineLifecycleEngineForTests,
  validateScenarioLifecycle,
  validateScenarioTransition,
} from "./scenarioTimelineLifecycleEngine.ts";
import { SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS } from "./scenarioTimelinePlatformConstants.ts";
import { initializeScenarioTimelinePlatform } from "./scenarioTimelinePlatformFoundation.ts";
import { resetScenarioTimelinePlatformForTests } from "./scenarioTimelinePlatform.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const SCENARIO_ID = "scenario-lifecycle-test-001";
const WORKSPACE_ID = "ws-lifecycle-test-001";

function resetPlatformStack(): void {
  resetScenarioTimelineLifecycleEngineForTests();
  resetScenarioTimelineEventEngineForTests();
  resetScenarioTimelinePlatformForTests();
  initializeScenarioTimelinePlatform(FIXED_TIME);
  initializeScenarioTimelineEventEngine(FIXED_TIME);
  initializeScenarioTimelineLifecycleEngine(FIXED_TIME);
}

function createLifecycleEvents(stages: readonly (typeof SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS)[number][]): ScenarioTimelineEvent[] {
  const events: ScenarioTimelineEvent[] = [];
  stages.forEach((stage, index) => {
    const result = createTimelineEvent({
      scenarioId: SCENARIO_ID,
      workspaceId: WORKSPACE_ID,
      stage,
      eventId: `lifecycle-test-${stage}-${index}`,
      timestamp: `2026-01-01T00:00:${String(index + 1).padStart(2, "0")}.000Z`,
      createdBy: "lifecycle-test",
      title: `Test ${stage}`,
      summary: "Lifecycle engine test event.",
    });
    assert.equal(result.success, true, result.reason);
    events.push(result.data!);
  });
  return events;
}

test.beforeEach(() => {
  resetPlatformStack();
});

test("exports APP-5/3 lifecycle contract vocabulary", () => {
  const contract = getScenarioLifecycleContract();
  assert.equal(contract.contractVersion, SCENARIO_TIMELINE_LIFECYCLE_ENGINE_CONTRACT_VERSION);
  assert.equal(contract.mandatoryFields.length, SCENARIO_TIMELINE_LIFECYCLE_MANDATORY_FIELDS.length);
  assert.equal(contract.supportedStages.length, 8);
  assert.ok(contract.supportedStatuses.includes("completed"));
});

test("validates stage manifest and architecture boundary", () => {
  const manifestValidation = validateStageManifest(SCENARIO_TIMELINE_LIFECYCLE_ENGINE_SELF_MANIFEST);
  assert.equal(manifestValidation.valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/scenario-timeline/scenarioTimelineLifecycleEngine.ts",
    allowedFiles: SCENARIO_TIMELINE_LIFECYCLE_ENGINE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: SCENARIO_TIMELINE_LIFECYCLE_ENGINE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("buildScenarioLifecycle derives current stage and progress from events", () => {
  const events = createLifecycleEvents([
    "scenario_created",
    "scenario_updated",
    "scenario_simulated",
  ]);
  const lifecycle = buildScenarioLifecycle({ events });
  assert.equal(lifecycle.readOnly, true);
  assert.equal(lifecycle.currentStage, "scenario_simulated");
  assert.equal(lifecycle.status, "in_progress");
  assert.equal(lifecycle.isCompleted, false);
  assert.equal(lifecycle.completedStages.length, 3);
  assert.equal(lifecycle.progressPercentage, 38);
  assert.equal(lifecycle.transitionHistory.length, 3);
});

test("calculateScenarioLifecycle registers lifecycle for registry APIs", () => {
  const events = createLifecycleEvents(["scenario_created", "scenario_updated"]);
  const result = calculateScenarioLifecycle({ events });
  assert.equal(result.success, true);
  assert.equal(getScenarioCurrentStage(SCENARIO_ID), "scenario_updated");
  assert.equal(getScenarioProgress(SCENARIO_ID), 25);
  assert.equal(getScenarioStatus(SCENARIO_ID), "in_progress");
  assert.equal(getLifecycleRegistry().registeredLifecycleCount, 1);
});

test("marks lifecycle completed at lessons_learned", () => {
  const events = createLifecycleEvents(SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS);
  const lifecycle = buildScenarioLifecycle({ events });
  assert.equal(lifecycle.currentStage, "lessons_learned");
  assert.equal(lifecycle.status, "completed");
  assert.equal(lifecycle.isCompleted, true);
  assert.equal(lifecycle.progressPercentage, 100);
  assert.equal(validateScenarioLifecycle(lifecycle).valid, true);
});

test("blocks invalid transitions and skipped stages", () => {
  const events = createLifecycleEvents(["scenario_created", "decision_made"]);
  const lifecycle = buildScenarioLifecycle({ events });
  assert.equal(lifecycle.isBlocked, true);
  assert.equal(lifecycle.status, "blocked");
  assert.equal(lifecycle.validationResult.valid, false);
});

test("rejects duplicate scenario_created transitions", () => {
  const events = createLifecycleEvents(["scenario_created", "scenario_created"]);
  const lifecycle = buildScenarioLifecycle({ events });
  assert.equal(lifecycle.isBlocked, true);
  assert.ok(
    lifecycle.validationResult.issues.some((issue) => issue.code === "invalid_transition"),
    "expected invalid transition issue"
  );
});

test("validateScenarioTransition enforces frozen lifecycle rules", () => {
  assert.equal(validateScenarioTransition(null, "scenario_created").valid, true);
  assert.equal(validateScenarioTransition(null, "scenario_updated").valid, false);
  assert.equal(validateScenarioTransition("scenario_created", "scenario_updated").valid, true);
  assert.equal(validateScenarioTransition("scenario_created", "scenario_simulated").valid, false);
  assert.equal(validateScenarioTransition("scenario_updated", "scenario_updated").valid, true);
  assert.equal(validateScenarioTransition("lessons_learned", "execution_started").valid, false);
});

test("validateLifecycleEventCompatibility checks APP-5:1 and APP-5:2 contracts", () => {
  const events = createLifecycleEvents(["scenario_created", "scenario_updated"]);
  const compatibility = validateLifecycleEventCompatibility(events);
  assert.equal(compatibility.valid, true, compatibility.issues.map((issue) => issue.message).join("; "));
});

test("requires lifecycle engine initialization for calculateScenarioLifecycle", () => {
  resetScenarioTimelineLifecycleEngineForTests();
  const events = createLifecycleEvents(["scenario_created"]);
  const result = calculateScenarioLifecycle({ events });
  assert.equal(result.success, false);
  assert.match(result.reason, /not initialized/);
});

test("certifyScenarioLifecycleEngine passes full certification suite", () => {
  const certification = certifyScenarioLifecycleEngine();
  assert.equal(certification.certified, true, certification.checks.filter((check) => !check.passed).map((check) => check.title).join("; "));
  assert.equal(certification.status, "PASS");
});

test("APP-2 scenario identity regression remains valid", () => {
  const identity = resolveScenarioIdentityExample();
  const validation = validateScenarioIdentityShape(identity);
  assert.equal(validation.valid, true);
});
