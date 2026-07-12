import type {
  AutomationAction,
  AutomationCondition,
  AutomationEvent,
  AutomationMetadata,
  AutomationPlatformDescriptor,
  AutomationRule,
  AutomationTrigger,
} from "./automationTypes.ts";

const automationMetadata = Object.freeze({
  platformId: "OPS-8:1",
  platformVersion: "1.0.0",
  releaseStage: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  tags: Object.freeze(["ops", "automation", "metadata-only"]),
} as const satisfies AutomationMetadata);

const platformMetadata = Object.freeze({
  platformId: "OPS-8:1",
  platformName: "Executive Automation Foundation",
  platformNamespace: "nexora.ops.automation.foundation",
  platformVersion: "1.0.0",
  platformDescription:
    "Canonical metadata-only foundation for executive automation contracts.",
  platformStatus: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies AutomationPlatformDescriptor);

export const AutomationEventContract = Object.freeze({
  id: "automation-event-contract",
  category: "System",
  name: "Automation Event",
  description:
    "Canonical metadata-only contract describing one automation event source.",
  source: "ExecutiveAutomationFoundation",
  metadata: automationMetadata,
} as const satisfies AutomationEvent);

export const AutomationTriggerContract = Object.freeze({
  id: "automation-trigger-contract",
  type: "StateChange",
  description:
    "Canonical metadata-only contract describing one automation trigger without runtime trigger logic.",
  metadata: automationMetadata,
} as const satisfies AutomationTrigger);

export const AutomationConditionContract = Object.freeze({
  id: "automation-condition-contract",
  category: "Policy",
  description:
    "Canonical metadata-only contract describing one automation condition without evaluation behavior.",
  metadata: automationMetadata,
} as const satisfies AutomationCondition);

export const AutomationActionContract = Object.freeze({
  id: "automation-action-contract",
  type: "NotificationReference",
  description:
    "Canonical metadata-only contract describing one automation action without execution behavior.",
  metadata: automationMetadata,
} as const satisfies AutomationAction);

export const AutomationRuleContract = Object.freeze({
  id: "automation-rule-contract",
  triggerReference: AutomationTriggerContract.id,
  conditionReferences: Object.freeze([AutomationConditionContract.id]),
  actionReferences: Object.freeze([AutomationActionContract.id]),
  priority: "Normal",
  status: "Draft",
  metadata: automationMetadata,
} as const satisfies AutomationRule);

export const AutomationContracts = Object.freeze({
  event: AutomationEventContract,
  trigger: AutomationTriggerContract,
  condition: AutomationConditionContract,
  action: AutomationActionContract,
  rule: AutomationRuleContract,
  platform: platformMetadata,
  all: Object.freeze([
    AutomationEventContract,
    AutomationTriggerContract,
    AutomationConditionContract,
    AutomationActionContract,
    AutomationRuleContract,
  ]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
