import { getAutomationActionRegistry } from "./automationRegistryIndex.ts";
import type { AutomationActionModelDescriptor } from "./automationModelTypes.ts";

export const AutomationActionModel = Object.freeze(
  getAutomationActionRegistry().map((entry) =>
    Object.freeze({
      id: entry.id,
      actionCategory: entry.category,
      description: entry.description,
      metadata: entry.metadata,
    } as const satisfies AutomationActionModelDescriptor),
  ),
);
