/**
 * APP-8:4 — Decision Journal Reflection certification runner.
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
  getDecisionJournalEntriesOrdered,
  initializeDecisionJournalQueryLayer,
  resetDecisionJournalQueryLayerForTests,
} from "./decisionJournalQuery.ts";
import {
  buildDecisionJournalReflectionModel,
  initializeDecisionJournalReflectionLayer,
  isDecisionJournalReflectionLayerInitialized,
  resetDecisionJournalReflectionLayerForTests,
  DECISION_JOURNAL_REFLECTION_SELF_MANIFEST,
} from "./decisionJournalReflection.ts";
import {
  extractAssumptionPatterns,
  extractDecisionJournalInsights,
  extractRiskPatterns,
  summarizeDecisionJournalEvidence,
} from "./decisionJournalInsightExtraction.ts";
import {
  assertNoAiInReflectionSource,
  assertNoMutationApisInReflectionSource,
  validateFoundationCompatibilityForReflection,
  validateJournalEngineAvailabilityForReflection,
  validateQueryLayerAvailabilityForReflection,
} from "./decisionJournalReflectionValidation.ts";
import {
  DECISION_JOURNAL_REFLECTION_CONTRACT_VERSION,
  type DecisionJournalReflectionCertificationCheck,
  type DecisionJournalReflectionCertificationResult,
} from "./decisionJournalReflectionTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");
const WORKSPACE_A = "ws-reflection-cert-a";
const WORKSPACE_B = "ws-reflection-cert-b";

function check(id: string, title: string, passed: boolean, evidence: string): DecisionJournalReflectionCertificationCheck {
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
    title: `Reflection cert ${id}`,
    summary: "Certification journal entry.",
    rationale: "Executive rationale for reflection certification.",
    expectedOutcome: "Validated reflection layer behavior.",
    confidence: "medium" as const,
    author: "reflection-certification",
    source: "manual" as const,
    createdAt: FIXED_TIME,
    tags: Object.freeze(["certification"]),
    ...overrides,
  });
}

function seedCertificationEntries() {
  createDecisionJournalEntry(
    sampleEntryInput("reflection-cert-1", WORKSPACE_A, {
      assumptions: Object.freeze(["Market demand remains stable", "Partner channel viable"]),
      acceptedRisks: Object.freeze(["Channel conflict", "Brand dilution"]),
      evidenceReferences: Object.freeze(["report-q1-2026"]),
      alternatives: Object.freeze(["Direct sales", "Partner channel", "Hybrid model"]),
      tradeoffs: Object.freeze(["Speed vs control"]),
      constraints: Object.freeze(["Budget cap Q2"]),
      status: "reviewed",
      reviewers: Object.freeze(["reviewer-alpha"]),
      confidence: "high",
    })
  );
  createDecisionJournalEntry(
    sampleEntryInput("reflection-cert-2", WORKSPACE_A, {
      assumptions: Object.freeze(["Market demand remains stable", "Team capacity sufficient"]),
      acceptedRisks: Object.freeze(["Channel conflict", "Execution delay"]),
      evidenceReferences: Object.freeze([]),
      alternatives: Object.freeze([]),
      tradeoffs: Object.freeze(["Speed vs control", "Cost vs quality"]),
      constraints: Object.freeze(["Budget cap Q2", "Regulatory deadline"]),
      status: "active",
      confidence: "very_high",
    })
  );
  createDecisionJournalEntry(
    sampleEntryInput("reflection-cert-3", WORKSPACE_A, {
      assumptions: Object.freeze(["Legacy system stable"]),
      acceptedRisks: Object.freeze(["Technical debt"]),
      evidenceReferences: Object.freeze([]),
      alternatives: Object.freeze(["Option A", "Option B", "Option C", "Option D"]),
      status: "draft",
      confidence: "low",
    })
  );
  createDecisionJournalEntry(
    sampleEntryInput("reflection-cert-b1", WORKSPACE_B, {
      assumptions: Object.freeze(["Isolated workspace assumption"]),
    })
  );
}

function getCertEntries(workspaceId: string) {
  return getDecisionJournalEntriesOrdered({ workspaceId, includeArchived: false });
}

export function runDecisionJournalReflectionCertification(): DecisionJournalReflectionCertificationResult {
  resetDecisionJournalReflectionLayerForTests();
  resetDecisionJournalQueryLayerForTests();
  resetDecisionJournalEngineForTests();
  resetDecisionJournalPlatformForTests();
  createDecisionJournalFoundation(FIXED_TIME);
  initializeDecisionJournalEngine(FIXED_TIME);
  initializeDecisionJournalQueryLayer(FIXED_TIME);
  initializeDecisionJournalReflectionLayer(FIXED_TIME);
  seedCertificationEntries();

  const checks: DecisionJournalReflectionCertificationCheck[] = [];

  checks.push(
    check(
      "A_foundation_available",
      "APP-8:1 available",
      validateFoundationCompatibilityForReflection(FIXED_TIME).valid === true,
      "foundation valid"
    )
  );

  checks.push(
    check(
      "B_engine_available",
      "APP-8:2 engine available",
      validateJournalEngineAvailabilityForReflection().valid === true,
      "engine ready"
    )
  );

  checks.push(
    check(
      "C_query_layer_available",
      "APP-8:3 query layer available",
      validateQueryLayerAvailabilityForReflection().valid === true,
      "query layer ready"
    )
  );

  checks.push(
    check(
      "D_reflection_initialized",
      "Reflection layer initialized",
      isDecisionJournalReflectionLayerInitialized() === true,
      "reflection initialized"
    )
  );

  const empty = buildDecisionJournalReflectionModel({ workspaceId: "ws-reflection-empty" });
  checks.push(
    check(
      "E_empty_journal_safe",
      "Empty journal safe",
      empty.success === true && empty.data?.entryCount === 0 && empty.data.insightItems.length === 0,
      "empty reflection safe"
    )
  );

  const wsA = buildDecisionJournalReflectionModel({ workspaceId: WORKSPACE_A });
  const wsB = buildDecisionJournalReflectionModel({ workspaceId: WORKSPACE_B });
  checks.push(
    check(
      "F_workspace_isolation",
      "Workspace isolation",
      wsA.success === true &&
        wsB.success === true &&
        wsA.data?.entryCount === 3 &&
        wsB.data?.entryCount === 1,
      `${wsA.data?.entryCount ?? 0} in A, ${wsB.data?.entryCount ?? 0} in B`
    )
  );

  const certEntriesA = getCertEntries(WORKSPACE_A);
  const assumptionPatterns = extractAssumptionPatterns(certEntriesA);
  checks.push(
    check(
      "G_assumption_patterns",
      "Assumption patterns deterministic",
      assumptionPatterns.some((pattern) => pattern.pattern === "Market demand remains stable" && pattern.occurrenceCount === 2),
      `${assumptionPatterns.length} assumption patterns`
    )
  );

  const riskPatterns = extractRiskPatterns(certEntriesA);
  checks.push(
    check(
      "H_risk_patterns",
      "Risk patterns deterministic",
      riskPatterns.some((pattern) => pattern.pattern === "Channel conflict" && pattern.occurrenceCount === 2),
      `${riskPatterns.length} risk patterns`
    )
  );

  const evidenceSummary = summarizeDecisionJournalEvidence(certEntriesA);
  checks.push(
    check(
      "I_evidence_summary",
      "Evidence summary deterministic",
      evidenceSummary.totalReferences === 1 &&
        evidenceSummary.entriesWithNoEvidence === 2 &&
        evidenceSummary.entriesWithEvidence === 1,
      `${evidenceSummary.entriesWithNoEvidence} low evidence entries`
    )
  );

  checks.push(
    check(
      "J_alternative_summary",
      "Alternative summary deterministic",
      wsA.data?.alternativeSummary.entriesWithNone === 1 &&
        wsA.data?.alternativeSummary.entriesWithMany === 2,
      `${wsA.data?.alternativeSummary.entriesWithNone ?? 0} no-alternative, ${wsA.data?.alternativeSummary.entriesWithMany ?? 0} many-alternative entries`
    )
  );

  checks.push(
    check(
      "K_confidence_summary",
      "Confidence summary valid",
      wsA.data !== null &&
        wsA.data.confidenceSummary.averageScore >= 0 &&
        wsA.data.confidenceSummary.averageScore <= 1 &&
        wsA.data.confidenceSummary.dominantLevel !== null,
      `avg=${wsA.data?.confidenceSummary.averageScore}`
    )
  );

  checks.push(
    check(
      "L_review_summary",
      "Review summary valid",
      wsA.data?.reviewSummary.reviewedCount === 1 && wsA.data?.reviewSummary.unreviewedCount === 2,
      `${wsA.data?.reviewSummary.unreviewedCount ?? 0} unreviewed`
    )
  );

  const insights = extractDecisionJournalInsights(certEntriesA, WORKSPACE_A);
  checks.push(
    check(
      "M_insight_extraction",
      "Insight extraction deterministic",
      insights.some((item) => item.type === "repeated-assumption") &&
        insights.some((item) => item.type === "low-evidence") &&
        insights.some((item) => item.type === "high-confidence-low-evidence") &&
        insights.some((item) => item.type === "no-alternatives") &&
        insights.some((item) => item.type === "unreviewed-entry"),
      `${insights.length} insights extracted`
    )
  );

  const severitiesValid = insights.every((item) =>
    (["low", "medium", "high", "critical"] as const).includes(item.severity)
  );
  checks.push(
    check(
      "N_severity_valid",
      "Severity valid",
      severitiesValid === true,
      "all severities valid"
    )
  );

  const confidenceBounded = insights.every((item) => item.confidence >= 0 && item.confidence <= 1);
  checks.push(
    check(
      "O_confidence_bounded",
      "Confidence bounded 0–1",
      confidenceBounded === true &&
        (wsA.data?.confidenceSummary.averageScore ?? -1) >= 0 &&
        (wsA.data?.confidenceSummary.averageScore ?? 2) <= 1,
      "confidence bounds verified"
    )
  );

  const reflectionSourceBundle = [
    readEngineSource("app/lib/decision-journal/decisionJournalReflection.ts"),
    readEngineSource("app/lib/decision-journal/decisionJournalReflectionBuilder.ts"),
    readEngineSource("app/lib/decision-journal/decisionJournalInsightExtraction.ts"),
  ].join("\n");
  checks.push(
    check(
      "P_read_only_behavior",
      "Read-only behavior enforced",
      assertNoMutationApisInReflectionSource(reflectionSourceBundle) === true &&
        assertNoAiInReflectionSource(reflectionSourceBundle) === true,
      "read-only surface"
    )
  );

  const integrationBundle = [
    readEngineSource("app/lib/decision-journal/decisionJournalReflection.ts"),
    readEngineSource("app/lib/decision-journal/decisionJournalInsightExtraction.ts"),
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
      validateStageManifest(DECISION_JOURNAL_REFLECTION_SELF_MANIFEST).valid === true,
      "manifest valid"
    )
  );

  checks.push(
    check(
      "architecture_boundaries",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/decision-journal/decisionJournalReflection.ts",
        allowedFiles: DECISION_JOURNAL_REFLECTION_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: DECISION_JOURNAL_REFLECTION_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "boundaries enforced"
    )
  );

  checks.push(
    check(
      "contract_version",
      "Reflection contract version is APP-8/4",
      DECISION_JOURNAL_REFLECTION_CONTRACT_VERSION === "APP-8/4",
      DECISION_JOURNAL_REFLECTION_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "foundation_files_preserved",
      "APP-8:1 through APP-8:3 files preserved",
      existsSync(join(REPO_ROOT, "frontend/app/lib/decision-journal/decisionJournalFoundation.ts")) &&
        existsSync(join(REPO_ROOT, "frontend/app/lib/decision-journal/decisionJournalEngine.ts")) &&
        existsSync(join(REPO_ROOT, "frontend/app/lib/decision-journal/decisionJournalQuery.ts")),
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

export const DecisionJournalReflectionRunner = Object.freeze({
  runDecisionJournalReflectionCertification,
});
