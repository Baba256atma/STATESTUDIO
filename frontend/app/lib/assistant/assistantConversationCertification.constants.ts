/** ASSISTANT-1:7 — Immutable Certification constants. */
import { AssistantConversationCertificationCriteria } from "./assistantConversationCertification.criteria.ts";
import { AssistantConversationCertificationGates } from "./assistantConversationCertification.gates.ts";

export const AssistantConversationCertificationConstants = Object.freeze({
  certificationIdentifier: "ASSISTANT-1:7/ConversationCertification",
  namespace: "nexora.assistant.conversation.certification",
  version: "1.0.0",
  status: "Certification",
  readiness: "ReadyForFreeze",
  criteriaCount: AssistantConversationCertificationCriteria.length,
  gateCount: AssistantConversationCertificationGates.length,
} as const);
