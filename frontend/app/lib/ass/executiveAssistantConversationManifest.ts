/**
 * ASS-2 — Executive Conversation Contract manifest.
 */

import {
  ASS_CONVERSATION_CONTRACT_VERSION,
  ASS_CONVERSATION_PLATFORM_ID,
  ASS_CONVERSATION_PLATFORM_NAME,
  ASS_CONVERSATION_REGISTRY_KEYS,
} from "./executiveAssistantConversationContracts.ts";
import type {
  ExecutiveAssistantConversationManifest,
  ExecutiveAssistantConversationRegistryBundle,
} from "./executiveAssistantConversationTypes.ts";
import {
  getDefaultConversationCompatibility,
  validateExecutiveAssistantConversationManifestRecord,
  validateExecutiveAssistantConversationRegistry,
} from "./executiveAssistantConversationValidation.ts";

export function getExecutiveAssistantConversationManifest(
  registry: ExecutiveAssistantConversationRegistryBundle
): ExecutiveAssistantConversationManifest {
  const validation = validateExecutiveAssistantConversationRegistry(registry);
  const manifest = Object.freeze({
    manifestId: "executive-assistant-conversation-foundation-manifest",
    platformId: ASS_CONVERSATION_PLATFORM_ID,
    version: ASS_CONVERSATION_CONTRACT_VERSION,
    title: ASS_CONVERSATION_PLATFORM_NAME,
    goal: "Canonical conversation identity, session, message, turn, role, and scope binding contracts.",
    registryKeys: ASS_CONVERSATION_REGISTRY_KEYS,
    roleCount: registry.roleCount,
    validationResult: validation.valid ? ("valid" as const) : ("invalid" as const),
    compatibility: getDefaultConversationCompatibility(),
    readOnly: true as const,
  });
  const manifestValidation = validateExecutiveAssistantConversationManifestRecord(manifest);
  return Object.freeze({
    ...manifest,
    validationResult: validation.valid && manifestValidation.valid ? ("valid" as const) : ("invalid" as const),
    readOnly: true as const,
  });
}
