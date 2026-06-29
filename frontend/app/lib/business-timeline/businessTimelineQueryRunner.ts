/**
 * APP-7:3 — Business Timeline Query certification runner.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION,
  BUSINESS_TIMELINE_PLATFORM_IDENTITY,
} from "./businessTimelineContracts.ts";
import { createBusinessTimelineFoundation } from "./businessTimelineFoundation.ts";
import { resetBusinessTimelinePlatformForTests } from "./businessTimelineRunner.ts";
import {
  createBusinessEvent,
  initializeBusinessEventEngine,
  resetBusinessEventEngineForTests,
} from "./businessEventEngine.ts";
import {
  getBusinessTimelineOrderedEvents,
  getBusinessTimelineRange,
  getBusinessTimelineSummary,
  initializeBusinessTimelineQueryLayer,
  isBusinessTimelineQueryLayerInitialized,
  queryBusinessTimeline,
  resetBusinessTimelineQueryLayerForTests,
  BUSINESS_TIMELINE_QUERY_SELF_MANIFEST,
} from "./businessTimelineQuery.ts";
import { orderBusinessTimelineEvents } from "./businessTimelineOrdering.ts";
import {
  assertNoMutationApisInQuerySource,
  validateFoundationCompatibilityForQuery,
  validateEventEngineAvailabilityForQuery,
} from "./businessTimelineQueryValidation.ts";
import {
  BUSINESS_TIMELINE_QUERY_CONTRACT_VERSION,
  type BusinessTimelineQueryCertificationCheck,
  type BusinessTimelineQueryCertificationResult,
} from "./businessTimelineQueryTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");
const WORKSPACE_A = "ws-query-cert-a";
const WORKSPACE_B = "ws-query-cert-b";

function check(id: string, title: string, passed: boolean, evidence: string): BusinessTimelineQueryCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readEngineSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function sampleEventInput(
  id: string,
  workspaceId: string,
  overrides: Record<string, unknown> = {}
) {
  return Object.freeze({
    id,
    workspaceId,
    title: `Certification event ${id}`,
    description: "APP-7:3 certification sample event.",
    category: "product" as const,
    type: "milestone" as const,
    importance: "high" as const,
    status: "completed" as const,
    source: "manual" as const,
    createdAt: FIXED_TIME,
    occurredAt: FIXED_TIME,
    createdBy: "query-certification",
    tags: Object.freeze(["certification"]),
    ...overrides,
  });
}

function seedCertificationEvents() {
  createBusinessEvent(
    sampleEventInput("business-query-cert-1", WORKSPACE_A, {
      occurredAt: "2026-03-01T00:00:00.000Z",
      createdAt: "2026-03-01T00:00:00.000Z",
      category: "product",
      type: "milestone",
      importance: "critical",
    })
  );
  createBusinessEvent(
    sampleEventInput("business-query-cert-2", WORKSPACE_A, {
      occurredAt: "2026-01-01T00:00:00.000Z",
      createdAt: "2026-01-02T00:00:00.000Z",
      category: "financial",
      type: "investment",
      importance: "high",
    })
  );
  createBusinessEvent(
    sampleEventInput("business-query-cert-3", WORKSPACE_A, {
      occurredAt: "2026-01-01T00:00:00.000Z",
      createdAt: "2026-01-01T00:00:00.000Z",
      category: "operations",
      type: "incident",
      importance: "medium",
      status: "archived",
    })
  );
  createBusinessEvent(
    sampleEventInput("business-query-cert-b1", WORKSPACE_B, {
      occurredAt: "2026-06-01T00:00:00.000Z",
    })
  );
}

export function runBusinessTimelineQueryCertification(): BusinessTimelineQueryCertificationResult {
  resetBusinessTimelineQueryLayerForTests();
  resetBusinessEventEngineForTests();
  resetBusinessTimelinePlatformForTests();
  createBusinessTimelineFoundation(FIXED_TIME);
  initializeBusinessEventEngine(FIXED_TIME);
  initializeBusinessTimelineQueryLayer(FIXED_TIME);
  seedCertificationEvents();

  const checks: BusinessTimelineQueryCertificationCheck[] = [];

  checks.push(
    check(
      "A_foundation_available",
      "APP-7:1 available",
      validateFoundationCompatibilityForQuery(FIXED_TIME).valid === true,
      "foundation valid"
    )
  );

  checks.push(
    check(
      "B_event_engine_available",
      "APP-7:2 event engine available",
      validateEventEngineAvailabilityForQuery().valid === true,
      "event engine ready"
    )
  );

  checks.push(
    check(
      "C_query_layer_initialized",
      "Query layer initialized",
      isBusinessTimelineQueryLayerInitialized() === true,
      "query layer initialized"
    )
  );

  const wsAQuery = queryBusinessTimeline({ workspaceId: WORKSPACE_A });
  const wsBQuery = queryBusinessTimeline({ workspaceId: WORKSPACE_B });
  checks.push(
    check(
      "D_workspace_isolation",
      "Workspace isolation",
      wsAQuery.success === true &&
        wsBQuery.success === true &&
        wsAQuery.data?.totalEvents === 2 &&
        wsBQuery.data?.totalEvents === 1,
      `${wsAQuery.data?.totalEvents ?? 0} in A, ${wsBQuery.data?.totalEvents ?? 0} in B`
    )
  );

  const asc = queryBusinessTimeline({ workspaceId: WORKSPACE_A, direction: "asc" });
  const desc = queryBusinessTimeline({ workspaceId: WORKSPACE_A, direction: "desc" });
  checks.push(
    check(
      "E_ordering_deterministic",
      "Ordering deterministic",
      asc.success === true &&
        desc.success === true &&
        asc.data?.events[0]?.id === "business-query-cert-2" &&
        desc.data?.events[0]?.id === "business-query-cert-1",
      `asc=${asc.data?.events[0]?.id}, desc=${desc.data?.events[0]?.id}`
    )
  );

  checks.push(
    check(
      "F_asc_desc_supported",
      "Ascending/descending supported",
      asc.data?.direction === "asc" && desc.data?.direction === "desc",
      "both directions supported"
    )
  );

  const range = getBusinessTimelineRange(WORKSPACE_A, "2026-02-01T00:00:00.000Z", "2026-12-31T23:59:59.999Z");
  checks.push(
    check(
      "G_range_filtering",
      "Range filtering works",
      range.success === true && range.data?.totalEvents === 1 && range.data.events[0]?.id === "business-query-cert-1",
      `${range.data?.totalEvents ?? 0} in range`
    )
  );

  const category = queryBusinessTimeline({ workspaceId: WORKSPACE_A, category: "financial" });
  const type = queryBusinessTimeline({ workspaceId: WORKSPACE_A, type: "milestone" });
  checks.push(
    check(
      "H_category_type_filtering",
      "Category/type filtering works",
      category.success === true &&
        type.success === true &&
        category.data?.totalEvents === 1 &&
        type.data?.totalEvents === 1,
      "category and type filters applied"
    )
  );

  const importance = queryBusinessTimeline({ workspaceId: WORKSPACE_A, importance: "critical" });
  const status = queryBusinessTimeline({ workspaceId: WORKSPACE_A, status: "completed" });
  const source = queryBusinessTimeline({ workspaceId: WORKSPACE_A, source: "manual" });
  checks.push(
    check(
      "I_importance_status_source_filtering",
      "Importance/status/source filtering works",
      importance.data?.totalEvents === 1 &&
        status.data?.totalEvents === 2 &&
        source.data?.totalEvents === 2,
      "dimension filters applied"
    )
  );

  const tag = queryBusinessTimeline({ workspaceId: WORKSPACE_A, tags: Object.freeze(["certification"]) });
  checks.push(
    check(
      "J_tag_filtering",
      "Tag filtering works",
      tag.success === true && tag.data?.totalEvents === 2,
      `${tag.data?.totalEvents ?? 0} tagged events`
    )
  );

  const excludeArchived = queryBusinessTimeline({ workspaceId: WORKSPACE_A });
  const includeArchived = queryBusinessTimeline({ workspaceId: WORKSPACE_A, includeArchived: true });
  checks.push(
    check(
      "K_archived_policy",
      "Archived policy respected",
      excludeArchived.data?.includedArchived === false &&
        excludeArchived.data?.totalEvents === 2 &&
        includeArchived.data?.totalEvents === 3,
      `excluded=${excludeArchived.data?.totalEvents}, included=${includeArchived.data?.totalEvents}`
    )
  );

  const summary = getBusinessTimelineSummary({ workspaceId: WORKSPACE_A, includeArchived: true });
  checks.push(
    check(
      "L_summary_metadata",
      "Summary metadata accurate",
      summary.firstEventAt === "2026-01-01T00:00:00.000Z" &&
        summary.lastEventAt === "2026-03-01T00:00:00.000Z" &&
        summary.criticalCount === 1 &&
        summary.highCount === 1 &&
        summary.archivedCount === 1 &&
        (summary.categoryCounts.product ?? 0) === 1 &&
        (summary.typeCounts.milestone ?? 0) === 1,
      "summary counts verified"
    )
  );

  const empty = queryBusinessTimeline({ workspaceId: "ws-query-empty" });
  checks.push(
    check(
      "M_empty_workspace_safe",
      "Empty workspace safe",
      empty.success === true && empty.data?.totalEvents === 0 && empty.data.summary.firstEventAt === null,
      "empty result safe"
    )
  );

  const querySourceBundle = [
    readEngineSource("app/lib/business-timeline/businessTimelineQuery.ts"),
    readEngineSource("app/lib/business-timeline/businessTimelineReadModel.ts"),
    readEngineSource("app/lib/business-timeline/businessTimelineQueryFilters.ts"),
  ].join("\n");
  checks.push(
    check(
      "N_no_mutation_apis",
      "No mutation APIs",
      assertNoMutationApisInQuerySource(querySourceBundle) === true,
      "read-only surface"
    )
  );

  const integrationBundle = [
    readEngineSource("app/lib/business-timeline/businessTimelineQuery.ts"),
    readEngineSource("app/lib/business-timeline/businessTimelineReadModel.ts"),
  ].join("\n");
  checks.push(
    check(
      "O_no_dashboard_logic",
      "No dashboard logic",
      !integrationBundle.includes("DashboardAdapter") && !integrationBundle.includes("dashboardIntegration"),
      "no dashboard coupling"
    )
  );

  checks.push(
    check(
      "P_no_assistant_logic",
      "No assistant logic",
      !integrationBundle.includes("AssistantAdapter") && !integrationBundle.includes("assistantIntegration"),
      "no assistant coupling"
    )
  );

  checks.push(
    check(
      "Q_no_visualization_logic",
      "No visualization logic",
      !integrationBundle.includes("TimelineRenderer") && !integrationBundle.includes("BusinessChart"),
      "no UI runtime"
    )
  );

  const protectedFiles = BUSINESS_TIMELINE_QUERY_SELF_MANIFEST.allowedFiles.filter(
    (file) => file.includes("businessTimeline") && !file.includes("businessTimelineQuery")
  );
  checks.push(
    check(
      "R_prior_platforms_untouched",
      "Prior platforms untouched",
      protectedFiles.every((file) => existsSync(join(REPO_ROOT, file))),
      "foundation and engine files present"
    )
  );

  checks.push(
    check(
      "R_app7_identity_regression",
      "APP-7:1 identity regression",
      BUSINESS_TIMELINE_PLATFORM_IDENTITY.appId === "APP-7" &&
        BUSINESS_TIMELINE_PLATFORM_IDENTITY.version === BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION,
      BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION
    )
  );

  const tieEvents = orderBusinessTimelineEvents(
    [
      ...(getBusinessTimelineOrderedEvents({ workspaceId: WORKSPACE_A, includeArchived: true }) ?? []),
    ],
    "asc"
  );
  checks.push(
    check(
      "E_secondary_id_ordering",
      "createdAt secondary and id fallback ordering",
      tieEvents.length >= 2 &&
        tieEvents.findIndex((event) => event.id === "business-query-cert-3") <
          tieEvents.findIndex((event) => event.id === "business-query-cert-2"),
      "tie-break ordering verified"
    )
  );

  checks.push(
    check(
      "stage_manifest",
      "Stage manifest validation",
      validateStageManifest(BUSINESS_TIMELINE_QUERY_SELF_MANIFEST).valid === true,
      "manifest valid"
    )
  );

  checks.push(
    check(
      "architecture_boundaries",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/business-timeline/businessTimelineQuery.ts",
        allowedFiles: BUSINESS_TIMELINE_QUERY_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: BUSINESS_TIMELINE_QUERY_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "boundaries enforced"
    )
  );

  checks.push(
    check(
      "contract_version",
      "Query contract version is APP-7/3",
      BUSINESS_TIMELINE_QUERY_CONTRACT_VERSION === "APP-7/3",
      BUSINESS_TIMELINE_QUERY_CONTRACT_VERSION
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

export const BusinessTimelineQueryRunner = Object.freeze({
  runBusinessTimelineQueryCertification,
});
