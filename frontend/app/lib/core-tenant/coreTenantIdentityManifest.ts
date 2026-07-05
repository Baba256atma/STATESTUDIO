import { CORE_TENANT_IDENTITY_REGISTRY } from "./coreTenantIdentityRegistry.ts";
import type { TenantIdentityManifest } from "./coreTenantIdentityTypes.ts";

function fingerprint(parts: readonly string[]): string {
  const source = parts.join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `core-ten-1-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function buildCoreTenantIdentityManifest(): TenantIdentityManifest {
  const registry = CORE_TENANT_IDENTITY_REGISTRY;
  const identity = registry.canonicalTenantIdentity;

  return Object.freeze({
    platformId: registry.platformId,
    platformName: registry.platformName,
    platformVersion: registry.platformVersion,
    platformNamespace: registry.platformNamespace,
    identitySchemaVersion: registry.identitySchemaVersion,
    supportedTenantVersions: registry.supportedTenantVersions,
    metadataVersion: registry.metadataVersion,
    tenantIdentity: identity,
    deterministicFingerprint: fingerprint([
      registry.platformId,
      registry.platformVersion,
      registry.platformNamespace,
      registry.identitySchemaVersion,
      registry.metadataVersion,
      identity.tenantId,
      identity.tenantCode,
      identity.tenantName,
      identity.classification,
      identity.status,
      identity.metadata.displayName,
      identity.metadata.namespace,
      ...identity.metadata.tags,
      ...Object.entries(identity.metadata.labels)
        .map(([key, value]) => `${key}:${value}`)
        .sort(),
      ...identity.boundary.containedPlatformObjects,
    ]),
    metadataOnly: true,
    immutable: true,
  });
}

