import {
  AutomationCompatibilityVersion,
} from "./automationIndex.ts";
import { AutomationActionRegistry } from "./automationActionRegistry.ts";
import { AutomationConditionRegistry } from "./automationConditionRegistry.ts";
import { AutomationEventRegistry } from "./automationEventRegistry.ts";
import { AutomationLifecycleRegistry } from "./automationLifecycleRegistry.ts";
import { AutomationPolicyRegistry } from "./automationPolicyRegistry.ts";
import { AutomationRuleRegistry } from "./automationRuleRegistry.ts";
import { AutomationTriggerRegistry } from "./automationTriggerRegistry.ts";
import type {
  AutomationPlatformRegistryDescriptor,
  AutomationRegistrySummary,
} from "./automationRegistryTypes.ts";

export const AutomationPlatformRegistryMetadata = Object.freeze({
  registryId: "ops-8-2-executive-automation-registry",
  registryName: "Executive Automation Registry",
  registryVersion: "1.0.0",
  compatibilityVersion: AutomationCompatibilityVersion,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies AutomationPlatformRegistryDescriptor);

export const AutomationRegistryMetadata = Object.freeze({
  supportedEventCount: AutomationEventRegistry.length,
  supportedTriggerCount: AutomationTriggerRegistry.length,
  supportedConditionCount: AutomationConditionRegistry.length,
  supportedActionCount: AutomationActionRegistry.length,
  supportedRuleCount: AutomationRuleRegistry.length,
  supportedPolicyCount: AutomationPolicyRegistry.length,
  supportedLifecycleCount: AutomationLifecycleRegistry.length,
  compatibilityVersion: AutomationCompatibilityVersion,
  deterministicStatus: "Deterministic",
  readonlyStatus: "Readonly",
  metadataOnlyStatus: "MetadataOnly",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies AutomationRegistrySummary);
