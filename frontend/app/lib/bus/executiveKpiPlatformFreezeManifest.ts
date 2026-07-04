import { getExecutiveKpiPlatformCompatibilityMatrix } from "./executiveKpiPlatformCompatibility.ts";
import {
  EXECUTIVE_KPI_PLATFORM_IDENTITY,
  EXECUTIVE_KPI_PLATFORM_RELEASE_METADATA,
  getExecutiveKpiPlatformExtensionPolicy,
  listExecutiveKpiPlatformPhases,
  listExecutiveKpiPlatformPublicApis,
} from "./executiveKpiPlatformFreezeRegistry.ts";
import type { ExecutiveKpiPlatformFreezeManifest } from "./executiveKpiPlatformFreezeTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `bus-12-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function buildExecutiveKpiPlatformFreezeManifest(): ExecutiveKpiPlatformFreezeManifest {
  const phaseRegistry = listExecutiveKpiPlatformPhases();
  const publicApiRegistry = listExecutiveKpiPlatformPublicApis();
  const compatibilityMatrix = getExecutiveKpiPlatformCompatibilityMatrix();
  const extensionPolicy = getExecutiveKpiPlatformExtensionPolicy();
  const deterministicFingerprint = fingerprint([
    EXECUTIVE_KPI_PLATFORM_IDENTITY.platformId,
    EXECUTIVE_KPI_PLATFORM_IDENTITY.version,
    ...phaseRegistry.map((phase) => `${phase.phaseId}:${phase.status}:${phase.order}`),
    ...publicApiRegistry.map((api) => `${api.phaseId}:${api.apiName}`).sort(),
    ...compatibilityMatrix.map((entry) => `${entry.compatibilityId}:${entry.targetLayer}:${entry.compatibilityStatus}`).sort(),
    extensionPolicy.policyId,
    EXECUTIVE_KPI_PLATFORM_RELEASE_METADATA.releaseVersion,
  ]);

  return Object.freeze({
    platformIdentity: EXECUTIVE_KPI_PLATFORM_IDENTITY,
    phaseRegistry,
    publicApiRegistry,
    compatibilityMatrix,
    extensionPolicy,
    releaseMetadata: EXECUTIVE_KPI_PLATFORM_RELEASE_METADATA,
    certificationGateCount: 11,
    regressionEntryCount: 11,
    deterministicFingerprint,
    metadataOnly: true,
    immutable: true,
  });
}
