/** ASSISTANT-1:1 — Canonical immutable Foundation identity. */
import { AssistantConversationFoundationConstants } from "./assistantConversationFoundation.constants.ts";
import type { AssistantConversationIdentityMetadata } from "./assistantConversationFoundation.types.ts";

export const AssistantConversationFoundationIdentity:
AssistantConversationIdentityMetadata = Object.freeze({
  id: AssistantConversationFoundationConstants.canonicalIdentity,
  name: "Assistant Conversation Foundation",
  phaseId: AssistantConversationFoundationConstants.phaseIdentifier,
  namespace: AssistantConversationFoundationConstants.namespace,
  version: AssistantConversationFoundationConstants.version,
  layer: "Nexora Assistant",
  status: AssistantConversationFoundationConstants.foundationStatus,
  readiness: AssistantConversationFoundationConstants.readiness,
  metadataOnly: true,
  immutable: true,
});
