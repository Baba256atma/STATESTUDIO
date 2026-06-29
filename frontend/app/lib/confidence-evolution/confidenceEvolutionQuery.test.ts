import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  createConfidenceRecord,
  initializeConfidenceEvolutionEngine,
  resetConfidenceEvolutionEngineForTests,
} from "./confidenceEvolutionEngine.ts";
import { createConfidenceEvolutionFoundation } from "./confidenceEvolutionFoundation.ts";
import { resetConfidenceEvolutionPlatformForTests } from "./confidenceEvolutionRunner.ts";
import { orderConfidenceRecords } from "./confidenceEvolutionOrdering.ts";
import {
  getConfidenceEvolutionRange,
  getConfidenceEvolutionSummary,
  getConfidenceRecordsOrdered,
  initializeConfidenceEvolutionQueryLayer,
  queryConfidenceEvolution,
  resetConfidenceEvolutionQueryLayerForTests,
  validateConfidenceEvolutionQuery,
  CONFIDENCE_EVOLUTION_QUERY_SELF_MANIFEST,
} from "./confidenceEvolutionQuery.ts";
import { runConfidenceEvolutionQueryCertification } from "./confidenceEvolutionQueryRunner.ts";
import { CONFIDENCE_EVOLUTION_QUERY_CONTRACT_VERSION } from "./confidenceEvolutionQueryTypes.ts";
import { validateFoundationCompatibilityForQuery } from "./confidenceEvolutionQueryValidation.ts";
import { CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY } from "./confidenceEvolutionContracts.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-confidence-query-test-001";

function sampleRecord(id: string, overrides: Record<string, unknown> = {}) {
  return Object.freeze({
    id,
    workspaceId: WORKSPACE,
    title: `Confidence ${id}`,
    confidenceLevel: "medium" as const,
    confidenceScore: 0.62,
    source: "manual" as const,
    reason: "executive_review" as const,
    notes: "Query layer test record.",
    createdAt: FIXED_TIME,
    tags: Object.freeze(["test"]),
    ...overrides,
  });
}

function seedRecords() {
  createConfidenceRecord(
    sampleRecord("confidence-query-a", {
      updatedAt: "2026-06-01T00:00:00.000Z",
      createdAt: "2026-06-01T00:00:00.000Z",
      status: "active",
      confidenceLevel: "very_high",
      confidenceScore: 0.95,
      reason: "new_evidence",
    })
  );
  createConfidenceRecord(
    sampleRecord("confidence-query-b", {
      updatedAt: "2026-01-01T00:00:00.000Z",
      createdAt: "2026-01-02T00:00:00.000Z",
      status: "draft",
      confidenceLevel: "low",
      confidenceScore: 0.35,
      source: "api",
      reason: "manual_revision",
    })
  );
  createConfidenceRecord(
    sampleRecord("confidence-query-c", {
      updatedAt: "2026-01-01T00:00:00.000Z",
      createdAt: "2026-01-01T00:00:00.000Z",
      status: "archived",
      confidenceLevel: "high",
      confidenceScore: 0.82,
      reason: "risk_changed",
    })
  );
  createConfidenceRecord(
    sampleRecord("confidence-query-d", {
      updatedAt: "2026-02-01T00:00:00.000Z",
      createdAt: "2026-02-01T00:00:00.000Z",
      status: "reviewed",
      source: "workspace",
      confidenceScore: 0.72,
      reason: "scenario_completed",
      tags: Object.freeze(["beta"]),
    })
  );
  createConfidenceRecord(
    sampleRecord("confidence-query-other-ws", {
      workspaceId: "ws-confidence-query-test-002",
      updatedAt: "2026-12-01T00:00:00.000Z",
      confidenceScore: 0.5,
    })
  );
}

test.beforeEach(() => {
  resetConfidenceEvolutionQueryLayerForTests();
  resetConfidenceEvolutionEngineForTests();
  resetConfidenceEvolutionPlatformForTests();
  createConfidenceEvolutionFoundation(FIXED_TIME);
  initializeConfidenceEvolutionEngine(FIXED_TIME);
  initializeConfidenceEvolutionQueryLayer(FIXED_TIME);
});

