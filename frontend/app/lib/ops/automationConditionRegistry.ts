import {
  AutomationConditionContract,
} from "./automationIndex.ts";
import type { AutomationConditionDescriptor } from "./automationRegistryTypes.ts";

const createConditionDescriptor = (
  id: string,
  category: AutomationConditionDescriptor["category"],
  description: string,
) =>
  Object.freeze({
    id,
    category,
    description,
    metadata: AutomationConditionContract.metadata,
  } as const satisfies AutomationConditionDescriptor);

export const AutomationConditionRegistry = Object.freeze([
  createConditionDescriptor("automation-condition-status", "Status", "Metadata-only status condition catalog entry."),
  createConditionDescriptor("automation-condition-threshold", "Threshold", "Metadata-only threshold condition catalog entry."),
  createConditionDescriptor("automation-condition-dependency", "Dependency", "Metadata-only dependency condition catalog entry."),
  createConditionDescriptor("automation-condition-resource", "Resource", "Metadata-only resource condition catalog entry."),
  createConditionDescriptor("automation-condition-time", "Time", "Metadata-only time condition catalog entry."),
  createConditionDescriptor("automation-condition-kpi", "KPI", "Metadata-only KPI condition catalog entry."),
  createConditionDescriptor("automation-condition-business-rule", "Business Rule", "Metadata-only business-rule condition catalog entry."),
] as const);
