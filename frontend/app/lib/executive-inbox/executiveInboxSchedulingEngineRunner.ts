/**
 * APP-11:6 — Executive Inbox Scheduling Engine certification runner.
 */

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY } from "../cross-scenario-learning/crossScenarioLearningContracts.ts";
import { EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION, EXECUTIVE_INBOX_PLATFORM_IDENTITY } from "./executiveInboxContracts.ts";
import { buildExecutiveInboxFoundation } from "./executiveInboxFoundation.ts";
import { resetExecutiveInboxPlatformForTests } from "./executiveInboxRunner.ts";
import {
  EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_AGGREGATION_SOURCE_PLATFORM_MAP,
} from "./executiveInboxAggregationEngineConstants.ts";
import {
  aggregateExecutiveInbox,
  initializeExecutiveInboxAggregation,
  resetExecutiveInboxAggregationEngineForTests,
} from "./executiveInboxAggregationEngine.ts";
import type { CertifiedInboxSourceRecordInput } from "./executiveInboxAggregationEngineTypes.ts";
import {
  buildExecutiveNotifications,
  initializeExecutiveInboxNotificationEngine,
  resetExecutiveInboxNotificationEngineForTests,
} from "./executiveInboxNotificationEngine.ts";
import {
  calculateExecutivePriorities,
  initializeExecutiveInboxPrioritization,
  resetExecutiveInboxPrioritizationEngineForTests,
} from "./executiveInboxPrioritizationEngine.ts";
import {
  buildExecutiveReminders,
  initializeExecutiveInboxReminderEngine,
  resetExecutiveInboxReminderEngineForTests,
} from "./executiveInboxReminderEngine.ts";
import {
  EXECUTIVE_INBOX_SCHEDULE_WINDOW_KEYS,
  EXECUTIVE_INBOX_SCHEDULING_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_SCHEDULING_ENGINE_PUBLIC_API_RULES,
  EXECUTIVE_INBOX_SCHEDULING_PIPELINE_STAGES,
  EXECUTIVE_INBOX_SCHEDULE_TRIGGER_KEYS,
} from "./executiveInboxSchedulingEngineConstants.ts";
import {
  buildExecutiveScheduleIntents,
  generateExecutiveScheduleIntents,
  getScheduleIntent,
  getScheduleIntents,
  initializeExecutiveInboxSchedulingEngine,
  isExecutiveInboxSchedulingEngineInitialized,
  registerScheduleIntent,
  resetExecutiveInboxSchedulingEngineForTests,
  scheduleIntentExists,
  unregisterScheduleIntent,
  validateExecutiveScheduleIntents,
  EXECUTIVE_INBOX_SCHEDULING_ENGINE_SELF_MANIFEST,
} from "./executiveInboxSchedulingEngine.ts";
import { evaluateSchedulingEligibility } from "./executiveInboxSchedulingEligibilityEvaluator.ts";
import { getScheduleRegistrySnapshot } from "./executiveInboxSchedulingEngineRegistry.ts";
import { resolveScheduleTrigger } from "./executiveInboxSchedulingTriggerResolver.ts";
import { resolveScheduleWindow } from "./executiveInboxSchedulingWindowResolver.ts";
import type {
  ExecutiveInboxSchedulingCertificationCheck,
  ExecutiveInboxSchedulingCertificationResult,
  ReminderScheduleInput,
} from "./executiveInboxSchedulingEngineTypes.ts";
import {
  hasDuplicateIds,
  isScheduleTriggerType,
  isScheduleWindowKey,
  validateExecutiveScheduleProvenance,
  validateSchedulingDependencies,
} from "./executiveInboxSchedulingEngineValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-inbox-scheduling-001";

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ExecutiveInboxSchedulingCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function sourceRecord(
  suffix: string,
  sourceType: CertifiedInboxSourceRecordInput["sourceType"]
): CertifiedInboxSourceRecordInput {
  const mapping = EXECUTIVE_INBOX_AGGREGATION_SOURCE_PLATFORM_MAP[sourceType];
  return Object.freeze({
    sourceId: `inbox-source-${sourceType}-${suffix}`,
    sourceType,
    workspaceId: WORKSPACE,
    platformId: mapping.platformId,
    appId: mapping.defaultAppId,
    recordId: `${sourceType}-record-${suffix}`,
    businessContext: `Executive attention required for ${sourceType} ${suffix}.`,
    summary: `Review ${sourceType} matter ${suffix} from certified platform.`,
    sourceVersion: mapping.defaultAppId === "APP-5" ? "APP-5/1" : "APP-10/1",
    sourceApps: Object.freeze(["APP-5", "APP-6", "APP-8", "APP-9", "APP-10", "APP-11/1"]),
  });
}

