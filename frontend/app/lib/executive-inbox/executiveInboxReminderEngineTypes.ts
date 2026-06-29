/**
 * APP-11:5 — Executive Inbox Reminder Engine domain types.
 */

import type {
  EXECUTIVE_INBOX_REMINDER_CADENCE_KEYS,
  EXECUTIVE_INBOX_REMINDER_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_REMINDER_PIPELINE_STAGES,
  EXECUTIVE_INBOX_REMINDER_TRIGGER_KEYS,
} from "./executiveInboxReminderEngineConstants.ts";
import type { ExecutiveInboxItem, InboxItemId, InboxWorkspaceId } from "./executiveInboxAggregationEngineTypes.ts";
import type { ExecutiveNotification, NotificationId } from "./executiveInboxNotificationEngineTypes.ts";
import type { ExecutiveInboxPriority, PriorityId } from "./executiveInboxPrioritizationEngineTypes.ts";

export type ReminderId = string;
export type ReminderTriggerType = (typeof EXECUTIVE_INBOX_REMINDER_TRIGGER_KEYS)[number];
export type ReminderCadenceKey = (typeof EXECUTIVE_INBOX_REMINDER_CADENCE_KEYS)[number];
export type ReminderPipelineStage = (typeof EXECUTIVE_INBOX_REMINDER_PIPELINE_STAGES)[number];

export type ReminderEvidence = Readonly<{
  evidenceId: string;
  signal: string;
  rationale: string;
  readOnly: true;
}>;

export type ReminderTrigger = Readonly<{
  triggerType: ReminderTriggerType;
  label: string;
  reason: string;
  readOnly: true;
}>;

export type ReminderCadence = Readonly<{
  cadenceKey: ReminderCadenceKey;
  label: string;
  description: string;
  metadataOnly: true;
  customLabel?: string;
  readOnly: true;
}>;

export type ReminderEligibility = Readonly<{
  eligible: boolean;
  reason: string;
  evaluatedRules: readonly string[];
  readOnly: true;
}>;

export type ExecutiveReminderProvenance = Readonly<{
  notificationId: NotificationId;
  itemId: InboxItemId;
  priorityId: PriorityId;
  originatingPlatform: string;
  workspaceId: InboxWorkspaceId;
  aggregationVersion: string;
  prioritizationVersion: string;
  notificationVersion: string;
  engineVersion: typeof EXECUTIVE_INBOX_REMINDER_ENGINE_CONTRACT_VERSION;
  foundationVersion: "APP-11/1";
  readOnly: true;
}>;

export type ExecutiveReminderProfile = Readonly<{
  profileId: string;
  reminderId: ReminderId;
  notificationId: NotificationId;
  itemId: InboxItemId;
  priorityId: PriorityId;
  workspaceId: InboxWorkspaceId;
  reminderTrigger: ReminderTrigger;
  cadence: ReminderCadence;
  executiveSummary: string;
  supportingEvidence: readonly ReminderEvidence[];
  eligibility: ReminderEligibility;
  provenance: ExecutiveReminderProvenance;
  generationTimestamp: string;
  engineVersion: typeof EXECUTIVE_INBOX_REMINDER_ENGINE_CONTRACT_VERSION;
  version: typeof EXECUTIVE_INBOX_REMINDER_ENGINE_CONTRACT_VERSION;
  readOnly: true;
}>;

export type ExecutiveReminder = Readonly<{
  reminderId: ReminderId;
  notificationId: NotificationId;
  itemId: InboxItemId;
  priorityId: PriorityId;
  workspaceId: InboxWorkspaceId;
  reminderTrigger: ReminderTrigger;
  cadence: ReminderCadence;
  executiveSummary: string;
  supportingEvidence: readonly ReminderEvidence[];
  profile: ExecutiveReminderProfile;
  eligibility: ReminderEligibility;
  provenance: ExecutiveReminderProvenance;
  generationTimestamp: string;
  engineVersion: typeof EXECUTIVE_INBOX_REMINDER_ENGINE_CONTRACT_VERSION;
  version: typeof EXECUTIVE_INBOX_REMINDER_ENGINE_CONTRACT_VERSION;
  readOnly: true;
}>;

export type ReminderValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ReminderValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ReminderValidationIssue[];
  readOnly: true;
}>;

export type ReminderGenerationResult = Readonly<{
  success: boolean;
  reason: string;
  workspaceId: InboxWorkspaceId;
  sessionId: string;
  reminders: readonly ExecutiveReminder[];
  registeredReminderIds: readonly ReminderId[];
  skippedEntries: number;
  ineligibleEntries: number;
  pipelineStages: readonly ReminderPipelineStage[];
  generationTimestamp: string;
  readOnly: true;
}>;

export type ReminderRegistrySnapshot = Readonly<{
  registryVersion: typeof EXECUTIVE_INBOX_REMINDER_ENGINE_CONTRACT_VERSION;
  reminderCount: number;
  reminderIds: readonly ReminderId[];
  readOnly: true;
}>;

export type ReminderEngineError = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ReminderEngineResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  error: ReminderEngineError | null;
  readOnly: true;
}>;

export type NotificationReminderInput = Readonly<{
  notification: ExecutiveNotification;
  priority: ExecutiveInboxPriority;
  item: ExecutiveInboxItem;
  cadenceOverride?: ReminderCadenceKey;
  customCadenceLabel?: string;
}>;

export type ExecutiveInboxReminderRequest = Readonly<{
  workspaceId: InboxWorkspaceId;
  sessionId: string;
  entries: readonly NotificationReminderInput[];
  generationTimestamp?: string;
}>;

export type ExecutiveInboxReminderEngineState = Readonly<{
  engineId: "executive-inbox-reminder-engine";
  contractVersion: typeof EXECUTIVE_INBOX_REMINDER_ENGINE_CONTRACT_VERSION;
  initialized: boolean;
  registeredReminderCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type ExecutiveInboxReminderCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ExecutiveInboxReminderCertificationResult = Readonly<{
  certified: boolean;
  phase: "APP-11/5";
  contractVersion: typeof EXECUTIVE_INBOX_REMINDER_ENGINE_CONTRACT_VERSION;
  checks: readonly ExecutiveInboxReminderCertificationCheck[];
  checkCount: number;
  passedCount: number;
  failedCount: number;
  timestamp: string;
  readOnly: true;
}>;

export function reminderEngineErrorFromCode(
  code: string,
  message: string,
  field?: string
): ReminderEngineError {
  return Object.freeze({ code, message, field, readOnly: true as const });
}
