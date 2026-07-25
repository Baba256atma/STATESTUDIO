/** ASSISTANT-1:2 — Immutable Registry constants. */
import { AssistantConversationRegistryCollections } from "./assistantConversationRegistry.collections.ts";
import { AssistantConversationRegistryEntries } from "./assistantConversationRegistry.entries.ts";

export const AssistantConversationRegistryConstants = Object.freeze({
  registryIdentifier: "ASSISTANT-1:2/ConversationRegistry",
  namespace: "nexora.assistant.conversation.registry",
  version: "1.0.0",
  registryStatus: "Registry",
  readiness: "ReadyForModel",
  collectionCount: Object.keys(AssistantConversationRegistryCollections).length,
  entryCount: AssistantConversationRegistryEntries.length,
} as const);
