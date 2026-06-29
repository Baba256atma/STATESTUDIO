import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  createDecisionJournalEntry,
  getDecisionJournalEntryById,
  initializeDecisionJournalEngine,
  resetDecisionJournalEngineForTests,
} from "./decisionJournalEngine.ts";
import { createDecisionJournalFoundation } from "./decisionJournalFoundation.ts";
import { resetDecisionJournalPlatformForTests } from "./decisionJournalRunner.ts";
import {
  initializeDecisionJournalQueryLayer,
  resetDecisionJournalQueryLayerForTests,
} from "./decisionJournalQuery.ts";
import {
  initializeDecisionJournalReflectionLayer,
  resetDecisionJournalReflectionLayerForTests,
} from "./decisionJournalReflection.ts";
import {
  initializeDecisionJournalEvidenceAssumptionLayer,
  resetDecisionJournalEvidenceAssumptionLayerForTests,
} from "./decisionJournalEvidenceAssumption.ts";
import { calculateOutcomeStatus } from "./decisionJournalOutcomeRules.ts";
import {
  buildDecisionJournalRetrospectiveModel,
  calculateAssumptionAccuracy,
  calculateEvidenceReliability,
  calculateReviewCompleteness,
  calculateRiskRealization,
  initializeDecisionJournalRetrospectiveLayer,
  resetDecisionJournalRetrospectiveLayerForTests,
  validateDecisionJournalRetrospectiveModel,
  DECISION_JOURNAL_RETROSPECTIVE_SELF_MANIFEST,
} from "./decisionJournalRetrospective.ts";
import { runDecisionJournalRetrospectiveCertification } from "./decisionJournalRetrospectiveRunner.ts";
import { DECISION_JOURNAL_EVIDENCE_ASSUMPTION_CONTRACT_VERSION } from "./decisionJournalEvidenceAssumptionTypes.ts";
import { validateEvidenceAssumptionLayerAvailabilityForRetrospective } from "./decisionJournalRetrospectiveValidation.ts";
import {
  evaluateDecisionJournalAssumptions,
  evaluateDecisionJournalEvidence,
} from "./decisionJournalEvidenceAssumptionBuilder.ts";
import { buildWorkspaceAssumptionCounts } from "./decisionJournalAssumptionRules.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-retrospective-test-001";

function sampleEntry(id: string, overrides: Record<string, unknown> = {}) {
  return Object.freeze({
    id,
    workspaceId: WORKSPACE,
    title: `Journal ${id}`,
    summary: "Retrospective test entry summary.",
    rationale: "Executive rationale for retrospective test.",
    expectedOutcome: "Validated retrospective behavior.",
    confidence: "medium" as const,
    author: "test-runner",
    source: "manual" as const,
    createdAt: FIXED_TIME,
    tags: Object.freeze(["test"]),
    ...overrides,
  });
}

function bootstrap() {
  resetDecisionJournalRetrospectiveLayerForTests();
  resetDecisionJournalEvidenceAssumptionLayerForTests();
  resetDecisionJournalReflectionLayerForTests();
  resetDecisionJournalQueryLayerForTests();
  resetDecisionJournalEngineForTests();
  resetDecisionJournalPlatformForTests();
  createDecisionJournalFoundation(FIXED_TIME);
  initializeDecisionJournalEngine(FIXED_TIME);
  initializeDecisionJournalQueryLayer(FIXED_TIME);
  initializeDecisionJournalReflectionLayer(FIXED_TIME);
  initializeDecisionJournalEvidenceAssumptionLayer(FIXED_TIME);
  initializeDecisionJournalRetrospectiveLayer(FIXED_TIME);
}

