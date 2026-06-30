/**
 * SMM-3 — Identity registry manifest.
 */

import {
  SMM_IDENTITY_CONTRACT_VERSION,
  SMM_IDENTITY_PLATFORM_ID,
  SMM_IDENTITY_PLATFORM_NAME,
  SMM_IDENTITY_REGISTRY_KEYS,
} from "./sharedMentalModelIdentityContracts.ts";
import type {
  SharedMentalModelIdentityRegistryBundle,
  SharedMentalModelRegistryManifest,
} from "./sharedMentalModelIdentityTypes.ts";
import {
  getDefaultIdentityCompatibility,
  validateSharedMentalModelIdentityRegistry,
  validateSharedMentalModelRegistryManifest,
} from "./sharedMentalModelIdentityValidation.ts";

export function getSharedMentalModelRegistryManifest(
  registry: SharedMentalModelIdentityRegistryBundle
): SharedMentalModelRegistryManifest {
  const validation = validateSharedMentalModelIdentityRegistry(registry);
  const manifest = Object.freeze({
    manifestId: "smm-identity-registry-manifest",
    platformId: SMM_IDENTITY_PLATFORM_ID,
    version: SMM_IDENTITY_CONTRACT_VERSION,
    title: SMM_IDENTITY_PLATFORM_NAME,
    goal: "Authoritative identity, reference, and lifecycle metadata registry for Shared Mental Models.",
    registryKeys: SMM_IDENTITY_REGISTRY_KEYS,
    identityCount: registry.identityCount,
    referenceCount: registry.referenceCount,
    validationResult: validation.valid ? ("valid" as const) : ("invalid" as const),
    compatibility: getDefaultIdentityCompatibility(),
    readOnly: true as const,
  });
  const manifestValidation = validateSharedMentalModelRegistryManifest(manifest);
  return Object.freeze({
    ...manifest,
    validationResult: validation.valid && manifestValidation.valid ? ("valid" as const) : ("invalid" as const),
    readOnly: true as const,
  });
}
