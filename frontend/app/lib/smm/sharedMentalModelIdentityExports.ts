/**
 * SMM-3 — Public Registry & Identity Engine exports and facade.
 */

import {
  SMM_IDENTITY_CONTRACT_VERSION,
  SMM_IDENTITY_DOMAIN_DEPENDENCY,
  SMM_IDENTITY_PLATFORM_ID,
  SMM_IDENTITY_PLATFORM_NAME,
  SMM_IDENTITY_PRINCIPLES,
  SMM_IDENTITY_PUBLIC_API_REGISTRY,
} from "./sharedMentalModelIdentityContracts.ts";
import { getSharedMentalModelRegistryManifest } from "./sharedMentalModelIdentityManifest.ts";
import {
  ensureSharedMentalModelIdentityDependenciesReady,
  getSharedMentalModelIdentityRegistry,
  registerSharedMentalModelArtifact,
  registerSharedMentalModelExecutive,
  registerSharedMentalModelIdentity,
  registerSharedMentalModelOrganization,
  registerSharedMentalModelReference,
  registerSharedMentalModelScenario,
  registerSharedMentalModelSnapshot,
  registerSharedMentalModelVersion,
  registerSharedMentalModelWorkspace,
  resetSharedMentalModelIdentityStoreForTests,
} from "./sharedMentalModelIdentityStore.ts";
import type {
  SharedMentalModelIdentityBuildResult,
  SharedMentalModelIdentityLayerState,
  SharedMentalModelIdentityValidationReport,
} from "./sharedMentalModelIdentityTypes.ts";
import { validateSharedMentalModelIdentityRegistry } from "./sharedMentalModelIdentityValidation.ts";
import { resolveSharedMentalModelReference } from "./sharedMentalModelReference.ts";

let layerInitialized = false;
let lastInitializedAt: string | null = null;

export function resetSharedMentalModelIdentityLayerForTests(): void {
  layerInitialized = false;
  lastInitializedAt = null;
  resetSharedMentalModelIdentityStoreForTests();
}

export function getSharedMentalModelIdentityLayerState(
  timestamp: string = new Date(0).toISOString()
): SharedMentalModelIdentityLayerState {
  return Object.freeze({
    contractVersion: SMM_IDENTITY_CONTRACT_VERSION,
    domainDependency: SMM_IDENTITY_DOMAIN_DEPENDENCY,
    initialized: layerInitialized,
    registry: getSharedMentalModelIdentityRegistry(),
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function buildSharedMentalModelRegistry(
  timestamp: string = new Date(0).toISOString()
): SharedMentalModelIdentityBuildResult {
  if (!ensureSharedMentalModelIdentityDependenciesReady(timestamp)) {
    return Object.freeze({
      success: false,
      reason: "SMM/1 and SMM/2 dependencies are not ready.",
      data: null,
      readOnly: true as const,
    });
  }
  layerInitialized = true;
  lastInitializedAt = timestamp;
  return Object.freeze({
    success: true,
    reason: "Shared Mental Model identity registry created.",
    data: getSharedMentalModelIdentityLayerState(timestamp),
    readOnly: true as const,
  });
}

export function validateSharedMentalModelRegistry(): SharedMentalModelIdentityValidationReport {
  if (!layerInitialized) {
    return Object.freeze({
      valid: false,
      issues: Object.freeze([
        Object.freeze({
          code: "not_initialized",
          message: "Shared Mental Model identity registry has not been built.",
          readOnly: true as const,
        }),
      ]),
      readOnly: true as const,
    });
  }
  return validateSharedMentalModelIdentityRegistry(getSharedMentalModelIdentityRegistry());
}

export function resolveSharedMentalModelReferencePublic(referenceId: string) {
  return resolveSharedMentalModelReference(referenceId, getSharedMentalModelIdentityRegistry());
}

export function getSharedMentalModelRegistryManifestPublic() {
  return getSharedMentalModelRegistryManifest(getSharedMentalModelIdentityRegistry());
}

export {
  getSharedMentalModelIdentityRegistry,
  resolveSharedMentalModelReferencePublic as resolveSharedMentalModelReference,
  getSharedMentalModelRegistryManifestPublic as getSharedMentalModelRegistryManifest,
  registerSharedMentalModelIdentity,
  registerSharedMentalModelReference,
  registerSharedMentalModelSnapshot,
  registerSharedMentalModelVersion,
  registerSharedMentalModelArtifact,
  registerSharedMentalModelExecutive,
  registerSharedMentalModelWorkspace,
  registerSharedMentalModelOrganization,
  registerSharedMentalModelScenario,
  SMM_IDENTITY_PUBLIC_API_REGISTRY,
  SMM_IDENTITY_PRINCIPLES,
};

export const SharedMentalModelIdentityPlatform = Object.freeze({
  buildSharedMentalModelRegistry,
  validateSharedMentalModelRegistry,
  getSharedMentalModelIdentityRegistry,
  resolveSharedMentalModelReference: resolveSharedMentalModelReferencePublic,
  getSharedMentalModelRegistryManifest: getSharedMentalModelRegistryManifestPublic,
  getSharedMentalModelIdentityLayerState,
  resetSharedMentalModelIdentityLayerForTests,
  version: SMM_IDENTITY_CONTRACT_VERSION,
});

export { SMM_IDENTITY_PLATFORM_ID, SMM_IDENTITY_PLATFORM_NAME };
