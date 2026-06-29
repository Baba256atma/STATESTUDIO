import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION,
  BUSINESS_TIMELINE_PLATFORM_IDENTITY,
} from "./businessTimelineContracts.ts";
import { createBusinessTimelineFoundation } from "./businessTimelineFoundation.ts";
import { resetBusinessTimelinePlatformForTests } from "./businessTimelineRunner.ts";
import { validateBusinessEventContractShape } from "./businessTimelineValidation.ts";
import {
  archiveBusinessEvent,
  createBusinessEvent,
  filterBusinessEvents,
  getBusinessEventById,
  getBusinessEventRevisionHistory,
  getBusinessEventsByWorkspace,
  initializeBusinessEventEngine,
  normalizeBusinessEvent,
  resetBusinessEventEngineForTests,
  updateBusinessEventMetadata,
  validateBusinessEventInput,
  BUSINESS_EVENT_ENGINE_SELF_MANIFEST,
} from "./businessEventEngine.ts";
import {
  mapBusinessEngineEventToFoundationContract,
  validateFoundationCompatibilityForEngine,
} from "./businessEventEngineValidation.ts";
import { runBusinessEventEngineCertification } from "./businessEventEngineRunner.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function sampleInput(overrides: Record<string, unknown> = {}) {
  return Object.freeze({
    workspaceId: "ws-test-001",
    title: "Revenue milestone",
    description: "Reached annual revenue target.",
    category: "financial" as const,
    type: "milestone" as const,
    importance: "high" as const,
    status: "completed" as const,
    source: "manual" as const,
    createdAt: FIXED_TIME,
    occurredAt: FIXED_TIME,
    createdBy: "test-runner",
    tags: Object.freeze(["revenue", "milestone"]),
    ...overrides,
  });
}

test.beforeEach(() => {
  resetBusinessEventEngineForTests();
  resetBusinessTimelinePlatformForTests();
  createBusinessTimelineFoundation(FIXED_TIME);
  initializeBusinessEventEngine(FIXED_TIME);
});

test("validates stage manifest and architecture boundary", () => {
  const manifestValidation = validateStageManifest(BUSINESS_EVENT_ENGINE_SELF_MANIFEST);
  assert.equal(manifestValidation.valid, true, manifestValidation.issues.map((issue) => issue.message).join("; "));
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/business-timeline/businessEventEngine.ts",
    allowedFiles: BUSINESS_EVENT_ENGINE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: BUSINESS_EVENT_ENGINE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("creates business events with required fields", () => {
  const result = createBusinessEvent({ ...sampleInput(), id: "business-event-test-001" });
  assert.equal(result.success, true, result.reason);
  assert.ok(result.data);
  assert.equal(result.data.revisionVersion, 1);
  assert.equal(result.data.readOnly, true);
  assert.equal(result.data.id, "business-event-test-001");
});

test("rejects missing required fields", () => {
  const validation = validateBusinessEventInput({
    ...sampleInput(),
    title: "",
  });
  assert.equal(validation.valid, false);
  assert.ok(validation.issues.some((issue) => issue.field === "title"));
});

test("rejects invalid category", () => {
  const validation = validateBusinessEventInput({
    ...sampleInput(),
    category: "not-a-category" as never,
  });
  assert.equal(validation.valid, false);
  assert.ok(validation.issues.some((issue) => issue.field === "category"));
});

test("rejects invalid type", () => {
  const validation = validateBusinessEventInput({
    ...sampleInput(),
    type: "not-a-type" as never,
  });
  assert.equal(validation.valid, false);
  assert.ok(validation.issues.some((issue) => issue.field === "type"));
});

test("rejects invalid importance", () => {
  const validation = validateBusinessEventInput({
    ...sampleInput(),
    importance: "urgent" as never,
  });
  assert.equal(validation.valid, false);
  assert.ok(validation.issues.some((issue) => issue.field === "importance"));
});

test("rejects invalid status", () => {
  const validation = validateBusinessEventInput({
    ...sampleInput(),
    status: "deleted" as never,
  });
  assert.equal(validation.valid, false);
  assert.ok(validation.issues.some((issue) => issue.field === "status"));
});

test("rejects invalid source", () => {
  const validation = validateBusinessEventInput({
    ...sampleInput(),
    source: "unknown-source" as never,
  });
  assert.equal(validation.valid, false);
  assert.ok(validation.issues.some((issue) => issue.field === "source"));
});

test("enforces workspace isolation", () => {
  createBusinessEvent({ ...sampleInput(), id: "business-event-ws-a", workspaceId: "ws-a" });
  createBusinessEvent({ ...sampleInput(), id: "business-event-ws-b", workspaceId: "ws-b" });
  assert.equal(getBusinessEventsByWorkspace("ws-a").length, 1);
  assert.equal(getBusinessEventsByWorkspace("ws-b").length, 1);
  assert.equal(getBusinessEventById("business-event-ws-a")?.workspaceId, "ws-a");
});

test("enforces append-only registry", () => {
  createBusinessEvent({ ...sampleInput(), id: "business-event-dup" });
  const duplicate = createBusinessEvent({ ...sampleInput(), id: "business-event-dup" });
  assert.equal(duplicate.success, false);
});

test("preserves stable event id across revisions", () => {
  createBusinessEvent({ ...sampleInput(), id: "business-event-stable" });
  const updated = updateBusinessEventMetadata({
    id: "business-event-stable",
    workspaceId: "ws-test-001",
    title: "Updated title",
  });
  assert.equal(updated.success, true);
  assert.equal(updated.data?.id, "business-event-stable");
  const history = getBusinessEventRevisionHistory("business-event-stable");
  assert.equal(history.length, 2);
  assert.equal(history[0]?.id, history[1]?.id);
});

test("increments revision version on metadata update", () => {
  createBusinessEvent({ ...sampleInput(), id: "business-event-version" });
  const first = updateBusinessEventMetadata({
    id: "business-event-version",
    workspaceId: "ws-test-001",
    description: "Updated description",
  });
  assert.equal(first.data?.revisionVersion, 2);
  const second = updateBusinessEventMetadata({
    id: "business-event-version",
    workspaceId: "ws-test-001",
    importance: "critical",
  });
  assert.equal(second.data?.revisionVersion, 3);
});

test("archives instead of deleting events", () => {
  createBusinessEvent({ ...sampleInput(), id: "business-event-archive" });
  const archived = archiveBusinessEvent("business-event-archive", "ws-test-001");
  assert.equal(archived.success, true);
  assert.equal(archived.data?.status, "archived");
  assert.equal(archived.data?.archived, true);
  assert.ok(getBusinessEventById("business-event-archive"));
});

test("filters by category", () => {
  createBusinessEvent({ ...sampleInput(), id: "evt-1", category: "financial" });
  createBusinessEvent({ ...sampleInput(), id: "evt-2", category: "product" });
  const filtered = filterBusinessEvents({ workspaceId: "ws-test-001", category: "financial" });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0]?.id, "evt-1");
});

