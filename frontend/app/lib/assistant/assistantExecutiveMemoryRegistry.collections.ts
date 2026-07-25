/** ASSISTANT-2:2 — Immutable canonical Registry collections. */
import {
  AssistantExecutiveMemoryContextTypeEntries,
  AssistantExecutiveMemoryLifecycleStateEntries,
  AssistantExecutiveMemoryOutcomeEntries,
  AssistantExecutiveMemoryPolicyEntries,
  AssistantExecutiveMemoryPriorityEntries,
  AssistantExecutiveMemoryReferenceTypeEntries,
  AssistantExecutiveMemoryScopeEntries,
  AssistantExecutiveMemoryStateEntries,
  AssistantExecutiveMemoryTagEntries,
  AssistantExecutiveMemoryTypeEntries,
} from "./assistantExecutiveMemoryRegistry.entries.ts";

export const AssistantExecutiveMemoryRegistryCollections = Object.freeze({
  memoryTypes: AssistantExecutiveMemoryTypeEntries,
  memoryScopes: AssistantExecutiveMemoryScopeEntries,
  memoryStates: AssistantExecutiveMemoryStateEntries,
  memoryContextTypes: AssistantExecutiveMemoryContextTypeEntries,
  memoryReferenceTypes: AssistantExecutiveMemoryReferenceTypeEntries,
  memoryLifecycleStates: AssistantExecutiveMemoryLifecycleStateEntries,
  memoryPolicies: AssistantExecutiveMemoryPolicyEntries,
  memoryPriorities: AssistantExecutiveMemoryPriorityEntries,
  memoryOutcomes: AssistantExecutiveMemoryOutcomeEntries,
  memoryTags: AssistantExecutiveMemoryTagEntries,
} as const);
