import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  createBusinessEvent,
  getBusinessEventById,
  getBusinessEventRevisionHistory,
  initializeBusinessEventEngine,
  resetBusinessEventEngineForTests,
} from "./businessEventEngine.ts";
import { createBusinessTimelineFoundation } from "./businessTimelineFoundation.ts";
import { resetBusinessTimelinePlatformForTests } from "./businessTimelineRunner.ts";
import {
  initializeBusinessTimelineQueryLayer,
  queryBusinessTimeline,
  resetBusinessTimelineQueryLayerForTests,
} from "./businessTimelineQuery.ts";
import {
  buildBusinessLifecycleModel,
  initializeBusinessTimelineLifecycleLayer,
  resetBusinessTimelineLifecycleLayerForTests,
} from "./businessTimelineLifecycle.ts";
import {
  buildBusinessTimelineContextModel,
  getBusinessEventContext,
  getBusinessRelatedEvents,
  initializeBusinessTimelineContextLayer,
  resetBusinessTimelineContextLayerForTests,
  validateBusinessTimelineContextModel,
  BUSINESS_TIMELINE_CONTEXT_SELF_MANIFEST,
} from "./businessTimelineContext.ts";
import { runBusinessTimelineContextCertification } from "./businessTimelineContextRunner.ts";
import { BUSINESS_CONTEXT_CONFIDENCE_BOUNDS } from "./businessTimelineContextTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-context-test-001";

function sampleEvent(id: string, overrides: Record<string, unknown> = {}) {
  return Object.freeze({
    id,
    workspaceId: WORKSPACE,
    title: `Event ${id}`,
    description: "Context test event.",
    category: "product" as const,
    type: "milestone" as const,
    importance: "medium" as const,
    status: "completed" as const,
    source: "manual" as const,
    createdAt: FIXED_TIME,
    occurredAt: FIXED_TIME,
    createdBy: "test-runner",
    tags: Object.freeze(["shared-tag"]),
    ...overrides,
  });
}

function bootstrap() {
  resetBusinessTimelineContextLayerForTests();
  resetBusinessTimelineLifecycleLayerForTests();
  resetBusinessTimelineQueryLayerForTests();
  resetBusinessEventEngineForTests();
  resetBusinessTimelinePlatformForTests();
  createBusinessTimelineFoundation(FIXED_TIME);
  initializeBusinessEventEngine(FIXED_TIME);
  initializeBusinessTimelineQueryLayer(FIXED_TIME);
  initializeBusinessTimelineLifecycleLayer(FIXED_TIME);
  initializeBusinessTimelineContextLayer(FIXED_TIME);
}

test.beforeEach(() => {
  bootstrap();
});

