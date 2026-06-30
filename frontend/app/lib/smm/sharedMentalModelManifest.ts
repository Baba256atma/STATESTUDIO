/**
 * SMM-2 — Shared Mental Model domain manifest.
 */

import {
  SMM_DOMAIN_CONTRACT_VERSION,
  SMM_DOMAIN_MODEL_KEYS,
  SMM_DOMAIN_PLATFORM_ID,
  SMM_DOMAIN_PLATFORM_NAME,
  SMM_DOMAIN_PUBLIC_API_REGISTRY,
} from "./sharedMentalModelContracts.ts";
import type { SharedMentalModelContractRegistry, SharedMentalModelManifest } from "./sharedMentalModelTypes.ts";
import {
  getDefaultSharedMentalModelCompatibility,
  validateSharedMentalModelContractRegistry,
} from "./sharedMentalModelValidation.ts";

export function getSharedMentalModelManifest(
  registry: SharedMentalModelContractRegistry
): SharedMentalModelManifest {
  const validation = validateSharedMentalModelContractRegistry(registry);
  return Object.freeze({
    manifestId: "smm-shared-mental-model-domain-manifest",
    platformId: SMM_DOMAIN_PLATFORM_ID,
    version: SMM_DOMAIN_CONTRACT_VERSION,
    title: SMM_DOMAIN_PLATFORM_NAME,
    goal: "Immutable semantic domain contracts for Shared Mental Model representation across Nexora.",
    domainModelKeys: SMM_DOMAIN_MODEL_KEYS,
    publicApis: SMM_DOMAIN_PUBLIC_API_REGISTRY,
    validationResult: validation.valid ? ("valid" as const) : ("invalid" as const),
    compatibility: getDefaultSharedMentalModelCompatibility(),
    readOnly: true as const,
  });
}
