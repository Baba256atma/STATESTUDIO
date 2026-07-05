import { getExecutiveOkrPlatformCompatibilityMatrix } from "./executiveOkrPlatformCompatibility.ts";
import {
  EXECUTIVE_OKR_PLATFORM_FREEZE_METADATA,
  EXECUTIVE_OKR_PLATFORM_IDENTITY,
  EXECUTIVE_OKR_PLATFORM_RELEASE_METADATA,
  getExecutiveOkrPlatformExtensionPolicy,
  listExecutiveOkrPlatformConsumers,
  listExecutiveOkrPlatformDependencies,
  listExecutiveOkrPlatformPhases,
  listExecutiveOkrPlatformPublicApis,
} from "./executiveOkrPlatformFreezeRegistry.ts";
import type { ExecutiveOkrPlatformFreezeManifest } from "./executiveOkrPlatformFreezeTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `bus-16-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function buildExecutiveOkrPlatformFreezeManifest(): ExecutiveOkrPlatformFreezeManifest {
  const phaseRegistry = listExecutiveOkrPlatformPhases();
  const publicApiRegistry = listExecutiveOkrPlatformPublicApis();
  const dependencyRegistry = listExecutiveOkrPlatformDependencies();
  const consumerRegistry = listExecutiveOkrPlatformConsumers();
  const compatibilityMatrix = getExecutiveOkrPlatformCompatibilityMatrix();
  const extensionPolicy = getExecutiveOkrPlatformExtensionPolicy();
  const deterministicFingerprint = fingerprint([
    EXECUTIVE_OKR_PLATFORM_IDENTITY.platformId,
    EXECUTIVE_OKR_PLATFORM_IDENTITY.version,
    ...phaseRegistry.map((phase) => `${phase.order}:${phase.phaseId}:${phase.status}`).sort(),
    ...publicApiRegistry.map((api) => `${api.phaseId}:${api.apiName}`).sort(),
    ...dependencyRegistry.map((dependency) => `${dependency.sourcePhaseId}:${dependency.dependencyId}`).sort(),
    ...consumerRegistry.map((consumer) => consumer.consumerId).sort(),
    ...compatibilityMatrix.map((entry) => `${entry.compatibilityId}:${entry.compatibilityStatus}`).sort(),
    EXECUTIVE_OKR_PLATFORM_RELEASE_METADATA.certificationStatus,
    EXECUTIVE_OKR_PLATFORM_RELEASE_METADATA.freezeStatus,
  ]);

  return Object.freeze({
    platformIdentity: EXECUTIVE_OKR_PLATFORM_IDENTITY,
    phaseRegistry,
    publicApiRegistry,
    dependencyRegistry,
    consumerRegistry,
    compatibilityMatrix,
    extensionPolicy,
    releaseMetadata: EXECUTIVE_OKR_PLATFORM_RELEASE_METADATA,
    certificationGateCount: 15,
    regressionEntryCount: 15,
    deterministicFingerprint,
    metadataOnly: EXECUTIVE_OKR_PLATFORM_FREEZE_METADATA.metadataOnly,
    immutable: EXECUTIVE_OKR_PLATFORM_FREEZE_METADATA.immutable,
  });
}
