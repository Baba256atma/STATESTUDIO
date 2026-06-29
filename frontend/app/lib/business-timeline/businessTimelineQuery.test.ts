import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  createBusinessEvent,
  initializeBusinessEventEngine,
  resetBusinessEventEngineForTests,
} from "./businessEventEngine.ts";
import { createBusinessTimelineFoundation } from "./businessTimelineFoundation.ts";
import { resetBusinessTimelinePlatformForTests } from "./businessTimelineRunner.ts";
import { orderBusinessTimelineEvents } from "./businessTimelineOrdering.ts";
import {
  getBusinessTimelineOrderedEvents,
  getBusinessTimelineRange,
  getBusinessTimelineSummary,
  initializeBusinessTimelineQueryLayer,
  queryBusinessTimeline,
  resetBusinessTimelineQueryLayerForTests,
  validateBusinessTimelineQuery,
  BUSINESS_TIMELINE_QUERY_SELF_MANIFEST,
} from "./businessTimelineQuery.ts";
import { runBusinessTimelineQueryCertification } from "./businessTimelineQueryRunner.ts";
import { BUSINESS_TIMELINE_QUERY_CONTRACT_VERSION } from "./businessTimelineQueryTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-query-test-001";

function sampleEvent(
  id: string,
  overrides: Record<string, unknown> = {}
) {
  return Object.freeze({
    id,
    workspaceId: WORKSPACE,
    title: `Event ${id}`,
    description: "Query layer test event.",
    category: "corporate" as const,
    type: "milestone" as const,
    importance: "medium" as const,
    status: "completed" as const,
    source: "manual" as const,
    createdAt: FIXED_TIME,
    occurredAt: FIXED_TIME,
    createdBy: "test-runner",
    tags: Object.freeze(["test"]),
    ...overrides,
  });
}

function seedEvents() {
  createBusinessEvent(
    sampleEvent("query-evt-a", {
      occurredAt: "2026-06-01T00:00:00.000Z",
      createdAt: "2026-06-01T00:00:00.000Z",
      category: "product",
      type: "milestone",
      importance: "critical",
    })
  );
  createBusinessEvent(
    sampleEvent("query-evt-b", {
      occurredAt: "2026-01-01T00:00:00.000Z",
      createdAt: "2026-01-02T00:00:00.000Z",
      category: "financial",
      type: "investment",
      importance: "high",
    })
  );
  createBusinessEvent(
    sampleEvent("query-evt-c", {
      occurredAt: "2026-01-01T00:00:00.000Z",
      createdAt: "2026-01-01T00:00:00.000Z",
      category: "operations",
      type: "incident",
      status: "archived",
    })
  );
  createBusinessEvent(
    sampleEvent("query-evt-other-ws", {
      workspaceId: "ws-query-test-002",
      occurredAt: "2026-12-01T00:00:00.000Z",
    })
  );
}

test.beforeEach(() => {
  resetBusinessTimelineQueryLayerForTests();
  resetBusinessEventEngineForTests();
  resetBusinessTimelinePlatformForTests();
  createBusinessTimelineFoundation(FIXED_TIME);
  initializeBusinessEventEngine(FIXED_TIME);
  initializeBusinessTimelineQueryLayer(FIXED_TIME);
});

