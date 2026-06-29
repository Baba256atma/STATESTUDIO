/**
 * APP-6:4 — Decision Lifecycle Engine certification runner.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  createDecisionApprovedEvent,
  createDecisionCompletedEvent,
  createDecisionCreatedEvent,
  createDecisionExecutedEvent,
  createDecisionUpdatedEvent,
} from "./decisionEventFactory.ts";
import {
  initializeDecisionEventEngine,
  resetDecisionEventEngineForTests,
} from "./decisionEventEngine.ts";
import type { DecisionEngineEvent } from "./decisionEventTypes.ts";
import { buildDecisionHistory } from "./decisionHistoryBuilder.ts";
import {
  initializeDecisionHistoryEngine,
  resetDecisionHistoryEngineForTests,
} from "./decisionHistoryEngine.ts";
import {
  computeDecisionLifecycle,
  DECISION_LIFECYCLE_ENGINE_SELF_MANIFEST,
  deriveDecisionLifecycle,
  getDecisionLifecycle,
  getDecisionLifecycleContract,
  initializeDecisionLifecycleEngine,
  resetDecisionLifecycleEngineForTests,
  validateDecisionLifecycle,
} from "./decisionLifecycleEngine.ts";
import { buildDecisionLifecycleSnapshot } from "./decisionLifecycleSnapshot.ts";
import {
  validateDecisionLifecycleTransition,
  DECISION_LIFECYCLE_INITIAL_STATE,
} from "./decisionLifecycleRules.ts";
import {
  DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION,
  DECISION_LIFECYCLE_MANDATORY_FIELDS,
  type DecisionLifecycleCertificationCheck,
  type DecisionLifecycleEngineCertificationResult,
} from "./decisionLifecycleTypes.ts";
import {
  validateFoundationCompatibilityForLifecycle,
  validateHistoryCompatibility,
} from "./decisionLifecycleValidation.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "./decisionTimelineContracts.ts";
import { createDecisionTimelineFoundation } from "./decisionTimelineFoundation.ts";
import { resetDecisionTimelinePlatformForTests } from "./decisionTimelineRunner.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");
const DECISION_ID = "decision-lifecycle-cert-001";
const WORKSPACE_ID = "ws-lifecycle-cert-001";

function check(id: string, title: string, passed: boolean, evidence: string): DecisionLifecycleCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readEngineSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function engineHasNoForbiddenRuntime(): boolean {
  const modules = [
    "app/lib/decision-timeline/decisionLifecycleEngine.ts",
    "app/lib/decision-timeline/decisionLifecycleValidation.ts",
    "app/lib/decision-timeline/decisionLifecycleRules.ts",
  ].map((path) => readEngineSource(path));
  return modules.every(
    (source) =>
      !source.includes("localStorage") &&
      !source.includes("indexedDB") &&
      !source.includes("WorkflowEngine") &&
      !source.includes("ReplayEngine")
  );
}

function protectedPlatformFilesPresent(): boolean {
  const protectedFiles = DECISION_LIFECYCLE_ENGINE_SELF_MANIFEST.allowedFiles.filter(
    (file) =>
      file.includes("decisionTimeline") ||
      file.includes("decisionEvent") ||
      file.includes("decisionHistory")
  );
  return protectedFiles.every((file) => existsSync(join(REPO_ROOT, file)));
}

function createLifecycleCertEvents(): DecisionEngineEvent[] {
  const factories = [
    createDecisionCreatedEvent,
    createDecisionUpdatedEvent,
    createDecisionApprovedEvent,
    createDecisionExecutedEvent,
    createDecisionCompletedEvent,
  ] as const;

  const events: DecisionEngineEvent[] = [];
  factories.forEach((factory, index) => {
    const result = factory({
      decisionId: DECISION_ID,
      workspaceId: WORKSPACE_ID,
      eventId: `decision-lifecycle-cert-event-${index + 1}`,
      timestamp: `2026-01-01T00:00:${String(index + 1).padStart(2, "0")}.000Z`,
      createdBy: "lifecycle-certification",
      title: `Lifecycle certification event ${index + 1}`,
      summary: "APP-6:4 certification sample event.",
    });
    if (!result.success || !result.data) {
      throw new Error(result.reason);
    }
    events.push(result.data);
  });
  return events;
}

export function runDecisionLifecycleEngine(): DecisionLifecycleEngineCertificationResult {
  resetDecisionLifecycleEngineForTests();
  resetDecisionHistoryEngineForTests();
  resetDecisionEventEngineForTests();
  resetDecisionTimelinePlatformForTests();
  createDecisionTimelineFoundation(FIXED_TIME);
  initializeDecisionEventEngine(FIXED_TIME);
  initializeDecisionHistoryEngine(FIXED_TIME);
  initializeDecisionLifecycleEngine(FIXED_TIME);

  const checks: DecisionLifecycleCertificationCheck[] = [];
  const events = createLifecycleCertEvents();
  const history = buildDecisionHistory({ events });

  checks.push(
    check(
      "platform_identity",
      "Lifecycle engine contract version is APP-6/4",
      DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION === "APP-6/4",
      DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "foundation_compatibility",
      "APP-6:1 foundation compatibility",
      validateFoundationCompatibilityForLifecycle(FIXED_TIME).valid === true,
      "foundation valid"
    )
  );

  checks.push(
    check(
      "history_compatibility",
      "APP-6:3 history compatibility",
      validateHistoryCompatibility(history).valid === true,
      "history valid"
    )
  );

  const contract = getDecisionLifecycleContract();
  checks.push(
    check(
      "contract_surface",
      "Contract surface exposes mandatory fields",
      contract.mandatoryFields.length === DECISION_LIFECYCLE_MANDATORY_FIELDS.length &&
        contract.supportedLifecycles.length === 9,
      `${contract.mandatoryFields.length} fields`
    )
  );

  const lifecycle = deriveDecisionLifecycle(history);
  checks.push(
    check(
      "lifecycle_derivation",
      "Lifecycle derivation from history",
      lifecycle.currentLifecycle === "completed" && lifecycle.currentStatus === "committed",
      lifecycle.currentLifecycle ?? "null"
    )
  );

  checks.push(
    check(
      "valid_transitions",
      "Valid transition path accepted",
      lifecycle.isValid === true && lifecycle.transitionCount === 5,
      `${lifecycle.transitionCount} transitions`
    )
  );

  checks.push(
    check(
      "previous_lifecycle",
      "Previous lifecycle tracked",
      lifecycle.previousLifecycle === "executed",
      lifecycle.previousLifecycle ?? "null"
    )
  );

  const validation = validateDecisionLifecycle(lifecycle);
  checks.push(
    check(
      "lifecycle_validation",
      "Lifecycle validation",
      validation.valid === true,
      validation.issues.map((entry) => entry.message).join("; ") || "valid"
    )
  );

  const snapshot = buildDecisionLifecycleSnapshot(lifecycle, FIXED_TIME);
  checks.push(
    check(
      "snapshot_creation",
      "Snapshot creation",
      snapshot.readOnly === true && snapshot.currentLifecycle === "completed" && snapshot.isValid === true,
      snapshot.generatedAt
    )
  );

  const computed = computeDecisionLifecycle(history);
  checks.push(
    check(
      "compute_lifecycle",
      "Compute and register lifecycle",
      computed.success === true,
      computed.reason
    )
  );

  checks.push(
    check(
      "get_lifecycle",
      "Retrieve registered lifecycle",
      getDecisionLifecycle(DECISION_ID)?.currentLifecycle === "completed",
      DECISION_ID
    )
  );

  checks.push(
    check(
      "invalid_transition_completed_to_proposed",
      "Invalid transition completed → proposed",
      validateDecisionLifecycleTransition("completed", "proposed").valid === false,
      "rejected"
    )
  );

  checks.push(
    check(
      "invalid_transition_archived_to_approved",
      "Invalid transition archived → approved",
      validateDecisionLifecycleTransition("archived", "approved").valid === false,
      "rejected"
    )
  );

  checks.push(
    check(
      "invalid_transition_cancelled_to_executed",
      "Invalid transition cancelled → executed",
      validateDecisionLifecycleTransition("cancelled", "executed").valid === false,
      "rejected"
    )
  );

  const invalidHistory = buildDecisionHistory({
    events: Object.freeze([
      ...events,
      Object.freeze({
        ...events[0]!,
        eventId: "decision-lifecycle-cert-invalid-reopen",
        sequenceNumber: 6,
        timestamp: "2026-01-02T00:00:00.000Z",
      }),
    ]),
  });
  const invalidLifecycle = deriveDecisionLifecycle(invalidHistory);
  checks.push(
    check(
      "invalid_sequence_detection",
      "Invalid lifecycle sequence detection",
      invalidLifecycle.isValid === false,
      invalidLifecycle.validationMessages[0] ?? "invalid"
    )
  );

  checks.push(
    check(
      "initial_lifecycle_rule",
      "Initial lifecycle must be proposed",
      DECISION_LIFECYCLE_INITIAL_STATE === "proposed",
      DECISION_LIFECYCLE_INITIAL_STATE
    )
  );

  checks.push(
    check(
      "workspace_isolation",
      "Workspace isolation",
      lifecycle.workspaceId === WORKSPACE_ID,
      lifecycle.workspaceId
    )
  );

  checks.push(
    check(
      "immutable_derivation",
      "Lifecycle derivation does not mutate history",
      history.eventCount === 5 && history.readOnly === true,
      "history unchanged"
    )
  );

  checks.push(
    check(
      "stage_manifest",
      "Stage manifest validation",
      validateStageManifest(DECISION_LIFECYCLE_ENGINE_SELF_MANIFEST).valid === true,
      "manifest valid"
    )
  );

  checks.push(
    check(
      "architecture_boundaries",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/decision-timeline/decisionLifecycleEngine.ts",
        allowedFiles: DECISION_LIFECYCLE_ENGINE_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: DECISION_LIFECYCLE_ENGINE_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true &&
        evaluateStageFileBoundary({
          filePath: "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
          allowedFiles: DECISION_LIFECYCLE_ENGINE_SELF_MANIFEST.allowedFiles,
          forbiddenPatterns: DECISION_LIFECYCLE_ENGINE_SELF_MANIFEST.forbiddenPatterns,
        }).allowed === false,
      "boundaries enforced"
    )
  );

  checks.push(
    check(
      "no_forbidden_runtime",
      "No forbidden runtime dependencies",
      engineHasNoForbiddenRuntime() === true,
      "no workflow or persistence runtime"
    )
  );

  checks.push(
    check(
      "protected_platforms_present",
      "APP-6:1 through APP-6:3 files intact",
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

export const DecisionLifecycleRunner = Object.freeze({
  runDecisionLifecycleEngine,
});
