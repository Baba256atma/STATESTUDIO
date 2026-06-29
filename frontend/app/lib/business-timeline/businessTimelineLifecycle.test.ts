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
  classifyBusinessLifecycleSegments,
  extractBusinessMilestones,
  getBusinessLifecycleSummary,
  initializeBusinessTimelineLifecycleLayer,
  mapEventsToLifecycle,
  resetBusinessTimelineLifecycleLayerForTests,
  validateBusinessLifecycleModel,
  BUSINESS_TIMELINE_LIFECYCLE_SELF_MANIFEST,
} from "./businessTimelineLifecycle.ts";
import { classifyEventLifecyclePhase } from "./businessTimelineLifecycleRules.ts";
import { runBusinessTimelineLifecycleCertification } from "./businessTimelineLifecycleRunner.ts";
import { BUSINESS_LIFECYCLE_CONFIDENCE_BOUNDS } from "./businessTimelineLifecycleTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-lifecycle-test-001";

function sampleEvent(id: string, overrides: Record<string, unknown> = {}) {
  return Object.freeze({
    id,
    workspaceId: WORKSPACE,
    title: `Event ${id}`,
    description: "Lifecycle test event.",
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

function bootstrap() {
  resetBusinessTimelineLifecycleLayerForTests();
  resetBusinessTimelineQueryLayerForTests();
  resetBusinessEventEngineForTests();
  resetBusinessTimelinePlatformForTests();
  createBusinessTimelineFoundation(FIXED_TIME);
  initializeBusinessEventEngine(FIXED_TIME);
  initializeBusinessTimelineQueryLayer(FIXED_TIME);
  initializeBusinessTimelineLifecycleLayer(FIXED_TIME);
}

test.beforeEach(() => {
  bootstrap();
});

test("validates stage manifest and architecture boundary", () => {
  const manifestValidation = validateStageManifest(BUSINESS_TIMELINE_LIFECYCLE_SELF_MANIFEST);
  assert.equal(manifestValidation.valid, true, manifestValidation.issues.map((issue) => issue.message).join("; "));
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/business-timeline/businessTimelineLifecycle.ts",
    allowedFiles: BUSINESS_TIMELINE_LIFECYCLE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: BUSINESS_TIMELINE_LIFECYCLE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("returns safe empty lifecycle model for empty timeline", () => {
  const model = buildBusinessLifecycleModel({ workspaceId: "ws-empty-lifecycle" });
  assert.equal(model.segments.length, 0);
  assert.equal(model.milestones.length, 0);
  assert.equal(model.summary.eventCount, 0);
  assert.equal(validateBusinessLifecycleModel(model).valid, true);
});

test("enforces workspace isolation", () => {
  createBusinessEvent(sampleEvent("lifecycle-ws-a", { workspaceId: WORKSPACE }));
  createBusinessEvent(sampleEvent("lifecycle-ws-b", { workspaceId: "ws-lifecycle-test-002" }));
  const modelA = buildBusinessLifecycleModel({ workspaceId: WORKSPACE });
  const modelB = buildBusinessLifecycleModel({ workspaceId: "ws-lifecycle-test-002" });
  assert.equal(modelA.summary.eventCount, 1);
  assert.equal(modelB.summary.eventCount, 1);
});

test("creates lifecycle segments from ordered events", () => {
  createBusinessEvent(sampleEvent("seg-1", { occurredAt: "2020-01-01T00:00:00.000Z", category: "corporate", type: "milestone" }));
  createBusinessEvent(sampleEvent("seg-2", { occurredAt: "2021-01-01T00:00:00.000Z", category: "financial", type: "achievement" }));
  const model = buildBusinessLifecycleModel({ workspaceId: WORKSPACE });
  assert.ok(model.segments.length >= 2);
});

test("classifies founding phase", () => {
  createBusinessEvent(sampleEvent("founding-1", { category: "corporate", type: "milestone" }));
  const model = buildBusinessLifecycleModel({ workspaceId: WORKSPACE });
  assert.ok(model.segments.some((segment) => segment.phase === "founding"));
});

test("classifies growth phase", () => {
  createBusinessEvent(sampleEvent("growth-1", { category: "financial", type: "achievement" }));
  const model = buildBusinessLifecycleModel({ workspaceId: WORKSPACE });
  assert.ok(model.segments.some((segment) => segment.phase === "growth"));
});

test("classifies expansion phase", () => {
  createBusinessEvent(sampleEvent("expansion-1", { type: "expansion", category: "strategy" }));
  const model = buildBusinessLifecycleModel({ workspaceId: WORKSPACE });
  assert.ok(model.segments.some((segment) => segment.phase === "expansion"));
});

test("classifies transformation phase", () => {
  createBusinessEvent(sampleEvent("transform-1", { type: "transformation", category: "strategy" }));
  const model = buildBusinessLifecycleModel({ workspaceId: WORKSPACE });
  assert.ok(model.segments.some((segment) => segment.phase === "transformation"));
});

test("classifies crisis phase", () => {
  createBusinessEvent(sampleEvent("crisis-1", { type: "incident", category: "risk" }));
  const model = buildBusinessLifecycleModel({ workspaceId: WORKSPACE });
  assert.ok(model.segments.some((segment) => segment.phase === "crisis"));
});

test("classifies recovery phase", () => {
  createBusinessEvent(sampleEvent("recovery-1", { category: "risk", type: "achievement" }));
  const model = buildBusinessLifecycleModel({ workspaceId: WORKSPACE });
  assert.ok(model.segments.some((segment) => segment.phase === "recovery"));
});

test("classifies stabilization phase", () => {
  createBusinessEvent(sampleEvent("stable-1", { category: "operations", type: "operational" }));
  const model = buildBusinessLifecycleModel({ workspaceId: WORKSPACE });
  assert.ok(model.segments.some((segment) => segment.phase === "stabilization"));
});

test("falls back to unknown phase", () => {
  createBusinessEvent(sampleEvent("unknown-1", { category: "other", type: "custom" }));
  const model = buildBusinessLifecycleModel({ workspaceId: WORKSPACE });
  assert.ok(model.segments.some((segment) => segment.phase === "unknown"));
});

test("extracts milestones by importance", () => {
  createBusinessEvent(sampleEvent("imp-critical", { importance: "critical", category: "other", type: "custom" }));
  createBusinessEvent(sampleEvent("imp-low", { importance: "low", category: "other", type: "custom" }));
  const model = buildBusinessLifecycleModel({ workspaceId: WORKSPACE });
  assert.ok(model.milestones.some((entry) => entry.eventId === "imp-critical"));
  assert.ok(model.milestones.every((entry) => entry.eventId !== "imp-low"));
});

test("extracts milestones by category", () => {
  createBusinessEvent(sampleEvent("cat-product", { category: "product", type: "custom", importance: "low" }));
  const model = buildBusinessLifecycleModel({ workspaceId: WORKSPACE });
  assert.ok(model.milestones.some((entry) => entry.eventId === "cat-product"));
});

test("extracts milestones by type", () => {
  createBusinessEvent(sampleEvent("type-acq", { type: "acquisition", category: "other", importance: "low" }));
  const model = buildBusinessLifecycleModel({ workspaceId: WORKSPACE });
  assert.ok(model.milestones.some((entry) => entry.eventId === "type-acq"));
});

test("extracts milestones from manual metadata flag", () => {
  createBusinessEvent(
    sampleEvent("manual-ms", {
      category: "other",
      type: "custom",
      importance: "low",
      metadata: Object.freeze({ manualMilestone: "true" }),
    })
  );
  const model = buildBusinessLifecycleModel({ workspaceId: WORKSPACE });
  const milestone = model.milestones.find((entry) => entry.eventId === "manual-ms");
  assert.ok(milestone);
  assert.equal(milestone?.metadata.manual, true);
});

test("maps events to lifecycle phases", () => {
  createBusinessEvent(sampleEvent("map-1", { type: "reduction", category: "operations" }));
  const query = queryBusinessTimeline({ workspaceId: WORKSPACE, direction: "asc" });
  const mappings = mapEventsToLifecycle(query.data!.events);
  assert.equal(mappings[0]?.phase, "decline");
});

test("maps events to milestones via lifecycle model", () => {
  createBusinessEvent(sampleEvent("ms-map", { importance: "high", category: "legal", type: "policy" }));
  const model = buildBusinessLifecycleModel({ workspaceId: WORKSPACE });
  assert.ok(model.milestones.some((entry) => entry.eventId === "ms-map"));
});

test("lifecycle summary counts are accurate", () => {
  createBusinessEvent(sampleEvent("sum-1", { category: "corporate", type: "milestone", importance: "critical" }));
  createBusinessEvent(sampleEvent("sum-2", { category: "financial", type: "achievement", importance: "high" }));
  const summary = getBusinessLifecycleSummary({ workspaceId: WORKSPACE });
  assert.equal(summary.eventCount, 2);
  assert.equal(summary.milestoneCount, 2);
  assert.ok(summary.segmentCount >= 1);
});

test("confidence values stay within bounds", () => {
  createBusinessEvent(sampleEvent("conf-1", { category: "corporate", type: "milestone", importance: "critical" }));
  createBusinessEvent(sampleEvent("conf-2", { category: "other", type: "custom" }));
  const model = buildBusinessLifecycleModel({ workspaceId: WORKSPACE });
  for (const value of [
    ...model.segments.map((segment) => segment.confidence),
    ...model.milestones.map((milestone) => milestone.confidence),
    ...model.eventMappings.map((mapping) => mapping.confidence),
  ]) {
    assert.ok(value >= BUSINESS_LIFECYCLE_CONFIDENCE_BOUNDS.min);
    assert.ok(value <= BUSINESS_LIFECYCLE_CONFIDENCE_BOUNDS.max);
  }
});

test("does not mutate APP-7:2 events", () => {
  createBusinessEvent(sampleEvent("immutable-1", { importance: "critical" }));
  const before = getBusinessEventById("immutable-1");
  const historyBefore = getBusinessEventRevisionHistory("immutable-1").length;
  buildBusinessLifecycleModel({ workspaceId: WORKSPACE });
  const after = getBusinessEventById("immutable-1");
  const historyAfter = getBusinessEventRevisionHistory("immutable-1").length;
  assert.deepEqual(before, after);
  assert.equal(historyBefore, historyAfter);
});

test("APP-7:3 read-model compatibility", () => {
  createBusinessEvent(sampleEvent("query-compat-1", { occurredAt: "2022-01-01T00:00:00.000Z", type: "expansion" }));
  createBusinessEvent(sampleEvent("query-compat-2", { occurredAt: "2023-01-01T00:00:00.000Z", type: "incident", category: "risk" }));
  const query = queryBusinessTimeline({ workspaceId: WORKSPACE, direction: "asc" });
  const segments = classifyBusinessLifecycleSegments(query.data!.events);
  const milestones = extractBusinessMilestones(query.data!.events);
  assert.equal(segments.length, 2);
  assert.ok(milestones.length >= 1);
});

test("classifies decline phase", () => {
  createBusinessEvent(sampleEvent("decline-1", { type: "reduction", category: "operations" }));
  assert.equal(classifyEventLifecyclePhase(getBusinessEventById("decline-1")!).phase, "decline");
});

test("classifies early-growth phase", () => {
  createBusinessEvent(sampleEvent("early-1", { category: "product", type: "achievement" }));
  assert.equal(classifyEventLifecyclePhase(getBusinessEventById("early-1")!).phase, "early-growth");
});

test("certification runner passes all checks", () => {
  const certification = runBusinessTimelineLifecycleCertification();
  assert.equal(
    certification.status,
    "PASS",
    certification.checks.filter((entry) => !entry.passed).map((entry) => `${entry.id}: ${entry.evidence}`).join("; ")
  );
  assert.equal(certification.certified, true);
  assert.equal(certification.score, 100);
});