test("validates stage manifest and architecture boundary", () => {
  const manifestValidation = validateStageManifest(CONFIDENCE_EVOLUTION_QUERY_SELF_MANIFEST);
  assert.equal(manifestValidation.valid, true, manifestValidation.issues.map((issue) => issue.message).join("; "));
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/confidence-evolution/confidenceEvolutionQuery.ts",
    allowedFiles: CONFIDENCE_EVOLUTION_QUERY_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: CONFIDENCE_EVOLUTION_QUERY_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("returns safe empty result for empty workspace", () => {
  const result = queryConfidenceEvolution({ workspaceId: "ws-empty" });
  assert.equal(result.success, true);
  assert.equal(result.data?.totalRecords, 0);
  assert.equal(result.data?.records.length, 0);
  assert.equal(result.data?.summary.firstRecordAt, null);
  assert.equal(result.data?.summary.lastRecordAt, null);
  assert.equal(result.data?.summary.averageConfidenceScore, null);
});

test("enforces workspace isolation", () => {
  seedRecords();
  const ws1 = queryConfidenceEvolution({ workspaceId: WORKSPACE });
  const ws2 = queryConfidenceEvolution({ workspaceId: "ws-confidence-query-test-002" });
  assert.equal(ws1.data?.totalRecords, 3);
  assert.equal(ws2.data?.totalRecords, 1);
});

test("orders records descending by default", () => {
  seedRecords();
  const result = queryConfidenceEvolution({ workspaceId: WORKSPACE });
  assert.equal(result.data?.ordering.direction, "desc");
  assert.equal(result.data?.records[0]?.id, "confidence-query-a");
});

test("orders records ascending when requested", () => {
  seedRecords();
  const result = queryConfidenceEvolution({ workspaceId: WORKSPACE, direction: "asc", includeArchived: true });
  assert.equal(result.data?.ordering.direction, "asc");
  assert.equal(result.data?.records[0]?.id, "confidence-query-c");
});

test("uses updatedAt as primary ordering key", () => {
  seedRecords();
  const records = getConfidenceRecordsOrdered({ workspaceId: WORKSPACE, direction: "asc", includeArchived: true });
  assert.equal(records[0]?.updatedAt, "2026-01-01T00:00:00.000Z");
  assert.equal(records[records.length - 1]?.updatedAt, "2026-06-01T00:00:00.000Z");
});

test("uses createdAt as secondary ordering key", () => {
  seedRecords();
  const records = getConfidenceRecordsOrdered({ workspaceId: WORKSPACE, direction: "asc", includeArchived: true });
  const tieRecords = records.filter((record) => record.updatedAt === "2026-01-01T00:00:00.000Z");
  assert.equal(tieRecords[0]?.id, "confidence-query-c");
  assert.equal(tieRecords[1]?.id, "confidence-query-b");
});

test("uses id as stable fallback ordering key", () => {
  const tieA = sampleRecord("confidence-tie-z", {
    updatedAt: "2026-03-01T00:00:00.000Z",
    createdAt: "2026-03-01T00:00:00.000Z",
  });
  const tieB = sampleRecord("confidence-tie-a", {
    updatedAt: "2026-03-01T00:00:00.000Z",
    createdAt: "2026-03-01T00:00:00.000Z",
  });
  createConfidenceRecord(tieA);
  createConfidenceRecord(tieB);
  const ordered = orderConfidenceRecords(
    getConfidenceRecordsOrdered({ workspaceId: WORKSPACE, includeArchived: true }),
    "asc"
  );
  const tieSlice = ordered.filter((record) => record.updatedAt === "2026-03-01T00:00:00.000Z");
  assert.equal(tieSlice[0]?.id, "confidence-tie-a");
  assert.equal(tieSlice[1]?.id, "confidence-tie-z");
});

test("filters by updatedAt range", () => {
  seedRecords();
  const range = getConfidenceEvolutionRange(
    WORKSPACE,
    "2026-02-01T00:00:00.000Z",
    "2026-12-31T23:59:59.999Z"
  );
  assert.equal(range.success, true);
  assert.equal(range.data?.totalRecords, 2);
  assert.ok(range.data?.records.some((record) => record.id === "confidence-query-a"));
  assert.ok(range.data?.records.some((record) => record.id === "confidence-query-d"));
});

test("filters by confidence level", () => {
  seedRecords();
  const result = queryConfidenceEvolution({ workspaceId: WORKSPACE, confidenceLevel: "very_high" });
  assert.equal(result.data?.totalRecords, 1);
  assert.equal(result.data?.records[0]?.id, "confidence-query-a");
});

test("filters by confidence score range", () => {
  seedRecords();
  const result = queryConfidenceEvolution({
    workspaceId: WORKSPACE,
    confidenceScoreMin: 0.7,
    confidenceScoreMax: 0.9,
    includeArchived: true,
  });
  assert.equal(result.data?.totalRecords, 2);
  assert.ok(result.data?.records.some((record) => record.id === "confidence-query-c"));
  assert.ok(result.data?.records.some((record) => record.id === "confidence-query-d"));
});

test("filters by source", () => {
  seedRecords();
  const result = queryConfidenceEvolution({ workspaceId: WORKSPACE, source: "api" });
  assert.equal(result.data?.totalRecords, 1);
  assert.equal(result.data?.records[0]?.id, "confidence-query-b");
});

test("filters by reason", () => {
  seedRecords();
  const result = queryConfidenceEvolution({ workspaceId: WORKSPACE, reason: "scenario_completed" });
  assert.equal(result.data?.totalRecords, 1);
  assert.equal(result.data?.records[0]?.id, "confidence-query-d");
});

test("filters by status", () => {
  seedRecords();
  const result = queryConfidenceEvolution({ workspaceId: WORKSPACE, status: "active" });
  assert.equal(result.data?.totalRecords, 1);
  assert.equal(result.data?.records[0]?.id, "confidence-query-a");
});

test("filters by tag", () => {
  seedRecords();
  const result = queryConfidenceEvolution({ workspaceId: WORKSPACE, tag: "beta" });
  assert.equal(result.data?.totalRecords, 1);
  assert.equal(result.data?.records[0]?.id, "confidence-query-d");
});

test("excludes archived records by default", () => {
  seedRecords();
  const result = queryConfidenceEvolution({ workspaceId: WORKSPACE });
  assert.equal(result.data?.includedArchived, false);
  assert.equal(result.data?.totalRecords, 3);
  assert.ok(result.data?.records.every((record) => !record.archived));
});

test("includes archived records when requested", () => {
  seedRecords();
  const result = queryConfidenceEvolution({ workspaceId: WORKSPACE, includeArchived: true });
  assert.equal(result.data?.totalRecords, 4);
  assert.ok(result.data?.records.some((record) => record.archived));
});

test("builds summary counts and distribution metadata", () => {
  seedRecords();
  const summary = getConfidenceEvolutionSummary({ workspaceId: WORKSPACE, includeArchived: true });
  assert.equal(summary.archivedCount, 1);
  assert.equal(summary.draftCount, 1);
  assert.equal(summary.reviewedCount, 1);
  assert.equal(summary.activeCount, 1);
  assert.equal(summary.confidenceLevelDistribution.very_high, 1);
  assert.equal(summary.sourceCounts.api, 1);
  assert.equal(summary.reasonCounts.risk_changed, 1);
});

test("builds confidence score statistics", () => {
  seedRecords();
  const summary = getConfidenceEvolutionSummary({ workspaceId: WORKSPACE, includeArchived: true });
  assert.equal(summary.minConfidenceScore, 0.35);
  assert.equal(summary.maxConfidenceScore, 0.95);
  assert.ok(summary.averageConfidenceScore !== null);
  assert.equal(summary.firstRecordAt, "2026-01-01T00:00:00.000Z");
  assert.equal(summary.lastRecordAt, "2026-06-01T00:00:00.000Z");
});

test("rejects invalid query input", () => {
  const validation = validateConfidenceEvolutionQuery({
    filters: Object.freeze({
      workspaceId: WORKSPACE,
      confidenceLevel: "invalid-level" as never,
    }),
  });
  assert.equal(validation.valid, false);
});

test("rejects invalid confidence score range", () => {
  const result = queryConfidenceEvolution({
    workspaceId: WORKSPACE,
    confidenceScoreMin: 0.9,
    confidenceScoreMax: 0.1,
  });
  assert.equal(result.success, false);
});

test("validates APP-9:1 and APP-9:2 compatibility", () => {
  assert.equal(validateFoundationCompatibilityForQuery(FIXED_TIME).valid, true);
});

test("query result is read-only and contract versioned", () => {
  seedRecords();
  const result = queryConfidenceEvolution({ workspaceId: WORKSPACE });
  assert.equal(result.data?.readOnly, true);
  assert.equal(result.data?.contractVersion, CONFIDENCE_EVOLUTION_QUERY_CONTRACT_VERSION);
});

test("runs confidence evolution query certification", () => {
  const result = runConfidenceEvolutionQueryCertification();
  assert.equal(result.certified, true);
  assert.equal(result.status, "PASS");
  assert.equal(result.score, 100);
  assert.ok(result.checks.length >= 18);
});

test("exports APP-9 platform identity unchanged", () => {
  assert.equal(CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId, "APP-9");
  assert.equal(CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.version, "APP-9/1");
});
