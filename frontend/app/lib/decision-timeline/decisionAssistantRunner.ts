/**
 * APP-6:10 — Decision Assistant Integration certification runner.
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
  initializeDecisionDashboardIntegration,
  resetDecisionDashboardIntegrationForTests,
} from "./decisionDashboardEngine.ts";
import {
  buildDecisionAssistantModel,
  buildDecisionAssistantSummary,
  buildDecisionExplanation,
  DECISION_ASSISTANT_INTEGRATION_SELF_MANIFEST,
  getDecisionAssistantContract,
  getDecisionAssistantModel,
  initializeDecisionAssistantIntegration,
  resetDecisionAssistantIntegrationForTests,
  validateDecisionAssistant,
} from "./decisionAssistantEngine.ts";
import {
  DECISION_ASSISTANT_INTEGRATION_CONTRACT_VERSION,
  type DecisionAssistantCertificationCheck,
  type DecisionAssistantIntegrationCertificationResult,
} from "./decisionAssistantTypes.ts";
import {
  validateEngineCompatibilityForAssistant,
  validateFoundationCompatibilityForAssistant,
} from "./decisionAssistantValidation.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "./decisionTimelineContracts.ts";
import { createDecisionTimelineFoundation } from "./decisionTimelineFoundation.ts";
import { resetDecisionTimelinePlatformForTests } from "./decisionTimelineRunner.ts";
import { DECISION_DASHBOARD_INTEGRATION_CONTRACT_VERSION } from "./decisionDashboardTypes.ts";
import { DECISION_REPLAY_ENGINE_CONTRACT_VERSION } from "./decisionReplayTypes.ts";
import { DECISION_COMPARISON_ENGINE_CONTRACT_VERSION } from "./decisionComparisonTypes.ts";
import { DECISION_QUERY_ENGINE_CONTRACT_VERSION } from "./decisionQueryTypes.ts";
import { DECISION_STATE_ENGINE_CONTRACT_VERSION } from "./decisionStateTypes.ts";
import { DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION } from "./decisionLifecycleTypes.ts";
import { DECISION_HISTORY_ENGINE_CONTRACT_VERSION } from "./decisionHistoryTypes.ts";
import { DECISION_EVENT_ENGINE_CONTRACT_VERSION } from "./decisionEventTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");
const LEFT_DECISION_ID = "decision-assistant-cert-left";
const RIGHT_DECISION_ID = "decision-assistant-cert-right";
const WORKSPACE_ID = "ws-assistant-cert-001";

const ASSISTANT_ADAPTER_MODULES = Object.freeze([
  "app/lib/decision-timeline/decisionAssistantAdapter.ts",
  "app/lib/decision-timeline/decisionAssistantViewModel.ts",
  "app/lib/decision-timeline/decisionAssistantValidation.ts",
  "app/lib/decision-timeline/decisionAssistantExplanation.ts",
] as const);

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): DecisionAssistantCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readEngineSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function engineHasNoForbiddenRuntime(): boolean {
  return ASSISTANT_ADAPTER_MODULES.map((path) => readEngineSource(path)).every(
    (source) =>
      !source.includes("localStorage") &&
      !source.includes("indexedDB") &&
      !source.includes(".tsx") &&
      !source.includes("React.")
  );
}

function assistantConsumesDashboardOnly(): boolean {
  const adapterSource = readEngineSource("app/lib/decision-timeline/decisionAssistantAdapter.ts");
  return (
    adapterSource.includes("decisionDashboardEngine.ts") &&
    adapterSource.includes("buildDecisionDashboardModel") &&
    !adapterSource.includes("decisionQueryEngine.ts") &&
    !adapterSource.includes("decisionComparisonEngine.ts") &&
    !adapterSource.includes("decisionReplayEngine.ts")
  );
}

function assistantAvoidsLowerLayerCalls(): boolean {
  const modules = [
    ...ASSISTANT_ADAPTER_MODULES,
    "app/lib/decision-timeline/decisionAssistantEngine.ts",
  ].map((path) => readEngineSource(path));
  return modules.every(
    (source) =>
      !source.includes("getDecisionById(") &&
      !source.includes("compareDecisions(") &&
      !source.includes("createDecisionReplay(") &&
      !source.includes("deriveDecisionLifecycle") &&
      !source.includes("computeDecisionHistory(")
  );
}

function protectedPlatformFilesPresent(): boolean {
  const protectedFiles = DECISION_ASSISTANT_INTEGRATION_SELF_MANIFEST.allowedFiles.filter(
    (file) =>
      file.includes("decisionTimeline") ||
      file.includes("decisionEvent") ||
      file.includes("decisionHistory") ||
      file.includes("decisionLifecycle") ||
      file.includes("decisionState") ||
      file.includes("decisionQuery") ||
      file.includes("decisionComparison") ||
      file.includes("decisionReplay") ||
      file.includes("decisionDashboard")
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
      createdBy: "assistant-certification",
      title: `Assistant certification event ${index + 1}`,
      summary: "APP-6:10 certification sample event.",
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

export function runDecisionAssistantIntegration(): DecisionAssistantIntegrationCertificationResult {
  resetDecisionAssistantIntegrationForTests();
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
  initializeDecisionAssistantIntegration(FIXED_TIME);

  const checks: DecisionAssistantCertificationCheck[] = [];

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
      "Assistant integration contract version is APP-6/10",
      DECISION_ASSISTANT_INTEGRATION_CONTRACT_VERSION === "APP-6/10",
      DECISION_ASSISTANT_INTEGRATION_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "foundation_compatibility",
      "APP-6:1 foundation compatibility",
      validateFoundationCompatibilityForAssistant(FIXED_TIME).valid === true,
      "foundation valid"
    )
  );

  checks.push(
    check(
      "engine_compatibility",
      "Dashboard integration engine compatibility",
      validateEngineCompatibilityForAssistant().valid === true,
      "dashboard ready"
    )
  );

  const contract = getDecisionAssistantContract();
  checks.push(
    check(
      "contract_surface",
      "Contract surface exposes assistant bindings",
      contract.supportedBindings.length >= 7 && contract.mandatoryFields.length >= 10,
      `${contract.supportedBindings.length} bindings`
    )
  );

  const single = buildDecisionAssistantModel({
    binding: "single_decision_explanation",
    decisionId: LEFT_DECISION_ID,
    workspaceId: WORKSPACE_ID,
  });
  checks.push(
    check(
      "single_decision_explanation",
      "Single decision explanation model",
      single.success === true && single.data?.decisionStateSummary?.decisionId === LEFT_DECISION_ID,
      single.reason
    )
  );

  const summary = buildDecisionAssistantSummary({
    binding: "decision_summary",
    decisionId: LEFT_DECISION_ID,
    workspaceId: WORKSPACE_ID,
  });
  checks.push(
    check(
      "decision_summary",
      "Decision summary binding",
      summary.success === true && (summary.data?.decisionSummary.includes("executed") ?? false),
      summary.data?.decisionSummary ?? "null"
    )
  );

  const comparison = buildDecisionAssistantModel({
    binding: "comparison_summary",
    leftDecisionId: LEFT_DECISION_ID,
    rightDecisionId: RIGHT_DECISION_ID,
  });
  checks.push(
    check(
      "comparison_summary",
      "Comparison summary binding",
      comparison.success === true && comparison.data?.comparisonSummary?.hasDifferences === true,
      comparison.data?.comparisonSummary?.comparisonId ?? "null"
    )
  );

  const replay = buildDecisionAssistantModel({
    binding: "replay_summary",
    decisionId: LEFT_DECISION_ID,
    workspaceId: WORKSPACE_ID,
  });
  checks.push(
    check(
      "replay_summary",
      "Replay summary binding",
      replay.success === true && (replay.data?.replaySummary?.totalEvents ?? 0) === 4,
      String(replay.data?.replaySummary?.totalEvents ?? 0)
    )
  );

  const status = buildDecisionExplanation({
    binding: "status_explanation",
    decisionId: LEFT_DECISION_ID,
    workspaceId: WORKSPACE_ID,
  });
  checks.push(
    check(
      "status_explanation",
      "Status explanation binding",
      status.success === true && (status.data?.decisionExplanation.includes("executed") ?? false),
      status.data?.decisionExplanation ?? "null"
    )
  );

  const active = buildDecisionAssistantModel({
    binding: "active_decision_summary",
    workspaceId: WORKSPACE_ID,
  });
  checks.push(
    check(
      "active_decision_summary",
      "Active decision summary binding",
      active.success === true && (active.data?.decisionStateSummaries.length ?? 0) === 1,
      String(active.data?.decisionStateSummaries.length ?? 0)
    )
  );

  const terminal = buildDecisionAssistantModel({
    binding: "terminal_decision_summary",
    workspaceId: WORKSPACE_ID,
  });
  checks.push(
    check(
      "terminal_decision_summary",
      "Terminal decision summary binding",
      terminal.success === true && (terminal.data?.decisionStateSummaries.length ?? 0) === 1,
      String(terminal.data?.decisionStateSummaries.length ?? 0)
    )
  );

  if (single.data) {
    checks.push(
      check(
        "immutable_model",
        "Assistant model is immutable",
        Object.isFrozen(single.data) && Object.isFrozen(single.data.decisionStateSummaries),
        "frozen model"
      )
    );
    checks.push(
      check(
        "assistant_validation",
        "Assistant validation",
        validateDecisionAssistant(
          { binding: "single_decision_explanation", decisionId: LEFT_DECISION_ID },
          single.data
        ).valid === true,
        "valid"
      )
    );
    checks.push(
      check(
        "model_registry",
        "Assistant model registry lookup",
        getDecisionAssistantModel(single.data.modelId)?.modelId === single.data.modelId,
        single.data.modelId
      )
    );
  } else {
    checks.push(check("immutable_model", "Assistant model is immutable", false, "missing model"));
  }

  checks.push(
    check(
      "dashboard_only_consumption",
      "Assistant adapter consumes APP-6:9 dashboard only",
      assistantConsumesDashboardOnly() === true,
      DECISION_DASHBOARD_INTEGRATION_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "no_lower_layer_bypass",
      "Assistant does not bypass dashboard integration",
      assistantAvoidsLowerLayerCalls() === true,
      "adapter-only consumption"
    )
  );

  checks.push(
    check(
      "app6_9_reference",
      "APP-6:9 dashboard contract referenced",
      DECISION_DASHBOARD_INTEGRATION_CONTRACT_VERSION === "APP-6/9",
      DECISION_DASHBOARD_INTEGRATION_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "app6_8_reference",
      "APP-6:8 replay contract referenced in consumption chain",
      DECISION_REPLAY_ENGINE_CONTRACT_VERSION === "APP-6/8",
      DECISION_REPLAY_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "app6_7_reference",
      "APP-6:7 comparison contract referenced in consumption chain",
      DECISION_COMPARISON_ENGINE_CONTRACT_VERSION === "APP-6/7",
      DECISION_COMPARISON_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "app6_6_reference",
      "APP-6:6 query contract referenced in consumption chain",
      DECISION_QUERY_ENGINE_CONTRACT_VERSION === "APP-6/6",
      DECISION_QUERY_ENGINE_CONTRACT_VERSION
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
      "APP-6:4 lifecycle contract referenced",
      DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION === "APP-6/4",
      DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION
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
      validateStageManifest(DECISION_ASSISTANT_INTEGRATION_SELF_MANIFEST).valid === true,
      "manifest valid"
    )
  );

  checks.push(
    check(
      "architecture_boundaries",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/decision-timeline/decisionAssistantEngine.ts",
        allowedFiles: DECISION_ASSISTANT_INTEGRATION_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: DECISION_ASSISTANT_INTEGRATION_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true &&
        evaluateStageFileBoundary({
          filePath: "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
          allowedFiles: DECISION_ASSISTANT_INTEGRATION_SELF_MANIFEST.allowedFiles,
          forbiddenPatterns: DECISION_ASSISTANT_INTEGRATION_SELF_MANIFEST.forbiddenPatterns,
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
      "APP-6:1 through APP-6:9 files intact",
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

export const DecisionAssistantRunner = Object.freeze({
  runDecisionAssistantIntegration,
});
