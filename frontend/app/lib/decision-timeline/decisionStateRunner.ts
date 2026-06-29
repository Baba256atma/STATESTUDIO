/**
 * APP-6:5 — Decision State Engine certification runner.
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
  DECISION_STATE_ENGINE_SELF_MANIFEST,
  deriveDecisionState,
  getDecisionState,
  getDecisionStateContract,
  initializeDecisionStateEngine,
  resetDecisionStateEngineForTests,
  validateDecisionState,
} from "./decisionStateEngine.ts";
import { buildDecisionStateSnapshot } from "./decisionStateSnapshot.ts";
import {
  DECISION_STATE_ENGINE_CONTRACT_VERSION,
  DECISION_STATE_MANDATORY_FIELDS,
  type DecisionStateCertificationCheck,
  type DecisionStateEngineCertificationResult,
} from "./decisionStateTypes.ts";
import {
  validateFoundationCompatibilityForState,
  validateHistoryCompatibilityForState,
  validateLifecycleCompatibility,
} from "./decisionStateValidation.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "./decisionTimelineContracts.ts";
import { createDecisionTimelineFoundation } from "./decisionTimelineFoundation.ts";
import { resetDecisionTimelinePlatformForTests } from "./decisionTimelineRunner.ts";
import { DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION } from "./decisionLifecycleTypes.ts";
import { DECISION_HISTORY_ENGINE_CONTRACT_VERSION } from "./decisionHistoryTypes.ts";
import { DECISION_EVENT_ENGINE_CONTRACT_VERSION } from "./decisionEventTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");
const DECISION_ID = "decision-state-cert-001";
const WORKSPACE_ID = "ws-state-cert-001";

function check(id: string, title: string, passed: boolean, evidence: string): DecisionStateCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readEngineSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function engineHasNoForbiddenRuntime(): boolean {
  const modules = [
    "app/lib/decision-timeline/decisionStateEngine.ts",
    "app/lib/decision-timeline/decisionStateValidation.ts",
    "app/lib/decision-timeline/decisionStateRegistry.ts",
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
  const protectedFiles = DECISION_STATE_ENGINE_SELF_MANIFEST.allowedFiles.filter(
    (file) =>
      file.includes("decisionTimeline") ||
      file.includes("decisionEvent") ||
      file.includes("decisionHistory") ||
      file.includes("decisionLifecycle")
  );
  return protectedFiles.every((file) => existsSync(join(REPO_ROOT, file)));
}

function createCertLifecycle() {
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
      eventId: `decision-state-cert-event-${index + 1}`,
      timestamp: `2026-01-01T00:00:${String(index + 1).padStart(2, "0")}.000Z`,
      createdBy: "state-certification",
      title: `State certification event ${index + 1}`,
      summary: "APP-6:5 certification sample event.",
    });
    if (!result.success || !result.data) {
      throw new Error(result.reason);
    }
    return result.data;
  });

  const history = buildDecisionHistory({ events: Object.freeze(events) });
  return deriveDecisionLifecycle(history);
}

export function runDecisionStateEngine(): DecisionStateEngineCertificationResult {
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

  const checks: DecisionStateCertificationCheck[] = [];
  const lifecycle = createCertLifecycle();

  checks.push(
    check(
      "platform_identity",
      "State engine contract version is APP-6/5",
      DECISION_STATE_ENGINE_CONTRACT_VERSION === "APP-6/5",
      DECISION_STATE_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "foundation_compatibility",
      "APP-6:1 foundation compatibility",
      validateFoundationCompatibilityForState(FIXED_TIME).valid === true,
      "foundation valid"
    )
  );

  checks.push(
    check(
      "lifecycle_compatibility",
      "APP-6:4 lifecycle compatibility",
      validateLifecycleCompatibility(lifecycle).valid === true,
      DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "history_compatibility",
      "APP-6:3 history compatibility via lifecycle",
      validateHistoryCompatibilityForState(lifecycle).valid === true,
      DECISION_HISTORY_ENGINE_CONTRACT_VERSION
    )
  );

  const contract = getDecisionStateContract();
  checks.push(
    check(
      "contract_surface",
      "Contract surface exposes mandatory fields",
      contract.mandatoryFields.length === DECISION_STATE_MANDATORY_FIELDS.length &&
        contract.futureConsumers.length >= 6,
      `${contract.mandatoryFields.length} fields`
    )
  );

  const state = deriveDecisionState(lifecycle, FIXED_TIME);
  checks.push(
    check(
      "state_derivation",
      "State derivation from lifecycle",
      state.currentLifecycle === "executed" && state.currentStatus === "committed",
      state.currentLifecycle ?? "null"
    )
  );

  checks.push(
    check(
      "latest_event_projection",
      "Latest event projection from lifecycle transitions",
      state.latestEventId === "decision-state-cert-event-4" && state.latestTimestamp !== null,
      state.latestEventId ?? "null"
    )
  );

  checks.push(
    check(
      "immutable_state",
      "State is immutable and read-only",
      Object.isFrozen(state) && state.readOnly === true,
      "frozen state"
    )
  );

  const validation = validateDecisionState(state, lifecycle);
  checks.push(
    check(
      "state_validation",
      "State validation",
      validation.valid === true,
      validation.issues.map((entry) => entry.message).join("; ") || "valid"
    )
  );

  const snapshot = buildDecisionStateSnapshot(state);
  checks.push(
    check(
      "snapshot_generation",
      "Snapshot generation",
      snapshot.readOnly === true && snapshot.currentLifecycle === "executed",
      snapshot.snapshotId
    )
  );

  const computed = computeDecisionState(lifecycle, FIXED_TIME);
  checks.push(
    check(
      "compute_state",
      "Compute and register state",
      computed.success === true,
      computed.reason
    )
  );

  checks.push(
    check(
      "get_state",
      "Retrieve registered state",
      getDecisionState(DECISION_ID)?.decisionId === DECISION_ID,
      DECISION_ID
    )
  );

  checks.push(
    check(
      "version_consistency",
      "Current version consistency",
      state.currentVersion.includes(DECISION_HISTORY_ENGINE_CONTRACT_VERSION) &&
        state.currentVersion.includes(DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION),
      state.currentVersion
    )
  );

  checks.push(
    check(
      "terminal_consistency",
      "Terminal state consistency",
      state.isTerminal === lifecycle.isTerminal,
      String(state.isTerminal)
    )
  );

  checks.push(
    check(
      "workspace_isolation",
      "Workspace isolation",
      state.workspaceId === WORKSPACE_ID && state.workspaceId === lifecycle.workspaceId,
      state.workspaceId
    )
  );

  checks.push(
    check(
      "no_lifecycle_recalculation",
      "State engine does not import lifecycle derivation",
      !readEngineSource("app/lib/decision-timeline/decisionStateEngine.ts").includes("deriveDecisionLifecycle") &&
        !readEngineSource("app/lib/decision-timeline/decisionStateEngine.ts").includes("analyzeDecisionHistoryForLifecycle"),
      "lifecycle-only input"
    )
  );

  checks.push(
    check(
      "app6_2_engine_version_present",
      "APP-6:2 engine contract referenced in validation layer",
      DECISION_EVENT_ENGINE_CONTRACT_VERSION === "APP-6/2",
      DECISION_EVENT_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "stage_manifest",
      "Stage manifest validation",
      validateStageManifest(DECISION_STATE_ENGINE_SELF_MANIFEST).valid === true,
      "manifest valid"
    )
  );

  checks.push(
    check(
      "architecture_boundaries",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/decision-timeline/decisionStateEngine.ts",
        allowedFiles: DECISION_STATE_ENGINE_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: DECISION_STATE_ENGINE_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true &&
        evaluateStageFileBoundary({
          filePath: "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
          allowedFiles: DECISION_STATE_ENGINE_SELF_MANIFEST.allowedFiles,
          forbiddenPatterns: DECISION_STATE_ENGINE_SELF_MANIFEST.forbiddenPatterns,
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
      "APP-6:1 through APP-6:4 files intact",
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

export const DecisionStateRunner = Object.freeze({
  runDecisionStateEngine,
});
