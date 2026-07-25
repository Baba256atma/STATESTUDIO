/** ASSISTANT-1:7 — Canonical immutable Certification identity. */
import { AssistantConversationCertificationConstants } from "./assistantConversationCertification.constants.ts";
import type { AssistantConversationCertificationIdentityMetadata } from "./assistantConversationCertification.types.ts";

export const AssistantConversationCertificationIdentity:
AssistantConversationCertificationIdentityMetadata = Object.freeze({
  id: AssistantConversationCertificationConstants.certificationIdentifier,
  name: "Assistant Conversation Certification",
  phaseId: "ASSISTANT-1:7",
  namespace: AssistantConversationCertificationConstants.namespace,
  version: AssistantConversationCertificationConstants.version,
  status: AssistantConversationCertificationConstants.status,
  readiness: AssistantConversationCertificationConstants.readiness,
  sourcePlatform: "ASSISTANT-1:6/ConversationPlatform",
  metadataOnly: true,
  immutable: true,
});
