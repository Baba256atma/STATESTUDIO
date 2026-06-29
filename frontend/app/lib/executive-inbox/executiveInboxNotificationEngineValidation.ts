/**
 * APP-11:4 — Executive Inbox Notification Engine validation.
 */

import { EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION } from "./executiveInboxAggregationEngineConstants.ts";
import { isExecutiveInboxAggregationInitialized } from "./executiveInboxAggregationEngine.ts";
import { validateExecutiveInboxItem } from "./executiveInboxAggregationEngineValidation.ts";
import { EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION } from "./executiveInboxConstants.ts";
import { isExecutiveInboxPlatformInitialized } from "./executiveInboxFoundation.ts";
import { EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION } from "./executiveInboxPrioritizationEngineConstants.ts";
import { isExecutiveInboxPrioritizationInitialized } from "./executiveInboxPrioritizationEngine.ts";
import { validateExecutivePriority } from "./executiveInboxPrioritizationEngineValidation.ts";
import {
  EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_NOTIFICATION_ENGINE_LIMITS,
  EXECUTIVE_INBOX_NOTIFICATION_MANDATORY_NOTIFICATION_FIELDS,
  EXECUTIVE_INBOX_NOTIFICATION_CATEGORY_KEYS,
  EXECUTIVE_INBOX_NOTIFICATION_TRIGGER_KEYS,
} from "./executiveInboxNotificationEngineConstants.ts";
import type {
  ExecutiveInboxNotificationRequest,
  ExecutiveNotification,
  ExecutiveNotificationProfile,
  ExecutiveNotificationProvenance,
  NotificationEligibility,
  NotificationEvidence,
  NotificationTrigger,
  NotificationValidationIssue,
  NotificationValidationResult,
} from "./executiveInboxNotificationEngineTypes.ts";

function issue(code: string, message: string, field?: string): NotificationValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: NotificationValidationIssue[]): NotificationValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function hasDuplicateIds(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

export function isNotificationTriggerType(value: string): value is NotificationTrigger["triggerType"] {
  return (EXECUTIVE_INBOX_NOTIFICATION_TRIGGER_KEYS as readonly string[]).includes(value);
}

export function isNotificationCategory(value: string): value is ExecutiveNotification["notificationCategory"] {
  return (EXECUTIVE_INBOX_NOTIFICATION_CATEGORY_KEYS as readonly string[]).includes(value);
}

export function validateNotificationTrigger(trigger: NotificationTrigger): NotificationValidationResult {
  const issues: NotificationValidationIssue[] = [];
  if (!isNotificationTriggerType(trigger.triggerType)) {
    issues.push(issue("invalid_trigger", "triggerType is invalid.", "triggerType"));
  }
  if (!trigger.label.trim() || !trigger.reason.trim()) {
    issues.push(issue("invalid_trigger", "Trigger label and reason are required.", "trigger"));
  }
  return result(issues);
}

export function validateNotificationEligibility(eligibility: NotificationEligibility): NotificationValidationResult {
  const issues: NotificationValidationIssue[] = [];
  if (!eligibility.reason.trim()) {
    issues.push(issue("invalid_eligibility", "Eligibility reason is required.", "reason"));
  }
  if (eligibility.evaluatedRules.length === 0) {
    issues.push(issue("invalid_eligibility", "evaluatedRules must not be empty.", "evaluatedRules"));
  }
  return result(issues);
}

export function validateNotificationEvidence(evidence: NotificationEvidence): NotificationValidationResult {
  const issues: NotificationValidationIssue[] = [];
  if (!evidence.evidenceId.trim() || !evidence.signal.trim() || !evidence.rationale.trim()) {
    issues.push(issue("invalid_evidence", "Evidence fields are incomplete.", "evidence"));
  }
  return result(issues);
}

export function validateExecutiveNotificationProvenance(
  provenance: ExecutiveNotificationProvenance
): NotificationValidationResult {
  const issues: NotificationValidationIssue[] = [];
  if (!provenance.itemId.trim() || !provenance.priorityId.trim()) {
    issues.push(issue("missing_provenance", "itemId and priorityId are required.", "provenance"));
  }
  if (!provenance.originatingPlatform.trim() || !provenance.workspaceId.trim()) {
    issues.push(issue("missing_provenance", "originatingPlatform and workspaceId are required.", "provenance"));
  }
  if (!provenance.aggregationVersion.trim()) {
    issues.push(issue("missing_provenance", "aggregationVersion is required.", "provenance.aggregationVersion"));
  }
  if (provenance.prioritizationVersion !== EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_provenance", "prioritizationVersion mismatch.", "provenance.prioritizationVersion"));
  }
  if (provenance.engineVersion !== EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_provenance", "engineVersion mismatch.", "provenance.engineVersion"));
  }
  if (provenance.foundationVersion !== EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION) {
    issues.push(issue("invalid_provenance", "foundationVersion mismatch.", "provenance.foundationVersion"));
  }
  return result(issues);
}

export function validateExecutiveNotificationProfile(
  profile: ExecutiveNotificationProfile
): NotificationValidationResult {
  const issues: NotificationValidationIssue[] = [];
  if (!profile.profileId.trim() || !profile.notificationId.trim()) {
    issues.push(issue("invalid_profile", "Profile identity is incomplete.", "profile"));
  }
  if (!isNotificationCategory(profile.notificationCategory)) {
    issues.push(issue("invalid_category", "notificationCategory is invalid.", "notificationCategory"));
  }
  if (
    !profile.executiveSummary.trim() ||
    profile.executiveSummary.length > EXECUTIVE_INBOX_NOTIFICATION_ENGINE_LIMITS.maxExecutiveSummaryLength
  ) {
    issues.push(issue("invalid_summary", "executiveSummary is invalid.", "executiveSummary"));
  }
  if (profile.supportingEvidence.length > EXECUTIVE_INBOX_NOTIFICATION_ENGINE_LIMITS.maxEvidenceEntries) {
    issues.push(issue("limit_exceeded", "supportingEvidence exceeds limit.", "supportingEvidence"));
  }
  issues.push(...validateNotificationTrigger(profile.trigger).issues);
  issues.push(...validateNotificationEligibility(profile.eligibility).issues);
  for (const entry of profile.supportingEvidence) {
    issues.push(...validateNotificationEvidence(entry).issues);
  }
  issues.push(...validateExecutiveNotificationProvenance(profile.provenance).issues);
  return result(issues);
}

export function validateExecutiveNotification(notification: ExecutiveNotification): NotificationValidationResult {
  const issues: NotificationValidationIssue[] = [];
  for (const field of EXECUTIVE_INBOX_NOTIFICATION_MANDATORY_NOTIFICATION_FIELDS) {
    if (!(field in notification) || notification[field as keyof ExecutiveNotification] === undefined) {
      issues.push(issue("missing_field", `${field} is required.`, field));
    }
  }
  if (notification.version !== EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "version mismatch.", "version"));
  }
  if (notification.engineVersion !== EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "engineVersion mismatch.", "engineVersion"));
  }
  if (notification.readOnly !== true) {
    issues.push(issue("invalid_notification", "Notification must be read-only.", "readOnly"));
  }
  if (!isNotificationTriggerType(notification.triggerType)) {
    issues.push(issue("invalid_trigger", "triggerType is invalid.", "triggerType"));
  }
  issues.push(...validateExecutiveNotificationProfile(notification.profile).issues);
  issues.push(...validateExecutiveNotificationProvenance(notification.provenance).issues);
  return result(issues);
}

