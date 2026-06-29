import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  createDecisionJournalEntry,
  getDecisionJournalEntryById,
  getDecisionJournalEntryRevisionHistory,
  resetDecisionJournalEngineForTests,
} from "./decisionJournalEngine.ts";
import { resetDecisionJournalPlatformForTests } from "./decisionJournalRunner.ts";
import { resetDecisionJournalQueryLayerForTests } from "./decisionJournalQuery.ts";
import { resetDecisionJournalReflectionLayerForTests } from "./decisionJournalReflection.ts";
import { resetDecisionJournalEvidenceAssumptionLayerForTests } from "./decisionJournalEvidenceAssumption.ts";
import { resetDecisionJournalRetrospectiveLayerForTests } from "./decisionJournalRetrospective.ts";
import { buildDecisionJournalReflectionModel } from "./decisionJournalReflection.ts";
import {
  createDecisionJournalApi,
  getDecisionJournalApi,
  getDecisionJournalApiManifest,
  resetDecisionJournalApiLayerForTests,
  validateDecisionJournalApiContract,
  validateDecisionJournalConsumerAccessRequest,
  DECISION_JOURNAL_API_SELF_MANIFEST,
} from "./decisionJournalApi.ts";
import { runDecisionJournalApiCertification } from "./decisionJournalApiRunner.ts";
import {
  DECISION_JOURNAL_API_CONTRACT_VERSION,
  DECISION_JOURNAL_API_GROUP_KEYS,
} from "./decisionJournalApiTypes.ts";
import { getDecisionJournalConsumerContract } from "./decisionJournalConsumerContracts.ts";
import { DECISION_JOURNAL_PLATFORM_IDENTITY } from "./decisionJournalContracts.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-api-test-001";

function sampleEntry(id: string) {
  return Object.freeze({
    id,
    workspaceId: WORKSPACE,
    title: `Journal ${id}`,
    summary: "API test entry.",
    rationale: "Executive rationale for API test.",
    expectedOutcome: "Validated API behavior.",
    confidence: "medium" as const,
    author: "test-runner",
    source: "manual" as const,
    createdAt: FIXED_TIME,
    tags: Object.freeze(["api-test"]),
  });
}

function bootstrap() {
  resetDecisionJournalApiLayerForTests();
  resetDecisionJournalRetrospectiveLayerForTests();
  resetDecisionJournalEvidenceAssumptionLayerForTests();
  resetDecisionJournalReflectionLayerForTests();
  resetDecisionJournalQueryLayerForTests();
  resetDecisionJournalEngineForTests();
  resetDecisionJournalPlatformForTests();
  createDecisionJournalApi(FIXED_TIME);
}

test.beforeEach(() => {
  bootstrap();
});