function seedRetrospectiveEntries() {
  createDecisionJournalEntry(
    sampleEntry("retro-not-observed", {
      expectedOutcome: "Increase market share.",
    })
  );
  createDecisionJournalEntry(
    sampleEntry("retro-aligned", {
      expectedOutcome: "Revenue growth through partner channel.",
      metadata: Object.freeze({
        observedOutcome: "Revenue growth through partner channel.",
        lessonsLearned: "Partner onboarding requires support",
        assumptionAccuracy: "verified",
        evidenceReliability: "reliable",
      }),
      status: "reviewed",
      reviewers: Object.freeze(["reviewer-one"]),
      evidenceReferences: Object.freeze(["report-a"]),
      assumptions: Object.freeze(["Market stable"]),
    })
  );
  createDecisionJournalEntry(
    sampleEntry("retro-partial", {
      expectedOutcome: "Reduce operational cost by fifteen percent.",
      metadata: Object.freeze({
        observedOutcome: "Operational savings achieved in two departments only.",
        assumptionAccuracy: "partially_verified",
        riskRealization: "partial",
      }),
      evidenceReferences: Object.freeze(["report-b"]),
      assumptions: Object.freeze(["Automation reduces manual work"]),
      acceptedRisks: Object.freeze(["Implementation delay"]),
    })
  );
  createDecisionJournalEntry(
    sampleEntry("retro-misaligned", {
      expectedOutcome: "Expand into European markets rapidly.",
      metadata: Object.freeze({
        observedOutcome: "Maintain domestic focus only.",
      }),
    })
  );
  createDecisionJournalEntry(
    sampleEntry("retro-exceeded", {
      expectedOutcome: "Launch new product line successfully.",
      metadata: Object.freeze({
        observedOutcome: "Product launch exceeded revenue targets and surpassed forecast.",
        outcomeStatus: "exceeded",
        assumptionAccuracy: "invalidated",
        riskRealization: "realized",
        evidenceReliability: "unreliable",
        lessonsLearned: "Validate vendor capacity earlier",
      }),
      acceptedRisks: Object.freeze(["Vendor capacity insufficient"]),
      assumptions: Object.freeze(["Vendor capacity sufficient"]),
    })
  );
  createDecisionJournalEntry(
    sampleEntry("retro-other-ws", {
      workspaceId: "ws-retrospective-test-002",
      metadata: Object.freeze({ observedOutcome: "Isolated observed outcome." }),
    })
  );
}

test.beforeEach(() => {
  bootstrap();
});

