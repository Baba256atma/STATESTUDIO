/**
 * APP-8:5 — Decision Journal Evidence + Assumption certification runner.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  BUSINESS_TIMELINE_PLATFORM_IDENTITY,
} from "../business-timeline/businessTimelineContracts.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "../decision-timeline/decisionTimelineContracts.ts";
import {
  SCENARIO_TIMELINE_PLATFORM_IDENTITY,
} from "../scenario-timeline/scenarioTimelinePlatformContracts.ts";
import {
  DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION,
  DECISION_JOURNAL_PLATFORM_IDENTITY,
} from "./decisionJournalContracts.ts";
import { createDecisionJournalFoundation } from "./decisionJournalFoundation.ts";
import { resetDecisionJournalPlatformForTests } from "./decisionJournalRunner.ts";
import {
  createDecisionJournalEntry,
  initializeDecisionJournalEngine,
  resetDecisionJournalEngineForTests,
} from "./decisionJournalEngine.ts";
import {
  initializeDecisionJournalQueryLayer,
  resetDecisionJournalQueryLayerForTests,
} from "./decisionJournalQuery.ts";
import {
  initializeDecisionJournalReflectionLayer,
  resetDecisionJournalReflectionLayerForTests,
} from "./decisionJournalReflection.ts";
import {
  buildDecisionJournalEvidenceAssumptionModel,
  initializeDecisionJournalEvidenceAssumptionLayer,
  isDecisionJournalEvidenceAssumptionLayerInitialized,
  resetDecisionJournalEvidenceAssumptionLayerForTests,
  DECISION_JOURNAL_EVIDENCE_ASSUMPTION_SELF_MANIFEST,
} from "./decisionJournalEvidenceAssumption.ts";
import { calculateAssumptionCoverage } from "./decisionJournalAssumptionRules.ts";
import { calculateEvidenceStrength } from "./decisionJournalEvidenceRules.ts";
import {
  assertNoAiInEvidenceAssumptionSource,
  assertNoMutationApisInEvidenceAssumptionSource,
  validateFoundationCompatibilityForEvidenceAssumption,
  validateJournalEngineAvailabilityForEvidenceAssumption,
  validateQueryLayerAvailabilityForEvidenceAssumption,
  validateReflectionLayerAvailabilityForEvidenceAssumption,
} from "./decisionJournalEvidenceAssumptionValidation.ts";
import {
  DECISION_JOURNAL_EVIDENCE_ASSUMPTION_CONTRACT_VERSION,
  type DecisionJournalEvidenceAssumptionCertificationCheck,
  type DecisionJournalEvidenceAssumptionCertificationResult,
} from "./decisionJournalEvidenceAssumptionTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");
const WORKSPACE_A = "ws-evidence-cert-a";
const WORKSPACE_B = "ws-evidence-cert-b";

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): DecisionJournalEvidenceAssumptionCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readEngineSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function sampleEntryInput(
  id: string,
  workspaceId: string,
  overrides: Record<string, unknown> = {}
) {
  return Object.freeze({
    id,
    workspaceId,
    title: `Evidence cert ${id}`,
    summary: "Certification journal entry.",
    rationale: "Executive rationale for evidence certification.",
    expectedOutcome: "Validated evidence and assumption quality behavior.",
    confidence: "medium" as const,
    author: "evidence-certification",
    source: "manual" as const,
    createdAt: FIXED_TIME,
    tags: Object.freeze(["certification"]),
    ...overrides,
  });
}

function seedCertificationEntries() {
  createDecisionJournalEntry(
    sampleEntryInput("evidence-cert-1", WORKSPACE_A, {
      evidenceReferences: Object.freeze(["report-a", "report-b", "report-c"]),
      assumptions: Object.freeze(["Market stable", "Budget approved"]),
      acceptedRisks: Object.freeze(["Market slowdown"]),
      confidence: "high",
    })
  );
  createDecisionJournalEntry(
    sampleEntryInput("evidence-cert-2", WORKSPACE_A, {
      evidenceReferences: Object.freeze(["report-single"]),
      assumptions: Object.freeze(["Market stable", "Vendor reliable"]),
      acceptedRisks: Object.freeze(["Market slowdown", "Vendor delay"]),
      confidence: "very_high",
    })
  );
  createDecisionJournalEntry(
    sampleEntryInput("evidence-cert-3", WORKSPACE_A, {
      evidenceReferences: Object.freeze([]),
      assumptions: Object.freeze(["Legacy stable", "Team ready", "Budget approved", "Timeline feasible"]),
      acceptedRisks: Object.freeze(["Legacy stable"]),
      confidence: "very_high",
    })
  );
  createDecisionJournalEntry(
    sampleEntryInput("evidence-cert-b1", WORKSPACE_B, {
      evidenceReferences: Object.freeze(["isolated-report"]),
      assumptions: Object.freeze(["Isolated assumption"]),
    })
  );
}

export function runDecisionJournalEvidenceAssumptionCertification(): DecisionJournalEvidenceAssumptionCertificationResult {
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
  seedCertificationEntries();

  const checks: DecisionJournalEvidenceAssumptionCertificationCheck[] = [];

  checks.push(
    check(
      "A_foundation_available",
      "APP-8:1 available",
      validateFoundationCompatibilityForEvidenceAssumption(FIXED_TIME).valid === true,
      "foundation valid"
    )
  );

  checks.push(
    check(
      "B_engine_available",
      "APP-8:2 engine available",
      validateJournalEngineAvailabilityForEvidenceAssumption().valid === true,
      "engine ready"
    )
  );

  checks.push(
    check(
      "C_query_layer_available",
      "APP-8:3 query layer available",
      validateQueryLayerAvailabilityForEvidenceAssumption().valid === true,
      "query layer ready"
    )
  );

  checks.push(
    check(
      "D_reflection_layer_available",
      "APP-8:4 reflection layer available",
      validateReflectionLayerAvailabilityForEvidenceAssumption().valid === true,
      "reflection layer ready"
    )
  );

  checks.push(
    check(
      "E_layer_initialized",
      "Evidence/assumption layer initialized",
      isDecisionJournalEvidenceAssumptionLayerInitialized() === true,
      "layer initialized"
    )
  );

  const empty = buildDecisionJournalEvidenceAssumptionModel({ workspaceId: "ws-evidence-empty" });
  checks.push(
    check(
      "F_empty_journal_safe",
      "Empty journal safe",
      empty.success === true && empty.data?.entryCount === 0 && empty.data.qualityFlags.length === 0,
      "empty model safe"
    )
  );

  const wsA = buildDecisionJournalEvidenceAssumptionModel({ workspaceId: WORKSPACE_A });
  const wsB = buildDecisionJournalEvidenceAssumptionModel({ workspaceId: WORKSPACE_B });
  checks.push(
    check(
      "G_workspace_isolation",
      "Workspace isolation",
      wsA.success === true &&
        wsB.success === true &&
        wsA.data?.entryCount === 3 &&
        wsB.data?.entryCount === 1,
      `${wsA.data?.entryCount ?? 0} in A, ${wsB.data?.entryCount ?? 0} in B`
    )
  );

  const strongEvidence = wsA.data?.evidenceModels.find((model) => model.entryId === "evidence-cert-1");
  const weakEvidence = wsA.data?.evidenceModels.find((model) => model.entryId === "evidence-cert-2");
  const noEvidence = wsA.data?.evidenceModels.find((model) => model.entryId === "evidence-cert-3");
  checks.push(
    check(
      "H_evidence_scoring",
      "Evidence scoring deterministic",
      strongEvidence?.evidenceStrength === "strong" &&
        weakEvidence?.evidenceStrength === "weak" &&
        noEvidence?.evidenceStrength === "none",
      `${strongEvidence?.evidenceStrength}/${weakEvidence?.evidenceStrength}/${noEvidence?.evidenceStrength}`
    )
  );

  const assumptionHigh = wsA.data?.assumptionModels.find((model) => model.entryId === "evidence-cert-1");
  const assumptionExcessive = wsA.data?.assumptionModels.find((model) => model.entryId === "evidence-cert-3");
  checks.push(
    check(
      "I_assumption_scoring",
      "Assumption scoring deterministic",
      assumptionHigh?.assumptionCoverage === "medium" &&
        assumptionExcessive?.assumptionCoverage === "high" &&
        calculateAssumptionCoverage(0) === "none",
      `${assumptionHigh?.assumptionCoverage}/${assumptionExcessive?.assumptionCoverage}`
    )
  );

  checks.push(
    check(
      "J_evidence_coverage",
      "Evidence coverage valid",
      (strongEvidence?.evidenceCoverage ?? -1) >= 0 &&
        (strongEvidence?.evidenceCoverage ?? 2) <= 1 &&
        (noEvidence?.evidenceCoverage ?? 1) === 0,
      `strong=${strongEvidence?.evidenceCoverage}, none=${noEvidence?.evidenceCoverage}`
    )
  );

  checks.push(
    check(
      "K_assumption_coverage",
      "Assumption coverage valid",
      calculateAssumptionCoverage(1) === "low" &&
        calculateAssumptionCoverage(2) === "medium" &&
        calculateAssumptionCoverage(5) === "excessive",
      "coverage thresholds verified"
    )
  );

  const flags = wsA.data?.qualityFlags ?? [];
  checks.push(
    check(
      "L_quality_flags",
      "Quality flags deterministic",
      flags.some((flag) => flag.type === "no-evidence") &&
        flags.some((flag) => flag.type === "weak-evidence") &&
        flags.some((flag) => flag.type === "high-confidence-weak-evidence") &&
        flags.some((flag) => flag.type === "many-assumptions") &&
        flags.some((flag) => flag.type === "risk-without-evidence") &&
        flags.some((flag) => flag.type === "evidence-strong"),
      `${flags.length} quality flags`
    )
  );

  checks.push(
    check(
      "M_confidence_evidence_alignment",
      "Confidence/evidence alignment valid",
      (strongEvidence?.confidenceEvidenceAlignment ?? -1) >= 0 &&
        (strongEvidence?.confidenceEvidenceAlignment ?? 2) <= 1 &&
        (noEvidence?.confidenceEvidenceAlignment ?? 2) < (strongEvidence?.confidenceEvidenceAlignment ?? 0),
      `aligned=${strongEvidence?.confidenceEvidenceAlignment}`
    )
  );

  checks.push(
    check(
      "N_risk_evidence_alignment",
      "Risk/evidence alignment valid",
      (noEvidence?.riskEvidenceAlignment ?? 1) === 0 &&
        (strongEvidence?.riskEvidenceAlignment ?? -1) >= 0 &&
        (strongEvidence?.riskEvidenceAlignment ?? 2) <= 1,
      `riskAligned=${strongEvidence?.riskEvidenceAlignment}`
    )
  );

  const confidenceBounded =
    (wsA.data?.evidenceModels.every((model) => model.confidence >= 0 && model.confidence <= 1) ?? false) &&
    (wsA.data?.assumptionModels.every((model) => model.confidence >= 0 && model.confidence <= 1) ?? false) &&
    flags.every((flag) => flag.confidence >= 0 && flag.confidence <= 1);
  checks.push(
    check(
      "O_confidence_bounded",
      "Confidence bounded 0–1",
      confidenceBounded === true,
      "confidence bounds verified"
    )
  );

  const sourceBundle = [
    readEngineSource("app/lib/decision-journal/decisionJournalEvidenceAssumption.ts"),
    readEngineSource("app/lib/decision-journal/decisionJournalEvidenceAssumptionBuilder.ts"),
    readEngineSource("app/lib/decision-journal/decisionJournalQualityFlags.ts"),
  ].join("\n");
  checks.push(
    check(
      "P_read_only_behavior",
      "Read-only behavior enforced",
      assertNoMutationApisInEvidenceAssumptionSource(sourceBundle) === true &&
        assertNoAiInEvidenceAssumptionSource(sourceBundle) === true,
      "read-only surface"
    )
  );

  const integrationBundle = [
    readEngineSource("app/lib/decision-journal/decisionJournalEvidenceAssumption.ts"),
    readEngineSource("app/lib/decision-journal/decisionJournalQualityFlags.ts"),
  ].join("\n");
  checks.push(
    check(
      "Q_no_dashboard_coupling",
      "No dashboard coupling",
      !integrationBundle.includes("DashboardAdapter") && !integrationBundle.includes("dashboard/"),
      "no dashboard coupling"
    )
  );

  checks.push(
    check(
      "R_no_assistant_coupling",
      "No assistant coupling",
      !integrationBundle.includes("AssistantAdapter") && !integrationBundle.includes("assistant/"),
      "no assistant coupling"
    )
  );

  checks.push(
    check(
      "S_no_visualization",
      "No visualization",
      !integrationBundle.includes("JournalChart") && !integrationBundle.includes(".tsx"),
      "no UI runtime"
    )
  );

  checks.push(
    check(
      "T_no_persistence",
      "No persistence",
      !integrationBundle.includes("indexedDB") && !integrationBundle.includes("localStorage"),
      "no persistence"
    )
  );

  checks.push(
    check(
      "U_no_app6_integration",
      "No APP-6 integration",
      !integrationBundle.includes("decision-timeline/"),
      "no decision timeline imports"
    )
  );

  checks.push(
    check(
      "V_prior_platforms_untouched",
      "Prior platforms untouched",
      SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId === "APP-5" &&
        DECISION_TIMELINE_PLATFORM_IDENTITY.appId === "APP-6" &&
        BUSINESS_TIMELINE_PLATFORM_IDENTITY.appId === "APP-7" &&
        DECISION_JOURNAL_PLATFORM_IDENTITY.appId === "APP-8" &&
        calculateEvidenceStrength(3) === "strong",
      "platform identities verified"
    )
  );

  checks.push(
    check(
      "stage_manifest",
      "Stage manifest validation",
      validateStageManifest(DECISION_JOURNAL_EVIDENCE_ASSUMPTION_SELF_MANIFEST).valid === true,
      "manifest valid"
    )
  );

  checks.push(
    check(
      "architecture_boundaries",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/decision-journal/decisionJournalEvidenceAssumption.ts",
        allowedFiles: DECISION_JOURNAL_EVIDENCE_ASSUMPTION_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: DECISION_JOURNAL_EVIDENCE_ASSUMPTION_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "boundaries enforced"
    )
  );

  checks.push(
    check(
      "contract_version",
      "Evidence/assumption contract version is APP-8/5",
      DECISION_JOURNAL_EVIDENCE_ASSUMPTION_CONTRACT_VERSION === "APP-8/5",
      DECISION_JOURNAL_EVIDENCE_ASSUMPTION_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "foundation_files_preserved",
      "APP-8:1 through APP-8:4 files preserved",
      existsSync(join(REPO_ROOT, "frontend/app/lib/decision-journal/decisionJournalFoundation.ts")) &&
        existsSync(join(REPO_ROOT, "frontend/app/lib/decision-journal/decisionJournalEngine.ts")) &&
        existsSync(join(REPO_ROOT, "frontend/app/lib/decision-journal/decisionJournalQuery.ts")) &&
        existsSync(join(REPO_ROOT, "frontend/app/lib/decision-journal/decisionJournalReflection.ts")),
      "prior phases intact"
    )
  );

  checks.push(
    check(
      "app8_identity_regression",
      "APP-8:1 identity regression",
      DECISION_JOURNAL_PLATFORM_IDENTITY.appId === "APP-8" &&
        DECISION_JOURNAL_PLATFORM_IDENTITY.version === DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION,
      DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION
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

export const DecisionJournalEvidenceAssumptionRunner = Object.freeze({
  runDecisionJournalEvidenceAssumptionCertification,
});
