import {
  AutomationRuleContract,
} from "./automationIndex.ts";
import type { AutomationLifecycleDescriptor } from "./automationRegistryTypes.ts";

const createLifecycleDescriptor = (
  id: string,
  description: string,
) =>
  Object.freeze({
    id,
    description,
    metadata: AutomationRuleContract.metadata,
  } as const satisfies AutomationLifecycleDescriptor);

export const AutomationLifecycleRegistry = Object.freeze([
  createLifecycleDescriptor("automation-lifecycle-draft", "Metadata-only draft lifecycle stage."),
  createLifecycleDescriptor("automation-lifecycle-proposed", "Metadata-only proposed lifecycle stage."),
  createLifecycleDescriptor("automation-lifecycle-active", "Metadata-only active lifecycle stage."),
  createLifecycleDescriptor("automation-lifecycle-disabled", "Metadata-only disabled lifecycle stage."),
  createLifecycleDescriptor("automation-lifecycle-deprecated", "Metadata-only deprecated lifecycle stage."),
  createLifecycleDescriptor("automation-lifecycle-archived", "Metadata-only archived lifecycle stage."),
] as const);
