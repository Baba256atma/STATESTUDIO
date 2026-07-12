import type { AutomationMetadata } from "./automationIndex.ts";

export type AutomationEventCategory =
  | "Task"
  | "Workflow"
  | "Project"
  | "Resource"
  | "Schedule"
  | "Dependency"
  | "Business"
  | "User"
  | "System";

export interface AutomationEventDescriptor {
  readonly id: string;
  readonly category: AutomationEventCategory;
  readonly name: string;
  readonly description: string;
  readonly metadata: AutomationMetadata;
}

export type AutomationTriggerCategory =
  | "Event Trigger"
  | "Schedule Trigger"
  | "Manual Trigger"
  | "System Trigger"
  | "Dependency Trigger"
  | "Resource Trigger";

export interface AutomationTriggerDescriptor {
  readonly id: string;
  readonly type: AutomationTriggerCategory;
  readonly description: string;
  readonly metadata: AutomationMetadata;
}

export type AutomationConditionCategory =
  | "Status"
  | "Threshold"
  | "Dependency"
  | "Resource"
  | "Time"
  | "KPI"
  | "Business Rule";

export interface AutomationConditionDescriptor {
  readonly id: string;
  readonly category: AutomationConditionCategory;
  readonly description: string;
  readonly metadata: AutomationMetadata;
}

export type AutomationActionCategory =
  | "Create Task"
  | "Update Task"
  | "Notify User"
  | "Assign Resource"
  | "Create Workflow"
  | "Start Project"
  | "Update Schedule"
  | "Generate Report"
  | "Call Integration";

export interface AutomationActionDescriptor {
  readonly id: string;
  readonly category: AutomationActionCategory;
  readonly description: string;
  readonly metadata: AutomationMetadata;
}

export type AutomationRuleCategory =
  | "Event Rules"
  | "Time Rules"
  | "Dependency Rules"
  | "Approval Rules"
  | "Escalation Rules"
  | "Notification Rules";

export interface AutomationRuleDescriptor {
  readonly id: string;
  readonly category: AutomationRuleCategory;
  readonly description: string;
  readonly metadata: AutomationMetadata;
}

export type AutomationPolicyCategory =
  | "Retry Policy"
  | "Failure Policy"
  | "Approval Policy"
  | "Security Policy"
  | "Execution Policy";

export interface AutomationPolicyDescriptor {
  readonly id: string;
  readonly category: AutomationPolicyCategory;
  readonly description: string;
  readonly metadata: AutomationMetadata;
}

export type AutomationLifecycleStage =
  | "Draft"
  | "Proposed"
  | "Active"
  | "Disabled"
  | "Deprecated"
  | "Archived";

export interface AutomationLifecycleDescriptor {
  readonly id: string;
  readonly description: string;
  readonly metadata: AutomationMetadata;
}

export interface AutomationPlatformRegistryDescriptor {
  readonly registryId: string;
  readonly registryName: string;
  readonly registryVersion: string;
  readonly compatibilityVersion: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface AutomationRegistrySummary {
  readonly supportedEventCount: number;
  readonly supportedTriggerCount: number;
  readonly supportedConditionCount: number;
  readonly supportedActionCount: number;
  readonly supportedRuleCount: number;
  readonly supportedPolicyCount: number;
  readonly supportedLifecycleCount: number;
  readonly compatibilityVersion: string;
  readonly deterministicStatus: "Deterministic";
  readonly readonlyStatus: "Readonly";
  readonly metadataOnlyStatus: "MetadataOnly";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
