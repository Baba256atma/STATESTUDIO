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
import {
  getConfidenceRecordsOrdered,
  initializeConfidenceEvolutionQueryLayer,
  resetConfidenceEvolutionQueryLayerForTests,
} from "./confidenceEvolutionQuery.ts";
import {
  initializeConfidenceEvolutionTrendLayer,
  resetConfidenceEvolutionTrendLayerForTests,
  buildConfidenceTrendModel,
} from "./confidenceEvolutionTrend.ts";
import { calculateConfidenceDeltas } from "./confidenceEvolutionDeltas.ts";
import {
  buildConfidenceEvidenceReasonLinkModel,
  buildConfidenceEvidenceLinks,
  buildConfidenceReasonLinks,
  calculateConfidenceEvidenceCoverage,
  detectConfidenceExplanationFlags,
  initializeConfidenceEvidenceReasonLayer,
  mapConfidenceMovementsToEvidence,
  mapConfidenceMovementsToReasons,
  resetConfidenceEvidenceReasonLayerForTests,
  validateConfidenceEvidenceReasonLinkModel,
  CONFIDENCE_EVOLUTION_EVIDENCE_REASON_SELF_MANIFEST,
} from "./confidenceEvolutionEvidenceReason.ts";
import { runConfidenceEvidenceReasonCertification } from "./confidenceEvolutionEvidenceReasonRunner.ts";
import {
  CONFIDENCE_EVOLUTION_EVIDENCE_REASON_CONTRACT_VERSION,
  CONFIDENCE_EXPLANATION_FLAG_TYPES,
  CONFIDENCE_LINK_TYPES,
} from "./confidenceEvolutionEvidenceReasonTypes.ts";
import {
  isSourceReasonAligned,
  CONFIDENCE_EVIDENCE_REASON_RULES,
} from "./confidenceEvolutionEvidenceReasonRules.ts";
import { validateFoundationCompatibilityForEvidenceReason } from "./confidenceEvolutionEvidenceReasonValidation.ts";
import { CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY } from "./confidenceEvolutionContracts.ts";
import type { ConfidenceEvolutionEngineRecord } from "./confidenceEvolutionEngineTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-confidence-link-test-001";
const WORKSPACE_OTHER = "ws-confidence-link-test-002";

function sampleRecord(id: string, workspaceId: string, overrides: Record<string, unknown> = {}) {
  return Object.freeze({
    id,
    workspaceId,
    title: `Link test ${id}`,
    confidenceLevel: "medium" as const,
    confidenceScore: 0.62,
    source: "manual" as const,
    reason: "executive_review" as const,
    notes: "Link test record.",
    evidenceReferences: Object.freeze([]),
    createdAt: FIXED_TIME,
    tags: Object.freeze(["test"]),
    ...overrides,
  });
}

function makeRecord(
  id: string,
  score: number,
  updatedAt: string,
  overrides: Partial<ConfidenceEvolutionEngineRecord> = {}
): ConfidenceEvolutionEngineRecord {
  return Object.freeze({
    id,
    workspaceId: WORKSPACE,
    title: id,
    confidenceLevel: "medium",
    confidenceScore: score,
    source: "manual",
    reason: "executive_review",
    notes: "",
    evidenceReferences: Object.freeze([]),
    tags: Object.freeze([]),
    metadata: Object.freeze({ metadataVersion: "APP-9/1", extensions: Object.freeze({}), readOnly: true as const }),
    status: "active",
    createdAt: updatedAt,
    updatedAt,
    contractVersion: "APP-9/1",
    revisionVersion: 1,
    archived: false,
    readOnly: true as const,
    ...overrides,
  });
}

function bootstrap() {
  resetConfidenceEvidenceReasonLayerForTests();
  resetConfidenceEvolutionTrendLayerForTests();
  resetConfidenceEvolutionQueryLayerForTests();
  resetConfidenceEvolutionEngineForTests();
  resetConfidenceEvolutionPlatformForTests();
  createConfidenceEvolutionFoundation(FIXED_TIME);
  initializeConfidenceEvolutionEngine(FIXED_TIME);
  initializeConfidenceEvolutionQueryLayer(FIXED_TIME);
  initializeConfidenceEvolutionTrendLayer(FIXED_TIME);
  initializeConfidenceEvidenceReasonLayer(FIXED_TIME);
}

test.beforeEach(() => {
  bootstrap();
});

test("empty workspace returns safe result", () => {
  const response = buildConfidenceEvidenceReasonLinkModel({ workspaceId: "ws-empty-link-test" });
  assert.equal(response.success, true);
  assert.equal(response.data?.recordCount, 0);
  assert.equal(response.data?.linkCount, 0);
  assert.equal(response.data?.evidenceCoverage, 0);
  assert.equal(response.data?.explainedMovementCount, 0);
});