test("filters by type", () => {
  createBusinessEvent({ ...sampleInput(), id: "evt-type-1", type: "milestone" });
  createBusinessEvent({ ...sampleInput(), id: "evt-type-2", type: "investment" });
  const filtered = filterBusinessEvents({ workspaceId: "ws-test-001", type: "investment" });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0]?.id, "evt-type-2");
});

test("filters by importance", () => {
  createBusinessEvent({ ...sampleInput(), id: "evt-imp-1", importance: "low" });
  createBusinessEvent({ ...sampleInput(), id: "evt-imp-2", importance: "critical" });
  const filtered = filterBusinessEvents({ workspaceId: "ws-test-001", importance: "critical" });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0]?.id, "evt-imp-2");
});

test("filters by status", () => {
  createBusinessEvent({ ...sampleInput(), id: "evt-status-1", status: "planned" });
  createBusinessEvent({ ...sampleInput(), id: "evt-status-2", status: "completed" });
  const filtered = filterBusinessEvents({ workspaceId: "ws-test-001", status: "planned" });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0]?.id, "evt-status-1");
});

test("filters by source", () => {
  createBusinessEvent({ ...sampleInput(), id: "evt-source-1", source: "manual" });
  createBusinessEvent({ ...sampleInput(), id: "evt-source-2", source: "api" });
  const filtered = filterBusinessEvents({ workspaceId: "ws-test-001", source: "api" });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0]?.id, "evt-source-2");
});

test("filters by tag", () => {
  createBusinessEvent({ ...sampleInput(), id: "evt-tag-1", tags: Object.freeze(["alpha"]) });
  createBusinessEvent({ ...sampleInput(), id: "evt-tag-2", tags: Object.freeze(["beta"]) });
  const filtered = filterBusinessEvents({ workspaceId: "ws-test-001", tags: Object.freeze(["beta"]) });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0]?.id, "evt-tag-2");
});

test("filters by occurredAt range", () => {
  createBusinessEvent({
    ...sampleInput(),
    id: "evt-date-1",
    occurredAt: "2026-01-01T00:00:00.000Z",
  });
  createBusinessEvent({
    ...sampleInput(),
    id: "evt-date-2",
    occurredAt: "2026-06-01T00:00:00.000Z",
  });
  const filtered = filterBusinessEvents({
    workspaceId: "ws-test-001",
    occurredAtFrom: "2026-02-01T00:00:00.000Z",
    occurredAtTo: "2026-12-31T23:59:59.999Z",
  });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0]?.id, "evt-date-2");
});

test("rejects forbidden field mutation via update input", () => {
  createBusinessEvent({ ...sampleInput(), id: "business-event-forbidden" });
  const wrongWorkspace = updateBusinessEventMetadata({
    id: "business-event-forbidden",
    workspaceId: "ws-other",
    title: "Cross workspace update",
  });
  assert.equal(wrongWorkspace.success, false);
});

test("normalizes business event input", () => {
  const normalized = normalizeBusinessEvent({
    ...sampleInput(),
    title: "  Trimmed title  ",
    tags: Object.freeze(["  tag-one  ", "tag-one"]),
  });
  assert.equal(normalized.title, "Trimmed title");
  assert.deepEqual(normalized.tags, ["tag-one"]);
});

test("maps engine events to APP-7:1 foundation contract", () => {
  const created = createBusinessEvent({ ...sampleInput(), id: "business-event-compat" });
  assert.equal(created.success, true);
  const foundationEvent = mapBusinessEngineEventToFoundationContract(created.data!);
  const shape = validateBusinessEventContractShape(foundationEvent);
  assert.equal(shape.valid, true, shape.issues.map((issue) => issue.message).join("; "));
  assert.equal(foundationEvent.version, BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION);
});

test("APP-7:1 compatibility validation passes", () => {
  const compatibility = validateFoundationCompatibilityForEngine(FIXED_TIME);
  assert.equal(compatibility.valid, true);
  assert.equal(BUSINESS_TIMELINE_PLATFORM_IDENTITY.appId, "APP-7");
});

test("certification runner passes all checks", () => {
  const certification = runBusinessEventEngineCertification();
  assert.equal(certification.status, "PASS", certification.checks.filter((entry) => !entry.passed).map((entry) => `${entry.id}: ${entry.evidence}`).join("; "));
  assert.equal(certification.certified, true);
  assert.equal(certification.score, 100);
});
