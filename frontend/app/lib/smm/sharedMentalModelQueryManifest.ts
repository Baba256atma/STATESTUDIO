/**
 * SMM-6 — Query & Read Model Platform manifest.
 */

import {
  SMM_QUERY_CONTRACT_VERSION,
  SMM_QUERY_PLATFORM_ID,
  SMM_QUERY_PLATFORM_NAME,
  SMM_QUERY_REGISTRY_KEYS,
} from "./sharedMentalModelQueryContracts.ts";
import type {
  SharedMentalModelQueryPlatformManifest,
  SharedMentalModelQueryRegistryBundle,
} from "./sharedMentalModelQueryTypes.ts";
import {
  getDefaultQueryCompatibility,
  validateSharedMentalModelQueryPlatformManifest,
  validateSharedMentalModelQueryRegistry,
} from "./sharedMentalModelQueryValidation.ts";

export function getSharedMentalModelQueryManifest(
  registry: SharedMentalModelQueryRegistryBundle
): SharedMentalModelQueryPlatformManifest {
  const validation = validateSharedMentalModelQueryRegistry(registry);
  const manifest = Object.freeze({
    manifestId: "smm-query-read-model-platform-manifest",
    platformId: SMM_QUERY_PLATFORM_ID,
    version: SMM_QUERY_CONTRACT_VERSION,
    title: SMM_QUERY_PLATFORM_NAME,
    goal: "Deterministic query contracts and read-model structures for retrieving Shared Mental Model metadata.",
    registryKeys: SMM_QUERY_REGISTRY_KEYS,
    queryCount: registry.queryCount,
    readModelCount: registry.readModelCount,
    validationResult: validation.valid ? ("valid" as const) : ("invalid" as const),
    compatibility: getDefaultQueryCompatibility(),
    readOnly: true as const,
  });
  const manifestValidation = validateSharedMentalModelQueryPlatformManifest(manifest);
  return Object.freeze({
    ...manifest,
    validationResult: validation.valid && manifestValidation.valid ? ("valid" as const) : ("invalid" as const),
    readOnly: true as const,
  });
}
