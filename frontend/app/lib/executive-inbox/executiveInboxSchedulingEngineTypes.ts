/**
 * APP-11:6 — Executive Inbox Scheduling Engine domain types.
 */

import type {
  EXECUTIVE_INBOX_SCHEDULE_TRIGGER_KEYS,
  EXECUTIVE_INBOX_SCHEDULE_WINDOW_KEYS,
  EXECUTIVE_INBOX_SCHEDULING_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_SCHEDULING_PIPELINE_STAGES,
} from "./executiveInboxSchedulingEngineConstants.ts";
import type { ExecutiveInboxItem, InboxItemId, InboxWorkspaceId } from "./executiveInboxAggregationEngineTypes.ts";
import type { ExecutiveNotification, NotificationId } from "./executiveInboxNotificationEngineTypes.ts";
import type { ExecutiveInboxPriority, PriorityId } from "./executiveInboxPrioritizationEngineTypes.ts";
import type { ExecutiveReminder, ReminderId } from "./executiveInboxReminderEngineTypes.ts";

export type ScheduleId = string;
export type ScheduleTriggerType = (typeof EXECUTIVE_INBOX_SCHEDULE_TRIGGER_KEYS)[number];
export type ScheduleWindowKey = (typeof EXECUTIVE_INBOX_SCHEDULE_WINDOW_KEYS)[number];
export type SchedulingPipelineStage = (typeof EXECUTIVE_INBOX_SCHEDULING_PIPELINE_STAGES)[number];

export type ScheduleEvidence = Readonly<{
  evidenceId: string;
  signal: string;
  rationale: string;
  readOnly: true;
}>;

export type ScheduleTrigger = Readonly<{
  triggerType: ScheduleTriggerType;
  label: string;
  reason: string;
  readOnly: true;
}>;

export type ScheduleWindow = Readonly<{
  windowKey: ScheduleWindowKey;
  label: string;
  description: string;
  metadataOnly: true;
  customLabel?: string;
  metadataDate?: string;
  readOnly: true;
}>;

export type ScheduleEligibility = Readonly<{
  eligible: boolean;
  reason: string;
  evaluatedRules: readonly string[];
  readOnly: true;
}>;

export type ExecutiveScheduleProvenance = Readonly<{
  reminderId: ReminderId;
  notificationId: NotificationId;
  itemId: InboxItemId;
  priorityId: PriorityId;
  originatingPlatform: string;
  workspaceId: InboxWorkspaceId;
  aggregationVersion: string;
  prioritizationVersion: string;
  notificationVersion: string;
  reminderVersion: string;
  engineVersion: typeof EXECUTIVE_INBOX_SCHEDULING_ENGINE_CONTRACT_VERSION;
  foundationVersion: "APP-11/1";
  readOnly: true;
}>;

export type ExecutiveScheduleProfile = Readonly<{
  profileId: string;
  scheduleId: ScheduleId;
  reminderId: ReminderId;
  notificationId: NotificationId;
  itemId: InboxItemId;
  priorityId: PriorityId;
  workspaceId: InboxWorkspaceId;
  scheduleTrigger: ScheduleTrigger;
  scheduleWindow: ScheduleWindow;
  executiveSummary: string;
  supportingEvidence: readonly ScheduleEvidence[];
  eligibility: ScheduleEligibility;
  provenance: ExecutiveScheduleProvenance;
  generationTimestamp: string;
  engineVersion: typeof EXECUTIVE_INBOX_SCHEDULING_ENGINE_CONTRACT_VERSION;
  version: typeof EXECUTIVE_INBOX_SCHEDULING_ENGINE_CONTRACT_VERSION;
  readOnly: true;
}>;

export type ExecutiveScheduleIntent = Readonly<{
  scheduleId: ScheduleId;
  reminderId: ReminderId;
  notificationId: NotificationId;
  itemId: InboxItemId;
  priorityId: PriorityId;
  workspaceId: InboxWorkspaceId;
  scheduleTrigger: ScheduleTrigger;
  scheduleWindow: ScheduleWindow;
  executiveSummary: string;
  supportingEvidence: readonly ScheduleEvidence[];
  profile: ExecutiveScheduleProfile;
  eligibility: ScheduleEligibility;
  provenance: ExecutiveScheduleProvenance;
  generationTimestamp: string;
  engineVersion: typeof EXECUTIVE_INBOX_SCHEDULING_ENGINE_CONTRACT_VERSION;
  version: typeof EXECUTIVE_INBOX_SCHEDULING_ENGINE_CONTRACT_VERSION;
  readOnly: true;
}>;

export type ScheduleValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ScheduleValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ScheduleValidationIssue[];
  readOnly: true;
}>;

export type ScheduleGenerationResult = Readonly<{
  success: boolean;
  reason: string;
  workspaceId: InboxWorkspaceId;
  sessionId: string;
  scheduleIntents: readonly ExecutiveScheduleIntent[];
  registeredScheduleIds: readonly ScheduleId[];
  skippedEntries: number;
  ineligibleEntries: number;
  pipelineStages: readonly SchedulingPipelineStage[];
  generationTimestamp: string;
  readOnly: true;
}>;

export type ScheduleRegistrySnapshot = Readonly<{
  registryVersion: typeof EXECUTIVE_INBOX_SCHEDULING_ENGINE_CONTRACT_VERSION;
  scheduleCount: number;
  scheduleIds: readonly ScheduleId[];
  readOnly: true;
}>;

export type SchedulingEngineError = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type SchedulingEngineResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  error: SchedulingEngineError | null;
  readOnly: true;
}>;

export type ReminderScheduleInput = Readonly<{
  reminder: ExecutiveReminder;
  notification: ExecutiveNotification;
  priority: ExecutiveInboxPriority;
  item: ExecutiveInboxItem;
  windowOverride?: ScheduleWindowKey;
  customWindowLabel?: string;
  metadataDate?: string;
}>;

export type ExecutiveInboxSchedulingRequest = Readonly<{
  workspaceId: InboxWorkspaceId;
  sessionId: string;
  entries: readonly ReminderScheduleInput[];
  generationTimestamp?: string;
}>;

export type ExecutiveInboxSchedulingEngineState = Readonly<{
  engineId: "executive-inbox-scheduling-engine";
  contractVersion: typeof EXECUTIVE_INBOX_SCHEDULING_ENGINE_CONTRACT_VERSION;
  initialized: boolean;
  registeredScheduleCount: number;
  timestamp: string;
  readOnly: true;
}>;

export type ExecutiveInboxSchedulingCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ExecutiveInboxSchedulingCertificationResult = Readonly<{
  certified: boolean;
  phase: "APP-11/6";
  contractVersion: typeof EXECUTIVE_INBOX_SCHEDULING_ENGINE_CONTRACT_VERSION;
  checks: readonly ExecutiveInboxSchedulingCertificationCheck[];
  checkCount: number;
  passedCount: number;
  failedCount: number;
  timestamp: string;
  readOnly: true;
}>;

export function schedulingEngineErrorFromCode(
  code: string,
  message: string,
  field?: string
): SchedulingEngineError {
  return Object.freeze({ code, message, field, readOnly: true as const });
}
