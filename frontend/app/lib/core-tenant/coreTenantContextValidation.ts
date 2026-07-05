import { validateCoreTenantIdentity } from "./coreTenantIdentityIndex.ts";
import { CORE_TENANT_CONTEXT } from "./coreTenantContext.ts";
import { buildExecutiveTenantContextManifest } from "./coreTenantContextManifest.ts";
import { validateExecutiveTenantRegistry } from "./coreTenantRegistryIndex.ts";
import type {
  TenantContext,
  TenantContextManifest,
  TenantContextValidationResult,
} from "./coreTenantContextTypes.ts";

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

function result(errors: readonly string[]): TenantContextValidationResult {
  return Object.freeze({
    valid: errors.length === 0,
    errors: Object.freeze([...errors]),
    warnings: Object.freeze([]),
  });
}

function validateContext(context: TenantContext): readonly string[] {
  const errors: string[] = [];

  if (!context.contextId.startsWith("tenant-context-")) errors.push("invalid-context-id");
  if (!context.binding.tenantRegistryReference.entries.some((entry) => entry.tenantId === context.binding.currentTenantReference)) {
    errors.push("missing-tenant-reference");
  }
  if (context.binding.tenantIdentityReference.tenantId !== context.binding.currentTenantReference) {
    errors.push("invalid-identity-reference");
  }
  if (context.binding.tenantRegistryEntryReference.tenantId !== context.binding.currentTenantReference) {
    errors.push("invalid-registry-entry-reference");
  }
  if (context.binding.tenantRegistryEntryReference.identityReference.tenantId !== context.binding.tenantIdentityReference.tenantId) {
    errors.push("registry-identity-mismatch");
  }
  if (context.binding.contextBoundary.boundaryId !== context.snapshot.boundaryId) errors.push("boundary-inconsistency");
  if (context.binding.tenantRegistryReference.metadata.registryVersion !== context.snapshot.registryVersion) {
    errors.push("registry-version-mismatch");
  }
  if (context.metadata.namespace !== "nexora.core.tenant.context") errors.push("invalid-context-namespace");
  if (context.metadata.metadataVersion !== "1.0.0") errors.push("invalid-context-metadata-version");
  if (context.metadata.compatibility[0] !== "CORE-TEN-1" || context.metadata.compatibility[1] !== "CORE-TEN-2") {
    errors.push("invalid-context-compatibility");
  }
  if (context.snapshot.scope !== context.scope) errors.push("scope-incomplete");
  if (context.snapshot.mode !== context.mode) errors.push("mode-inconsistent");
  if (context.snapshot.source !== context.source) errors.push("source-inconsistent");
  if (context.snapshot.status !== context.status) errors.push("status-inconsistent");

  errors.push(
    ...duplicateValues(context.metadata.tags).map((value) => `duplicate-tag:${value}`),
    ...duplicateValues(Object.keys(context.metadata.labels)).map((value) => `duplicate-label:${value}`)
  );

  return Object.freeze(errors);
}

function validateManifest(manifest: TenantContextManifest): readonly string[] {
  const errors: string[] = [];

  if (manifest.platformId !== "CORE-TEN-3") errors.push("invalid-manifest-platform-id");
  if (manifest.platformName !== "Executive Tenant Context Foundation") errors.push("invalid-manifest-platform-name");
  if (manifest.platformVersion !== "1.0.0") errors.push("invalid-manifest-platform-version");
  if (manifest.platformNamespace !== "nexora.core.tenant.context") errors.push("invalid-manifest-namespace");
  if (manifest.contextId !== CORE_TENANT_CONTEXT.contextId) errors.push("invalid-manifest-context-id");
  if (!manifest.deterministicFingerprint) errors.push("missing-deterministic-fingerprint");
  if (!manifest.metadataOnly) errors.push("manifest-not-metadata-only");
  if (!manifest.immutable) errors.push("manifest-not-immutable");

  return Object.freeze(errors);
}

export function validateExecutiveTenantContext(
  context: TenantContext = CORE_TENANT_CONTEXT,
  manifest: TenantContextManifest = buildExecutiveTenantContextManifest()
): TenantContextValidationResult {
  const identityValidation = validateCoreTenantIdentity();
  const registryValidation = validateExecutiveTenantRegistry();
  const errors = Object.freeze([
    ...(identityValidation.valid ? [] : identityValidation.errors.map((error) => `tenant-identity:${error}`)),
    ...(registryValidation.valid ? [] : registryValidation.errors.map((error) => `tenant-registry:${error}`)),
    ...validateContext(context),
    ...validateManifest(manifest),
  ]);

  return result(errors);
}

