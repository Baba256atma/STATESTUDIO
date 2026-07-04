import { runDomainExpertisePlatformRegression } from "./domainExpertisePlatformRegression.ts";
import { getDomainExpertisePlatformCompatibilityMatrix } from "./domainExpertisePlatformCompatibility.ts";
import {
  DOMAIN_EXPERTISE_EXTENSION_POLICY,
  DOMAIN_EXPERTISE_PHASE_REGISTRY,
  DOMAIN_EXPERTISE_PLATFORM_IDENTITY,
  DOMAIN_EXPERTISE_PLATFORM_REGISTRY,
  DOMAIN_EXPERTISE_PUBLIC_API_REGISTRY,
  DOMAIN_EXPERTISE_RELEASE_METADATA,
} from "./domainExpertisePlatformFreezeRegistry.ts";
import type { DomainExpertisePlatformManifest } from "./domainExpertisePlatformFreezeTypes.ts";

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function manifestFingerprint(manifest: Omit<DomainExpertisePlatformManifest, "fingerprint">): string {
  return stableHash(
    [
      manifest.platformIdentity.platformId,
      manifest.platformIdentity.version,
      manifest.platformRegistry.map((entry) => `${entry.platformId}:${entry.certification}`).join(","),
      manifest.phaseRegistry.map((entry) => `${entry.phaseId}:${entry.status}:${entry.order}`).join(","),
      manifest.publicApiRegistry.map((entry) => `${entry.sourcePlatform}:${entry.apiName}`).join(","),
      manifest.compatibilityMatrix.map((entry) => `${entry.targetLayer}:${entry.compatibility}`).join(","),
      manifest.extensionPolicy.policy,
      manifest.releaseMetadata.releaseVersion,
      manifest.certificationStatus,
      manifest.regressionStatus,
      manifest.immutable,
      manifest.deterministic,
      manifest.metadataOnly,
    ].join("||")
  );
}

export function buildDomainExpertisePlatformManifest(): DomainExpertisePlatformManifest {
  const regression = runDomainExpertisePlatformRegression();
  const base = Object.freeze({
    platformIdentity: DOMAIN_EXPERTISE_PLATFORM_IDENTITY,
    platformRegistry: DOMAIN_EXPERTISE_PLATFORM_REGISTRY,
    phaseRegistry: DOMAIN_EXPERTISE_PHASE_REGISTRY,
    publicApiRegistry: DOMAIN_EXPERTISE_PUBLIC_API_REGISTRY,
    compatibilityMatrix: getDomainExpertisePlatformCompatibilityMatrix(),
    extensionPolicy: DOMAIN_EXPERTISE_EXTENSION_POLICY,
    releaseMetadata: DOMAIN_EXPERTISE_RELEASE_METADATA,
    certificationStatus: regression.status,
    regressionStatus: regression.status,
    immutable: true as const,
    deterministic: true as const,
    metadataOnly: true as const,
  });

  return Object.freeze({
    ...base,
    fingerprint: manifestFingerprint(base),
  });
}

export function isDomainExpertisePlatformManifestValid(manifest: DomainExpertisePlatformManifest): boolean {
  const expected = manifestFingerprint({
    platformIdentity: manifest.platformIdentity,
    platformRegistry: manifest.platformRegistry,
    phaseRegistry: manifest.phaseRegistry,
    publicApiRegistry: manifest.publicApiRegistry,
    compatibilityMatrix: manifest.compatibilityMatrix,
    extensionPolicy: manifest.extensionPolicy,
    releaseMetadata: manifest.releaseMetadata,
    certificationStatus: manifest.certificationStatus,
    regressionStatus: manifest.regressionStatus,
    immutable: manifest.immutable,
    deterministic: manifest.deterministic,
    metadataOnly: manifest.metadataOnly,
  });

  return (
    manifest.platformIdentity.version === "DOM-8" &&
    manifest.platformIdentity.domainFunctionality === false &&
    manifest.platformRegistry.length === 7 &&
    manifest.phaseRegistry.length === 8 &&
    manifest.publicApiRegistry.length > 0 &&
    manifest.compatibilityMatrix.length === 14 &&
    manifest.certificationStatus === "PASS" &&
    manifest.regressionStatus === "PASS" &&
    manifest.extensionPolicy.allowsDomainFunctionality === false &&
    manifest.extensionPolicy.allowsReasoning === false &&
    manifest.extensionPolicy.allowsRecommendations === false &&
    manifest.extensionPolicy.allowsRuntimeExecution === false &&
    manifest.extensionPolicy.allowsInference === false &&
    manifest.extensionPolicy.allowsAiLogic === false &&
    manifest.extensionPolicy.allowsPersistence === false &&
    manifest.extensionPolicy.allowsNetworking === false &&
    manifest.extensionPolicy.allowsDatabaseAccess === false &&
    manifest.immutable === true &&
    manifest.deterministic === true &&
    manifest.metadataOnly === true &&
    manifest.fingerprint === expected
  );
}
