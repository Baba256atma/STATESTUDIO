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
import { buildScenarioLifecycle, initializeScenarioTimelineLifecycleEngine, resetScenarioTimelineLifecycleEngineForTests } from "./scenarioTimelineLifecycleEngine.ts";
import {
  SCENARIO_TIMELINE_HISTORY_ENGINE_CONTRACT_VERSION,
  SCENARIO_TIMELINE_HISTORY_MANDATORY_FIELDS,
} from "./scenarioTimelineHistoryConstants.ts";
import { validateHistoryEventCompatibility } from "./scenarioTimelineHistoryCompatibility.ts";
import { certifyScenarioHistoryEngine } from "./scenarioTimelineHistoryCertification.ts";
import { SCENARIO_TIMELINE_HISTORY_ENGINE_SELF_MANIFEST } from "./scenarioTimelineHistoryContracts.ts";
import {
  buildScenarioHistory,
  calculateScenarioHistory,
  getScenarioHistory,
  getScenarioHistoryDuration,
  getScenarioHistoryMilestones,
  getScenarioHistoryRegistry,
  getScenarioHistorySummary,
  initializeScenarioTimelineHistoryEngine,
  resetScenarioTimelineHistoryEngineForTests,
  validateScenarioHistory,
  getScenarioHistoryContract,
} from "./scenarioTimelineHistoryEngine.ts";
import { SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS } from "./scenarioTimelinePlatformConstants.ts";
import { initializeScenarioTimelinePlatform } from "./scenarioTimelinePlatformFoundation.ts";
import { resetScenarioTimelinePlatformForTests } from "./scenarioTimelinePlatform.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const SCENARIO_ID = "scenario-history-test-001";
const WORKSPACE_ID = "ws-history-test-001";

function resetPlatformStack(): void {
  resetScenarioTimelineHistoryEngineForTests();
  resetScenarioTimelineLifecycleEngineForTests();
  resetScenarioTimelineEventEngineForTests();
  resetScenarioTimelinePlatformForTests();
  initializeScenarioTimelinePlatform(FIXED_TIME);
  initializeScenarioTimelineEventEngine(FIXED_TIME);
  initializeScenarioTimelineLifecycleEngine(FIXED_TIME);
  initializeScenarioTimelineHistoryEngine(FIXED_TIME);
}

function createHistoryEvents(stages: readonly (typeof SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS)[number][]): ScenarioTimelineEvent[] {
  const events: ScenarioTimelineEvent[] = [];
  stages.forEach((stage, index) => {
    const result = createTimelineEvent({
      scenarioId: SCENARIO_ID,
      workspaceId: WORKSPACE_ID,
      stage,
      eventId: `history-test-${stage}-${index}`,
      timestamp: `2026-01-01T00:00:${String(index + 1).padStart(2, "0")}.000Z`,
      createdBy: "history-test",
      title: `History test ${stage}`,
      summary: "History engine test event.",
    });
    assert.equal(result.success, true, result.reason);
    events.push(result.data!);
  });
  return events;
}

test.beforeEach(() => {
  resetPlatformStack();
});

test("exports APP-5/4 history contract vocabulary", () => {
  const contract = getScenarioHistoryContract();
  assert.equal(contract.contractVersion, SCENARIO_TIMELINE_HISTORY_ENGINE_CONTRACT_VERSION);
  assert.equal(contract.mandatoryFields.length, SCENARIO_TIMELINE_HISTORY_MANDATORY_FIELDS.length);
  assert.equal(contract.supportedStages.length, 8);
  assert.ok(contract.milestoneKeys.includes("history_started"));
});

