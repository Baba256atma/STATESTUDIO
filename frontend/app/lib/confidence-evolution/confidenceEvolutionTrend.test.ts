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
  initializeConfidenceEvolutionQueryLayer,
  resetConfidenceEvolutionQueryLayerForTests,
} from "./confidenceEvolutionQuery.ts";
import {
  calculateAverageAbsoluteDelta,
  calculateConfidenceDeltas,
  calculateTotalDelta,
} from "./confidenceEvolutionDeltas.ts";
import {
  detectConfidenceDrops,
  detectConfidencePeaks,
  detectConfidenceRecoveries,
} from "./confidenceEvolutionMovementDetection.ts";
import {
  classifyConfidenceStability,
  classifyConfidenceTrendDirection,
} from "./confidenceEvolutionTrendClassification.ts";
import {
  calculateConfidenceVolatility,
  classifyConfidenceVolatilityLevel,
} from "./confidenceEvolutionVolatility.ts";
import {
  buildConfidenceTrendModel,
  initializeConfidenceEvolutionTrendLayer,
  resetConfidenceEvolutionTrendLayerForTests,
  validateConfidenceTrendModel,
  CONFIDENCE_EVOLUTION_TREND_SELF_MANIFEST,
} from "./confidenceEvolutionTrend.ts";
import { runConfidenceTrendCertification } from "./confidenceEvolutionTrendRunner.ts";
import { CONFIDENCE_EVOLUTION_TREND_CONTRACT_VERSION } from "./confidenceEvolutionTrendTypes.ts";
import { validateFoundationCompatibilityForTrend } from "./confidenceEvolutionTrendValidation.ts";
import { CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY } from "./confidenceEvolutionContracts.ts";
import type { ConfidenceEvolutionEngineRecord } from "./confidenceEvolutionEngineTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-confidence-trend-test-001";

function sampleRecord(id: string, overrides: Record<string, unknown> = {}) {
  return Object.freeze({
    id,
    workspaceId: WORKSPACE,
    title: `Trend ${id}`,
    confidenceLevel: "medium" as const,
    confidenceScore: 0.62,
    source: "manual" as const,
    reason: "executive_review" as const,
    notes: "Trend test record.",
    createdAt: FIXED_TIME,
    tags: Object.freeze(["test"]),
    ...overrides,
  });
}

function makeRecord(
  id: string,
  score: number,
  updatedAt: string,
  createdAt: string = updatedAt
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
    createdAt,
    updatedAt,
    contractVersion: "APP-9/1",
    revisionVersion: 1,
    archived: false,
    readOnly: true as const,
  });
}

test.beforeEach(() => {
  resetConfidenceEvolutionTrendLayerForTests();
  resetConfidenceEvolutionQueryLayerForTests();
  resetConfidenceEvolutionEngineForTests();
  resetConfidenceEvolutionPlatformForTests();
  createConfidenceEvolutionFoundation(FIXED_TIME);
  initializeConfidenceEvolutionEngine(FIXED_TIME);
  initializeConfidenceEvolutionQueryLayer(FIXED_TIME);
  initializeConfidenceEvolutionTrendLayer(FIXED_TIME);
});

test("validates stage manifest and architecture boundary", () => {
  const manifestValidation = validateStageManifest(CONFIDENCE_EVOLUTION_TREND_SELF_MANIFEST);
  assert.equal(manifestValidation.valid, true, manifestValidation.issues.map((issue) => issue.message).join("; "));
  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/confidence-evolution/confidenceEvolutionTrend.ts",
    allowedFiles: CONFIDENCE_EVOLUTION_TREND_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: CONFIDENCE_EVOLUTION_TREND_SELF_MANIFEST.forbiddenPatterns,
  });
  assert.equal(boundary.allowed, true, boundary.message);
});

test("returns safe empty workspace trend result", () => {
  const result = buildConfidenceTrendModel({ workspaceId: "ws-empty-trend" });
  assert.equal(result.success, true);
  assert.equal(result.data?.recordCount, 0);
  assert.equal(result.data?.direction, "unknown");
  assert.equal(result.data?.stabilityLevel, "unknown");
  assert.equal(result.data?.volatilityLevel, "none");
  assert.equal(result.data?.firstScore, null);
});

test("returns safe single record trend result", () => {
  createConfidenceRecord(sampleRecord("confidence-trend-single", { confidenceScore: 0.7 }));
  const result = buildConfidenceTrendModel({ workspaceId: WORKSPACE });
  assert.equal(result.success, true);
  assert.equal(result.data?.recordCount, 1);
  assert.equal(result.data?.totalDelta, 0);
  assert.equal(result.data?.direction, "stable");
  assert.equal(result.data?.volatilityLevel, "none");
});

