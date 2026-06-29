/**
 * APP-4:14 — Executive Memory Platform Freeze manifest builder.
 */

import {
  EXECUTIVE_MEMORY_PLATFORM_FREEZE_CONTRACT_VERSION,
  EXECUTIVE_MEMORY_PLATFORM_FUTURE_EXTENSION_POLICY,
  EXECUTIVE_MEMORY_PLATFORM_NAME,
  EXECUTIVE_MEMORY_PLATFORM_RELEASE_STAGE,
  EXECUTIVE_MEMORY_PLATFORM_RELEASE_TAG,
  EXECUTIVE_MEMORY_PLATFORM_STATUS_CERTIFIED,
  EXECUTIVE_MEMORY_PLATFORM_STATUS_FROZEN,
  EXECUTIVE_MEMORY_PLATFORM_STATUS_RELEASED,
  EXECUTIVE_MEMORY_PLATFORM_VERSION,
} from "./executiveMemoryPlatformFreezeConstants.ts";
import {
  buildExecutiveMemoryPlatformCertificationRegistry,
  buildExecutiveMemoryPlatformCompatibilityRegistry,
  buildExecutiveMemoryPlatformContractRegistry,
  buildExecutiveMemoryPlatformExtensionRegistry,
  buildExecutiveMemoryPlatformPublicApiRegistry,
  buildExecutiveMemoryPlatformRegistry,
} from "./executiveMemoryPlatformFreezeRegistry.ts";
import type { ExecutiveMemoryPlatformFreezeManifest } from "./executiveMemoryPlatformFreezeTypes.ts";

function buildArchitectureHash(
  certifiedModules: ReturnType<typeof buildExecutiveMemoryPlatformRegistry>,
  contractRegistry: ReturnType<typeof buildExecutiveMemoryPlatformContractRegistry>
): string {
  const payload = [
    ...certifiedModules.map((entry) => `${entry.phaseId}:${entry.contractVersion}`),
    ...contractRegistry.map((entry) => `${entry.contractId}:${entry.contractVersion}`),
  ]
    .sort((left, right) => left.localeCompare(right))
    .join("|");
  let hash = 0;
  for (let index = 0; index < payload.length; index += 1) {
    hash = (Math.imul(31, hash) + payload.charCodeAt(index)) >>> 0;
  }
  return `arch-${hash.toString(16).padStart(8, "0")}`;
}

export function buildExecutiveMemoryPlatformFreezeManifest(
  releaseDate: string
): ExecutiveMemoryPlatformFreezeManifest {
  const certifiedModules = buildExecutiveMemoryPlatformRegistry();
  const publicApis = buildExecutiveMemoryPlatformPublicApiRegistry();
  const contractRegistry = buildExecutiveMemoryPlatformContractRegistry();
  const certificationRegistry = buildExecutiveMemoryPlatformCertificationRegistry();
  const extensionPoints = buildExecutiveMemoryPlatformExtensionRegistry();
  const compatibilityGuarantees = buildExecutiveMemoryPlatformCompatibilityRegistry();

  return Object.freeze({
    platformName: EXECUTIVE_MEMORY_PLATFORM_NAME,
    platformVersion: EXECUTIVE_MEMORY_PLATFORM_VERSION,
    releaseTag: EXECUTIVE_MEMORY_PLATFORM_RELEASE_TAG,
    releaseStage: EXECUTIVE_MEMORY_PLATFORM_RELEASE_STAGE,
    releaseDate,
    platformStatus: Object.freeze({
      certified: EXECUTIVE_MEMORY_PLATFORM_STATUS_CERTIFIED,
      frozen: EXECUTIVE_MEMORY_PLATFORM_STATUS_FROZEN,
      released: EXECUTIVE_MEMORY_PLATFORM_STATUS_RELEASED,
      readOnly: true as const,
    }),
    freezeVersion: EXECUTIVE_MEMORY_PLATFORM_FREEZE_CONTRACT_VERSION,
    certifiedModules,
    publicApis,
    contractRegistry,
    certificationRegistry,
    extensionPoints,
    compatibilityGuarantees,
    platformMetadata: Object.freeze({
      architectureHash: buildArchitectureHash(certifiedModules, contractRegistry),
      totalPhases: certifiedModules.length,
      totalPublicApis: publicApis.length,
      totalContracts: contractRegistry.length,
      metadataOnly: true as const,
    }),
    futureExtensionPolicy: EXECUTIVE_MEMORY_PLATFORM_FUTURE_EXTENSION_POLICY,
    readOnly: true as const,
  });
}

export const ExecutiveMemoryPlatformFreezeManifestBuilder = Object.freeze({
  buildExecutiveMemoryPlatformFreezeManifest,
});
