import { AutomationActionModel } from "./automationActionModel.ts";
import { AutomationConditionModel } from "./automationConditionModel.ts";
import { AutomationEventModel } from "./automationEventModel.ts";
import {
  AutomationExecutionModel,
  AutomationExecutionModelSummary,
} from "./automationExecutionModel.ts";
import {
  AutomationModelMetadata,
  AutomationModelSummary,
} from "./automationModelMetadata.ts";
import { AutomationPolicyModel } from "./automationPolicyModel.ts";
import { AutomationRuleModel } from "./automationRuleModel.ts";
import { AutomationTriggerModel } from "./automationTriggerModel.ts";

export const ExecutiveAutomationModel = Object.freeze({
  events: AutomationEventModel,
  triggers: AutomationTriggerModel,
  conditions: AutomationConditionModel,
  actions: AutomationActionModel,
  rules: AutomationRuleModel,
  policies: AutomationPolicyModel,
  executions: AutomationExecutionModel,
  executionSummary: AutomationExecutionModelSummary,
  metadata: AutomationModelMetadata,
  summary: AutomationModelSummary,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const getExecutiveAutomationModel = () => ExecutiveAutomationModel;
export const getAutomationRuleModel = () => AutomationRuleModel;
export const getAutomationExecutionModel = () => AutomationExecutionModel;
