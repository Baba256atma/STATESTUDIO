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
} from "./confidenceEvolutionTrend.ts";
import {
  buildConfidenceEvidenceReasonLinkModel,
  initializeConfidenceEvidenceReasonLayer,
  resetConfidenceEvidenceReasonLayerForTests,
} from "./confidenceEvolutionEvidenceReason.ts";
import {
  buildConfidenceCalibrationModel,
  calculateConfidenceAccuracyScore,
  calculateConfidenceCalibrationScore,
  classifyConfidenceAccuracyLevel,
  classifyConfidenceCalibrationStatus,
  detectConfidenceCalibrationFlags,
  evaluateConfidenceCalibration,
  initializeConfidenceCalibrationLayer,
  resetConfidenceCalibrationLayerForTests,
  validateConfidenceCalibrationModel,
  CONFIDENCE_EVOLUTION_CALIBRATION_SELF_MANIFEST,
} from "./confidenceEvolutionCalibration.ts";
import { runConfidenceCalibrationCertification } from "./confidenceEvolutionCalibrationRunner.ts";
import {
  CONFIDENCE_ACCURACY_LEVELS,
  CONFIDENCE_CALIBRATION_FLAG_TYPES,
  CONFIDENCE_CALIBRATION_STATUSES,
  CONFIDENCE_EVOLUTION_CALIBRATION_CONTRACT_VERSION,
} from "./confidenceEvolutionCalibrationTypes.ts";
import {
  calculateRecordEvidenceSupportScore,
  CONFIDENCE_CALIBRATION_RULES,
} from "./confidenceEvolutionCalibrationRules.ts";
import { validateFoundationCompatibilityForCalibration } from "./confidenceEvolutionCalibrationValidation.ts";
import { CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY } from "./confidenceEvolutionContracts.ts";
import type { ConfidenceEvolutionEngineRecord } from "./confidenceEvolutionEngineTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-confidence-calibration-test-001";
const WORKSPACE_OTHER = "ws-confidence-calibration-test-002";

function sampleRecord(id: string, workspaceId: string, overrides: Record<string, unknown> = {}) {
  return Object.freeze({
    id,
    workspaceId,
    title: `Calibration test ${id}`,
    confidenceLevel: "medium" as const,
    confidenceScore: 0.62,
    source: "manual" as const,
    reason: "executive_review" as const,
    notes: "Calibration test record.",
    evidenceReferences: Object.freeze([]),
    createdAt: FIXED_TIME,
    tags: Object.freeze(["test"]),
    ...overrides,
  });
}

function makeRecord(
  id: string,
  score: number,
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
    createdAt: FIXED_TIME,
    updatedAt: FIXED_TIME,
    contractVersion: "APP-9/1",
    revisionVersion: 1,
    archived: false,
    readOnly: true as const,
    ...overrides,
  });
}

function bootstrap() {
  resetConfidenceCalibrationLayerForTests();
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
  initializeConfidenceCalibrationLayer(FIXED_TIME);
}

test.beforeEach(() => {
  bootstrap();
});

test("empty workspace returns safe result", () => {
  const response = buildConfidenceCalibrationModel({ workspaceId: "ws-calibration-empty" });
  assert.equal(response.success, true);
  assert.equal(response.data?.recordCount, 0);
  assert.equal(response.data?.averageCalibrationScore, 0);
  assert.equal(response.data?.averageAccuracyScore, 0);
});

test("single record returns safe result", () => {
  createConfidenceRecord(
    sampleRecord("cal-single", WORKSPACE, {
      updatedAt: FIXED_TIME,
      confidenceScore: 0.75,
      source: "evidence",
      reason: "new_evidence",
      evidenceReferences: Object.freeze(["ev-001"]),
    })
  );
  const response = buildConfidenceCalibrationModel({ workspaceId: WORKSPACE });
  assert.equal(response.success, true);
  assert.equal(response.data?.recordCount, 1);
  assert.equal(response.data?.recordCalibrations.length, 1);
});

test("workspace isolation keeps calibration models separate", () => {
  createConfidenceRecord(sampleRecord("cal-a", WORKSPACE, { updatedAt: FIXED_TIME, confidenceScore: 0.5 }));
  createConfidenceRecord(
    sampleRecord("cal-b", WORKSPACE_OTHER, { updatedAt: FIXED_TIME, confidenceScore: 0.8 })
  );
  const modelA = buildConfidenceCalibrationModel({ workspaceId: WORKSPACE });
  const modelB = buildConfidenceCalibrationModel({ workspaceId: WORKSPACE_OTHER });
  assert.equal(modelA.data?.recordCount, 1);
  assert.equal(modelB.data?.recordCount, 1);
});