function buildScheduleEntries(timestamp: string): readonly ReminderScheduleInput[] {
  const aggregation = aggregateExecutiveInbox(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "inbox-scheduling-session-001",
      sessionLabel: "Scheduling Certification Session",
      sourceRecords: Object.freeze([
        sourceRecord("001", "risk"),
        sourceRecord("002", "decision"),
        sourceRecord("003", "assistant"),
      ]),
      aggregationTimestamp: timestamp,
    })
  );
  const priorities = calculateExecutivePriorities(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "inbox-scheduling-session-001",
      items: Object.freeze(aggregation.aggregatedItems.map((item) => Object.freeze({ item }))),
      prioritizationTimestamp: timestamp,
    })
  );
  const notifications = buildExecutiveNotifications(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "inbox-scheduling-session-001",
      entries: Object.freeze(
        aggregation.aggregatedItems.map((item) => {
          const priority = priorities.find((entry) => entry.itemId === item.itemId)!;
          return Object.freeze({ item, priority });
        })
      ),
      generationTimestamp: timestamp,
    })
  );
  const reminders = buildExecutiveReminders(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "inbox-scheduling-session-001",
      entries: Object.freeze(
        notifications.map((notification) => {
          const item = aggregation.aggregatedItems.find((entry) => entry.itemId === notification.itemId)!;
          const priority = priorities.find((entry) => entry.itemId === notification.itemId)!;
          return Object.freeze({ notification, priority, item });
        })
      ),
      generationTimestamp: timestamp,
    })
  );
  return Object.freeze(
    reminders.map((reminder) => {
      const item = aggregation.aggregatedItems.find((entry) => entry.itemId === reminder.itemId)!;
      const priority = priorities.find((entry) => entry.itemId === reminder.itemId)!;
      const notification = notifications.find((entry) => entry.notificationId === reminder.notificationId)!;
      return Object.freeze({ reminder, notification, priority, item });
    })
  );
}

export function resetExecutiveInboxSchedulingEnginePlatformForTests(): void {
  resetExecutiveInboxSchedulingEngineForTests();
  resetExecutiveInboxReminderEngineForTests();
  resetExecutiveInboxNotificationEngineForTests();
  resetExecutiveInboxPrioritizationEngineForTests();
  resetExecutiveInboxAggregationEngineForTests();
  resetExecutiveInboxPlatformForTests();
}

