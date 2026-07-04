import { runAppDomainPlatformRegression } from "./appDomainPlatformRegression.ts";
import { getAppDomainPlatformCompatibilityMatrix } from "./appDomainPlatformCompatibility.ts";
import {
  APP_DOMAIN_EXTENSION_POLICY,
  APP_DOMAIN_PHASE_REGISTRY,
  APP_DOMAIN_PLATFORM_IDENTITY,
  APP_DOMAIN_PUBLIC_API_REGISTRY,
  APP_DOMAIN_RELEASE_METADATA,
} from "./appDomainPlatformFreezeRegistry.ts";
import type { AppDomainPlatformManifest } from "./appDomainPlatformFreezeTypes.ts";

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function manifestFingerprint(manifest: Omit<AppDomainPlatformManifest, "fingerprint">): string {
  return stableHash(
    [
      manifest.platformIdentity.platformId,
      manifest.platformIdentity.version,
      manifest.phaseRegistry.map((entry) => `${entry.phaseId}:${entry.status}:${entry.order}`).join(","),
      manifest.publicApiRegistry.map((entry) => `${entry.phaseId}:${entry.apiName}`).join(","),
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

export function buildAppDomainPlatformManifest(): AppDomainPlatformManifest {
  const regression = runAppDomainPlatformRegression();
  const base = Object.freeze({
    platformIdentity: APP_DOMAIN_PLATFORM_IDENTITY,
    phaseRegistry: APP_DOMAIN_PHASE_REGISTRY,
    publicApiRegistry: APP_DOMAIN_PUBLIC_API_REGISTRY,
    compatibilityMatrix: getAppDomainPlatformCompatibilityMatrix(),
    extensionPolicy: APP_DOMAIN_EXTENSION_POLICY,
    releaseMetadata: APP_DOMAIN_RELEASE_METADATA,
    certificationStatus: regression.status,
    regressionStatus: regression.status,
    immutable: true as const,
    deterministic: true as const,
    metadataOnly: true as const,
  });

  return Object.freeze({ ...base, fingerprint: manifestFingerprint(base) });
}

export function isAppDomainPlatformManifestValid(manifest: AppDomainPlatformManifest): boolean {
  const expected = manifestFingerprint({
    platformIdentity: manifest.platformIdentity,
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
    manifest.platformIdentity.version === "APP-DOM-4" &&
    !manifest.platformIdentity.runtimeBehavior &&
    manifest.phaseRegistry.length === 4 &&
    manifest.publicApiRegistry.length > 0 &&
    manifest.compatibilityMatrix.length === 14 &&
    manifest.certificationStatus === "PASS" &&
    manifest.regressionStatus === "PASS" &&
    !manifest.extensionPolicy.allowsExecutiveReasoning &&
    !manifest.extensionPolicy.allowsRecommendations &&
    !manifest.extensionPolicy.allowsRuntimeExecution &&
    !manifest.extensionPolicy.allowsRuntimeMutation &&
    !manifest.extensionPolicy.allowsDomainMutations &&
    manifest.immutable &&
    manifest.deterministic &&
    manifest.metadataOnly &&
    manifest.fingerprint === expected
  );
}
