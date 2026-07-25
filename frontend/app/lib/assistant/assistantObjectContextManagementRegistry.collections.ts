/** ASSISTANT-6:2 — Immutable canonical Registry collections. */
import {
  AssistantObjectContextManagementContextLifecycleStateEntries,
  AssistantObjectContextManagementContextPolicyEntries,
  AssistantObjectContextManagementContextSessionTypeEntries,
  AssistantObjectContextManagementContextStateEntries,
  AssistantObjectContextManagementContextStrategyEntries,
  AssistantObjectContextManagementContextTagEntries,
  AssistantObjectContextManagementContextTypeEntries,
  AssistantObjectContextManagementExecutiveObjectTypeEntries,
  AssistantObjectContextManagementObjectOutcomeEntries,
  AssistantObjectContextManagementObjectPriorityEntries,
} from "./assistantObjectContextManagementRegistry.entries.ts";

export const AssistantObjectContextManagementRegistryCollections =
  Object.freeze({
    executiveObjectTypes:
      AssistantObjectContextManagementExecutiveObjectTypeEntries,
    contextTypes: AssistantObjectContextManagementContextTypeEntries,
    contextStates: AssistantObjectContextManagementContextStateEntries,
    contextSessionTypes:
      AssistantObjectContextManagementContextSessionTypeEntries,
    objectPriorities: AssistantObjectContextManagementObjectPriorityEntries,
    objectOutcomes: AssistantObjectContextManagementObjectOutcomeEntries,
    contextStrategies: AssistantObjectContextManagementContextStrategyEntries,
    contextPolicies: AssistantObjectContextManagementContextPolicyEntries,
    contextLifecycleStates:
      AssistantObjectContextManagementContextLifecycleStateEntries,
    contextTags: AssistantObjectContextManagementContextTagEntries,
  } as const);
