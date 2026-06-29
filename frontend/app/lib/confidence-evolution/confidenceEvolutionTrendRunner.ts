/**
 * APP-9:4 — Confidence Trend + Volatility certification runner.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { BUSINESS_TIMELINE_PLATFORM_IDENTITY } from "../business-timeline/businessTimelineContracts.ts";
import { DECISION_JOURNAL_PLATFORM_IDENTITY } from "../decision-journal/decisionJournalContracts.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "../decision-timeline/decisionTimelineContracts.ts";
import { SCENARIO_TIMELINE_PLATFORM_IDENTITY } from "../scenario-timeline/scenarioTimelinePlatformContracts.ts";
import {
  CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION,
  CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY,
} from "./confidenceEvolutionContracts.ts";
import { createConfidenceEvolutionFoundation } from "./confidenceEvolutionFoundation.ts";
import { resetConfidenceEvolutionPlatformForTests } from "./confidenceEvolutionRunner.ts";
import {
  createConfidenceRecord,
  initializeConfidenceEvolutionEngine,
  resetConfidenceEvolutionEngineForTests,
} from "./confidenceEvolutionEngine.ts";
import {
  initializeConfidenceEvolutionQueryLayer,
  resetConfidenceEvolutionQueryLayerForTests,
} from "./confidenceEvolutionQuery.ts";
import {
  buildConfidenceTrendModel,
  calculateConfidenceDeltas,
  classifyConfidenceTrendDirection,
  initializeConfidenceEvolutionTrendLayer,
  isConfidenceEvolutionTrendLayerInitialized,
  resetConfidenceEvolutionTrendLayerForTests,
  CONFIDENCE_EVOLUTION_TREND_SELF_MANIFEST,
} from "./confidenceEvolutionTrend.ts";
import { calculateConfidenceVolatility, classifyConfidenceVolatilityLevel } from "./confidenceEvolutionVolatility.ts";
import {
  assertNoMutationApisInTrendSource,
  validateConfidenceEngineAvailabilityForTrend,
  validateFoundationCompatibilityForTrend,
  validateQueryLayerAvailabilityForTrend,
} from "./confidenceEvolutionTrendValidation.ts";
import {
  CONFIDENCE_EVOLUTION_TREND_CONTRACT_VERSION,
  type ConfidenceEvolutionTrendCertificationCheck,
  type ConfidenceEvolutionTrendCertificationResult,
} from "./confidenceEvolutionTrendTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");
const WORKSPACE_A = "ws-confidence-trend-cert-a";
const WORKSPACE_B = "ws-confidence-trend-cert-b";

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ConfidenceEvolutionTrendCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readEngineSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function sampleRecord(id: string, workspaceId: string, overrides: Record<string, unknown> = {}) {
  return Object.freeze({
    id,
    workspaceId,
    title: `Trend certification ${id}`,
    confidenceLevel: "medium" as const,
    confidenceScore: 0.62,
    source: "manual" as const,
    reason: "executive_review" as const,
    notes: "APP-9:4 certification record.",
    createdAt: FIXED_TIME,
    tags: Object.freeze(["certification"]),
    ...overrides,
  });
}

function seedTrendRecords() {
  createConfidenceRecord(
    sampleRecord("confidence-trend-cert-1", WORKSPACE_A, {
      updatedAt: "2026-01-01T00:00:00.000Z",
      createdAt: "2026-01-01T00:00:00.000Z",
      confidenceScore: 0.4,
    })
  );
  createConfidenceRecord(
    sampleRecord("confidence-trend-cert-2", WORKSPACE_A, {
      updatedAt: "2026-02-01T00:00:00.000Z",
      createdAt: "2026-02-01T00:00:00.000Z",
      confidenceScore: 0.55,
    })
  );
  createConfidenceRecord(
    sampleRecord("confidence-trend-cert-3", WORKSPACE_A, {
      updatedAt: "2026-03-01T00:00:00.000Z",
      createdAt: "2026-03-01T00:00:00.000Z",
      confidenceScore: 0.85,
    })
  );
  createConfidenceRecord(
    sampleRecord("confidence-trend-cert-4", WORKSPACE_A, {
      updatedAt: "2026-04-01T00:00:00.000Z",
      createdAt: "2026-04-01T00:00:00.000Z",
      confidenceScore: 0.5,
    })
  );
  createConfidenceRecord(
    sampleRecord("confidence-trend-cert-5", WORKSPACE_A, {
      updatedAt: "2026-05-01T00:00:00.000Z",
      createdAt: "2026-05-01T00:00:00.000Z",
      confidenceScore: 0.72,
      reason: "new_evidence",
    })
  );
  createConfidenceRecord(
    sampleRecord("confidence-trend-cert-b1", WORKSPACE_B, {
      updatedAt: "2026-06-01T00:00:00.000Z",
      confidenceScore: 0.9,
    })
  );
}

export function runConfidenceTrendCertification(): ConfidenceEvolutionTrendCertificationResult {
  resetConfidenceEvolutionTrendLayerForTests();
  resetConfidenceEvolutionQueryLayerForTests();
  resetConfidenceEvolutionEngineForTests();
  resetConfidenceEvolutionPlatformForTests();
  createConfidenceEvolutionFoundation(FIXED_TIME);
  initializeConfidenceEvolutionEngine(FIXED_TIME);
  initializeConfidenceEvolutionQueryLayer(FIXED_TIME);
  initializeConfidenceEvolutionTrendLayer(FIXED_TIME);
  seedTrendRecords();

  const checks: ConfidenceEvolutionTrendCertificationCheck[] = [];

  checks.push(
    check(
      "A_foundation_available",
      "APP-9:1 available",
      validateFoundationCompatibilityForTrend(FIXED_TIME).valid === true,
      "foundation valid"
    )
  );

  checks.push(
    check(
      "B_engine_available",
      "APP-9:2 engine available",
      validateConfidenceEngineAvailabilityForTrend().valid === true,
      "engine ready"
    )
  );

  checks.push(
    check(
      "C_query_available",
      "APP-9:3 query layer available",
      validateQueryLayerAvailabilityForTrend().valid === true,
      "query ready"
    )
  );

  checks.push(
    check(
      "D_trend_initialized",
      "Trend layer initialized",
      isConfidenceEvolutionTrendLayerInitialized() === true,
      "trend layer initialized"
    )
  );

  const empty = buildConfidenceTrendModel({ workspaceId: "ws-confidence-trend-empty" });
  checks.push(
    check(
      "E_empty_workspace_safe",
      "Empty workspace safe",
      empty.success === true &&
        empty.data?.recordCount === 0 &&
        empty.data.direction === "unknown" &&
        empty.data.stabilityLevel === "unknown",
      "empty safe"
    )
  );

  createConfidenceRecord(
    sampleRecord("confidence-trend-single-only", "ws-confidence-trend-single-only", {
      updatedAt: "2026-07-01T00:00:00.000Z",
      confidenceScore: 0.75,
    })
  );
  const single = buildConfidenceTrendModel({ workspaceId: "ws-confidence-trend-single-only" });
  checks.push(
    check(
      "F_single_record_safe",
      "Single record safe",
      single.success === true &&
        single.data?.recordCount === 1 &&
        single.data.totalDelta === 0 &&
        single.data.direction === "stable" &&
        single.data.volatilityLevel === "none",
      `records=${single.data?.recordCount}`
    )
  );

  const wsA = buildConfidenceTrendModel({ workspaceId: WORKSPACE_A });
  const wsBOnly = buildConfidenceTrendModel({ workspaceId: WORKSPACE_B });
  checks.push(
    check(
      "G_workspace_isolation",
      "Workspace isolation",
      wsA.success === true &&
        wsBOnly.success === true &&
        wsA.data?.recordCount === 5 &&
        wsBOnly.data?.recordCount === 1,
      `${wsA.data?.recordCount} in A, ${wsBOnly.data?.recordCount} in B`
    )
  );

  const orderedRecords = wsA.data?.recordCount
    ? [
        { score: 0.4 },
        { score: 0.55 },
      ]
    : [];
  void orderedRecords;
  const deltas = wsA.success
    ? calculateConfidenceDeltas(
        (wsA.data?.recordCount ?? 0) >= 2
          ? [
              Object.freeze({
                id: "confidence-trend-cert-1",
                workspaceId: WORKSPACE_A,
                title: "t",
                confidenceLevel: "medium" as const,
                confidenceScore: 0.4,
                source: "manual" as const,
                reason: "executive_review" as const,
                notes: "",
                evidenceReferences: Object.freeze([]),
                tags: Object.freeze([]),
                metadata: Object.freeze({
                  metadataVersion: "APP-9/1",
                  extensions: Object.freeze({}),
                  readOnly: true as const,
                }),
                status: "active" as const,
                createdAt: FIXED_TIME,
                updatedAt: "2026-01-01T00:00:00.000Z",
                contractVersion: "APP-9/1" as const,
                revisionVersion: 1,
                archived: false,
                readOnly: true as const,
              }),
              Object.freeze({
                id: "confidence-trend-cert-2",
                workspaceId: WORKSPACE_A,
                title: "t",
                confidenceLevel: "medium" as const,
                confidenceScore: 0.55,
                source: "manual" as const,
                reason: "executive_review" as const,
                notes: "",
                evidenceReferences: Object.freeze([]),
                tags: Object.freeze([]),
                metadata: Object.freeze({
                  metadataVersion: "APP-9/1",
                  extensions: Object.freeze({}),
                  readOnly: true as const,
                }),
                status: "active" as const,
                createdAt: FIXED_TIME,
                updatedAt: "2026-02-01T00:00:00.000Z",
                contractVersion: "APP-9/1" as const,
                revisionVersion: 1,
                archived: false,
                readOnly: true as const,
              }),
            ]
          : []
      )
    : Object.freeze([]);
  checks.push(
    check(
      "H_delta_calculation",
      "Delta calculation deterministic",
      deltas.length === 1 && Math.abs((deltas[0]?.delta ?? 0) - 0.15) < 0.000001,
      `delta=${deltas[0]?.delta}`
    )
  );

  checks.push(
    check(
      "I_direction_classification",
      "Direction classification deterministic",
      wsA.data?.direction === "mixed",
      wsA.data?.direction ?? "missing"
    )
  );

  checks.push(
    check(
      "J_volatility_scoring",
      "Volatility scoring valid",
      wsA.data !== null &&
        wsA.data.volatilityScore >= 0 &&
        wsA.data.volatilityScore <= 1,
      String(wsA.data?.volatilityScore)
    )
  );

  checks.push(
    check(
      "K_volatility_level",
      "Volatility level valid",
      wsA.data?.volatilityLevel === "high" || wsA.data?.volatilityLevel === "medium",
      wsA.data?.volatilityLevel ?? "missing"
    )
  );

  checks.push(
    check(
      "L_stability_classification",
      "Stability classification valid",
      wsA.data?.stabilityLevel === "unstable" || wsA.data?.stabilityLevel === "highly_unstable",
      wsA.data?.stabilityLevel ?? "missing"
    )
  );

  checks.push(
    check(
      "M_peak_detection",
      "Peak detection deterministic",
      (wsA.data?.peaks.length ?? 0) >= 1 && wsA.data?.peaks[0]?.type === "peak",
      `${wsA.data?.peaks.length ?? 0} peaks`
    )
  );

  checks.push(
    check(
      "N_drop_detection",
      "Drop detection deterministic",
      (wsA.data?.drops.length ?? 0) >= 1 && wsA.data?.drops[0]?.type === "drop",
      `${wsA.data?.drops.length ?? 0} drops`
    )
  );

  checks.push(
    check(
      "O_recovery_detection",
      "Recovery detection deterministic",
      (wsA.data?.recoveries.length ?? 0) >= 1 && wsA.data?.recoveries[0]?.type === "recovery",
      `${wsA.data?.recoveries.length ?? 0} recoveries`
    )
  );

  checks.push(
    check(
      "P_confidence_bounded",
      "Confidence bounded 0-1",
      (wsA.data?.confidence ?? -1) >= 0 &&
        (wsA.data?.confidence ?? 2) <= 1 &&
        (wsA.data?.peaks[0]?.confidence ?? -1) >= 0 &&
        (wsA.data?.peaks[0]?.confidence ?? 2) <= 1,
      String(wsA.data?.confidence)
    )
  );

  const trendSourceBundle = [
    readEngineSource("app/lib/confidence-evolution/confidenceEvolutionTrend.ts"),
    readEngineSource("app/lib/confidence-evolution/confidenceEvolutionTrendBuilder.ts"),
    readEngineSource("app/lib/confidence-evolution/confidenceEvolutionMovementDetection.ts"),
  ].join("\n");
  checks.push(
    check(
      "Q_read_only_behavior",
      "Read-only behavior enforced",
      assertNoMutationApisInTrendSource(trendSourceBundle) === true,
      "no mutation APIs"
    )
  );

  checks.push(
    check(
      "R_no_dashboard_coupling",
      "No dashboard coupling",
      !trendSourceBundle.includes("DashboardAdapter") && !trendSourceBundle.includes("dashboard/"),
      "no dashboard"
    )
  );

  checks.push(
    check(
      "S_no_assistant_coupling",
      "No assistant coupling",
      !trendSourceBundle.includes("AssistantAdapter") && !trendSourceBundle.includes("assistant/"),
      "no assistant"
    )
  );

  checks.push(
    check(
      "T_no_visualization",
      "No visualization",
      !trendSourceBundle.includes("ConfidenceChart") && !trendSourceBundle.includes(".tsx"),
      "no visualization"
    )
  );

  checks.push(
    check(
      "U_no_persistence",
      "No persistence",
      !trendSourceBundle.includes("indexedDB") && !trendSourceBundle.includes("localStorage"),
      "no persistence"
    )
  );

  checks.push(
    check(
      "V_no_app6_app7_app8_integration",
      "No APP-6/7/8 integration",
      !trendSourceBundle.includes("decision-timeline/") &&
        !trendSourceBundle.includes("business-timeline/") &&
        !trendSourceBundle.includes("decision-journal/"),
      "no timeline/journal imports"
    )
  );

  checks.push(
    check(
      "W_prior_platforms_untouched",
      "Prior platforms untouched",
      SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId === "APP-5" &&
        DECISION_TIMELINE_PLATFORM_IDENTITY.appId === "APP-6" &&
        BUSINESS_TIMELINE_PLATFORM_IDENTITY.appId === "APP-7" &&
        DECISION_JOURNAL_PLATFORM_IDENTITY.appId === "APP-8" &&
        CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId === "APP-9",
      "identities verified"
    )
  );

  const increasingModel = classifyConfidenceTrendDirection(0.2, Object.freeze([Object.freeze({ delta: 0.2 } as never)]), 2);
  const decreasingModel = classifyConfidenceTrendDirection(-0.2, Object.freeze([Object.freeze({ delta: -0.2 } as never)]), 2);
  const stableModel = classifyConfidenceTrendDirection(0, Object.freeze([Object.freeze({ delta: 0.01 } as never)]), 2);
  checks.push(
    check(
      "direction_increasing_decreasing_stable",
      "Direction variants deterministic",
      increasingModel === "increasing" && decreasingModel === "decreasing" && stableModel === "stable",
      `${increasingModel}/${decreasingModel}/${stableModel}`
    )
  );

  const volatilityScore = calculateConfidenceVolatility(
    Object.freeze([
      Object.freeze({
        delta: 0.4,
        recordId: "a",
        previousRecordId: "b",
        fromScore: 0.4,
        toScore: 0.8,
        occurredAt: FIXED_TIME,
        readOnly: true as const,
      }),
    ]),
    2
  );
  checks.push(
    check(
      "volatility_extreme_sample",
      "Volatility level extreme sample",
      classifyConfidenceVolatilityLevel(volatilityScore, 2) === "high" ||
        classifyConfidenceVolatilityLevel(volatilityScore, 2) === "extreme",
      String(volatilityScore)
    )
  );

  checks.push(
    check(
      "stage_manifest",
      "Stage manifest validation",
      validateStageManifest(CONFIDENCE_EVOLUTION_TREND_SELF_MANIFEST).valid === true,
      CONFIDENCE_EVOLUTION_TREND_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "architecture_boundaries",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/confidence-evolution/confidenceEvolutionTrend.ts",
        allowedFiles: CONFIDENCE_EVOLUTION_TREND_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: CONFIDENCE_EVOLUTION_TREND_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "boundaries enforced"
    )
  );

  checks.push(
    check(
      "contract_version",
      "Trend contract version is APP-9/4",
      CONFIDENCE_EVOLUTION_TREND_CONTRACT_VERSION === "APP-9/4",
      CONFIDENCE_EVOLUTION_TREND_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "foundation_files_preserved",
      "APP-9:1 through APP-9:3 files preserved",
      existsSync(join(REPO_ROOT, "frontend/app/lib/confidence-evolution/confidenceEvolutionFoundation.ts")) &&
        existsSync(join(REPO_ROOT, "frontend/app/lib/confidence-evolution/confidenceEvolutionEngine.ts")) &&
        existsSync(join(REPO_ROOT, "frontend/app/lib/confidence-evolution/confidenceEvolutionQuery.ts")),
      "prior layers intact"
    )
  );

  checks.push(
    check(
      "app9_identity_regression",
      "APP-9:1 identity regression",
      CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId === "APP-9" &&
        CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.version === CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION,
      CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION
    )
  );

  const passedCount = checks.filter((entry) => entry.passed).length;
  const failedCount = checks.length - passedCount;
  const score = Math.round((passedCount / checks.length) * 100);

  return Object.freeze({
    certified: failedCount === 0,
    status: failedCount === 0 ? ("PASS" as const) : ("FAIL" as const),
    summary: `${passedCount}/${checks.length} certification checks passed.`,
    checks: Object.freeze(checks),
    score,
    readOnly: true as const,
  });
}

export const ConfidenceEvolutionTrendRunner = Object.freeze({
  runConfidenceTrendCertification,
});
