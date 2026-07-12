import { AutomationActionRegistry } from "./automationActionRegistry.ts";
import { AutomationConditionRegistry } from "./automationConditionRegistry.ts";
import { AutomationEventRegistry } from "./automationEventRegistry.ts";
import { AutomationLifecycleRegistry } from "./automationLifecycleRegistry.ts";
import {
  AutomationPlatformRegistryMetadata,
  AutomationRegistryMetadata,
} from "./automationRegistryMetadata.ts";
import { AutomationPolicyRegistry } from "./automationPolicyRegistry.ts";
import { AutomationRuleRegistry } from "./automationRuleRegistry.ts";
import { AutomationTriggerRegistry } from "./automationTriggerRegistry.ts";

export const ExecutiveAutomationRegistry = Object.freeze({
  events: AutomationEventRegistry,
  triggers: AutomationTriggerRegistry,
  conditions: AutomationConditionRegistry,
  actions: AutomationActionRegistry,
  rules: AutomationRuleRegistry,
  policies: AutomationPolicyRegistry,
  lifecycle: AutomationLifecycleRegistry,
  metadata: AutomationRegistryMetadata,
  descriptor: AutomationPlatformRegistryMetadata,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const getExecutiveAutomationRegistry = () => ExecutiveAutomationRegistry;
export const getAutomationEventRegistry = () => AutomationEventRegistry;
export const getAutomationTriggerRegistry = () => AutomationTriggerRegistry;
export const getAutomationConditionRegistry = () => AutomationConditionRegistry;
export const getAutomationActionRegistry = () => AutomationActionRegistry;
export const getAutomationRuleRegistry = () => AutomationRuleRegistry;
export const getAutomationPolicyRegistry = () => AutomationPolicyRegistry;
export const getAutomationLifecycleRegistry = () => AutomationLifecycleRegistry;
