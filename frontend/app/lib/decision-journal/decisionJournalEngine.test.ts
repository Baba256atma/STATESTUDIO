import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION,
  DECISION_JOURNAL_PLATFORM_IDENTITY,
} from "./decisionJournalContracts.ts";
import { createDecisionJournalFoundation } from "./decisionJournalFoundation.ts";
import { resetDecisionJournalPlatformForTests } from "./decisionJournalRunner.ts";
import { validateDecisionJournalEntryContractShape } from "./decisionJournalValidation.ts";
import {
  archiveDecisionJournalEntry,
  createDecisionJournalEntry,
  filterDecisionJournalEntries,
  getDecisionJournalEntryById,
  getDecisionJournalEntryRevisionHistory,
  getDecisionJournalEntriesByWorkspace,
  initializeDecisionJournalEngine,
  normalizeDecisionJournalEntry,
  resetDecisionJournalEngineForTests,
  updateDecisionJournalMetadata,
  validateDecisionJournalEntryInput,
  DECISION_JOURNAL_ENGINE_SELF_MANIFEST,
} from "./decisionJournalEngine.ts";
import {
  mapDecisionJournalEngineEntryToFoundationContract,
  validateFoundationCompatibilityForEngine,
} from "./decisionJournalEngineValidation.ts";
import { runDecisionJournalEngineCertification } from "./decisionJournalEngineRunner.ts";
import { generateDecisionJournalEntryId } from "./decisionJournalEngineRegistry.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-test-001";

function sampleInput(overrides: Record<string, unknown> = {}) {
  return Object.freeze({
    workspaceId: WORKSPACE,
    title: "Market expansion rationale",
    summary: "Executive summary for test journal entry.",
    rationale: "Partner channels reduce acquisition cost while preserving brand credibility.",
    expectedOutcome: "25% revenue growth through partner pipeline.",
    confidence: "high" as const,
    author: "test-runner",
    source: "manual" as const,
    createdAt: FIXED_TIME,
    tags: Object.freeze(["strategy", "expansion"]),
    ...overrides,
  });
}

test.beforeEach(() => {
  resetDecisionJournalEngineForTests();
  resetDecisionJournalPlatformForTests();
  createDecisionJournalFoundation(FIXED_TIME);
  initializeDecisionJournalEngine(FIXED_TIME);
});

test("validates stage manifest and architecture boundary", () => {
  const manifestValidation = validateStageManifest(DECISION_JOURNAL_ENGINE_SELF_MANIFEST);
  assert.equal(manifestValidation.valid, true, manifestValidation.issues.map((issue) => issue.message).join("; "));
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/decision-journal/decisionJournalEngine.ts",
    allowedFiles: DECISION_JOURNAL_ENGINE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: DECISION_JOURNAL_ENGINE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("creates journal entries with required fields", () => {
  const result = createDecisionJournalEntry({ ...sampleInput(), id: "decision-journal-entry-test-001" });
  assert.equal(result.success, true, result.reason);
  assert.ok(result.data);
  assert.equal(result.data.revisionVersion, 1);
  assert.equal(result.data.readOnly, true);
  assert.equal(result.data.id, "decision-journal-entry-test-001");
  assert.equal(result.data.status, "draft");
});

test("rejects missing required fields", () => {
  const validation = validateDecisionJournalEntryInput({
    ...sampleInput(),
    title: "",
  });
  assert.equal(validation.valid, false);
  assert.ok(validation.issues.some((issue) => issue.field === "title"));
});

test("rejects invalid confidence", () => {
  const validation = validateDecisionJournalEntryInput({
    ...sampleInput(),
    confidence: "invalid-confidence" as never,
  });
  assert.equal(validation.valid, false);
  assert.ok(validation.issues.some((issue) => issue.field === "confidence"));
});

test("rejects invalid status", () => {
  const validation = validateDecisionJournalEntryInput({
    ...sampleInput(),
    status: "deleted" as never,
  });
  assert.equal(validation.valid, false);
  assert.ok(validation.issues.some((issue) => issue.field === "status"));
});

test("rejects invalid source", () => {
  const validation = validateDecisionJournalEntryInput({
    ...sampleInput(),
    source: "unknown-source" as never,
  });
  assert.equal(validation.valid, false);
  assert.ok(validation.issues.some((issue) => issue.field === "source"));
});

test("enforces workspace isolation", () => {
  createDecisionJournalEntry({ ...sampleInput(), id: "decision-journal-entry-ws-a", workspaceId: "ws-a" });
  createDecisionJournalEntry({ ...sampleInput(), id: "decision-journal-entry-ws-b", workspaceId: "ws-b" });
  assert.equal(getDecisionJournalEntriesByWorkspace("ws-a").length, 1);
  assert.equal(getDecisionJournalEntriesByWorkspace("ws-b").length, 1);
  assert.equal(getDecisionJournalEntryById("decision-journal-entry-ws-a")?.workspaceId, "ws-a");
});

test("enforces append-only registry", () => {
  createDecisionJournalEntry({ ...sampleInput(), id: "decision-journal-entry-dup" });
  const duplicate = createDecisionJournalEntry({ ...sampleInput(), id: "decision-journal-entry-dup" });
  assert.equal(duplicate.success, false);
});

test("preserves stable entry id across revisions", () => {
  createDecisionJournalEntry({ ...sampleInput(), id: "decision-journal-entry-stable" });
  const updated = updateDecisionJournalMetadata({
    id: "decision-journal-entry-stable",
    workspaceId: WORKSPACE,
    title: "Updated title",
  });
  assert.equal(updated.success, true);
  assert.equal(updated.data?.id, "decision-journal-entry-stable");
  const history = getDecisionJournalEntryRevisionHistory("decision-journal-entry-stable");
  assert.equal(history.length, 2);
  assert.equal(history[0]?.id, history[1]?.id);
});

test("generates deterministic entry ids", () => {
  const id = generateDecisionJournalEntryId("ws-seq", 42);
  assert.equal(id, "decision-journal-entry-ws-seq-000042");
  const created = createDecisionJournalEntry(sampleInput());
  assert.equal(created.success, true);
  assert.match(created.data!.id, /^decision-journal-entry-ws-test-001-\d{6}$/);
});

test("increments revision version on metadata update", () => {
  createDecisionJournalEntry({ ...sampleInput(), id: "decision-journal-entry-version" });
  const first = updateDecisionJournalMetadata({
    id: "decision-journal-entry-version",
    workspaceId: WORKSPACE,
    summary: "Updated executive summary.",
  });
  assert.equal(first.data?.revisionVersion, 2);
  const second = updateDecisionJournalMetadata({
    id: "decision-journal-entry-version",
    workspaceId: WORKSPACE,
    confidence: "very_high",
  });
  assert.equal(second.data?.revisionVersion, 3);
});

test("archives instead of deleting entries", () => {
  createDecisionJournalEntry({ ...sampleInput(), id: "decision-journal-entry-archive" });
  const archived = archiveDecisionJournalEntry("decision-journal-entry-archive", WORKSPACE);
  assert.equal(archived.success, true);
  assert.equal(archived.data?.status, "archived");
  assert.equal(archived.data?.archived, true);
  assert.ok(getDecisionJournalEntryById("decision-journal-entry-archive"));
});

test("filters by status", () => {
  createDecisionJournalEntry({ ...sampleInput(), id: "journal-status-1", status: "draft" });
  createDecisionJournalEntry({ ...sampleInput(), id: "journal-status-2", status: "active" });
  const filtered = filterDecisionJournalEntries({ workspaceId: WORKSPACE, status: "active" });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0]?.id, "journal-status-2");
});

