/**
 * APP-6:7 — Decision Comparison Engine certification runner.
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
  compareDecisions,
  compareDecisionStates,
  compareMultipleDecisionStates,
  DECISION_COMPARISON_ENGINE_SELF_MANIFEST,
  getDecisionComparisonContract,
  initializeDecisionComparisonEngine,
  resetDecisionComparisonEngineForTests,
  validateDecisionComparison,
} from "./decisionComparisonEngine.ts";
import { buildDecisionComparisonSnapshot } from "./decisionComparisonSnapshot.ts";
import {
  DECISION_COMPARISON_ENGINE_CONTRACT_VERSION,
  type DecisionComparisonCertificationCheck,
  type DecisionComparisonEngineCertificationResult,
} from "./decisionComparisonTypes.ts";
import {
  validateFoundationCompatibilityForComparison,
  validateQueryCompatibilityForComparison,
} from "./decisionComparisonValidation.ts";
import {
  getDecisionById,
  initializeDecisionQueryEngine,
  resetDecisionQueryEngineForTests,
} from "./decisionQueryEngine.ts";
import { resetDecisionQueryRegistryForTests } from "./decisionQueryRegistry.ts";
import {
  computeDecisionState,
  initializeDecisionStateEngine,
  resetDecisionStateEngineForTests,
} from "./decisionStateEngine.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "./decisionTimelineContracts.ts";
import { createDecisionTimelineFoundation } from "./decisionTimelineFoundation.ts";
import { resetDecisionTimelinePlatformForTests } from "./decisionTimelineRunner.ts";
import { DECISION_QUERY_ENGINE_CONTRACT_VERSION } from "./decisionQueryTypes.ts";
import { DECISION_STATE_ENGINE_CONTRACT_VERSION } from "./decisionStateTypes.ts";
import { DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION } from "./decisionLifecycleTypes.ts";
import { DECISION_HISTORY_ENGINE_CONTRACT_VERSION } from "./decisionHistoryTypes.ts";
import { DECISION_EVENT_ENGINE_CONTRACT_VERSION } from "./decisionEventTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");
const LEFT_DECISION_ID = "decision-comparison-cert-left";
const RIGHT_DECISION_ID = "decision-comparison-cert-right";
const WORKSPACE_ID = "ws-comparison-cert-001";

function check(id: string, title: string, passed: boolean, evidence: string): DecisionComparisonCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readEngineSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function engineHasNoForbiddenRuntime(): boolean {
  const modules = [
    "app/lib/decision-timeline/decisionComparisonEngine.ts",
    "app/lib/decision-timeline/decisionComparisonValidation.ts",
    "app/lib/decision-timeline/decisionComparisonRegistry.ts",
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
  const protectedFiles = DECISION_COMPARISON_ENGINE_SELF_MANIFEST.allowedFiles.filter(
    (file) =>
      file.includes("decisionTimeline") ||
      file.includes("decisionEvent") ||
      file.includes("decisionHistory") ||
      file.includes("decisionLifecycle") ||
      file.includes("decisionState") ||
      file.includes("decisionQuery")
  );
  return protectedFiles.every((file) => existsSync(join(REPO_ROOT, file)));
}

function seedDecision(
  decisionId: string,
  eventFactories: readonly [
    typeof createDecisionCreatedEvent,
    typeof createDecisionUpdatedEvent,
    ...(typeof createDecisionApprovedEvent | typeof createDecisionRejectedEvent)[]
  ]
) {
  const events = eventFactories.map((factory, index) => {
    const result = factory({
      decisionId,
      workspaceId: WORKSPACE_ID,
      eventId: `${decisionId}-event-${index + 1}`,
      timestamp: `2026-01-01T00:00:${String(index + 1).padStart(2, "0")}.000Z`,
      createdBy: "comparison-certification",
      title: `Comparison certification event ${index + 1}`,
      summary: "APP-6:7 certification sample event.",
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

export function runDecisionComparisonEngine(): DecisionComparisonEngineCertificationResult {
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

  const checks: DecisionComparisonCertificationCheck[] = [];

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
      "Comparison engine contract version is APP-6/7",
      DECISION_COMPARISON_ENGINE_CONTRACT_VERSION === "APP-6/7",
      DECISION_COMPARISON_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "foundation_compatibility",
      "APP-6:1 foundation compatibility",
      validateFoundationCompatibilityForComparison(FIXED_TIME).valid === true,
      "foundation valid"
    )
  );

  checks.push(
    check(
      "query_compatibility",
      "APP-6:6 query compatibility",
      validateQueryCompatibilityForComparison().valid === true,
      DECISION_QUERY_ENGINE_CONTRACT_VERSION
    )
  );

  const contract = getDecisionComparisonContract();
  checks.push(
    check(
      "contract_surface",
      "Contract surface exposes mandatory fields",
      contract.mandatoryFields.length >= 10 && contract.futureConsumers.length >= 4,
      `${contract.mandatoryFields.length} fields`
    )
  );

  const comparison = compareDecisions({
    leftDecisionId: LEFT_DECISION_ID,
    rightDecisionId: RIGHT_DECISION_ID,
  });
  checks.push(
    check(
      "decision_vs_decision",
      "Decision vs Decision comparison",
      comparison.success === true &&
        comparison.data?.leftDecisionId === LEFT_DECISION_ID &&
        comparison.data?.rightDecisionId === RIGHT_DECISION_ID,
      comparison.reason
    )
  );

  checks.push(
    check(
      "lifecycle_diff",
      "Lifecycle difference detection",
      comparison.data?.lifecycleDiff.changed === true &&
        comparison.data?.lifecycleDiff.left === "executed" &&
        comparison.data?.lifecycleDiff.right === "rejected",
      String(comparison.data?.lifecycleDiff.changed)
    )
  );

  checks.push(
    check(
      "status_diff",
      "Status difference detection",
      comparison.data?.statusDiff.changed === true,
      `${comparison.data?.statusDiff.left}->${comparison.data?.statusDiff.right}`
    )
  );

  checks.push(
    check(
      "version_diff",
      "Version diff field populated",
      comparison.data?.versionDiff.left === comparison.data?.versionDiff.right &&
        comparison.data?.versionDiff.left.includes("APP-6/3"),
      comparison.data?.versionDiff.left ?? "null"
    )
  );

  checks.push(
    check(
      "terminal_diff",
      "Terminal difference detection",
      comparison.data?.terminalDiff.changed === true &&
        comparison.data?.terminalDiff.left === false &&
        comparison.data?.terminalDiff.right === true,
      String(comparison.data?.terminalDiff.changed)
    )
  );

  checks.push(
    check(
      "immutable_output",
      "Comparison output is immutable",
      comparison.data !== null &&
        Object.isFrozen(comparison.data) &&
        Object.isFrozen(comparison.data.validationMessages),
      "frozen comparison"
    )
  );

  if (comparison.data) {
    const snapshot = buildDecisionComparisonSnapshot(comparison.data);
    checks.push(
      check(
        "snapshot_generation",
        "Snapshot generation",
        snapshot.readOnly === true && Object.isFrozen(snapshot.validationMessages),
        snapshot.snapshotId
      )
    );
  } else {
    checks.push(check("snapshot_generation", "Snapshot generation", false, "missing comparison"));
  }

  const left = getDecisionById(LEFT_DECISION_ID);
  const right = getDecisionById(RIGHT_DECISION_ID);
  const directComparison = left && right ? compareDecisionStates(left, right, FIXED_TIME) : null;
  checks.push(
    check(
      "compare_states",
      "Direct DecisionState comparison",
      directComparison?.success === true,
      directComparison?.reason ?? "missing states"
    )
  );

  const multi =
    left && right ? compareMultipleDecisionStates(Object.freeze([left, right]), FIXED_TIME) : null;
  checks.push(
    check(
      "multi_comparison",
      "Multiple DecisionState comparison",
      multi?.success === true && (multi.data?.pairwiseComparisons.length ?? 0) === 1,
      String(multi?.data?.pairwiseComparisons.length ?? 0)
    )
  );

  const validation = validateDecisionComparison({
    leftDecisionId: LEFT_DECISION_ID,
    rightDecisionId: RIGHT_DECISION_ID,
  });
  checks.push(
    check(
      "comparison_validation",
      "Comparison validation",
      validation.valid === true,
      validation.issues.map((entry) => entry.message).join("; ") || "valid"
    )
  );

  const sameDecision = compareDecisions({
    leftDecisionId: LEFT_DECISION_ID,
    rightDecisionId: LEFT_DECISION_ID,
  });
  checks.push(
    check(
      "same_decision_rejected",
      "Same-decision comparison rejected",
      sameDecision.success === false,
      sameDecision.reason
    )
  );

  checks.push(
    check(
      "no_direct_state_engine",
      "Comparison engine does not import state derivation",
      !readEngineSource("app/lib/decision-timeline/decisionComparisonEngine.ts").includes("deriveDecisionState") &&
        !readEngineSource("app/lib/decision-timeline/decisionComparisonEngine.ts").includes("computeDecisionState"),
      "query-only reads"
    )
  );

  checks.push(
    check(
      "no_lifecycle_access",
      "Comparison engine does not derive lifecycle",
      !readEngineSource("app/lib/decision-timeline/decisionComparisonEngine.ts").includes("deriveDecisionLifecycle") &&
        !readEngineSource("app/lib/decision-timeline/decisionComparisonEngine.ts").includes("buildDecisionHistory"),
      "no lower-layer access"
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
      "app6_6_reference",
      "APP-6:6 query contract referenced",
      DECISION_QUERY_ENGINE_CONTRACT_VERSION === "APP-6/6",
      DECISION_QUERY_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "app6_4_reference",
      "APP-6:4 lifecycle contract referenced in validation",
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
      validateStageManifest(DECISION_COMPARISON_ENGINE_SELF_MANIFEST).valid === true,
      "manifest valid"
    )
  );

  checks.push(
    check(
      "architecture_boundaries",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/decision-timeline/decisionComparisonEngine.ts",
        allowedFiles: DECISION_COMPARISON_ENGINE_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: DECISION_COMPARISON_ENGINE_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true &&
        evaluateStageFileBoundary({
          filePath: "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
          allowedFiles: DECISION_COMPARISON_ENGINE_SELF_MANIFEST.allowedFiles,
          forbiddenPatterns: DECISION_COMPARISON_ENGINE_SELF_MANIFEST.forbiddenPatterns,
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
      "APP-6:1 through APP-6:6 files intact",
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

export const DecisionComparisonRunner = Object.freeze({
  runDecisionComparisonEngine,
});