test("validates stage manifest and architecture boundary", () => {
  const manifestValidation = validateStageManifest(BUSINESS_TIMELINE_CONTEXT_SELF_MANIFEST);
  assert.equal(manifestValidation.valid, true, manifestValidation.issues.map((issue) => issue.message).join("; "));
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/business-timeline/businessTimelineContext.ts",
    allowedFiles: BUSINESS_TIMELINE_CONTEXT_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: BUSINESS_TIMELINE_CONTEXT_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("returns safe empty context model for empty timeline", () => {
  const model = buildBusinessTimelineContextModel({ workspaceId: "ws-empty-context" });
  assert.equal(model.events.length, 0);
  assert.equal(model.relationships.length, 0);
  assert.equal(model.clusters.length, 0);
  assert.equal(validateBusinessTimelineContextModel(model).valid, true);
});

test("enforces workspace isolation", () => {
  createBusinessEvent(sampleEvent("ctx-ws-a", { workspaceId: WORKSPACE }));
  createBusinessEvent(sampleEvent("ctx-ws-b", { workspaceId: "ws-context-test-002" }));
  const modelA = buildBusinessTimelineContextModel({ workspaceId: WORKSPACE });
  const modelB = buildBusinessTimelineContextModel({ workspaceId: "ws-context-test-002" });
  assert.equal(modelA.summary.eventCount, 1);
  assert.equal(modelB.summary.eventCount, 1);
});

test("maps previous and next events deterministically", () => {
  createBusinessEvent(sampleEvent("ctx-prev", { occurredAt: "2020-01-01T00:00:00.000Z", category: "corporate", type: "milestone" }));
  createBusinessEvent(sampleEvent("ctx-mid", { occurredAt: "2021-01-01T00:00:00.000Z", category: "financial", type: "achievement" }));
  createBusinessEvent(sampleEvent("ctx-next", { occurredAt: "2022-01-01T00:00:00.000Z", type: "expansion" }));
  const context = getBusinessEventContext(buildBusinessTimelineContextModel({ workspaceId: WORKSPACE }), "ctx-mid");
  assert.equal(context?.previousEventId, "ctx-prev");
  assert.equal(context?.nextEventId, "ctx-next");
});

test("creates same-category relationships", () => {
  createBusinessEvent(sampleEvent("cat-a", { category: "legal", type: "policy" }));
  createBusinessEvent(sampleEvent("cat-b", { category: "legal", type: "milestone", occurredAt: "2021-01-01T00:00:00.000Z" }));
  const model = buildBusinessTimelineContextModel({ workspaceId: WORKSPACE });
  assert.ok(
    model.relationships.some(
      (relationship) =>
        relationship.relationshipType === "same-category" &&
        relationship.fromEventId === "cat-a" &&
        relationship.toEventId === "cat-b"
    )
  );
});

test("creates same-type relationships", () => {
  createBusinessEvent(sampleEvent("type-a", { type: "investment", category: "investment" }));
  createBusinessEvent(sampleEvent("type-b", { type: "investment", category: "financial", occurredAt: "2021-01-01T00:00:00.000Z" }));
  const model = buildBusinessTimelineContextModel({ workspaceId: WORKSPACE });
  assert.ok(model.relationships.some((relationship) => relationship.relationshipType === "same-type"));
});

test("creates same-tag relationships", () => {
  createBusinessEvent(sampleEvent("tag-a", { tags: Object.freeze(["alpha", "shared"]) }));
  createBusinessEvent(sampleEvent("tag-b", { tags: Object.freeze(["shared", "beta"]), occurredAt: "2021-01-01T00:00:00.000Z" }));
  const model = buildBusinessTimelineContextModel({ workspaceId: WORKSPACE });
  assert.ok(model.relationships.some((relationship) => relationship.relationshipType === "same-tag"));
});

test("creates same-lifecycle-phase relationships", () => {
  createBusinessEvent(sampleEvent("phase-a", { category: "corporate", type: "milestone", occurredAt: "2020-01-01T00:00:00.000Z" }));
  createBusinessEvent(sampleEvent("phase-b", { category: "corporate", type: "milestone", occurredAt: "2020-02-01T00:00:00.000Z" }));
  const model = buildBusinessTimelineContextModel({ workspaceId: WORKSPACE });
  assert.ok(model.relationships.some((relationship) => relationship.relationshipType === "same-lifecycle-phase"));
});

test("creates milestone-related relationships", () => {
  createBusinessEvent(sampleEvent("ms-main", { importance: "critical", category: "financial", type: "achievement" }));
  createBusinessEvent(sampleEvent("ms-other", { importance: "low", category: "other", type: "custom", occurredAt: "2021-01-01T00:00:00.000Z" }));
  const model = buildBusinessTimelineContextModel({ workspaceId: WORKSPACE });
  assert.ok(model.relationships.some((relationship) => relationship.relationshipType === "milestone-related"));
});

test("creates temporal proximity relationships", () => {
  createBusinessEvent(sampleEvent("time-a", { occurredAt: "2022-01-01T00:00:00.000Z", category: "technology", type: "technology" }));
  createBusinessEvent(sampleEvent("time-b", { occurredAt: "2022-02-01T00:00:00.000Z", category: "marketing", type: "custom" }));
  const model = buildBusinessTimelineContextModel({ workspaceId: WORKSPACE, proximityDays: 90 });
  assert.ok(model.relationships.some((relationship) => relationship.relationshipType === "temporal-proximity"));
});

test("creates possible cause and effect relationships", () => {
  createBusinessEvent(sampleEvent("cause-a", { category: "risk", type: "incident", occurredAt: "2022-01-01T00:00:00.000Z" }));
  createBusinessEvent(sampleEvent("effect-b", { category: "operations", type: "operational", occurredAt: "2022-02-01T00:00:00.000Z" }));
  const model = buildBusinessTimelineContextModel({ workspaceId: WORKSPACE, proximityDays: 90 });
  assert.ok(model.relationships.some((relationship) => relationship.relationshipType === "possible-cause"));
  assert.ok(model.relationships.some((relationship) => relationship.relationshipType === "possible-effect"));
});

test("creates context clusters with date bounds", () => {
  createBusinessEvent(sampleEvent("cluster-a", { occurredAt: "2020-01-01T00:00:00.000Z", category: "corporate", type: "milestone" }));
  createBusinessEvent(sampleEvent("cluster-b", { occurredAt: "2021-01-01T00:00:00.000Z", category: "financial", type: "achievement" }));
  const model = buildBusinessTimelineContextModel({ workspaceId: WORKSPACE });
  assert.ok(model.clusters.length >= 1);
  assert.ok(model.clusters.every((cluster) => cluster.startAt <= cluster.endAt));
});

test("detects dominant category and type in clusters", () => {
  createBusinessEvent(sampleEvent("dom-a", { category: "product", type: "milestone", occurredAt: "2020-01-01T00:00:00.000Z" }));
  createBusinessEvent(sampleEvent("dom-b", { category: "product", type: "achievement", occurredAt: "2020-02-01T00:00:00.000Z" }));
  const model = buildBusinessTimelineContextModel({ workspaceId: WORKSPACE });
  const cluster = model.clusters.find((entry) => entry.eventIds.includes("dom-a"));
  assert.equal(cluster?.dominantCategory, "product");
  assert.ok(cluster?.dominantType === "milestone" || cluster?.dominantType === "achievement");
});

test("maps event contexts with relationship and cluster ids", () => {
  createBusinessEvent(sampleEvent("map-a", { occurredAt: "2020-01-01T00:00:00.000Z" }));
  createBusinessEvent(sampleEvent("map-b", { occurredAt: "2021-01-01T00:00:00.000Z", category: "product", type: "achievement" }));
  const model = buildBusinessTimelineContextModel({ workspaceId: WORKSPACE });
  const context = getBusinessEventContext(model, "map-a");
  assert.ok(context);
  assert.ok(context.relationshipIds.length > 0);
  assert.ok(context.clusterIds.length > 0);
});

test("looks up related events", () => {
  createBusinessEvent(sampleEvent("rel-a", { category: "strategy", type: "milestone", tags: Object.freeze(["alpha"]), occurredAt: "2020-01-01T00:00:00.000Z" }));
  createBusinessEvent(sampleEvent("rel-gap", { category: "other", type: "custom", occurredAt: "2020-06-01T00:00:00.000Z" }));
  createBusinessEvent(sampleEvent("rel-b", { category: "strategy", type: "milestone", occurredAt: "2021-01-01T00:00:00.000Z", tags: Object.freeze(["alpha"]) }));
  const model = buildBusinessTimelineContextModel({ workspaceId: WORKSPACE });
  const related = getBusinessRelatedEvents(model, "rel-a");
  assert.ok(related.some((event) => event.id === "rel-b"));
});

test("keeps confidence values within bounds", () => {
  createBusinessEvent(sampleEvent("conf-a", { importance: "critical", occurredAt: "2020-01-01T00:00:00.000Z" }));
  createBusinessEvent(sampleEvent("conf-b", { occurredAt: "2020-02-01T00:00:00.000Z", category: "risk", type: "incident" }));
  const model = buildBusinessTimelineContextModel({ workspaceId: WORKSPACE });
  for (const value of [
    ...model.relationships.map((relationship) => relationship.confidence),
    ...model.clusters.map((cluster) => cluster.confidence),
    ...model.eventContexts.map((context) => context.confidence),
  ]) {
    assert.ok(value >= BUSINESS_CONTEXT_CONFIDENCE_BOUNDS.min);
    assert.ok(value <= BUSINESS_CONTEXT_CONFIDENCE_BOUNDS.max);
  }
});

test("does not mutate APP-7:2 events", () => {
  createBusinessEvent(sampleEvent("immutable-ctx", { importance: "critical" }));
  const before = getBusinessEventById("immutable-ctx");
  const historyBefore = getBusinessEventRevisionHistory("immutable-ctx").length;
  buildBusinessTimelineContextModel({ workspaceId: WORKSPACE });
  assert.deepEqual(getBusinessEventById("immutable-ctx"), before);
  assert.equal(getBusinessEventRevisionHistory("immutable-ctx").length, historyBefore);
});

test("does not mutate APP-7:4 lifecycle model", () => {
  createBusinessEvent(sampleEvent("life-a", { category: "corporate", type: "milestone" }));
  createBusinessEvent(sampleEvent("life-b", { category: "financial", type: "achievement", occurredAt: "2021-01-01T00:00:00.000Z" }));
  const before = buildBusinessLifecycleModel({ workspaceId: WORKSPACE });
  buildBusinessTimelineContextModel({ workspaceId: WORKSPACE });
  const after = buildBusinessLifecycleModel({ workspaceId: WORKSPACE });
  assert.equal(JSON.stringify(before), JSON.stringify(after));
});

test("APP-7:3 read-model compatibility", () => {
  createBusinessEvent(sampleEvent("q-a", { occurredAt: "2020-01-01T00:00:00.000Z" }));
  createBusinessEvent(sampleEvent("q-b", { occurredAt: "2021-01-01T00:00:00.000Z", type: "expansion" }));
  const query = queryBusinessTimeline({ workspaceId: WORKSPACE, direction: "asc" });
  const model = buildBusinessTimelineContextModel({ workspaceId: WORKSPACE });
  assert.equal(query.data?.events.length, model.events.length);
});

test("APP-7:4 lifecycle compatibility", () => {
  createBusinessEvent(sampleEvent("lc-a", { category: "corporate", type: "milestone" }));
  createBusinessEvent(sampleEvent("lc-b", { category: "risk", type: "incident", occurredAt: "2021-01-01T00:00:00.000Z" }));
  const lifecycle = buildBusinessLifecycleModel({ workspaceId: WORKSPACE });
  const model = buildBusinessTimelineContextModel({ workspaceId: WORKSPACE });
  assert.equal(model.clusters.length, lifecycle.segments.length);
});

test("certification runner passes all checks", () => {
  const certification = runBusinessTimelineContextCertification();
  assert.equal(
    certification.status,
    "PASS",
    certification.checks.filter((entry) => !entry.passed).map((entry) => `${entry.id}: ${entry.evidence}`).join("; ")
  );
  assert.equal(certification.certified, true);
  assert.equal(certification.score, 100);
});
