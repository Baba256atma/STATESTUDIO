/**
 * SMM-6 — Public Query & Read Model Platform exports and facade.
 */

import {
  SMM_QUERY_CONTRACT_VERSION,
  SMM_QUERY_PLATFORM_ID,
  SMM_QUERY_PLATFORM_NAME,
  SMM_QUERY_PRINCIPLES,
  SMM_QUERY_PUBLIC_API_REGISTRY,
  SMM_QUERY_SYNC_DEPENDENCY,
} from "./sharedMentalModelQueryContracts.ts";
import { getSharedMentalModelQueryManifest } from "./sharedMentalModelQueryManifest.ts";
import {
  ensureSharedMentalModelQueryDependenciesReady,
  getSharedMentalModelQueryRegistry,
  getSharedMentalModelQueryRegistryBundle,
  getSharedMentalModelReadModelRegistry,
  registerSharedMentalModelQuery,
  registerSharedMentalModelQueryFilter,
  registerSharedMentalModelQueryManifest,
  registerSharedMentalModelQueryPagination,
  registerSharedMentalModelQueryProjection,
  registerSharedMentalModelQueryScope,
  registerSharedMentalModelQuerySort,
  registerSharedMentalModelReadModel,
  resetSharedMentalModelQueryStoreForTests,
} from "./sharedMentalModelQueryRegistry.ts";
import type {
  SharedMentalModelQueryBuildResult,
  SharedMentalModelQueryLayerState,
  SharedMentalModelQueryValidationReport,
} from "./sharedMentalModelQueryTypes.ts";
import { validateSharedMentalModelQueryRegistry } from "./sharedMentalModelQueryValidation.ts";

let layerInitialized = false;
let lastInitializedAt: string | null = null;

export function resetSharedMentalModelQueryLayerForTests(): void {
  layerInitialized = false;
  lastInitializedAt = null;
  resetSharedMentalModelQueryStoreForTests();
}

export function getSharedMentalModelQueryLayerState(
  timestamp: string = new Date(0).toISOString()
): SharedMentalModelQueryLayerState {
  return Object.freeze({
    contractVersion: SMM_QUERY_CONTRACT_VERSION,
    syncDependency: SMM_QUERY_SYNC_DEPENDENCY,
    initialized: layerInitialized,
    registry: getSharedMentalModelQueryRegistryBundle(),
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function buildSharedMentalModelQueryPlatform(
  timestamp: string = new Date(0).toISOString()
): SharedMentalModelQueryBuildResult {
  if (!ensureSharedMentalModelQueryDependenciesReady(timestamp)) {
    return Object.freeze({
      success: false,
      reason: "SMM/1 through SMM/5 dependencies are not ready.",
      data: null,
      readOnly: true as const,
    });
  }
  layerInitialized = true;
  lastInitializedAt = timestamp;
  return Object.freeze({
    success: true,
    reason: "Shared Mental Model query & read model platform created.",
    data: getSharedMentalModelQueryLayerState(timestamp),
    readOnly: true as const,
  });
}

export function validateSharedMentalModelQueries(): SharedMentalModelQueryValidationReport {
  if (!layerInitialized) {
    return Object.freeze({
      valid: false,
      issues: Object.freeze([
        Object.freeze({
          code: "not_initialized",
          message: "Shared Mental Model query platform has not been built.",
          readOnly: true as const,
        }),
      ]),
      readOnly: true as const,
    });
  }
  return validateSharedMentalModelQueryRegistry(getSharedMentalModelQueryRegistryBundle());
}

export function getSharedMentalModelQueryManifestPublic() {
  return getSharedMentalModelQueryManifest(getSharedMentalModelQueryRegistryBundle());
}

export {
  getSharedMentalModelQueryRegistry,
  getSharedMentalModelReadModelRegistry,
  getSharedMentalModelQueryManifestPublic as getSharedMentalModelQueryManifest,
  registerSharedMentalModelQuery,
  registerSharedMentalModelQueryScope,
  registerSharedMentalModelQueryFilter,
  registerSharedMentalModelQuerySort,
  registerSharedMentalModelQueryPagination,
  registerSharedMentalModelQueryProjection,
  registerSharedMentalModelReadModel,
  registerSharedMentalModelQueryManifest,
  SMM_QUERY_PUBLIC_API_REGISTRY,
  SMM_QUERY_PRINCIPLES,
};

export const SharedMentalModelQueryPlatform = Object.freeze({
  buildSharedMentalModelQueryPlatform,
  validateSharedMentalModelQueries,
  getSharedMentalModelQueryRegistry,
  getSharedMentalModelReadModelRegistry,
  getSharedMentalModelQueryManifest: getSharedMentalModelQueryManifestPublic,
  getSharedMentalModelQueryLayerState,
  resetSharedMentalModelQueryLayerForTests,
  version: SMM_QUERY_CONTRACT_VERSION,
});

export { SMM_QUERY_PLATFORM_ID, SMM_QUERY_PLATFORM_NAME };
