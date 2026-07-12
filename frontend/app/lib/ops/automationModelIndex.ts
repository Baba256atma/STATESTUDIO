export { AutomationActionModel } from "./automationActionModel.ts";
export { AutomationConditionModel } from "./automationConditionModel.ts";
export { AutomationEventModel } from "./automationEventModel.ts";
export {
  AutomationExecutionModel,
  AutomationExecutionModelSummary,
} from "./automationExecutionModel.ts";
export {
  ExecutiveAutomationModel,
  getAutomationExecutionModel,
  getAutomationRuleModel,
  getExecutiveAutomationModel,
} from "./automationModel.ts";
export {
  AutomationModelMetadata,
  AutomationModelSummary,
} from "./automationModelMetadata.ts";
export { AutomationPolicyModel } from "./automationPolicyModel.ts";
export { AutomationRuleModel } from "./automationRuleModel.ts";
export { AutomationTriggerModel } from "./automationTriggerModel.ts";

export type {
  AutomationActionModelDescriptor,
  AutomationConditionModelDescriptor,
  AutomationEventModelDescriptor,
  AutomationExecutionModelDescriptor,
  AutomationExecutionSummary,
  AutomationModelDescriptor,
  AutomationModelSummary as AutomationModelSummaryShape,
  AutomationPolicyModelDescriptor,
  AutomationRuleModelDescriptor,
  AutomationTriggerModelDescriptor,
} from "./automationModelTypes.ts";
