/**
 * APP-9:3 — Confidence Evolution Query certification runner.
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
import { orderConfidenceRecords } from "./confidenceEvolutionOrdering.ts";
import {
  getConfidenceEvolutionRange,
  getConfidenceEvolutionSummary,
  getConfidenceRecordsOrdered,
  initializeConfidenceEvolutionQueryLayer,
  isConfidenceEvolutionQueryLayerInitialized,
  queryConfidenceEvolution,
  resetConfidenceEvolutionQueryLayerForTests,
  CONFIDENCE_EVOLUTION_QUERY_SELF_MANIFEST,
} from "./confidenceEvolutionQuery.ts";
import {
  assertNoMutationApisInQuerySource,
  validateConfidenceEngineAvailabilityForQuery,
  validateFoundationCompatibilityForQuery,
} from "./confidenceEvolutionQueryValidation.ts";
import {
  CONFIDENCE_EVOLUTION_QUERY_CONTRACT_VERSION,
  type ConfidenceEvolutionQueryCertificationCheck,
  type ConfidenceEvolutionQueryCertificationResult,
} from "./confidenceEvolutionQueryTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");
const WORKSPACE_A = "ws-confidence-query-cert-a";
const WORKSPACE_B = "ws-confidence-query-cert-b";

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ConfidenceEvolutionQueryCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readEngineSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function sampleRecordInput(
  id: string,
  workspaceId: string,
  overrides: Record<string, unknown> = {}
) {
  return Object.freeze({
    id,
    workspaceId,
    title: `Certification confidence ${id}`,
    confidenceLevel: "medium" as const,
    confidenceScore: 0.62,
    source: "manual" as const,
    reason: "executive_review" as const,
    notes: "APP-9:3 certification sample record.",
    createdAt: FIXED_TIME,
    tags: Object.freeze(["certification"]),
    ...overrides,
  });
}

function seedCertificationRecords() {
  createConfidenceRecord(
    sampleRecordInput("confidence-query-cert-1", WORKSPACE_A, {
      updatedAt: "2026-03-01T00:00:00.000Z",
      createdAt: "2026-03-01T00:00:00.000Z",
      status: "active",
      confidenceLevel: "very_high",
      confidenceScore: 0.95,
      reason: "new_evidence",
    })
  );
  createConfidenceRecord(
    sampleRecordInput("confidence-query-cert-2", WORKSPACE_A, {
      updatedAt: "2026-01-01T00:00:00.000Z",
      createdAt: "2026-01-02T00:00:00.000Z",
      status: "draft",
      confidenceLevel: "medium",
      confidenceScore: 0.55,
      source: "api",
      reason: "manual_revision",
    })
  );
  createConfidenceRecord(
    sampleRecordInput("confidence-query-cert-3", WORKSPACE_A, {
      updatedAt: "2026-01-01T00:00:00.000Z",
      createdAt: "2026-01-01T00:00:00.000Z",
      status: "archived",
      confidenceLevel: "low",
      confidenceScore: 0.25,
      reason: "risk_changed",
    })
  );
  createConfidenceRecord(
    sampleRecordInput("confidence-query-cert-4", WORKSPACE_A, {
      updatedAt: "2026-02-01T00:00:00.000Z",
      createdAt: "2026-02-01T00:00:00.000Z",
      status: "reviewed",
      confidenceLevel: "high",
      confidenceScore: 0.82,
      source: "workspace",
      reason: "scenario_completed",
      tags: Object.freeze(["certification", "reviewed"]),
    })
  );
  createConfidenceRecord(
    sampleRecordInput("confidence-query-cert-b1", WORKSPACE_B, {
      updatedAt: "2026-06-01T00:00:00.000Z",
      confidenceScore: 0.7,
    })
  );
}

export function runConfidenceEvolutionQueryCertification(): ConfidenceEvolutionQueryCertificationResult {
  resetConfidenceEvolutionQueryLayerForTests();
  resetConfidenceEvolutionEngineForTests();
  resetConfidenceEvolutionPlatformForTests();
  createConfidenceEvolutionFoundation(FIXED_TIME);
  initializeConfidenceEvolutionEngine(FIXED_TIME);
  initializeConfidenceEvolutionQueryLayer(FIXED_TIME);
  seedCertificationRecords();

  const checks: ConfidenceEvolutionQueryCertificationCheck[] = [];

  checks.push(
    check(
      "A_foundation_available",
      "APP-9:1 available",
      validateFoundationCompatibilityForQuery(FIXED_TIME).valid === true,
      "foundation valid"
    )
  );

  checks.push(
    check(
      "B_engine_available",
      "APP-9:2 engine available",
      validateConfidenceEngineAvailabilityForQuery().valid === true,
      "confidence engine ready"
    )
  );

  checks.push(
    check(
      "C_query_initialized",
      "Query initialized",
      isConfidenceEvolutionQueryLayerInitialized() === true,
      "query layer initialized"
    )
  );

  const wsAQuery = queryConfidenceEvolution({ workspaceId: WORKSPACE_A });
  const wsBQuery = queryConfidenceEvolution({ workspaceId: WORKSPACE_B });
  checks.push(
    check(
      "D_workspace_isolation",
      "Workspace isolation",
      wsAQuery.success === true &&
        wsBQuery.success === true &&
        wsAQuery.data?.totalRecords === 3 &&
        wsBQuery.data?.totalRecords === 1,
      `${wsAQuery.data?.totalRecords ?? 0} in A, ${wsBQuery.data?.totalRecords ?? 0} in B`
    )
  );

  const asc = queryConfidenceEvolution({ workspaceId: WORKSPACE_A, direction: "asc", includeArchived: true });
  const desc = queryConfidenceEvolution({ workspaceId: WORKSPACE_A, direction: "desc", includeArchived: true });
  checks.push(
    check(
      "E_ordering_deterministic",
      "Deterministic ordering",
      asc.success === true &&
        desc.success === true &&
        asc.data?.records[0]?.id === "confidence-query-cert-3" &&
        desc.data?.records[0]?.id === "confidence-query-cert-1",
      `asc=${asc.data?.records[0]?.id}, desc=${desc.data?.records[0]?.id}`
    )
  );

  checks.push(
    check(
      "F_asc_desc_ordering",
      "Asc/Desc ordering",
      asc.data?.ordering.direction === "asc" && desc.data?.ordering.direction === "desc",
      "both directions supported"
    )
  );

  const range = getConfidenceEvolutionRange(WORKSPACE_A, "2026-02-01T00:00:00.000Z", "2026-12-31T23:59:59.999Z");
  checks.push(
    check(
      "G_date_filtering",
      "Date filtering",
      range.success === true &&
        range.data?.totalRecords === 2 &&
        range.data.records.some((record) => record.id === "confidence-query-cert-1") &&
        range.data.records.some((record) => record.id === "confidence-query-cert-4"),
      `${range.data?.totalRecords ?? 0} in range`
    )
  );

  const level = queryConfidenceEvolution({ workspaceId: WORKSPACE_A, confidenceLevel: "very_high" });
  checks.push(
    check(
      "H_confidence_level_filtering",
      "Confidence level filtering",
      level.success === true &&
        level.data?.totalRecords === 1 &&
        level.data.records[0]?.id === "confidence-query-cert-1",
      `${level.data?.totalRecords ?? 0} very_high records`
    )
  );

  const scoreRange = queryConfidenceEvolution({
    workspaceId: WORKSPACE_A,
    confidenceScoreMin: 0.8,
    confidenceScoreMax: 0.9,
    includeArchived: true,
  });
  checks.push(
    check(
      "I_confidence_score_range_filtering",
      "Confidence score range filtering",
      scoreRange.success === true &&
        scoreRange.data?.totalRecords === 1 &&
        scoreRange.data.records[0]?.id === "confidence-query-cert-4",
      `${scoreRange.data?.totalRecords ?? 0} in score range`
    )
  );

  const source = queryConfidenceEvolution({ workspaceId: WORKSPACE_A, source: "api" });
  checks.push(
    check(
      "J_source_filtering",
      "Source filtering",
      source.success === true &&
        source.data?.totalRecords === 1 &&
        source.data.records[0]?.id === "confidence-query-cert-2",
      `${source.data?.totalRecords ?? 0} api records`
    )
  );

  const reason = queryConfidenceEvolution({ workspaceId: WORKSPACE_A, reason: "risk_changed", includeArchived: true });
  checks.push(
    check(
      "K_reason_filtering",
      "Reason filtering",
      reason.success === true &&
        reason.data?.totalRecords === 1 &&
        reason.data.records[0]?.id === "confidence-query-cert-3",
      `${reason.data?.totalRecords ?? 0} risk_changed records`
    )
  );

  const status = queryConfidenceEvolution({ workspaceId: WORKSPACE_A, status: "active" });
  checks.push(
    check(
      "L_status_filtering",
      "Status filtering",
      status.success === true &&
        status.data?.totalRecords === 1 &&
        status.data.records[0]?.id === "confidence-query-cert-1",
      `${status.data?.totalRecords ?? 0} active records`
    )
  );

  const tag = queryConfidenceEvolution({ workspaceId: WORKSPACE_A, tag: "reviewed" });
  checks.push(
    check(
      "M_tag_filtering",
      "Tag filtering",
      tag.success === true &&
        tag.data?.totalRecords === 1 &&
        tag.data.records[0]?.id === "confidence-query-cert-4",
      `${tag.data?.totalRecords ?? 0} tagged records`
    )
  );

  const excludeArchived = queryConfidenceEvolution({ workspaceId: WORKSPACE_A });
  const includeArchived = queryConfidenceEvolution({ workspaceId: WORKSPACE_A, includeArchived: true });
  checks.push(
    check(
      "N_archive_policy",
      "Archive policy respected",
      excludeArchived.data?.includedArchived === false &&
        excludeArchived.data?.totalRecords === 3 &&
        includeArchived.data?.totalRecords === 4,
      `excluded=${excludeArchived.data?.totalRecords}, included=${includeArchived.data?.totalRecords}`
    )
  );

  const summary = getConfidenceEvolutionSummary({ workspaceId: WORKSPACE_A, includeArchived: true });
  checks.push(
    check(
      "O_summary_metadata",
      "Summary metadata valid",
      summary.firstRecordAt === "2026-01-01T00:00:00.000Z" &&
        summary.lastRecordAt === "2026-03-01T00:00:00.000Z" &&
        summary.archivedCount === 1 &&
        summary.draftCount === 1 &&
        summary.reviewedCount === 1 &&
        summary.activeCount === 1 &&
        (summary.confidenceLevelDistribution.very_high ?? 0) === 1 &&
        (summary.sourceCounts.api ?? 0) === 1 &&
        (summary.reasonCounts.risk_changed ?? 0) === 1,
      "summary counts verified"
    )
  );

  checks.push(
    check(
      "P_confidence_score_stats",
      "Confidence score stats valid",
      summary.minConfidenceScore === 0.25 &&
        summary.maxConfidenceScore === 0.95 &&
        summary.averageConfidenceScore !== null &&
        Math.abs((summary.averageConfidenceScore ?? 0) - 0.6425) < 0.001,
      `avg=${summary.averageConfidenceScore}`
    )
  );

  const querySourceBundle = [
    readEngineSource("app/lib/confidence-evolution/confidenceEvolutionQuery.ts"),
    readEngineSource("app/lib/confidence-evolution/confidenceEvolutionReadModel.ts"),
    readEngineSource("app/lib/confidence-evolution/confidenceEvolutionQueryFilters.ts"),
  ].join("\n");
  checks.push(
    check(
      "Q_read_only_behavior",
      "Read-only behavior enforced",
      assertNoMutationApisInQuerySource(querySourceBundle) === true,
      "no mutation APIs in query layer"
    )
  );

  const integrationBundle = [
    readEngineSource("app/lib/confidence-evolution/confidenceEvolutionQuery.ts"),
    readEngineSource("app/lib/confidence-evolution/confidenceEvolutionReadModel.ts"),
  ].join("\n");
  checks.push(
    check(
      "R_no_dashboard_coupling",
      "No dashboard coupling",
      !integrationBundle.includes("DashboardAdapter") && !integrationBundle.includes("dashboard/"),
      "no dashboard coupling"
    )
  );

  checks.push(
    check(
      "S_no_assistant_coupling",
      "No assistant coupling",
      !integrationBundle.includes("AssistantAdapter") && !integrationBundle.includes("assistant/"),
      "no assistant coupling"
    )
  );

  checks.push(
    check(
      "T_no_visualization",
      "No visualization",
      !integrationBundle.includes("ConfidenceChart") && !integrationBundle.includes(".tsx"),
      "no UI runtime"
    )
  );

  checks.push(
    check(
      "U_no_persistence",
      "No persistence",
      !integrationBundle.includes("indexedDB") && !integrationBundle.includes("localStorage"),
      "no persistence"
    )
  );

  checks.push(
    check(
      "V_no_app6_app7_app8_integration",
      "No APP-6/7/8 integration",
      !integrationBundle.includes("decision-timeline/") &&
        !integrationBundle.includes("business-timeline/") &&
        !integrationBundle.includes("decision-journal/"),
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
      "platform identities verified"
    )
  );

  const tieRecords = orderConfidenceRecords(
    getConfidenceRecordsOrdered({ workspaceId: WORKSPACE_A, includeArchived: true }),
    "asc"
  );
  checks.push(
    check(
      "E_secondary_id_ordering",
      "createdAt secondary and id fallback ordering",
      tieRecords.length >= 2 &&
        tieRecords.findIndex((record) => record.id === "confidence-query-cert-3") <
          tieRecords.findIndex((record) => record.id === "confidence-query-cert-2"),
      "tie-break ordering verified"
    )
  );

  const empty = queryConfidenceEvolution({ workspaceId: "ws-confidence-query-empty" });
  checks.push(
    check(
      "empty_workspace_safe",
      "Empty workspace safe",
      empty.success === true &&
        empty.data?.totalRecords === 0 &&
        empty.data.summary.firstRecordAt === null &&
        empty.data.summary.averageConfidenceScore === null,
      "empty result safe"
    )
  );

  checks.push(
    check(
      "stage_manifest",
      "Stage manifest validation",
      validateStageManifest(CONFIDENCE_EVOLUTION_QUERY_SELF_MANIFEST).valid === true,
      "manifest valid"
    )
  );

  checks.push(
    check(
      "architecture_boundaries",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/confidence-evolution/confidenceEvolutionQuery.ts",
        allowedFiles: CONFIDENCE_EVOLUTION_QUERY_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: CONFIDENCE_EVOLUTION_QUERY_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "boundaries enforced"
    )
  );

  checks.push(
    check(
      "contract_version",
      "Query contract version is APP-9/3",
      CONFIDENCE_EVOLUTION_QUERY_CONTRACT_VERSION === "APP-9/3",
      CONFIDENCE_EVOLUTION_QUERY_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "foundation_files_preserved",
      "APP-9:1 and APP-9:2 files preserved",
      existsSync(join(REPO_ROOT, "frontend/app/lib/confidence-evolution/confidenceEvolutionFoundation.ts")) &&
        existsSync(join(REPO_ROOT, "frontend/app/lib/confidence-evolution/confidenceEvolutionEngine.ts")),
      "foundation and engine intact"
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

export const ConfidenceEvolutionQueryRunner = Object.freeze({
  runConfidenceEvolutionQueryCertification,
});
