import assert from "node:assert/strict";
import test from "node:test";

import {
  resolveScenarioIdentityExample,
  validateScenarioIdentityShape,
} from "../app-2-scenario-intelligence/scenarioIntelligenceContract.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  SCENARIO_TIMELINE_EVENT_ENGINE_CONTRACT_VERSION,
  SCENARIO_TIMELINE_EVENT_MANDATORY_FIELDS,
  SCENARIO_TIMELINE_STAGE_EVENT_TYPE_MAP,
} from "./scenarioTimelineEventConstants.ts";
import { SCENARIO_TIMELINE_EVENT_ENGINE_SELF_MANIFEST } from "./scenarioTimelineEventContracts.ts";
import { certifyTimelineEventEngine } from "./scenarioTimelineEventCertification.ts";
import {
  buildTimelineEvent,
  createTimelineEvent,
  getTimelineEventContract,
  getTimelineEventRegistry,
  initializeScenarioTimelineEventEngine,
  registerTimelineEventType,
  resetScenarioTimelineEventEngineForTests,
  validateTimelineEvent,
} from "./scenarioTimelineEventEngine.ts";
import { mapTimelineEventToFoundationContract } from "./scenarioTimelineEventValidator.ts";
import {
  SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS,
  SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
} from "./scenarioTimelinePlatformConstants.ts";
import { initializeScenarioTimelinePlatform } from "./scenarioTimelinePlatformFoundation.ts";
import { resetScenarioTimelinePlatformForTests } from "./scenarioTimelinePlatform.ts";
import { validateTimelineEventContractShape } from "./scenarioTimelinePlatformValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function sampleInput(stage: (typeof SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS)[number]) {
  return Object.freeze({
    scenarioId: "scenario-test-001",
    workspaceId: "ws-test-001",
    stage,
    timestamp: FIXED_TIME,
    createdBy: "test-runner",
    title: `Test ${stage}`,
    summary: "Scenario timeline event engine test event.",
  });
}

test.beforeEach(() => {
  resetScenarioTimelineEventEngineForTests();
  resetScenarioTimelinePlatformForTests();
  initializeScenarioTimelinePlatform(FIXED_TIME);
  initializeScenarioTimelineEventEngine(FIXED_TIME);
});

test("exports APP-5/2 contract vocabulary", () => {
  const contract = getTimelineEventContract();
  assert.equal(contract.contractVersion, SCENARIO_TIMELINE_EVENT_ENGINE_CONTRACT_VERSION);
  assert.equal(contract.mandatoryFields.length, SCENARIO_TIMELINE_EVENT_MANDATORY_FIELDS.length);
  assert.equal(contract.supportedStages.length, 8);
  for (const field of [
    "eventId",
    "scenarioId",
    "workspaceId",
    "eventType",
    "stage",
    "timestamp",
    "createdBy",
    "platformVersion",
    "metadata",
    "extensions",
  ]) {
    assert.ok(contract.mandatoryFields.includes(field), field);
  }
});

