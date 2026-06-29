import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION,
  DECISION_TIMELINE_PLATFORM_IDENTITY,
} from "./decisionTimelineContracts.ts";
import { createDecisionTimelineFoundation } from "./decisionTimelineFoundation.ts";
import { resetDecisionTimelinePlatformForTests } from "./decisionTimelineRunner.ts";
import { validateDecisionEventContractShape } from "./decisionTimelineValidation.ts";
import { buildDecisionTimelineEntry } from "./decisionEventBuilder.ts";
import {
  DECISION_EVENT_ENGINE_CONTRACT_VERSION,
  DECISION_EVENT_MANDATORY_FIELDS,
  DECISION_EVENT_TYPE_LIFECYCLE_MAP,
  DECISION_ENGINE_EVENT_TYPE_KEYS,
} from "./decisionEventTypes.ts";
import {
  createDecisionApprovedEvent,
  createDecisionCreatedEvent,
} from "./decisionEventFactory.ts";
import {
  buildDecisionEvent,
  createDecisionEvent,
  DECISION_EVENT_ENGINE_SELF_MANIFEST,
  getDecisionEventContract,
  getDecisionEventRegistry,
  initializeDecisionEventEngine,
  registerDecisionEventType,
  resetDecisionEventEngineForTests,
  validateDecisionEvent,
} from "./decisionEventEngine.ts";
import {
  mapDecisionEngineEventToFoundationContract,
  validateManifestCompatibility,
} from "./decisionEventValidation.ts";
import { runDecisionEventEngine } from "./decisionEventRunner.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function sampleInput(eventType: (typeof DECISION_ENGINE_EVENT_TYPE_KEYS)[number]) {
  return Object.freeze({
    decisionId: "decision-test-001",
    workspaceId: "ws-test-001",
    scenarioId: "scenario-test-001",
    intentId: "intent-test-001",
    eventType,
    timestamp: FIXED_TIME,
    createdBy: "test-runner",
    title: `Test ${eventType}`,
    summary: "Decision event engine test event.",
  });
}

test.beforeEach(() => {
  resetDecisionEventEngineForTests();
  resetDecisionTimelinePlatformForTests();
  createDecisionTimelineFoundation(FIXED_TIME);
  initializeDecisionEventEngine(FIXED_TIME);
});

test("exports APP-6/2 contract vocabulary", () => {
  const contract = getDecisionEventContract();
  assert.equal(contract.contractVersion, DECISION_EVENT_ENGINE_CONTRACT_VERSION);
  assert.equal(contract.mandatoryFields.length, DECISION_EVENT_MANDATORY_FIELDS.length);
  assert.equal(contract.supportedEventTypes.length, 9);
  assert.equal(contract.supportedLifecycles.length, 9);
  for (const field of [
    "eventId",
    "decisionId",
    "timelineEntryId",
    "workspaceId",
    "eventType",
    "lifecycle",
    "timestamp",
    "createdBy",
    "platformVersion",
  ]) {
    assert.ok(contract.mandatoryFields.includes(field), field);
  }
});

