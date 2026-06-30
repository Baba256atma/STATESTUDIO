/**
 * ASS-7 — Public Executive Clarification Architecture exports and facade.
 */

import {
  ASS_CLARIFICATION_DEPENDENCY,
  ASS_CLARIFICATION_PLATFORM_ID,
  ASS_CLARIFICATION_PLATFORM_NAME,
  ASS_CLARIFICATION_PRINCIPLES,
  ASS_CLARIFICATION_PUBLIC_API_REGISTRY,
  ASS_CLARIFICATION_VERSION,
} from "./executiveAssistantClarificationContracts.ts";
import { getExecutiveAssistantClarificationManifest } from "./executiveAssistantClarificationManifest.ts";
import {
  ensureExecutiveAssistantClarificationDependenciesReady,
  getExecutiveAssistantClarificationBindingModel,
  getExecutiveAssistantClarificationRegistry,
  getExecutiveAssistantClarificationRegistryBundle,
  resetExecutiveAssistantClarificationStoreForTests,
  seedExecutiveAssistantClarificationRegistries,
} from "./executiveAssistantClarificationRegistry.ts";
import type {
  ExecutiveAssistantClarificationBuildResult,
  ExecutiveAssistantClarificationLayerState,
  ExecutiveAssistantClarificationValidationReport,
} from "./executiveAssistantClarificationTypes.ts";
import { validateExecutiveAssistantClarificationRegistry } from "./executiveAssistantClarificationValidation.ts";

let layerInitialized = false;
let lastInitializedAt: string | null = null;

export function resetExecutiveAssistantClarificationLayerForTests(): void {
  layerInitialized = false;
  lastInitializedAt = null;
  resetExecutiveAssistantClarificationStoreForTests();
}

export function getExecutiveAssistantClarificationLayerState(
  timestamp: string = new Date(0).toISOString()
): ExecutiveAssistantClarificationLayerState {
  return Object.freeze({
    contractVersion: ASS_CLARIFICATION_VERSION,
    responseDependency: ASS_CLARIFICATION_DEPENDENCY,
    initialized: layerInitialized,
    registry: getExecutiveAssistantClarificationRegistryBundle(),
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function buildExecutiveAssistantClarificationArchitecture(
  timestamp: string = new Date(0).toISOString()
): ExecutiveAssistantClarificationBuildResult {
  if (!ensureExecutiveAssistantClarificationDependenciesReady(timestamp)) {
    return Object.freeze({
      success: false,
      reason: "ASS/6 response contract dependency is not ready.",
      data: null,
      readOnly: true as const,
    });
  }
  seedExecutiveAssistantClarificationRegistries(timestamp);
  layerInitialized = true;
  lastInitializedAt = timestamp;
  return Object.freeze({
    success: true,
    reason: "Executive clarification architecture created.",
    data: getExecutiveAssistantClarificationLayerState(timestamp),
    readOnly: true as const,
  });
}

export function validateExecutiveAssistantClarificationArchitecture(): ExecutiveAssistantClarificationValidationReport {
  if (!layerInitialized) {
    return Object.freeze({
      valid: false,
      issues: Object.freeze([
        Object.freeze({
          code: "not_initialized",
          message: "Executive clarification architecture has not been built.",
          readOnly: true as const,
        }),
      ]),
      readOnly: true as const,
    });
  }
  return validateExecutiveAssistantClarificationRegistry(getExecutiveAssistantClarificationRegistryBundle());
}

export function getExecutiveAssistantClarificationManifestPublic() {
  return getExecutiveAssistantClarificationManifest(getExecutiveAssistantClarificationRegistryBundle());
}

export {
  getExecutiveAssistantClarificationRegistry,
  getExecutiveAssistantClarificationBindingModel,
  getExecutiveAssistantClarificationManifestPublic as getExecutiveAssistantClarificationManifest,
  ASS_CLARIFICATION_PUBLIC_API_REGISTRY,
  ASS_CLARIFICATION_PRINCIPLES,
};

export const ExecutiveAssistantClarificationPlatform = Object.freeze({
  buildExecutiveAssistantClarificationArchitecture,
  validateExecutiveAssistantClarificationArchitecture,
  getExecutiveAssistantClarificationRegistry,
  getExecutiveAssistantClarificationManifest: getExecutiveAssistantClarificationManifestPublic,
  getExecutiveAssistantClarificationBindingModel,
  getExecutiveAssistantClarificationLayerState,
  resetExecutiveAssistantClarificationLayerForTests,
  version: ASS_CLARIFICATION_VERSION,
});

export { ASS_CLARIFICATION_PLATFORM_ID, ASS_CLARIFICATION_PLATFORM_NAME };
