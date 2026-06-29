/**
 * APP-9:5 — Confidence Evidence + Reason Link certification runner.
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
  getConfidenceRecordsOrdered,
  initializeConfidenceEvolutionQueryLayer,
  resetConfidenceEvolutionQueryLayerForTests,
} from "./confidenceEvolutionQuery.ts";
import {
  initializeConfidenceEvolutionTrendLayer,
  resetConfidenceEvolutionTrendLayerForTests,
} from "./confidenceEvolutionTrend.ts";
import { calculateConfidenceDeltas } from "./confidenceEvolutionDeltas.ts";
import {
  buildConfidenceEvidenceReasonLinkModel,
  buildConfidenceEvidenceLinks,
  buildConfidenceReasonLinks,
  detectConfidenceExplanationFlags,
  initializeConfidenceEvidenceReasonLayer,
  isConfidenceEvidenceReasonLayerInitialized,
  mapConfidenceMovementsToEvidence,
  mapConfidenceMovementsToReasons,
  resetConfidenceEvidenceReasonLayerForTests,
  CONFIDENCE_EVOLUTION_EVIDENCE_REASON_SELF_MANIFEST,
} from "./confidenceEvolutionEvidenceReason.ts";
import {
  assertNoMutationApisInEvidenceReasonSource,
  validateConfidenceEngineAvailabilityForEvidenceReason,
  validateFoundationCompatibilityForEvidenceReason,
  validateQueryLayerAvailabilityForEvidenceReason,
  validateTrendLayerAvailabilityForEvidenceReason,
} from "./confidenceEvolutionEvidenceReasonValidation.ts";
import {
  CONFIDENCE_EVOLUTION_EVIDENCE_REASON_CONTRACT_VERSION,
  type ConfidenceEvolutionEvidenceReasonCertificationCheck,
  type ConfidenceEvolutionEvidenceReasonCertificationResult,
} from "./confidenceEvolutionEvidenceReasonTypes.ts";
import { isSourceReasonAligned } from "./confidenceEvolutionEvidenceReasonRules.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");
const WORKSPACE_A = "ws-confidence-link-cert-a";
const WORKSPACE_B = "ws-confidence-link-cert-b";

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ConfidenceEvolutionEvidenceReasonCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readEngineSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function sampleRecord(id: string, workspaceId: string, overrides: Record<string, unknown> = {}) {
  return Object.freeze({
    id,
    workspaceId,
    title: `Link certification ${id}`,
    confidenceLevel: "medium" as const,
    confidenceScore: 0.62,
    source: "manual" as const,
    reason: "executive_review" as const,
    notes: "APP-9:5 certification record.",
    evidenceReferences: Object.freeze(["evidence-cert-001"]),
    createdAt: FIXED_TIME,
    tags: Object.freeze(["certification"]),
    ...overrides,
  });
}

function seedLinkRecords() {
  createConfidenceRecord(
    sampleRecord("confidence-link-cert-1", WORKSPACE_A, {
      updatedAt: "2026-01-01T00:00:00.000Z",
      confidenceScore: 0.5,
      source: "evidence",
      reason: "new_evidence",
      evidenceReferences: Object.freeze(["market-analysis-2026"]),
    })
  );
  createConfidenceRecord(
    sampleRecord("confidence-link-cert-2", WORKSPACE_A, {
      updatedAt: "2026-02-01T00:00:00.000Z",
      confidenceScore: 0.75,
      source: "evidence",
      reason: "scenario_completed",
      evidenceReferences: Object.freeze(["scenario-run-2026"]),
    })
  );
  createConfidenceRecord(
    sampleRecord("confidence-link-cert-3", WORKSPACE_A, {
      updatedAt: "2026-03-01T00:00:00.000Z",
      confidenceScore: 0.4,
      source: "manual",
      reason: "unknown",
      evidenceReferences: Object.freeze([]),
    })
  );
  createConfidenceRecord(
    sampleRecord("confidence-link-cert-b1", WORKSPACE_B, {
      updatedAt: "2026-06-01T00:00:00.000Z",
      confidenceScore: 0.8,
      source: "api",
      reason: "unknown",
      evidenceReferences: Object.freeze([]),
    })
  );
}

function orderedRecords(workspaceId: string) {
  return getConfidenceRecordsOrdered(
    Object.freeze({ workspaceId, direction: "asc", includeArchived: false })
  );
}

export function runConfidenceEvidenceReasonCertification(): ConfidenceEvolutionEvidenceReasonCertificationResult {
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
  seedLinkRecords();

  const checks: ConfidenceEvolutionEvidenceReasonCertificationCheck[] = [];

  checks.push(
    check(
      "A_foundation_available",
      "APP-9:1 available",
      validateFoundationCompatibilityForEvidenceReason(FIXED_TIME).valid === true,
      "foundation valid"
    )
  );

  checks.push(
    check(
      "B_engine_available",
      "APP-9:2 engine available",
      validateConfidenceEngineAvailabilityForEvidenceReason().valid === true,
      "engine ready"
    )
  );

  checks.push(
    check(
      "C_query_available",
      "APP-9:3 query layer available",
      validateQueryLayerAvailabilityForEvidenceReason().valid === true,
      "query ready"
    )
  );

  checks.push(
    check(
      "D_trend_available",
      "APP-9:4 trend layer available",
      validateTrendLayerAvailabilityForEvidenceReason().valid === true,
      "trend ready"
    )
  );

  checks.push(
    check(
      "E_link_layer_initialized",
      "Evidence/reason link layer initialized",
      isConfidenceEvidenceReasonLayerInitialized() === true,
      "link layer initialized"
    )
  );

  const empty = buildConfidenceEvidenceReasonLinkModel({ workspaceId: "ws-confidence-link-empty" });
  checks.push(
    check(
      "F_empty_workspace_safe",
      "Empty workspace safe",
      empty.success === true &&
        empty.data?.recordCount === 0 &&
        empty.data.linkCount === 0 &&
        empty.data.evidenceCoverage === 0,
      "empty safe"
    )
  );

  createConfidenceRecord(
    sampleRecord("confidence-link-single-only", "ws-confidence-link-single-only", {
      updatedAt: "2026-07-01T00:00:00.000Z",
      confidenceScore: 0.7,
      source: "evidence",
      reason: "new_evidence",
    })
  );
  const single = buildConfidenceEvidenceReasonLinkModel({ workspaceId: "ws-confidence-link-single-only" });
  checks.push(
    check(
      "G_single_record_safe",
      "Single record safe",
      single.success === true &&
        single.data?.recordCount === 1 &&
        single.data.explainedMovementCount === 0 &&
        single.data.unexplainedMovementCount === 0,
      `records=${single.data?.recordCount}`
    )
  );

  const wsA = buildConfidenceEvidenceReasonLinkModel({ workspaceId: WORKSPACE_A });
  const wsB = buildConfidenceEvidenceReasonLinkModel({ workspaceId: WORKSPACE_B });
  checks.push(
    check(
      "H_workspace_isolation",
      "Workspace isolation",
      wsA.success === true &&
        wsB.success === true &&
        wsA.data?.recordCount === 3 &&
        wsB.data?.recordCount === 1,
      `${wsA.data?.recordCount} in A, ${wsB.data?.recordCount} in B`
    )
  );

  const recordsA = orderedRecords(WORKSPACE_A);
  const reasonLinks = buildConfidenceReasonLinks(WORKSPACE_A, recordsA);
  checks.push(
    check(
      "I_reason_links_deterministic",
      "Reason links deterministic",
      wsA.success === true && reasonLinks.length === 2,
      `${reasonLinks.length} reason links`
    )
  );

  const evidenceLinks = buildConfidenceEvidenceLinks(WORKSPACE_A, recordsA);
  checks.push(
    check(
      "J_evidence_links_deterministic",
      "Evidence links deterministic",
      evidenceLinks.length === 2,
      `${evidenceLinks.length} evidence links`
    )
  );

  const deltas = calculateConfidenceDeltas(recordsA);
  const movementReasonLinks = mapConfidenceMovementsToReasons(WORKSPACE_A, recordsA, deltas);
  const movementEvidenceLinks = mapConfidenceMovementsToEvidence(WORKSPACE_A, recordsA, deltas);
  checks.push(
    check(
      "K_movement_mapping_deterministic",
      "Movement mapping deterministic",
      movementReasonLinks.length === 2 && movementEvidenceLinks.length === 1,
      `${deltas.length} deltas, ${movementEvidenceLinks.length} evidence-mapped`
    )
  );

  const flags = detectConfidenceExplanationFlags(recordsA, deltas);
  checks.push(
    check(
      "L_explanation_flags_deterministic",
      "Explanation flags deterministic",
      flags.some((entry) => entry.type === "has-reason") &&
        flags.some((entry) => entry.type === "has-evidence") &&
        flags.some((entry) => entry.type === "large-change-unexplained") &&
        flags.some((entry) => entry.type === "source-reason-misaligned"),
      `${flags.length} flags`
    )
  );

  checks.push(
    check(
      "M_evidence_coverage_valid",
      "Evidence coverage valid",
      wsA.data !== null &&
        wsA.data.evidenceCoverage >= 0 &&
        wsA.data.evidenceCoverage <= 1 &&
        Math.abs(wsA.data.evidenceCoverage - 2 / 3) < 0.001,
      String(wsA.data?.evidenceCoverage)
    )
  );

  checks.push(
    check(
      "N_reason_source_distributions_valid",
      "Reason/source distributions valid",
      (wsA.data?.reasonDistribution.new_evidence ?? 0) === 1 &&
        (wsA.data?.reasonDistribution.scenario_completed ?? 0) === 1 &&
        (wsA.data?.sourceDistribution.evidence ?? 0) === 2 &&
        (wsA.data?.sourceDistribution.manual ?? 0) === 1,
      "distributions verified"
    )
  );

  checks.push(
    check(
      "O_large_movement_explanation_valid",
      "Large movement explanation valid",
      (wsA.data?.largeMovementCount ?? 0) === 2 &&
        (wsA.data?.unexplainedMovementCount ?? 0) === 1 &&
        (wsA.data?.explainedMovementCount ?? 0) === 1,
      `large=${wsA.data?.largeMovementCount}, unexplained=${wsA.data?.unexplainedMovementCount}`
    )
  );

  checks.push(
    check(
      "P_confidence_bounded",
      "Confidence bounded 0-1",
      (wsA.data?.confidence ?? -1) >= 0 &&
        (wsA.data?.confidence ?? 2) <= 1 &&
        wsA.data?.links.every((link) => link.confidence >= 0 && link.confidence <= 1) === true,
      String(wsA.data?.confidence)
    )
  );

  const linkSourceBundle = [
    readEngineSource("app/lib/confidence-evolution/confidenceEvolutionEvidenceReason.ts"),
    readEngineSource("app/lib/confidence-evolution/confidenceEvolutionEvidenceReasonBuilder.ts"),
    readEngineSource("app/lib/confidence-evolution/confidenceEvolutionExplanationFlags.ts"),
  ].join("\n");
  checks.push(
    check(
      "Q_read_only_behavior",
      "Read-only behavior enforced",
      assertNoMutationApisInEvidenceReasonSource(linkSourceBundle) === true,
      "no mutation APIs"
    )
  );

  checks.push(
    check(
      "R_no_dashboard_coupling",
      "No dashboard coupling",
      !linkSourceBundle.includes("DashboardAdapter") && !linkSourceBundle.includes("dashboard/"),
      "no dashboard"
    )
  );

  checks.push(
    check(
      "S_no_assistant_coupling",
      "No assistant coupling",
      !linkSourceBundle.includes("AssistantAdapter") && !linkSourceBundle.includes("assistant/"),
      "no assistant"
    )
  );

  checks.push(
    check(
      "T_no_visualization",
      "No visualization",
      !linkSourceBundle.includes("ConfidenceChart") && !linkSourceBundle.includes(".tsx"),
      "no visualization"
    )
  );

  checks.push(
    check(
      "U_no_persistence",
      "No persistence",
      !linkSourceBundle.includes("indexedDB") && !linkSourceBundle.includes("localStorage"),
      "no persistence"
    )
  );

  checks.push(
    check(
      "V_no_app6_app7_app8_integration",
      "No APP-6/7/8 integration",
      !linkSourceBundle.includes("decision-timeline/") &&
        !linkSourceBundle.includes("business-timeline/") &&
        !linkSourceBundle.includes("decision-journal/"),
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

  checks.push(
    check(
      "source_reason_alignment",
      "Source-reason alignment map",
      isSourceReasonAligned("evidence", "new_evidence") === true &&
        isSourceReasonAligned("evidence", "scenario_completed") === false,
      "alignment map verified"
    )
  );

  checks.push(
    check(
      "stage_manifest",
      "Stage manifest validation",
      validateStageManifest(CONFIDENCE_EVOLUTION_EVIDENCE_REASON_SELF_MANIFEST).valid === true,
      CONFIDENCE_EVOLUTION_EVIDENCE_REASON_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "architecture_boundaries",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/confidence-evolution/confidenceEvolutionEvidenceReason.ts",
        allowedFiles: CONFIDENCE_EVOLUTION_EVIDENCE_REASON_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: CONFIDENCE_EVOLUTION_EVIDENCE_REASON_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "boundaries enforced"
    )
  );

  checks.push(
    check(
      "contract_version",
      "Link contract version is APP-9/5",
      CONFIDENCE_EVOLUTION_EVIDENCE_REASON_CONTRACT_VERSION === "APP-9/5",
      CONFIDENCE_EVOLUTION_EVIDENCE_REASON_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "foundation_files_preserved",
      "APP-9:1 through APP-9:4 files preserved",
      existsSync(join(REPO_ROOT, "frontend/app/lib/confidence-evolution/confidenceEvolutionFoundation.ts")) &&
        existsSync(join(REPO_ROOT, "frontend/app/lib/confidence-evolution/confidenceEvolutionEngine.ts")) &&
        existsSync(join(REPO_ROOT, "frontend/app/lib/confidence-evolution/confidenceEvolutionQuery.ts")) &&
        existsSync(join(REPO_ROOT, "frontend/app/lib/confidence-evolution/confidenceEvolutionTrend.ts")),
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

export const ConfidenceEvolutionEvidenceReasonRunner = Object.freeze({
  runConfidenceEvidenceReasonCertification,
});
