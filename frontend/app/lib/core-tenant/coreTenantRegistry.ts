import { CORE_TENANT_CANONICAL_IDENTITY } from "./coreTenantIdentityIndex.ts";
import type {
  RegistryIntegrity,
  RegistryMetadata,
  RegistrySnapshot,
  RegistryStatistics,
  TenantRegistry,
  TenantRegistryEntry,
} from "./coreTenantRegistryTypes.ts";

export const CORE_TENANT_REGISTRY_METADATA: RegistryMetadata = Object.freeze({
  registryId: "core-tenant-registry",
  registryName: "Executive Tenant Registry",
  registryVersion: "1.0.0",
  platformId: "CORE-TEN-2",
  platformNamespace: "nexora.core.tenant.registry",
  schemaVersion: "1.0.0",
  metadataVersion: "1.0.0",
  identityFoundationVersion: "CORE-TEN-1",
  state: "Certified",
  metadataOnly: true,
  immutable: true,
});

export const CORE_TENANT_REGISTRY_ENTRIES: readonly TenantRegistryEntry[] = Object.freeze([
  Object.freeze({
    entryId: "tenant-registry-entry-executive-root",
    tenantId: CORE_TENANT_CANONICAL_IDENTITY.tenantId,
    tenantNamespace: CORE_TENANT_CANONICAL_IDENTITY.metadata.namespace,
    tenantVersion: CORE_TENANT_CANONICAL_IDENTITY.metadata.identityVersion,
    tenantStatus: CORE_TENANT_CANONICAL_IDENTITY.status,
    tenantClassification: CORE_TENANT_CANONICAL_IDENTITY.classification,
    identityReference: CORE_TENANT_CANONICAL_IDENTITY,
    metadataVersion: "1.0.0",
    schemaVersion: "1.0.0",
    metadataOnly: true,
    immutable: true,
  }),
] as const);

export const CORE_TENANT_REGISTRY_STATISTICS: RegistryStatistics = Object.freeze({
  registeredTenantCount: CORE_TENANT_REGISTRY_ENTRIES.length,
  namespaceCount: new Set(CORE_TENANT_REGISTRY_ENTRIES.map((entry) => entry.tenantNamespace)).size,
  statusCounts: Object.freeze({
    Defined: 0,
    Certified: 1,
    Frozen: 0,
    Archived: 0,
  }),
  classificationCounts: Object.freeze({
    Executive: 1,
    Enterprise: 0,
    Government: 0,
    Internal: 0,
  }),
  metadataOnly: true,
  immutable: true,
});

export const CORE_TENANT_REGISTRY_INTEGRITY: RegistryIntegrity = Object.freeze({
  identityReferencesValid: CORE_TENANT_REGISTRY_ENTRIES.every(
    (entry) =>
      entry.identityReference.tenantId === entry.tenantId &&
      entry.identityReference.metadata.namespace === entry.tenantNamespace
  ),
  schemaCompatible: CORE_TENANT_REGISTRY_ENTRIES.every(
    (entry) => entry.schemaVersion === CORE_TENANT_REGISTRY_METADATA.schemaVersion
  ),
  namespaceUnique: new Set(CORE_TENANT_REGISTRY_ENTRIES.map((entry) => entry.tenantNamespace)).size === CORE_TENANT_REGISTRY_ENTRIES.length,
  tenantIdsUnique: new Set(CORE_TENANT_REGISTRY_ENTRIES.map((entry) => entry.tenantId)).size === CORE_TENANT_REGISTRY_ENTRIES.length,
  metadataOnly: true,
  immutable: true,
});

export const CORE_TENANT_REGISTRY_SNAPSHOT: RegistrySnapshot = Object.freeze({
  snapshotId: "core-tenant-registry-snapshot",
  registryVersion: CORE_TENANT_REGISTRY_METADATA.registryVersion,
  entries: CORE_TENANT_REGISTRY_ENTRIES,
  statistics: CORE_TENANT_REGISTRY_STATISTICS,
  metadataOnly: true,
  immutable: true,
});

export const CORE_TENANT_REGISTRY: TenantRegistry = Object.freeze({
  metadata: CORE_TENANT_REGISTRY_METADATA,
  entries: CORE_TENANT_REGISTRY_ENTRIES,
  statistics: CORE_TENANT_REGISTRY_STATISTICS,
  snapshot: CORE_TENANT_REGISTRY_SNAPSHOT,
  integrity: CORE_TENANT_REGISTRY_INTEGRITY,
});

