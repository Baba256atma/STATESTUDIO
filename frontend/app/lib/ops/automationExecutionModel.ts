import { getAutomationLifecycleRegistry, getAutomationPolicyRegistry } from "./automationRegistryIndex.ts";
import type {
  AutomationExecutionModelDescriptor,
  AutomationExecutionSummary,
} from "./automationModelTypes.ts";

const lifecycleStages = Object.freeze([
  "Draft",
  "Proposed",
  "Active",
  "Disabled",
  "Deprecated",
  "Archived",
] as const);

export const AutomationExecutionModel = Object.freeze(
  getAutomationPolicyRegistry().map((entry, index) =>
    Object.freeze({
      id: `automation-execution-${index + 1}`,
      executionIdentity: `execution-${entry.id}`,
      executionMetadata: entry.metadata,
      executionLifecycle:
        lifecycleStages[index % lifecycleStages.length] ?? "Draft",
      policyReference: entry.id,
    } as const satisfies AutomationExecutionModelDescriptor),
  ),
);

export const AutomationExecutionModelSummary = Object.freeze({
  totalExecutionDescriptors: AutomationExecutionModel.length,
  supportedLifecycleStages: Object.freeze(
    getAutomationLifecycleRegistry().map((entry) => {
      const suffix = entry.id.replace("automation-lifecycle-", "");
      const normalized =
        suffix.charAt(0).toUpperCase() + suffix.slice(1);
      return normalized as
        | "Draft"
        | "Proposed"
        | "Active"
        | "Disabled"
        | "Deprecated"
        | "Archived";
    }),
  ),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies AutomationExecutionSummary);
