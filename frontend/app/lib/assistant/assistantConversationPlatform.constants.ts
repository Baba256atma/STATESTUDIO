/** ASSISTANT-1:6 — Immutable Platform constants and derived counts. */
import { AssistantConversationPlatformCapabilities } from "./assistantConversationPlatform.capabilities.ts";
import { AssistantConversationPlatformCompatibility } from "./assistantConversationPlatform.compatibility.ts";
import { AssistantConversationPlatformGuarantees } from "./assistantConversationPlatform.guarantees.ts";

export const AssistantConversationPlatformConstants = Object.freeze({
  platformIdentifier: "ASSISTANT-1:6/ConversationPlatform",
  namespace: "nexora.assistant.conversation.platform",
  version: "1.0.0",
  status: "Platform",
  readiness: "ReadyForCertification",
  capabilityCount: AssistantConversationPlatformCapabilities.length,
  guaranteeCount: AssistantConversationPlatformGuarantees.length,
  compatibilityCount: AssistantConversationPlatformCompatibility.length,
} as const);
