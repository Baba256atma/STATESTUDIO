export {
  buildAutomationValidationManifest,
} from "./automationValidationManifest.ts";

export {
  AutomationValidationRegistry,
} from "./automationValidationRegistry.ts";

export {
  AutomationValidationGroups,
  AutomationValidationRuleCatalog,
} from "./automationValidationRules.ts";

export {
  getAutomationValidationSummary,
  validateAutomationFoundation,
  validateAutomationModel,
  validateAutomationPlatform,
  validateAutomationRegistry,
  validateExecutiveAutomationPlatform,
} from "./automationValidation.ts";

export type {
  AutomationValidationDescriptor,
  AutomationValidationGroup,
  AutomationValidationManifest,
  AutomationValidationResult,
  AutomationValidationRule,
  AutomationValidationStatus,
  AutomationValidationSummary,
} from "./automationValidationTypes.ts";
