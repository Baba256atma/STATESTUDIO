import {
  CORE_TENANT_BOUNDARY,
  CORE_TENANT_CANONICAL_IDENTITY,
} from "./coreTenantIdentityIndex.ts";
import {
  CORE_TENANT_REGISTRY,
  CORE_TENANT_REGISTRY_ENTRIES,
  CORE_TENANT_REGISTRY_METADATA,
} from "./coreTenantRegistryIndex.ts";
import type {
  TenantContext,
  TenantContextBinding,
  TenantContextMetadata,
  TenantContextSnapshot,
} from "./coreTenantContextTypes.ts";

export const CORE_TENANT_CONTEXT_BINDING: TenantContextBinding = Object.freeze({
  currentTenantReference: CORE_TENANT_CANONICAL_IDENTITY.tenantId,
  tenantIdentityReference: CORE_TENANT_CANONICAL_IDENTITY,
  tenantRegistryReference: CORE_TENANT_REGISTRY,
  tenantRegistryEntryReference: CORE_TENANT_REGISTRY_ENTRIES[0],
  registryMetadataReference: CORE_TENANT_REGISTRY_METADATA,
  contextBoundary: CORE_TENANT_BOUNDARY,
});

export const CORE_TENANT_CONTEXT_METADATA: TenantContextMetadata = Object.freeze({
  displayName: "Executive Root Tenant Context",
  description: "Canonical tenant context metadata describing architectural operation under the executive root tenant.",
  compatibility: Object.freeze(["CORE-TEN-1", "CORE-TEN-2"] as const),
  namespace: "nexora.core.tenant.context",
  metadataVersion: "1.0.0",
  tags: Object.freeze([
    "core",
    "tenant",
    "context",
    "metadata-only",
    "architecture-only",
  ] as const),
  labels: Object.freeze({
    layer: "core-tenant-context",
    certification: "CORE-TEN-3",
    purpose: "tenant-reference-binding",
  }),
  metadataOnly: true,
  immutable: true,
});

export const CORE_TENANT_CONTEXT_SNAPSHOT: TenantContextSnapshot = Object.freeze({
  snapshotId: "core-tenant-context-snapshot",
  tenantId: CORE_TENANT_CANONICAL_IDENTITY.tenantId,
  tenantNamespace: CORE_TENANT_CANONICAL_IDENTITY.metadata.namespace,
  registryVersion: CORE_TENANT_REGISTRY_METADATA.registryVersion,
  scope: "Architecture",
  mode: "ReferenceOnly",
  source: "ArchitectureBootstrap",
  status: "Certified",
  boundaryId: CORE_TENANT_BOUNDARY.boundaryId,
  metadataOnly: true,
  immutable: true,
});

export const CORE_TENANT_CONTEXT: TenantContext = Object.freeze({
  contextId: "tenant-context-executive-root",
  scope: "Architecture",
  mode: "ReferenceOnly",
  source: "ArchitectureBootstrap",
  status: "Certified",
  binding: CORE_TENANT_CONTEXT_BINDING,
  metadata: CORE_TENANT_CONTEXT_METADATA,
  snapshot: CORE_TENANT_CONTEXT_SNAPSHOT,
});

