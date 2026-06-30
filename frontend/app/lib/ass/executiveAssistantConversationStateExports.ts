/**
 * ASS-3 — Public Executive Conversation State Architecture exports and facade.
 */

import {
  ASS_CONVERSATION_STATE_PLATFORM_ID,
  ASS_CONVERSATION_STATE_PLATFORM_NAME,
  ASS_CONVERSATION_STATE_PRINCIPLES,
  ASS_CONVERSATION_STATE_PUBLIC_API_REGISTRY,
  ASS_CONVERSATION_STATE_VERSION,
  ASS_CONVERSATION_STATE_DEPENDENCY,
} from "./executiveAssistantConversationStateContracts.ts";
import { getExecutiveAssistantConversationStateManifest } from "./executiveAssistantConversationStateManifest.ts";
import {
  ensureExecutiveAssistantConversationStateDependenciesReady,
  getExecutiveAssistantConversationStateRegistry,
  getExecutiveAssistantConversationStateRegistryBundle,
  getExecutiveAssistantTransitionMatrix,
  resetExecutiveAssistantConversationStateStoreForTests,
  seedExecutiveAssistantConversationStateRegistries,
} from "./executiveAssistantConversationStateRegistry.ts";
import type {
  ExecutiveAssistantConversationStateBuildResult,
  ExecutiveAssistantConversationStateLayerState,
  ExecutiveAssistantConversationStateValidationReport,
} from "./executiveAssistantConversationStateTypes.ts";
import { validateExecutiveAssistantConversationStateRegistry } from "./executiveAssistantConversationStateValidation.ts";

let layerInitialized = false;
let lastInitializedAt: string | null = null;

export function resetExecutiveAssistantConversationStateLayerForTests(): void {
  layerInitialized = false;
  lastInitializedAt = null;
  resetExecutiveAssistantConversationStateStoreForTests();
}

export function getExecutiveAssistantConversationStateLayerState(
  timestamp: string = new Date(0).toISOString()
): ExecutiveAssistantConversationStateLayerState {
  return Object.freeze({
    contractVersion: ASS_CONVERSATION_STATE_VERSION,
    conversationDependency: ASS_CONVERSATION_STATE_DEPENDENCY,
    initialized: layerInitialized,
    registry: getExecutiveAssistantConversationStateRegistryBundle(),
    transitionMatrix: getExecutiveAssistantTransitionMatrix(),
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function buildExecutiveAssistantConversationStateArchitecture(
  timestamp: string = new Date(0).toISOString()
): ExecutiveAssistantConversationStateBuildResult {
  if (!ensureExecutiveAssistantConversationStateDependenciesReady(timestamp)) {
    return Object.freeze({
      success: false,
      reason: "ASS/2 conversation contract dependency is not ready.",
      data: null,
      readOnly: true as const,
    });
  }
  seedExecutiveAssistantConversationStateRegistries(timestamp);
  layerInitialized = true;
  lastInitializedAt = timestamp;
  return Object.freeze({
    success: true,
    reason: "Executive conversation state architecture created.",
    data: getExecutiveAssistantConversationStateLayerState(timestamp),
    readOnly: true as const,
  });
}

export function validateExecutiveAssistantConversationStateArchitecture(): ExecutiveAssistantConversationStateValidationReport {
  if (!layerInitialized) {
    return Object.freeze({
      valid: false,
      issues: Object.freeze([
        Object.freeze({
          code: "not_initialized",
          message: "Executive conversation state architecture has not been built.",
          readOnly: true as const,
        }),
      ]),
      readOnly: true as const,
    });
  }
  return validateExecutiveAssistantConversationStateRegistry(getExecutiveAssistantConversationStateRegistryBundle());
}

export function getExecutiveAssistantConversationStateManifestPublic() {
  return getExecutiveAssistantConversationStateManifest(getExecutiveAssistantConversationStateRegistryBundle());
}

export {
  getExecutiveAssistantConversationStateRegistry,
  getExecutiveAssistantTransitionMatrix,
  getExecutiveAssistantConversationStateManifestPublic as getExecutiveAssistantConversationStateManifest,
  ASS_CONVERSATION_STATE_PUBLIC_API_REGISTRY,
  ASS_CONVERSATION_STATE_PRINCIPLES,
};

export const ExecutiveAssistantConversationStatePlatform = Object.freeze({
  buildExecutiveAssistantConversationStateArchitecture,
  validateExecutiveAssistantConversationStateArchitecture,
  getExecutiveAssistantConversationStateRegistry,
  getExecutiveAssistantConversationStateManifest: getExecutiveAssistantConversationStateManifestPublic,
  getExecutiveAssistantTransitionMatrix,
  getExecutiveAssistantConversationStateLayerState,
  resetExecutiveAssistantConversationStateLayerForTests,
  version: ASS_CONVERSATION_STATE_VERSION,
});

export { ASS_CONVERSATION_STATE_PLATFORM_ID, ASS_CONVERSATION_STATE_PLATFORM_NAME };
