/** ASSISTANT-1:1 — Immutable canonical constants and vocabulary. */
export const AssistantConversationFoundationConstants = Object.freeze({
  phaseIdentifier: "ASSISTANT-1:1",
  namespace: "nexora.assistant.conversation.foundation",
  version: "1.0.0",
  readiness: "ReadyForRegistry",
  foundationStatus: "Foundation",
  canonicalIdentity: "ASSISTANT-1:1/ConversationFoundation",
} as const);

export const AssistantConversationResponsibilities = Object.freeze([
  "Assistant Conversation",
  "Executive Conversation",
  "Conversation Session",
  "Conversation Turn",
  "Conversation Context",
  "Conversation Goal",
  "Conversation State",
  "Conversation Policy",
  "Conversation Boundary",
  "Conversation Capability",
  "Conversation Contract",
  "Conversation Identity",
] as const);
