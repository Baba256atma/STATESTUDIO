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
import { buildScenarioLifecycle, calculateScenarioLifecycle, initializeScenarioTimelineLifecycleEngine, resetScenarioTimelineLifecycleEngineForTests } from "./scenarioTimelineLifecycleEngine.ts";
import { calculateScenarioHistory, initializeScenarioTimelineHistoryEngine, resetScenarioTimelineHistoryEngineForTests } from "./scenarioTimelineHistoryEngine.ts";
import {
  SCENARIO_TIMELINE_QUERY_ENGINE_CONTRACT_VERSION,
  SCENARIO_TIMELINE_QUERY_MANDATORY_RESULT_FIELDS,
} from "./scenarioTimelineQueryConstants.ts";
import { certifyScenarioTimelineQueryEngine } from "./scenarioTimelineQueryCertification.ts";
import { SCENARIO_TIMELINE_QUERY_ENGINE_SELF_MANIFEST } from "./scenarioTimelineQueryContracts.ts";
import {
  getTimelineQueryRegistry,
  initializeScenarioTimelineQueryEngine,
  queryLatestTimelineEvent,
  queryScenarioTimeline,
  queryTimelineByDate,
  queryTimelineByStage,
  queryTimelineEvents,
  queryTimelineHistory,
  queryTimelineLifecycle,
  queryTimelineMilestones,
  queryTimelineProgress,
  queryTimelineStatus,
  resetScenarioTimelineQueryEngineForTests,
  validateTimelineQuery,
  getTimelineQueryContract,
} from "./scenarioTimelineQueryEngine.ts";
import { SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS } from "./scenarioTimelinePlatformConstants.ts";
import { initializeScenarioTimelinePlatform } from "./scenarioTimelinePlatformFoundation.ts";
import { resetScenarioTimelinePlatformForTests } from "./scenarioTimelinePlatform.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const SCENARIO_ID = "scenario-query-test-001";
const WORKSPACE_ID = "ws-query-test-001";

function resetPlatformStack(): void {
  resetScenarioTimelineQueryEngineForTests();
  resetScenarioTimelineHistoryEngineForTests();
  resetScenarioTimelineLifecycleEngineForTests();
  resetScenarioTimelineEventEngineForTests();
  resetScenarioTimelinePlatformForTests();
  initializeScenarioTimelinePlatform(FIXED_TIME);
  initializeScenarioTimelineEventEngine(FIXED_TIME);
  initializeScenarioTimelineLifecycleEngine(FIXED_TIME);
  initializeScenarioTimelineHistoryEngine(FIXED_TIME);
  initializeScenarioTimelineQueryEngine(FIXED_TIME);
}

function seedTimelineData(stages: readonly (typeof SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS)[number][]): ScenarioTimelineEvent[] {
  const events: ScenarioTimelineEvent[] = [];
  stages.forEach((stage, index) => {
    const result = createTimelineEvent({
      scenarioId: SCENARIO_ID,
      workspaceId: WORKSPACE_ID,
      stage,
      eventId: `query-test-${stage}-${index}`,
      timestamp: `2026-01-01T00:00:${String(index + 1).padStart(2, "0")}.000Z`,
      createdBy: "query-test",
      title: `Query test ${stage}`,
      summary: "Query engine test event.",
    });
    assert.equal(result.success, true, result.reason);
    events.push(result.data!);
  });
  const lifecycle = buildScenarioLifecycle({ events });
  calculateScenarioLifecycle({ events });
  calculateScenarioHistory({ events, lifecycle });
  return events;
}

test.beforeEach(() => {
  resetPlatformStack();
});

test("exports APP-5/5 query contract vocabulary", () => {
  const contract = getTimelineQueryContract();
  assert.equal(contract.contractVersion, SCENARIO_TIMELINE_QUERY_ENGINE_CONTRACT_VERSION);
  assert.equal(contract.mandatoryResultFields.length, SCENARIO_TIMELINE_QUERY_MANDATORY_RESULT_FIELDS.length);
  assert.ok(contract.supportedQueryTypes.includes("scenario_timeline"));
  assert.ok(contract.supportedFilters.includes("scenarioId"));
});

