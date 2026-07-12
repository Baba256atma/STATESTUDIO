export type AutomationId = string;
export type AutomationRuleId = string;
export type AutomationTriggerId = string;
export type AutomationConditionId = string;
export type AutomationActionId = string;
export type AutomationPolicyId = string;

export type AutomationExecutionStatus =
  | "Defined"
  | "Ready"
  | "Paused"
  | "Restricted"
  | "Certified"
  | "Archived";

export interface AutomationMetadata {
  readonly platformId: string;
  readonly platformVersion: string;
  readonly releaseStage: "Draft";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
  readonly tags: readonly string[];
}

export interface AutomationEvent {
  readonly id: AutomationId;
  readonly category: string;
  readonly name: string;
  readonly description: string;
  readonly source: string;
  readonly metadata: AutomationMetadata;
}

export interface AutomationTrigger {
  readonly id: AutomationTriggerId;
  readonly type: string;
  readonly description: string;
  readonly metadata: AutomationMetadata;
}

export interface AutomationCondition {
  readonly id: AutomationConditionId;
  readonly category: string;
  readonly description: string;
  readonly metadata: AutomationMetadata;
}

export interface AutomationAction {
  readonly id: AutomationActionId;
  readonly type: string;
  readonly description: string;
  readonly metadata: AutomationMetadata;
}

export interface AutomationRule {
  readonly id: AutomationRuleId;
  readonly triggerReference: AutomationTriggerId;
  readonly conditionReferences: readonly AutomationConditionId[];
  readonly actionReferences: readonly AutomationActionId[];
  readonly priority: "Low" | "Normal" | "High" | "Critical";
  readonly status: "Draft" | "Certified" | "Frozen";
  readonly metadata: AutomationMetadata;
}

export interface AutomationExecutionDescriptor {
  readonly executionId: string;
  readonly status: AutomationExecutionStatus;
  readonly policyReference: AutomationPolicyId;
  readonly metadata: AutomationMetadata;
}

export interface AutomationSummary {
  readonly totalContracts: number;
  readonly supportedEventCategories: readonly string[];
  readonly supportedExecutionStatuses: readonly AutomationExecutionStatus[];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface AutomationStatistics {
  readonly eventCategoryCount: number;
  readonly triggerCategoryCount: number;
  readonly actionCategoryCount: number;
  readonly executionStatusCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface AutomationPlatformDescriptor {
  readonly platformId: string;
  readonly platformName: string;
  readonly platformNamespace: string;
  readonly platformVersion: string;
  readonly platformDescription: string;
  readonly platformStatus: "Draft";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface AutomationFoundationDescriptor {
  readonly namespace: string;
  readonly contractCount: number;
  readonly metadataCatalogCount: number;
  readonly registryStatus: "Complete";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export const AutomationExecutionStatuses = Object.freeze([
  "Defined",
  "Ready",
  "Paused",
  "Restricted",
  "Certified",
  "Archived",
] as const satisfies readonly AutomationExecutionStatus[]);

export const AutomationRulePriorities = Object.freeze([
  "Low",
  "Normal",
  "High",
  "Critical",
] as const);

export const AutomationRuleStatuses = Object.freeze([
  "Draft",
  "Certified",
  "Frozen",
] as const);

export const AutomationTypes = Object.freeze({
  executionStatuses: AutomationExecutionStatuses,
  rulePriorities: AutomationRulePriorities,
  ruleStatuses: AutomationRuleStatuses,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