test("validates stage manifest and architecture boundary", () => {
  const manifestValidation = validateStageManifest(DECISION_JOURNAL_API_SELF_MANIFEST);
  assert.equal(
    manifestValidation.valid,
    true,
    manifestValidation.issues.map((issue) => issue.message).join("; ")
  );
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/decision-journal/decisionJournalApi.ts",
    allowedFiles: DECISION_JOURNAL_API_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: DECISION_JOURNAL_API_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("creates API facade with all groups", () => {
  const api = getDecisionJournalApi();
  assert.equal(api.version, DECISION_JOURNAL_API_CONTRACT_VERSION);
  for (const group of DECISION_JOURNAL_API_GROUP_KEYS) {
    assert.ok(group in api, group);
  }
});

test("entries API delegates to APP-8:2 safely", () => {
  const api = getDecisionJournalApi();
  const created = api.entries.createEntry(sampleEntry("api-entry-1"));
  assert.equal(created.success, true);
  const fetched = api.entries.getEntryById("api-entry-1");
  assert.equal(fetched.success, true);
  assert.equal(fetched.data?.id, "api-entry-1");
});

test("query API delegates to APP-8:3 safely", () => {
  const api = getDecisionJournalApi();
  api.entries.createEntry(sampleEntry("api-query-1"));
  const query = api.query.queryJournal({ workspaceId: WORKSPACE });
  assert.equal(query.success, true);
  assert.equal(query.data?.totalEntries, 1);
});

test("reflection API delegates to APP-8:4 safely", () => {
  const api = getDecisionJournalApi();
  api.entries.createEntry(sampleEntry("api-reflect-1"));
  const reflection = api.reflection.buildReflection({ workspaceId: WORKSPACE });
  assert.equal(reflection.success, true);
  assert.equal(reflection.data?.entryCount, 1);
});

test("quality API delegates to APP-8:5 safely", () => {
  const api = getDecisionJournalApi();
  api.entries.createEntry(sampleEntry("api-quality-1"));
  const quality = api.quality.buildEvidenceAssumptionModel({ workspaceId: WORKSPACE });
  assert.equal(quality.success, true);
  assert.equal(quality.data?.entryCount, 1);
});

test("retrospective API delegates to APP-8:6 safely", () => {
  const api = getDecisionJournalApi();
  api.entries.createEntry(sampleEntry("api-retro-1"));
  const retrospective = api.retrospective.buildRetrospectiveModel({ workspaceId: WORKSPACE });
  assert.equal(retrospective.success, true);
  assert.equal(retrospective.data?.entryCount, 1);
});

test("manifest is correct", () => {
  const manifest = getDecisionJournalApiManifest(FIXED_TIME);
  assert.equal(manifest.version, DECISION_JOURNAL_API_CONTRACT_VERSION);
  assert.equal(manifest.appId, "APP-8");
  assert.equal(manifest.availableApiGroups.length, 6);
  assert.equal(manifest.consumerCompatibility.length, 7);
  assert.ok(manifest.directImportGuardNotes.includes("APP-8:7"));
});

test("consumer contracts are created", () => {
  const dashboard = getDecisionJournalConsumerContract("DashboardConsumer");
  assert.ok(dashboard);
  assert.equal(dashboard?.readOnly, true);
  assert.equal(dashboard?.mutationAllowed, false);
});

test("workspace consumer has controlled write access", () => {
  const allowed = validateDecisionJournalConsumerAccessRequest({
    consumerId: "WorkspaceConsumer",
    apiGroup: "entries",
    operation: "createEntry",
    mutation: true,
  });
  assert.equal(allowed.valid, true);
});

test("dashboard consumer has read-only access", () => {
  const allowed = validateDecisionJournalConsumerAccessRequest({
    consumerId: "DashboardConsumer",
    apiGroup: "query",
    operation: "queryJournal",
    mutation: false,
  });
  assert.equal(allowed.valid, true);
});

test("assistant consumer has read-only access", () => {
  const allowed = validateDecisionJournalConsumerAccessRequest({
    consumerId: "AssistantConsumer",
    apiGroup: "reflection",
    operation: "buildReflection",
    mutation: false,
  });
  assert.equal(allowed.valid, true);
});

test("visualization consumer has read-only access", () => {
  const allowed = validateDecisionJournalConsumerAccessRequest({
    consumerId: "VisualizationConsumer",
    apiGroup: "query",
    operation: "getOrderedEntries",
    mutation: false,
  });
  assert.equal(allowed.valid, true);
});

test("report consumer has read-only access", () => {
  const allowed = validateDecisionJournalConsumerAccessRequest({
    consumerId: "ReportConsumer",
    apiGroup: "quality",
    operation: "detectQualityFlags",
    mutation: false,
  });
  assert.equal(allowed.valid, true);
});

test("export consumer has read-only access", () => {
  const allowed = validateDecisionJournalConsumerAccessRequest({
    consumerId: "ExportConsumer",
    apiGroup: "certification",
    operation: "runCertification",
    mutation: false,
  });
  assert.equal(allowed.valid, true);
});

test("forbidden API access is rejected", () => {
  const blocked = validateDecisionJournalConsumerAccessRequest({
    consumerId: "DashboardConsumer",
    apiGroup: "entries",
    operation: "createEntry",
    mutation: true,
  });
  assert.equal(blocked.valid, false);
});

test("invalid consumer is rejected", () => {
  const blocked = validateDecisionJournalConsumerAccessRequest({
    consumerId: "UnknownConsumer" as never,
    apiGroup: "query",
    operation: "queryJournal",
    mutation: false,
  });
  assert.equal(blocked.valid, false);
});

test("certification API works", () => {
  const api = getDecisionJournalApi();
  const certification = api.certification.runCertification();
  assert.equal(certification.success, true);
  assert.equal(certification.data?.status, "PASS");
});

test("does not mutate entries through read APIs", () => {
  createDecisionJournalEntry(sampleEntry("api-immutable"));
  const before = getDecisionJournalEntryById("api-immutable");
  const historyBefore = getDecisionJournalEntryRevisionHistory("api-immutable").length;
  const api = getDecisionJournalApi();
  api.query.queryJournal({ workspaceId: WORKSPACE });
  api.reflection.buildReflection({ workspaceId: WORKSPACE });
  api.quality.buildEvidenceAssumptionModel({ workspaceId: WORKSPACE });
  api.retrospective.buildRetrospectiveModel({ workspaceId: WORKSPACE });
  assert.deepEqual(getDecisionJournalEntryById("api-immutable"), before);
  assert.equal(getDecisionJournalEntryRevisionHistory("api-immutable").length, historyBefore);
});

test("does not mutate reflection through read APIs", () => {
  createDecisionJournalEntry(sampleEntry("api-reflect-immutable"));
  const before = buildDecisionJournalReflectionModel({ workspaceId: WORKSPACE });
  const api = getDecisionJournalApi();
  api.query.getSummary({ workspaceId: WORKSPACE });
  api.quality.detectQualityFlags({ workspaceId: WORKSPACE });
  const after = buildDecisionJournalReflectionModel({ workspaceId: WORKSPACE });
  assert.equal(JSON.stringify(before), JSON.stringify(after));
});

test("validates full API contract", () => {
  assert.equal(validateDecisionJournalApiContract().valid, true);
});

test("APP-8:1 through APP-8:6 compatibility preserved", () => {
  assert.equal(DECISION_JOURNAL_PLATFORM_IDENTITY.appId, "APP-8");
  assert.equal(validateDecisionJournalApiContract().valid, true);
});

test("certification runner passes all checks", () => {
  const certification = runDecisionJournalApiCertification();
  assert.equal(
    certification.status,
    "PASS",
    certification.checks.filter((entry) => !entry.passed).map((entry) => `${entry.id}: ${entry.evidence}`).join("; ")
  );
  assert.equal(certification.score, 100);
});
