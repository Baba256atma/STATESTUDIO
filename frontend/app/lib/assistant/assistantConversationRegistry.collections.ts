/** ASSISTANT-1:2 — Immutable canonical Registry collections. */
import {
  AssistantConversationGuidanceEntries,
  AssistantConversationIntentEntries,
  AssistantConversationOutcomeEntries,
  AssistantConversationPolicyEntries,
  AssistantConversationPriorityEntries,
  AssistantConversationStateEntries,
  AssistantConversationTurnTypeEntries,
  AssistantConversationTypeEntries,
} from "./assistantConversationRegistry.entries.ts";

export const AssistantConversationRegistryCollections = Object.freeze({
  conversationTypes: AssistantConversationTypeEntries,
  conversationStates: AssistantConversationStateEntries,
  turnTypes: AssistantConversationTurnTypeEntries,
  intentCategories: AssistantConversationIntentEntries,
  guidanceTypes: AssistantConversationGuidanceEntries,
  conversationPriorities: AssistantConversationPriorityEntries,
  conversationOutcomes: AssistantConversationOutcomeEntries,
  conversationPolicies: AssistantConversationPolicyEntries,
} as const);
