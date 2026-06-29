import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  createDecisionJournalEntry,
  initializeDecisionJournalEngine,
  resetDecisionJournalEngineForTests,
} from "./decisionJournalEngine.ts";
import { createDecisionJournalFoundation } from "./decisionJournalFoundation.ts";
import { resetDecisionJournalPlatformForTests } from "./decisionJournalRunner.ts";
import { orderDecisionJournalEntries } from "./decisionJournalOrdering.ts";
import {
  getDecisionJournalEntriesOrdered,
  getDecisionJournalRange,
  getDecisionJournalSummary,
  initializeDecisionJournalQueryLayer,
  queryDecisionJournal,
  resetDecisionJournalQueryLayerForTests,
  validateDecisionJournalQuery,
  DECISION_JOURNAL_QUERY_SELF_MANIFEST,
} from "./decisionJournalQuery.ts";
import { runDecisionJournalQueryCertification } from "./decisionJournalQueryRunner.ts";
import { DECISION_JOURNAL_QUERY_CONTRACT_VERSION } from "./decisionJournalQueryTypes.ts";
import { validateFoundationCompatibilityForQuery } from "./decisionJournalQueryValidation.ts";
import { DECISION_JOURNAL_PLATFORM_IDENTITY } from "./decisionJournalContracts.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-journal-query-test-001";

function sampleEntry(id: string, overrides: Record<string, unknown> = {}) {
  return Object.freeze({
    id,
    workspaceId: WORKSPACE,
    title: `Journal ${id}`,
    summary: "Query layer test entry.",
    rationale: "Executive rationale for query test.",
    expectedOutcome: "Validated query behavior.",
    confidence: "medium" as const,
    author: "test-runner",
    source: "manual" as const,
    createdAt: FIXED_TIME,
    tags: Object.freeze(["test"]),
    ...overrides,
  });
}

function seedEntries() {
  createDecisionJournalEntry(
    sampleEntry("journal-query-a", {
      updatedAt: "2026-06-01T00:00:00.000Z",
      createdAt: "2026-06-01T00:00:00.000Z",
      status: "active",
      confidence: "very_high",
      author: "author-alpha",
    })
  );
  createDecisionJournalEntry(
    sampleEntry("journal-query-b", {
      updatedAt: "2026-01-01T00:00:00.000Z",
      createdAt: "2026-01-02T00:00:00.000Z",
      status: "draft",
      confidence: "low",
      author: "author-beta",
      source: "api",
    })
  );
  createDecisionJournalEntry(
    sampleEntry("journal-query-c", {
      updatedAt: "2026-01-01T00:00:00.000Z",
      createdAt: "2026-01-01T00:00:00.000Z",
      status: "archived",
      confidence: "high",
      reviewers: Object.freeze(["reviewer-alpha"]),
    })
  );
  createDecisionJournalEntry(
    sampleEntry("journal-query-d", {
      updatedAt: "2026-02-01T00:00:00.000Z",
      createdAt: "2026-02-01T00:00:00.000Z",
      status: "reviewed",
      source: "workspace",
      tags: Object.freeze(["beta"]),
    })
  );
  createDecisionJournalEntry(
    sampleEntry("journal-query-other-ws", {
      workspaceId: "ws-journal-query-test-002",
      updatedAt: "2026-12-01T00:00:00.000Z",
    })
  );
}

test.beforeEach(() => {
  resetDecisionJournalQueryLayerForTests();
  resetDecisionJournalEngineForTests();
  resetDecisionJournalPlatformForTests();
  createDecisionJournalFoundation(FIXED_TIME);
  initializeDecisionJournalEngine(FIXED_TIME);
  initializeDecisionJournalQueryLayer(FIXED_TIME);
});

