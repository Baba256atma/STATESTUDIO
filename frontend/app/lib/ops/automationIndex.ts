export {
  AutomationActionContract,
  AutomationConditionContract,
  AutomationContracts,
  AutomationEventContract,
  AutomationRuleContract,
  AutomationTriggerContract,
} from "./automationContracts.ts";

export {
  ExecutiveAutomationFoundation,
  getExecutiveAutomationFoundation,
  getExecutiveAutomationMetadata,
} from "./automationFoundation.ts";

export {
  AutomationCompatibilityVersion,
  AutomationMetadataCatalog,
  AutomationReleaseMetadata,
  SupportedAutomationActionCategories,
  SupportedAutomationEventCategories,
  SupportedAutomationTriggerCategories,
} from "./automationMetadata.ts";

export { AutomationRegistry } from "./automationRegistry.ts";

export {
  AutomationExecutionStatuses,
  AutomationRulePriorities,
  AutomationRuleStatuses,
  AutomationTypes,
} from "./automationTypes.ts";

export type {
  AutomationAction,
  AutomationActionId,
  AutomationCondition,
  AutomationConditionId,
  AutomationEvent,
  AutomationExecutionDescriptor,
  AutomationExecutionStatus,
  AutomationFoundationDescriptor,
  AutomationId,
  AutomationMetadata,
  AutomationPlatformDescriptor,
  AutomationPolicyId,
  AutomationRule,
  AutomationRuleId,
  AutomationStatistics,
  AutomationSummary,
  AutomationTrigger,
  AutomationTriggerId,
} from "./automationTypes.ts";