test("filters by source", () => {
  createDecisionJournalEntry({ ...sampleInput(), id: "journal-source-1", source: "manual" });
  createDecisionJournalEntry({ ...sampleInput(), id: "journal-source-2", source: "api" });
  const filtered = filterDecisionJournalEntries({ workspaceId: WORKSPACE, source: "api" });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0]?.id, "journal-source-2");
});

test("filters by confidence", () => {
  createDecisionJournalEntry({ ...sampleInput(), id: "journal-conf-1", confidence: "low" });
  createDecisionJournalEntry({ ...sampleInput(), id: "journal-conf-2", confidence: "very_high" });
  const filtered = filterDecisionJournalEntries({ workspaceId: WORKSPACE, confidence: "very_high" });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0]?.id, "journal-conf-2");
});

test("filters by author", () => {
  createDecisionJournalEntry({ ...sampleInput(), id: "journal-author-1", author: "author-alpha" });
  createDecisionJournalEntry({ ...sampleInput(), id: "journal-author-2", author: "author-beta" });
  const filtered = filterDecisionJournalEntries({ workspaceId: WORKSPACE, author: "author-beta" });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0]?.id, "journal-author-2");
});

test("filters by reviewer", () => {
  createDecisionJournalEntry({
    ...sampleInput(),
    id: "journal-reviewer-1",
    reviewers: Object.freeze(["reviewer-alpha"]),
  });
  createDecisionJournalEntry({
    ...sampleInput(),
    id: "journal-reviewer-2",
    reviewers: Object.freeze(["reviewer-beta"]),
  });
  const filtered = filterDecisionJournalEntries({ workspaceId: WORKSPACE, reviewer: "reviewer-beta" });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0]?.id, "journal-reviewer-2");
});

test("filters by tag", () => {
  createDecisionJournalEntry({ ...sampleInput(), id: "journal-tag-1", tags: Object.freeze(["alpha"]) });
  createDecisionJournalEntry({ ...sampleInput(), id: "journal-tag-2", tags: Object.freeze(["beta"]) });
  const filtered = filterDecisionJournalEntries({ workspaceId: WORKSPACE, tag: "beta" });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0]?.id, "journal-tag-2");
});

