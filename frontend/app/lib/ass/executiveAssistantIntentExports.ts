/**
 * ASS-5 — Public Executive Intent Interpretation Contract exports and facade.
 */

import {
  ASS_INTENT_DEPENDENCY,
  ASS_INTENT_PLATFORM_ID,
  ASS_INTENT_PLATFORM_NAME,
  ASS_INTENT_PRINCIPLES,
  ASS_INTENT_PUBLIC_API_REGISTRY,
  ASS_INTENT_VERSION,
} from "./executiveAssistantIntentContracts.ts";
import { getExecutiveAssistantIntentManifest } from "./executiveAssistantIntentManifest.ts";
import {
  ensureExecutiveAssistantIntentDependenciesReady,
  getExecutiveAssistantIntentRegistry,
  getExecutiveAssistantIntentRegistryBundle,
  getExecutiveAssistantIntentRouteBindingModel,
  resetExecutiveAssistantIntentStoreForTests,
  seedExecutiveAssistantIntentRegistries,
} from "./executiveAssistantIntentRegistry.ts";
import type {
  ExecutiveAssistantIntentBuildResult,
  ExecutiveAssistantIntentLayerState,
  ExecutiveAssistantIntentValidationReport,
} from "./executiveAssistantIntentTypes.ts";
import { validateExecutiveAssistantIntentRegistry } from "./executiveAssistantIntentValidation.ts";

let layerInitialized = false;
let lastInitializedAt: string | null = null;

export function resetExecutiveAssistantIntentLayerForTests(): void {
  layerInitialized = false;
  lastInitializedAt = null;
  resetExecutiveAssistantIntentStoreForTests();
}

export function getExecutiveAssistantIntentLayerState(
  timestamp: string = new Date(0).toISOString()
): ExecutiveAssistantIntentLayerState {
  return Object.freeze({
    contractVersion: ASS_INTENT_VERSION,
    routingDependency: ASS_INTENT_DEPENDENCY,
    initialized: layerInitialized,
    registry: getExecutiveAssistantIntentRegistryBundle(),
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function buildExecutiveAssistantIntentInterpretationContracts(
  timestamp: string = new Date(0).toISOString()
): ExecutiveAssistantIntentBuildResult {
  if (!ensureExecutiveAssistantIntentDependenciesReady(timestamp)) {
    return Object.freeze({
      success: false,
      reason: "ASS/4 routing architecture dependency is not ready.",
      data: null,
      readOnly: true as const,
    });
  }
  seedExecutiveAssistantIntentRegistries(timestamp);
  layerInitialized = true;
  lastInitializedAt = timestamp;
  return Object.freeze({
    success: true,
    reason: "Executive intent interpretation contracts created.",
    data: getExecutiveAssistantIntentLayerState(timestamp),
    readOnly: true as const,
  });
}

export function validateExecutiveAssistantIntentInterpretationContracts(): ExecutiveAssistantIntentValidationReport {
  if (!layerInitialized) {
    return Object.freeze({
      valid: false,
      issues: Object.freeze([
        Object.freeze({
          code: "not_initialized",
          message: "Executive intent interpretation contracts have not been built.",
          readOnly: true as const,
        }),
      ]),
      readOnly: true as const,
    });
  }
  return validateExecutiveAssistantIntentRegistry(getExecutiveAssistantIntentRegistryBundle());
}

export function getExecutiveAssistantIntentManifestPublic() {
  return getExecutiveAssistantIntentManifest(getExecutiveAssistantIntentRegistryBundle());
}

export {
  getExecutiveAssistantIntentRegistry,
  getExecutiveAssistantIntentRouteBindingModel,
  getExecutiveAssistantIntentManifestPublic as getExecutiveAssistantIntentManifest,
  ASS_INTENT_PUBLIC_API_REGISTRY,
  ASS_INTENT_PRINCIPLES,
};

export const ExecutiveAssistantIntentPlatform = Object.freeze({
  buildExecutiveAssistantIntentInterpretationContracts,
  validateExecutiveAssistantIntentInterpretationContracts,
  getExecutiveAssistantIntentRegistry,
  getExecutiveAssistantIntentManifest: getExecutiveAssistantIntentManifestPublic,
  getExecutiveAssistantIntentRouteBindingModel,
  getExecutiveAssistantIntentLayerState,
  resetExecutiveAssistantIntentLayerForTests,
  version: ASS_INTENT_VERSION,
});

export { ASS_INTENT_PLATFORM_ID, ASS_INTENT_PLATFORM_NAME };
