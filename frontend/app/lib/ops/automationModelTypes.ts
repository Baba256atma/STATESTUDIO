import type {
  AutomationActionCategory,
  AutomationConditionCategory,
  AutomationEventCategory,
  AutomationLifecycleStage,
  AutomationPolicyCategory,
  AutomationRuleCategory,
  AutomationTriggerCategory,
} from "./automationRegistryIndex.ts";
import type { AutomationMetadata } from "./automationIndex.ts";

export interface AutomationEventModelDescriptor {
  readonly id: string;
  readonly category: AutomationEventCategory;
  readonly source: string;
  readonly name: string;
  readonly description: string;
  readonly metadata: AutomationMetadata;
}

export interface AutomationTriggerModelDescriptor {
  readonly id: string;
  readonly triggerType: AutomationTriggerCategory;
  readonly supportedEventCategories: readonly AutomationEventCategory[];
  readonly metadata: AutomationMetadata;
}

export interface AutomationConditionModelDescriptor {
  readonly id: string;
  readonly conditionCategory: AutomationConditionCategory;
  readonly description: string;
  readonly metadata: AutomationMetadata;
}

export interface AutomationActionModelDescriptor {
  readonly id: string;
  readonly actionCategory: AutomationActionCategory;
  readonly description: string;
  readonly metadata: AutomationMetadata;
}

export interface AutomationRuleModelDescriptor {
  readonly id: string;
  readonly ruleCategory: AutomationRuleCategory;
  readonly triggerReference: string;
  readonly conditionReferences: readonly string[];
  readonly actionReferences: readonly string[];
  readonly policyReference: string;
  readonly priority: "Low" | "Normal" | "High" | "Critical";
  readonly lifecycle: AutomationLifecycleStage;
  readonly metadata: AutomationMetadata;
}

export interface AutomationPolicyModelDescriptor {
  readonly id: string;
  readonly policyCategory: AutomationPolicyCategory;
  readonly description: string;
  readonly metadata: AutomationMetadata;
}

export interface AutomationExecutionModelDescriptor {
  readonly id: string;
  readonly executionIdentity: string;
  readonly executionMetadata: AutomationMetadata;
  readonly executionLifecycle: AutomationLifecycleStage;
  readonly policyReference: string;
}

export interface AutomationExecutionSummary {
  readonly totalExecutionDescriptors: number;
  readonly supportedLifecycleStages: readonly AutomationLifecycleStage[];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface AutomationModelDescriptor {
  readonly modelId: string;
  readonly modelVersion: string;
  readonly supportedEventModelVersion: string;
  readonly supportedTriggerModelVersion: string;
  readonly supportedConditionModelVersion: string;
  readonly supportedActionModelVersion: string;
  readonly supportedRuleModelVersion: string;
  readonly supportedPolicyModelVersion: string;
  readonly supportedExecutionModelVersion: string;
  readonly compatibilityVersion: string;
  readonly deterministicStatus: "Deterministic";
  readonly readonlyStatus: "Readonly";
  readonly metadataOnlyStatus: "MetadataOnly";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface AutomationModelSummary {
  readonly eventModelCount: number;
  readonly triggerModelCount: number;
  readonly conditionModelCount: number;
  readonly actionModelCount: number;
  readonly ruleModelCount: number;
  readonly policyModelCount: number;
  readonly executionModelCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
