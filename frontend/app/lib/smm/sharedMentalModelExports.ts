/**
 * SMM-2 — Public Shared Mental Model Domain exports and facade.
 */

import {
  SMM_DOMAIN_CONTRACT_VERSION,
  SMM_DOMAIN_FOUNDATION_DEPENDENCY,
  SMM_DOMAIN_MODEL_KEYS,
  SMM_DOMAIN_PLATFORM_ID,
  SMM_DOMAIN_PLATFORM_NAME,
  SMM_DOMAIN_PRINCIPLES,
  SMM_DOMAIN_PUBLIC_API_REGISTRY,
} from "./sharedMentalModelContracts.ts";
import { getSharedMentalModelManifest } from "./sharedMentalModelManifest.ts";
import {
  ensureSharedMentalModelDependenciesReady,
  getSharedMentalModelContractRegistry,
  resetSharedMentalModelRegistryForTests,
  seedSharedMentalModelRegistries,
} from "./sharedMentalModelRegistry.ts";
import type {
  SharedMentalModelBuildResult,
  SharedMentalModelLayerState,
  SharedMentalModelValidationReport,
} from "./sharedMentalModelTypes.ts";
import { validateSharedMentalModelContractRegistry } from "./sharedMentalModelValidation.ts";

let layerInitialized = false;
let lastInitializedAt: string | null = null;

export function resetSharedMentalModelDomainLayerForTests(): void {
  layerInitialized = false;
  lastInitializedAt = null;
  resetSharedMentalModelRegistryForTests();
}

export function getSharedMentalModelLayerState(
  timestamp: string = new Date(0).toISOString()
): SharedMentalModelLayerState {
  return Object.freeze({
    contractVersion: SMM_DOMAIN_CONTRACT_VERSION,
    foundationDependency: SMM_DOMAIN_FOUNDATION_DEPENDENCY,
    initialized: layerInitialized,
    registry: getSharedMentalModelContractRegistry(),
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function buildSharedMentalModelContracts(
  timestamp: string = new Date(0).toISOString()
): SharedMentalModelBuildResult {
  if (!ensureSharedMentalModelDependenciesReady(timestamp)) {
    return Object.freeze({
      success: false,
      reason: "SMM/1 foundation dependency is not ready.",
      data: null,
      readOnly: true as const,
    });
  }
  seedSharedMentalModelRegistries(timestamp);
  layerInitialized = true;
  lastInitializedAt = timestamp;
  return Object.freeze({
    success: true,
    reason: "Shared Mental Model domain contracts created.",
    data: getSharedMentalModelLayerState(timestamp),
    readOnly: true as const,
  });
}

export function validateSharedMentalModelContracts(): SharedMentalModelValidationReport {
  if (!layerInitialized) {
    return Object.freeze({
      valid: false,
      issues: Object.freeze([
        Object.freeze({
          code: "not_initialized",
          message: "Shared Mental Model domain contracts have not been built.",
          readOnly: true as const,
        }),
      ]),
      readOnly: true as const,
    });
  }
  return validateSharedMentalModelContractRegistry(getSharedMentalModelContractRegistry());
}

export function getSharedMentalModelManifestPublic() {
  return getSharedMentalModelManifest(getSharedMentalModelContractRegistry());
}

export {
  getSharedMentalModelContractRegistry,
  getSharedMentalModelManifestPublic as getSharedMentalModelManifest,
  SMM_DOMAIN_PUBLIC_API_REGISTRY,
  SMM_DOMAIN_PRINCIPLES,
  SMM_DOMAIN_MODEL_KEYS,
};

export const SharedMentalModelDomainPlatform = Object.freeze({
  buildSharedMentalModelContracts,
  validateSharedMentalModelContracts,
  getSharedMentalModelContractRegistry,
  getSharedMentalModelManifest: getSharedMentalModelManifestPublic,
  getSharedMentalModelLayerState,
  resetSharedMentalModelDomainLayerForTests,
  version: SMM_DOMAIN_CONTRACT_VERSION,
});

export function getSharedMentalModelDomainPlatformManifest() {
  return getSharedMentalModelManifest(getSharedMentalModelContractRegistry());
}

export {
  SMM_DOMAIN_PLATFORM_ID,
  SMM_DOMAIN_PLATFORM_NAME,
};
