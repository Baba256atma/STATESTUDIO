import { buildCoreTenantIdentityManifest } from "./coreTenantIdentityManifest.ts";
import { CORE_TENANT_IDENTITY_REGISTRY } from "./coreTenantIdentityRegistry.ts";
import type {
  CoreTenantIdentityRegistry,
  CoreTenantIdentityValidation,
  TenantIdentity,
  TenantIdentityManifest,
} from "./coreTenantIdentityTypes.ts";

function duplicateValues(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
    }
    seen.add(value);
  }

  return Object.freeze([...duplicates].sort());
}

function result(errors: readonly string[]): CoreTenantIdentityValidation {
  return Object.freeze({
    valid: errors.length === 0,
    errors: Object.freeze([...errors]),
    warnings: Object.freeze([]),
  });
}

function validateIdentity(identity: TenantIdentity): readonly string[] {
  const errors: string[] = [];

  if (!identity.tenantId.startsWith("tenant-")) errors.push("invalid-tenant-id");
  if (!identity.tenantCode.startsWith("TENANT_")) errors.push("invalid-tenant-code");
  if (!identity.tenantName.trim()) errors.push("missing-tenant-name");
  if (!identity.metadata.displayName.trim()) errors.push("missing-display-name");
  if (!identity.metadata.description.trim()) errors.push("missing-description");
  if (identity.metadata.createdArchitectureVersion !== "NPA-1.0.0") errors.push("invalid-created-architecture-version");
  if (identity.metadata.identityVersion !== "1.0.0") errors.push("invalid-identity-version");
  if (identity.metadata.namespace !== "nexora.core.tenant") errors.push("invalid-namespace");
  if (identity.metadata.ownerReference !== "NexoraArchitecture") errors.push("invalid-owner-reference");
  if (identity.metadata.metadataVersion !== "1.0.0") errors.push("invalid-metadata-version");
  if (!identity.boundary.highestIsolationBoundary) errors.push("invalid-boundary-level");
  if (!identity.boundary.prohibitsExternalExistence) errors.push("invalid-boundary-existence-rule");
  if (identity.boundary.containedPlatformObjects.length !== 11) errors.push("invalid-boundary-coverage");

  errors.push(
    ...duplicateValues(identity.metadata.tags).map((value) => `duplicate-tag:${value}`),
    ...duplicateValues(Object.keys(identity.metadata.labels)).map((value) => `duplicate-label:${value}`)
  );

  return Object.freeze(errors);
}

function validateRegistry(registry: CoreTenantIdentityRegistry): readonly string[] {
  const errors: string[] = [];

  if (registry.platformId !== "CORE-TEN-1") errors.push("invalid-platform-id");
  if (registry.platformName !== "Executive Tenant Identity Foundation") errors.push("invalid-platform-name");
  if (registry.platformVersion !== "1.0.0") errors.push("invalid-platform-version");
  if (registry.platformNamespace !== "nexora.core.tenant") errors.push("invalid-platform-namespace");
  if (registry.identitySchemaVersion !== "1.0.0") errors.push("invalid-identity-schema-version");
  if (registry.metadataVersion !== "1.0.0") errors.push("invalid-registry-metadata-version");
  if (registry.supportedTenantVersions.length !== 1) errors.push("invalid-supported-tenant-versions");
  if (registry.supportedTenantVersions[0] !== "1.0.0") errors.push("unsupported-tenant-version");

  return Object.freeze(errors);
}

function validateManifest(manifest: TenantIdentityManifest): readonly string[] {
  const errors: string[] = [];

  if (manifest.platformId !== "CORE-TEN-1") errors.push("invalid-manifest-platform-id");
  if (manifest.platformName !== "Executive Tenant Identity Foundation") errors.push("invalid-manifest-platform-name");
  if (manifest.platformVersion !== "1.0.0") errors.push("invalid-manifest-platform-version");
  if (manifest.platformNamespace !== "nexora.core.tenant") errors.push("invalid-manifest-namespace");
  if (manifest.identitySchemaVersion !== "1.0.0") errors.push("invalid-manifest-schema-version");
  if (manifest.metadataVersion !== "1.0.0") errors.push("invalid-manifest-metadata-version");
  if (!manifest.deterministicFingerprint) errors.push("missing-deterministic-fingerprint");
  if (!manifest.metadataOnly) errors.push("manifest-not-metadata-only");
  if (!manifest.immutable) errors.push("manifest-not-immutable");

  return Object.freeze(errors);
}

export function validateCoreTenantIdentity(
  identity: TenantIdentity = CORE_TENANT_IDENTITY_REGISTRY.canonicalTenantIdentity,
  registry: CoreTenantIdentityRegistry = CORE_TENANT_IDENTITY_REGISTRY,
  manifest: TenantIdentityManifest = buildCoreTenantIdentityManifest()
): CoreTenantIdentityValidation {
  const errors = Object.freeze([
    ...validateIdentity(identity),
    ...validateRegistry(registry),
    ...validateManifest(manifest),
  ]);

  return result(errors);
}

