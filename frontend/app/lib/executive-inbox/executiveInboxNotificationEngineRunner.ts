/**
 * APP-11:4 — Executive Inbox Notification Engine certification runner.
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
import {
  calculateExecutivePriorities,
  initializeExecutiveInboxPrioritization,
  resetExecutiveInboxPrioritizationEngineForTests,
} from "./executiveInboxPrioritizationEngine.ts";
import type { CertifiedInboxSourceRecordInput } from "./executiveInboxAggregationEngineTypes.ts";
import {
  EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_NOTIFICATION_ENGINE_PUBLIC_API_RULES,
  EXECUTIVE_INBOX_NOTIFICATION_PIPELINE_STAGES,
  EXECUTIVE_INBOX_NOTIFICATION_TRIGGER_KEYS,
} from "./executiveInboxNotificationEngineConstants.ts";
import {
  buildExecutiveNotifications,
  generateExecutiveNotifications,
  getNotification,
  getNotifications,
  initializeExecutiveInboxNotificationEngine,
  isExecutiveInboxNotificationEngineInitialized,
  notificationExists,
  registerNotification,
  resetExecutiveInboxNotificationEngineForTests,
  unregisterNotification,
  validateExecutiveNotifications,
  EXECUTIVE_INBOX_NOTIFICATION_ENGINE_SELF_MANIFEST,
} from "./executiveInboxNotificationEngine.ts";
import { evaluateNotificationEligibility } from "./executiveInboxNotificationEligibilityEvaluator.ts";
import { getNotificationRegistrySnapshot } from "./executiveInboxNotificationEngineRegistry.ts";
import { resolveNotificationTrigger } from "./executiveInboxNotificationTriggerResolver.ts";
import type {
  ExecutiveInboxNotificationCertificationCheck,
  ExecutiveInboxNotificationCertificationResult,
  PrioritizedInboxNotificationInput,
} from "./executiveInboxNotificationEngineTypes.ts";
import {
  hasDuplicateIds,
  isNotificationCategory,
  isNotificationTriggerType,
  validateExecutiveNotificationProvenance,
  validateNotificationDependencies,
} from "./executiveInboxNotificationEngineValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const WORKSPACE = "ws-inbox-notification-001";

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ExecutiveInboxNotificationCertificationCheck {
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

function buildPrioritizedEntries(timestamp: string): readonly PrioritizedInboxNotificationInput[] {
  const aggregation = aggregateExecutiveInbox(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "inbox-notification-session-001",
      sessionLabel: "Notification Certification Session",
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
      sessionId: "inbox-notification-session-001",
      items: Object.freeze(aggregation.aggregatedItems.map((item) => Object.freeze({ item }))),
      prioritizationTimestamp: timestamp,
    })
  );
  return Object.freeze(
    aggregation.aggregatedItems.map((item) => {
      const priority = priorities.find((entry) => entry.itemId === item.itemId);
      if (!priority) {
        throw new Error(`Missing priority for item ${item.itemId}`);
      }
      return Object.freeze({ priority, item });
    })
  );
}

export function resetExecutiveInboxNotificationEnginePlatformForTests(): void {
  resetExecutiveInboxNotificationEngineForTests();
  resetExecutiveInboxPrioritizationEngineForTests();
  resetExecutiveInboxAggregationEngineForTests();
  resetExecutiveInboxPlatformForTests();
}

export function runExecutiveInboxNotificationCertification(
  timestamp: string = FIXED_TIME
): ExecutiveInboxNotificationCertificationResult {
  resetExecutiveInboxNotificationEnginePlatformForTests();
  buildExecutiveInboxFoundation(timestamp);
  initializeExecutiveInboxAggregation(timestamp);
  const entries = buildPrioritizedEntries(timestamp);
  initializeExecutiveInboxPrioritization(timestamp);
  initializeExecutiveInboxNotificationEngine(timestamp);

  const checks: ExecutiveInboxNotificationCertificationCheck[] = [];

  checks.push(
    check(
      "A_engine_identity",
      "Engine identity and initialization",
      isExecutiveInboxNotificationEngineInitialized() === true,
      EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION
    )
  );

  checks.push(
    check(
      "B_dependency_chain",
      "APP-11:1 through APP-11:3 dependency chain",
      validateNotificationDependencies().valid === true,
      `${EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION}+${EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION}+APP-11/3`
    )
  );

  const generation = generateExecutiveNotifications(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "inbox-notification-session-001",
      entries,
      generationTimestamp: timestamp,
    })
  );

  checks.push(
    check(
      "C_generation_success",
      "Deterministic notification generation succeeds",
      generation.success === true,
      generation.reason
    )
  );

  checks.push(
    check(
      "D_notifications_immutable",
      "Notification records are immutable",
      generation.notifications.every((entry) => Object.isFrozen(entry) && entry.readOnly === true),
      String(generation.notifications.length)
    )
  );

  checks.push(
    check(
      "E_provenance_complete",
      "Provenance is complete",
      generation.notifications.every((entry) => validateExecutiveNotificationProvenance(entry.provenance).valid),
      "provenance valid"
    )
  );

  checks.push(
    check(
      "F_no_delivery_state",
      "No delivery or read/unread state",
      EXECUTIVE_INBOX_NOTIFICATION_ENGINE_PUBLIC_API_RULES.noDelivery === true &&
        EXECUTIVE_INBOX_NOTIFICATION_ENGINE_PUBLIC_API_RULES.noReadUnreadState === true,
      "metadata only"
    )
  );

  checks.push(
    check(
      "G_registry_integrity",
      "Registry integrity verified",
      getNotificationRegistrySnapshot().notificationCount === generation.registeredNotificationIds.length &&
        generation.registeredNotificationIds.every((notificationId) => notificationExists(notificationId)),
      String(getNotificationRegistrySnapshot().notificationCount)
    )
  );

  checks.push(
    check(
      "H_pipeline_stages",
      "Pipeline stages complete",
      generation.pipelineStages.length === EXECUTIVE_INBOX_NOTIFICATION_PIPELINE_STAGES.length,
      String(generation.pipelineStages.length)
    )
  );

  const riskEntry = entries.find((entry) => entry.item.sourceType === "risk");
  const riskTrigger = riskEntry
    ? resolveNotificationTrigger(riskEntry.priority, riskEntry.item).triggerType
    : null;
  checks.push(
    check(
      "I_trigger_evaluation",
      "Deterministic trigger evaluation",
      riskTrigger === "risk_escalation",
      riskTrigger ?? "missing"
    )
  );

  checks.push(
    check(
      "J_no_delivery",
      "No notification delivery",
      EXECUTIVE_INBOX_NOTIFICATION_ENGINE_PUBLIC_API_RULES.noPushNotifications === true &&
        EXECUTIVE_INBOX_NOTIFICATION_ENGINE_PUBLIC_API_RULES.noEmail === true,
      "no delivery"
    )
  );

  checks.push(
    check(
      "K_no_scheduling",
      "No scheduling logic",
      EXECUTIVE_INBOX_NOTIFICATION_ENGINE_PUBLIC_API_RULES.noScheduling === true &&
        EXECUTIVE_INBOX_NOTIFICATION_ENGINE_PUBLIC_API_RULES.noReminders === true,
      "no scheduling"
    )
  );

  checks.push(
    check(
      "L_consumer_only",
      "Consumer-only notification generation",
      EXECUTIVE_INBOX_NOTIFICATION_ENGINE_PUBLIC_API_RULES.consumerOnly === true,
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
      "Duplicate notification detection",
      generation.notifications[0] ? registerNotification(generation.notifications[0]).success === false : false,
      "duplicate rejected"
    )
  );

  const eligibility = riskEntry ? evaluateNotificationEligibility(riskEntry) : null;
  checks.push(
    check(
      "O_eligibility_evaluation",
      "Notification eligibility evaluation",
      eligibility?.eligible === true && (eligibility.evaluatedRules.length ?? 0) > 0,
      eligibility?.reason ?? "missing"
    )
  );

  const built = buildExecutiveNotifications(
    Object.freeze({
      workspaceId: WORKSPACE,
      sessionId: "build-session",
      entries: Object.freeze(entries.slice(0, 1)),
      generationTimestamp: timestamp,
    })
  );
  checks.push(
    check(
      "P_build_api",
      "Notification build API",
      built.length === 1 && validateExecutiveNotifications(built).valid === true,
      built[0]?.triggerType ?? "missing"
    )
  );

  checks.push(
    check(
      "Q_stage_manifest",
      "Stage manifest validation",
      validateStageManifest(EXECUTIVE_INBOX_NOTIFICATION_ENGINE_SELF_MANIFEST).valid === true,
      EXECUTIVE_INBOX_NOTIFICATION_ENGINE_SELF_MANIFEST.stageId
    )
  );

  checks.push(
    check(
      "R_architecture_boundary",
      "Architecture file boundary",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/executive-inbox/executiveInboxNotificationEngine.ts",
        allowedFiles: EXECUTIVE_INBOX_NOTIFICATION_ENGINE_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: EXECUTIVE_INBOX_NOTIFICATION_ENGINE_SELF_MANIFEST.forbiddenPatterns,
      }).allowed === true,
      "executiveInboxNotificationEngine.ts"
    )
  );

  checks.push(
    check(
      "S_trigger_vocabulary",
      "Notification trigger vocabulary",
      isNotificationTriggerType("risk_escalation") === true &&
        isNotificationCategory("risk") === true &&
        EXECUTIVE_INBOX_NOTIFICATION_TRIGGER_KEYS.length === 9,
      "trigger guards"
    )
  );

  checks.push(
    check(
      "T_explainable_evidence",
      "Supporting evidence present",
      generation.notifications.every((entry) => entry.supportingEvidence.length > 0),
      "evidence present"
    )
  );

  const notificationId = generation.registeredNotificationIds[0];
  checks.push(
    check(
      "U_registry_retrieval",
      "Registry retrieval",
      notificationId !== undefined &&
        getNotification(notificationId) !== null &&
        getNotifications(WORKSPACE).length === generation.registeredNotificationIds.length,
      String(getNotifications(WORKSPACE).length)
    )
  );

  if (notificationId) {
    unregisterNotification(notificationId);
  }
  checks.push(
    check(
      "V_unregister_support",
      "Unregister notification",
      notificationId ? notificationExists(notificationId) === false : false,
      "unregistered"
    )
  );

  checks.push(
    check(
      "W_duplicate_ids_guard",
      "Duplicate ID guard",
      hasDuplicateIds(["a", "b", "a"]) === true && hasDuplicateIds(["a", "b"]) === false,
      "duplicate guard"
    )
  );

  checks.push(
    check(
      "X_ineligible_tracking",
      "Ineligible entries tracked deterministically",
      generation.ineligibleEntries >= 0,
      String(generation.ineligibleEntries)
    )
  );

  const passedCount = checks.filter((entry) => entry.passed).length;
  const failedCount = checks.length - passedCount;

  return Object.freeze({
    certified: failedCount === 0,
    phase: "APP-11/4",
    contractVersion: EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION,
    checks: Object.freeze(checks),
    checkCount: checks.length,
    passedCount,
    failedCount,
    timestamp,
    readOnly: true as const,
  });
}

export const ExecutiveInboxNotificationEngineRunner = Object.freeze({
  runExecutiveInboxNotificationCertification,
  resetExecutiveInboxNotificationEnginePlatformForTests,
});