test("validates stage manifest and architecture boundary", () => {
  const manifestValidation = validateStageManifest(DECISION_JOURNAL_QUERY_SELF_MANIFEST);
  assert.equal(manifestValidation.valid, true, manifestValidation.issues.map((issue) => issue.message).join("; "));
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/decision-journal/decisionJournalQuery.ts",
    allowedFiles: DECISION_JOURNAL_QUERY_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: DECISION_JOURNAL_QUERY_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("returns safe empty result for empty workspace", () => {
  const result = queryDecisionJournal({ workspaceId: "ws-empty" });
  assert.equal(result.success, true);
  assert.equal(result.data?.totalEntries, 0);
  assert.equal(result.data?.entries.length, 0);
  assert.equal(result.data?.summary.firstEntryAt, null);
  assert.equal(result.data?.summary.lastEntryAt, null);
});

test("enforces workspace isolation", () => {
  seedEntries();
  const ws1 = queryDecisionJournal({ workspaceId: WORKSPACE });
  const ws2 = queryDecisionJournal({ workspaceId: "ws-journal-query-test-002" });
  assert.equal(ws1.data?.totalEntries, 3);
  assert.equal(ws2.data?.totalEntries, 1);
});

test("orders entries descending by default", () => {
  seedEntries();
  const result = queryDecisionJournal({ workspaceId: WORKSPACE });
  assert.equal(result.data?.ordering.direction, "desc");
  assert.equal(result.data?.entries[0]?.id, "journal-query-a");
});

test("orders entries ascending when requested", () => {
  seedEntries();
  const result = queryDecisionJournal({ workspaceId: WORKSPACE, direction: "asc", includeArchived: true });
  assert.equal(result.data?.ordering.direction, "asc");
  assert.equal(result.data?.entries[0]?.id, "journal-query-c");
});

test("uses updatedAt as primary ordering key", () => {
  seedEntries();
  const entries = getDecisionJournalEntriesOrdered({ workspaceId: WORKSPACE, direction: "asc", includeArchived: true });
  assert.equal(entries[0]?.updatedAt, "2026-01-01T00:00:00.000Z");
  assert.equal(entries[entries.length - 1]?.updatedAt, "2026-06-01T00:00:00.000Z");
});

test("uses createdAt as secondary ordering key", () => {
  seedEntries();
  const entries = getDecisionJournalEntriesOrdered({ workspaceId: WORKSPACE, direction: "asc", includeArchived: true });
  const tieEntries = entries.filter((entry) => entry.updatedAt === "2026-01-01T00:00:00.000Z");
  assert.equal(tieEntries[0]?.id, "journal-query-c");
  assert.equal(tieEntries[1]?.id, "journal-query-b");
});

test("uses id as stable fallback ordering key", () => {
  const tieA = sampleEntry("journal-tie-z", {
    updatedAt: "2026-03-01T00:00:00.000Z",
    createdAt: "2026-03-01T00:00:00.000Z",
  });
  const tieB = sampleEntry("journal-tie-a", {
    updatedAt: "2026-03-01T00:00:00.000Z",
    createdAt: "2026-03-01T00:00:00.000Z",
  });
  createDecisionJournalEntry(tieA);
  createDecisionJournalEntry(tieB);
  const ordered = orderDecisionJournalEntries(
    getDecisionJournalEntriesOrdered({ workspaceId: WORKSPACE, includeArchived: true }),
    "asc"
  );
  const tieSlice = ordered.filter((entry) => entry.updatedAt === "2026-03-01T00:00:00.000Z");
  assert.equal(tieSlice[0]?.id, "journal-tie-a");
  assert.equal(tieSlice[1]?.id, "journal-tie-z");
});

test("filters by updatedAt range", () => {
  seedEntries();
  const range = getDecisionJournalRange(
    WORKSPACE,
    "2026-02-01T00:00:00.000Z",
    "2026-12-31T23:59:59.999Z"
  );
  assert.equal(range.success, true);
  assert.equal(range.data?.totalEntries, 2);
  assert.ok(range.data?.entries.some((entry) => entry.id === "journal-query-a"));
  assert.ok(range.data?.entries.some((entry) => entry.id === "journal-query-d"));
});

test("filters by status", () => {
  seedEntries();
  const result = queryDecisionJournal({ workspaceId: WORKSPACE, status: "active" });
  assert.equal(result.data?.totalEntries, 1);
  assert.equal(result.data?.entries[0]?.id, "journal-query-a");
});

test("filters by source", () => {
  seedEntries();
  const result = queryDecisionJournal({ workspaceId: WORKSPACE, source: "api" });
  assert.equal(result.data?.totalEntries, 1);
  assert.equal(result.data?.entries[0]?.id, "journal-query-b");
});

test("filters by confidence", () => {
  seedEntries();
  const result = queryDecisionJournal({ workspaceId: WORKSPACE, confidence: "very_high" });
  assert.equal(result.data?.totalEntries, 1);
  assert.equal(result.data?.entries[0]?.id, "journal-query-a");
});

test("filters by author", () => {
  seedEntries();
  const result = queryDecisionJournal({ workspaceId: WORKSPACE, author: "author-beta" });
  assert.equal(result.data?.totalEntries, 1);
  assert.equal(result.data?.entries[0]?.id, "journal-query-b");
});

test("filters by reviewer", () => {
  seedEntries();
  const result = queryDecisionJournal({
    workspaceId: WORKSPACE,
    reviewer: "reviewer-alpha",
    includeArchived: true,
  });
  assert.equal(result.data?.totalEntries, 1);
  assert.equal(result.data?.entries[0]?.id, "journal-query-c");
});

test("filters by tag", () => {
  seedEntries();
  const result = queryDecisionJournal({ workspaceId: WORKSPACE, tag: "beta" });
  assert.equal(result.data?.totalEntries, 1);
  assert.equal(result.data?.entries[0]?.id, "journal-query-d");
});

test("filters by createdAt range", () => {
  seedEntries();
  const result = queryDecisionJournal({
    workspaceId: WORKSPACE,
    createdAtFrom: "2026-02-01T00:00:00.000Z",
    createdAtTo: "2026-12-31T23:59:59.999Z",
    includeArchived: true,
  });
  assert.equal(result.data?.totalEntries, 2);
});

test("excludes archived entries by default", () => {
  seedEntries();
  const defaultQuery = queryDecisionJournal({ workspaceId: WORKSPACE });
  assert.equal(defaultQuery.data?.includedArchived, false);
  assert.equal(defaultQuery.data?.entries.some((entry) => entry.id === "journal-query-c"), false);
});

test("includes archived entries when requested", () => {
  seedEntries();
  const withArchived = queryDecisionJournal({ workspaceId: WORKSPACE, includeArchived: true });
  assert.equal(withArchived.data?.totalEntries, 4);
  assert.equal(withArchived.data?.entries.some((entry) => entry.id === "journal-query-c"), true);
});

test("builds summary status counts", () => {
  seedEntries();
  const summary = getDecisionJournalSummary({ workspaceId: WORKSPACE, includeArchived: true });
  assert.equal(summary.archivedCount, 1);
  assert.equal(summary.draftCount, 1);
  assert.equal(summary.reviewedCount, 1);
  assert.equal(summary.activeCount, 1);
});

test("builds confidence distribution in summary", () => {
  seedEntries();
  const summary = getDecisionJournalSummary({ workspaceId: WORKSPACE, includeArchived: true });
  assert.equal(summary.confidenceDistribution.very_high, 1);
  assert.equal(summary.confidenceDistribution.low, 1);
});

test("builds author counts in summary", () => {
  seedEntries();
  const summary = getDecisionJournalSummary({ workspaceId: WORKSPACE, includeArchived: true });
  assert.equal(summary.authorCounts["author-alpha"], 1);
  assert.equal(summary.authorCounts["author-beta"], 1);
});

test("builds source counts in summary", () => {
  seedEntries();
  const summary = getDecisionJournalSummary({ workspaceId: WORKSPACE, includeArchived: true });
  assert.equal(summary.sourceCounts.manual, 2);
  assert.equal(summary.sourceCounts.api, 1);
  assert.equal(summary.sourceCounts.workspace, 1);
});

test("rejects invalid query input", () => {
  const validation = validateDecisionJournalQuery({
    filters: Object.freeze({
      workspaceId: WORKSPACE,
      status: "invalid-status" as never,
    }),
  });
  assert.equal(validation.valid, false);
  assert.ok(validation.issues.some((issue) => issue.field === "status"));
});

test("APP-8:2 compatibility validation passes", () => {
  const compatibility = validateFoundationCompatibilityForQuery(FIXED_TIME);
  assert.equal(compatibility.valid, true);
  assert.equal(DECISION_JOURNAL_PLATFORM_IDENTITY.appId, "APP-8");
  assert.equal(DECISION_JOURNAL_QUERY_CONTRACT_VERSION, "APP-8/3");
});

test("certification runner passes all checks", () => {
  const certification = runDecisionJournalQueryCertification();
  assert.equal(
    certification.status,
    "PASS",
    certification.checks.filter((entry) => !entry.passed).map((entry) => `${entry.id}: ${entry.evidence}`).join("; ")
  );
  assert.equal(certification.certified, true);
  assert.equal(certification.score, 100);
});
