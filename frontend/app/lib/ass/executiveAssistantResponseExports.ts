/**
 * ASS-6 — Public Executive Response Contract Architecture exports and facade.
 */

import {
  ASS_RESPONSE_DEPENDENCY,
  ASS_RESPONSE_PLATFORM_ID,
  ASS_RESPONSE_PLATFORM_NAME,
  ASS_RESPONSE_PRINCIPLES,
  ASS_RESPONSE_PUBLIC_API_REGISTRY,
  ASS_RESPONSE_VERSION,
} from "./executiveAssistantResponseContracts.ts";
import { getExecutiveAssistantResponseManifest } from "./executiveAssistantResponseManifest.ts";
import {
  ensureExecutiveAssistantResponseDependenciesReady,
  getExecutiveAssistantResponseIntentBindingModel,
  getExecutiveAssistantResponseRegistry,
  getExecutiveAssistantResponseRegistryBundle,
  resetExecutiveAssistantResponseStoreForTests,
  seedExecutiveAssistantResponseRegistries,
} from "./executiveAssistantResponseRegistry.ts";
import type {
  ExecutiveAssistantResponseBuildResult,
  ExecutiveAssistantResponseLayerState,
  ExecutiveAssistantResponseValidationReport,
} from "./executiveAssistantResponseTypes.ts";
import { validateExecutiveAssistantResponseRegistry } from "./executiveAssistantResponseValidation.ts";

let layerInitialized = false;
let lastInitializedAt: string | null = null;

export function resetExecutiveAssistantResponseLayerForTests(): void {
  layerInitialized = false;
  lastInitializedAt = null;
  resetExecutiveAssistantResponseStoreForTests();
}

export function getExecutiveAssistantResponseLayerState(
  timestamp: string = new Date(0).toISOString()
): ExecutiveAssistantResponseLayerState {
  return Object.freeze({
    contractVersion: ASS_RESPONSE_VERSION,
    intentDependency: ASS_RESPONSE_DEPENDENCY,
    initialized: layerInitialized,
    registry: getExecutiveAssistantResponseRegistryBundle(),
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function buildExecutiveAssistantResponseContractArchitecture(
  timestamp: string = new Date(0).toISOString()
): ExecutiveAssistantResponseBuildResult {
  if (!ensureExecutiveAssistantResponseDependenciesReady(timestamp)) {
    return Object.freeze({
      success: false,
      reason: "ASS/5 intent interpretation dependency is not ready.",
      data: null,
      readOnly: true as const,
    });
  }
  seedExecutiveAssistantResponseRegistries(timestamp);
  layerInitialized = true;
  lastInitializedAt = timestamp;
  return Object.freeze({
    success: true,
    reason: "Executive response contract architecture created.",
    data: getExecutiveAssistantResponseLayerState(timestamp),
    readOnly: true as const,
  });
}

export function validateExecutiveAssistantResponseContractArchitecture(): ExecutiveAssistantResponseValidationReport {
  if (!layerInitialized) {
    return Object.freeze({
      valid: false,
      issues: Object.freeze([
        Object.freeze({
          code: "not_initialized",
          message: "Executive response contract architecture has not been built.",
          readOnly: true as const,
        }),
      ]),
      readOnly: true as const,
    });
  }
  return validateExecutiveAssistantResponseRegistry(getExecutiveAssistantResponseRegistryBundle());
}

export function getExecutiveAssistantResponseManifestPublic() {
  return getExecutiveAssistantResponseManifest(getExecutiveAssistantResponseRegistryBundle());
}

export {
  getExecutiveAssistantResponseRegistry,
  getExecutiveAssistantResponseIntentBindingModel,
  getExecutiveAssistantResponseManifestPublic as getExecutiveAssistantResponseManifest,
  ASS_RESPONSE_PUBLIC_API_REGISTRY,
  ASS_RESPONSE_PRINCIPLES,
};

export const ExecutiveAssistantResponsePlatform = Object.freeze({
  buildExecutiveAssistantResponseContractArchitecture,
  validateExecutiveAssistantResponseContractArchitecture,
  getExecutiveAssistantResponseRegistry,
  getExecutiveAssistantResponseManifest: getExecutiveAssistantResponseManifestPublic,
  getExecutiveAssistantResponseIntentBindingModel,
  getExecutiveAssistantResponseLayerState,
  resetExecutiveAssistantResponseLayerForTests,
  version: ASS_RESPONSE_VERSION,
});

export { ASS_RESPONSE_PLATFORM_ID, ASS_RESPONSE_PLATFORM_NAME };
