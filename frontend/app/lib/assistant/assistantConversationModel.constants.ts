/** ASSISTANT-1:3 — Immutable Model constants derived from canonical metadata. */
import {
  AssistantConversationDomainModels,
} from "./assistantConversationModel.metadata.ts";
import { AssistantConversationModelLifecycle } from "./assistantConversationModel.lifecycle.ts";
import { AssistantConversationModelRelationships } from "./assistantConversationModel.relationships.ts";

export const AssistantConversationModelConstants = Object.freeze({
  modelIdentifier: "ASSISTANT-1:3/ConversationModel",
  namespace: "nexora.assistant.conversation.model",
  version: "1.0.0",
  readiness: "ReadyForValidation",
  status: "Model",
  modelCount: AssistantConversationDomainModels.length,
  relationshipCount: AssistantConversationModelRelationships.length,
  lifecycleCount: AssistantConversationModelLifecycle.length,
} as const);
