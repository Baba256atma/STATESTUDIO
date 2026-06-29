/**
 * APP-11:4 — Executive Inbox Notification Engine domain types.
 */

import type {
  EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_NOTIFICATION_PIPELINE_STAGES,
  EXECUTIVE_INBOX_NOTIFICATION_CATEGORY_KEYS,
  EXECUTIVE_INBOX_NOTIFICATION_TRIGGER_KEYS,
} from "./executiveInboxNotificationEngineConstants.ts";
import type { ExecutiveInboxItem, InboxItemId, InboxWorkspaceId } from "./executiveInboxAggregationEngineTypes.ts";
import type { ExecutiveInboxPriority, PriorityId } from "./executiveInboxPrioritizationEngineTypes.ts";

export type NotificationId = string;
export type NotificationTriggerType = (typeof EXECUTIVE_INBOX_NOTIFICATION_TRIGGER_KEYS)[number];
export type NotificationCategory = (typeof EXECUTIVE_INBOX_NOTIFICATION_CATEGORY_KEYS)[number];
export type NotificationPipelineStage = (typeof EXECUTIVE_INBOX_NOTIFICATION_PIPELINE_STAGES)[number];

export type NotificationEvidence = Readonly<{
  evidenceId: string;
  signal: string;
  rationale: string;
  dimensionKey?: string;
  readOnly: true;
}>;

export type NotificationTrigger = Readonly<{
  triggerType: NotificationTriggerType;
  label: string;
  reason: string;
  readOnly: true;
}>;

export type NotificationEligibility = Readonly<{
  eligible: boolean;
  reason: string;
  evaluatedRules: readonly string[];
  readOnly: true;
}>;

export type ExecutiveNotificationProvenance = Readonly<{
  itemId: InboxItemId;
  priorityId: PriorityId;
  originatingPlatform: string;
  workspaceId: InboxWorkspaceId;
  aggregationVersion: string;
  prioritizationVersion: string;
  engineVersion: typeof EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION;
  foundationVersion: "APP-11/1";
  readOnly: true;
}>;

export type ExecutiveNotificationProfile = Readonly<{
  profileId: string;
  notificationId: NotificationId;
  itemId: InboxItemId;
  priorityId: PriorityId;
  workspaceId: InboxWorkspaceId;
  trigger: NotificationTrigger;
  notificationCategory: NotificationCategory;
  executiveSummary: string;
  supportingEvidence: readonly NotificationEvidence[];
  eligibility: NotificationEligibility;
  provenance: ExecutiveNotificationProvenance;
  generationTimestamp: string;
  engineVersion: typeof EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION;
  version: typeof EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION;
  readOnly: true;
}>;

export type ExecutiveNotification = Readonly<{
  notificationId: NotificationId;
  itemId: InboxItemId;
  priorityId: PriorityId;
  workspaceId: InboxWorkspaceId;
  triggerType: NotificationTriggerType;
  notificationCategory: NotificationCategory;
  executiveSummary: string;
  supportingEvidence: readonly NotificationEvidence[];
  profile: ExecutiveNotificationProfile;
  eligibility: NotificationEligibility;
  provenance: ExecutiveNotificationProvenance;
  generationTimestamp: string;
  engineVersion: typeof EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION;
  version: typeof EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION;
  readOnly: true;
}>;

export type NotificationValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type NotificationValidationResult = Readonly<{
  valid: boolean;
  issues: readonly NotificationValidationIssue[];
  readOnly: true;
}>;

export type NotificationGenerationResult = Readonly<{
  success: boolean;
  reason: string;
  workspaceId: InboxWorkspaceId;
  sessionId: string;
  notifications: readonly ExecutiveNotification[];
  registeredNotificationIds: readonly NotificationId[];
  skippedEntries: number;
  ineligibleEntries: number;
  pipelineStages: readonly NotificationPipelineStage[];
  generationTimestamp: string;
  readOnly: true;
}>;

export type NotificationRegistrySnapshot = Readonly<{
  registryVersion: typeof EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION;
  notificationCount: number;
  notificationIds: readonly NotificationId[];
  readOnly: true;
}>;

export type NotificationEngineError = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type NotificationEngineResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  error: NotificationEngineError | null;
  readOnly: true;
}>;

export type PrioritizedInboxNotificationInput = Readonly<{
  priority: ExecutiveInboxPriority;
  item: ExecutiveInboxItem;
}>;

export type ExecutiveInboxNotificationRequest = Readonly<{
  workspaceId: InboxWorkspaceId;
  sessionId: string;
  entries: readonly PrioritizedInboxNotificationInput[];
  generationTimestamp?: string;
}>;

export type ExecutiveInboxNotificationEngineState = Readonly<{
  engineId: "executive-inbox-notification-engine";
  contractVersion: typeof EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION;
  initialized: boolean;
  registeredNotificationCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type ExecutiveInboxNotificationCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ExecutiveInboxNotificationCertificationResult = Readonly<{
  certified: boolean;
  phase: "APP-11/4";
  contractVersion: typeof EXECUTIVE_INBOX_NOTIFICATION_ENGINE_CONTRACT_VERSION;
  checks: readonly ExecutiveInboxNotificationCertificationCheck[];
  checkCount: number;
  passedCount: number;
  failedCount: number;
  timestamp: string;
  readOnly: true;
}>;

export function notificationEngineErrorFromCode(
  code: string,
  message: string,
  field?: string
): NotificationEngineError {
  return Object.freeze({ code, message, field, readOnly: true as const });
}