test("enforces workspace isolation", () => {
  createConfidenceRecord(sampleRecord("confidence-trend-ws-a", { workspaceId: "ws-a" }));
  createConfidenceRecord(sampleRecord("confidence-trend-ws-b", { workspaceId: "ws-b" }));
  const wsA = buildConfidenceTrendModel({ workspaceId: "ws-a" });
  const wsB = buildConfidenceTrendModel({ workspaceId: "ws-b" });
  assert.equal(wsA.data?.recordCount, 1);
  assert.equal(wsB.data?.recordCount, 1);
});

test("detects increasing trend", () => {
  createConfidenceRecord(sampleRecord("confidence-trend-inc-1", { updatedAt: "2026-01-01T00:00:00.000Z", confidenceScore: 0.3 }));
  createConfidenceRecord(sampleRecord("confidence-trend-inc-2", { updatedAt: "2026-02-01T00:00:00.000Z", confidenceScore: 0.6 }));
  const result = buildConfidenceTrendModel({ workspaceId: WORKSPACE });
  assert.equal(result.data?.direction, "increasing");
  assert.equal(result.data?.totalDelta, 0.3);
});

test("detects decreasing trend", () => {
  createConfidenceRecord(sampleRecord("confidence-trend-dec-1", { updatedAt: "2026-01-01T00:00:00.000Z", confidenceScore: 0.9 }));
  createConfidenceRecord(sampleRecord("confidence-trend-dec-2", { updatedAt: "2026-02-01T00:00:00.000Z", confidenceScore: 0.5 }));
  const result = buildConfidenceTrendModel({ workspaceId: WORKSPACE });
  assert.equal(result.data?.direction, "decreasing");
});

test("detects stable trend", () => {
  createConfidenceRecord(sampleRecord("confidence-trend-stb-1", { updatedAt: "2026-01-01T00:00:00.000Z", confidenceScore: 0.5 }));
  createConfidenceRecord(sampleRecord("confidence-trend-stb-2", { updatedAt: "2026-02-01T00:00:00.000Z", confidenceScore: 0.52 }));
  const result = buildConfidenceTrendModel({ workspaceId: WORKSPACE });
  assert.equal(result.data?.direction, "stable");
});

test("detects mixed trend", () => {
  createConfidenceRecord(sampleRecord("confidence-trend-mix-1", { updatedAt: "2026-01-01T00:00:00.000Z", confidenceScore: 0.4 }));
  createConfidenceRecord(sampleRecord("confidence-trend-mix-2", { updatedAt: "2026-02-01T00:00:00.000Z", confidenceScore: 0.7 }));
  createConfidenceRecord(sampleRecord("confidence-trend-mix-3", { updatedAt: "2026-03-01T00:00:00.000Z", confidenceScore: 0.3 }));
  const result = buildConfidenceTrendModel({ workspaceId: WORKSPACE });
  assert.equal(result.data?.direction, "mixed");
});

test("calculates deltas total and average", () => {
  const records = Object.freeze([
    makeRecord("a", 0.4, "2026-01-01T00:00:00.000Z"),
    makeRecord("b", 0.7, "2026-02-01T00:00:00.000Z"),
    makeRecord("c", 0.5, "2026-03-01T00:00:00.000Z"),
  ]);
  const deltas = calculateConfidenceDeltas(records);
  assert.equal(deltas.length, 2);
  assert.ok(Math.abs((deltas[0]?.delta ?? 0) - 0.3) < 0.000001);
  assert.ok(Math.abs((deltas[1]?.delta ?? 0) + 0.2) < 0.000001);
  assert.ok(Math.abs((calculateTotalDelta(records) ?? 0) - 0.1) < 0.000001);
  assert.ok(Math.abs(calculateAverageAbsoluteDelta(deltas) - 0.25) < 0.000001);
});

