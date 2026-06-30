/**
 * ASS-8 — Public Executive Assistant Coordination Manifest exports and facade.
 */

import {
  ASS_COORDINATION_DEPENDENCY,
  ASS_COORDINATION_PLATFORM_ID,
  ASS_COORDINATION_PLATFORM_NAME,
  ASS_COORDINATION_PRINCIPLES,
  ASS_COORDINATION_PUBLIC_API_REGISTRY,
  ASS_COORDINATION_VERSION,
} from "./executiveAssistantCoordinationContracts.ts";
import { buildExecutiveAssistantCoordinationPlatformManifest } from "./executiveAssistantCoordinationManifest.ts";
import {
  ensureExecutiveAssistantCoordinationDependenciesReady,
  getExecutiveAssistantCompatibilityMatrix,
  getExecutiveAssistantCoordinationRegistry,
  getExecutiveAssistantCoordinationRegistryBundle,
  resetExecutiveAssistantCoordinationStoreForTests,
  seedExecutiveAssistantCoordinationRegistries,
} from "./executiveAssistantCoordinationRegistry.ts";
import type {
  ExecutiveAssistantCoordinationBuildResult,
  ExecutiveAssistantCoordinationLayerState,
  ExecutiveAssistantCoordinationValidationReport,
} from "./executiveAssistantCoordinationTypes.ts";
import { validateExecutiveAssistantCoordinationRegistry } from "./executiveAssistantCoordinationValidation.ts";

let layerInitialized = false;
let lastInitializedAt: string | null = null;

export function resetExecutiveAssistantCoordinationLayerForTests(): void {
  layerInitialized = false;
  lastInitializedAt = null;
  resetExecutiveAssistantCoordinationStoreForTests();
}

export function getExecutiveAssistantCoordinationLayerState(
  timestamp: string = new Date(0).toISOString()
): ExecutiveAssistantCoordinationLayerState {
  return Object.freeze({
    contractVersion: ASS_COORDINATION_VERSION,
    clarificationDependency: ASS_COORDINATION_DEPENDENCY,
    initialized: layerInitialized,
    registry: getExecutiveAssistantCoordinationRegistryBundle(),
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function buildExecutiveAssistantCoordinationManifest(
  timestamp: string = new Date(0).toISOString()
): ExecutiveAssistantCoordinationBuildResult {
  if (!ensureExecutiveAssistantCoordinationDependenciesReady(timestamp)) {
    return Object.freeze({
      success: false,
      reason: "ASS/7 clarification architecture dependency is not ready.",
      data: null,
      readOnly: true as const,
    });
  }
  seedExecutiveAssistantCoordinationRegistries(timestamp);
  layerInitialized = true;
  lastInitializedAt = timestamp;
  return Object.freeze({
    success: true,
    reason: "Executive assistant coordination manifest created.",
    data: getExecutiveAssistantCoordinationLayerState(timestamp),
    readOnly: true as const,
  });
}

export function validateExecutiveAssistantCoordinationManifest(): ExecutiveAssistantCoordinationValidationReport {
  if (!layerInitialized) {
    return Object.freeze({
      valid: false,
      issues: Object.freeze([
        Object.freeze({
          code: "not_initialized",
          message: "Executive assistant coordination manifest has not been built.",
          readOnly: true as const,
        }),
      ]),
      readOnly: true as const,
    });
  }
  return validateExecutiveAssistantCoordinationRegistry(getExecutiveAssistantCoordinationRegistryBundle());
}

export function getExecutiveAssistantCoordinationPlatformManifestPublic() {
  return buildExecutiveAssistantCoordinationPlatformManifest(getExecutiveAssistantCoordinationRegistryBundle());
}

export {
  getExecutiveAssistantCoordinationRegistry,
  getExecutiveAssistantCompatibilityMatrix,
  getExecutiveAssistantCoordinationPlatformManifestPublic as getExecutiveAssistantCoordinationPlatformManifest,
  ASS_COORDINATION_PUBLIC_API_REGISTRY,
  ASS_COORDINATION_PRINCIPLES,
};

export const ExecutiveAssistantCoordinationPlatform = Object.freeze({
  buildExecutiveAssistantCoordinationManifest,
  validateExecutiveAssistantCoordinationManifest,
  getExecutiveAssistantCoordinationRegistry,
  getExecutiveAssistantCoordinationPlatformManifest: getExecutiveAssistantCoordinationPlatformManifestPublic,
  getExecutiveAssistantCompatibilityMatrix,
  getExecutiveAssistantCoordinationLayerState,
  resetExecutiveAssistantCoordinationLayerForTests,
  version: ASS_COORDINATION_VERSION,
});

export { ASS_COORDINATION_PLATFORM_ID, ASS_COORDINATION_PLATFORM_NAME };