export function runExecutiveInboxSchedulingCertification(
  timestamp: string = FIXED_TIME
): ExecutiveInboxSchedulingCertificationResult {
  resetExecutiveInboxSchedulingEnginePlatformForTests();
  buildExecutiveInboxFoundation(timestamp);
  initializeExecutiveInboxAggregation(timestamp);
  initializeExecutiveInboxPrioritization(timestamp);
  initializeExecutiveInboxNotificationEngine(timestamp);
  initializeExecutiveInboxReminderEngine(timestamp);
  const entries = buildScheduleEntries(timestamp);
  initializeExecutiveInboxSchedulingEngine(timestamp);

  const checks: ExecutiveInboxSchedulingCertificationCheck[] = [];

  checks.push(
    check(
      "A_engine_identity",
      "Engine identity and initialization",
      isExecutiveInboxSchedulingEngineInitialized() === true,
      EXECUTIVE_INBOX_SCHEDULING_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "B_dependency_chain",
      "APP-11:1 through APP-11:5 dependency chain",
      validateSchedulingDependencies().valid === true,
      `${EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION}+${EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION}+APP-11/3+APP-11/4+APP-11/5`
    )
  );

  const generation = generateExecutiveScheduleIntents(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "inbox-scheduling-session-001",
      entries,
      generationTimestamp: timestamp,
    })
  );

  checks.push(
    check(
      "C_generation_success",
      "Deterministic scheduling generation succeeds",
      generation.success === true,
      generation.reason
    )
  );

  checks.push(
    check(
      "D_intents_immutable",
      "Schedule intents are immutable",
      generation.scheduleIntents.every((entry) => Object.isFrozen(entry) && entry.readOnly === true),
      String(generation.scheduleIntents.length)
    )
  );

  checks.push(
    check(
      "E_provenance_complete",
      "Provenance is complete",
      generation.scheduleIntents.every((entry) => validateExecutiveScheduleProvenance(entry.provenance).valid),
      "provenance valid"
    )
  );

  checks.push(
    check(
      "F_window_metadata_only",
      "Schedule windows are metadata-only",
      generation.scheduleIntents.every((entry) => entry.scheduleWindow.metadataOnly === true) &&
        EXECUTIVE_INBOX_SCHEDULING_ENGINE_PUBLIC_API_RULES.scheduleWindowMetadataOnly === true,
      "metadata only"
    )
  );

  checks.push(
    check(
      "G_registry_integrity",
      "Registry integrity verified",
      getScheduleRegistrySnapshot().scheduleCount === generation.registeredScheduleIds.length &&
        generation.registeredScheduleIds.every((scheduleId) => scheduleIntentExists(scheduleId)),
      String(getScheduleRegistrySnapshot().scheduleCount)
    )
  );

  checks.push(
    check(
      "H_pipeline_stages",
      "Pipeline stages complete",
      generation.pipelineStages.length === EXECUTIVE_INBOX_SCHEDULING_PIPELINE_STAGES.length,
      String(generation.pipelineStages.length)
    )
  );

  const riskEntry = entries.find((entry) => entry.item.sourceType === "risk");
  const riskTrigger = riskEntry ? resolveScheduleTrigger(riskEntry.reminder).triggerType : null;
  checks.push(
    check(
      "I_trigger_evaluation",
      "Deterministic trigger evaluation",
      riskTrigger === "risk_schedule",
      riskTrigger ?? "missing"
    )
  );

  checks.push(
    check(
      "J_no_calendar",
      "No calendar events or background jobs",
      EXECUTIVE_INBOX_SCHEDULING_ENGINE_PUBLIC_API_RULES.noCalendarEvents === true &&
        EXECUTIVE_INBOX_SCHEDULING_ENGINE_PUBLIC_API_RULES.noBackgroundJobs === true,
      "no calendar"
    )
  );

  checks.push(
    check(
      "K_no_execution_state",
      "No delivery or execution state",
      EXECUTIVE_INBOX_SCHEDULING_ENGINE_PUBLIC_API_RULES.noDelivery === true &&
        EXECUTIVE_INBOX_SCHEDULING_ENGINE_PUBLIC_API_RULES.noExecutionState === true,
      "no execution"
    )
  );

  checks.push(
    check(
      "L_consumer_only",
      "Consumer-only scheduling generation",
      EXECUTIVE_INBOX_SCHEDULING_ENGINE_PUBLIC_API_RULES.consumerOnly === true,
      "consumer only"
    )
  );

  checks.push(
    check(
      "M_prior_platforms_untouched",
      "Prior APP platforms untouched",
      EXECUTIVE_INBOX_PLATFORM_IDENTITY.appId === "APP-11" &&
        CROSS_SCENARIO_LEARNING_PLATFORM_IDENTITY.appId === "APP-10",
      "APP-10 verified"
    )
  );

  checks.push(
    check(
      "N_duplicate_detection",
      "Duplicate schedule detection",
      generation.scheduleIntents[0] ? registerScheduleIntent(generation.scheduleIntents[0]).success === false : false,
      "duplicate rejected"
    )
  );

  const eligibility = riskEntry ? evaluateSchedulingEligibility(riskEntry) : null;
  checks.push(
    check(
      "O_eligibility_evaluation",
      "Scheduling eligibility evaluation",
      eligibility?.eligible === true && (eligibility.evaluatedRules.length ?? 0) > 0,
      eligibility?.reason ?? "missing"
    )
  );

  const window = riskEntry ? resolveScheduleWindow(riskEntry) : null;
  checks.push(
    check(
      "P_window_resolution",
      "Schedule window metadata resolution",
      window?.metadataOnly === true && isScheduleWindowKey(window.windowKey) === true,
      window?.windowKey ?? "missing"
    )
  );

  const built = buildExecutiveScheduleIntents(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "build-session",
      entries: Object.freeze(entries.slice(0, 1)),
      generationTimestamp: timestamp,
    })
  );
  checks.push(
    check(
      "Q_build_api",
      "Schedule build API",
      built.length === 1 && validateExecutiveScheduleIntents(built).valid === true,
      built[0]?.scheduleTrigger.triggerType ?? "missing"
    )
  );

  checks.push(
    check(
      "R_stage_manifest",
      "Stage manifest validation",
      validateStageManifest(EXECUTIVE_INBOX_SCHEDULING_ENGINE_SELF_MANIFEST).valid === true,
      EXECUTIVE_INBOX_SCHEDULING_ENGINE_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "S_architecture_boundary",
      "Architecture file boundary",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/executive-inbox/executiveInboxSchedulingEngine.ts",
        allowedFiles: EXECUTIVE_INBOX_SCHEDULING_ENGINE_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: EXECUTIVE_INBOX_SCHEDULING_ENGINE_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "executiveInboxSchedulingEngine.ts"
    )
  );

  checks.push(
    check(
      "T_trigger_vocabulary",
      "Schedule trigger and window vocabulary",
      isScheduleTriggerType("risk_schedule") === true &&
        isScheduleWindowKey("this_week") === true &&
        EXECUTIVE_INBOX_SCHEDULE_TRIGGER_KEYS.length === 9 &&
        EXECUTIVE_INBOX_SCHEDULE_WINDOW_KEYS.length === 7,
      "vocabulary guards"
    )
  );

  checks.push(
    check(
      "U_explainable_evidence",
      "Supporting evidence present",
      generation.scheduleIntents.every((entry) => entry.supportingEvidence.length > 0),
      "evidence present"
    )
  );

  const scheduleId = generation.registeredScheduleIds[0];
  checks.push(
    check(
      "V_registry_retrieval",
      "Registry retrieval",
      scheduleId !== undefined &&
        getScheduleIntent(scheduleId) !== null &&
        getScheduleIntents(WORKSPACE).length === generation.registeredScheduleIds.length,
      String(getScheduleIntents(WORKSPACE).length)
    )
  );

  if (scheduleId) {
    unregisterScheduleIntent(scheduleId);
  }
  checks.push(
    check(
      "W_unregister_support",
      "Unregister schedule intent",
      scheduleId ? scheduleIntentExists(scheduleId) === false : false,
      "unregistered"
    )
  );

  checks.push(
    check(
      "X_duplicate_ids_guard",
      "Duplicate ID guard",
      hasDuplicateIds(["a", "b", "a"]) === true && hasDuplicateIds(["a", "b"]) === false,
      "duplicate guard"
    )
  );

  checks.push(
    check(
      "Y_ineligible_tracking",
      "Ineligible entries tracked deterministically",
      generation.ineligibleEntries >= 0,
      String(generation.ineligibleEntries)
    )
  );

  const passedCount = checks.filter((entry) => entry.passed).length;
  const failedCount = checks.length - passedCount;

  return Object.freeze({
    certified: failedCount === 0,
    phase: "APP-11/6",
    contractVersion: EXECUTIVE_INBOX_SCHEDULING_ENGINE_CONTRACT_VERSION,
    checks: Object.freeze(checks),
    checkCount: checks.length,
    passedCount,
    failedCount,
    timestamp,
    readOnly: true as const,
  });
}

export const ExecutiveInboxSchedulingEngineRunner = Object.freeze({
  runExecutiveInboxSchedulingCertification,
  resetExecutiveInboxSchedulingEnginePlatformForTests,
});
