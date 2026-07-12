import { ExecutionPlatformMetadata } from "./executionMetadataIndex.ts";
import type { ExecutionAutomation } from "./executionModelTypes.ts";

export const ExecutionAutomationModel = Object.freeze({
  identifier: "execution-automation-model",
  displayName: "Execution Automation Model",
  description: "Canonical metadata model for execution automation.",
  category: "Automation",
  status: "Modeled",
  triggerMetadata: Object.freeze([
    "StateChangeTrigger",
    "TimeWindowTrigger",
  ]),
  ruleMetadata: Object.freeze([
    "PolicyRule",
    "EscalationRule",
  ]),
  actionMetadata: Object.freeze([
    "NotificationAction",
    "StatusPropagationAction",
  ]),
  executionScope: Object.freeze([
    "MetadataOnlyAutomation",
    "PolicyConstrainedScope",
  ]),
  metadata: Object.freeze({
    phaseId: "OPS-1:3",
    platformId: ExecutionPlatformMetadata.platformId,
    compatibilityVersion: ExecutionPlatformMetadata.compatibilityVersion,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
    registryCapabilityId: "cap-automation",
    domainId: "automation",
  }),
} as const satisfies ExecutionAutomation);
