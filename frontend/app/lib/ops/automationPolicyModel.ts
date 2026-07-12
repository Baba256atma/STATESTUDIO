import { getAutomationPolicyRegistry } from "./automationRegistryIndex.ts";
import type { AutomationPolicyModelDescriptor } from "./automationModelTypes.ts";

export const AutomationPolicyModel = Object.freeze(
  getAutomationPolicyRegistry().map((entry) =>
    Object.freeze({
      id: entry.id,
      policyCategory: entry.category,
      description: entry.description,
      metadata: entry.metadata,
    } as const satisfies AutomationPolicyModelDescriptor),
  ),
);
