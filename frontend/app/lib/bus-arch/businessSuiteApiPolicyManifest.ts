import { BusinessSuiteApiPolicyRegistry } from "./businessSuiteApiPolicyRegistry.ts";
import type { BusinessSuiteApiPolicyManifest } from "./businessSuiteApiPolicyTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `bus-arch-4-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function buildBusinessSuiteApiPolicyManifest(): BusinessSuiteApiPolicyManifest {
  const registry = BusinessSuiteApiPolicyRegistry;
  const deterministicFingerprint = fingerprint([
    registry.metadata.apiPolicyId,
    registry.metadata.version,
    ...registry.publicApiRegistry.map((api) => `${api.owningPlatformId}:${api.apiId}:${api.compatibilityClass}`).sort(),
    ...registry.apiSurfaceRegistry.map((surface) => `${surface.platformId}:${surface.publicApiIds.join(",")}`).sort(),
    ...registry.extensionPointRegistry.map((extension) => `${extension.owningPlatformId}:${extension.supportedApiId}`).sort(),
    ...registry.consumerPermissionRegistry.map((permission) => `${permission.consumerPlatformId}->${permission.providerPlatformId}:${permission.allowedApiIds.join(",")}`).sort(),
    ...registry.compatibilityRegistry.map((policy) => `${policy.policyId}:${policy.compatibilityClass}`).sort(),
    registry.versionRegistry.policyId,
    registry.deprecationRegistry.policyId,
    registry.extensionPolicyRegistry.policyId,
  ]);

  return Object.freeze({
    architectureId: registry.metadata.architectureId,
    version: registry.metadata.version,
    publicApiCatalog: registry.publicApiRegistry,
    apiSurfaceCatalog: registry.apiSurfaceRegistry,
    extensionCatalog: registry.extensionPointRegistry,
    compatibilityPolicy: registry.compatibilityRegistry,
    versionPolicy: registry.versionRegistry,
    deprecationPolicy: registry.deprecationRegistry,
    consumerPermissionCatalog: registry.consumerPermissionRegistry,
    extensionPolicy: registry.extensionPolicyRegistry,
    metadata: registry.metadata,
    deterministicFingerprint,
  });
}