test("filters by createdAt range", () => {
  createDecisionJournalEntry({ ...sampleInput(), id: "journal-date-1", createdAt: "2026-01-01T00:00:00.000Z" });
  createDecisionJournalEntry({ ...sampleInput(), id: "journal-date-2", createdAt: "2026-06-01T00:00:00.000Z" });
  const filtered = filterDecisionJournalEntries({
    workspaceId: WORKSPACE,
    createdAtFrom: "2026-02-01T00:00:00.000Z",
    createdAtTo: "2026-12-31T23:59:59.999Z",
  });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0]?.id, "journal-date-2");
});

test("filters by updatedAt range", () => {
  createDecisionJournalEntry({
    ...sampleInput(),
    id: "journal-updated-1",
    updatedAt: "2026-01-01T00:00:00.000Z",
  });
  createDecisionJournalEntry({
    ...sampleInput(),
    id: "journal-updated-2",
    updatedAt: "2026-06-01T00:00:00.000Z",
  });
  const filtered = filterDecisionJournalEntries({
    workspaceId: WORKSPACE,
    updatedAtFrom: "2026-02-01T00:00:00.000Z",
    updatedAtTo: "2026-12-31T23:59:59.999Z",
  });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0]?.id, "journal-updated-2");
});

test("excludes archived entries by default", () => {
  createDecisionJournalEntry({ ...sampleInput(), id: "journal-active", status: "active" });
  createDecisionJournalEntry({ ...sampleInput(), id: "journal-archived", status: "archived" });
  const defaultFilter = filterDecisionJournalEntries({ workspaceId: WORKSPACE });
  assert.equal(defaultFilter.some((entry) => entry.id === "journal-archived"), false);
  const withArchived = filterDecisionJournalEntries({ workspaceId: WORKSPACE, includeArchived: true });
  assert.equal(withArchived.some((entry) => entry.id === "journal-archived"), true);
});

test("enforces immutable identity fields", () => {
  createDecisionJournalEntry({ ...sampleInput(), id: "journal-identity" });
  const updated = updateDecisionJournalMetadata({
    id: "journal-identity",
    workspaceId: WORKSPACE,
    title: "Updated title",
  });
  assert.equal(updated.success, true);
  assert.equal(updated.data?.author, "test-runner");
  assert.equal(updated.data?.createdAt, FIXED_TIME);
  const wrongWorkspace = updateDecisionJournalMetadata({
    id: "journal-identity",
    workspaceId: "ws-other",
    title: "Cross workspace update",
  });
  assert.equal(wrongWorkspace.success, false);
});

test("enforces immutable decisionId once assigned", () => {
  createDecisionJournalEntry({
    ...sampleInput(),
    id: "journal-decision-link",
    decisionId: "decision-original",
  });
  const attempt = updateDecisionJournalMetadata({
    id: "journal-decision-link",
    workspaceId: WORKSPACE,
    title: "Refresh rationale summary",
    decisionId: "decision-changed" as never,
  } as never);
  assert.equal(attempt.success, false);
  assert.equal(getDecisionJournalEntryById("journal-decision-link")?.decisionId, "decision-original");
});

test("enforces immutable scenarioId once assigned", () => {
  createDecisionJournalEntry({
    ...sampleInput(),
    id: "journal-scenario-link",
    scenarioId: "scenario-original",
  });
  const attempt = updateDecisionJournalMetadata({
    id: "journal-scenario-link",
    workspaceId: WORKSPACE,
    title: "Refresh rationale summary",
    scenarioId: "scenario-changed" as never,
  } as never);
  assert.equal(attempt.success, false);
  assert.equal(getDecisionJournalEntryById("journal-scenario-link")?.scenarioId, "scenario-original");
});

test("normalizes journal entry input", () => {
  const normalized = normalizeDecisionJournalEntry({
    ...sampleInput(),
    title: "  Trimmed title  ",
    tags: Object.freeze(["  tag-one  ", "tag-one"]),
  });
  assert.equal(normalized.title, "Trimmed title");
  assert.deepEqual(normalized.tags, ["tag-one"]);
});

test("maps engine entries to APP-8:1 foundation contract", () => {
  const created = createDecisionJournalEntry({ ...sampleInput(), id: "journal-compat" });
  assert.equal(created.success, true);
  const foundationEntry = mapDecisionJournalEngineEntryToFoundationContract(created.data!);
  const shape = validateDecisionJournalEntryContractShape(foundationEntry);
  assert.equal(shape.valid, true, shape.issues.map((issue) => issue.message).join("; "));
  assert.equal(foundationEntry.version, DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION);
});

test("APP-8:1 compatibility validation passes", () => {
  const compatibility = validateFoundationCompatibilityForEngine(FIXED_TIME);
  assert.equal(compatibility.valid, true);
  assert.equal(DECISION_JOURNAL_PLATFORM_IDENTITY.appId, "APP-8");
});

test("certification runner passes all checks", () => {
  const certification = runDecisionJournalEngineCertification();
  assert.equal(
    certification.status,
    "PASS",
    certification.checks.filter((entry) => !entry.passed).map((entry) => `${entry.id}: ${entry.evidence}`).join("; ")
  );
  assert.equal(certification.certified, true);
  assert.equal(certification.score, 100);
});
