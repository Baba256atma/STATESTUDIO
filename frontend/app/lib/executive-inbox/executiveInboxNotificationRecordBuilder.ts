/**
 * APP-11:4 — Executive Inbox Notification record builder.
 */

import {
  EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_NOTIFICATION_SOURCE_CATEGORY_MAP,
} from "./executiveInboxNotificationEngineConstants.ts";
import { evaluateNotificationEligibility } from "./executiveInboxNotificationEligibilityEvaluator.ts";
import { resolveNotificationTrigger } from "./executiveInboxNotificationTriggerResolver.ts";
import type { ExecutiveInboxItem } from "./executiveInboxAggregationEngineTypes.ts";
import type { ExecutiveInboxPriority } from "./executiveInboxPrioritizationEngineTypes.ts";
import type {
  ExecutiveNotification,
  ExecutiveNotificationProfile,
  ExecutiveNotificationProvenance,
  NotificationCategory,
  NotificationEvidence,
  NotificationEligibility,
  PrioritizedInboxNotificationInput,
} from "./executiveInboxNotificationEngineTypes.ts";

export function buildNotificationId(priorityId: string): string {
  return `executive-notification-${priorityId}`;
}

export function buildExecutiveNotificationProvenance(
  priority: ExecutiveInboxPriority,
  item: ExecutiveInboxItem
): ExecutiveNotificationProvenance {
  return Object.freeze({
    itemId: item.itemId,
    priorityId: priority.priorityId,
    originatingPlatform: item.provenance.originatingPlatform,
    workspaceId: item.workspaceId,
    aggregationVersion: item.provenance.aggregationVersion,
    prioritizationVersion: priority.version,
    engineVersion: EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION,
    foundationVersion: "APP-11/1" as const,
    readOnly: true as const,
  });
}

export function buildSupportingEvidence(
  priority: ExecutiveInboxPriority,
  item: ExecutiveInboxItem,
  eligibility: NotificationEligibility
): readonly NotificationEvidence[] {
  const priorityEvidence = priority.profile.evidence.slice(0, 3).map((entry) =>
    Object.freeze({
      evidenceId: `notification-evidence-${entry.evidenceId}`,
      signal: entry.signal,
      rationale: entry.rationale,
      dimensionKey: entry.dimensionKey,
      readOnly: true as const,
    })
  );
  const eligibilityEvidence = Object.freeze({
    evidenceId: `notification-evidence-eligibility-${item.itemId}`,
    signal: "eligibility_evaluation",
    rationale: eligibility.reason,
    readOnly: true as const,
  });
  return Object.freeze([...priorityEvidence, eligibilityEvidence]);
}

export function buildExecutiveSummary(
  priority: ExecutiveInboxPriority,
  item: ExecutiveInboxItem,
  category: NotificationCategory
): string {
  return `Executive ${category} notification for ${item.sourceType} item (${priority.priorityLevel} priority, score ${priority.weightedScore}): ${item.summary}`;
}

export function buildExecutiveNotificationProfile(
  entry: PrioritizedInboxNotificationInput,
  generationTimestamp: string
): ExecutiveNotificationProfile {
  const { priority, item } = entry;
  const eligibility = evaluateNotificationEligibility(entry);
  const trigger = resolveNotificationTrigger(priority, item);
  const notificationCategory = EXECUTIVE_INBOX_NOTIFICATION_SOURCE_CATEGORY_MAP[item.sourceType];
  const notificationId = buildNotificationId(priority.priorityId);
  const provenance = buildExecutiveNotificationProvenance(priority, item);

  return Object.freeze({
    profileId: `notification-profile-${priority.priorityId}`,
    notificationId,
    itemId: item.itemId,
    priorityId: priority.priorityId,
    workspaceId: item.workspaceId,
    trigger,
    notificationCategory,
    executiveSummary: buildExecutiveSummary(priority, item, notificationCategory),
    supportingEvidence: buildSupportingEvidence(priority, item, eligibility),
    eligibility,
    provenance,
    generationTimestamp,
    engineVersion: EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION,
    version: EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export function buildExecutiveNotification(
  entry: PrioritizedInboxNotificationInput,
  generationTimestamp: string
): ExecutiveNotification {
  const profile = buildExecutiveNotificationProfile(entry, generationTimestamp);
  return Object.freeze({
    notificationId: profile.notificationId,
    itemId: profile.itemId,
    priorityId: profile.priorityId,
    workspaceId: profile.workspaceId,
    triggerType: profile.trigger.triggerType,
    notificationCategory: profile.notificationCategory,
    executiveSummary: profile.executiveSummary,
    supportingEvidence: profile.supportingEvidence,
    profile,
    eligibility: profile.eligibility,
    provenance: profile.provenance,
    generationTimestamp,
    engineVersion: EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION,
    version: EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export const ExecutiveInboxNotificationRecordBuilder = Object.freeze({
  buildNotificationId,
  buildExecutiveNotificationProvenance,
  buildSupportingEvidence,
  buildExecutiveSummary,
  buildExecutiveNotificationProfile,
  buildExecutiveNotification,
});
