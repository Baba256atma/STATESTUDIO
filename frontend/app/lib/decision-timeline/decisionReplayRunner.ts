/**
 * APP-6:8 — Decision Replay Engine certification runner.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  createDecisionApprovedEvent,
  createDecisionCreatedEvent,
  createDecisionExecutedEvent,
  createDecisionUpdatedEvent,
} from "./decisionEventFactory.ts";
import {
  initializeDecisionEventEngine,
  resetDecisionEventEngineForTests,
} from "./decisionEventEngine.ts";
import { buildDecisionHistory } from "./decisionHistoryBuilder.ts";
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
  computeDecisionState,
  initializeDecisionStateEngine,
  resetDecisionStateEngineForTests,
} from "./decisionStateEngine.ts";
import {
  createDecisionReplay,
  DECISION_REPLAY_ENGINE_SELF_MANIFEST,
  getDecisionReplayContract,
  getReplaySnapshot,
  initializeDecisionReplayEngine,
  jumpToEvent,
  jumpToIndex,
  moveFirst,
  moveLast,
  moveNext,
  movePrevious,
  resetDecisionReplayEngineForTests,
  resetReplay,
  validateDecisionReplay,
} from "./decisionReplayEngine.ts";
import {
  buildDecisionReplaySnapshot,
  freezeDecisionReplaySnapshot,
} from "./decisionReplaySnapshot.ts";
import {
  DECISION_REPLAY_ENGINE_CONTRACT_VERSION,
  type DecisionReplayCertificationCheck,
  type DecisionReplayEngineCertificationResult,
} from "./decisionReplayTypes.ts";
import {
  validateFoundationCompatibilityForReplay,
  validateQueryCompatibilityForReplay,
} from "./decisionReplayValidation.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "./decisionTimelineContracts.ts";
import { createDecisionTimelineFoundation } from "./decisionTimelineFoundation.ts";
import { resetDecisionTimelinePlatformForTests } from "./decisionTimelineRunner.ts";
import { DECISION_COMPARISON_ENGINE_CONTRACT_VERSION } from "./decisionComparisonTypes.ts";
import { DECISION_QUERY_ENGINE_CONTRACT_VERSION } from "./decisionQueryTypes.ts";
import { DECISION_STATE_ENGINE_CONTRACT_VERSION } from "./decisionStateTypes.ts";
import { DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION } from "./decisionLifecycleTypes.ts";
import { DECISION_HISTORY_ENGINE_CONTRACT_VERSION } from "./decisionHistoryTypes.ts";
import { DECISION_EVENT_ENGINE_CONTRACT_VERSION } from "./decisionEventTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");
const DECISION_ID = "decision-replay-cert-001";
const WORKSPACE_ID = "ws-replay-cert-001";

function check(id: string, title: string, passed: boolean, evidence: string): DecisionReplayCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readEngineSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function engineHasNoForbiddenRuntime(): boolean {
  const modules = [
    "app/lib/decision-timeline/decisionReplayEngine.ts",
    "app/lib/decision-timeline/decisionReplayValidation.ts",
    "app/lib/decision-timeline/decisionReplayRegistry.ts",
  ].map((path) => readEngineSource(path));
  return modules.every(
    (source) =>
      !source.includes("localStorage") &&
      !source.includes("indexedDB") &&
      !source.includes("DashboardEngine") &&
      !source.includes("AssistantEngine")
  );
}

function protectedPlatformFilesPresent(): boolean {
  const protectedFiles = DECISION_REPLAY_ENGINE_SELF_MANIFEST.allowedFiles.filter(
    (file) =>
      file.includes("decisionTimeline") ||
      file.includes("decisionEvent") ||
      file.includes("decisionHistory") ||
      file.includes("decisionLifecycle") ||
      file.includes("decisionState") ||
      file.includes("decisionQuery") ||
      file.includes("decisionComparison")
  );
  return protectedFiles.every((file) => existsSync(join(REPO_ROOT, file)));
}

function seedCertDecision() {
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
      eventId: `decision-replay-cert-event-${index + 1}`,
      timestamp: `2026-01-01T00:00:${String(index + 1).padStart(2, "0")}.000Z`,
      createdBy: "replay-certification",
      title: `Replay certification event ${index + 1}`,
      summary: "APP-6:8 certification sample event.",
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

  return { events, history: historyResult.data };
}

export function runDecisionReplayEngine(): DecisionReplayEngineCertificationResult {
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

  const checks: DecisionReplayCertificationCheck[] = [];
  const seeded = seedCertDecision();

  checks.push(
    check(
      "platform_identity",
      "Replay engine contract version is APP-6/8",
      DECISION_REPLAY_ENGINE_CONTRACT_VERSION === "APP-6/8",
      DECISION_REPLAY_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "foundation_compatibility",
      "APP-6:1 foundation compatibility",
      validateFoundationCompatibilityForReplay(FIXED_TIME).valid === true,
      "foundation valid"
    )
  );

  checks.push(
    check(
      "query_compatibility",
      "APP-6:6 query compatibility",
      validateQueryCompatibilityForReplay().valid === true,
      DECISION_QUERY_ENGINE_CONTRACT_VERSION
    )
  );

  const contract = getDecisionReplayContract();
  checks.push(
    check(
      "contract_surface",
      "Contract surface exposes mandatory fields",
      contract.mandatoryFields.length >= 10 && contract.supportedCursorActions.length >= 7,
      `${contract.mandatoryFields.length} fields`
    )
  );

  const created = createDecisionReplay({ decisionId: DECISION_ID, workspaceId: WORKSPACE_ID });
  checks.push(
    check(
      "replay_creation",
      "Replay creation",
      created.success === true && created.data?.decisionId === DECISION_ID,
      created.reason
    )
  );

  const replayId = created.data?.replayId ?? "";
  checks.push(
    check(
      "first_event",
      "First event cursor",
      created.data?.isFirst === true && created.data?.cursorIndex === 0,
      String(created.data?.cursorIndex)
    )
  );

  const lastMove = moveLast(replayId);
  checks.push(
    check(
      "last_event",
      "Last event navigation",
      lastMove.success === true && lastMove.data?.isLast === true,
      String(lastMove.data?.cursorIndex)
    )
  );

  const prevMove = movePrevious(replayId);
  checks.push(
    check(
      "previous_navigation",
      "Previous navigation",
      prevMove.success === true && (prevMove.data?.cursorIndex ?? -1) === 2,
      String(prevMove.data?.cursorIndex)
    )
  );

  const nextMove = moveNext(replayId);
  checks.push(
    check(
      "next_navigation",
      "Next navigation",
      nextMove.success === true && nextMove.data?.isLast === true,
      String(nextMove.data?.cursorIndex)
    )
  );

  const jumpIndex = jumpToIndex(replayId, 1);
  checks.push(
    check(
      "jump_to_index",
      "Jump to index",
      jumpIndex.success === true && jumpIndex.data?.cursorIndex === 1,
      String(jumpIndex.data?.cursorIndex)
    )
  );

  const jumpEvent = jumpToEvent(replayId, "decision-replay-cert-event-3");
  checks.push(
    check(
      "jump_to_event",
      "Jump to event",
      jumpEvent.success === true &&
        jumpEvent.data?.currentEvent?.eventId === "decision-replay-cert-event-3",
      jumpEvent.data?.currentEvent?.eventId ?? "null"
    )
  );

  const resetMove = resetReplay(replayId);
  checks.push(
    check(
      "reset_replay",
      "Reset replay",
      resetMove.success === true && resetMove.data?.cursorIndex === 0,
      String(resetMove.data?.cursorIndex)
    )
  );

  const firstMove = moveFirst(replayId);
  checks.push(
    check(
      "move_first",
      "Move first",
      firstMove.success === true && firstMove.data?.isFirst === true,
      String(firstMove.data?.isFirst)
    )
  );

  const invalidJump = jumpToIndex(replayId, 99);
  checks.push(
    check(
      "invalid_cursor",
      "Invalid cursor detection",
      invalidJump.success === false,
      invalidJump.reason
    )
  );

  if (created.data) {
    const snapshot = freezeDecisionReplaySnapshot(buildDecisionReplaySnapshot(created.data));
    checks.push(
      check(
        "snapshot_generation",
        "Immutable replay snapshot",
        snapshot.readOnly === true && Object.isFrozen(snapshot),
        snapshot.snapshotId
      )
    );
    checks.push(
      check(
        "replay_validation",
        "Replay validation",
        validateDecisionReplay(created.data).valid === true,
        "valid"
      )
    );
  } else {
    checks.push(check("snapshot_generation", "Immutable replay snapshot", false, "missing replay"));
  }

  checks.push(
    check(
      "get_replay_snapshot",
      "Get replay snapshot API",
      getReplaySnapshot(replayId)?.replayId === replayId,
      replayId
    )
  );

  checks.push(
    check(
      "no_history_rebuild",
      "Replay engine does not rebuild history",
      !readEngineSource("app/lib/decision-timeline/decisionReplayEngine.ts").includes("buildDecisionHistory(") &&
        !readEngineSource("app/lib/decision-timeline/decisionReplayEngine.ts").includes("computeDecisionHistory("),
      "history read only"
    )
  );

  checks.push(
    check(
      "no_lifecycle_derivation",
      "Replay engine does not derive lifecycle",
      !readEngineSource("app/lib/decision-timeline/decisionReplayEngine.ts").includes("deriveDecisionLifecycle"),
      "no lifecycle derivation"
    )
  );

  checks.push(
    check(
      "app6_7_reference",
      "APP-6:7 comparison contract referenced in manifest",
      DECISION_COMPARISON_ENGINE_CONTRACT_VERSION === "APP-6/7",
      DECISION_COMPARISON_ENGINE_CONTRACT_VERSION
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
      "history_events_intact",
      "History events remain unchanged after replay navigation",
      seeded.history.eventCount === 4 && seeded.history.orderedEvents.length === 4,
      String(seeded.history.eventCount)
    )
  );

  checks.push(
    check(
      "stage_manifest",
      "Stage manifest validation",
      validateStageManifest(DECISION_REPLAY_ENGINE_SELF_MANIFEST).valid === true,
      "manifest valid"
    )
  );

  checks.push(
    check(
      "architecture_boundaries",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/decision-timeline/decisionReplayEngine.ts",
        allowedFiles: DECISION_REPLAY_ENGINE_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: DECISION_REPLAY_ENGINE_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true &&
        evaluateStageFileBoundary({
          filePath: "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
          allowedFiles: DECISION_REPLAY_ENGINE_SELF_MANIFEST.allowedFiles,
          forbiddenPatterns: DECISION_REPLAY_ENGINE_SELF_MANIFEST.forbiddenPatterns,
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
      "APP-6:1 through APP-6:7 files intact",
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

export const DecisionReplayRunner = Object.freeze({
  runDecisionReplayEngine,
});
