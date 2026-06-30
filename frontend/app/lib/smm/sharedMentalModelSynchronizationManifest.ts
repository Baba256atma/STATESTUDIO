/**
 * SMM-5 — Synchronization Platform manifest.
 */

import {
  SMM_SYNC_CONTRACT_VERSION,
  SMM_SYNC_PLATFORM_ID,
  SMM_SYNC_PLATFORM_NAME,
  SMM_SYNC_REGISTRY_KEYS,
} from "./sharedMentalModelSynchronizationContracts.ts";
import type {
  SharedMentalModelSynchronizationPlatformManifest,
  SharedMentalModelSynchronizationRegistryBundle,
} from "./sharedMentalModelSynchronizationTypes.ts";
import {
  getDefaultSynchronizationCompatibility,
  validateSharedMentalModelSynchronizationPlatformManifest,
  validateSharedMentalModelSynchronizationRegistry,
} from "./sharedMentalModelSynchronizationValidation.ts";

export function getSharedMentalModelSynchronizationManifest(
  registry: SharedMentalModelSynchronizationRegistryBundle
): SharedMentalModelSynchronizationPlatformManifest {
  const validation = validateSharedMentalModelSynchronizationRegistry(registry);
  const manifest = Object.freeze({
    manifestId: "smm-synchronization-platform-manifest",
    platformId: SMM_SYNC_PLATFORM_ID,
    version: SMM_SYNC_CONTRACT_VERSION,
    title: SMM_SYNC_PLATFORM_NAME,
    goal: "Deterministic synchronization contracts describing how Shared Mental Models relate across Nexora scopes.",
    registryKeys: SMM_SYNC_REGISTRY_KEYS,
    synchronizationCount: registry.synchronizationCount,
    policyCount: registry.policyCount,
    validationResult: validation.valid ? ("valid" as const) : ("invalid" as const),
    compatibility: getDefaultSynchronizationCompatibility(),
    readOnly: true as const,
  });
  const manifestValidation = validateSharedMentalModelSynchronizationPlatformManifest(manifest);
  return Object.freeze({
    ...manifest,
    validationResult: validation.valid && manifestValidation.valid ? ("valid" as const) : ("invalid" as const),
    readOnly: true as const,
  });
}