test("calculates volatility score and levels", () => {
  const lowDeltas = calculateConfidenceDeltas(
    Object.freeze([makeRecord("a", 0.5, "2026-01-01T00:00:00.000Z"), makeRecord("b", 0.54, "2026-02-01T00:00:00.000Z")])
  );
  const lowScore = calculateConfidenceVolatility(lowDeltas, 2);
  assert.equal(classifyConfidenceVolatilityLevel(lowScore, 2), "low");

  const highDeltas = calculateConfidenceDeltas(
    Object.freeze([makeRecord("a", 0.2, "2026-01-01T00:00:00.000Z"), makeRecord("b", 0.8, "2026-02-01T00:00:00.000Z")])
  );
  const highScore = calculateConfidenceVolatility(highDeltas, 2);
  assert.equal(classifyConfidenceVolatilityLevel(highScore, 2), "extreme");
  assert.equal(classifyConfidenceVolatilityLevel(0, 1), "none");
});

test("classifies stability levels", () => {
  assert.equal(classifyConfidenceStability(0.02, 2, "stable"), "stable");
  assert.equal(classifyConfidenceStability(0.12, 2, "mixed"), "moderately_stable");
  assert.equal(classifyConfidenceStability(0.25, 2, "mixed"), "unstable");
  assert.equal(classifyConfidenceStability(0.45, 2, "mixed"), "highly_unstable");
  assert.equal(classifyConfidenceStability(0, 0, "unknown"), "unknown");
});

test("detects peaks drops and recoveries", () => {
  const records = Object.freeze([
    makeRecord("p1", 0.4, "2026-01-01T00:00:00.000Z"),
    makeRecord("p2", 0.8, "2026-02-01T00:00:00.000Z"),
    makeRecord("p3", 0.5, "2026-03-01T00:00:00.000Z"),
    makeRecord("p4", 0.75, "2026-04-01T00:00:00.000Z"),
  ]);
  const deltas = calculateConfidenceDeltas(records);
  const peaks = detectConfidencePeaks(WORKSPACE, records);
  const drops = detectConfidenceDrops(WORKSPACE, records, deltas);
  const recoveries = detectConfidenceRecoveries(WORKSPACE, records, deltas);
  assert.equal(peaks.length, 1);
  assert.equal(peaks[0]?.type, "peak");
  assert.equal(drops.length, 1);
  assert.equal(drops[0]?.type, "drop");
  assert.equal(recoveries.length, 1);
  assert.equal(recoveries[0]?.type, "recovery");
});

test("keeps confidence metrics bounded 0-1", () => {
  createConfidenceRecord(sampleRecord("confidence-trend-bound-1", { updatedAt: "2026-01-01T00:00:00.000Z", confidenceScore: 0.2 }));
  createConfidenceRecord(sampleRecord("confidence-trend-bound-2", { updatedAt: "2026-02-01T00:00:00.000Z", confidenceScore: 0.9 }));
  const result = buildConfidenceTrendModel({ workspaceId: WORKSPACE });
  assert.ok((result.data?.confidence ?? -1) >= 0 && (result.data?.confidence ?? 2) <= 1);
  assert.ok((result.data?.volatilityScore ?? -1) >= 0 && (result.data?.volatilityScore ?? 2) <= 1);
});

test("rejects invalid trend model input", () => {
  const validation = validateConfidenceTrendModel({ workspaceId: "" });
  assert.equal(validation.valid, false);
});

test("validates APP-9:1 through APP-9:3 compatibility", () => {
  assert.equal(validateFoundationCompatibilityForTrend(FIXED_TIME).valid, true);
});

test("trend model is read-only and contract versioned", () => {
  createConfidenceRecord(sampleRecord("confidence-trend-ro", { confidenceScore: 0.6 }));
  const result = buildConfidenceTrendModel({ workspaceId: WORKSPACE });
  assert.equal(result.data?.readOnly, true);
  assert.equal(result.data?.contractVersion, CONFIDENCE_EVOLUTION_TREND_CONTRACT_VERSION);
});

test("classifies trend direction via helper", () => {
  assert.equal(classifyConfidenceTrendDirection(0.2, Object.freeze([Object.freeze({ delta: 0.2 } as never)]), 2), "increasing");
  assert.equal(classifyConfidenceTrendDirection(-0.2, Object.freeze([Object.freeze({ delta: -0.2 } as never)]), 2), "decreasing");
  assert.equal(classifyConfidenceTrendDirection(null, Object.freeze([]), 0), "unknown");
});

test("runs confidence trend certification", () => {
  const result = runConfidenceTrendCertification();
  assert.equal(result.certified, true);
  assert.equal(result.status, "PASS");
  assert.equal(result.score, 100);
  assert.ok(result.checks.length >= 18);
});

test("exports APP-9 platform identity unchanged", () => {
  assert.equal(CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId, "APP-9");
  assert.equal(CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.version, "APP-9/1");
});
