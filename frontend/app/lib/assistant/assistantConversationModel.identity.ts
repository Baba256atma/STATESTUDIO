/** ASSISTANT-1:3 — Canonical immutable Conversation Model identity. */
import { AssistantConversationModelConstants } from "./assistantConversationModel.constants.ts";

export const AssistantConversationModelIdentity = Object.freeze({
  id: AssistantConversationModelConstants.modelIdentifier,
  name: "Assistant Conversation Model",
  phaseId: "ASSISTANT-1:3",
  namespace: AssistantConversationModelConstants.namespace,
  version: AssistantConversationModelConstants.version,
  layer: "Nexora Assistant",
  status: AssistantConversationModelConstants.status,
  readiness: AssistantConversationModelConstants.readiness,
  sourceRegistry: "ASSISTANT-1:2/ConversationRegistry",
  metadataOnly: true,
  immutable: true,
} as const);
