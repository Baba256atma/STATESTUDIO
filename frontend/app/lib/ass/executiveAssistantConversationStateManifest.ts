/**
 * ASS-3 — Executive Conversation State Architecture manifest.
 */

import {
  ASS_CONVERSATION_STATE_PLATFORM_ID,
  ASS_CONVERSATION_STATE_PLATFORM_NAME,
  ASS_CONVERSATION_STATE_REGISTRY_KEYS,
  ASS_CONVERSATION_STATE_VERSION,
} from "./executiveAssistantConversationStateContracts.ts";
import { getExecutiveAssistantTransitionMatrix } from "./executiveAssistantConversationStateRegistry.ts";
import type {
  ExecutiveAssistantConversationStateManifest,
  ExecutiveAssistantConversationStateRegistryBundle,
} from "./executiveAssistantConversationStateTypes.ts";
import {
  getDefaultConversationStateCompatibility,
  validateExecutiveAssistantConversationStateManifestRecord,
  validateExecutiveAssistantConversationStateRegistry,
} from "./executiveAssistantConversationStateValidation.ts";

export function getExecutiveAssistantConversationStateManifest(
  registry: ExecutiveAssistantConversationStateRegistryBundle
): ExecutiveAssistantConversationStateManifest {
  const validation = validateExecutiveAssistantConversationStateRegistry(registry);
  const manifest = Object.freeze({
    manifestId: "executive-assistant-conversation-state-manifest",
    platformId: ASS_CONVERSATION_STATE_PLATFORM_ID,
    version: ASS_CONVERSATION_STATE_VERSION,
    title: ASS_CONVERSATION_STATE_PLATFORM_NAME,
    goal: "Immutable conversation lifecycle, session, turn, interaction, waiting, completion, pause/resume, and failure metadata state architecture.",
    registryKeys: ASS_CONVERSATION_STATE_REGISTRY_KEYS,
    transitionCount: registry.transitionCount,
    lifecycleStateCount: registry.lifecycleStateCount,
    validationResult: validation.valid ? ("valid" as const) : ("invalid" as const),
    compatibility: getDefaultConversationStateCompatibility(),
    readOnly: true as const,
  });
  const manifestValidation = validateExecutiveAssistantConversationStateManifestRecord(manifest);
  const transitionMatrix = getExecutiveAssistantTransitionMatrix();
  const matrixValid = transitionMatrix.length === registry.transitionCount;
  return Object.freeze({
    ...manifest,
    validationResult:
      validation.valid && manifestValidation.valid && matrixValid ? ("valid" as const) : ("invalid" as const),
    readOnly: true as const,
  });
}
