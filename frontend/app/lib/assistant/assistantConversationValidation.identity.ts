/** ASSISTANT-1:4 — Canonical immutable Validation identity. */
import { AssistantConversationValidationConstants } from "./assistantConversationValidation.constants.ts";

export const AssistantConversationValidationIdentity = Object.freeze({
  id: AssistantConversationValidationConstants.validationIdentifier,
  name: "Assistant Conversation Validation",
  phaseId: "ASSISTANT-1:4",
  namespace: AssistantConversationValidationConstants.namespace,
  version: AssistantConversationValidationConstants.version,
  layer: "Nexora Assistant",
  status: AssistantConversationValidationConstants.status,
  readiness: AssistantConversationValidationConstants.readiness,
  sourceModel: "ASSISTANT-1:3/ConversationModel",
  metadataOnly: true,
  immutable: true,
} as const);
