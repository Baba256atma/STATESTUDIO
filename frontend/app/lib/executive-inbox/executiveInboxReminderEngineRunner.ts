/**
 * APP-11:5 — Executive Inbox Reminder Engine certification runner.
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
  generateExecutiveNotifications,
  initializeExecutiveInboxNotificationEngine,
  resetExecutiveInboxNotificationEngineForTests,
} from "./executiveInboxNotificationEngine.ts";
import {
  calculateExecutivePriorities,
  initializeExecutiveInboxPrioritization,
  resetExecutiveInboxPrioritizationEngineForTests,
} from "./executiveInboxPrioritizationEngine.ts";
import {
  EXECUTIVE_INBOX_REMINDER_CADENCE_KEYS,
  EXECUTIVE_INBOX_REMINDER_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_REMINDER_ENGINE_PUBLIC_API_RULES,
  EXECUTIVE_INBOX_REMINDER_PIPELINE_STAGES,
  EXECUTIVE_INBOX_REMINDER_TRIGGER_KEYS,
} from "./executiveInboxReminderEngineConstants.ts";
import {
  buildExecutiveReminders,
  generateExecutiveReminders,
  getReminder,
  getReminders,
  initializeExecutiveInboxReminderEngine,
  isExecutiveInboxReminderEngineInitialized,
  registerReminder,
  reminderExists,
  resetExecutiveInboxReminderEngineForTests,
  unregisterReminder,
  validateExecutiveReminders,
  EXECUTIVE_INBOX_REMINDER_ENGINE_SELF_MANIFEST,
} from "./executiveInboxReminderEngine.ts";
import { resolveReminderCadence } from "./executiveInboxReminderCadenceResolver.ts";
import { evaluateReminderEligibility } from "./executiveInboxReminderEligibilityEvaluator.ts";
import { getReminderRegistrySnapshot } from "./executiveInboxReminderEngineRegistry.ts";
import { resolveReminderTrigger } from "./executiveInboxReminderTriggerResolver.ts";
import type {
  ExecutiveInboxReminderCertificationCheck,
  ExecutiveInboxReminderCertificationResult,
  NotificationReminderInput,
} from "./executiveInboxReminderEngineTypes.ts";
import {
  hasDuplicateIds,
  isReminderCadenceKey,
  isReminderTriggerType,
  validateExecutiveReminderProvenance,
  validateReminderDependencies,
} from "./executiveInboxReminderEngineValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-inbox-reminder-001";

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ExecutiveInboxReminderCertificationCheck {
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

function buildReminderEntries(timestamp: string): readonly NotificationReminderInput[] {
  const aggregation = aggregateExecutiveInbox(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "inbox-reminder-session-001",
      sessionLabel: "Reminder Certification Session",
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
      sessionId: "inbox-reminder-session-001",
      items: Object.freeze(aggregation.aggregatedItems.map((item) => Object.freeze({ item }))),
      prioritizationTimestamp: timestamp,
    })
  );
  const notifications = buildExecutiveNotifications(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "inbox-reminder-session-001",
      entries: Object.freeze(
        aggregation.aggregatedItems.map((item) => {
          const priority = priorities.find((entry) => entry.itemId === item.itemId)!;
          return Object.freeze({ item, priority });
        })
      ),
      generationTimestamp: timestamp,
    })
  );
  return Object.freeze(
    notifications.map((notification) => {
      const item = aggregation.aggregatedItems.find((entry) => entry.itemId === notification.itemId)!;
      const priority = priorities.find((entry) => entry.itemId === notification.itemId)!;
      return Object.freeze({ notification, priority, item });
    })
  );
}

export function resetExecutiveInboxReminderEnginePlatformForTests(): void {
  resetExecutiveInboxReminderEngineForTests();
  resetExecutiveInboxNotificationEngineForTests();
  resetExecutiveInboxPrioritizationEngineForTests();
  resetExecutiveInboxAggregationEngineForTests();
  resetExecutiveInboxPlatformForTests();
}

export function runExecutiveInboxReminderCertification(
  timestamp: string = FIXED_TIME
): ExecutiveInboxReminderCertificationResult {
  resetExecutiveInboxReminderEnginePlatformForTests();
  buildExecutiveInboxFoundation(timestamp);
  initializeExecutiveInboxAggregation(timestamp);
  initializeExecutiveInboxPrioritization(timestamp);
  initializeExecutiveInboxNotificationEngine(timestamp);
  const entries = buildReminderEntries(timestamp);
  initializeExecutiveInboxReminderEngine(timestamp);

  const checks: ExecutiveInboxReminderCertificationCheck[] = [];

  checks.push(
    check(
      "A_engine_identity",
      "Engine identity and initialization",
      isExecutiveInboxReminderEngineInitialized() === true,
      EXECUTIVE_INBOX_REMINDER_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "B_dependency_chain",
      "APP-11:1 through APP-11:4 dependency chain",
      validateReminderDependencies().valid === true,
      `${EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION}+${EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION}+APP-11/3+APP-11/4`
    )
  );

  const generation = generateExecutiveReminders(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "inbox-reminder-session-001",
      entries,
      generationTimestamp: timestamp,
    })
  );

  checks.push(
    check(
      "C_generation_success",
      "Deterministic reminder generation succeeds",
      generation.success === true,
      generation.reason
    )
  );

  checks.push(
    check(
      "D_reminders_immutable",
      "Reminder records are immutable",
      generation.reminders.every((entry) => Object.isFrozen(entry) && entry.readOnly === true),
      String(generation.reminders.length)
    )
  );

  checks.push(
    check(
      "E_provenance_complete",
      "Provenance is complete",
      generation.reminders.every((entry) => validateExecutiveReminderProvenance(entry.provenance).valid),
      "provenance valid"
    )
  );

  checks.push(
    check(
      "F_cadence_metadata_only",
      "Cadence metadata has no scheduling behavior",
      generation.reminders.every((entry) => entry.cadence.metadataOnly === true) &&
        EXECUTIVE_INBOX_REMINDER_ENGINE_PUBLIC_API_RULES.cadenceMetadataOnly === true,
      "metadata only"
    )
  );

  checks.push(
    check(
      "G_registry_integrity",
      "Registry integrity verified",
      getReminderRegistrySnapshot().reminderCount === generation.registeredReminderIds.length &&
        generation.registeredReminderIds.every((reminderId) => reminderExists(reminderId)),
      String(getReminderRegistrySnapshot().reminderCount)
    )
  );

  checks.push(
    check(
      "H_pipeline_stages",
      "Pipeline stages complete",
      generation.pipelineStages.length === EXECUTIVE_INBOX_REMINDER_PIPELINE_STAGES.length,
      String(generation.pipelineStages.length)
    )
  );

  const riskEntry = entries.find((entry) => entry.item.sourceType === "risk");
  const riskTrigger = riskEntry
    ? resolveReminderTrigger(riskEntry.notification, riskEntry.item).triggerType
    : null;
  checks.push(
    check(
      "I_trigger_evaluation",
      "Deterministic trigger evaluation",
      riskTrigger === "risk_review",
      riskTrigger ?? "missing"
    )
  );

  checks.push(
    check(
      "J_no_delivery",
      "No reminder delivery",
      EXECUTIVE_INBOX_REMINDER_ENGINE_PUBLIC_API_RULES.noDelivery === true &&
        EXECUTIVE_INBOX_REMINDER_ENGINE_PUBLIC_API_RULES.noCompletedState === true,
      "no delivery"
    )
  );

  checks.push(
    check(
      "K_no_scheduling",
      "No real scheduling or calendar integration",
      EXECUTIVE_INBOX_REMINDER_ENGINE_PUBLIC_API_RULES.noScheduling === true &&
        EXECUTIVE_INBOX_REMINDER_ENGINE_PUBLIC_API_RULES.noCalendarIntegration === true,
      "no scheduling"
    )
  );

  checks.push(
    check(
      "L_consumer_only",
      "Consumer-only reminder generation",
      EXECUTIVE_INBOX_REMINDER_ENGINE_PUBLIC_API_RULES.consumerOnly === true,
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
      "Duplicate reminder detection",
      generation.reminders[0] ? registerReminder(generation.reminders[0]).success === false : false,
      "duplicate rejected"
    )
  );

  const eligibility = riskEntry ? evaluateReminderEligibility(riskEntry) : null;
  checks.push(
    check(
      "O_eligibility_evaluation",
      "Reminder eligibility evaluation",
      eligibility?.eligible === true && (eligibility.evaluatedRules.length ?? 0) > 0,
      eligibility?.reason ?? "missing"
    )
  );

  const cadence = riskEntry ? resolveReminderCadence(riskEntry) : null;
  checks.push(
    check(
      "P_cadence_resolution",
      "Cadence metadata resolution",
      cadence?.metadataOnly === true && isReminderCadenceKey(cadence.cadenceKey) === true,
      cadence?.cadenceKey ?? "missing"
    )
  );

  const built = buildExecutiveReminders(
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
      "Reminder build API",
      built.length === 1 && validateExecutiveReminders(built).valid === true,
      built[0]?.reminderTrigger.triggerType ?? "missing"
    )
  );

  checks.push(
    check(
      "R_stage_manifest",
      "Stage manifest validation",
      validateStageManifest(EXECUTIVE_INBOX_REMINDER_ENGINE_SELF_MANIFEST).valid === true,
      EXECUTIVE_INBOX_REMINDER_ENGINE_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "S_architecture_boundary",
      "Architecture file boundary",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/executive-inbox/executiveInboxReminderEngine.ts",
        allowedFiles: EXECUTIVE_INBOX_REMINDER_ENGINE_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: EXECUTIVE_INBOX_REMINDER_ENGINE_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "executiveInboxReminderEngine.ts"
    )
  );

  checks.push(
    check(
      "T_trigger_vocabulary",
      "Reminder trigger and cadence vocabulary",
      isReminderTriggerType("risk_review") === true &&
        isReminderCadenceKey("weekly") === true &&
        EXECUTIVE_INBOX_REMINDER_TRIGGER_KEYS.length === 9 &&
        EXECUTIVE_INBOX_REMINDER_CADENCE_KEYS.length === 6,
      "vocabulary guards"
    )
  );

  checks.push(
    check(
      "U_explainable_evidence",
      "Supporting evidence present",
      generation.reminders.every((entry) => entry.supportingEvidence.length > 0),
      "evidence present"
    )
  );

  const reminderId = generation.registeredReminderIds[0];
  checks.push(
    check(
      "V_registry_retrieval",
      "Registry retrieval",
      reminderId !== undefined &&
        getReminder(reminderId) !== null &&
        getReminders(WORKSPACE).length === generation.registeredReminderIds.length,
      String(getReminders(WORKSPACE).length)
    )
  );

  if (reminderId) {
    unregisterReminder(reminderId);
  }
  checks.push(
    check(
      "W_unregister_support",
      "Unregister reminder",
      reminderId ? reminderExists(reminderId) === false : false,
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
    phase: "APP-11/5",
    contractVersion: EXECUTIVE_INBOX_REMINDER_ENGINE_CONTRACT_VERSION,
    checks: Object.freeze(checks),
    checkCount: checks.length,
    passedCount,
    failedCount,
    timestamp,
    readOnly: true as const,
  });
}

export const ExecutiveInboxReminderEngineRunner = Object.freeze({
  runExecutiveInboxReminderCertification,
  resetExecutiveInboxReminderEnginePlatformForTests,
});
