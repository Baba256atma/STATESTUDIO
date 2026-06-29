/**
 * APP-8:3 — Decision Journal Query certification runner.
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
import { orderDecisionJournalEntries } from "./decisionJournalOrdering.ts";
import {
  getDecisionJournalEntriesOrdered,
  getDecisionJournalRange,
  getDecisionJournalSummary,
  initializeDecisionJournalQueryLayer,
  isDecisionJournalQueryLayerInitialized,
  queryDecisionJournal,
  resetDecisionJournalQueryLayerForTests,
  DECISION_JOURNAL_QUERY_SELF_MANIFEST,
} from "./decisionJournalQuery.ts";
import {
  assertNoMutationApisInQuerySource,
  validateFoundationCompatibilityForQuery,
  validateJournalEngineAvailabilityForQuery,
} from "./decisionJournalQueryValidation.ts";
import {
  DECISION_JOURNAL_QUERY_CONTRACT_VERSION,
  type DecisionJournalQueryCertificationCheck,
  type DecisionJournalQueryCertificationResult,
} from "./decisionJournalQueryTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");
const WORKSPACE_A = "ws-journal-query-cert-a";
const WORKSPACE_B = "ws-journal-query-cert-b";

function check(id: string, title: string, passed: boolean, evidence: string): DecisionJournalQueryCertificationCheck {
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
    title: `Certification journal ${id}`,
    summary: "APP-8:3 certification sample entry.",
    rationale: "Executive rationale for certification entry.",
    expectedOutcome: "Validated query layer behavior.",
    confidence: "high" as const,
    author: "query-certification",
    source: "manual" as const,
    createdAt: FIXED_TIME,
    tags: Object.freeze(["certification"]),
    ...overrides,
  });
}

function seedCertificationEntries() {
  createDecisionJournalEntry(
    sampleEntryInput("journal-query-cert-1", WORKSPACE_A, {
      updatedAt: "2026-03-01T00:00:00.000Z",
      createdAt: "2026-03-01T00:00:00.000Z",
      status: "active",
      confidence: "very_high",
      author: "author-alpha",
    })
  );
  createDecisionJournalEntry(
    sampleEntryInput("journal-query-cert-2", WORKSPACE_A, {
      updatedAt: "2026-01-01T00:00:00.000Z",
      createdAt: "2026-01-02T00:00:00.000Z",
      status: "draft",
      confidence: "medium",
      author: "author-beta",
      source: "api",
    })
  );
  createDecisionJournalEntry(
    sampleEntryInput("journal-query-cert-3", WORKSPACE_A, {
      updatedAt: "2026-01-01T00:00:00.000Z",
      createdAt: "2026-01-01T00:00:00.000Z",
      status: "archived",
      confidence: "low",
      author: "author-gamma",
      reviewers: Object.freeze(["reviewer-alpha"]),
    })
  );
  createDecisionJournalEntry(
    sampleEntryInput("journal-query-cert-4", WORKSPACE_A, {
      updatedAt: "2026-02-01T00:00:00.000Z",
      createdAt: "2026-02-01T00:00:00.000Z",
      status: "reviewed",
      confidence: "high",
      source: "workspace",
      tags: Object.freeze(["certification", "reviewed"]),
    })
  );
  createDecisionJournalEntry(
    sampleEntryInput("journal-query-cert-b1", WORKSPACE_B, {
      updatedAt: "2026-06-01T00:00:00.000Z",
    })
  );
}

export function runDecisionJournalQueryCertification(): DecisionJournalQueryCertificationResult {
  resetDecisionJournalQueryLayerForTests();
  resetDecisionJournalEngineForTests();
  resetDecisionJournalPlatformForTests();
  createDecisionJournalFoundation(FIXED_TIME);
  initializeDecisionJournalEngine(FIXED_TIME);
  initializeDecisionJournalQueryLayer(FIXED_TIME);
  seedCertificationEntries();

  const checks: DecisionJournalQueryCertificationCheck[] = [];

  checks.push(
    check(
      "A_foundation_available",
      "APP-8:1 available",
      validateFoundationCompatibilityForQuery(FIXED_TIME).valid === true,
      "foundation valid"
    )
  );

  checks.push(
    check(
      "B_engine_available",
      "APP-8:2 engine available",
      validateJournalEngineAvailabilityForQuery().valid === true,
      "journal engine ready"
    )
  );

  checks.push(
    check(
      "C_query_initialized",
      "Query initialized",
      isDecisionJournalQueryLayerInitialized() === true,
      "query layer initialized"
    )
  );

  const wsAQuery = queryDecisionJournal({ workspaceId: WORKSPACE_A });
  const wsBQuery = queryDecisionJournal({ workspaceId: WORKSPACE_B });
  checks.push(
    check(
      "D_workspace_isolation",
      "Workspace isolation",
      wsAQuery.success === true &&
        wsBQuery.success === true &&
        wsAQuery.data?.totalEntries === 3 &&
        wsBQuery.data?.totalEntries === 1,
      `${wsAQuery.data?.totalEntries ?? 0} in A, ${wsBQuery.data?.totalEntries ?? 0} in B`
    )
  );

  const asc = queryDecisionJournal({ workspaceId: WORKSPACE_A, direction: "asc", includeArchived: true });
  const desc = queryDecisionJournal({ workspaceId: WORKSPACE_A, direction: "desc", includeArchived: true });
  checks.push(
    check(
      "E_ordering_deterministic",
      "Deterministic ordering",
      asc.success === true &&
        desc.success === true &&
        asc.data?.entries[0]?.id === "journal-query-cert-3" &&
        desc.data?.entries[0]?.id === "journal-query-cert-1",
      `asc=${asc.data?.entries[0]?.id}, desc=${desc.data?.entries[0]?.id}`
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

  const range = getDecisionJournalRange(WORKSPACE_A, "2026-02-01T00:00:00.000Z", "2026-12-31T23:59:59.999Z");
  checks.push(
    check(
      "G_date_filtering",
      "Date filtering",
      range.success === true &&
        range.data?.totalEntries === 2 &&
        range.data.entries.some((entry) => entry.id === "journal-query-cert-1") &&
        range.data.entries.some((entry) => entry.id === "journal-query-cert-4"),
      `${range.data?.totalEntries ?? 0} in range`
    )
  );

  const status = queryDecisionJournal({ workspaceId: WORKSPACE_A, status: "active" });
  checks.push(
    check(
      "H_status_filtering",
      "Status filtering",
      status.success === true && status.data?.totalEntries === 1 && status.data.entries[0]?.id === "journal-query-cert-1",
      `${status.data?.totalEntries ?? 0} active entries`
    )
  );

  const source = queryDecisionJournal({ workspaceId: WORKSPACE_A, source: "api" });
  checks.push(
    check(
      "I_source_filtering",
      "Source filtering",
      source.success === true && source.data?.totalEntries === 1 && source.data.entries[0]?.id === "journal-query-cert-2",
      `${source.data?.totalEntries ?? 0} api entries`
    )
  );

  const confidence = queryDecisionJournal({ workspaceId: WORKSPACE_A, confidence: "very_high" });
  checks.push(
    check(
      "J_confidence_filtering",
      "Confidence filtering",
      confidence.success === true &&
        confidence.data?.totalEntries === 1 &&
        confidence.data.entries[0]?.id === "journal-query-cert-1",
      `${confidence.data?.totalEntries ?? 0} very_high entries`
    )
  );

  const author = queryDecisionJournal({ workspaceId: WORKSPACE_A, author: "author-beta" });
  checks.push(
    check(
      "K_author_filtering",
      "Author filtering",
      author.success === true && author.data?.totalEntries === 1 && author.data.entries[0]?.id === "journal-query-cert-2",
      `${author.data?.totalEntries ?? 0} author matches`
    )
  );

  const reviewer = queryDecisionJournal({ workspaceId: WORKSPACE_A, reviewer: "reviewer-alpha", includeArchived: true });
  checks.push(
    check(
      "L_reviewer_filtering",
      "Reviewer filtering",
      reviewer.success === true &&
        reviewer.data?.totalEntries === 1 &&
        reviewer.data.entries[0]?.id === "journal-query-cert-3",
      `${reviewer.data?.totalEntries ?? 0} reviewer matches`
    )
  );

  const tag = queryDecisionJournal({ workspaceId: WORKSPACE_A, tag: "reviewed" });
  checks.push(
    check(
      "M_tag_filtering",
      "Tag filtering",
      tag.success === true && tag.data?.totalEntries === 1 && tag.data.entries[0]?.id === "journal-query-cert-4",
      `${tag.data?.totalEntries ?? 0} tagged entries`
    )
  );

  const excludeArchived = queryDecisionJournal({ workspaceId: WORKSPACE_A });
  const includeArchived = queryDecisionJournal({ workspaceId: WORKSPACE_A, includeArchived: true });
  checks.push(
    check(
      "N_archive_policy",
      "Archive policy respected",
      excludeArchived.data?.includedArchived === false &&
        excludeArchived.data?.totalEntries === 3 &&
        includeArchived.data?.totalEntries === 4,
      `excluded=${excludeArchived.data?.totalEntries}, included=${includeArchived.data?.totalEntries}`
    )
  );

  const summary = getDecisionJournalSummary({ workspaceId: WORKSPACE_A, includeArchived: true });
  checks.push(
    check(
      "O_summary_metadata",
      "Summary metadata valid",
      summary.firstEntryAt === "2026-01-01T00:00:00.000Z" &&
        summary.lastEntryAt === "2026-03-01T00:00:00.000Z" &&
        summary.archivedCount === 1 &&
        summary.draftCount === 1 &&
        summary.reviewedCount === 1 &&
        summary.activeCount === 1 &&
        (summary.confidenceDistribution.very_high ?? 0) === 1 &&
        (summary.authorCounts["author-beta"] ?? 0) === 1 &&
        (summary.sourceCounts.api ?? 0) === 1,
      "summary counts verified"
    )
  );

  const querySourceBundle = [
    readEngineSource("app/lib/decision-journal/decisionJournalQuery.ts"),
    readEngineSource("app/lib/decision-journal/decisionJournalReadModel.ts"),
    readEngineSource("app/lib/decision-journal/decisionJournalQueryFilters.ts"),
  ].join("\n");
  checks.push(
    check(
      "P_read_only_behavior",
      "Read-only behavior enforced",
      assertNoMutationApisInQuerySource(querySourceBundle) === true,
      "no mutation APIs in query layer"
    )
  );

  const integrationBundle = [
    readEngineSource("app/lib/decision-journal/decisionJournalQuery.ts"),
    readEngineSource("app/lib/decision-journal/decisionJournalReadModel.ts"),
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

  const tieEntries = orderDecisionJournalEntries(
    getDecisionJournalEntriesOrdered({ workspaceId: WORKSPACE_A, includeArchived: true }),
    "asc"
  );
  checks.push(
    check(
      "E_secondary_id_ordering",
      "createdAt secondary and id fallback ordering",
      tieEntries.length >= 2 &&
        tieEntries.findIndex((entry) => entry.id === "journal-query-cert-3") <
          tieEntries.findIndex((entry) => entry.id === "journal-query-cert-2"),
      "tie-break ordering verified"
    )
  );

  const empty = queryDecisionJournal({ workspaceId: "ws-journal-query-empty" });
  checks.push(
    check(
      "empty_workspace_safe",
      "Empty workspace safe",
      empty.success === true && empty.data?.totalEntries === 0 && empty.data.summary.firstEntryAt === null,
      "empty result safe"
    )
  );

  checks.push(
    check(
      "stage_manifest",
      "Stage manifest validation",
      validateStageManifest(DECISION_JOURNAL_QUERY_SELF_MANIFEST).valid === true,
      "manifest valid"
    )
  );

  checks.push(
    check(
      "architecture_boundaries",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/decision-journal/decisionJournalQuery.ts",
        allowedFiles: DECISION_JOURNAL_QUERY_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: DECISION_JOURNAL_QUERY_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "boundaries enforced"
    )
  );

  checks.push(
    check(
      "contract_version",
      "Query contract version is APP-8/3",
      DECISION_JOURNAL_QUERY_CONTRACT_VERSION === "APP-8/3",
      DECISION_JOURNAL_QUERY_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "foundation_files_preserved",
      "APP-8:1 and APP-8:2 files preserved",
      existsSync(join(REPO_ROOT, "frontend/app/lib/decision-journal/decisionJournalFoundation.ts")) &&
        existsSync(join(REPO_ROOT, "frontend/app/lib/decision-journal/decisionJournalEngine.ts")),
      "foundation and engine intact"
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

export const DecisionJournalQueryRunner = Object.freeze({
  runDecisionJournalQueryCertification,
});
