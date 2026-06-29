import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  createBusinessEvent,
  getBusinessEventById,
  getBusinessEventRevisionHistory,
  resetBusinessEventEngineForTests,
} from "./businessEventEngine.ts";
import { resetBusinessTimelinePlatformForTests } from "./businessTimelineRunner.ts";
import { resetBusinessTimelineQueryLayerForTests } from "./businessTimelineQuery.ts";
import { buildBusinessLifecycleModel, resetBusinessTimelineLifecycleLayerForTests } from "./businessTimelineLifecycle.ts";
import { resetBusinessTimelineContextLayerForTests } from "./businessTimelineContext.ts";
import {
  createBusinessTimelineApi,
  getBusinessTimelineApi,
  getBusinessTimelineApiManifest,
  resetBusinessTimelineApiLayerForTests,
  validateBusinessTimelineApiContract,
  validateBusinessTimelineConsumerAccessRequest,
  BUSINESS_TIMELINE_API_SELF_MANIFEST,
} from "./businessTimelineApi.ts";
import { runBusinessTimelineApiCertification } from "./businessTimelineApiRunner.ts";
import { BUSINESS_TIMELINE_API_CONTRACT_VERSION, BUSINESS_TIMELINE_API_GROUP_KEYS } from "./businessTimelineApiTypes.ts";
import { getBusinessTimelineConsumerContract } from "./businessTimelineConsumerContracts.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-api-test-001";

function sampleEvent(id: string) {
  return Object.freeze({
    id,
    workspaceId: WORKSPACE,
    title: `Event ${id}`,
    description: "API test event.",
    category: "product" as const,
    type: "milestone" as const,
    importance: "high" as const,
    status: "completed" as const,
    source: "manual" as const,
    createdAt: FIXED_TIME,
    occurredAt: FIXED_TIME,
    createdBy: "test-runner",
    tags: Object.freeze(["api-test"]),
  });
}

function bootstrap() {
  resetBusinessTimelineApiLayerForTests();
  resetBusinessTimelineContextLayerForTests();
  resetBusinessTimelineLifecycleLayerForTests();
  resetBusinessTimelineQueryLayerForTests();
  resetBusinessEventEngineForTests();
  resetBusinessTimelinePlatformForTests();
  createBusinessTimelineApi(FIXED_TIME);
}

test.beforeEach(() => {
  bootstrap();
});

