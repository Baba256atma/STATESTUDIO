/** ASSISTANT-7:2 — Immutable canonical Registry collections. */
import {
  AssistantExecutiveActionPlanningActionPlanTypeEntries,
  AssistantExecutiveActionPlanningActionPriorityLevelEntries,
  AssistantExecutiveActionPlanningActionStateEntries,
  AssistantExecutiveActionPlanningDependencyTypeEntries,
  AssistantExecutiveActionPlanningLifecycleStateEntries,
  AssistantExecutiveActionPlanningOwnershipReferenceTypeEntries,
  AssistantExecutiveActionPlanningPlannedActionTypeEntries,
  AssistantExecutiveActionPlanningPolicyEntries,
  AssistantExecutiveActionPlanningTagEntries,
  AssistantExecutiveActionPlanningTimeHorizonTypeEntries,
} from "./assistantExecutiveActionPlanningRegistry.entries.ts";

export const AssistantExecutiveActionPlanningRegistryCollections =
  Object.freeze({
    actionPlanTypes: AssistantExecutiveActionPlanningActionPlanTypeEntries,
    plannedActionTypes:
      AssistantExecutiveActionPlanningPlannedActionTypeEntries,
    actionStates: AssistantExecutiveActionPlanningActionStateEntries,
    actionPriorityLevels:
      AssistantExecutiveActionPlanningActionPriorityLevelEntries,
    timeHorizonTypes: AssistantExecutiveActionPlanningTimeHorizonTypeEntries,
    dependencyTypes: AssistantExecutiveActionPlanningDependencyTypeEntries,
    ownershipReferenceTypes:
      AssistantExecutiveActionPlanningOwnershipReferenceTypeEntries,
    planningPolicies: AssistantExecutiveActionPlanningPolicyEntries,
    planningLifecycleStates:
      AssistantExecutiveActionPlanningLifecycleStateEntries,
    planningTags: AssistantExecutiveActionPlanningTagEntries,
  } as const);
