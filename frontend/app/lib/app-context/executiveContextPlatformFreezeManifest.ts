import { ExecutiveContextCertificationLayer } from "./executiveContextCertificationIndex.ts";
import { getExecutiveContextPlatformCompatibilityMatrix } from "./executiveContextPlatformCompatibility.ts";
import {
  EXECUTIVE_CONTEXT_EXTENSION_POLICY,
  EXECUTIVE_CONTEXT_PHASE_REGISTRY,
  EXECUTIVE_CONTEXT_PLATFORM_IDENTITY,
  EXECUTIVE_CONTEXT_PUBLIC_API_REGISTRY,
  EXECUTIVE_CONTEXT_RELEASE_METADATA,
} from "./executiveContextPlatformFreezeRegistry.ts";
import type { ExecutiveContextPlatformManifest } from "./executiveContextPlatformFreezeTypes.ts";

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function manifestFingerprint(manifest: Omit<ExecutiveContextPlatformManifest, "fingerprint">): string {
  return stableHash(
    [
      manifest.platformIdentity.platformId,
      manifest.platformIdentity.version,
      manifest.phaseRegistry.map((entry) => `${entry.phaseId}:${entry.status}:${entry.order}`).join(","),
      manifest.publicApiRegistry.map((entry) => `${entry.phaseId}:${entry.apiName}`).join(","),
      manifest.compatibilityMatrix.map((entry) => `${entry.targetLayer}:${entry.compatibility}`).join(","),
      manifest.extensionPolicy.policy,
      manifest.releaseMetadata.releaseVersion,
      manifest.certificationDependency,
      manifest.regressionDependency,
      manifest.immutable,
      manifest.deterministic,
      manifest.metadataOnly,
    ].join("||")
  );
}

export function buildExecutiveContextPlatformFreezeManifest(): ExecutiveContextPlatformManifest {
  const certification = ExecutiveContextCertificationLayer.runExecutiveContextCertification();
  const regression = ExecutiveContextCertificationLayer.runExecutiveContextRegression();
  const base = Object.freeze({
    platformIdentity: EXECUTIVE_CONTEXT_PLATFORM_IDENTITY,
    phaseRegistry: EXECUTIVE_CONTEXT_PHASE_REGISTRY,
    publicApiRegistry: EXECUTIVE_CONTEXT_PUBLIC_API_REGISTRY,
    compatibilityMatrix: getExecutiveContextPlatformCompatibilityMatrix(),
    extensionPolicy: EXECUTIVE_CONTEXT_EXTENSION_POLICY,
    releaseMetadata: EXECUTIVE_CONTEXT_RELEASE_METADATA,
    certificationDependency: certification.status,
    regressionDependency: regression.status,
    immutable: true as const,
    deterministic: true as const,
    metadataOnly: true as const,
  });

  return Object.freeze({ ...base, fingerprint: manifestFingerprint(base) });
}

export function isExecutiveContextPlatformFreezeManifestValid(manifest: ExecutiveContextPlatformManifest): boolean {
  const expected = manifestFingerprint({
    platformIdentity: manifest.platformIdentity,
    phaseRegistry: manifest.phaseRegistry,
    publicApiRegistry: manifest.publicApiRegistry,
    compatibilityMatrix: manifest.compatibilityMatrix,
    extensionPolicy: manifest.extensionPolicy,
    releaseMetadata: manifest.releaseMetadata,
    certificationDependency: manifest.certificationDependency,
    regressionDependency: manifest.regressionDependency,
    immutable: manifest.immutable,
    deterministic: manifest.deterministic,
    metadataOnly: manifest.metadataOnly,
  });

  return (
    manifest.platformIdentity.version === "APP-CTX-4" &&
    !manifest.platformIdentity.runtimeBehavior &&
    manifest.phaseRegistry.length === 4 &&
    manifest.publicApiRegistry.length > 0 &&
    manifest.compatibilityMatrix.length === 15 &&
    manifest.certificationDependency === "PASS" &&
    manifest.regressionDependency === "PASS" &&
    !manifest.extensionPolicy.allowsExecutiveReasoning &&
    !manifest.extensionPolicy.allowsRecommendations &&
    !manifest.extensionPolicy.allowsRuntimeExecution &&
    !manifest.extensionPolicy.allowsRuntimeMutation &&
    manifest.immutable &&
    manifest.deterministic &&
    manifest.metadataOnly &&
    manifest.fingerprint === expected
  );
}
