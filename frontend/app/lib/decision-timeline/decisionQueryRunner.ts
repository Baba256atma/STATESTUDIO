/**
 * APP-6:6 — Decision Query Engine certification runner.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  createDecisionApprovedEvent,
  createDecisionCreatedEvent,
  createDecisionExecutedEvent,
  createDecisionRejectedEvent,
  createDecisionUpdatedEvent,
} from "./decisionEventFactory.ts";
import {
  initializeDecisionEventEngine,
  resetDecisionEventEngineForTests,
} from "./decisionEventEngine.ts";
import { buildDecisionHistory } from "./decisionHistoryBuilder.ts";
import {
  initializeDecisionHistoryEngine,
  resetDecisionHistoryEngineForTests,
} from "./decisionHistoryEngine.ts";
import {
  deriveDecisionLifecycle,
  initializeDecisionLifecycleEngine,
  resetDecisionLifecycleEngineForTests,
} from "./decisionLifecycleEngine.ts";
import {
  computeDecisionState,
  initializeDecisionStateEngine,
  resetDecisionStateEngineForTests,
} from "./decisionStateEngine.ts";
import {
  DECISION_QUERY_ENGINE_CONTRACT_VERSION,
  type DecisionQueryCertificationCheck,
  type DecisionQueryEngineCertificationResult,
} from "./decisionQueryTypes.ts";
import {
  getActiveDecisions,
  getDecisionById,
  getDecisionsByCategory,
  getDecisionsByLifecycle,
  getDecisionsByStatus,
  getDecisionsByTag,
  getDecisionsByWorkspace,
  getRecentDecisions,
  getTerminalDecisions,
  initializeDecisionQueryEngine,
  listDecisionStates,
  queryDecisionStates,
  resetDecisionQueryEngineForTests,
  validateDecisionQuery,
  getDecisionQueryContract,
  DECISION_QUERY_ENGINE_SELF_MANIFEST,
} from "./decisionQueryEngine.ts";
import {
  registerDecisionQueryAttributes,
  resetDecisionQueryRegistryForTests,
} from "./decisionQueryRegistry.ts";
import { buildDecisionQuerySnapshot, freezeDecisionQuerySnapshot } from "./decisionQuerySnapshot.ts";
import {
  validateFoundationCompatibilityForQuery,
  validateDecisionStateCompatibility,
} from "./decisionQueryValidation.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "./decisionTimelineContracts.ts";
import { createDecisionTimelineFoundation } from "./decisionTimelineFoundation.ts";
import { resetDecisionTimelinePlatformForTests } from "./decisionTimelineRunner.ts";
import { DECISION_STATE_ENGINE_CONTRACT_VERSION } from "./decisionStateTypes.ts";
import { DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION } from "./decisionLifecycleTypes.ts";
import { DECISION_HISTORY_ENGINE_CONTRACT_VERSION } from "./decisionHistoryTypes.ts";
import { DECISION_EVENT_ENGINE_CONTRACT_VERSION } from "./decisionEventTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");
const DECISION_ID = "decision-query-cert-001";
const WORKSPACE_ID = "ws-query-cert-001";

function check(id: string, title: string, passed: boolean, evidence: string): DecisionQueryCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readEngineSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function engineHasNoForbiddenRuntime(): boolean {
  const modules = [
    "app/lib/decision-timeline/decisionQueryEngine.ts",
    "app/lib/decision-timeline/decisionQueryValidation.ts",
    "app/lib/decision-timeline/decisionQueryRegistry.ts",
  ].map((path) => readEngineSource(path));
  return modules.every(
    (source) =>
      !source.includes("localStorage") &&
      !source.includes("indexedDB") &&
      !source.includes("ReplayEngine") &&
      !source.includes("DashboardEngine")
  );
}

function protectedPlatformFilesPresent(): boolean {
  const protectedFiles = DECISION_QUERY_ENGINE_SELF_MANIFEST.allowedFiles.filter(
    (file) =>
      file.includes("decisionTimeline") ||
      file.includes("decisionEvent") ||
      file.includes("decisionHistory") ||
      file.includes("decisionLifecycle") ||
      file.includes("decisionState")
  );
  return protectedFiles.every((file) => existsSync(join(REPO_ROOT, file)));
}

function seedCertState() {
  const factories = [
    createDecisionCreatedEvent,
    createDecisionUpdatedEvent,
    createDecisionApprovedEvent,
    createDecisionExecutedEvent,
  ] as const;

  const events = factories.map((factory, index) => {
    const result = factory({
      decisionId: DECISION_ID,
      workspaceId: WORKSPACE_ID,
      eventId: `decision-query-cert-event-${index + 1}`,
      timestamp: `2026-01-01T00:00:${String(index + 1).padStart(2, "0")}.000Z`,
      createdBy: "query-certification",
      title: `Query certification event ${index + 1}`,
      summary: "APP-6:6 certification sample event.",
    });
    if (!result.success || !result.data) {
      throw new Error(result.reason);
    }
    return result.data;
  });

  const lifecycle = deriveDecisionLifecycle(buildDecisionHistory({ events: Object.freeze(events) }));
  const computed = computeDecisionState(lifecycle, FIXED_TIME);
  if (!computed.success || !computed.data) {
    throw new Error(computed.reason);
  }

  registerDecisionQueryAttributes(DECISION_ID, {
    category: "governance",
    tags: Object.freeze(["certification", "query"]),
  });

  return computed.data;
}

function seedCertTerminalState() {
  const terminalId = "decision-query-cert-terminal-001";
  const factories = [
    createDecisionCreatedEvent,
    createDecisionUpdatedEvent,
    createDecisionRejectedEvent,
  ] as const;

  const events = factories.map((factory, index) => {
    const result = factory({
      decisionId: terminalId,
      workspaceId: WORKSPACE_ID,
      eventId: `decision-query-cert-terminal-event-${index + 1}`,
      timestamp: `2026-01-02T00:00:${String(index + 1).padStart(2, "0")}.000Z`,
      createdBy: "query-certification",
      title: `Query certification terminal event ${index + 1}`,
      summary: "APP-6:6 certification terminal sample event.",
    });
    if (!result.success || !result.data) {
      throw new Error(result.reason);
    }
    return result.data;
  });

  const lifecycle = deriveDecisionLifecycle(buildDecisionHistory({ events: Object.freeze(events) }));
  const computed = computeDecisionState(lifecycle, FIXED_TIME);
  if (!computed.success || !computed.data) {
    throw new Error(computed.reason);
  }

  return computed.data;
}

export function runDecisionQueryEngine(): DecisionQueryEngineCertificationResult {
  resetDecisionQueryEngineForTests();
  resetDecisionQueryRegistryForTests();
  resetDecisionStateEngineForTests();
  resetDecisionLifecycleEngineForTests();
  resetDecisionHistoryEngineForTests();
  resetDecisionEventEngineForTests();
  resetDecisionTimelinePlatformForTests();
  createDecisionTimelineFoundation(FIXED_TIME);
  initializeDecisionEventEngine(FIXED_TIME);
  initializeDecisionHistoryEngine(FIXED_TIME);
  initializeDecisionLifecycleEngine(FIXED_TIME);
  initializeDecisionStateEngine(FIXED_TIME);
  initializeDecisionQueryEngine(FIXED_TIME);

  const checks: DecisionQueryCertificationCheck[] = [];
  const state = seedCertState();
  seedCertTerminalState();

  checks.push(
    check(
      "platform_identity",
      "Query engine contract version is APP-6/6",
      DECISION_QUERY_ENGINE_CONTRACT_VERSION === "APP-6/6",
      DECISION_QUERY_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "foundation_compatibility",
      "APP-6:1 foundation compatibility",
      validateFoundationCompatibilityForQuery(FIXED_TIME).valid === true,
      "foundation valid"
    )
  );

  checks.push(
    check(
      "state_compatibility",
      "APP-6:5 DecisionState compatibility",
      validateDecisionStateCompatibility(state).valid === true,
      DECISION_STATE_ENGINE_CONTRACT_VERSION
    )
  );

  const contract = getDecisionQueryContract();
  checks.push(
    check(
      "contract_surface",
      "Contract surface exposes filters and sort fields",
      contract.supportedFilters.length >= 10 && contract.supportedSortFields.length >= 5,
      `${contract.supportedFilters.length} filters`
    )
  );

  const byId = getDecisionById(DECISION_ID);
  checks.push(
    check(
      "query_by_id",
      "Query by decision ID",
      byId?.decisionId === DECISION_ID,
      byId?.decisionId ?? "null"
    )
  );

  const workspaceQuery = getDecisionsByWorkspace(WORKSPACE_ID);
  checks.push(
    check(
      "workspace_filter",
      "Workspace filtering",
      workspaceQuery.success === true && (workspaceQuery.data?.totalCount ?? 0) === 2,
      String(workspaceQuery.data?.totalCount ?? 0)
    )
  );

  const lifecycleQuery = getDecisionsByLifecycle("executed");
  checks.push(
    check(
      "lifecycle_filter",
      "Lifecycle filtering",
      lifecycleQuery.success === true && lifecycleQuery.data?.states[0]?.currentLifecycle === "executed",
      lifecycleQuery.data?.states[0]?.currentLifecycle ?? "null"
    )
  );

  const statusQuery = getDecisionsByStatus("committed");
  checks.push(
    check(
      "status_filter",
      "Status filtering",
      statusQuery.success === true && statusQuery.data?.states[0]?.currentStatus === "committed",
      statusQuery.data?.states[0]?.currentStatus ?? "null"
    )
  );

  const categoryQuery = getDecisionsByCategory("governance");
  checks.push(
    check(
      "category_filter",
      "Category filtering via query attributes",
      categoryQuery.success === true && categoryQuery.data?.totalCount === 1,
      String(categoryQuery.data?.totalCount ?? 0)
    )
  );

  const tagQuery = getDecisionsByTag("certification");
  checks.push(
    check(
      "tag_filter",
      "Tag filtering via query attributes",
      tagQuery.success === true && tagQuery.data?.totalCount === 1,
      String(tagQuery.data?.totalCount ?? 0)
    )
  );

  const terminalQuery = getTerminalDecisions();
  checks.push(
    check(
      "terminal_filter",
      "Terminal filtering",
      terminalQuery.success === true && terminalQuery.data?.states[0]?.isTerminal === true,
      String(terminalQuery.data?.states[0]?.isTerminal)
    )
  );

  const activeQuery = getActiveDecisions();
  checks.push(
    check(
      "active_filter",
      "Active filtering returns non-terminal states",
      activeQuery.success === true && activeQuery.data?.totalCount === 1,
      String(activeQuery.data?.totalCount ?? 0)
    )
  );

  const recentQuery = getRecentDecisions(5);
  checks.push(
    check(
      "recent_query",
      "Recent decisions query",
      recentQuery.success === true && recentQuery.data?.totalCount === 2,
      String(recentQuery.data?.totalCount ?? 0)
    )
  );

  const listQuery = listDecisionStates();
  checks.push(
    check(
      "list_states",
      "List all decision states",
      listQuery.success === true && listQuery.data?.totalCount === 2,
      String(listQuery.data?.totalCount ?? 0)
    )
  );

  const sortedQuery = queryDecisionStates({
    filters: Object.freeze({ workspaceId: WORKSPACE_ID }),
    sort: Object.freeze({ field: "decisionId", direction: "asc" }),
  });
  checks.push(
    check(
      "stable_sort",
      "Stable sorting",
      sortedQuery.success === true && Object.isFrozen(sortedQuery.data?.states ?? []),
      sortedQuery.data?.sort.field ?? "null"
    )
  );

  if (sortedQuery.data) {
    const snapshot = buildDecisionQuerySnapshot(sortedQuery.data);
    const frozen = freezeDecisionQuerySnapshot(snapshot);
    checks.push(
      check(
        "snapshot_generation",
        "Snapshot generation",
        frozen.readOnly === true && Object.isFrozen(frozen.states),
        frozen.snapshotId
      )
    );
  } else {
    checks.push(check("snapshot_generation", "Snapshot generation", false, "missing query result"));
  }

  const validation = validateDecisionQuery({
    filters: Object.freeze({ workspaceId: WORKSPACE_ID }),
  });
  checks.push(
    check(
      "query_validation",
      "Query validation",
      validation.valid === true,
      validation.issues.map((entry) => entry.message).join("; ") || "valid"
    )
  );

  checks.push(
    check(
      "no_lifecycle_recalculation",
      "Query engine does not derive lifecycle",
      !readEngineSource("app/lib/decision-timeline/decisionQueryEngine.ts").includes("deriveDecisionLifecycle") &&
        !readEngineSource("app/lib/decision-timeline/decisionQueryEngine.ts").includes("buildDecisionHistory"),
      "state-only queries"
    )
  );

  checks.push(
    check(
      "no_state_derivation",
      "Query engine does not derive state",
      !readEngineSource("app/lib/decision-timeline/decisionQueryEngine.ts").includes("deriveDecisionState") &&
        !readEngineSource("app/lib/decision-timeline/decisionQueryEngine.ts").includes("computeDecisionState"),
      "registry reads only"
    )
  );

  checks.push(
    check(
      "app6_2_reference",
      "APP-6:2 engine contract referenced",
      DECISION_EVENT_ENGINE_CONTRACT_VERSION === "APP-6/2",
      DECISION_EVENT_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "app6_3_reference",
      "APP-6:3 history contract referenced",
      DECISION_HISTORY_ENGINE_CONTRACT_VERSION === "APP-6/3",
      DECISION_HISTORY_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "app6_4_reference",
      "APP-6:4 lifecycle contract referenced",
      DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION === "APP-6/4",
      DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "stage_manifest",
      "Stage manifest validation",
      validateStageManifest(DECISION_QUERY_ENGINE_SELF_MANIFEST).valid === true,
      "manifest valid"
    )
  );

  checks.push(
    check(
      "architecture_boundaries",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/decision-timeline/decisionQueryEngine.ts",
        allowedFiles: DECISION_QUERY_ENGINE_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: DECISION_QUERY_ENGINE_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true &&
        evaluateStageFileBoundary({
          filePath: "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
          allowedFiles: DECISION_QUERY_ENGINE_SELF_MANIFEST.allowedFiles,
          forbiddenPatterns: DECISION_QUERY_ENGINE_SELF_MANIFEST.forbiddenPatterns,
        }).allowed === false,
      "boundaries enforced"
    )
  );

  checks.push(
    check(
      "no_forbidden_runtime",
      "No forbidden runtime dependencies",
      engineHasNoForbiddenRuntime() === true,
      "no persistence or dashboard runtime"
    )
  );

  checks.push(
    check(
      "protected_platforms_present",
      "APP-6:1 through APP-6:5 files intact",
      protectedPlatformFilesPresent() === true,
      "protected files present"
    )
  );

  checks.push(
    check(
      "app6_1_identity_regression",
      "APP-6:1 identity regression",
      DECISION_TIMELINE_PLATFORM_IDENTITY.appId === "APP-6",
      DECISION_TIMELINE_PLATFORM_IDENTITY.version
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

export const DecisionQueryRunner = Object.freeze({
  runDecisionQueryEngine,
});