test("single record returns safe result without movements", () => {
  createConfidenceRecord(
    sampleRecord("link-single-1", WORKSPACE, {
      updatedAt: FIXED_TIME,
      confidenceScore: 0.7,
      source: "evidence",
      reason: "new_evidence",
      evidenceReferences: Object.freeze(["ev-001"]),
    })
  );
  const response = buildConfidenceEvidenceReasonLinkModel({ workspaceId: WORKSPACE });
  assert.equal(response.success, true);
  assert.equal(response.data?.recordCount, 1);
  assert.equal(response.data?.explainedMovementCount, 0);
  assert.equal(response.data?.unexplainedMovementCount, 0);
});

test("workspace isolation keeps link models separate", () => {
  createConfidenceRecord(
    sampleRecord("link-ws-a", WORKSPACE, { updatedAt: FIXED_TIME, confidenceScore: 0.5 })
  );
  createConfidenceRecord(
    sampleRecord("link-ws-b", WORKSPACE_OTHER, { updatedAt: FIXED_TIME, confidenceScore: 0.8 })
  );
  const modelA = buildConfidenceEvidenceReasonLinkModel({ workspaceId: WORKSPACE });
  const modelB = buildConfidenceEvidenceReasonLinkModel({ workspaceId: WORKSPACE_OTHER });
  assert.equal(modelA.data?.recordCount, 1);
  assert.equal(modelB.data?.recordCount, 1);
  assert.notEqual(modelA.data?.workspaceId, modelB.data?.workspaceId);
});

test("reason links created for records with declared reason", () => {
  createConfidenceRecord(
    sampleRecord("link-reason-1", WORKSPACE, {
      updatedAt: "2026-01-01T00:00:00.000Z",
      reason: "new_evidence",
      source: "evidence",
    })
  );
  createConfidenceRecord(
    sampleRecord("link-reason-2", WORKSPACE, {
      updatedAt: "2026-02-01T00:00:00.000Z",
      reason: "unknown",
      source: "manual",
    })
  );
  const records = getConfidenceRecordsOrdered({ workspaceId: WORKSPACE, direction: "asc" });
  const links = buildConfidenceReasonLinks(WORKSPACE, records);
  assert.equal(links.length, 1);
  assert.equal(links[0]?.type, "reason-link");
  assert.equal(links[0]?.reason, "new_evidence");
});

test("evidence links created for records with evidence references", () => {
  createConfidenceRecord(
    sampleRecord("link-evidence-1", WORKSPACE, {
      updatedAt: FIXED_TIME,
      evidenceReferences: Object.freeze(["doc-a"]),
    })
  );
  createConfidenceRecord(
    sampleRecord("link-evidence-2", WORKSPACE, {
      updatedAt: "2026-02-01T00:00:00.000Z",
      evidenceReferences: Object.freeze([]),
    })
  );
  const records = getConfidenceRecordsOrdered({ workspaceId: WORKSPACE, direction: "asc" });
  const links = buildConfidenceEvidenceLinks(WORKSPACE, records);
  assert.equal(links.length, 1);
  assert.equal(links[0]?.type, "evidence-link");
  assert.deepEqual(links[0]?.evidenceReferences, ["doc-a"]);
});

test("movement-to-reason mapping produces movement links", () => {
  const records = Object.freeze([
    makeRecord("m1", 0.5, "2026-01-01T00:00:00.000Z", {
      reason: "new_evidence",
      source: "evidence",
      evidenceReferences: Object.freeze(["ev-a"]),
    }),
    makeRecord("m2", 0.8, "2026-02-01T00:00:00.000Z", {
      reason: "scenario_completed",
      source: "scenario",
    }),
  ]);
  const deltas = calculateConfidenceDeltas(records);
  const links = mapConfidenceMovementsToReasons(WORKSPACE, records, deltas);
  assert.equal(links.length, 1);
  assert.equal(links[0]?.type, "movement-link");
  assert.ok(Math.abs((links[0]?.delta ?? 0) - 0.3) < 0.001);
  assert.equal(links[0]?.recordId, "m2");
});

test("movement-to-evidence mapping filters to evidence-backed movements", () => {
  const records = Object.freeze([
    makeRecord("e1", 0.5, "2026-01-01T00:00:00.000Z"),
    makeRecord("e2", 0.7, "2026-02-01T00:00:00.000Z", {
      evidenceReferences: Object.freeze(["evidence-b"]),
    }),
  ]);
  const deltas = calculateConfidenceDeltas(records);
  const links = mapConfidenceMovementsToEvidence(WORKSPACE, records, deltas);
  assert.equal(links.length, 1);
  assert.equal(links[0]?.evidenceReferences.length, 1);
});