test("validates stage manifest and architecture boundary", () => {
  const manifestValidation = validateStageManifest(BUSINESS_TIMELINE_API_SELF_MANIFEST);
  assert.equal(manifestValidation.valid, true, manifestValidation.issues.map((issue) => issue.message).join("; "));
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/business-timeline/businessTimelineApi.ts",
    allowedFiles: BUSINESS_TIMELINE_API_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: BUSINESS_TIMELINE_API_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("creates API facade with all groups", () => {
  const api = getBusinessTimelineApi();
  assert.equal(api.version, BUSINESS_TIMELINE_API_CONTRACT_VERSION);
  for (const group of BUSINESS_TIMELINE_API_GROUP_KEYS) {
    assert.ok(group in api, group);
  }
});

test("event API delegates to APP-7:2 safely", () => {
  const api = getBusinessTimelineApi();
  const created = api.events.createEvent(sampleEvent("api-event-1"));
  assert.equal(created.success, true);
  const fetched = api.events.getEventById("api-event-1");
  assert.equal(fetched.success, true);
  assert.equal(fetched.data?.id, "api-event-1");
});

test("query API delegates to APP-7:3 safely", () => {
  const api = getBusinessTimelineApi();
  api.events.createEvent(sampleEvent("api-query-1"));
  const query = api.query.queryTimeline({ workspaceId: WORKSPACE });
  assert.equal(query.success, true);
  assert.equal(query.data?.totalEvents, 1);
});

test("lifecycle API delegates to APP-7:4 safely", () => {
  const api = getBusinessTimelineApi();
  api.events.createEvent(sampleEvent("api-life-1"));
  const lifecycle = api.lifecycle.buildLifecycle({ workspaceId: WORKSPACE });
  assert.equal(lifecycle.success, true);
  assert.equal(lifecycle.data?.summary.eventCount, 1);
});

test("context API delegates to APP-7:5 safely", () => {
  const api = getBusinessTimelineApi();
  api.events.createEvent(sampleEvent("api-ctx-1"));
  const context = api.context.buildContextModel({ workspaceId: WORKSPACE });
  assert.equal(context.success, true);
  assert.equal(context.data?.summary.eventCount, 1);
});

test("manifest is correct", () => {
  const manifest = getBusinessTimelineApiManifest(FIXED_TIME);
  assert.equal(manifest.version, BUSINESS_TIMELINE_API_CONTRACT_VERSION);
  assert.equal(manifest.availableApiGroups.length, 5);
  assert.equal(manifest.consumerCompatibility.length, 7);
  assert.ok(manifest.directImportGuardNotes.includes("APP-7:6"));
});

test("consumer contracts are created", () => {
  const dashboard = getBusinessTimelineConsumerContract("DashboardConsumer");
  assert.ok(dashboard);
  assert.equal(dashboard?.readOnly, true);
  assert.equal(dashboard?.mutationAllowed, false);
});

test("dashboard consumer has read-only access", () => {
  const allowed = validateBusinessTimelineConsumerAccessRequest({
    consumerId: "DashboardConsumer",
    apiGroup: "query",
    operation: "queryTimeline",
    mutation: false,
  });
  assert.equal(allowed.valid, true);
});

test("assistant consumer has read-only access", () => {
  const allowed = validateBusinessTimelineConsumerAccessRequest({
    consumerId: "AssistantConsumer",
    apiGroup: "lifecycle",
    operation: "buildLifecycle",
    mutation: false,
  });
  assert.equal(allowed.valid, true);
});

test("visualization consumer has read-only access", () => {
  const allowed = validateBusinessTimelineConsumerAccessRequest({
    consumerId: "VisualizationConsumer",
    apiGroup: "context",
    operation: "buildContextModel",
    mutation: false,
  });
  assert.equal(allowed.valid, true);
});

test("report consumer has read-only access", () => {
  const allowed = validateBusinessTimelineConsumerAccessRequest({
    consumerId: "ReportConsumer",
    apiGroup: "query",
    operation: "getSummary",
    mutation: false,
  });
  assert.equal(allowed.valid, true);
});

test("workspace consumer has controlled write access", () => {
  const allowed = validateBusinessTimelineConsumerAccessRequest({
    consumerId: "WorkspaceConsumer",
    apiGroup: "events",
    operation: "createEvent",
    mutation: true,
  });
  assert.equal(allowed.valid, true);
});

test("forbidden API access is rejected", () => {
  const blocked = validateBusinessTimelineConsumerAccessRequest({
    consumerId: "DashboardConsumer",
    apiGroup: "events",
    operation: "createEvent",
    mutation: true,
  });
  assert.equal(blocked.valid, false);
});

test("invalid consumer is rejected", () => {
  const blocked = validateBusinessTimelineConsumerAccessRequest({
    consumerId: "UnknownConsumer" as never,
    apiGroup: "query",
    operation: "queryTimeline",
    mutation: false,
  });
  assert.equal(blocked.valid, false);
});

test("certification API works", () => {
  const api = getBusinessTimelineApi();
  const certification = api.certification.runCertification();
  assert.equal(certification.success, true);
  assert.equal(certification.data?.status, "PASS");
});

test("does not mutate events through read APIs", () => {
  createBusinessEvent(sampleEvent("api-immutable"));
  const before = getBusinessEventById("api-immutable");
  const historyBefore = getBusinessEventRevisionHistory("api-immutable").length;
  const api = getBusinessTimelineApi();
  api.query.queryTimeline({ workspaceId: WORKSPACE });
  api.lifecycle.buildLifecycle({ workspaceId: WORKSPACE });
  api.context.buildContextModel({ workspaceId: WORKSPACE });
  assert.deepEqual(getBusinessEventById("api-immutable"), before);
  assert.equal(getBusinessEventRevisionHistory("api-immutable").length, historyBefore);
});

test("does not mutate lifecycle through read APIs", () => {
  createBusinessEvent(sampleEvent("api-life-immutable"));
  const before = buildBusinessLifecycleModel({ workspaceId: WORKSPACE });
  const api = getBusinessTimelineApi();
  api.query.getSummary({ workspaceId: WORKSPACE });
  api.context.buildContextModel({ workspaceId: WORKSPACE });
  const after = buildBusinessLifecycleModel({ workspaceId: WORKSPACE });
  assert.equal(JSON.stringify(before), JSON.stringify(after));
});

test("validates full API contract", () => {
  assert.equal(validateBusinessTimelineApiContract().valid, true);
});

test("certification runner passes all checks", () => {
  const certification = runBusinessTimelineApiCertification();
  assert.equal(
    certification.status,
    "PASS",
    certification.checks.filter((entry) => !entry.passed).map((entry) => `${entry.id}: ${entry.evidence}`).join("; ")
  );
  assert.equal(certification.score, 100);
});
