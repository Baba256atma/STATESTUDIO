/**
 * APP-6:9 — Decision Dashboard Integration certification runner.
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
import {
  computeDecisionHistory,
  initializeDecisionHistoryEngine,
  resetDecisionHistoryEngineForTests,
} from "./decisionHistoryEngine.ts";
import {
  deriveDecisionLifecycle,
  initializeDecisionLifecycleEngine,
  resetDecisionLifecycleEngineForTests,
} from "./decisionLifecycleEngine.ts";
import {
  initializeDecisionComparisonEngine,
  resetDecisionComparisonEngineForTests,
} from "./decisionComparisonEngine.ts";
import {
  initializeDecisionQueryEngine,
  resetDecisionQueryEngineForTests,
} from "./decisionQueryEngine.ts";
import { resetDecisionQueryRegistryForTests } from "./decisionQueryRegistry.ts";
import {
  initializeDecisionReplayEngine,
  resetDecisionReplayEngineForTests,
} from "./decisionReplayEngine.ts";
import {
  computeDecisionState,
  initializeDecisionStateEngine,
  resetDecisionStateEngineForTests,
} from "./decisionStateEngine.ts";
import {
  buildDecisionDashboardModel,
  buildDecisionDashboardSummary,
  DECISION_DASHBOARD_INTEGRATION_SELF_MANIFEST,
  getDecisionDashboardContract,
  initializeDecisionDashboardIntegration,
  resetDecisionDashboardIntegrationForTests,
  validateDecisionDashboard,
} from "./decisionDashboardEngine.ts";
import {
  DECISION_DASHBOARD_INTEGRATION_CONTRACT_VERSION,
  type DecisionDashboardCertificationCheck,
  type DecisionDashboardIntegrationCertificationResult,
} from "./decisionDashboardTypes.ts";
import {
  validateFoundationCompatibilityForDashboard,
  validateEngineCompatibilityForDashboard,
} from "./decisionDashboardValidation.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "./decisionTimelineContracts.ts";
import { createDecisionTimelineFoundation } from "./decisionTimelineFoundation.ts";
import { resetDecisionTimelinePlatformForTests } from "./decisionTimelineRunner.ts";
import { DECISION_REPLAY_ENGINE_CONTRACT_VERSION } from "./decisionReplayTypes.ts";
import { DECISION_COMPARISON_ENGINE_CONTRACT_VERSION } from "./decisionComparisonTypes.ts";
import { DECISION_QUERY_ENGINE_CONTRACT_VERSION } from "./decisionQueryTypes.ts";
import { DECISION_STATE_ENGINE_CONTRACT_VERSION } from "./decisionStateTypes.ts";
import { DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION } from "./decisionLifecycleTypes.ts";
import { DECISION_HISTORY_ENGINE_CONTRACT_VERSION } from "./decisionHistoryTypes.ts";
import { DECISION_EVENT_ENGINE_CONTRACT_VERSION } from "./decisionEventTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");
const LEFT_DECISION_ID = "decision-dashboard-cert-left";
const RIGHT_DECISION_ID = "decision-dashboard-cert-right";
const WORKSPACE_ID = "ws-dashboard-cert-001";

function check(id: string, title: string, passed: boolean, evidence: string): DecisionDashboardCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readEngineSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function engineHasNoForbiddenRuntime(): boolean {
  const modules = [
    "app/lib/decision-timeline/decisionDashboardAdapter.ts",
    "app/lib/decision-timeline/decisionDashboardViewModel.ts",
    "app/lib/decision-timeline/decisionDashboardValidation.ts",
  ].map((path) => readEngineSource(path));
  return modules.every(
    (source) =>
      !source.includes("localStorage") &&
      !source.includes("indexedDB") &&
      !source.includes(".tsx") &&
      !source.includes("React.")
  );
}

function protectedPlatformFilesPresent(): boolean {
  const protectedFiles = DECISION_DASHBOARD_INTEGRATION_SELF_MANIFEST.allowedFiles.filter(
    (file) =>
      file.includes("decisionTimeline") ||
      file.includes("decisionEvent") ||
      file.includes("decisionHistory") ||
      file.includes("decisionLifecycle") ||
      file.includes("decisionState") ||
      file.includes("decisionQuery") ||
      file.includes("decisionComparison") ||
      file.includes("decisionReplay")
  );
  return protectedFiles.every((file) => existsSync(join(REPO_ROOT, file)));
}

function seedDecision(
  decisionId: string,
  factories: readonly [
    typeof createDecisionCreatedEvent,
    typeof createDecisionUpdatedEvent,
    typeof createDecisionApprovedEvent | typeof createDecisionRejectedEvent,
    ...(typeof createDecisionExecutedEvent)[]
  ]
) {
  const events = factories.map((factory, index) => {
    const result = factory({
      decisionId,
      workspaceId: WORKSPACE_ID,
      eventId: `${decisionId}-event-${index + 1}`,
      timestamp: `2026-01-01T00:00:${String(index + 1).padStart(2, "0")}.000Z`,
      createdBy: "dashboard-certification",
      title: `Dashboard certification event ${index + 1}`,
      summary: "APP-6:9 certification sample event.",
    });
    if (!result.success || !result.data) {
      throw new Error(result.reason);
    }
    return result.data;
  });

  const historyResult = computeDecisionHistory({ events: Object.freeze(events) });
  if (!historyResult.success || !historyResult.data) {
    throw new Error(historyResult.reason);
  }
  const lifecycle = deriveDecisionLifecycle(historyResult.data);
  const stateResult = computeDecisionState(lifecycle, FIXED_TIME);
  if (!stateResult.success || !stateResult.data) {
    throw new Error(stateResult.reason);
  }
}

export function runDecisionDashboardIntegration(): DecisionDashboardIntegrationCertificationResult {
  resetDecisionDashboardIntegrationForTests();
  resetDecisionReplayEngineForTests();
  resetDecisionComparisonEngineForTests();
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
  initializeDecisionComparisonEngine(FIXED_TIME);
  initializeDecisionReplayEngine(FIXED_TIME);
  initializeDecisionDashboardIntegration(FIXED_TIME);

  const checks: DecisionDashboardCertificationCheck[] = [];

  seedDecision(LEFT_DECISION_ID, [
    createDecisionCreatedEvent,
    createDecisionUpdatedEvent,
    createDecisionApprovedEvent,
    createDecisionExecutedEvent,
  ]);
  seedDecision(RIGHT_DECISION_ID, [
    createDecisionCreatedEvent,
    createDecisionUpdatedEvent,
    createDecisionRejectedEvent,
  ]);

  checks.push(
    check(
      "platform_identity",
      "Dashboard integration contract version is APP-6/9",
      DECISION_DASHBOARD_INTEGRATION_CONTRACT_VERSION === "APP-6/9",
      DECISION_DASHBOARD_INTEGRATION_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "foundation_compatibility",
      "APP-6:1 foundation compatibility",
      validateFoundationCompatibilityForDashboard(FIXED_TIME).valid === true,
      "foundation valid"
    )
  );

  checks.push(
    check(
      "engine_compatibility",
      "Query, Comparison, and Replay engine compatibility",
      validateEngineCompatibilityForDashboard().valid === true,
      "engines ready"
    )
  );

  const contract = getDecisionDashboardContract();
  checks.push(
    check(
      "contract_surface",
      "Contract surface exposes bindings",
      contract.supportedBindings.length >= 7 && contract.mandatoryFields.length >= 10,
      `${contract.supportedBindings.length} bindings`
    )
  );

  const single = buildDecisionDashboardModel({
    binding: "single_decision",
    decisionId: LEFT_DECISION_ID,
    workspaceId: WORKSPACE_ID,
  });
  checks.push(
    check(
      "single_decision_model",
      "Single decision dashboard model",
      single.success === true && single.data?.decisionState?.decisionId === LEFT_DECISION_ID,
      single.reason
    )
  );

  const list = buildDecisionDashboardModel({ binding: "decision_list", workspaceId: WORKSPACE_ID });
  checks.push(
    check(
      "decision_list_model",
      "Decision list dashboard model",
      list.success === true && (list.data?.decisionStates.length ?? 0) === 2,
      String(list.data?.decisionStates.length ?? 0)
    )
  );

  const comparison = buildDecisionDashboardModel({
    binding: "decision_comparison",
    leftDecisionId: LEFT_DECISION_ID,
    rightDecisionId: RIGHT_DECISION_ID,
  });
  checks.push(
    check(
      "comparison_model",
      "Decision comparison dashboard model",
      comparison.success === true && comparison.data?.comparisonSummary?.hasDifferences === true,
      comparison.data?.comparisonSummary?.comparisonId ?? "null"
    )
  );

  const replay = buildDecisionDashboardModel({
    binding: "replay_summary",
    decisionId: LEFT_DECISION_ID,
    workspaceId: WORKSPACE_ID,
  });
  checks.push(
    check(
      "replay_summary_model",
      "Decision replay summary dashboard model",
      replay.success === true && (replay.data?.replaySummary?.totalEvents ?? 0) === 4,
      String(replay.data?.replaySummary?.totalEvents ?? 0)
    )
  );

  const active = buildDecisionDashboardModel({ binding: "active_decisions", workspaceId: WORKSPACE_ID });
  checks.push(
    check(
      "active_decisions_model",
      "Active decisions dashboard model",
      active.success === true && (active.data?.decisionStates.length ?? 0) === 1,
      String(active.data?.decisionStates.length ?? 0)
    )
  );

  const terminal = buildDecisionDashboardModel({ binding: "terminal_decisions", workspaceId: WORKSPACE_ID });
  checks.push(
    check(
      "terminal_decisions_model",
      "Terminal decisions dashboard model",
      terminal.success === true && (terminal.data?.decisionStates.length ?? 0) === 1,
      String(terminal.data?.decisionStates.length ?? 0)
    )
  );

  const recent = buildDecisionDashboardModel({ binding: "recent_decisions", recentLimit: 5 });
  checks.push(
    check(
      "recent_decisions_model",
      "Recent decisions dashboard model",
      recent.success === true && (recent.data?.decisionStates.length ?? 0) === 2,
      String(recent.data?.decisionStates.length ?? 0)
    )
  );

  const summary = buildDecisionDashboardSummary({
    binding: "single_decision",
    decisionId: LEFT_DECISION_ID,
  });
  checks.push(
    check(
      "dashboard_summary",
      "Dashboard summary builder",
      summary.success === true && (summary.data?.decisionSummary.includes("executed") ?? false),
      summary.data?.decisionSummary ?? "null"
    )
  );

  if (single.data) {
    checks.push(
      check(
        "immutable_model",
        "Dashboard model is immutable",
        Object.isFrozen(single.data) && Object.isFrozen(single.data.decisionStates),
        "frozen model"
      )
    );
    checks.push(
      check(
        "dashboard_validation",
        "Dashboard validation",
        validateDecisionDashboard(
          { binding: "single_decision", decisionId: LEFT_DECISION_ID },
          single.data
        ).valid === true,
        "valid"
      )
    );
  } else {
    checks.push(check("immutable_model", "Dashboard model is immutable", false, "missing model"));
  }

  checks.push(
    check(
      "no_lower_layer_access",
      "Dashboard adapter does not access history or lifecycle directly",
      !readEngineSource("app/lib/decision-timeline/decisionDashboardAdapter.ts").includes("getDecisionHistory(") &&
        !readEngineSource("app/lib/decision-timeline/decisionDashboardAdapter.ts").includes("deriveDecisionLifecycle") &&
        !readEngineSource("app/lib/decision-timeline/decisionDashboardViewModel.ts").includes("buildDecisionHistory("),
      "adapter-only consumption"
    )
  );

  checks.push(
    check(
      "query_engine_consumption",
      "Dashboard consumes APP-6:6 query engine",
      readEngineSource("app/lib/decision-timeline/decisionDashboardAdapter.ts").includes("getDecisionById"),
      DECISION_QUERY_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "comparison_engine_consumption",
      "Dashboard consumes APP-6:7 comparison engine",
      readEngineSource("app/lib/decision-timeline/decisionDashboardAdapter.ts").includes("compareDecisions"),
      DECISION_COMPARISON_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "replay_engine_consumption",
      "Dashboard consumes APP-6:8 replay engine",
      readEngineSource("app/lib/decision-timeline/decisionDashboardAdapter.ts").includes("createDecisionReplay"),
      DECISION_REPLAY_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "app6_5_reference",
      "APP-6:5 state contract referenced",
      DECISION_STATE_ENGINE_CONTRACT_VERSION === "APP-6/5",
      DECISION_STATE_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "app6_4_reference",
      "APP-6:4 lifecycle contract referenced via state summaries",
      DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION === "APP-6/4",
      DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "app6_3_reference",
      "APP-6:3 history contract referenced in replay consumption chain",
      DECISION_HISTORY_ENGINE_CONTRACT_VERSION === "APP-6/3",
      DECISION_HISTORY_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "app6_2_reference",
      "APP-6:2 event contract referenced",
      DECISION_EVENT_ENGINE_CONTRACT_VERSION === "APP-6/2",
      DECISION_EVENT_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "stage_manifest",
      "Stage manifest validation",
      validateStageManifest(DECISION_DASHBOARD_INTEGRATION_SELF_MANIFEST).valid === true,
      "manifest valid"
    )
  );

  checks.push(
    check(
      "architecture_boundaries",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/decision-timeline/decisionDashboardEngine.ts",
        allowedFiles: DECISION_DASHBOARD_INTEGRATION_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: DECISION_DASHBOARD_INTEGRATION_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true &&
        evaluateStageFileBoundary({
          filePath: "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
          allowedFiles: DECISION_DASHBOARD_INTEGRATION_SELF_MANIFEST.allowedFiles,
          forbiddenPatterns: DECISION_DASHBOARD_INTEGRATION_SELF_MANIFEST.forbiddenPatterns,
        }).allowed === false,
      "boundaries enforced"
    )
  );

  checks.push(
    check(
      "no_forbidden_runtime",
      "No forbidden runtime dependencies",
      engineHasNoForbiddenRuntime() === true,
      "no UI or persistence runtime"
    )
  );

  checks.push(
    check(
      "protected_platforms_present",
      "APP-6:1 through APP-6:8 files intact",
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

export const DecisionDashboardRunner = Object.freeze({
  runDecisionDashboardIntegration,
});
