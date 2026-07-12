import { AutomationCompatibilityVersion } from "./automationIndex.ts";
import type {
  AutomationModelDescriptor,
  AutomationModelSummary as AutomationModelSummaryDescriptor,
} from "./automationModelTypes.ts";
import { AutomationActionModel } from "./automationActionModel.ts";
import { AutomationConditionModel } from "./automationConditionModel.ts";
import { AutomationEventModel } from "./automationEventModel.ts";
import { AutomationExecutionModel } from "./automationExecutionModel.ts";
import { AutomationPolicyModel } from "./automationPolicyModel.ts";
import { AutomationRuleModel } from "./automationRuleModel.ts";
import { AutomationTriggerModel } from "./automationTriggerModel.ts";

export const AutomationModelMetadata = Object.freeze({
  modelId: "ops-8-3-executive-automation-model",
  modelVersion: "1.0.0",
  supportedEventModelVersion: "1.0.0",
  supportedTriggerModelVersion: "1.0.0",
  supportedConditionModelVersion: "1.0.0",
  supportedActionModelVersion: "1.0.0",
  supportedRuleModelVersion: "1.0.0",
  supportedPolicyModelVersion: "1.0.0",
  supportedExecutionModelVersion: "1.0.0",
  compatibilityVersion: AutomationCompatibilityVersion,
  deterministicStatus: "Deterministic",
  readonlyStatus: "Readonly",
  metadataOnlyStatus: "MetadataOnly",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies AutomationModelDescriptor);

export const AutomationModelSummary = Object.freeze({
  eventModelCount: AutomationEventModel.length,
  triggerModelCount: AutomationTriggerModel.length,
  conditionModelCount: AutomationConditionModel.length,
  actionModelCount: AutomationActionModel.length,
  ruleModelCount: AutomationRuleModel.length,
  policyModelCount: AutomationPolicyModel.length,
  executionModelCount: AutomationExecutionModel.length,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies AutomationModelSummaryDescriptor);
