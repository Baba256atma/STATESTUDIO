/** ASSISTANT-1:2 — Canonical immutable registry entries. */
import type { AssistantConversationRegistryEntry } from "./assistantConversationRegistry.types.ts";

const register = (
  category: string,
  names: readonly string[],
): readonly AssistantConversationRegistryEntry[] => Object.freeze(
  names.map((name, index) => Object.freeze({
    identifier:
      `ASSISTANT-1:2/${category}/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Canonical ${category} metadata for ${name}.`,
    category,
    version: "1.0.0",
    lifecycle: "Active",
    status: "Registered",
    tags: Object.freeze(["assistant", "conversation", category.toLowerCase()]),
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);

export const AssistantConversationTypeEntries = register("ConversationType", [
  "Executive Conversation", "Guidance Conversation", "Discovery Conversation",
  "Clarification Conversation", "Review Conversation", "Planning Conversation",
  "Analysis Conversation", "Decision Conversation", "Monitoring Conversation",
  "Follow-up Conversation",
]);

export const AssistantConversationStateEntries = register("ConversationState", [
  "Created", "Active", "WaitingForInput", "Clarifying", "Processing",
  "Reviewing", "Completed", "Suspended", "Cancelled", "Archived",
]);

export const AssistantConversationTurnTypeEntries = register("TurnType", [
  "User Message", "Assistant Reply", "Clarification", "Recommendation",
  "Summary", "Question", "Confirmation", "Notification", "Instruction",
  "System Turn",
]);

export const AssistantConversationIntentEntries = register("IntentCategory", [
  "Ask", "Explain", "Analyse", "Decide", "Compare", "Plan", "Review",
  "Monitor", "Create", "Update", "Delete", "Explore",
]);

export const AssistantConversationGuidanceEntries = register("GuidanceType", [
  "Educational", "Operational", "Strategic", "Executive", "Tactical",
  "Analytical", "Advisory", "Risk", "Opportunity", "Planning",
]);

export const AssistantConversationPriorityEntries = register(
  "ConversationPriority",
  ["Critical", "High", "Normal", "Low"],
);

export const AssistantConversationOutcomeEntries = register(
  "ConversationOutcome",
  [
    "Answered", "Clarified", "Planned", "DecisionReady", "Escalated",
    "Deferred", "Cancelled", "Failed",
  ],
);

export const AssistantConversationPolicyEntries = register(
  "ConversationPolicy",
  [
    "Metadata Only", "Immutable Registry", "No Runtime", "No Persistence",
    "No AI Execution", "No Networking", "Freeze Compatible",
    "Version Controlled",
  ],
);

export const AssistantConversationRegistryEntries = Object.freeze([
  ...AssistantConversationTypeEntries,
  ...AssistantConversationStateEntries,
  ...AssistantConversationTurnTypeEntries,
  ...AssistantConversationIntentEntries,
  ...AssistantConversationGuidanceEntries,
  ...AssistantConversationPriorityEntries,
  ...AssistantConversationOutcomeEntries,
  ...AssistantConversationPolicyEntries,
]);
