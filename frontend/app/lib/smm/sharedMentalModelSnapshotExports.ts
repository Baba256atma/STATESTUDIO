/**
 * SMM-4 — Public Snapshot & Version Platform exports and facade.
 */

import {
  SMM_SNAPSHOT_CONTRACT_VERSION,
  SMM_SNAPSHOT_IDENTITY_DEPENDENCY,
  SMM_SNAPSHOT_PLATFORM_ID,
  SMM_SNAPSHOT_PLATFORM_NAME,
  SMM_SNAPSHOT_PRINCIPLES,
  SMM_SNAPSHOT_PUBLIC_API_REGISTRY,
} from "./sharedMentalModelSnapshotContracts.ts";
import { getSharedMentalModelSnapshotManifest } from "./sharedMentalModelSnapshotManifest.ts";
import {
  ensureSharedMentalModelSnapshotDependenciesReady,
  getSharedMentalModelSnapshotRegistry,
  getSharedMentalModelSnapshotRegistryBundle,
  getSharedMentalModelVersionRegistry,
  registerSharedMentalModelBranch,
  registerSharedMentalModelLineage,
  registerSharedMentalModelSnapshot,
  registerSharedMentalModelSnapshotLifecycle,
  registerSharedMentalModelSnapshotManifest,
  registerSharedMentalModelVersionPlatform,
  resetSharedMentalModelSnapshotStoreForTests,
} from "./sharedMentalModelSnapshotRegistry.ts";
import type {
  SharedMentalModelSnapshotBuildResult,
  SharedMentalModelSnapshotLayerState,
  SharedMentalModelSnapshotValidationReport,
} from "./sharedMentalModelSnapshotTypes.ts";
import { validateSharedMentalModelSnapshotRegistry } from "./sharedMentalModelSnapshotValidation.ts";

let layerInitialized = false;
let lastInitializedAt: string | null = null;

export function resetSharedMentalModelSnapshotLayerForTests(): void {
  layerInitialized = false;
  lastInitializedAt = null;
  resetSharedMentalModelSnapshotStoreForTests();
}

export function getSharedMentalModelSnapshotLayerState(
  timestamp: string = new Date(0).toISOString()
): SharedMentalModelSnapshotLayerState {
  return Object.freeze({
    contractVersion: SMM_SNAPSHOT_CONTRACT_VERSION,
    identityDependency: SMM_SNAPSHOT_IDENTITY_DEPENDENCY,
    initialized: layerInitialized,
    registry: getSharedMentalModelSnapshotRegistryBundle(),
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function buildSharedMentalModelSnapshotPlatform(
  timestamp: string = new Date(0).toISOString()
): SharedMentalModelSnapshotBuildResult {
  if (!ensureSharedMentalModelSnapshotDependenciesReady(timestamp)) {
    return Object.freeze({
      success: false,
      reason: "SMM/1, SMM/2, and SMM/3 dependencies are not ready.",
      data: null,
      readOnly: true as const,
    });
  }
  layerInitialized = true;
  lastInitializedAt = timestamp;
  return Object.freeze({
    success: true,
    reason: "Shared Mental Model snapshot & version platform created.",
    data: getSharedMentalModelSnapshotLayerState(timestamp),
    readOnly: true as const,
  });
}

export function validateSharedMentalModelSnapshots(): SharedMentalModelSnapshotValidationReport {
  if (!layerInitialized) {
    return Object.freeze({
      valid: false,
      issues: Object.freeze([
        Object.freeze({
          code: "not_initialized",
          message: "Shared Mental Model snapshot platform has not been built.",
          readOnly: true as const,
        }),
      ]),
      readOnly: true as const,
    });
  }
  return validateSharedMentalModelSnapshotRegistry(getSharedMentalModelSnapshotRegistryBundle());
}

export function getSharedMentalModelSnapshotManifestPublic() {
  return getSharedMentalModelSnapshotManifest(getSharedMentalModelSnapshotRegistryBundle());
}

export {
  getSharedMentalModelSnapshotRegistry,
  getSharedMentalModelVersionRegistry,
  getSharedMentalModelSnapshotManifestPublic as getSharedMentalModelSnapshotManifest,
  registerSharedMentalModelSnapshot,
  registerSharedMentalModelVersionPlatform,
  registerSharedMentalModelBranch,
  registerSharedMentalModelLineage,
  registerSharedMentalModelSnapshotManifest,
  registerSharedMentalModelSnapshotLifecycle,
  SMM_SNAPSHOT_PUBLIC_API_REGISTRY,
  SMM_SNAPSHOT_PRINCIPLES,
};

export const SharedMentalModelSnapshotPlatform = Object.freeze({
  buildSharedMentalModelSnapshotPlatform,
  validateSharedMentalModelSnapshots,
  getSharedMentalModelSnapshotRegistry,
  getSharedMentalModelVersionRegistry,
  getSharedMentalModelSnapshotManifest: getSharedMentalModelSnapshotManifestPublic,
  getSharedMentalModelSnapshotLayerState,
  resetSharedMentalModelSnapshotLayerForTests,
  version: SMM_SNAPSHOT_CONTRACT_VERSION,
});

export { SMM_SNAPSHOT_PLATFORM_ID, SMM_SNAPSHOT_PLATFORM_NAME };
