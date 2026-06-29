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
import {
  getDecisionJournalEntriesOrdered,
  initializeDecisionJournalQueryLayer,
  resetDecisionJournalQueryLayerForTests,
} from "./decisionJournalQuery.ts";
import {
  buildDecisionJournalReflectionModel,
  extractDecisionJournalInsights,
  extractAssumptionPatterns,
  extractRiskPatterns,
  initializeDecisionJournalReflectionLayer,
  resetDecisionJournalReflectionLayerForTests,
  summarizeDecisionJournalConfidence,
  summarizeDecisionJournalEvidence,
  summarizeDecisionJournalReviews,
  validateDecisionJournalReflectionModel,
  DECISION_JOURNAL_REFLECTION_SELF_MANIFEST,
} from "./decisionJournalReflection.ts";
import { runDecisionJournalReflectionCertification } from "./decisionJournalReflectionRunner.ts";
import { DECISION_JOURNAL_QUERY_CONTRACT_VERSION } from "./decisionJournalQueryTypes.ts";
import { validateQueryLayerAvailabilityForReflection } from "./decisionJournalReflectionValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-reflection-test-001";

function sampleEntry(id: string, overrides: Record<string, unknown> = {}) {
  return Object.freeze({
    id,
    workspaceId: WORKSPACE,
    title: `Journal ${id}`,
    summary: "Reflection test entry.",
    rationale: "Executive rationale for reflection test.",
    expectedOutcome: "Validated reflection behavior.",
    confidence: "medium" as const,
    author: "test-runner",
    source: "manual" as const,
    createdAt: FIXED_TIME,
    tags: Object.freeze(["test"]),
    ...overrides,
  });
}

function seedReflectionEntries() {
  createDecisionJournalEntry(
    sampleEntry("reflection-entry-1", {
      assumptions: Object.freeze(["Demand remains stable", "Budget approved"]),
      acceptedRisks: Object.freeze(["Market slowdown", "Execution risk"]),
      evidenceReferences: Object.freeze(["market-report-2026"]),
      alternatives: Object.freeze(["Expand", "Hold", "Retreat"]),
      tradeoffs: Object.freeze(["Speed vs quality"]),
      constraints: Object.freeze(["Budget limit"]),
      status: "reviewed",
      reviewers: Object.freeze(["reviewer-one"]),
      confidence: "high",
    })
  );
  createDecisionJournalEntry(
    sampleEntry("reflection-entry-2", {
      assumptions: Object.freeze(["Demand remains stable", "Team available"]),
      acceptedRisks: Object.freeze(["Market slowdown", "Vendor delay"]),
      evidenceReferences: Object.freeze([]),
      alternatives: Object.freeze([]),
      tradeoffs: Object.freeze(["Speed vs quality", "Cost vs scope"]),
      constraints: Object.freeze(["Budget limit", "Timeline Q3"]),
      status: "active",
      confidence: "very_high",
    })
  );
  createDecisionJournalEntry(
    sampleEntry("reflection-entry-3", {
      assumptions: Object.freeze(["Legacy stable"]),
      acceptedRisks: Object.freeze(["Tech debt"]),
      evidenceReferences: Object.freeze([]),
      alternatives: Object.freeze(["A", "B", "C", "D"]),
      tradeoffs: Object.freeze(["Flexibility vs simplicity"]),
      constraints: Object.freeze(["Compliance rule"]),
      status: "draft",
      confidence: "low",
    })
  );
  createDecisionJournalEntry(
    sampleEntry("reflection-entry-other-ws", {
      workspaceId: "ws-reflection-test-002",
      assumptions: Object.freeze(["Isolated assumption"]),
    })
  );
}

function bootstrap() {
  resetDecisionJournalReflectionLayerForTests();
  resetDecisionJournalQueryLayerForTests();
  resetDecisionJournalEngineForTests();
  resetDecisionJournalPlatformForTests();
  createDecisionJournalFoundation(FIXED_TIME);
  initializeDecisionJournalEngine(FIXED_TIME);
  initializeDecisionJournalQueryLayer(FIXED_TIME);
  initializeDecisionJournalReflectionLayer(FIXED_TIME);
}