test("validates stage manifest and architecture boundary", () => {
  const manifestValidation = validateStageManifest(SCENARIO_TIMELINE_HISTORY_ENGINE_SELF_MANIFEST);
  assert.equal(manifestValidation.valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/scenario-timeline/scenarioTimelineHistoryEngine.ts",
    allowedFiles: SCENARIO_TIMELINE_HISTORY_ENGINE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: SCENARIO_TIMELINE_HISTORY_ENGINE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("buildScenarioHistory reconstructs chronological history with grouping", () => {
  const events = createHistoryEvents(["scenario_created", "scenario_updated", "scenario_simulated"]);
  const lifecycle = buildScenarioLifecycle({ events });
  const history = buildScenarioHistory({ events, lifecycle });

  assert.equal(history.readOnly, true);
  assert.equal(history.eventCount, 3);
  assert.equal(history.orderedEvents[0]?.stage, "scenario_created");
  assert.equal(history.latestStage, "scenario_simulated");
  assert.equal(history.stageGroups.length, 3);
  assert.equal(history.groups.byScenario[SCENARIO_ID]?.length, 3);
  assert.equal(history.groups.byWorkspace[WORKSPACE_ID]?.length, 3);
  assert.ok(history.historySummary.narrative.includes(SCENARIO_ID));
});

test("calculateScenarioHistory registers history for registry APIs", () => {
  const events = createHistoryEvents(["scenario_created", "scenario_updated"]);
  const lifecycle = buildScenarioLifecycle({ events });
  const result = calculateScenarioHistory({ events, lifecycle });
  assert.equal(result.success, true);

  const history = getScenarioHistory(SCENARIO_ID);
  assert.ok(history);
  assert.equal(getScenarioHistorySummary(SCENARIO_ID)?.eventCount, 2);
  assert.equal(getScenarioHistoryMilestones(SCENARIO_ID).length >= 2, true);
  assert.ok(getScenarioHistoryDuration(SCENARIO_ID) >= 0);
  assert.equal(getScenarioHistoryRegistry().registeredHistoryCount, 1);
});

test("detects milestones and completed history for full lifecycle", () => {
  const events = createHistoryEvents(SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS);
  const lifecycle = buildScenarioLifecycle({ events });
  const history = buildScenarioHistory({ events, lifecycle });

  assert.equal(history.latestStage, "lessons_learned");
  assert.ok(history.milestones.some((entry) => entry.milestoneKey === "history_started"));
  assert.ok(history.milestones.some((entry) => entry.milestoneKey === "history_completed"));
  assert.equal(validateScenarioHistory(history).valid, true);
});

test("rejects duplicate event ids in history validation", () => {
  const events = createHistoryEvents(["scenario_created", "scenario_updated"]);
  const duplicate = Object.freeze({
    ...events[0]!,
    stage: "scenario_updated" as const,
    sequenceOrder: 2,
    timestamp: "2026-01-01T00:00:02.000Z",
  });
  const history = buildScenarioHistory({ events: [...events, duplicate] });
  assert.equal(history.validationResult.valid, false);
  assert.ok(history.validationResult.issues.some((issue) => issue.code === "duplicate_event"));
});

test("validateHistoryEventCompatibility checks APP-5:1 and APP-5:2 contracts", () => {
  const events = createHistoryEvents(["scenario_created", "scenario_updated"]);
  const compatibility = validateHistoryEventCompatibility(events);
  assert.equal(compatibility.valid, true);
});

test("requires history engine initialization for calculateScenarioHistory", () => {
  resetScenarioTimelineHistoryEngineForTests();
  const events = createHistoryEvents(["scenario_created"]);
  const result = calculateScenarioHistory({ events });
  assert.equal(result.success, false);
  assert.match(result.reason, /not initialized/);
});

test("certifyScenarioHistoryEngine passes full certification suite", () => {
  const certification = certifyScenarioHistoryEngine();
  assert.equal(certification.certified, true, certification.checks.filter((check) => !check.passed).map((check) => check.title).join("; "));
  assert.equal(certification.status, "PASS");
});

test("APP-2 scenario identity regression remains valid", () => {
  const identity = resolveScenarioIdentityExample();
  const validation = validateScenarioIdentityShape(identity);
  assert.equal(validation.valid, true);
});
