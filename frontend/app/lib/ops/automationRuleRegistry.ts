import {
  AutomationRuleContract,
} from "./automationIndex.ts";
import type { AutomationRuleDescriptor } from "./automationRegistryTypes.ts";

const createRuleDescriptor = (
  id: string,
  category: AutomationRuleDescriptor["category"],
  description: string,
) =>
  Object.freeze({
    id,
    category,
    description,
    metadata: AutomationRuleContract.metadata,
  } as const satisfies AutomationRuleDescriptor);

export const AutomationRuleRegistry = Object.freeze([
  createRuleDescriptor("automation-rule-event", "Event Rules", "Metadata-only event rule catalog entry."),
  createRuleDescriptor("automation-rule-time", "Time Rules", "Metadata-only time rule catalog entry."),
  createRuleDescriptor("automation-rule-dependency", "Dependency Rules", "Metadata-only dependency rule catalog entry."),
  createRuleDescriptor("automation-rule-approval", "Approval Rules", "Metadata-only approval rule catalog entry."),
  createRuleDescriptor("automation-rule-escalation", "Escalation Rules", "Metadata-only escalation rule catalog entry."),
  createRuleDescriptor("automation-rule-notification", "Notification Rules", "Metadata-only notification rule catalog entry."),
] as const);
