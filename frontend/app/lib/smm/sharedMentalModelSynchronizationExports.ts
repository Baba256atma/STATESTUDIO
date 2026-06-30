/**
 * SMM-5 — Public Synchronization Platform exports and facade.
 */

import {
  SMM_SYNC_CONTRACT_VERSION,
  SMM_SYNC_PLATFORM_ID,
  SMM_SYNC_PLATFORM_NAME,
  SMM_SYNC_PRINCIPLES,
  SMM_SYNC_PUBLIC_API_REGISTRY,
  SMM_SYNC_SNAPSHOT_DEPENDENCY,
} from "./sharedMentalModelSynchronizationContracts.ts";
import { getSharedMentalModelSynchronizationManifest } from "./sharedMentalModelSynchronizationManifest.ts";
import {
  ensureSharedMentalModelSynchronizationDependenciesReady,
  getSharedMentalModelSynchronizationPolicies,
  getSharedMentalModelSynchronizationRegistry,
  getSharedMentalModelSynchronizationRegistryBundle,
  registerSharedMentalModelSynchronization,
  registerSharedMentalModelSynchronizationManifest,
  registerSharedMentalModelSynchronizationReference,
  registerSharedMentalModelSynchronizationScope,
  resetSharedMentalModelSynchronizationStoreForTests,
} from "./sharedMentalModelSynchronizationRegistry.ts";
import type {
  SharedMentalModelSynchronizationBuildResult,
  SharedMentalModelSynchronizationLayerState,
  SharedMentalModelSynchronizationValidationReport,
} from "./sharedMentalModelSynchronizationTypes.ts";
import { validateSharedMentalModelSynchronizationRegistry } from "./sharedMentalModelSynchronizationValidation.ts";

let layerInitialized = false;
let lastInitializedAt: string | null = null;

export function resetSharedMentalModelSynchronizationLayerForTests(): void {
  layerInitialized = false;
  lastInitializedAt = null;
  resetSharedMentalModelSynchronizationStoreForTests();
}

export function getSharedMentalModelSynchronizationLayerState(
  timestamp: string = new Date(0).toISOString()
): SharedMentalModelSynchronizationLayerState {
  return Object.freeze({
    contractVersion: SMM_SYNC_CONTRACT_VERSION,
    snapshotDependency: SMM_SYNC_SNAPSHOT_DEPENDENCY,
    initialized: layerInitialized,
    registry: getSharedMentalModelSynchronizationRegistryBundle(),
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function buildSharedMentalModelSynchronizationPlatform(
  timestamp: string = new Date(0).toISOString()
): SharedMentalModelSynchronizationBuildResult {
  if (!ensureSharedMentalModelSynchronizationDependenciesReady(timestamp)) {
    return Object.freeze({
      success: false,
      reason: "SMM/1 through SMM/4 dependencies are not ready.",
      data: null,
      readOnly: true as const,
    });
  }
  layerInitialized = true;
  lastInitializedAt = timestamp;
  return Object.freeze({
    success: true,
    reason: "Shared Mental Model synchronization platform created.",
    data: getSharedMentalModelSynchronizationLayerState(timestamp),
    readOnly: true as const,
  });
}

export function validateSharedMentalModelSynchronization(): SharedMentalModelSynchronizationValidationReport {
  if (!layerInitialized) {
    return Object.freeze({
      valid: false,
      issues: Object.freeze([
        Object.freeze({
          code: "not_initialized",
          message: "Shared Mental Model synchronization platform has not been built.",
          readOnly: true as const,
        }),
      ]),
      readOnly: true as const,
    });
  }
  return validateSharedMentalModelSynchronizationRegistry(getSharedMentalModelSynchronizationRegistryBundle());
}

export function getSharedMentalModelSynchronizationManifestPublic() {
  return getSharedMentalModelSynchronizationManifest(getSharedMentalModelSynchronizationRegistryBundle());
}

export {
  getSharedMentalModelSynchronizationRegistry,
  getSharedMentalModelSynchronizationPolicies,
  getSharedMentalModelSynchronizationManifestPublic as getSharedMentalModelSynchronizationManifest,
  registerSharedMentalModelSynchronization,
  registerSharedMentalModelSynchronizationScope,
  registerSharedMentalModelSynchronizationReference,
  registerSharedMentalModelSynchronizationManifest,
  SMM_SYNC_PUBLIC_API_REGISTRY,
  SMM_SYNC_PRINCIPLES,
};

export const SharedMentalModelSynchronizationPlatform = Object.freeze({
  buildSharedMentalModelSynchronizationPlatform,
  validateSharedMentalModelSynchronization,
  getSharedMentalModelSynchronizationRegistry,
  getSharedMentalModelSynchronizationManifest: getSharedMentalModelSynchronizationManifestPublic,
  getSharedMentalModelSynchronizationPolicies,
  getSharedMentalModelSynchronizationLayerState,
  resetSharedMentalModelSynchronizationLayerForTests,
  version: SMM_SYNC_CONTRACT_VERSION,
});

export { SMM_SYNC_PLATFORM_ID, SMM_SYNC_PLATFORM_NAME };
