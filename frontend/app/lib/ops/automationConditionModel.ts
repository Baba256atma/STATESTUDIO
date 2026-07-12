import { getAutomationConditionRegistry } from "./automationRegistryIndex.ts";
import type { AutomationConditionModelDescriptor } from "./automationModelTypes.ts";

export const AutomationConditionModel = Object.freeze(
  getAutomationConditionRegistry().map((entry) =>
    Object.freeze({
      id: entry.id,
      conditionCategory: entry.category,
      description: entry.description,
      metadata: entry.metadata,
    } as const satisfies AutomationConditionModelDescriptor),
  ),
);
