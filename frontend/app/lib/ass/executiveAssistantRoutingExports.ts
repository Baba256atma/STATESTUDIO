/**
 * ASS-4 — Public Executive Conversation Routing Architecture exports and facade.
 */

import {
  ASS_ROUTING_DEPENDENCY,
  ASS_ROUTING_PLATFORM_ID,
  ASS_ROUTING_PLATFORM_NAME,
  ASS_ROUTING_PRINCIPLES,
  ASS_ROUTING_PUBLIC_API_REGISTRY,
  ASS_ROUTING_VERSION,
} from "./executiveAssistantRoutingContracts.ts";
import { getExecutiveAssistantRoutingManifest } from "./executiveAssistantRoutingManifest.ts";
import {
  ensureExecutiveAssistantRoutingDependenciesReady,
  getExecutiveAssistantCoordinationTargets,
  getExecutiveAssistantRoutingRegistry,
  getExecutiveAssistantRoutingRegistryBundle,
  resetExecutiveAssistantRoutingStoreForTests,
  seedExecutiveAssistantRoutingRegistries,
} from "./executiveAssistantRoutingRegistry.ts";
import type {
  ExecutiveAssistantRoutingBuildResult,
  ExecutiveAssistantRoutingLayerState,
  ExecutiveAssistantRoutingValidationReport,
} from "./executiveAssistantRoutingTypes.ts";
import { validateExecutiveAssistantRoutingRegistry } from "./executiveAssistantRoutingValidation.ts";

let layerInitialized = false;
let lastInitializedAt: string | null = null;

export function resetExecutiveAssistantRoutingLayerForTests(): void {
  layerInitialized = false;
  lastInitializedAt = null;
  resetExecutiveAssistantRoutingStoreForTests();
}

export function getExecutiveAssistantRoutingLayerState(
  timestamp: string = new Date(0).toISOString()
): ExecutiveAssistantRoutingLayerState {
  return Object.freeze({
    contractVersion: ASS_ROUTING_VERSION,
    stateDependency: ASS_ROUTING_DEPENDENCY,
    initialized: layerInitialized,
    registry: getExecutiveAssistantRoutingRegistryBundle(),
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function buildExecutiveAssistantRoutingArchitecture(
  timestamp: string = new Date(0).toISOString()
): ExecutiveAssistantRoutingBuildResult {
  if (!ensureExecutiveAssistantRoutingDependenciesReady(timestamp)) {
    return Object.freeze({
      success: false,
      reason: "ASS/3 conversation state dependency is not ready.",
      data: null,
      readOnly: true as const,
    });
  }
  seedExecutiveAssistantRoutingRegistries(timestamp);
  layerInitialized = true;
  lastInitializedAt = timestamp;
  return Object.freeze({
    success: true,
    reason: "Executive conversation routing architecture created.",
    data: getExecutiveAssistantRoutingLayerState(timestamp),
    readOnly: true as const,
  });
}

export function validateExecutiveAssistantRoutingArchitecture(): ExecutiveAssistantRoutingValidationReport {
  if (!layerInitialized) {
    return Object.freeze({
      valid: false,
      issues: Object.freeze([
        Object.freeze({
          code: "not_initialized",
          message: "Executive conversation routing architecture has not been built.",
          readOnly: true as const,
        }),
      ]),
      readOnly: true as const,
    });
  }
  return validateExecutiveAssistantRoutingRegistry(getExecutiveAssistantRoutingRegistryBundle());
}

export function getExecutiveAssistantRoutingManifestPublic() {
  return getExecutiveAssistantRoutingManifest(getExecutiveAssistantRoutingRegistryBundle());
}

export {
  getExecutiveAssistantRoutingRegistry,
  getExecutiveAssistantCoordinationTargets,
  getExecutiveAssistantRoutingManifestPublic as getExecutiveAssistantRoutingManifest,
  ASS_ROUTING_PUBLIC_API_REGISTRY,
  ASS_ROUTING_PRINCIPLES,
};

export const ExecutiveAssistantRoutingPlatform = Object.freeze({
  buildExecutiveAssistantRoutingArchitecture,
  validateExecutiveAssistantRoutingArchitecture,
  getExecutiveAssistantRoutingRegistry,
  getExecutiveAssistantRoutingManifest: getExecutiveAssistantRoutingManifestPublic,
  getExecutiveAssistantCoordinationTargets,
  getExecutiveAssistantRoutingLayerState,
  resetExecutiveAssistantRoutingLayerForTests,
  version: ASS_ROUTING_VERSION,
});

export { ASS_ROUTING_PLATFORM_ID, ASS_ROUTING_PLATFORM_NAME };