test("validates stage manifest and architecture boundary", () => {
  const manifestValidation = validateStageManifest(DECISION_JOURNAL_RETROSPECTIVE_SELF_MANIFEST);
  assert.equal(manifestValidation.valid, true, manifestValidation.issues.map((issue) => issue.message).join("; "));
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/decision-journal/decisionJournalRetrospective.ts",
    allowedFiles: DECISION_JOURNAL_RETROSPECTIVE_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: DECISION_JOURNAL_RETROSPECTIVE_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("returns safe empty journal retrospective model", () => {
  const result = buildDecisionJournalRetrospectiveModel({ workspaceId: "ws-empty" });
  assert.equal(result.success, true);
  assert.equal(result.data?.entryCount, 0);
  assert.equal(result.data?.retrospectives.length, 0);
});

test("enforces workspace isolation", () => {
  seedRetrospectiveEntries();
  const ws1 = buildDecisionJournalRetrospectiveModel({ workspaceId: WORKSPACE });
  const ws2 = buildDecisionJournalRetrospectiveModel({ workspaceId: "ws-retrospective-test-002" });
  assert.equal(ws1.data?.entryCount, 5);
  assert.equal(ws2.data?.entryCount, 1);
});

test("detects no observed outcome status", () => {
  seedRetrospectiveEntries();
  const result = buildDecisionJournalRetrospectiveModel({ workspaceId: WORKSPACE });
  const entry = result.data?.retrospectives.find((item) => item.entryId === "retro-not-observed");
  assert.equal(entry?.outcomeStatus, "not_observed");
  assert.ok(entry?.flags.some((flag) => flag.type === "no-observed-outcome"));
});

test("detects aligned outcome status", () => {
  seedRetrospectiveEntries();
  const result = buildDecisionJournalRetrospectiveModel({ workspaceId: WORKSPACE });
  const entry = result.data?.retrospectives.find((item) => item.entryId === "retro-aligned");
  assert.equal(entry?.outcomeStatus, "aligned");
  assert.ok(entry?.flags.some((flag) => flag.type === "outcome-aligned"));
});

test("detects partially aligned outcome status", () => {
  seedRetrospectiveEntries();
  const result = buildDecisionJournalRetrospectiveModel({ workspaceId: WORKSPACE });
  const entry = result.data?.retrospectives.find((item) => item.entryId === "retro-partial");
  assert.equal(entry?.outcomeStatus, "partially_aligned");
});

test("detects misaligned outcome status", () => {
  seedRetrospectiveEntries();
  const result = buildDecisionJournalRetrospectiveModel({ workspaceId: WORKSPACE });
  const entry = result.data?.retrospectives.find((item) => item.entryId === "retro-misaligned");
  assert.equal(entry?.outcomeStatus, "misaligned");
  assert.ok(entry?.flags.some((flag) => flag.type === "outcome-misaligned"));
});

test("detects exceeded outcome status", () => {
  seedRetrospectiveEntries();
  const result = buildDecisionJournalRetrospectiveModel({ workspaceId: WORKSPACE });
  const entry = result.data?.retrospectives.find((item) => item.entryId === "retro-exceeded");
  assert.equal(entry?.outcomeStatus, "exceeded");
  assert.ok(entry?.flags.some((flag) => flag.type === "outcome-exceeded"));
});

test("uses unknown outcome fallback", () => {
  assert.equal(calculateOutcomeStatus("", "Observed without expectation."), "unknown");
});

test("detects lessons missing flag", () => {
  seedRetrospectiveEntries();
  const result = buildDecisionJournalRetrospectiveModel({ workspaceId: WORKSPACE });
  assert.ok(result.data?.retrospectiveFlags.some((flag) => flag.type === "lessons-missing"));
});

test("detects lessons recorded flag", () => {
  seedRetrospectiveEntries();
  const result = buildDecisionJournalRetrospectiveModel({ workspaceId: WORKSPACE });
  assert.ok(result.data?.retrospectiveFlags.some((flag) => flag.type === "lessons-recorded"));
});

test("calculates assumption accuracy", () => {
  seedRetrospectiveEntries();
  const result = buildDecisionJournalRetrospectiveModel({ workspaceId: WORKSPACE });
  const aligned = result.data?.retrospectives.find((item) => item.entryId === "retro-aligned");
  const exceeded = result.data?.retrospectives.find((item) => item.entryId === "retro-exceeded");
  assert.equal(aligned?.assumptionAccuracy, 1);
  assert.equal(exceeded?.assumptionAccuracy, 0);
});

test("calculates risk realization", () => {
  seedRetrospectiveEntries();
  const result = buildDecisionJournalRetrospectiveModel({ workspaceId: WORKSPACE });
  const partial = result.data?.retrospectives.find((item) => item.entryId === "retro-partial");
  const exceeded = result.data?.retrospectives.find((item) => item.entryId === "retro-exceeded");
  assert.equal(partial?.riskRealization, 0.5);
  assert.equal(exceeded?.riskRealization, 1);
});

test("calculates evidence reliability", () => {
  seedRetrospectiveEntries();
  const result = buildDecisionJournalRetrospectiveModel({ workspaceId: WORKSPACE });
  const aligned = result.data?.retrospectives.find((item) => item.entryId === "retro-aligned");
  const exceeded = result.data?.retrospectives.find((item) => item.entryId === "retro-exceeded");
  assert.equal(aligned?.evidenceReliability, 1);
  assert.equal(exceeded?.evidenceReliability, 0);
});

test("calculates review completeness", () => {
  seedRetrospectiveEntries();
  const result = buildDecisionJournalRetrospectiveModel({ workspaceId: WORKSPACE });
  const aligned = result.data?.retrospectives.find((item) => item.entryId === "retro-aligned");
  const partial = result.data?.retrospectives.find((item) => item.entryId === "retro-partial");
  assert.equal(aligned?.reviewCompleteness, 1);
  assert.equal(partial?.reviewCompleteness, 0.3);
});

test("detects retrospective quality flags", () => {
  seedRetrospectiveEntries();
  const result = buildDecisionJournalRetrospectiveModel({ workspaceId: WORKSPACE });
  const flagTypes = new Set(result.data?.retrospectiveFlags.map((flag) => flag.type));
  assert.ok(flagTypes.has("assumptions-verified"));
  assert.ok(flagTypes.has("assumptions-invalidated"));
  assert.ok(flagTypes.has("risk-realized"));
  assert.ok(flagTypes.has("evidence-reliable"));
  assert.ok(flagTypes.has("evidence-unreliable"));
});

test("keeps confidence within 0–1 bounds", () => {
  seedRetrospectiveEntries();
  const result = buildDecisionJournalRetrospectiveModel({ workspaceId: WORKSPACE });
  for (const retrospective of result.data?.retrospectives ?? []) {
    assert.ok(retrospective.confidence >= 0 && retrospective.confidence <= 1);
  }
  for (const flag of result.data?.retrospectiveFlags ?? []) {
    assert.ok(flag.confidence >= 0 && flag.confidence <= 1);
  }
});

test("does not mutate APP-8 journal entries", () => {
  seedRetrospectiveEntries();
  const before = getDecisionJournalEntryById("retro-aligned");
  buildDecisionJournalRetrospectiveModel({ workspaceId: WORKSPACE });
  const after = getDecisionJournalEntryById("retro-aligned");
  assert.equal(before?.expectedOutcome, after?.expectedOutcome);
  assert.equal(before?.revisionVersion, after?.revisionVersion);
  assert.deepEqual(before?.metadata.extensions, after?.metadata.extensions);
});

test("validates retrospective model contract", () => {
  seedRetrospectiveEntries();
  const result = buildDecisionJournalRetrospectiveModel({ workspaceId: WORKSPACE });
  const validation = validateDecisionJournalRetrospectiveModel(result.data!);
  assert.equal(validation.valid, true, validation.issues.map((issue) => issue.message).join("; "));
});

test("APP-8:5 compatibility validation passes", () => {
  assert.equal(validateEvidenceAssumptionLayerAvailabilityForRetrospective().valid, true);
  const result = buildDecisionJournalRetrospectiveModel({ workspaceId: WORKSPACE });
  assert.equal(
    result.data?.metadata.evidenceAssumptionContractVersion,
    DECISION_JOURNAL_EVIDENCE_ASSUMPTION_CONTRACT_VERSION
  );
});

test("uses APP-8:5 quality evaluators for retrospective metrics", () => {
  seedRetrospectiveEntries();
  const entry = getDecisionJournalEntryById("retro-aligned");
  assert.ok(entry);
  const evidence = evaluateDecisionJournalEvidence(entry);
  const assumption = evaluateDecisionJournalAssumptions(entry, buildWorkspaceAssumptionCounts([entry]));
  assert.equal(calculateEvidenceReliability(entry, evidence), 1);
  assert.equal(calculateAssumptionAccuracy(entry, assumption), 1);
});

test("certification runner passes all checks", () => {
  const certification = runDecisionJournalRetrospectiveCertification();
  assert.equal(
    certification.status,
    "PASS",
    certification.checks.filter((entry) => !entry.passed).map((entry) => `${entry.id}: ${entry.evidence}`).join("; ")
  );
  assert.equal(certification.certified, true);
  assert.equal(certification.score, 100);
});