test("validates stage manifest and architecture boundary", () => {
  const manifestValidation = validateStageManifest(BUSINESS_TIMELINE_QUERY_SELF_MANIFEST);
  assert.equal(manifestValidation.valid, true, manifestValidation.issues.map((issue) => issue.message).join("; "));
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/business-timeline/businessTimelineQuery.ts",
    allowedFiles: BUSINESS_TIMELINE_QUERY_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: BUSINESS_TIMELINE_QUERY_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("returns safe empty result for empty workspace", () => {
  const result = queryBusinessTimeline({ workspaceId: "ws-empty" });
  assert.equal(result.success, true);
  assert.equal(result.data?.totalEvents, 0);
  assert.equal(result.data?.events.length, 0);
  assert.equal(result.data?.summary.firstEventAt, null);
  assert.equal(result.data?.summary.lastEventAt, null);
});

test("enforces workspace isolation", () => {
  seedEvents();
  const ws1 = queryBusinessTimeline({ workspaceId: WORKSPACE });
  const ws2 = queryBusinessTimeline({ workspaceId: "ws-query-test-002" });
  assert.equal(ws1.data?.totalEvents, 2);
  assert.equal(ws2.data?.totalEvents, 1);
});

test("orders events descending by default", () => {
  seedEvents();
  const result = queryBusinessTimeline({ workspaceId: WORKSPACE });
  assert.equal(result.data?.direction, "desc");
  assert.equal(result.data?.events[0]?.id, "query-evt-a");
});

test("orders events ascending when requested", () => {
  seedEvents();
  const result = queryBusinessTimeline({ workspaceId: WORKSPACE, direction: "asc" });
  assert.equal(result.data?.direction, "asc");
  assert.equal(result.data?.events[0]?.id, "query-evt-b");
});

test("uses occurredAt as primary ordering key", () => {
  seedEvents();
  const events = getBusinessTimelineOrderedEvents({ workspaceId: WORKSPACE, direction: "asc" });
  assert.equal(events[0]?.occurredAt, "2026-01-01T00:00:00.000Z");
  assert.equal(events[events.length - 1]?.occurredAt, "2026-06-01T00:00:00.000Z");
});

test("uses createdAt as secondary ordering key", () => {
  seedEvents();
  const events = getBusinessTimelineOrderedEvents({ workspaceId: WORKSPACE, direction: "asc", includeArchived: true });
  const tieEvents = events.filter((event) => event.occurredAt === "2026-01-01T00:00:00.000Z");
  assert.equal(tieEvents[0]?.id, "query-evt-c");
  assert.equal(tieEvents[1]?.id, "query-evt-b");
});

test("uses id as stable fallback ordering key", () => {
  const tieA = sampleEvent("query-tie-z", {
    occurredAt: "2026-02-01T00:00:00.000Z",
    createdAt: "2026-02-01T00:00:00.000Z",
  });
  const tieB = sampleEvent("query-tie-a", {
    occurredAt: "2026-02-01T00:00:00.000Z",
    createdAt: "2026-02-01T00:00:00.000Z",
  });
  createBusinessEvent(tieA);
  createBusinessEvent(tieB);
  const ordered = orderBusinessTimelineEvents(
    getBusinessTimelineOrderedEvents({ workspaceId: WORKSPACE, includeArchived: true }),
    "asc"
  );
  const tieSlice = ordered.filter((event) => event.occurredAt === "2026-02-01T00:00:00.000Z");
  assert.equal(tieSlice[0]?.id, "query-tie-a");
  assert.equal(tieSlice[1]?.id, "query-tie-z");
});

test("filters by occurredAt range", () => {
  seedEvents();
  const range = getBusinessTimelineRange(
    WORKSPACE,
    "2026-02-01T00:00:00.000Z",
    "2026-12-31T23:59:59.999Z"
  );
  assert.equal(range.success, true);
  assert.equal(range.data?.totalEvents, 1);
  assert.equal(range.data?.events[0]?.id, "query-evt-a");
});

test("filters by category", () => {
  seedEvents();
  const result = queryBusinessTimeline({ workspaceId: WORKSPACE, category: "financial" });
  assert.equal(result.data?.totalEvents, 1);
  assert.equal(result.data?.events[0]?.id, "query-evt-b");
});

test("filters by type", () => {
  seedEvents();
  const result = queryBusinessTimeline({ workspaceId: WORKSPACE, type: "milestone" });
  assert.equal(result.data?.totalEvents, 1);
  assert.equal(result.data?.events[0]?.id, "query-evt-a");
});

test("filters by importance", () => {
  seedEvents();
  const result = queryBusinessTimeline({ workspaceId: WORKSPACE, importance: "critical" });
  assert.equal(result.data?.totalEvents, 1);
  assert.equal(result.data?.events[0]?.id, "query-evt-a");
});

test("filters by status", () => {
  seedEvents();
  const result = queryBusinessTimeline({ workspaceId: WORKSPACE, status: "completed" });
  assert.equal(result.data?.totalEvents, 2);
});

test("filters by source", () => {
  seedEvents();
  createBusinessEvent(sampleEvent("query-evt-api", { source: "api" }));
  const result = queryBusinessTimeline({ workspaceId: WORKSPACE, source: "api" });
  assert.equal(result.data?.totalEvents, 1);
  assert.equal(result.data?.events[0]?.id, "query-evt-api");
});

test("filters by tag", () => {
  seedEvents();
  createBusinessEvent(sampleEvent("query-evt-tagged", { tags: Object.freeze(["special"]) }));
  const result = queryBusinessTimeline({ workspaceId: WORKSPACE, tags: Object.freeze(["special"]) });
  assert.equal(result.data?.totalEvents, 1);
  assert.equal(result.data?.events[0]?.id, "query-evt-tagged");
});

test("excludes archived events by default", () => {
  seedEvents();
  const result = queryBusinessTimeline({ workspaceId: WORKSPACE });
  assert.equal(result.data?.includedArchived, false);
  assert.equal(result.data?.totalEvents, 2);
  assert.ok(result.data?.events.every((event) => !event.archived));
});

test("includes archived events when includeArchived is true", () => {
  seedEvents();
  const result = queryBusinessTimeline({ workspaceId: WORKSPACE, includeArchived: true });
  assert.equal(result.data?.includedArchived, true);
  assert.equal(result.data?.totalEvents, 3);
});

test("summary exposes firstEventAt and lastEventAt", () => {
  seedEvents();
  const summary = getBusinessTimelineSummary({ workspaceId: WORKSPACE, includeArchived: true });
  assert.equal(summary.firstEventAt, "2026-01-01T00:00:00.000Z");
  assert.equal(summary.lastEventAt, "2026-06-01T00:00:00.000Z");
});

test("summary exposes critical high and archived counts", () => {
  seedEvents();
  const summary = getBusinessTimelineSummary({ workspaceId: WORKSPACE, includeArchived: true });
  assert.equal(summary.criticalCount, 1);
  assert.equal(summary.highCount, 1);
  assert.equal(summary.archivedCount, 1);
});

test("summary exposes categoryCounts and typeCounts", () => {
  seedEvents();
  const summary = getBusinessTimelineSummary({ workspaceId: WORKSPACE, includeArchived: true });
  assert.equal(summary.categoryCounts.product, 1);
  assert.equal(summary.categoryCounts.financial, 1);
  assert.equal(summary.typeCounts.milestone, 1);
  assert.equal(summary.typeCounts.investment, 1);
});

test("rejects invalid query input", () => {
  const validation = validateBusinessTimelineQuery({
    filters: Object.freeze({ workspaceId: WORKSPACE, category: "invalid-category" as never }),
  });
  assert.equal(validation.valid, false);
});

test("query result contract includes required metadata", () => {
  seedEvents();
  const result = queryBusinessTimeline({ workspaceId: WORKSPACE });
  assert.ok(result.data);
  assert.equal(result.data.contractVersion, BUSINESS_TIMELINE_QUERY_CONTRACT_VERSION);
  assert.equal(result.data.orderedBy, "occurredAt");
  assert.equal(result.data.readOnly, true);
  assert.equal(result.data.totalEvents, result.data.events.length);
});

test("APP-7:2 compatibility through read-only event access", () => {
  seedEvents();
  const result = queryBusinessTimeline({ workspaceId: WORKSPACE, includeArchived: true });
  assert.equal(result.success, true);
  for (const event of result.data?.events ?? []) {
    assert.equal(event.readOnly, true);
    assert.ok(event.revisionVersion >= 1);
  }
});

test("certification runner passes all checks", () => {
  const certification = runBusinessTimelineQueryCertification();
  assert.equal(
    certification.status,
    "PASS",
    certification.checks.filter((entry) => !entry.passed).map((entry) => `${entry.id}: ${entry.evidence}`).join("; ")
  );
  assert.equal(certification.certified, true);
  assert.equal(certification.score, 100);
});
