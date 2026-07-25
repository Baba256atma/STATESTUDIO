/** ASSISTANT-5:2 — Immutable canonical Registry collections. */
import {
  AssistantWorkspaceOrchestrationCoordinationStrategyEntries,
  AssistantWorkspaceOrchestrationLifecycleStateEntries,
  AssistantWorkspaceOrchestrationOutcomeEntries,
  AssistantWorkspaceOrchestrationPolicyEntries,
  AssistantWorkspaceOrchestrationPriorityEntries,
  AssistantWorkspaceOrchestrationSessionTypeEntries,
  AssistantWorkspaceOrchestrationStateEntries,
  AssistantWorkspaceOrchestrationTagEntries,
  AssistantWorkspaceOrchestrationTransitionTypeEntries,
  AssistantWorkspaceOrchestrationTypeEntries,
} from "./assistantWorkspaceOrchestrationRegistry.entries.ts";

export const AssistantWorkspaceOrchestrationRegistryCollections =
  Object.freeze({
    workspaceTypes: AssistantWorkspaceOrchestrationTypeEntries,
    workspaceStates: AssistantWorkspaceOrchestrationStateEntries,
    workspaceTransitionTypes:
      AssistantWorkspaceOrchestrationTransitionTypeEntries,
    workspaceSessionTypes: AssistantWorkspaceOrchestrationSessionTypeEntries,
    workspacePriorities: AssistantWorkspaceOrchestrationPriorityEntries,
    workspaceOutcomes: AssistantWorkspaceOrchestrationOutcomeEntries,
    workspaceCoordinationStrategies:
      AssistantWorkspaceOrchestrationCoordinationStrategyEntries,
    workspacePolicies: AssistantWorkspaceOrchestrationPolicyEntries,
    workspaceLifecycleStates:
      AssistantWorkspaceOrchestrationLifecycleStateEntries,
    workspaceTags: AssistantWorkspaceOrchestrationTagEntries,
  } as const);
