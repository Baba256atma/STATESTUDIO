import { getAutomationEventRegistry } from "./automationRegistryIndex.ts";
import type { AutomationEventModelDescriptor } from "./automationModelTypes.ts";

export const AutomationEventModel = Object.freeze(
  getAutomationEventRegistry().map((entry) =>
    Object.freeze({
      id: entry.id,
      category: entry.category,
      source: "ExecutiveAutomationRegistry",
      name: entry.name,
      description: entry.description,
      metadata: entry.metadata,
    } as const satisfies AutomationEventModelDescriptor),
  ),
);