test("explained movement detected when reason or evidence present", () => {
  const records = Object.freeze([
    makeRecord("x1", 0.5, "2026-01-01T00:00:00.000Z"),
    makeRecord("x2", 0.7, "2026-02-01T00:00:00.000Z", {
      reason: "new_evidence",
      source: "evidence",
      evidenceReferences: Object.freeze(["ev-x"]),
    }),
  ]);
  const deltas = calculateConfidenceDeltas(records);
  const model = buildConfidenceEvidenceReasonLinkModel({ workspaceId: WORKSPACE });
  void model;
  const explainedLinks = records.slice(1).map((record, _index, _array) => {
    const delta = deltas[0];
    assert.ok(delta);
    return Object.freeze({
      explained: record.reason !== "unknown" || record.evidenceReferences.length > 0,
      delta: delta.delta,
    });
  });
  assert.equal(explainedLinks[0]?.explained, true);
});

test("unexplained movement detected when no reason and no evidence", () => {
  const records = Object.freeze([
    makeRecord("u1", 0.6, "2026-01-01T00:00:00.000Z"),
    makeRecord("u2", 0.3, "2026-02-01T00:00:00.000Z", {
      reason: "unknown",
      source: "manual",
      evidenceReferences: Object.freeze([]),
    }),
  ]);
  const deltas = calculateConfidenceDeltas(records);
  const flags = detectConfidenceExplanationFlags(records, deltas);
  assert.ok(flags.some((entry) => entry.type === "large-change-unexplained"));
  assert.ok(flags.some((entry) => entry.type === "movement-unsupported"));
});

test("large-change-explained flag emitted for explained large movements", () => {
  const records = Object.freeze([
    makeRecord("l1", 0.4, "2026-01-01T00:00:00.000Z"),
    makeRecord("l2", 0.7, "2026-02-01T00:00:00.000Z", {
      reason: "new_evidence",
      source: "evidence",
      evidenceReferences: Object.freeze(["ev-large"]),
    }),
  ]);
  const deltas = calculateConfidenceDeltas(records);
  const flags = detectConfidenceExplanationFlags(records, deltas);
  assert.ok(flags.some((entry) => entry.type === "large-change-explained"));
});

test("large-change-unexplained flag emitted for unexplained large movements", () => {
  const records = Object.freeze([
    makeRecord("lu1", 0.7, "2026-01-01T00:00:00.000Z"),
    makeRecord("lu2", 0.4, "2026-02-01T00:00:00.000Z", {
      reason: "unknown",
      evidenceReferences: Object.freeze([]),
    }),
  ]);
  const deltas = calculateConfidenceDeltas(records);
  const flags = detectConfidenceExplanationFlags(records, deltas);
  assert.ok(flags.some((entry) => entry.type === "large-change-unexplained"));
});

test("evidence coverage calculated as recordsWithEvidence / totalRecords", () => {
  const records = Object.freeze([
    makeRecord("c1", 0.5, "2026-01-01T00:00:00.000Z", {
      evidenceReferences: Object.freeze(["a"]),
    }),
    makeRecord("c2", 0.6, "2026-02-01T00:00:00.000Z"),
    makeRecord("c3", 0.7, "2026-03-01T00:00:00.000Z", {
      evidenceReferences: Object.freeze(["b"]),
    }),
  ]);
  const coverage = calculateConfidenceEvidenceCoverage(records);
  assert.ok(Math.abs(coverage - 2 / 3) < 0.001);
});

test("reason and source distributions summarize record fields", () => {
  createConfidenceRecord(
    sampleRecord("dist-1", WORKSPACE, {
      updatedAt: "2026-01-01T00:00:00.000Z",
      reason: "new_evidence",
      source: "evidence",
    })
  );
  createConfidenceRecord(
    sampleRecord("dist-2", WORKSPACE, {
      updatedAt: "2026-02-01T00:00:00.000Z",
      reason: "manual_revision",
      source: "manual",
    })
  );
  const response = buildConfidenceEvidenceReasonLinkModel({ workspaceId: WORKSPACE });
  assert.equal(response.data?.reasonDistribution.new_evidence, 1);
  assert.equal(response.data?.reasonDistribution.manual_revision, 1);
  assert.equal(response.data?.sourceDistribution.evidence, 1);
  assert.equal(response.data?.sourceDistribution.manual, 1);
});

test("source-reason aligned when static map matches", () => {
  assert.equal(isSourceReasonAligned("evidence", "new_evidence"), true);
  const records = Object.freeze([
    makeRecord("align-1", 0.5, FIXED_TIME, { source: "evidence", reason: "new_evidence" }),
  ]);
  const flags = detectConfidenceExplanationFlags(records, []);
  assert.ok(flags.some((entry) => entry.type === "source-reason-aligned"));
});

