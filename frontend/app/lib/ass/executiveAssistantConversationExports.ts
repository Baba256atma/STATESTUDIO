/**
 * ASS-2 — Public Executive Conversation Contract exports and facade.
 */

import {
  ASS_CONVERSATION_CONTRACT_VERSION,
  ASS_CONVERSATION_FOUNDATION_DEPENDENCY,
  ASS_CONVERSATION_PLATFORM_ID,
  ASS_CONVERSATION_PLATFORM_NAME,
  ASS_CONVERSATION_PRINCIPLES,
  ASS_CONVERSATION_PUBLIC_API_REGISTRY,
} from "./executiveAssistantConversationContracts.ts";
import { getExecutiveAssistantConversationManifest } from "./executiveAssistantConversationManifest.ts";
import {
  ensureExecutiveAssistantConversationDependenciesReady,
  getExecutiveAssistantConversationRegistry,
  getExecutiveAssistantConversationRegistryBundle,
  registerExecutiveAssistantConversationIdentity,
  registerExecutiveAssistantMessageContract,
  registerExecutiveAssistantScopeBinding,
  registerExecutiveAssistantSessionContract,
  registerExecutiveAssistantTurnContract,
  resetExecutiveAssistantConversationStoreForTests,
  seedExecutiveAssistantConversationRegistries,
} from "./executiveAssistantConversationRegistry.ts";
import type {
  ExecutiveAssistantConversationBuildResult,
  ExecutiveAssistantConversationLayerState,
  ExecutiveAssistantConversationValidationReport,
} from "./executiveAssistantConversationTypes.ts";
import { validateExecutiveAssistantConversationRegistry } from "./executiveAssistantConversationValidation.ts";

let layerInitialized = false;
let lastInitializedAt: string | null = null;

export function resetExecutiveAssistantConversationLayerForTests(): void {
  layerInitialized = false;
  lastInitializedAt = null;
  resetExecutiveAssistantConversationStoreForTests();
}

export function getExecutiveAssistantConversationLayerState(
  timestamp: string = new Date(0).toISOString()
): ExecutiveAssistantConversationLayerState {
  return Object.freeze({
    contractVersion: ASS_CONVERSATION_CONTRACT_VERSION,
    foundationDependency: ASS_CONVERSATION_FOUNDATION_DEPENDENCY,
    initialized: layerInitialized,
    registry: getExecutiveAssistantConversationRegistryBundle(),
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function buildExecutiveAssistantConversationContracts(
  timestamp: string = new Date(0).toISOString()
): ExecutiveAssistantConversationBuildResult {
  if (!ensureExecutiveAssistantConversationDependenciesReady(timestamp)) {
    return Object.freeze({
      success: false,
      reason: "ASS/1 foundation dependency is not ready.",
      data: null,
      readOnly: true as const,
    });
  }
  seedExecutiveAssistantConversationRegistries(timestamp);
  layerInitialized = true;
  lastInitializedAt = timestamp;
  return Object.freeze({
    success: true,
    reason: "Executive conversation contract foundation created.",
    data: getExecutiveAssistantConversationLayerState(timestamp),
    readOnly: true as const,
  });
}

export function validateExecutiveAssistantConversationContracts(): ExecutiveAssistantConversationValidationReport {
  if (!layerInitialized) {
    return Object.freeze({
      valid: false,
      issues: Object.freeze([
        Object.freeze({
          code: "not_initialized",
          message: "Executive conversation contracts have not been built.",
          readOnly: true as const,
        }),
      ]),
      readOnly: true as const,
    });
  }
  return validateExecutiveAssistantConversationRegistry(getExecutiveAssistantConversationRegistryBundle());
}

export function getExecutiveAssistantConversationManifestPublic() {
  return getExecutiveAssistantConversationManifest(getExecutiveAssistantConversationRegistryBundle());
}

export {
  getExecutiveAssistantConversationRegistry,
  getExecutiveAssistantConversationManifestPublic as getExecutiveAssistantConversationManifest,
  registerExecutiveAssistantConversationIdentity,
  registerExecutiveAssistantSessionContract,
  registerExecutiveAssistantTurnContract,
  registerExecutiveAssistantMessageContract,
  registerExecutiveAssistantScopeBinding,
  ASS_CONVERSATION_PUBLIC_API_REGISTRY,
  ASS_CONVERSATION_PRINCIPLES,
};

export const ExecutiveAssistantConversationPlatform = Object.freeze({
  buildExecutiveAssistantConversationContracts,
  validateExecutiveAssistantConversationContracts,
  getExecutiveAssistantConversationRegistry,
  getExecutiveAssistantConversationManifest: getExecutiveAssistantConversationManifestPublic,
  getExecutiveAssistantConversationLayerState,
  resetExecutiveAssistantConversationLayerForTests,
  version: ASS_CONVERSATION_CONTRACT_VERSION,
});

export { ASS_CONVERSATION_PLATFORM_ID, ASS_CONVERSATION_PLATFORM_NAME };
