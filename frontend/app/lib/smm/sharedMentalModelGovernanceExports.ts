/**
 * SMM-7 — Public Governance Platform exports and facade.
 */

import {
  SMM_GOVERNANCE_CONTRACT_VERSION,
  SMM_GOVERNANCE_PLATFORM_ID,
  SMM_GOVERNANCE_PLATFORM_NAME,
  SMM_GOVERNANCE_PRINCIPLES,
  SMM_GOVERNANCE_PUBLIC_API_REGISTRY,
  SMM_GOVERNANCE_QUERY_DEPENDENCY,
} from "./sharedMentalModelGovernanceContracts.ts";
import { getSharedMentalModelGovernanceManifest } from "./sharedMentalModelGovernanceManifest.ts";
import {
  ensureSharedMentalModelGovernanceDependenciesReady,
  getSharedMentalModelGovernancePolicies,
  getSharedMentalModelGovernanceRegistry,
  getSharedMentalModelGovernanceRegistryBundle,
  registerSharedMentalModelCompliance,
  registerSharedMentalModelGovernance,
  registerSharedMentalModelGovernanceAudit,
  registerSharedMentalModelGovernanceLifecycle,
  registerSharedMentalModelGovernanceManifest,
  registerSharedMentalModelOwnership,
  registerSharedMentalModelStewardship,
  resetSharedMentalModelGovernanceStoreForTests,
} from "./sharedMentalModelGovernanceRegistry.ts";
import type {
  SharedMentalModelGovernanceBuildResult,
  SharedMentalModelGovernanceLayerState,
  SharedMentalModelGovernanceValidationReport,
} from "./sharedMentalModelGovernanceTypes.ts";
import { validateSharedMentalModelGovernanceRegistry } from "./sharedMentalModelGovernanceValidation.ts";

let layerInitialized = false;
let lastInitializedAt: string | null = null;

export function resetSharedMentalModelGovernanceLayerForTests(): void {
  layerInitialized = false;
  lastInitializedAt = null;
  resetSharedMentalModelGovernanceStoreForTests();
}

export function getSharedMentalModelGovernanceLayerState(
  timestamp: string = new Date(0).toISOString()
): SharedMentalModelGovernanceLayerState {
  return Object.freeze({
    contractVersion: SMM_GOVERNANCE_CONTRACT_VERSION,
    queryDependency: SMM_GOVERNANCE_QUERY_DEPENDENCY,
    initialized: layerInitialized,
    registry: getSharedMentalModelGovernanceRegistryBundle(),
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function buildSharedMentalModelGovernancePlatform(
  timestamp: string = new Date(0).toISOString()
): SharedMentalModelGovernanceBuildResult {
  if (!ensureSharedMentalModelGovernanceDependenciesReady(timestamp)) {
    return Object.freeze({
      success: false,
      reason: "SMM/1 through SMM/6 dependencies are not ready.",
      data: null,
      readOnly: true as const,
    });
  }
  layerInitialized = true;
  lastInitializedAt = timestamp;
  return Object.freeze({
    success: true,
    reason: "Shared Mental Model governance platform created.",
    data: getSharedMentalModelGovernanceLayerState(timestamp),
    readOnly: true as const,
  });
}

export function validateSharedMentalModelGovernance(): SharedMentalModelGovernanceValidationReport {
  if (!layerInitialized) {
    return Object.freeze({
      valid: false,
      issues: Object.freeze([
        Object.freeze({
          code: "not_initialized",
          message: "Shared Mental Model governance platform has not been built.",
          readOnly: true as const,
        }),
      ]),
      readOnly: true as const,
    });
  }
  return validateSharedMentalModelGovernanceRegistry(getSharedMentalModelGovernanceRegistryBundle());
}

export function getSharedMentalModelGovernanceManifestPublic() {
  return getSharedMentalModelGovernanceManifest(getSharedMentalModelGovernanceRegistryBundle());
}

export {
  getSharedMentalModelGovernanceRegistry,
  getSharedMentalModelGovernancePolicies,
  getSharedMentalModelGovernanceManifestPublic as getSharedMentalModelGovernanceManifest,
  registerSharedMentalModelGovernance,
  registerSharedMentalModelOwnership,
  registerSharedMentalModelStewardship,
  registerSharedMentalModelCompliance,
  registerSharedMentalModelGovernanceAudit,
  registerSharedMentalModelGovernanceLifecycle,
  registerSharedMentalModelGovernanceManifest,
  SMM_GOVERNANCE_PUBLIC_API_REGISTRY,
  SMM_GOVERNANCE_PRINCIPLES,
};

export const SharedMentalModelGovernancePlatform = Object.freeze({
  buildSharedMentalModelGovernancePlatform,
  validateSharedMentalModelGovernance,
  getSharedMentalModelGovernanceRegistry,
  getSharedMentalModelGovernancePolicies,
  getSharedMentalModelGovernanceManifest: getSharedMentalModelGovernanceManifestPublic,
  getSharedMentalModelGovernanceLayerState,
  resetSharedMentalModelGovernanceLayerForTests,
  version: SMM_GOVERNANCE_CONTRACT_VERSION,
});

export { SMM_GOVERNANCE_PLATFORM_ID, SMM_GOVERNANCE_PLATFORM_NAME };