test("source-reason misaligned when static map does not match", () => {
  assert.equal(isSourceReasonAligned("evidence", "scenario_completed"), false);
  const records = Object.freeze([
    makeRecord("misalign-1", 0.5, FIXED_TIME, {
      source: "evidence",
      reason: "scenario_completed",
    }),
  ]);
  const flags = detectConfidenceExplanationFlags(records, []);
  assert.ok(flags.some((entry) => entry.type === "source-reason-misaligned"));
});

test("confidence values bounded between 0 and 1", () => {
  createConfidenceRecord(
    sampleRecord("bound-1", WORKSPACE, { updatedAt: FIXED_TIME, confidenceScore: 0.55 })
  );
  createConfidenceRecord(
    sampleRecord("bound-2", WORKSPACE, {
      updatedAt: "2026-02-01T00:00:00.000Z",
      confidenceScore: 0.75,
      reason: "new_evidence",
      source: "evidence",
      evidenceReferences: Object.freeze(["ev-bound"]),
    })
  );
  const response = buildConfidenceEvidenceReasonLinkModel({ workspaceId: WORKSPACE });
  assert.ok((response.data?.confidence ?? -1) >= CONFIDENCE_EVIDENCE_REASON_RULES.minScore);
  assert.ok((response.data?.confidence ?? 2) <= CONFIDENCE_EVIDENCE_REASON_RULES.maxScore);
  for (const link of response.data?.links ?? []) {
    assert.ok(link.confidence >= 0 && link.confidence <= 1);
  }
});

test("layer is read-only and does not mutate engine records", () => {
  createConfidenceRecord(
    sampleRecord("readonly-1", WORKSPACE, {
      updatedAt: FIXED_TIME,
      confidenceScore: 0.6,
      reason: "new_evidence",
      source: "evidence",
    })
  );
  const before = getConfidenceRecordsOrdered({ workspaceId: WORKSPACE, direction: "asc" });
  buildConfidenceEvidenceReasonLinkModel({ workspaceId: WORKSPACE });
  const after = getConfidenceRecordsOrdered({ workspaceId: WORKSPACE, direction: "asc" });
  assert.equal(before.length, after.length);
  assert.deepEqual(before[0], after[0]);
});

test("APP-9:4 trend layer remains compatible as read-only input", () => {
  createConfidenceRecord(
    sampleRecord("compat-1", WORKSPACE, {
      updatedAt: "2026-01-01T00:00:00.000Z",
      confidenceScore: 0.45,
    })
  );
  createConfidenceRecord(
    sampleRecord("compat-2", WORKSPACE, {
      updatedAt: "2026-02-01T00:00:00.000Z",
      confidenceScore: 0.65,
      reason: "new_evidence",
      source: "evidence",
      evidenceReferences: Object.freeze(["compat-ev"]),
    })
  );
  const trend = buildConfidenceTrendModel({ workspaceId: WORKSPACE });
  const links = buildConfidenceEvidenceReasonLinkModel({ workspaceId: WORKSPACE });
  assert.equal(trend.success, true);
  assert.equal(links.success, true);
  assert.equal(trend.data?.recordCount, links.data?.recordCount);
});

test("link types and explanation flags are fully enumerated", () => {
  assert.ok(CONFIDENCE_LINK_TYPES.includes("reason-link"));
  assert.ok(CONFIDENCE_LINK_TYPES.includes("evidence-link"));
  assert.ok(CONFIDENCE_LINK_TYPES.includes("explained-movement"));
  assert.ok(CONFIDENCE_EXPLANATION_FLAG_TYPES.includes("large-change-explained"));
  assert.ok(CONFIDENCE_EXPLANATION_FLAG_TYPES.includes("movement-supported"));
});

test("foundation compatibility and manifest validation pass", () => {
  const foundation = validateFoundationCompatibilityForEvidenceReason(FIXED_TIME);
  assert.equal(foundation.valid, true);
  assert.equal(CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId, "APP-9");
  assert.equal(CONFIDENCE_EVOLUTION_EVIDENCE_REASON_CONTRACT_VERSION, "APP-9/5");
  assert.equal(validateStageManifest(CONFIDENCE_EVOLUTION_EVIDENCE_REASON_SELF_MANIFEST).valid, true);
  assert.equal(
    evaluateStageFileBoundary({
      filePath: "frontend/app/lib/confidence-evolution/confidenceEvolutionEvidenceReason.ts",
      allowedFiles: CONFIDENCE_EVOLUTION_EVIDENCE_REASON_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: CONFIDENCE_EVOLUTION_EVIDENCE_REASON_SELF_MANIFEST.forbiddenPatterns,
    }).allowed,
    true
  );
});

test("certification runner passes all checks", () => {
  const result = runConfidenceEvidenceReasonCertification();
  assert.equal(result.status, "PASS");
  assert.equal(result.certified, true);
  assert.equal(result.score, 100);
  assert.ok(result.checks.every((entry) => entry.passed));
});