test("validates stage manifest and architecture boundary", () => {
  const manifestValidation = validateStageManifest(SCENARIO_TIMELINE_EVENT_ENGINE_SELF_MANIFEST);
  assert.equal(manifestValidation.valid, true, manifestValidation.issues.map((issue) => issue.message).join("; "));
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/scenario-timeline/scenarioTimelineEventEngine.ts",
    allowedFiles: SCENARIO_TIMELINE_EVENT_ENGINE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: SCENARIO_TIMELINE_EVENT_ENGINE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("maps lifecycle stages to canonical event types", () => {
  assert.equal(SCENARIO_TIMELINE_STAGE_EVENT_TYPE_MAP.scenario_created, "lifecycle_transition");
  assert.equal(SCENARIO_TIMELINE_STAGE_EVENT_TYPE_MAP.decision_made, "decision_record");
  assert.equal(SCENARIO_TIMELINE_STAGE_EVENT_TYPE_MAP.lessons_learned, "lesson_learned");
});

test("buildTimelineEvent creates validated preview without publishing", () => {
  const built = buildTimelineEvent(sampleInput("scenario_created"));
  assert.equal(built.success, true);
  assert.ok(built.data);
  assert.equal(built.data.readOnly, true);
  assert.equal(getTimelineEventRegistry().publishedEventCount, 0);

  const validation = validateTimelineEvent(built.data);
  assert.equal(validation.valid, true, validation.issues.map((issue) => issue.message).join("; "));
});

test("createTimelineEvent publishes immutable events for all lifecycle stages", () => {
  for (const stage of SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS) {
    const result = createTimelineEvent({
      ...sampleInput(stage),
      eventId: `timeline-event-${stage}`,
      timestamp: `2026-01-01T00:00:${String(SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS.indexOf(stage) + 1).padStart(2, "0")}.000Z`,
    });
    assert.equal(result.success, true, stage);
    assert.equal(result.data?.stage, stage);
    assert.equal(result.data?.readOnly, true);
  }
  assert.equal(getTimelineEventRegistry().publishedEventCount, SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS.length);
});

test("rejects duplicate eventId", () => {
  const first = createTimelineEvent({ ...sampleInput("scenario_created"), eventId: "timeline-event-dup-001" });
  assert.equal(first.success, true);
  const duplicate = createTimelineEvent({ ...sampleInput("scenario_updated"), eventId: "timeline-event-dup-001" });
  assert.equal(duplicate.success, false);
  assert.match(duplicate.reason, /Duplicate eventId/);
});

test("enforces monotonic sequence ordering per scenario", () => {
  const first = createTimelineEvent({
    ...sampleInput("scenario_created"),
    eventId: "timeline-event-seq-001",
    timestamp: "2026-01-01T00:00:01.000Z",
  });
  const second = createTimelineEvent({
    ...sampleInput("scenario_updated"),
    eventId: "timeline-event-seq-002",
    timestamp: "2026-01-01T00:00:02.000Z",
  });
  assert.ok((second.data?.sequenceOrder ?? 0) > (first.data?.sequenceOrder ?? 0));
});

test("rejects invalid stage and timestamp", () => {
  const invalidStage = buildTimelineEvent({
    ...sampleInput("scenario_created"),
    stage: "timeline_playback" as "scenario_created",
  });
  assert.equal(invalidStage.success, false);

  const invalidTimestamp = buildTimelineEvent({
    ...sampleInput("scenario_created"),
    timestamp: "not-a-date",
  });
  assert.equal(invalidTimestamp.success, false);
});

test("validates metadata and extension compatibility", () => {
  const withMetadata = createTimelineEvent({
    ...sampleInput("scenario_simulated"),
    eventId: "timeline-event-meta-001",
    metadata: Object.freeze({ owner: "scenario-engine", phase: "APP-5/2" }),
    extensions: Object.freeze({ correlationId: "corr-001" }),
  });
  assert.equal(withMetadata.success, true);

  const invalidExtension = buildTimelineEvent({
    ...sampleInput("decision_made"),
    extensions: Object.freeze({ unsupportedKey: "value" }),
  });
  assert.equal(invalidExtension.success, false);
});

test("maps events to APP-5:1 foundation contract", () => {
  const created = createTimelineEvent({ ...sampleInput("execution_started"), eventId: "timeline-event-foundation-001" });
  assert.equal(created.success, true);
  assert.ok(created.data);
  const foundationContract = mapTimelineEventToFoundationContract(created.data);
  assert.equal(foundationContract.contractVersion, SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION);
  const foundationValidation = validateTimelineEventContractShape(foundationContract);
  assert.equal(foundationValidation.valid, true, foundationValidation.issues.map((issue) => issue.message).join("; "));
});

test("registerTimelineEventType updates stage binding", () => {
  const registration = registerTimelineEventType({
    stage: "lessons_learned",
    eventType: "lesson_learned",
    label: "Lessons Learned",
    description: "Test registration.",
    readOnly: true,
  });
  assert.equal(registration.success, true);
  assert.equal(registration.data?.stage, "lessons_learned");
});

test("requires engine initialization for createTimelineEvent", () => {
  resetScenarioTimelineEventEngineForTests();
  const result = createTimelineEvent(sampleInput("scenario_created"));
  assert.equal(result.success, false);
  assert.match(result.reason, /not initialized/);
});

test("certifyTimelineEventEngine passes full certification suite", () => {
  const certification = certifyTimelineEventEngine();
  assert.equal(certification.certified, true, certification.checks.filter((check) => !check.passed).map((check) => check.title).join("; "));
  assert.equal(certification.status, "PASS");
});

test("APP-2 scenario identity regression remains valid", () => {
  const identity = resolveScenarioIdentityExample();
  const validation = validateScenarioIdentityShape(identity);
  assert.equal(validation.valid, true, validation.issues.map((issue) => issue.message).join("; "));
});