test("calibrated status when gap within threshold", () => {
  const status = classifyConfidenceCalibrationStatus(0.75, "new_evidence", ["ev-a"]);
  assert.equal(status, "calibrated");
});

test("overconfident status when gap exceeds threshold", () => {
  const status = classifyConfidenceCalibrationStatus(0.9, "manual_revision", []);
  assert.equal(status, "overconfident");
});

test("underconfident status when gap below negative threshold", () => {
  const status = classifyConfidenceCalibrationStatus(0.3, "new_evidence", ["a", "b"]);
  assert.equal(status, "underconfident");
});

test("weakly supported status for reason-only moderate confidence", () => {
  const status = classifyConfidenceCalibrationStatus(0.65, "manual_revision", []);
  assert.equal(status, "weakly_supported");
});

test("unsupported status for high confidence without evidence or reason", () => {
  const status = classifyConfidenceCalibrationStatus(0.8, "unknown", []);
  assert.equal(status, "unsupported");
});

test("unknown status for indeterminate record", () => {
  const status = classifyConfidenceCalibrationStatus(0.3, "unknown", []);
  assert.equal(status, "unknown");
});

test("accuracy levels classify deterministically", () => {
  assert.equal(classifyConfidenceAccuracyLevel(0.1), "unknown");
  assert.equal(classifyConfidenceAccuracyLevel(0.3), "low");
  assert.equal(classifyConfidenceAccuracyLevel(0.5), "medium");
  assert.equal(classifyConfidenceAccuracyLevel(0.7), "high");
  assert.equal(classifyConfidenceAccuracyLevel(0.9), "very_high");
});

test("calibration score equals one minus absolute gap", () => {
  const support = calculateRecordEvidenceSupportScore("new_evidence", ["ev-a"]);
  const score = calculateConfidenceCalibrationScore(0.75, support);
  assert.ok(Math.abs(score - (1 - Math.abs(0.75 - support))) < 0.001);
});

test("accuracy score equals one minus absolute gap clamped", () => {
  const score = calculateConfidenceAccuracyScore(0.9, 0.35);
  assert.ok(Math.abs(score - 0.45) < 0.001);
  assert.ok(score >= CONFIDENCE_CALIBRATION_RULES.minScore);
  assert.ok(score <= CONFIDENCE_CALIBRATION_RULES.maxScore);
});

test("calibration flags detect high-confidence-low-evidence", () => {
  const records = Object.freeze([
    makeRecord("flag-1", 0.85, { reason: "manual_revision", source: "manual" }),
  ]);
  const flags = detectConfidenceCalibrationFlags(records, 0);
  assert.ok(flags.some((entry) => entry.type === "high-confidence-low-evidence"));
});

test("status and accuracy distributions summarize record calibrations", () => {
  createConfidenceRecord(
    sampleRecord("dist-1", WORKSPACE, {
      updatedAt: "2026-01-01T00:00:00.000Z",
      confidenceScore: 0.75,
      source: "evidence",
      reason: "new_evidence",
      evidenceReferences: Object.freeze(["ev-a"]),
    })
  );
  createConfidenceRecord(
    sampleRecord("dist-2", WORKSPACE, {
      updatedAt: "2026-02-01T00:00:00.000Z",
      confidenceScore: 0.9,
      source: "manual",
      reason: "manual_revision",
    })
  );
  const response = buildConfidenceCalibrationModel({ workspaceId: WORKSPACE });
  assert.ok((response.data?.calibrationStatusDistribution.calibrated ?? 0) >= 1);
  assert.ok((response.data?.calibrationStatusDistribution.overconfident ?? 0) >= 1);
  assert.ok(Object.keys(response.data?.accuracyLevelDistribution ?? {}).length >= 1);
});

test("average calibration and accuracy scores are computed", () => {
  createConfidenceRecord(
    sampleRecord("avg-1", WORKSPACE, {
      updatedAt: "2026-01-01T00:00:00.000Z",
      confidenceScore: 0.75,
      source: "evidence",
      reason: "new_evidence",
      evidenceReferences: Object.freeze(["ev-a"]),
    })
  );
  createConfidenceRecord(
    sampleRecord("avg-2", WORKSPACE, {
      updatedAt: "2026-02-01T00:00:00.000Z",
      confidenceScore: 0.75,
      source: "evidence",
      reason: "new_evidence",
      evidenceReferences: Object.freeze(["ev-b"]),
    })
  );
  const response = buildConfidenceCalibrationModel({ workspaceId: WORKSPACE });
  assert.ok((response.data?.averageCalibrationScore ?? 0) > 0);
  assert.ok((response.data?.averageAccuracyScore ?? 0) > 0);
});

