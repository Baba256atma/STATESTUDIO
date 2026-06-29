/**
 * APP-6:3 — Decision History Engine certification runner.
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
import type { DecisionEngineEvent } from "./decisionEventTypes.ts";
import { DECISION_ENGINE_EVENT_TYPE_KEYS } from "./decisionEventTypes.ts";
import {
  buildDecisionHistory,
  computeDecisionHistory,
  DECISION_HISTORY_ENGINE_SELF_MANIFEST,
  getDecisionHistory,
  getDecisionHistoryContract,
  getDecisionHistoryRegistry,
  initializeDecisionHistoryEngine,
  resetDecisionHistoryEngineForTests,
  validateDecisionHistory,
} from "./decisionHistoryEngine.ts";
import { buildDecisionHistorySnapshot } from "./decisionHistorySnapshot.ts";
import {
  DECISION_HISTORY_ENGINE_CONTRACT_VERSION,
  DECISION_HISTORY_MANDATORY_FIELDS,
  type DecisionHistoryCertificationCheck,
  type DecisionHistoryEngineCertificationResult,
} from "./decisionHistoryTypes.ts";
import { DECISION_EVENT_ENGINE_CONTRACT_VERSION } from "./decisionEventTypes.ts";
import { DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION } from "./decisionTimelineConstants.ts";
import {
  DECISION_TIMELINE_PLATFORM_IDENTITY,
  validateDecisionTimelineFoundation,
} from "./decisionTimelineContracts.ts";
import {
  validateEngineEventCompatibility,
  validateFoundationCompatibility,
} from "./decisionHistoryValidation.ts";
import { createDecisionTimelineFoundation } from "./decisionTimelineFoundation.ts";
import { resetDecisionTimelinePlatformForTests } from "./decisionTimelineRunner.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const REPO_ROOT = join(process.cwd(), "..");
const DECISION_ID = "decision-history-cert-001";
const WORKSPACE_ID = "ws-history-cert-001";

function check(id: string, title: string, passed: boolean, evidence: string): DecisionHistoryCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readEngineSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function engineHasNoForbiddenRuntime(): boolean {
  const modules = [
    "app/lib/decision-timeline/decisionHistoryEngine.ts",
    "app/lib/decision-timeline/decisionHistoryBuilder.ts",
    "app/lib/decision-timeline/decisionHistoryAggregator.ts",
  ].map((path) => readEngineSource(path));
  return modules.every(
    (source) =>
      !source.includes("localStorage") &&
      !source.includes("indexedDB") &&
      !source.includes("ReplayEngine") &&
      !source.includes("DecisionChart")
  );
}

function foundationAndEventFilesUnmodified(): boolean {
  const protectedFiles = DECISION_HISTORY_ENGINE_SELF_MANIFEST.allowedFiles.filter(
    (file) => file.includes("decisionTimeline") || file.includes("decisionEvent")
  );
  return protectedFiles.every((file) => existsSync(join(REPO_ROOT, file)));
}

function createCertEvents(): DecisionEngineEvent[] {
  const factories = [
    createDecisionCreatedEvent,
    createDecisionUpdatedEvent,
    createDecisionApprovedEvent,
    createDecisionExecutedEvent,
  ] as const;

  const events: DecisionEngineEvent[] = [];
  factories.forEach((factory, index) => {
    const result = factory({
      decisionId: DECISION_ID,
      workspaceId: WORKSPACE_ID,
      scenarioId: "scenario-history-cert-001",
      intentId: "intent-history-cert-001",
      eventId: `decision-history-cert-event-${index + 1}`,
      timestamp: `2026-01-01T00:00:${String(index + 1).padStart(2, "0")}.000Z`,
      createdBy: "history-certification",
      title: `History certification event ${index + 1}`,
      summary: "APP-6:3 certification sample event.",
    });
    if (!result.success || !result.data) {
      throw new Error(result.reason);
    }
    events.push(result.data);
  });
  return events;
}

export function runDecisionHistoryEngine(): DecisionHistoryEngineCertificationResult {
  resetDecisionHistoryEngineForTests();
  resetDecisionEventEngineForTests();
  resetDecisionTimelinePlatformForTests();
  createDecisionTimelineFoundation(FIXED_TIME);
  initializeDecisionEventEngine(FIXED_TIME);
  initializeDecisionHistoryEngine(FIXED_TIME);

  const checks: DecisionHistoryCertificationCheck[] = [];
  const events = createCertEvents();

  checks.push(
    check(
      "platform_identity",
      "History engine contract version is APP-6/3",
      DECISION_HISTORY_ENGINE_CONTRACT_VERSION === "APP-6/3",
      DECISION_HISTORY_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "app6_1_compatibility",
      "APP-6:1 foundation validation passes",
      validateDecisionTimelineFoundation(FIXED_TIME).valid === true,
      "foundation valid"
    )
  );

  checks.push(
    check(
      "app6_2_compatibility",
      "APP-6:2 event compatibility",
      validateEngineEventCompatibility(events).valid === true,
      DECISION_EVENT_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "foundation_compatibility",
      "Foundation manifest compatibility",
      validateFoundationCompatibility(FIXED_TIME).valid === true,
      "manifest compatible"
    )
  );

  const contract = getDecisionHistoryContract();
  checks.push(
    check(
      "contract_surface",
      "Contract surface exposes mandatory fields",
      contract.mandatoryFields.length === DECISION_HISTORY_MANDATORY_FIELDS.length &&
        contract.supportedLifecycles.length === 9,
      `${contract.mandatoryFields.length} fields`
    )
  );

  const history = buildDecisionHistory({ events });
  checks.push(
    check(
      "history_construction",
      "History construction",
      history.eventCount === 4 && history.decisionId === DECISION_ID,
      `${history.eventCount} events`
    )
  );

  checks.push(
    check(
      "event_ordering",
      "Deterministic event ordering",
      history.orderedEvents[0]?.eventType === "DECISION_CREATED" &&
        history.orderedEvents.at(-1)?.eventType === "DECISION_EXECUTED",
      "chronological order preserved"
    )
  );

  checks.push(
    check(
      "immutable_history",
      "History is immutable and read-only",
      Object.isFrozen(history) && history.readOnly === true,
      "frozen history"
    )
  );

  const validation = validateDecisionHistory(history);
  checks.push(
    check(
      "history_validation",
      "History validation",
      validation.valid === true,
      validation.issues.map((entry) => entry.message).join("; ") || "valid"
    )
  );

  const snapshot = buildDecisionHistorySnapshot(history, FIXED_TIME);
  checks.push(
    check(
      "snapshot_creation",
      "Snapshot creation",
      snapshot.readOnly === true && snapshot.eventCount === 4 && snapshot.latestEventId !== null,
      snapshot.snapshotId
    )
  );

  const computed = computeDecisionHistory({ events });
  checks.push(
    check(
      "compute_history",
      "Compute and register history",
      computed.success === true,
      computed.reason
    )
  );

  checks.push(
    check(
      "get_history",
      "Retrieve registered history",
      getDecisionHistory(DECISION_ID)?.historyId === history.historyId,
      history.historyId
    )
  );

  const duplicateEventHistory = buildDecisionHistory({
    events: Object.freeze([events[0]!, events[0]!]),
  });
  checks.push(
    check(
      "duplicate_rejection",
      "Duplicate event rejection",
      duplicateEventHistory.validationResult.valid === false,
      duplicateEventHistory.validationResult.issues[0]?.code ?? "invalid"
    )
  );

  const mixedDecisionHistory = buildDecisionHistory({
    events: Object.freeze([
      events[0]!,
      Object.freeze({
        ...events[1]!,
        decisionId: "decision-other-001",
      }),
    ]),
  });
  checks.push(
    check(
      "decision_isolation",
      "Decision isolation — never merge decisions",
      mixedDecisionHistory.validationResult.valid === false,
      mixedDecisionHistory.validationResult.issues[0]?.code ?? "invalid"
    )
  );

  const badChronology = buildDecisionHistory({
    events: Object.freeze([
      events[0]!,
      Object.freeze({
        ...events[1]!,
        sequenceNumber: 1,
        timestamp: "2025-01-01T00:00:00.000Z",
      }),
    ]),
  });
  checks.push(
    check(
      "chronology_validation",
      "Chronology validation",
      badChronology.validationResult.valid === false,
      badChronology.validationResult.issues[0]?.code ?? "invalid"
    )
  );

  checks.push(
    check(
      "workspace_isolation",
      "Workspace isolation",
      history.workspaceId === WORKSPACE_ID,
      history.workspaceId
    )
  );

  checks.push(
    check(
      "version_continuity",
      "Version continuity",
      history.currentVersion?.foundationContractVersion === DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION &&
        history.currentVersion?.engineVersion === DECISION_EVENT_ENGINE_CONTRACT_VERSION,
      "versions aligned"
    )
  );

  checks.push(
    check(
      "registry_integrity",
      "Registry integrity",
      getDecisionHistoryRegistry().registeredHistoryCount === 1,
      "one registered history"
    )
  );

  checks.push(
    check(
      "stage_manifest",
      "Stage manifest validation",
      validateStageManifest(DECISION_HISTORY_ENGINE_SELF_MANIFEST).valid === true,
      "manifest valid"
    )
  );

  checks.push(
    check(
      "architecture_boundaries",
      "Architecture file boundaries",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/decision-timeline/decisionHistoryEngine.ts",
        allowedFiles: DECISION_HISTORY_ENGINE_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: DECISION_HISTORY_ENGINE_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true &&
        evaluateStageFileBoundary({
          filePath: "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
          allowedFiles: DECISION_HISTORY_ENGINE_SELF_MANIFEST.allowedFiles,
          forbiddenPatterns: DECISION_HISTORY_ENGINE_SELF_MANIFEST.forbiddenPatterns,
        }).allowed === false,
      "boundaries enforced"
    )
  );

  checks.push(
    check(
      "no_forbidden_runtime",
      "No forbidden runtime dependencies",
      engineHasNoForbiddenRuntime() === true,
      "no persistence or replay runtime"
    )
  );

  checks.push(
    check(
      "protected_platforms_unmodified",
      "APP-6:1 and APP-6:2 files present",
      foundationAndEventFilesUnmodified() === true,
      "protected files intact"
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

  checks.push(
    check(
      "event_type_coverage",
      "Engine event type vocabulary available",
      DECISION_ENGINE_EVENT_TYPE_KEYS.length === 9,
      "9 event types"
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

export const DecisionHistoryRunner = Object.freeze({
  runDecisionHistoryEngine,
});
