import {
  getAutomationEventRegistry,
  getAutomationTriggerRegistry,
} from "./automationRegistryIndex.ts";
import type { AutomationTriggerModelDescriptor } from "./automationModelTypes.ts";

const supportedEventCategories = Object.freeze(
  getAutomationEventRegistry().map((entry) => entry.category),
);

export const AutomationTriggerModel = Object.freeze(
  getAutomationTriggerRegistry().map((entry) =>
    Object.freeze({
      id: entry.id,
      triggerType: entry.type,
      supportedEventCategories,
      metadata: entry.metadata,
    } as const satisfies AutomationTriggerModelDescriptor),
  ),
);
