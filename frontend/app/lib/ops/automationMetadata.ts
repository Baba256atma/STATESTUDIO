import { AutomationExecutionStatuses } from "./automationTypes.ts";

export const SupportedAutomationEventCategories = Object.freeze([
  "Task",
  "Workflow",
  "Project",
  "Resource",
  "Schedule",
  "Dependency",
  "Business",
  "User",
  "System",
] as const);

export const SupportedAutomationTriggerCategories = Object.freeze([
  "StateChange",
  "Threshold",
  "Lifecycle",
  "DependencyUpdate",
  "PolicyWindow",
  "ManualInvocation",
] as const);

export const SupportedAutomationActionCategories = Object.freeze([
  "NotificationReference",
  "WorkflowReference",
  "TaskReference",
  "EscalationReference",
  "ApprovalReference",
  "AuditReference",
] as const);

export const AutomationCompatibilityVersion = "1.0.0" as const;

export const AutomationReleaseMetadata = Object.freeze({
  releaseStage: "Draft",
  releaseStatus: "Defined",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const AutomationMetadataCatalog = Object.freeze({
  supportedEventCategories: SupportedAutomationEventCategories,
  supportedTriggerCategories: SupportedAutomationTriggerCategories,
  supportedActionCategories: SupportedAutomationActionCategories,
  supportedExecutionStatuses: AutomationExecutionStatuses,
  compatibilityVersion: AutomationCompatibilityVersion,
  releaseMetadata: AutomationReleaseMetadata,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
