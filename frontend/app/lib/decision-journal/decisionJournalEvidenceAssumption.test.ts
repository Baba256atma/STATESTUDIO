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
  initializeDecisionJournalQueryLayer,
  resetDecisionJournalQueryLayerForTests,
} from "./decisionJournalQuery.ts";
import {
  initializeDecisionJournalReflectionLayer,
  resetDecisionJournalReflectionLayerForTests,
} from "./decisionJournalReflection.ts";
import { calculateAssumptionCoverage } from "./decisionJournalAssumptionRules.ts";
import { calculateEvidenceStrength } from "./decisionJournalEvidenceRules.ts";
import {
  buildDecisionJournalEvidenceAssumptionModel,
  calculateEvidenceStrength as exportedCalculateEvidenceStrength,
  initializeDecisionJournalEvidenceAssumptionLayer,
  resetDecisionJournalEvidenceAssumptionLayerForTests,
  validateDecisionJournalEvidenceAssumptionModel,
  DECISION_JOURNAL_EVIDENCE_ASSUMPTION_SELF_MANIFEST,
} from "./decisionJournalEvidenceAssumption.ts";
import { runDecisionJournalEvidenceAssumptionCertification } from "./decisionJournalEvidenceAssumptionRunner.ts";
import { DECISION_JOURNAL_REFLECTION_CONTRACT_VERSION } from "./decisionJournalReflectionTypes.ts";
import { validateReflectionLayerAvailabilityForEvidenceAssumption } from "./decisionJournalEvidenceAssumptionValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-evidence-test-001";

function sampleEntry(id: string, overrides: Record<string, unknown> = {}) {
  return Object.freeze({
    id,
    workspaceId: WORKSPACE,
    title: `Journal ${id}`,
    summary: "Evidence test entry summary.",
    rationale: "Executive rationale for evidence test.",
    expectedOutcome: "Validated evidence and assumption quality.",
    confidence: "medium" as const,
    author: "test-runner",
    source: "manual" as const,
    createdAt: FIXED_TIME,
    tags: Object.freeze(["test"]),
    ...overrides,
  });
}

function bootstrap() {
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
}

function seedQualityEntries() {
  createDecisionJournalEntry(
    sampleEntry("quality-strong", {
      evidenceReferences: Object.freeze(["ref-a", "ref-b", "ref-c"]),
      assumptions: Object.freeze(["Demand stable", "Budget approved"]),
      acceptedRisks: Object.freeze(["Execution delay"]),
      confidence: "high",
    })
  );
  createDecisionJournalEntry(
    sampleEntry("quality-weak", {
      evidenceReferences: Object.freeze(["ref-single"]),
      assumptions: Object.freeze(["Demand stable"]),
      acceptedRisks: Object.freeze(["Execution delay", "Vendor delay"]),
      confidence: "very_high",
    })
  );
  createDecisionJournalEntry(
    sampleEntry("quality-none", {
      evidenceReferences: Object.freeze([]),
      assumptions: Object.freeze(["Legacy stable", "Team ready", "Budget approved", "Timeline feasible"]),
      acceptedRisks: Object.freeze(["Legacy stable"]),
      confidence: "very_high",
    })
  );
  createDecisionJournalEntry(
    sampleEntry("quality-other-ws", {
      workspaceId: "ws-evidence-test-002",
      evidenceReferences: Object.freeze(["isolated-ref"]),
      assumptions: Object.freeze(["Isolated assumption"]),
    })
  );
}

test.beforeEach(() => {
  bootstrap();
});

