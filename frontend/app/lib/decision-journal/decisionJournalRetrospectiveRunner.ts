/**
 * APP-8:6 — Decision Journal Retrospective certification runner.
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
  getDecisionJournalEntryById,
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
  initializeDecisionJournalEvidenceAssumptionLayer,
  resetDecisionJournalEvidenceAssumptionLayerForTests,
} from "./decisionJournalEvidenceAssumption.ts";
import { calculateOutcomeStatus } from "./decisionJournalOutcomeRules.ts";
import {
  buildDecisionJournalRetrospectiveModel,
  initializeDecisionJournalRetrospectiveLayer,
  isDecisionJournalRetrospectiveLayerInitialized,
  resetDecisionJournalRetrospectiveLayerForTests,
  DECISION_JOURNAL_RETROSPECTIVE_SELF_MANIFEST,
} from "./decisionJournalRetrospective.ts";
import {
  assertNoAiInRetrospectiveSource,
  assertNoMutationApisInRetrospectiveSource,
  validateEvidenceAssumptionLayerAvailabilityForRetrospective,
  validateFoundationCompatibilityForRetrospective,
  validateJournalEngineAvailabilityForRetrospective,
  validateQueryLayerAvailabilityForRetrospective,
  validateReflectionLayerAvailabilityForRetrospective,
} from "./decisionJournalRetrospectiveValidation.ts";
import {
  DECISION_JOURNAL_RETROSPECTIVE_CONTRACT_VERSION,
  type DecisionJournalRetrospectiveCertificationCheck,
  type DecisionJournalRetrospectiveCertificationResult,
} from "./decisionJournalRetrospectiveTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");
const WORKSPACE_A = "ws-retrospective-cert-a";
const WORKSPACE_B = "ws-retrospective-cert-b";

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): DecisionJournalRetrospectiveCertificationCheck {
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
    title: `Retrospective cert ${id}`,
    summary: "Certification journal entry.",
    rationale: "Executive rationale for retrospective certification.",
    expectedOutcome: "Validated retrospective layer behavior.",
    confidence: "medium" as const,
    author: "retrospective-certification",
    source: "manual" as const,
    createdAt: FIXED_TIME,
    tags: Object.freeze(["certification"]),
    ...overrides,
  });
}

function seedCertificationEntries() {
  createDecisionJournalEntry(
    sampleEntryInput("retrospective-cert-1", WORKSPACE_A, {
      expectedOutcome: "Revenue growth through partner channel.",
      metadata: Object.freeze({
        observedOutcome: "Revenue growth through partner channel.",
        lessonsLearned: "Partner onboarding requires dedicated support",
        assumptionAccuracy: "verified",
        riskRealization: "not_realized",
        evidenceReliability: "reliable",
      }),
      status: "reviewed",
      reviewers: Object.freeze(["reviewer-alpha"]),
      evidenceReferences: Object.freeze(["report-q1"]),
      assumptions: Object.freeze(["Market demand stable"]),
      acceptedRisks: Object.freeze(["Channel conflict"]),
    })
  );
  createDecisionJournalEntry(
    sampleEntryInput("retrospective-cert-2", WORKSPACE_A, {
      expectedOutcome: "Reduce operational cost by fifteen percent.",
      metadata: Object.freeze({
        observedOutcome: "Operational savings achieved in two departments only.",
        assumptionAccuracy: "partially_verified",
        riskRealization: "partial",
        evidenceReliability: "partial",
      }),
      status: "active",
      evidenceReferences: Object.freeze(["report-q2"]),
      assumptions: Object.freeze(["Automation reduces manual work"]),
      acceptedRisks: Object.freeze(["Implementation delay"]),
    })
  );
  createDecisionJournalEntry(
    sampleEntryInput("retrospective-cert-3", WORKSPACE_A, {
      expectedOutcome: "Launch new product line successfully.",
      metadata: Object.freeze({
        observedOutcome: "Product launch exceeded revenue targets and surpassed forecast.",
        outcomeStatus: "exceeded",
        assumptionAccuracy: "invalidated",
        riskRealization: "realized",
        evidenceReliability: "unreliable",
        lessonsLearned: "Validate vendor capacity earlier; Build contingency budget",
      }),
      status: "draft",
      evidenceReferences: Object.freeze([]),
      assumptions: Object.freeze(["Vendor capacity sufficient"]),
      acceptedRisks: Object.freeze(["Vendor capacity insufficient"]),
    })
  );
  createDecisionJournalEntry(
    sampleEntryInput("retrospective-cert-b1", WORKSPACE_B, {
      metadata: Object.freeze({
        observedOutcome: "Isolated outcome observed.",
      }),
    })
  );
}

export function runDecisionJournalRetrospectiveCertification(): DecisionJournalRetrospectiveCertificationResult {
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
  seedCertificationEntries();

  const checks: DecisionJournalRetrospectiveCertificationCheck[] = [];

  checks.push(
    check(
      "A_foundation_available",
      "APP-8:1 available",
      validateFoundationCompatibilityForRetrospective(FIXED_TIME).valid === true,
      "foundation valid"
    )
  );

  checks.push(
    check(
      "B_engine_available",
      "APP-8:2 engine available",
      validateJournalEngineAvailabilityForRetrospective().valid === true,
      "engine ready"
    )
  );

  checks.push(
    check(
      "C_query_layer_available",
      "APP-8:3 query layer available",
      validateQueryLayerAvailabilityForRetrospective().valid === true,
      "query layer ready"
    )
  );

  checks.push(
    check(
      "D_reflection_layer_available",
      "APP-8:4 reflection layer available",
      validateReflectionLayerAvailabilityForRetrospective().valid === true,
      "reflection layer ready"
    )
  );

  checks.push(
    check(
      "E_evidence_assumption_available",
      "APP-8:5 evidence/assumption layer available",
      validateEvidenceAssumptionLayerAvailabilityForRetrospective().valid === true,
      "quality layer ready"
    )
  );

  checks.push(
    check(
      "F_retrospective_initialized",
      "Retrospective layer initialized",
      isDecisionJournalRetrospectiveLayerInitialized() === true,
      "retrospective initialized"
    )
  );

  const empty = buildDecisionJournalRetrospectiveModel({ workspaceId: "ws-retrospective-empty" });
  checks.push(
    check(
      "G_empty_journal_safe",
      "Empty journal safe",
      empty.success === true && empty.data?.entryCount === 0 && empty.data.retrospectives.length === 0,
      "empty model safe"
    )
  );

  const beforeEntry = getDecisionJournalEntryById("retrospective-cert-1");
  const wsA = buildDecisionJournalRetrospectiveModel({ workspaceId: WORKSPACE_A });
  const wsB = buildDecisionJournalRetrospectiveModel({ workspaceId: WORKSPACE_B });
  const afterEntry = getDecisionJournalEntryById("retrospective-cert-1");
  checks.push(
    check(
      "H_workspace_isolation",
      "Workspace isolation",
      wsA.success === true &&
        wsB.success === true &&
        wsA.data?.entryCount === 3 &&
        wsB.data?.entryCount === 1,
      `${wsA.data?.entryCount ?? 0} in A, ${wsB.data?.entryCount ?? 0} in B`
    )
  );

  const aligned = wsA.data?.retrospectives.find((entry) => entry.entryId === "retrospective-cert-1");
  const partial = wsA.data?.retrospectives.find((entry) => entry.entryId === "retrospective-cert-2");
  const exceeded = wsA.data?.retrospectives.find((entry) => entry.entryId === "retrospective-cert-3");
  checks.push(
    check(
      "I_outcome_status_deterministic",
      "Outcome status deterministic",
      aligned?.outcomeStatus === "aligned" &&
        partial?.outcomeStatus === "partially_aligned" &&
        exceeded?.outcomeStatus === "exceeded" &&
        calculateOutcomeStatus("", "something happened") === "unknown",
      `${aligned?.outcomeStatus}/${partial?.outcomeStatus}/${exceeded?.outcomeStatus}`
    )
  );

  const flags = wsA.data?.retrospectiveFlags ?? [];
  checks.push(
    check(
      "J_retrospective_flags",
      "Retrospective flags deterministic",
      flags.some((flag) => flag.type === "outcome-aligned") &&
        flags.some((flag) => flag.type === "lessons-recorded") &&
        flags.some((flag) => flag.type === "assumptions-invalidated") &&
        flags.some((flag) => flag.type === "risk-realized"),
      `${flags.length} flags`
    )
  );

  checks.push(
    check(
      "K_assumption_accuracy",
      "Assumption accuracy valid",
      (aligned?.assumptionAccuracy ?? -1) >= 0 &&
        (aligned?.assumptionAccuracy ?? 2) <= 1 &&
        (exceeded?.assumptionAccuracy ?? 1) === 0,
      `aligned=${aligned?.assumptionAccuracy}, exceeded=${exceeded?.assumptionAccuracy}`
    )
  );

  checks.push(
    check(
      "L_risk_realization",
      "Risk realization valid",
      (partial?.riskRealization ?? -1) === 0.5 &&
        (exceeded?.riskRealization ?? -1) === 1 &&
        (aligned?.riskRealization ?? -1) === 0,
      `partial=${partial?.riskRealization}, exceeded=${exceeded?.riskRealization}`
    )
  );

  checks.push(
    check(
      "M_evidence_reliability",
      "Evidence reliability valid",
      (aligned?.evidenceReliability ?? -1) === 1 &&
        (exceeded?.evidenceReliability ?? -1) === 0,
      `aligned=${aligned?.evidenceReliability}, exceeded=${exceeded?.evidenceReliability}`
    )
  );

  checks.push(
    check(
      "N_review_completeness",
      "Review completeness valid",
      (aligned?.reviewCompleteness ?? -1) === 1 &&
        (partial?.reviewCompleteness ?? -1) === 0.3,
      `aligned=${aligned?.reviewCompleteness}, partial=${partial?.reviewCompleteness}`
    )
  );

  const confidenceBounded =
    (wsA.data?.retrospectives.every(
      (entry) => entry.confidence >= 0 && entry.confidence <= 1
    ) ?? false) && flags.every((flag) => flag.confidence >= 0 && flag.confidence <= 1);
  checks.push(
    check(
      "O_confidence_bounded",
      "Confidence bounded 0–1",
      confidenceBounded === true,
      "confidence bounds verified"
    )
  );

  const sourceBundle = [
    readEngineSource("app/lib/decision-journal/decisionJournalRetrospective.ts"),
    readEngineSource("app/lib/decision-journal/decisionJournalRetrospectiveBuilder.ts"),
    readEngineSource("app/lib/decision-journal/decisionJournalRetrospectiveFlags.ts"),
  ].join("\n");
  checks.push(
    check(
      "P_read_only_behavior",
      "Read-only behavior enforced",
      assertNoMutationApisInRetrospectiveSource(sourceBundle) === true &&
        assertNoAiInRetrospectiveSource(sourceBundle) === true &&
        beforeEntry?.expectedOutcome === afterEntry?.expectedOutcome &&
        beforeEntry?.revisionVersion === afterEntry?.revisionVersion,
      "entries unchanged"
    )
  );

  const integrationBundle = [
    readEngineSource("app/lib/decision-journal/decisionJournalRetrospective.ts"),
    readEngineSource("app/lib/decision-journal/decisionJournalRetrospectiveBuilder.ts"),
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
        DECISION_JOURNAL_PLATFORM_IDENTITY.appId === "APP-8",
      "platform identities verified"
    )
  );

  checks.push(
    check(
      "stage_manifest",
      "Stage manifest validation",
      validateStageManifest(DECISION_JOURNAL_RETROSPECTIVE_SELF_MANIFEST).valid === true,
      "manifest valid"
    )
  );

  checks.push(
    check(
      "architecture_boundaries",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/decision-journal/decisionJournalRetrospective.ts",
        allowedFiles: DECISION_JOURNAL_RETROSPECTIVE_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: DECISION_JOURNAL_RETROSPECTIVE_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "boundaries enforced"
    )
  );

  checks.push(
    check(
      "contract_version",
      "Retrospective contract version is APP-8/6",
      DECISION_JOURNAL_RETROSPECTIVE_CONTRACT_VERSION === "APP-8/6",
      DECISION_JOURNAL_RETROSPECTIVE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "foundation_files_preserved",
      "APP-8:1 through APP-8:5 files preserved",
      existsSync(join(REPO_ROOT, "frontend/app/lib/decision-journal/decisionJournalFoundation.ts")) &&
        existsSync(join(REPO_ROOT, "frontend/app/lib/decision-journal/decisionJournalEngine.ts")) &&
        existsSync(join(REPO_ROOT, "frontend/app/lib/decision-journal/decisionJournalQuery.ts")) &&
        existsSync(join(REPO_ROOT, "frontend/app/lib/decision-journal/decisionJournalReflection.ts")) &&
        existsSync(join(REPO_ROOT, "frontend/app/lib/decision-journal/decisionJournalEvidenceAssumption.ts")),
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

export const DecisionJournalRetrospectiveRunner = Object.freeze({
  runDecisionJournalRetrospectiveCertification,
});