export function validateExecutiveNotifications(
  notifications: readonly ExecutiveNotification[]
): NotificationValidationResult {
  const issues: NotificationValidationIssue[] = [];
  if (hasDuplicateIds(notifications.map((entry) => entry.notificationId))) {
    issues.push(issue("duplicate_notifications", "Notifications contain duplicate IDs.", "notifications"));
  }
  for (const notification of notifications) {
    issues.push(...validateExecutiveNotification(notification).issues);
  }
  return result(issues);
}

export function validateExecutiveInboxNotificationRequest(
  request: ExecutiveInboxNotificationRequest
): NotificationValidationResult {
  const issues: NotificationValidationIssue[] = [];
  if (!request.workspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  if (!request.sessionId.trim()) {
    issues.push(issue("missing_field", "sessionId is required.", "sessionId"));
  }
  if (request.entries.length === 0) {
    issues.push(issue("missing_field", "entries must not be empty.", "entries"));
  }
  if (request.entries.length > EXECUTIVE_INBOX_NOTIFICATION_ENGINE_LIMITS.maxNotificationEntries) {
    issues.push(issue("limit_exceeded", "entries exceeds limit.", "entries"));
  }
  if (hasDuplicateIds(request.entries.map((entry) => entry.priority.priorityId))) {
    issues.push(issue("duplicate_entries", "entries contain duplicate priorityIds.", "entries"));
  }
  for (const entry of request.entries) {
    issues.push(...validateExecutiveInboxItem(entry.item).issues);
    issues.push(...validateExecutivePriority(entry.priority).issues);
    if (entry.item.itemId !== entry.priority.itemId) {
      issues.push(issue("item_mismatch", "Item and priority itemId mismatch.", "itemId"));
    }
    if (entry.item.workspaceId !== request.workspaceId) {
      issues.push(issue("workspace_mismatch", "Workspace mismatch for entry.", "workspaceId"));
    }
    if (entry.item.provenance.aggregationVersion !== EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION) {
      issues.push(issue("invalid_dependency", "Item aggregation version incompatible.", "aggregationVersion"));
    }
    if (entry.priority.version !== EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION) {
      issues.push(issue("invalid_dependency", "Priority version incompatible.", "prioritizationVersion"));
    }
  }
  return result(issues);
}

export function validateNotificationDependencies(): NotificationValidationResult {
  const issues: NotificationValidationIssue[] = [];
  if (!isExecutiveInboxPlatformInitialized()) {
    issues.push(issue("foundation_incompatible", "APP-11:1 foundation is not initialized.", "foundation"));
  }
  if (!isExecutiveInboxAggregationInitialized()) {
    issues.push(issue("aggregation_incompatible", "APP-11:2 aggregation engine is not initialized.", "aggregation"));
  }
  if (!isExecutiveInboxPrioritizationInitialized()) {
    issues.push(
      issue("prioritization_incompatible", "APP-11:3 prioritization engine is not initialized.", "prioritization")
    );
  }
  return result(issues);
}
