/** ASSISTANT-1:2 — Canonical Assistant Conversation Registry aggregate. */
import { AssistantConversationRegistryCollections } from "./assistantConversationRegistry.collections.ts";
import { AssistantConversationRegistryConstants } from "./assistantConversationRegistry.constants.ts";
import { AssistantConversationRegistryEntries } from "./assistantConversationRegistry.entries.ts";
import { AssistantConversationRegistryIdentity } from "./assistantConversationRegistry.identity.ts";
import { AssistantConversationRegistryMetadata } from "./assistantConversationRegistry.metadata.ts";

export const AssistantConversationRegistry = Object.freeze({
  identity: AssistantConversationRegistryIdentity,
  constants: AssistantConversationRegistryConstants,
  collections: AssistantConversationRegistryCollections,
  entries: AssistantConversationRegistryEntries,
  metadata: AssistantConversationRegistryMetadata,
  upstreamDependencies: AssistantConversationRegistryMetadata.upstreamDependencies,
  publicApiSurface: Object.freeze(["AssistantConversationRegistry"]),
  status: "Registry",
  readiness: "ReadyForModel",
  nextPhase: "ASSISTANT-1:3 — Conversation Model",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  conversationExecution: false,
  llmIntegration: false,
  promptExecution: false,
  workflowOrchestration: false,
  persistence: false,
  networking: false,
  rendering: false,
  aiReasoning: false,
  executionLogic: false,
} as const);