test("validates stage manifest and architecture boundary", () => {
  const manifestValidation = validateStageManifest(SCENARIO_TIMELINE_QUERY_ENGINE_SELF_MANIFEST);
  assert.equal(manifestValidation.valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/scenario-timeline/scenarioTimelineQueryEngine.ts",
    allowedFiles: SCENARIO_TIMELINE_QUERY_ENGINE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: SCENARIO_TIMELINE_QUERY_ENGINE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("queryScenarioTimeline returns immutable combined timeline result", () => {
  seedTimelineData(["scenario_created", "scenario_updated", "scenario_simulated"]);
  const result = queryScenarioTimeline({ scenarioId: SCENARIO_ID, workspaceId: WORKSPACE_ID });
  assert.equal(result.success, true, result.reason);
  assert.equal(result.data?.readOnly, true);
  assert.equal(result.data?.events.length, 3);
  assert.ok(result.data?.history);
  assert.ok(result.data?.lifecycle);
  assert.equal(result.data?.validationResult.valid, true);
});

test("queryTimelineEvents and queryTimelineHistory retrieve canonical data", () => {
  seedTimelineData(SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS);
  const events = queryTimelineEvents({ scenarioId: SCENARIO_ID });
  const history = queryTimelineHistory({ scenarioId: SCENARIO_ID });
  assert.equal(events.success, true);
  assert.equal(history.success, true);
  assert.equal(events.data?.events.length, 8);
  assert.equal(history.data?.history?.eventCount, 8);
});

test("queryTimelineByStage and queryTimelineByDate filter events", () => {
  seedTimelineData(["scenario_created", "scenario_updated", "decision_made"]);
  const byStage = queryTimelineByStage({ scenarioId: SCENARIO_ID, stage: "decision_made" });
  assert.equal(byStage.success, true);
  assert.equal(byStage.data?.events.length, 1);
  assert.equal(byStage.data?.events[0]?.stage, "decision_made");

  const byDate = queryTimelineByDate({
    scenarioId: SCENARIO_ID,
    dateFrom: "2026-01-01T00:00:01.000Z",
    dateTo: "2026-01-01T00:00:02.000Z",
  });
  assert.equal(byDate.success, true);
  assert.equal(byDate.data?.events.length, 2);
});

test("queryTimelineProgress, status, milestones, and latest event resolve correctly", () => {
  seedTimelineData(SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS);
  const progress = queryTimelineProgress({ scenarioId: SCENARIO_ID });
  const status = queryTimelineStatus({ scenarioId: SCENARIO_ID });
  const milestones = queryTimelineMilestones({ scenarioId: SCENARIO_ID });
  const latest = queryLatestTimelineEvent({ scenarioId: SCENARIO_ID });

  assert.equal(progress.data?.progress, 100);
  assert.equal(status.data?.status, "completed");
  assert.ok((milestones.data?.milestones.length ?? 0) > 0);
  assert.equal(latest.data?.latestEvent?.stage, "lessons_learned");
});

test("queryTimelineLifecycle returns lifecycle projection", () => {
  seedTimelineData(["scenario_created", "scenario_updated"]);
  const lifecycle = queryTimelineLifecycle({ scenarioId: SCENARIO_ID });
  assert.equal(lifecycle.success, true);
  assert.equal(lifecycle.data?.lifecycle?.currentStage, "scenario_updated");
  assert.ok((lifecycle.data?.completedStages.length ?? 0) >= 2);
});

test("validateTimelineQuery rejects unsupported filters", () => {
  const validation = validateTimelineQuery({
    queryType: "by_stage",
    filters: Object.freeze({ scenarioId: SCENARIO_ID }),
  });
  assert.equal(validation.valid, false);
});

test("requires query engine initialization", () => {
  resetScenarioTimelineQueryEngineForTests();
  seedTimelineData(["scenario_created"]);
  const result = queryTimelineEvents({ scenarioId: SCENARIO_ID });
  assert.equal(result.success, false);
  assert.match(result.reason, /not initialized/);
});

test("registers executed queries in query registry", () => {
  seedTimelineData(["scenario_created"]);
  queryTimelineEvents({ scenarioId: SCENARIO_ID });
  assert.equal(getTimelineQueryRegistry().registeredQueryCount, 1);
});

test("certifyScenarioTimelineQueryEngine passes full certification suite", () => {
  const certification = certifyScenarioTimelineQueryEngine();
  assert.equal(certification.certified, true, certification.checks.filter((check) => !check.passed).map((check) => check.title).join("; "));
  assert.equal(certification.status, "PASS");
});

test("APP-2 scenario identity regression remains valid", () => {
  const identity = resolveScenarioIdentityExample();
  assert.equal(validateScenarioIdentityShape(identity).valid, true);
});