test("validates stage manifest and architecture boundary", () => {
  const manifestValidation = validateStageManifest(DECISION_JOURNAL_EVIDENCE_ASSUMPTION_SELF_MANIFEST);
  assert.equal(manifestValidation.valid, true, manifestValidation.issues.map((issue) => issue.message).join("; "));
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/decision-journal/decisionJournalEvidenceAssumption.ts",
    allowedFiles: DECISION_JOURNAL_EVIDENCE_ASSUMPTION_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: DECISION_JOURNAL_EVIDENCE_ASSUMPTION_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("returns safe empty journal quality model", () => {
  const result = buildDecisionJournalEvidenceAssumptionModel({ workspaceId: "ws-empty" });
  assert.equal(result.success, true);
  assert.equal(result.data?.entryCount, 0);
  assert.equal(result.data?.qualityFlags.length, 0);
});

test("enforces workspace isolation", () => {
  seedQualityEntries();
  const ws1 = buildDecisionJournalEvidenceAssumptionModel({ workspaceId: WORKSPACE });
  const ws2 = buildDecisionJournalEvidenceAssumptionModel({ workspaceId: "ws-evidence-test-002" });
  assert.equal(ws1.data?.entryCount, 3);
  assert.equal(ws2.data?.entryCount, 1);
});

test("calculates evidence strength none", () => {
  assert.equal(calculateEvidenceStrength(0), "none");
  assert.equal(exportedCalculateEvidenceStrength(0), "none");
});

test("calculates evidence strength weak", () => {
  assert.equal(calculateEvidenceStrength(1), "weak");
});

test("calculates evidence strength moderate", () => {
  assert.equal(calculateEvidenceStrength(2), "moderate");
});

test("calculates evidence strength strong", () => {
  assert.equal(calculateEvidenceStrength(3), "strong");
});

test("calculates evidence coverage", () => {
  seedQualityEntries();
  const result = buildDecisionJournalEvidenceAssumptionModel({ workspaceId: WORKSPACE });
  const strong = result.data?.evidenceModels.find((model) => model.entryId === "quality-strong");
  const none = result.data?.evidenceModels.find((model) => model.entryId === "quality-none");
  assert.ok((strong?.evidenceCoverage ?? 0) > 0);
  assert.equal(none?.evidenceCoverage, 0);
});

test("calculates assumption coverage none", () => {
  assert.equal(calculateAssumptionCoverage(0), "none");
});

test("calculates assumption coverage low medium and high", () => {
  assert.equal(calculateAssumptionCoverage(1), "low");
  assert.equal(calculateAssumptionCoverage(2), "medium");
  assert.equal(calculateAssumptionCoverage(4), "high");
});

test("detects repeated assumptions", () => {
  seedQualityEntries();
  const result = buildDecisionJournalEvidenceAssumptionModel({ workspaceId: WORKSPACE });
  const weak = result.data?.assumptionModels.find((model) => model.entryId === "quality-weak");
  const strong = result.data?.assumptionModels.find((model) => model.entryId === "quality-strong");
  assert.ok(weak?.repeatedAssumptions.includes("Demand stable"));
  assert.ok(strong?.repeatedAssumptions.includes("Demand stable"));
});

test("detects unsupported assumptions", () => {
  seedQualityEntries();
  const result = buildDecisionJournalEvidenceAssumptionModel({ workspaceId: WORKSPACE });
  const none = result.data?.assumptionModels.find((model) => model.entryId === "quality-none");
  assert.ok((none?.unsupportedAssumptions.length ?? 0) >= 1);
});

test("detects no-evidence flag", () => {
  seedQualityEntries();
  const result = buildDecisionJournalEvidenceAssumptionModel({ workspaceId: WORKSPACE });
  assert.ok(result.data?.qualityFlags.some((flag) => flag.type === "no-evidence"));
});

test("detects weak-evidence flag", () => {
  seedQualityEntries();
  const result = buildDecisionJournalEvidenceAssumptionModel({ workspaceId: WORKSPACE });
  assert.ok(result.data?.qualityFlags.some((flag) => flag.type === "weak-evidence"));
});

test("detects high-confidence-weak-evidence flag", () => {
  seedQualityEntries();
  const result = buildDecisionJournalEvidenceAssumptionModel({ workspaceId: WORKSPACE });
  assert.ok(result.data?.qualityFlags.some((flag) => flag.type === "high-confidence-weak-evidence"));
});

test("detects many-assumptions flag", () => {
  seedQualityEntries();
  const result = buildDecisionJournalEvidenceAssumptionModel({ workspaceId: WORKSPACE });
  assert.ok(result.data?.qualityFlags.some((flag) => flag.type === "many-assumptions"));
});

test("detects risk-without-evidence flag", () => {
  seedQualityEntries();
  const result = buildDecisionJournalEvidenceAssumptionModel({ workspaceId: WORKSPACE });
  assert.ok(result.data?.qualityFlags.some((flag) => flag.type === "risk-without-evidence"));
});

test("detects assumption-risk-overlap flag", () => {
  seedQualityEntries();
  const result = buildDecisionJournalEvidenceAssumptionModel({ workspaceId: WORKSPACE });
  assert.ok(result.data?.qualityFlags.some((flag) => flag.type === "assumption-risk-overlap"));
});

test("detects evidence-balanced flag", () => {
  createDecisionJournalEntry(
    sampleEntry("quality-balanced", {
      evidenceReferences: Object.freeze(["ref-a", "ref-b"]),
      assumptions: Object.freeze(["Single assumption"]),
      confidence: "medium",
    })
  );
  const result = buildDecisionJournalEvidenceAssumptionModel({ workspaceId: WORKSPACE });
  assert.ok(result.data?.qualityFlags.some((flag) => flag.type === "evidence-balanced"));
});

test("detects evidence-strong flag", () => {
  seedQualityEntries();
  const result = buildDecisionJournalEvidenceAssumptionModel({ workspaceId: WORKSPACE });
  assert.ok(result.data?.qualityFlags.some((flag) => flag.type === "evidence-strong"));
});

test("keeps confidence within 0–1 bounds", () => {
  seedQualityEntries();
  const result = buildDecisionJournalEvidenceAssumptionModel({ workspaceId: WORKSPACE });
  for (const model of result.data?.evidenceModels ?? []) {
    assert.ok(model.confidence >= 0 && model.confidence <= 1);
    assert.ok(model.confidenceEvidenceAlignment >= 0 && model.confidenceEvidenceAlignment <= 1);
    assert.ok(model.riskEvidenceAlignment >= 0 && model.riskEvidenceAlignment <= 1);
  }
  for (const model of result.data?.assumptionModels ?? []) {
    assert.ok(model.confidence >= 0 && model.confidence <= 1);
  }
  for (const flag of result.data?.qualityFlags ?? []) {
    assert.ok(flag.confidence >= 0 && flag.confidence <= 1);
  }
});

test("validates evidence assumption model contract", () => {
  seedQualityEntries();
  const result = buildDecisionJournalEvidenceAssumptionModel({ workspaceId: WORKSPACE });
  const validation = validateDecisionJournalEvidenceAssumptionModel(result.data!);
  assert.equal(validation.valid, true, validation.issues.map((issue) => issue.message).join("; "));
});

test("APP-8:4 compatibility validation passes", () => {
  assert.equal(validateReflectionLayerAvailabilityForEvidenceAssumption().valid, true);
  const result = buildDecisionJournalEvidenceAssumptionModel({ workspaceId: WORKSPACE });
  assert.equal(result.data?.metadata.reflectionContractVersion, DECISION_JOURNAL_REFLECTION_CONTRACT_VERSION);
});

test("certification runner passes all checks", () => {
  const certification = runDecisionJournalEvidenceAssumptionCertification();
  assert.equal(
    certification.status,
    "PASS",
    certification.checks.filter((entry) => !entry.passed).map((entry) => `${entry.id}: ${entry.evidence}`).join("; ")
  );
  assert.equal(certification.certified, true);
  assert.equal(certification.score, 100);
});
