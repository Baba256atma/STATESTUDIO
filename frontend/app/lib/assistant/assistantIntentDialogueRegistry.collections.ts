/** ASSISTANT-3:2 — Immutable canonical Registry collections. */
import {
  AssistantIntentDialogueClarificationTypeEntries,
  AssistantIntentDialogueDialogueStateEntries,
  AssistantIntentDialogueDialogueTypeEntries,
  AssistantIntentDialogueExecutiveIntentTypeEntries,
  AssistantIntentDialogueLifecycleStateEntries,
  AssistantIntentDialogueOutcomeEntries,
  AssistantIntentDialoguePolicyEntries,
  AssistantIntentDialoguePriorityEntries,
  AssistantIntentDialogueTagEntries,
  AssistantIntentDialogueTurnTypeEntries,
} from "./assistantIntentDialogueRegistry.entries.ts";

export const AssistantIntentDialogueRegistryCollections = Object.freeze({
  executiveIntentTypes: AssistantIntentDialogueExecutiveIntentTypeEntries,
  dialogueTypes: AssistantIntentDialogueDialogueTypeEntries,
  dialogueStates: AssistantIntentDialogueDialogueStateEntries,
  dialogueTurnTypes: AssistantIntentDialogueTurnTypeEntries,
  executiveIntentPriorities: AssistantIntentDialoguePriorityEntries,
  executiveIntentOutcomes: AssistantIntentDialogueOutcomeEntries,
  clarificationTypes: AssistantIntentDialogueClarificationTypeEntries,
  dialoguePolicies: AssistantIntentDialoguePolicyEntries,
  dialogueLifecycleStates: AssistantIntentDialogueLifecycleStateEntries,
  dialogueTags: AssistantIntentDialogueTagEntries,
} as const);
