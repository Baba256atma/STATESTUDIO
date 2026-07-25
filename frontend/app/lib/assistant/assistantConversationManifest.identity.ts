/** ASSISTANT-1:5 — Canonical immutable Manifest identity. */
import { AssistantConversationManifestConstants } from "./assistantConversationManifest.constants.ts";
import type { AssistantConversationManifestIdentityMetadata } from "./assistantConversationManifest.types.ts";

export const AssistantConversationManifestIdentity:
AssistantConversationManifestIdentityMetadata = Object.freeze({
  id: AssistantConversationManifestConstants.manifestIdentifier,
  name: "Assistant Conversation Manifest",
  phaseId: "ASSISTANT-1:5",
  namespace: AssistantConversationManifestConstants.namespace,
  version: AssistantConversationManifestConstants.version,
  status: AssistantConversationManifestConstants.status,
  readiness: AssistantConversationManifestConstants.readiness,
  metadataOnly: true,
  immutable: true,
});