test("validates stage manifest and architecture boundary", () => {
  const manifestValidation = validateStageManifest(DECISION_EVENT_ENGINE_SELF_MANIFEST);
  assert.equal(manifestValidation.valid, true, manifestValidation.issues.map((issue) => issue.message).join("; "));
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/decision-timeline/decisionEventEngine.ts",
    allowedFiles: DECISION_EVENT_ENGINE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: DECISION_EVENT_ENGINE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("maps event types to canonical lifecycle values", () => {
  assert.equal(DECISION_EVENT_TYPE_LIFECYCLE_MAP.DECISION_CREATED, "proposed");
  assert.equal(DECISION_EVENT_TYPE_LIFECYCLE_MAP.DECISION_APPROVED, "approved");
  assert.equal(DECISION_EVENT_TYPE_LIFECYCLE_MAP.DECISION_ARCHIVED, "archived");
});

test("buildDecisionEvent creates validated preview without publishing", () => {
  const built = buildDecisionEvent(sampleInput("DECISION_CREATED"));
  assert.equal(built.success, true);
  assert.ok(built.data);
  assert.equal(built.data.readOnly, true);
  assert.equal(getDecisionEventRegistry().publishedEventCount, 0);

  const validation = validateDecisionEvent(built.data!);
  assert.equal(validation.valid, true, validation.issues.map((issue) => issue.message).join("; "));
});

test("createDecisionEvent publishes immutable events for all engine event types", () => {
  for (const eventType of DECISION_ENGINE_EVENT_TYPE_KEYS) {
    const result = createDecisionEvent({
      ...sampleInput(eventType),
      eventId: `decision-event-${eventType.toLowerCase()}`,
      timestamp: `2026-01-01T00:00:${String(DECISION_ENGINE_EVENT_TYPE_KEYS.indexOf(eventType) + 1).padStart(2, "0")}.000Z`,
    });
    assert.equal(result.success, true, eventType);
    assert.equal(result.data?.eventType, eventType);
    assert.equal(result.data?.readOnly, true);
    assert.equal(result.data?.identity.eventId, result.data?.eventId);
    assert.equal(result.data?.identity.timestamp, result.data?.timestamp);
  }
  assert.equal(getDecisionEventRegistry().publishedEventCount, DECISION_ENGINE_EVENT_TYPE_KEYS.length);
});

test("factory helpers create typed events", () => {
  const created = createDecisionCreatedEvent({
    decisionId: "decision-factory-001",
    workspaceId: "ws-factory-001",
    timestamp: FIXED_TIME,
    createdBy: "factory-test",
    title: "Created",
    summary: "Factory test.",
  });
  assert.equal(created.success, true);
  assert.equal(created.data?.eventType, "DECISION_CREATED");
  assert.equal(created.data?.lifecycle, "proposed");

  const approved = createDecisionApprovedEvent({
    decisionId: "decision-factory-002",
    workspaceId: "ws-factory-001",
    timestamp: FIXED_TIME,
    createdBy: "factory-test",
    title: "Approved",
    summary: "Factory test.",
    eventId: "decision-event-approved-factory",
  });
  assert.equal(approved.success, true);
  assert.equal(approved.data?.lifecycle, "approved");
});

test("rejects duplicate eventId", () => {
  const first = createDecisionEvent({ ...sampleInput("DECISION_CREATED"), eventId: "decision-event-dup-001" });
  assert.equal(first.success, true);
  const second = createDecisionEvent({ ...sampleInput("DECISION_UPDATED"), eventId: "decision-event-dup-001" });
  assert.equal(second.success, false);
});

test("rejects workspace isolation violations via context", () => {
  const result = buildDecisionEvent({
    ...sampleInput("DECISION_CREATED"),
    context: Object.freeze({
      workspaceId: "ws-other-001",
      sourceModule: "test",
      readOnly: true as const,
    }),
  });
  assert.equal(result.success, false);
});

test("rejects invalid lifecycle for event type", () => {
  const result = buildDecisionEvent({
    ...sampleInput("DECISION_CREATED"),
    lifecycle: "approved",
  });
  assert.equal(result.success, false);
});

test("maps engine events to APP-6:1 foundation contracts", () => {
  const built = buildDecisionEvent(sampleInput("DECISION_CREATED"));
  assert.equal(built.success, true);
  const foundationContract = mapDecisionEngineEventToFoundationContract(built.data!);
  assert.equal(validateDecisionEventContractShape(foundationContract).valid, true);
  assert.equal(foundationContract.eventType, "decision_created");
  assert.equal(foundationContract.contractVersion, DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION);
});

test("builds immutable timeline entries from engine events", () => {
  const built = buildDecisionEvent(sampleInput("DECISION_APPROVED"));
  assert.equal(built.success, true);
  const entry = buildDecisionTimelineEntry(built.data!);
  assert.equal(entry.readOnly, true);
  assert.equal(entry.workspaceId, built.data!.workspaceId);
  assert.equal(entry.event.decisionId, built.data!.decisionId);
});

test("validates foundation manifest compatibility", () => {
  assert.equal(validateManifestCompatibility(FIXED_TIME).valid, true);
});

test("registers decision event types", () => {
  const registered = registerDecisionEventType(
    Object.freeze({
      eventType: "DECISION_CREATED",
      lifecycle: "proposed",
      label: "Decision Created",
      description: "Test registration.",
      readOnly: true as const,
    })
  );
  assert.equal(registered.success, true);
});

test("regression: APP-6:1 platform identity remains valid", () => {
  assert.equal(DECISION_TIMELINE_PLATFORM_IDENTITY.appId, "APP-6");
  assert.equal(DECISION_TIMELINE_PLATFORM_IDENTITY.version, "APP-6/1");
});

test("runs decision event engine certification", () => {
  const result = runDecisionEventEngine();
  assert.equal(result.certified, true);
  assert.equal(result.status, "PASS");
  assert.equal(result.score, 100);
  assert.ok(result.checks.length >= 20);
});

test("rejects events when engine is not initialized", () => {
  resetDecisionEventEngineForTests();
  const result = createDecisionEvent(sampleInput("DECISION_CREATED"));
  assert.equal(result.success, false);
  assert.match(result.reason, /not initialized/i);
});
