/** ASSISTANT-4:2 — Immutable canonical Registry collections. */
import {
  AssistantExecutiveGuidanceLifecycleStateEntries,
  AssistantExecutiveGuidanceObjectiveEntries,
  AssistantExecutiveGuidanceOutcomeEntries,
  AssistantExecutiveGuidancePolicyEntries,
  AssistantExecutiveGuidancePriorityEntries,
  AssistantExecutiveGuidanceSessionTypeEntries,
  AssistantExecutiveGuidanceStateEntries,
  AssistantExecutiveGuidanceStrategyEntries,
  AssistantExecutiveGuidanceTagEntries,
  AssistantExecutiveGuidanceTypeEntries,
} from "./assistantExecutiveGuidanceRegistry.entries.ts";

export const AssistantExecutiveGuidanceRegistryCollections = Object.freeze({
  guidanceTypes: AssistantExecutiveGuidanceTypeEntries,
  guidanceObjectives: AssistantExecutiveGuidanceObjectiveEntries,
  guidanceStates: AssistantExecutiveGuidanceStateEntries,
  guidanceSessionTypes: AssistantExecutiveGuidanceSessionTypeEntries,
  guidancePriorities: AssistantExecutiveGuidancePriorityEntries,
  guidanceOutcomes: AssistantExecutiveGuidanceOutcomeEntries,
  guidanceStrategies: AssistantExecutiveGuidanceStrategyEntries,
  guidancePolicies: AssistantExecutiveGuidancePolicyEntries,
  guidanceLifecycleStates: AssistantExecutiveGuidanceLifecycleStateEntries,
  guidanceTags: AssistantExecutiveGuidanceTagEntries,
} as const);
