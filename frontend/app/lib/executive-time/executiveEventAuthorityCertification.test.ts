import assert from "node:assert/strict";
import test from "node:test";

import {
  buildExecutiveEventContract,
  EXECUTIVE_EVENT_OWNERSHIP_RULES,
  EXECUTIVE_EVENT_PUBLISHER_RULES,
  EXECUTIVE_EVENT_READONLY_DEPENDENCIES,
  publishExecutiveEvent,
  validateExecutiveEventRequest,
} from "./executiveEventAuthority.ts";
import {
  EXECUTIVE_EVENT_AUTHORITY_TAGS,
  EXECUTIVE_EVENT_AUTHORITY_MANIFEST,
  runExecutiveEventAuthorityCertification,
} from "./executiveEventAuthorityCertification.ts";
import { ExecutiveEventProcessingDeferredError } from "./executiveEventAuthorityTypes.ts";
import {
  ExecutiveEventConsumerContractDeclaration,
  EXECUTIVE_EVENT_CONSUMER_RULES,
  receiveExecutiveEvent,
} from "./executiveEventConsumerContract.ts";
import {
  ExecutiveEventPublisherContractDeclaration,
  validateExecutiveEventPublisherRequest,
} from "./executiveEventPublisherContract.ts";
import { EXECUTIVE_TIME_FORBIDDEN_PATTERNS } from "./executiveTimeContract.ts";
import { runExecutiveTimePriorityCertification } from "./executiveTimePriorityCertification.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

const baseRequest = Object.freeze({
  eventType: "state_change" as const,
  category: "kpi" as const,
  sourceModule: "executive-time-state-engine",
  sourceComponent: "applyApprovedTransition",
  entityType: "kpi" as const,
  entityId: "kpi-001",
  workspaceId: "ws-event-auth",
  timestamp: new Date().toISOString(),
  actor: "executive",
  reason: "State change probe",
});

const baseEvent = () =>
  buildExecutiveEventContract({
    id: "evt-001",
    eventType: "state_change",
    category: "kpi",
    sourceModule: "executive-time-state-engine",
    sourceComponent: "applyApprovedTransition",
    entityType: "kpi",
    entityId: "kpi-001",
    workspaceId: "ws-event-auth",
    timestamp: new Date().toISOString(),
    timeContext: "this_week",
    cameraContext: "this_week",
    stateSnapshot: Object.freeze({
      entityType: "kpi",
      entityId: "kpi-001",
      currentState: "collecting",
      readOnly: true,
    }),
    prioritySnapshot: Object.freeze({
      priority: "normal",
      confidence: 0.7,
      escalationLevel: "Standard Queue",
      readOnly: true,
    }),
  });

test("builds immutable canonical executive events", () => {
  const event = baseEvent();
  assert.equal(Object.isFrozen(event), true);
  assert.equal(Object.isFrozen(event.stateSnapshot), true);
  assert.equal(Object.isFrozen(event.prioritySnapshot), true);
  assert.equal(event.metadata.contractOnly, true);
});

test("validates publisher requests", () => {
  assert.equal(validateExecutiveEventPublisherRequest(baseRequest).valid, true);
  assert.equal(validateExecutiveEventPublisherRequest({ ...baseRequest, actor: "" }).valid, false);
  assert.equal(validateExecutiveEventRequest(baseRequest).valid, true);
});

test("defers valid publish to APP-1:7 event engine", () => {
  assert.throws(() => publishExecutiveEvent(baseRequest), ExecutiveEventProcessingDeferredError);
});

test("rejects invalid publish without creating events", () => {
  const rejected = publishExecutiveEvent({ ...baseRequest, workspaceId: "" });
  assert.equal(rejected.rejected, true);
  assert.equal(rejected.event, null);
  assert.equal(rejected.publisherMayStore, false);
});

test("consumes events read-only without mutation", () => {
  const event = baseEvent();
  const result = receiveExecutiveEvent(event);
  assert.equal(result.received, true);
  assert.equal(result.mutated, false);
  assert.throws(() => {
    (event as { id: string }).id = "changed";
  });
});

test("enforces ownership separation", () => {
  assert.ok(EXECUTIVE_EVENT_OWNERSHIP_RULES.authorityOwns.includes("event_identity"));
  assert.ok(EXECUTIVE_EVENT_OWNERSHIP_RULES.publisherOwns.includes("request_generation"));
  assert.ok(EXECUTIVE_EVENT_OWNERSHIP_RULES.consumerOwns.includes("read_only_consumption"));
  assert.equal(ExecutiveEventPublisherContractDeclaration.mayModifyEvent, false);
  assert.equal(ExecutiveEventConsumerContractDeclaration.mayCreateEvent, false);
});

test("documents read-only upstream dependencies", () => {
  assert.equal(EXECUTIVE_EVENT_READONLY_DEPENDENCIES.context.mutationPermitted, false);
  assert.equal(EXECUTIVE_EVENT_READONLY_DEPENDENCIES.priority.mutationPermitted, false);
  assert.equal(EXECUTIVE_EVENT_PUBLISHER_RULES.mayReplayEvent, false);
  assert.equal(EXECUTIVE_EVENT_CONSUMER_RULES.mayMutateEvent, false);
});

test("manifest blocks UI paths", () => {
  assert.equal(validateStageManifest(EXECUTIVE_EVENT_AUTHORITY_MANIFEST).valid, true);
  assert.equal(
    evaluateStageFileBoundary({
      filePath: "frontend/app/components/panels/TimelinePanel.tsx",
      allowedFiles: EXECUTIVE_EVENT_AUTHORITY_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed,
    false
  );
});

test("APP-1:6 priority certification still passes", () => {
  assert.equal(runExecutiveTimePriorityCertification().certified, true);
});

test("executive event authority certification passes all gates", () => {
  const result = runExecutiveEventAuthorityCertification();
  assert.equal(result.certified, true);
  assert.equal(result.status, "PASS");
  for (const tag of EXECUTIVE_EVENT_AUTHORITY_TAGS) {
    assert.ok(result.tags.includes(tag), tag);
  }
});
