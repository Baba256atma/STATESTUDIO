import { validateCoreTenantIdentity } from "./coreTenantIdentityIndex.ts";
import { buildExecutiveTenantRegistryManifest } from "./coreTenantRegistryManifest.ts";
import { CORE_TENANT_REGISTRY } from "./coreTenantRegistry.ts";
import type {
  RegistryManifest,
  RegistryValidation,
  TenantRegistry,
  TenantRegistryEntry,
} from "./coreTenantRegistryTypes.ts";

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

function result(errors: readonly string[]): RegistryValidation {
  return Object.freeze({
    valid: errors.length === 0,
    errors: Object.freeze([...errors]),
    warnings: Object.freeze([]),
  });
}

function validateEntries(entries: readonly TenantRegistryEntry[]): readonly string[] {
  const errors: string[] = [];

  errors.push(
    ...duplicateValues(entries.map((entry) => entry.tenantId)).map((value) => `duplicate-tenant-id:${value}`),
    ...duplicateValues(entries.map((entry) => entry.tenantNamespace)).map((value) => `duplicate-namespace:${value}`)
  );

  for (const entry of entries) {
    if (entry.metadataVersion !== "1.0.0") errors.push(`invalid-entry-metadata-version:${entry.entryId}`);
    if (entry.schemaVersion !== "1.0.0") errors.push(`invalid-entry-schema-version:${entry.entryId}`);
    if (entry.identityReference.tenantId !== entry.tenantId) errors.push(`invalid-identity-reference:${entry.entryId}`);
    if (entry.identityReference.metadata.namespace !== entry.tenantNamespace) errors.push(`invalid-namespace-reference:${entry.entryId}`);
  }

  return Object.freeze(errors);
}

function validateRegistry(registry: TenantRegistry): readonly string[] {
  const errors: string[] = [];

  if (registry.metadata.registryId !== "core-tenant-registry") errors.push("invalid-registry-id");
  if (registry.metadata.platformId !== "CORE-TEN-2") errors.push("invalid-platform-id");
  if (registry.metadata.platformNamespace !== "nexora.core.tenant.registry") errors.push("invalid-platform-namespace");
  if (registry.metadata.registryVersion !== "1.0.0") errors.push("invalid-registry-version");
  if (registry.metadata.schemaVersion !== "1.0.0") errors.push("invalid-schema-version");
  if (registry.metadata.metadataVersion !== "1.0.0") errors.push("invalid-metadata-version");
  if (registry.metadata.identityFoundationVersion !== "CORE-TEN-1") errors.push("invalid-identity-foundation-version");
  if (registry.entries.length === 0) errors.push("missing-registry-entries");
  if (registry.statistics.registeredTenantCount !== registry.entries.length) errors.push("invalid-registered-tenant-count");
  if (registry.snapshot.entries.length !== registry.entries.length) errors.push("invalid-snapshot-entry-count");
  if (!registry.integrity.identityReferencesValid) errors.push("invalid-identity-references");
  if (!registry.integrity.schemaCompatible) errors.push("schema-incompatible");
  if (!registry.integrity.namespaceUnique) errors.push("namespace-not-unique");
  if (!registry.integrity.tenantIdsUnique) errors.push("tenant-ids-not-unique");

  errors.push(...validateEntries(registry.entries));

  return Object.freeze(errors);
}

function validateManifest(manifest: RegistryManifest): readonly string[] {
  const errors: string[] = [];

  if (manifest.platformId !== "CORE-TEN-2") errors.push("invalid-manifest-platform-id");
  if (manifest.platformName !== "Executive Tenant Registry Platform") errors.push("invalid-manifest-platform-name");
  if (manifest.platformVersion !== "1.0.0") errors.push("invalid-manifest-platform-version");
  if (manifest.platformNamespace !== "nexora.core.tenant.registry") errors.push("invalid-manifest-platform-namespace");
  if (manifest.registryVersion !== "1.0.0") errors.push("invalid-manifest-registry-version");
  if (manifest.schemaVersion !== "1.0.0") errors.push("invalid-manifest-schema-version");
  if (manifest.metadataVersion !== "1.0.0") errors.push("invalid-manifest-metadata-version");
  if (!manifest.deterministicFingerprint) errors.push("missing-deterministic-fingerprint");
  if (!manifest.metadataOnly) errors.push("manifest-not-metadata-only");
  if (!manifest.immutable) errors.push("manifest-not-immutable");

  return Object.freeze(errors);
}

export function validateExecutiveTenantRegistry(
  registry: TenantRegistry = CORE_TENANT_REGISTRY,
  manifest: RegistryManifest = buildExecutiveTenantRegistryManifest()
): RegistryValidation {
  const identityValidation = validateCoreTenantIdentity();
  const errors = Object.freeze([
    ...(identityValidation.valid ? [] : identityValidation.errors.map((error) => `identity-foundation:${error}`)),
    ...validateRegistry(registry),
    ...validateManifest(manifest),
  ]);

  return result(errors);
}

