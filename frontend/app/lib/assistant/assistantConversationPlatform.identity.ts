/** ASSISTANT-1:6 — Canonical immutable Platform identity. */
import { AssistantConversationPlatformConstants } from "./assistantConversationPlatform.constants.ts";
import type { AssistantConversationPlatformIdentityMetadata } from "./assistantConversationPlatform.types.ts";

export const AssistantConversationPlatformIdentity:
AssistantConversationPlatformIdentityMetadata = Object.freeze({
  id: AssistantConversationPlatformConstants.platformIdentifier,
  name: "Assistant Conversation Platform",
  phaseId: "ASSISTANT-1:6",
  namespace: AssistantConversationPlatformConstants.namespace,
  version: AssistantConversationPlatformConstants.version,
  status: AssistantConversationPlatformConstants.status,
  readiness: AssistantConversationPlatformConstants.readiness,
  sourceManifest: "ASSISTANT-1:5/ConversationManifest",
  metadataOnly: true,
  immutable: true,
});
