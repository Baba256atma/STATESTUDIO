/** ASSISTANT-1:4 — Immutable Validation constants. */
import { AssistantConversationValidationGates } from "./assistantConversationValidation.gates.ts";
import { AssistantConversationValidationRules } from "./assistantConversationValidation.rules.ts";

export const AssistantConversationValidationConstants = Object.freeze({
  validationIdentifier: "ASSISTANT-1:4/ConversationValidation",
  namespace: "nexora.assistant.conversation.validation",
  version: "1.0.0",
  status: "Validation",
  ruleCount: AssistantConversationValidationRules.length,
  gateCount: AssistantConversationValidationGates.length,
  readiness: "ReadyForManifest",
} as const);
