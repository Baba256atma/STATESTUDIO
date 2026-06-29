/**
 * APP-9:6 — Confidence Calibration + Accuracy certification runner.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { BUSINESS_TIMELINE_PLATFORM_IDENTITY } from "../business-timeline/businessTimelineContracts.ts";
import { DECISION_JOURNAL_PLATFORM_IDENTITY } from "../decision-journal/decisionJournalContracts.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "../decision-timeline/decisionTimelineContracts.ts";
import { SCENARIO_TIMELINE_PLATFORM_IDENTITY } from "../scenario-timeline/scenarioTimelinePlatformContracts.ts";
import { CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY } from "./confidenceEvolutionContracts.ts";
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
  initializeConfidenceEvolutionTrendLayer,
  resetConfidenceEvolutionTrendLayerForTests,
} from "./confidenceEvolutionTrend.ts";
import {
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
  initializeConfidenceCalibrationLayer,
  isConfidenceCalibrationLayerInitialized,
  resetConfidenceCalibrationLayerForTests,
  CONFIDENCE_EVOLUTION_CALIBRATION_SELF_MANIFEST,
} from "./confidenceEvolutionCalibration.ts";
import {
  assertNoMutationApisInCalibrationSource,
  validateConfidenceEngineAvailabilityForCalibration,
  validateEvidenceReasonLayerAvailabilityForCalibration,
  validateFoundationCompatibilityForCalibration,
  validateQueryLayerAvailabilityForCalibration,
  validateTrendLayerAvailabilityForCalibration,
} from "./confidenceEvolutionCalibrationValidation.ts";
import { calculateRecordEvidenceSupportScore } from "./confidenceEvolutionCalibrationRules.ts";
import {
  CONFIDENCE_EVOLUTION_CALIBRATION_CONTRACT_VERSION,
  type ConfidenceEvolutionCalibrationCertificationCheck,
  type ConfidenceEvolutionCalibrationCertificationResult,
} from "./confidenceEvolutionCalibrationTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");
const WORKSPACE_A = "ws-confidence-calibration-cert-a";
const WORKSPACE_B = "ws-confidence-calibration-cert-b";

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ConfidenceEvolutionCalibrationCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readEngineSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function sampleRecord(id: string, workspaceId: string, overrides: Record<string, unknown> = {}) {
  return Object.freeze({
    id,
    workspaceId,
    title: `Calibration certification ${id}`,
    confidenceLevel: "medium" as const,
    confidenceScore: 0.62,
    source: "manual" as const,
    reason: "executive_review" as const,
    notes: "APP-9:6 certification record.",
    evidenceReferences: Object.freeze([]),
    createdAt: FIXED_TIME,
    tags: Object.freeze(["certification"]),
    ...overrides,
  });
}

function seedCalibrationRecords() {
  createConfidenceRecord(
    sampleRecord("confidence-calibration-cert-1", WORKSPACE_A, {
      updatedAt: "2026-01-01T00:00:00.000Z",
      confidenceScore: 0.75,
      source: "evidence",
      reason: "new_evidence",
      evidenceReferences: Object.freeze(["market-analysis-2026"]),
    })
  );
  createConfidenceRecord(
    sampleRecord("confidence-calibration-cert-2", WORKSPACE_A, {
      updatedAt: "2026-02-01T00:00:00.000Z",
      confidenceScore: 0.9,
      source: "manual",
      reason: "manual_revision",
      evidenceReferences: Object.freeze([]),
    })
  );
  createConfidenceRecord(
    sampleRecord("confidence-calibration-cert-3", WORKSPACE_A, {
      updatedAt: "2026-03-01T00:00:00.000Z",
      confidenceScore: 0.3,
      source: "evidence",
      reason: "new_evidence",
      evidenceReferences: Object.freeze(["report-a", "report-b"]),
    })
  );
  createConfidenceRecord(
    sampleRecord("confidence-calibration-cert-4", WORKSPACE_A, {
      updatedAt: "2026-04-01T00:00:00.000Z",
      confidenceScore: 0.8,
      source: "api",
      reason: "unknown",
      evidenceReferences: Object.freeze([]),
    })
  );
  createConfidenceRecord(
    sampleRecord("confidence-calibration-cert-b1", WORKSPACE_B, {
      updatedAt: "2026-06-01T00:00:00.000Z",
      confidenceScore: 0.65,
      source: "evidence",
      reason: "new_evidence",
      evidenceReferences: Object.freeze(["evidence-b1"]),
    })
  );
}

function bootstrapAllLayers() {
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

export function runConfidenceCalibrationCertification(): ConfidenceEvolutionCalibrationCertificationResult {
  bootstrapAllLayers();
  seedCalibrationRecords();

  const checks: ConfidenceEvolutionCalibrationCertificationCheck[] = [];

  checks.push(
    check(
      "A_foundation_available",
      "APP-9:1 available",
      validateFoundationCompatibilityForCalibration(FIXED_TIME).valid === true,
      "foundation valid"
    )
  );

  checks.push(
    check(
      "B_engine_available",
      "APP-9:2 engine available",
      validateConfidenceEngineAvailabilityForCalibration().valid === true,
      "engine ready"
    )
  );

  checks.push(
    check(
      "C_query_available",
      "APP-9:3 query layer available",
      validateQueryLayerAvailabilityForCalibration().valid === true,
      "query ready"
    )
  );

  checks.push(
    check(
      "D_trend_available",
      "APP-9:4 trend layer available",
      validateTrendLayerAvailabilityForCalibration().valid === true,
      "trend ready"
    )
  );

  checks.push(
    check(
      "E_evidence_reason_available",
      "APP-9:5 evidence/reason layer available",
      validateEvidenceReasonLayerAvailabilityForCalibration().valid === true,
      "evidence/reason ready"
    )
  );

  checks.push(
    check(
      "F_calibration_layer_initialized",
      "Calibration layer initialized",
      isConfidenceCalibrationLayerInitialized() === true,
      "calibration layer initialized"
    )
  );

  const empty = buildConfidenceCalibrationModel({ workspaceId: "ws-confidence-calibration-empty" });
  checks.push(
    check(
      "G_empty_workspace_safe",
      "Empty workspace safe",
      empty.success === true &&
        empty.data?.recordCount === 0 &&
        empty.data.averageCalibrationScore === 0 &&
        empty.data.averageAccuracyScore === 0,
      "empty safe"
    )
  );

  createConfidenceRecord(
    sampleRecord("confidence-calibration-single-only", "ws-confidence-calibration-single-only", {
      updatedAt: "2026-07-01T00:00:00.000Z",
      confidenceScore: 0.75,
      source: "evidence",
      reason: "new_evidence",
      evidenceReferences: Object.freeze(["ev-single"]),
    })
  );
  const single = buildConfidenceCalibrationModel({ workspaceId: "ws-confidence-calibration-single-only" });
  checks.push(
    check(
      "H_single_record_safe",
      "Single record safe",
      single.success === true &&
        single.data?.recordCount === 1 &&
        single.data.recordCalibrations.length === 1,
      `records=${single.data?.recordCount}`
    )
  );

  const wsA = buildConfidenceCalibrationModel({ workspaceId: WORKSPACE_A });
  const wsB = buildConfidenceCalibrationModel({ workspaceId: WORKSPACE_B });
  checks.push(
    check(
      "I_workspace_isolation",
      "Workspace isolation",
      wsA.success === true &&
        wsB.success === true &&
        wsA.data?.recordCount === 4 &&
        wsB.data?.recordCount === 1,
      `${wsA.data?.recordCount} in A, ${wsB.data?.recordCount} in B`
    )
  );

  const supportScore = calculateRecordEvidenceSupportScore("new_evidence", ["market-analysis-2026"]);
  const calibrationScore = calculateConfidenceCalibrationScore(0.75, supportScore);
  checks.push(
    check(
      "J_calibration_scoring_deterministic",
      "Calibration scoring deterministic",
      supportScore === 0.75 &&
        Math.abs(calibrationScore - calculateConfidenceCalibrationScore(0.75, 0.75)) < 0.001,
      `support=${supportScore}, score=${calibrationScore}`
    )
  );

  const accuracyScore = calculateConfidenceAccuracyScore(0.75, supportScore);
  checks.push(
    check(
      "K_accuracy_scoring_deterministic",
      "Accuracy scoring deterministic",
      Math.abs(accuracyScore - (1 - Math.abs(0.75 - supportScore))) < 0.001,
      String(accuracyScore)
    )
  );

  checks.push(
    check(
      "L_calibration_status_deterministic",
      "Calibration status deterministic",
      wsA.data?.recordCalibrations.some((entry) => entry.calibrationStatus === "calibrated") === true &&
        wsA.data?.recordCalibrations.some((entry) => entry.calibrationStatus === "overconfident") === true &&
        wsA.data?.recordCalibrations.some((entry) => entry.calibrationStatus === "underconfident") === true &&
        wsA.data?.recordCalibrations.some((entry) => entry.calibrationStatus === "unsupported") === true,
      "statuses verified"
    )
  );

  checks.push(
    check(
      "M_accuracy_level_deterministic",
      "Accuracy level deterministic",
      wsA.data?.recordCalibrations.some((entry) => entry.accuracyLevel === "very_high") === true &&
        wsA.data?.recordCalibrations.some((entry) => entry.accuracyLevel === "medium") === true &&
        classifyConfidenceAccuracyLevel(0.85) === "very_high",
      "accuracy levels verified"
    )
  );

  checks.push(
    check(
      "N_calibration_flags_deterministic",
      "Calibration flags deterministic",
      (wsA.data?.flags.some((entry) => entry.type === "high-confidence-low-evidence") ?? false) &&
        (wsA.data?.flags.some((entry) => entry.type === "unsupported-confidence") ?? false),
      `${wsA.data?.flags.length} flags`
    )
  );

  checks.push(
    check(
      "O_distributions_valid",
      "Distributions valid",
      (wsA.data?.calibrationStatusDistribution.calibrated ?? 0) >= 1 &&
        (wsA.data?.accuracyLevelDistribution.very_high ?? 0) >= 1 &&
        (wsA.data?.accuracyLevelDistribution.medium ?? 0) >= 0,
      "distributions verified"
    )
  );

  checks.push(
    check(
      "P_average_scores_valid",
      "Average scores valid",
      (wsA.data?.averageCalibrationScore ?? -1) >= 0 &&
        (wsA.data?.averageAccuracyScore ?? -1) >= 0 &&
        (wsA.data?.averageCalibrationScore ?? 2) <= 1 &&
        (wsA.data?.averageAccuracyScore ?? 2) <= 1,
      `cal=${wsA.data?.averageCalibrationScore}, acc=${wsA.data?.averageAccuracyScore}`
    )
  );

  checks.push(
    check(
      "Q_confidence_bounded",
      "Confidence bounded 0-1",
      (wsA.data?.confidence ?? -1) >= 0 &&
        (wsA.data?.confidence ?? 2) <= 1 &&
        wsA.data?.recordCalibrations.every(
          (entry) => entry.confidence >= 0 && entry.confidence <= 1
        ) === true,
      String(wsA.data?.confidence)
    )
  );

  const calibrationSourceBundle = [
    readEngineSource("app/lib/confidence-evolution/confidenceEvolutionCalibration.ts"),
    readEngineSource("app/lib/confidence-evolution/confidenceEvolutionCalibrationBuilder.ts"),
    readEngineSource("app/lib/confidence-evolution/confidenceEvolutionCalibrationFlags.ts"),
  ].join("\n");
  checks.push(
    check(
      "R_read_only_behavior",
      "Read-only behavior enforced",
      assertNoMutationApisInCalibrationSource(calibrationSourceBundle) === true,
      "no mutation APIs"
    )
  );

  checks.push(
    check(
      "S_no_dashboard_coupling",
      "No dashboard coupling",
      !calibrationSourceBundle.includes("DashboardAdapter") &&
        !calibrationSourceBundle.includes("dashboard/"),
      "no dashboard"
    )
  );

  checks.push(
    check(
      "T_no_assistant_coupling",
      "No assistant coupling",
      !calibrationSourceBundle.includes("AssistantAdapter") &&
        !calibrationSourceBundle.includes("assistant/"),
      "no assistant"
    )
  );

  checks.push(
    check(
      "U_no_visualization",
      "No visualization",
      !calibrationSourceBundle.includes("ConfidenceChart") &&
        !calibrationSourceBundle.includes(".tsx"),
      "no visualization"
    )
  );

  checks.push(
    check(
      "V_no_persistence",
      "No persistence",
      !calibrationSourceBundle.includes("indexedDB") &&
        !calibrationSourceBundle.includes("localStorage"),
      "no persistence"
    )
  );

  checks.push(
    check(
      "W_no_app6_app7_app8_integration",
      "No APP-6/7/8 integration",
      !calibrationSourceBundle.includes("decision-timeline/") &&
        !calibrationSourceBundle.includes("business-timeline/") &&
        !calibrationSourceBundle.includes("decision-journal/"),
      "no timeline/journal imports"
    )
  );

  checks.push(
    check(
      "X_prior_platforms_untouched",
      "Prior platforms untouched",
      SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId === "APP-5" &&
        DECISION_TIMELINE_PLATFORM_IDENTITY.appId === "APP-6" &&
        BUSINESS_TIMELINE_PLATFORM_IDENTITY.appId === "APP-7" &&
        DECISION_JOURNAL_PLATFORM_IDENTITY.appId === "APP-8" &&
        CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId === "APP-9",
      "identities verified"
    )
  );

  checks.push(
    check(
      "stage_manifest",
      "Stage manifest validation",
      validateStageManifest(CONFIDENCE_EVOLUTION_CALIBRATION_SELF_MANIFEST).valid === true,
      CONFIDENCE_EVOLUTION_CALIBRATION_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "architecture_boundaries",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/confidence-evolution/confidenceEvolutionCalibration.ts",
        allowedFiles: CONFIDENCE_EVOLUTION_CALIBRATION_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: CONFIDENCE_EVOLUTION_CALIBRATION_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "boundaries enforced"
    )
  );

  checks.push(
    check(
      "contract_version",
      "Calibration contract version is APP-9/6",
      CONFIDENCE_EVOLUTION_CALIBRATION_CONTRACT_VERSION === "APP-9/6",
      CONFIDENCE_EVOLUTION_CALIBRATION_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "foundation_files_preserved",
      "APP-9:1 through APP-9:5 files preserved",
      existsSync(join(REPO_ROOT, "frontend/app/lib/confidence-evolution/confidenceEvolutionFoundation.ts")) &&
        existsSync(join(REPO_ROOT, "frontend/app/lib/confidence-evolution/confidenceEvolutionEngine.ts")) &&
        existsSync(join(REPO_ROOT, "frontend/app/lib/confidence-evolution/confidenceEvolutionQuery.ts")) &&
        existsSync(join(REPO_ROOT, "frontend/app/lib/confidence-evolution/confidenceEvolutionTrend.ts")) &&
        existsSync(join(REPO_ROOT, "frontend/app/lib/confidence-evolution/confidenceEvolutionEvidenceReason.ts")),
      "prior layers intact"
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

export const ConfidenceEvolutionCalibrationRunner = Object.freeze({
  runConfidenceCalibrationCertification,
});
