import assert from "node:assert/strict";
import test from "node:test";

import { moveToContext, resetExecutiveTimeCameraForTests } from "./executiveTimeCameraEngine.ts";
import { EXECUTIVE_TIME_FORBIDDEN_PATTERNS } from "./executiveTimeContract.ts";
import { resetExecutiveTimeContextStoreForTests } from "./executiveTimeContextStore.ts";
import { resetExecutiveTimeRegistryForTests } from "./executiveTimeRegistry.ts";
import { runExecutiveEventAuthorityCertification } from "./executiveEventAuthorityCertification.ts";
import { classifyExecutiveEvent } from "./executiveEventClassification.ts";
import {
  createExecutiveEvent,
  ExecutiveEventEngine,
  resolveLatestEvent,
} from "./executiveEventEngine.ts";
import {
  EXECUTIVE_EVENT_ENGINE_MANIFEST,
  EXECUTIVE_EVENT_ENGINE_TAGS,
  runExecutiveEventEngineCertification,
} from "./executiveEventCertification.ts";
import { EXECUTIVE_EVENT_LIFECYCLE_STEPS } from "./executiveEventLifecycle.ts";
import {
  getEvent,
  listEventsByCategory,
  listEventsByEntity,
  listEventsBySource,
  listEventsByWorkspace,
  resetExecutiveEventRegistryForTests,
} from "./executiveEventRegistry.ts";
import {
  resolveEntityHistory,
  resolveEvent,
  resolveWorkspaceHistory,
} from "./executiveEventResolver.ts";
import { resetExecutiveTimeEntityStateStoreForTests } from "./executiveTimeStateMutation.ts";
import { resetExecutiveTimeStateRegistryForTests } from "./executiveTimeStateRegistry.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

const workspaceId = "ws-event-engine-test";

test.beforeEach(() => {
  resetExecutiveTimeRegistryForTests();
  resetExecutiveTimeContextStoreForTests();
  resetExecutiveTimeCameraForTests();
  resetExecutiveTimeStateRegistryForTests();
  resetExecutiveTimeEntityStateStoreForTests();
  resetExecutiveEventRegistryForTests();
  moveToContext({ workspaceId, contextId: "this_week", source: "user", reason: "manual_selection" });
});

const baseRequest = Object.freeze({
  eventType: "state_change" as const,
  category: "kpi" as const,
  sourceModule: "executive-time-state-engine",
  sourceComponent: "applyApprovedTransition",
  entityType: "kpi" as const,
  entityId: "kpi-001",
  workspaceId,
  timestamp: new Date().toISOString(),
  actor: "executive",
  reason: "KPI state change",
});

test("creates executive events through canonical pipeline", () => {
  const result = createExecutiveEvent(baseRequest);
  assert.equal(result.success, true);
  assert.equal(result.lifecycleState, "published");
  assert.ok(result.event?.id.startsWith("evt-"));
  assert.equal(getEvent(result.event!.id)?.id, result.event!.id);
});

test("registers immutable events with snapshots", () => {
  const result = createExecutiveEvent(baseRequest);
  const event = result.event!;
  assert.equal(Object.isFrozen(event), true);
  assert.equal(Object.isFrozen(event.contextSnapshot), true);
  assert.equal(Object.isFrozen(event.cameraSnapshot), true);
  assert.equal(Object.isFrozen(event.stateSnapshot), true);
  assert.equal(Object.isFrozen(event.prioritySnapshot), true);
  assert.equal(event.contextSnapshot.readOnly, true);
  assert.equal(event.lifecycleState, "published");
});

test("classifies events by entity and category", () => {
  const classification = classifyExecutiveEvent({
    entityType: "risk",
    category: "risk",
    eventType: "priority_change",
  });
  assert.equal(classification.key, "risk");
  assert.equal(EXECUTIVE_EVENT_LIFECYCLE_STEPS.length, 5);
});

test("supports registry lookups", () => {
  createExecutiveEvent(baseRequest);
  createExecutiveEvent({ ...baseRequest, entityId: "kpi-002" });
  assert.equal(listEventsByWorkspace(workspaceId).length, 2);
  assert.equal(listEventsByEntity({ workspaceId, entityType: "kpi", entityId: "kpi-001" }).length, 1);
  assert.equal(listEventsByCategory("kpi").length, 2);
  assert.equal(listEventsBySource("executive-time-state-engine").length, 2);
});

test("resolves latest event and histories", () => {
  createExecutiveEvent(baseRequest);
  const second = createExecutiveEvent({ ...baseRequest, entityId: "kpi-003", timestamp: new Date(Date.now() + 1000).toISOString() });
  const latest = resolveLatestEvent({ workspaceId });
  assert.equal(latest?.id, second.event?.id);
  assert.equal(resolveEntityHistory({ workspaceId, entityType: "kpi", entityId: "kpi-001" }).length, 1);
  assert.equal(resolveWorkspaceHistory(workspaceId).length, 2);
  assert.equal(resolveEvent(second.event!.id)?.id, second.event!.id);
});

test("rejects invalid event creation", () => {
  const rejected = createExecutiveEvent({ ...baseRequest, workspaceId: "" });
  assert.equal(rejected.success, false);
  assert.equal(rejected.event, null);
});

test("engine contract exposes creation and resolver APIs", () => {
  assert.equal(typeof ExecutiveEventEngine.createExecutiveEvent, "function");
  assert.equal(typeof ExecutiveEventEngine.resolveWorkspaceHistory, "function");
});

test("manifest blocks UI and external runtime paths", () => {
  assert.equal(validateStageManifest(EXECUTIVE_EVENT_ENGINE_MANIFEST).valid, true);
  assert.equal(
    evaluateStageFileBoundary({
      filePath: "frontend/app/components/panels/TimelinePanel.tsx",
      allowedFiles: EXECUTIVE_EVENT_ENGINE_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed,
    false
  );
});

test("APP-1:6.5 event authority still certifies", () => {
  assert.equal(runExecutiveEventAuthorityCertification().certified, true);
});

test("event engine certification passes all gates", () => {
  const result = runExecutiveEventEngineCertification();
  assert.equal(result.certified, true);
  assert.equal(result.status, "PASS");
  for (const tag of EXECUTIVE_EVENT_ENGINE_TAGS) {
    assert.ok(result.tags.includes(tag), tag);
  }
});
