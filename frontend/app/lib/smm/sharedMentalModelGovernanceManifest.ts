/**
 * SMM-7 — Governance Platform manifest.
 */

import {
  SMM_GOVERNANCE_CONTRACT_VERSION,
  SMM_GOVERNANCE_PLATFORM_ID,
  SMM_GOVERNANCE_PLATFORM_NAME,
  SMM_GOVERNANCE_REGISTRY_KEYS,
} from "./sharedMentalModelGovernanceContracts.ts";
import type {
  SharedMentalModelGovernancePlatformManifest,
  SharedMentalModelGovernanceRegistryBundle,
} from "./sharedMentalModelGovernanceTypes.ts";
import {
  getDefaultGovernanceCompatibility,
  validateSharedMentalModelGovernancePlatformManifest,
  validateSharedMentalModelGovernanceRegistry,
} from "./sharedMentalModelGovernanceValidation.ts";

export function getSharedMentalModelGovernanceManifest(
  registry: SharedMentalModelGovernanceRegistryBundle
): SharedMentalModelGovernancePlatformManifest {
  const validation = validateSharedMentalModelGovernanceRegistry(registry);
  const manifest = Object.freeze({
    manifestId: "smm-governance-platform-manifest",
    platformId: SMM_GOVERNANCE_PLATFORM_ID,
    version: SMM_GOVERNANCE_CONTRACT_VERSION,
    title: SMM_GOVERNANCE_PLATFORM_NAME,
    goal: "Canonical governance contracts for ownership, lifecycle governance, policy metadata, compliance, and audit references.",
    registryKeys: SMM_GOVERNANCE_REGISTRY_KEYS,
    governanceCount: registry.governanceCount,
    policyCount: registry.policyCount,
    validationResult: validation.valid ? ("valid" as const) : ("invalid" as const),
    compatibility: getDefaultGovernanceCompatibility(),
    readOnly: true as const,
  });
  const manifestValidation = validateSharedMentalModelGovernancePlatformManifest(manifest);
  return Object.freeze({
    ...manifest,
    validationResult: validation.valid && manifestValidation.valid ? ("valid" as const) : ("invalid" as const),
    readOnly: true as const,
  });
}
