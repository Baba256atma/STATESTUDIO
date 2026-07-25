/** ASSISTANT-1:8 — Canonical immutable Freeze identity. */
import { AssistantConversationFreezeConstants } from "./assistantConversationFreeze.constants.ts";
import type { AssistantConversationFreezeIdentityMetadata } from "./assistantConversationFreeze.types.ts";

export const AssistantConversationFreezeIdentity:
AssistantConversationFreezeIdentityMetadata = Object.freeze({
  id: AssistantConversationFreezeConstants.freezeIdentifier,
  name: "Assistant Conversation Freeze",
  phaseId: "ASSISTANT-1:8",
  namespace: AssistantConversationFreezeConstants.namespace,
  version: AssistantConversationFreezeConstants.version,
  status: AssistantConversationFreezeConstants.status,
  readiness: AssistantConversationFreezeConstants.readiness,
  sourceCertification: "ASSISTANT-1:7/ConversationCertification",
  lockIdentifier: AssistantConversationFreezeConstants.lockIdentifier,
  metadataOnly: true,
  immutable: true,
});
