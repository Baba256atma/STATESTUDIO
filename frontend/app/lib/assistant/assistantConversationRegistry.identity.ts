/** ASSISTANT-1:2 — Canonical immutable Registry identity. */
import { AssistantConversationRegistryConstants } from "./assistantConversationRegistry.constants.ts";
import type { AssistantConversationRegistryIdentityMetadata } from "./assistantConversationRegistry.types.ts";

export const AssistantConversationRegistryIdentity:
AssistantConversationRegistryIdentityMetadata = Object.freeze({
  id: AssistantConversationRegistryConstants.registryIdentifier,
  name: "Assistant Conversation Registry",
  phaseId: "ASSISTANT-1:2",
  namespace: AssistantConversationRegistryConstants.namespace,
  version: AssistantConversationRegistryConstants.version,
  layer: "Nexora Assistant",
  status: AssistantConversationRegistryConstants.registryStatus,
  readiness: AssistantConversationRegistryConstants.readiness,
  sourceFoundation: "ASSISTANT-1:1/ConversationFoundation",
  metadataOnly: true,
  immutable: true,
});
