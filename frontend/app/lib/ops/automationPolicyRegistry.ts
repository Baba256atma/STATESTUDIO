import {
  AutomationRuleContract,
} from "./automationIndex.ts";
import type { AutomationPolicyDescriptor } from "./automationRegistryTypes.ts";

const createPolicyDescriptor = (
  id: string,
  category: AutomationPolicyDescriptor["category"],
  description: string,
) =>
  Object.freeze({
    id,
    category,
    description,
    metadata: AutomationRuleContract.metadata,
  } as const satisfies AutomationPolicyDescriptor);

export const AutomationPolicyRegistry = Object.freeze([
  createPolicyDescriptor("automation-policy-retry", "Retry Policy", "Metadata-only retry policy catalog entry."),
  createPolicyDescriptor("automation-policy-failure", "Failure Policy", "Metadata-only failure policy catalog entry."),
  createPolicyDescriptor("automation-policy-approval", "Approval Policy", "Metadata-only approval policy catalog entry."),
  createPolicyDescriptor("automation-policy-security", "Security Policy", "Metadata-only security policy catalog entry."),
  createPolicyDescriptor("automation-policy-execution", "Execution Policy", "Metadata-only execution policy catalog entry."),
] as const);