test("confidence values bounded between 0 and 1", () => {
  createConfidenceRecord(
    sampleRecord("bound-1", WORKSPACE, {
      updatedAt: FIXED_TIME,
      confidenceScore: 0.75,
      source: "evidence",
      reason: "new_evidence",
      evidenceReferences: Object.freeze(["ev-bound"]),
    })
  );
  const response = buildConfidenceCalibrationModel({ workspaceId: WORKSPACE });
  assert.ok((response.data?.confidence ?? -1) >= 0);
  assert.ok((response.data?.confidence ?? 2) <= 1);
  for (const entry of response.data?.recordCalibrations ?? []) {
    assert.ok(entry.calibrationScore >= 0 && entry.calibrationScore <= 1);
    assert.ok(entry.accuracyScore >= 0 && entry.accuracyScore <= 1);
  }
});

test("layer is read-only and does not mutate engine records", () => {
  createConfidenceRecord(
    sampleRecord("readonly-1", WORKSPACE, {
      updatedAt: FIXED_TIME,
      confidenceScore: 0.7,
      source: "evidence",
      reason: "new_evidence",
      evidenceReferences: Object.freeze(["ev-ro"]),
    })
  );
  const before = getConfidenceRecordsOrdered({ workspaceId: WORKSPACE, direction: "asc" });
  buildConfidenceCalibrationModel({ workspaceId: WORKSPACE });
  const after = getConfidenceRecordsOrdered({ workspaceId: WORKSPACE, direction: "asc" });
  assert.equal(before.length, after.length);
  assert.deepEqual(before[0], after[0]);
});

test("APP-9:5 evidence/reason layer remains compatible as read-only input", () => {
  createConfidenceRecord(
    sampleRecord("compat-1", WORKSPACE, {
      updatedAt: "2026-01-01T00:00:00.000Z",
      confidenceScore: 0.55,
      source: "evidence",
      reason: "new_evidence",
      evidenceReferences: Object.freeze(["compat-ev"]),
    })
  );
  createConfidenceRecord(
    sampleRecord("compat-2", WORKSPACE, {
      updatedAt: "2026-02-01T00:00:00.000Z",
      confidenceScore: 0.7,
      source: "evidence",
      reason: "new_evidence",
      evidenceReferences: Object.freeze(["compat-ev-2"]),
    })
  );
  const links = buildConfidenceEvidenceReasonLinkModel({ workspaceId: WORKSPACE });
  const calibration = buildConfidenceCalibrationModel({ workspaceId: WORKSPACE });
  assert.equal(links.success, true);
  assert.equal(calibration.success, true);
  assert.equal(links.data?.recordCount, calibration.data?.recordCount);
});

test("evaluateConfidenceCalibration returns full evaluation bundle", () => {
  const evaluation = evaluateConfidenceCalibration(0.75, "new_evidence", "evidence", ["ev-a"]);
  assert.equal(evaluation.calibrationStatus, "calibrated");
  assert.ok(evaluation.calibrationScore > 0);
  assert.ok(evaluation.accuracyScore > 0);
});

test("calibration statuses flags and accuracy levels are enumerated", () => {
  assert.ok(CONFIDENCE_CALIBRATION_STATUSES.includes("calibrated"));
  assert.ok(CONFIDENCE_CALIBRATION_STATUSES.includes("unsupported"));
  assert.ok(CONFIDENCE_ACCURACY_LEVELS.includes("very_high"));
  assert.ok(CONFIDENCE_CALIBRATION_FLAG_TYPES.includes("evidence-supported-confidence"));
});

test("foundation compatibility and manifest validation pass", () => {
  const foundation = validateFoundationCompatibilityForCalibration(FIXED_TIME);
  assert.equal(foundation.valid, true);
  assert.equal(CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId, "APP-9");
  assert.equal(CONFIDENCE_EVOLUTION_CALIBRATION_CONTRACT_VERSION, "APP-9/6");
  assert.equal(validateStageManifest(CONFIDENCE_EVOLUTION_CALIBRATION_SELF_MANIFEST).valid, true);
  assert.equal(
    evaluateStageFileBoundary({
      filePath: "frontend/app/lib/confidence-evolution/confidenceEvolutionCalibration.ts",
      allowedFiles: CONFIDENCE_EVOLUTION_CALIBRATION_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: CONFIDENCE_EVOLUTION_CALIBRATION_SELF_MANIFEST.forbiddenPatterns,
    }).allowed,
    true
  );
});

test("certification runner passes all checks", () => {
  const result = runConfidenceCalibrationCertification();
  assert.equal(result.status, "PASS");
  assert.equal(result.certified, true);
  assert.equal(result.score, 100);
  assert.ok(result.checks.every((entry) => entry.passed));
});

test("validateConfidenceCalibrationModel input check succeeds when layers ready", () => {
  const validation = validateConfidenceCalibrationModel({ workspaceId: WORKSPACE });
  assert.equal(validation.valid, true);
});
