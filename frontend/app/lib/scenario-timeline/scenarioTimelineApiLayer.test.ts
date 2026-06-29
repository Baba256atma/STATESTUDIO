import assert from "node:assert/strict";
import test from "node:test";

import {
  resolveScenarioIdentityExample,
  validateScenarioIdentityShape,
} from "../app-2-scenario-intelligence/scenarioIntelligenceContract.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { resetScenarioTimelineEventEngineForTests } from "./scenarioTimelineEventEngine.ts";
import { resetScenarioTimelineLifecycleEngineForTests } from "./scenarioTimelineLifecycleEngine.ts";
import { resetScenarioTimelineHistoryEngineForTests } from "./scenarioTimelineHistoryEngine.ts";
import { resetScenarioTimelineQueryEngineForTests } from "./scenarioTimelineQueryEngine.ts";
import { resetScenarioTimelinePlatformForTests } from "./scenarioTimelinePlatform.ts";
import {
  SCENARIO_TIMELINE_API_LAYER_CONTRACT_VERSION,
} from "./scenarioTimelineApiConstants.ts";
import { certifyScenarioTimelineApiLayer } from "./scenarioTimelineApiCertification.ts";
import { SCENARIO_TIMELINE_API_LAYER_SELF_MANIFEST } from "./scenarioTimelineApiContracts.ts";
import {
  createScenarioTimelineEvent,
  getScenarioTimeline,
  getScenarioTimelineHealth,
  getScenarioTimelineMilestones,
  getScenarioTimelineProgress,
  getScenarioTimelineStatus,
  getScenarioTimelineSummary,
  getScenarioTimelineVersion,
  getTimelineApiRegistry,
  initializeScenarioTimeline,
  initializeScenarioTimelinePlatform,
  queryScenarioTimeline,
  resetScenarioTimelinePlatformApiForTests,
  validateScenarioTimeline,
  getScenarioTimelineApiContract,
} from "./scenarioTimelineApiLayer.ts";
import { SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS } from "./scenarioTimelinePlatformConstants.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const SCENARIO_ID = "scenario-api-test-001";
const WORKSPACE_ID = "ws-api-test-001";

function resetFullStack(): void {
  resetScenarioTimelinePlatformApiForTests();
  resetScenarioTimelineQueryEngineForTests();
  resetScenarioTimelineHistoryEngineForTests();
  resetScenarioTimelineLifecycleEngineForTests();
  resetScenarioTimelineEventEngineForTests();
  resetScenarioTimelinePlatformForTests();
}

function seedViaApi(stages: readonly (typeof SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS)[number][]): void {
  stages.forEach((stage, index) => {
    const result = createScenarioTimelineEvent({
      scenarioId: SCENARIO_ID,
      workspaceId: WORKSPACE_ID,
      stage,
      eventId: `api-test-${stage}-${index}`,
      timestamp: `2026-01-01T00:00:${String(index + 1).padStart(2, "0")}.000Z`,
      createdBy: "api-test",
      title: `API test ${stage}`,
      summary: "API layer test event.",
    });
    assert.equal(result.success, true, result.errors[0]?.message ?? "create failed");
  });
}

test.beforeEach(() => {
  resetFullStack();
  initializeScenarioTimeline(FIXED_TIME);
});

test("exports APP-5/6 API contract vocabulary", () => {
  const contract = getScenarioTimelineApiContract();
  assert.equal(contract.contractVersion, SCENARIO_TIMELINE_API_LAYER_CONTRACT_VERSION);
  assert.equal(contract.consumerMustUseApiLayer, true);
  assert.ok(contract.categories.includes("query"));
});

test("validates stage manifest and architecture boundary", () => {
  assert.equal(validateStageManifest(SCENARIO_TIMELINE_API_LAYER_SELF_MANIFEST).valid, true);
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/scenario-timeline/scenarioTimelineApiLayer.ts",
    allowedFiles: SCENARIO_TIMELINE_API_LAYER_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: SCENARIO_TIMELINE_API_LAYER_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("initializeScenarioTimelinePlatform initializes APP-5:1 foundation", () => {
  resetFullStack();
  const init = initializeScenarioTimelinePlatform(FIXED_TIME);
  assert.equal(init.success, true);
  assert.equal(init.data?.foundationReady, true);
  assert.equal(init.data?.eventEngineReady, false);
});

test("initializeScenarioTimeline initializes full APP-5 stack", () => {
  resetFullStack();
  const init = initializeScenarioTimeline(FIXED_TIME);
  assert.equal(init.success, true);
  assert.equal(init.data?.queryEngineReady, true);
});

test("createScenarioTimelineEvent orchestrates event lifecycle and history refresh", () => {
  seedViaApi(["scenario_created", "scenario_updated"]);
  const timeline = getScenarioTimeline({ scenarioId: SCENARIO_ID, workspaceId: WORKSPACE_ID });
  assert.equal(timeline.success, true);
  assert.equal(timeline.data?.events.length, 2);
  assert.equal(timeline.data?.lifecycle?.currentStage, "scenario_updated");
});

test("public query APIs return immutable responses", () => {
  seedViaApi(SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS);
  const query = queryScenarioTimeline({ scenarioId: SCENARIO_ID, workspaceId: WORKSPACE_ID });
  assert.equal(query.success, true);
  assert.equal(query.readOnly, true);
  assert.equal(query.metadata.readOnly, true);
  assert.equal(getScenarioTimelineProgress({ scenarioId: SCENARIO_ID, workspaceId: WORKSPACE_ID }).data, 100);
  assert.equal(getScenarioTimelineStatus({ scenarioId: SCENARIO_ID, workspaceId: WORKSPACE_ID }).data, "completed");
  assert.ok((getScenarioTimelineMilestones({ scenarioId: SCENARIO_ID, workspaceId: WORKSPACE_ID }).data?.length ?? 0) > 0);
  assert.ok(getScenarioTimelineSummary({ scenarioId: SCENARIO_ID, workspaceId: WORKSPACE_ID }).data?.narrative);
});

test("getScenarioTimelineHealth reports healthy platform", () => {
  seedViaApi(["scenario_created"]);
  const health = getScenarioTimelineHealth();
  assert.equal(health.success, true);
  assert.equal(health.data?.healthy, true);
});

test("validateScenarioTimeline validates registered scenario", () => {
  seedViaApi(["scenario_created", "scenario_updated"]);
  const validation = validateScenarioTimeline({ scenarioId: SCENARIO_ID, workspaceId: WORKSPACE_ID });
  assert.equal(validation.success, true);
  assert.equal(validation.data?.valid, true);
});

test("getScenarioTimelineVersion exposes layered versions", () => {
  const version = getScenarioTimelineVersion();
  assert.equal(version.apiLayerVersion, "APP-5/6");
  assert.equal(version.queryEngineVersion, "APP-5/5");
});

test("registers API requests in timeline API registry", () => {
  seedViaApi(["scenario_created"]);
  queryScenarioTimeline({ scenarioId: SCENARIO_ID, workspaceId: WORKSPACE_ID });
  assert.ok(getTimelineApiRegistry().registeredRequestCount >= 1);
});

test("certifyScenarioTimelineApiLayer passes full certification suite", () => {
  const certification = certifyScenarioTimelineApiLayer();
  assert.equal(certification.certified, true, certification.checks.filter((check) => !check.passed).map((check) => check.title).join("; "));
  assert.equal(certification.status, "PASS");
});

test("APP-2 scenario identity regression remains valid", () => {
  assert.equal(validateScenarioIdentityShape(resolveScenarioIdentityExample()).valid, true);
});
