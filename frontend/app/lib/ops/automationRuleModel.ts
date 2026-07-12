import {
  getAutomationActionRegistry,
  getAutomationConditionRegistry,
  getAutomationPolicyRegistry,
  getAutomationRuleRegistry,
  getAutomationTriggerRegistry,
} from "./automationRegistryIndex.ts";
import { AutomationRulePriorities } from "./automationIndex.ts";
import type { AutomationRuleModelDescriptor } from "./automationModelTypes.ts";

const triggerReferences = getAutomationTriggerRegistry().map((entry) => entry.id);
const conditionReferences = getAutomationConditionRegistry().map((entry) => entry.id);
const actionReferences = getAutomationActionRegistry().map((entry) => entry.id);
const policyReferences = getAutomationPolicyRegistry().map((entry) => entry.id);

export const AutomationRuleModel = Object.freeze(
  getAutomationRuleRegistry().map((entry, index) =>
    Object.freeze({
      id: entry.id,
      ruleCategory: entry.category,
      triggerReference: triggerReferences[index % triggerReferences.length] ?? "automation-trigger-event",
      conditionReferences: Object.freeze([
        conditionReferences[index % conditionReferences.length] ?? "automation-condition-status",
      ]),
      actionReferences: Object.freeze([
        actionReferences[index % actionReferences.length] ?? "automation-action-create-task",
      ]),
      policyReference: policyReferences[index % policyReferences.length] ?? "automation-policy-retry",
      priority: AutomationRulePriorities[index % AutomationRulePriorities.length] ?? "Normal",
      lifecycle: "Draft",
      metadata: entry.metadata,
    } as const satisfies AutomationRuleModelDescriptor),
  ),
);