test.beforeEach(() => {
  bootstrap();
});

test("validates stage manifest and architecture boundary", () => {
  const manifestValidation = validateStageManifest(DECISION_JOURNAL_REFLECTION_SELF_MANIFEST);
  assert.equal(manifestValidation.valid, true, manifestValidation.issues.map((issue) => issue.message).join("; "));
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/decision-journal/decisionJournalReflection.ts",
    allowedFiles: DECISION_JOURNAL_REFLECTION_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: DECISION_JOURNAL_REFLECTION_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("returns safe empty journal reflection", () => {
  const result = buildDecisionJournalReflectionModel({ workspaceId: "ws-empty" });
  assert.equal(result.success, true);
  assert.equal(result.data?.entryCount, 0);
  assert.equal(result.data?.insightItems.length, 0);
  assert.equal(result.data?.evidenceSummary.totalReferences, 0);
});

test("enforces workspace isolation", () => {
  seedReflectionEntries();
  const ws1 = buildDecisionJournalReflectionModel({ workspaceId: WORKSPACE });
  const ws2 = buildDecisionJournalReflectionModel({ workspaceId: "ws-reflection-test-002" });
  assert.equal(ws1.data?.entryCount, 3);
  assert.equal(ws2.data?.entryCount, 1);
});

test("detects repeated assumption patterns", () => {
  seedReflectionEntries();
  const result = buildDecisionJournalReflectionModel({ workspaceId: WORKSPACE });
  assert.ok(
    result.data?.assumptionPatterns.some(
      (pattern) => pattern.pattern === "Demand remains stable" && pattern.occurrenceCount === 2
    )
  );
  assert.ok(result.data?.insightItems.some((item) => item.type === "repeated-assumption"));
});

test("detects repeated risk patterns", () => {
  seedReflectionEntries();
  const result = buildDecisionJournalReflectionModel({ workspaceId: WORKSPACE });
  assert.ok(
    result.data?.riskPatterns.some(
      (pattern) => pattern.pattern === "Market slowdown" && pattern.occurrenceCount === 2
    )
  );
  assert.ok(result.data?.insightItems.some((item) => item.type === "repeated-risk"));
});

test("summarizes evidence references", () => {
  seedReflectionEntries();
  const result = buildDecisionJournalReflectionModel({ workspaceId: WORKSPACE });
  assert.equal(result.data?.evidenceSummary.totalReferences, 1);
  assert.equal(result.data?.evidenceSummary.entriesWithNoEvidence, 2);
  assert.equal(result.data?.evidenceSummary.entriesWithEvidence, 1);
});

test("detects low evidence insight", () => {
  seedReflectionEntries();
  const result = buildDecisionJournalReflectionModel({ workspaceId: WORKSPACE });
  const lowEvidence = result.data?.insightItems.filter((item) => item.type === "low-evidence") ?? [];
  assert.ok(lowEvidence.length >= 2);
});

test("detects high confidence low evidence insight", () => {
  seedReflectionEntries();
  const result = buildDecisionJournalReflectionModel({ workspaceId: WORKSPACE });
  assert.ok(result.data?.insightItems.some((item) => item.type === "high-confidence-low-evidence"));
});

test("detects many alternatives insight", () => {
  seedReflectionEntries();
  const result = buildDecisionJournalReflectionModel({ workspaceId: WORKSPACE });
  assert.ok(result.data?.insightItems.some((item) => item.type === "many-alternatives"));
  assert.equal(result.data?.alternativeSummary.entriesWithMany, 2);
});

test("detects no alternatives insight", () => {
  seedReflectionEntries();
  const result = buildDecisionJournalReflectionModel({ workspaceId: WORKSPACE });
  assert.ok(result.data?.insightItems.some((item) => item.type === "no-alternatives"));
  assert.equal(result.data?.alternativeSummary.entriesWithNone, 1);
});

test("detects unreviewed entry insight", () => {
  seedReflectionEntries();
  const result = buildDecisionJournalReflectionModel({ workspaceId: WORKSPACE });
  assert.ok(result.data?.insightItems.some((item) => item.type === "unreviewed-entry"));
});

test("detects repeated constraint insight", () => {
  seedReflectionEntries();
  const result = buildDecisionJournalReflectionModel({ workspaceId: WORKSPACE });
  assert.ok(result.data?.constraintSummary.repeatedPatterns.some((pattern) => pattern.pattern === "Budget limit"));
  assert.ok(result.data?.insightItems.some((item) => item.type === "repeated-constraint"));
});

test("detects repeated tradeoff insight", () => {
  seedReflectionEntries();
  const result = buildDecisionJournalReflectionModel({ workspaceId: WORKSPACE });
  assert.ok(result.data?.tradeoffSummary.repeatedPatterns.some((pattern) => pattern.pattern === "Speed vs quality"));
  assert.ok(result.data?.insightItems.some((item) => item.type === "repeated-tradeoff"));
});

test("builds confidence summary", () => {
  seedReflectionEntries();
  const result = buildDecisionJournalReflectionModel({ workspaceId: WORKSPACE });
  assert.ok(result.data?.confidenceSummary.dominantLevel);
  assert.ok(result.data.confidenceSummary.averageScore >= 0 && result.data.confidenceSummary.averageScore <= 1);
});

test("builds review summary", () => {
  seedReflectionEntries();
  const result = buildDecisionJournalReflectionModel({ workspaceId: WORKSPACE });
  assert.equal(result.data?.reviewSummary.reviewedCount, 1);
  assert.equal(result.data?.reviewSummary.unreviewedCount, 2);
});

test("keeps insight severity within valid bounds", () => {
  seedReflectionEntries();
  const result = buildDecisionJournalReflectionModel({ workspaceId: WORKSPACE });
  for (const insight of result.data?.insightItems ?? []) {
    assert.ok(["low", "medium", "high", "critical"].includes(insight.severity));
  }
});

test("keeps insight confidence within 0–1 bounds", () => {
  seedReflectionEntries();
  const result = buildDecisionJournalReflectionModel({ workspaceId: WORKSPACE });
  for (const insight of result.data?.insightItems ?? []) {
    assert.ok(insight.confidence >= 0 && insight.confidence <= 1);
  }
});

test("validates reflection model contract", () => {
  seedReflectionEntries();
  const result = buildDecisionJournalReflectionModel({ workspaceId: WORKSPACE });
  const validation = validateDecisionJournalReflectionModel(result.data!);
  assert.equal(validation.valid, true, validation.issues.map((issue) => issue.message).join("; "));
});

test("rejects invalid reflection build input", () => {
  const result = buildDecisionJournalReflectionModel({ workspaceId: "" });
  assert.equal(result.success, false);
});

test("APP-8:3 compatibility validation passes", () => {
  assert.equal(validateQueryLayerAvailabilityForReflection().valid, true);
  const result = buildDecisionJournalReflectionModel({ workspaceId: WORKSPACE });
  assert.equal(result.data?.metadata.queryContractVersion, DECISION_JOURNAL_QUERY_CONTRACT_VERSION);
});

test("extract helpers work on entry arrays directly", () => {
  seedReflectionEntries();
  const entries = getDecisionJournalEntriesOrdered({ workspaceId: WORKSPACE });
  assert.ok(extractAssumptionPatterns(entries).length >= 1);
  assert.ok(extractRiskPatterns(entries).length >= 1);
  assert.ok(summarizeDecisionJournalEvidence(entries).totalReferences >= 1);
  assert.ok(summarizeDecisionJournalReviews(entries).unreviewedCount >= 1);
  assert.ok(extractDecisionJournalInsights(entries, WORKSPACE).length >= 1);
  assert.ok(summarizeDecisionJournalConfidence(entries).averageScore >= 0);
});

test("certification runner passes all checks", () => {
  const certification = runDecisionJournalReflectionCertification();
  assert.equal(
    certification.status,
    "PASS",
    certification.checks.filter((entry) => !entry.passed).map((entry) => `${entry.id}: ${entry.evidence}`).join("; ")
  );
  assert.equal(certification.certified, true);
  assert.equal(certification.score, 100);
});
