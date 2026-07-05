import type {
  TenantClassification,
  TenantId,
  TenantIdentity,
  TenantStatus,
  TenantVersion,
} from "./coreTenantIdentityTypes.ts";

export type RegistryVersion = "1.0.0";

export type RegistryState = "Defined" | "Certified" | "Frozen";

export type RegistryMetadata = Readonly<{
  readonly registryId: "core-tenant-registry";
  readonly registryName: "Executive Tenant Registry";
  readonly registryVersion: RegistryVersion;
  readonly platformId: "CORE-TEN-2";
  readonly platformNamespace: "nexora.core.tenant.registry";
  readonly schemaVersion: "1.0.0";
  readonly metadataVersion: "1.0.0";
  readonly identityFoundationVersion: "CORE-TEN-1";
  readonly state: RegistryState;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type TenantRegistryEntry = Readonly<{
  readonly entryId: `tenant-registry-entry-${string}`;
  readonly tenantId: TenantId;
  readonly tenantNamespace: "nexora.core.tenant";
  readonly tenantVersion: TenantVersion;
  readonly tenantStatus: TenantStatus;
  readonly tenantClassification: TenantClassification;
  readonly identityReference: TenantIdentity;
  readonly metadataVersion: "1.0.0";
  readonly schemaVersion: "1.0.0";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type RegistryStatistics = Readonly<{
  readonly registeredTenantCount: number;
  readonly namespaceCount: number;
  readonly statusCounts: Readonly<Record<TenantStatus, number>>;
  readonly classificationCounts: Readonly<Record<TenantClassification, number>>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type RegistrySnapshot = Readonly<{
  readonly snapshotId: "core-tenant-registry-snapshot";
  readonly registryVersion: RegistryVersion;
  readonly entries: readonly TenantRegistryEntry[];
  readonly statistics: RegistryStatistics;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type RegistryIntegrity = Readonly<{
  readonly identityReferencesValid: boolean;
  readonly schemaCompatible: boolean;
  readonly namespaceUnique: boolean;
  readonly tenantIdsUnique: boolean;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type TenantRegistry = Readonly<{
  readonly metadata: RegistryMetadata;
  readonly entries: readonly TenantRegistryEntry[];
  readonly statistics: RegistryStatistics;
  readonly snapshot: RegistrySnapshot;
  readonly integrity: RegistryIntegrity;
}>;

export type RegistryManifest = Readonly<{
  readonly platformId: "CORE-TEN-2";
  readonly platformName: "Executive Tenant Registry Platform";
  readonly platformVersion: "1.0.0";
  readonly platformNamespace: "nexora.core.tenant.registry";
  readonly registryVersion: RegistryVersion;
  readonly schemaVersion: "1.0.0";
  readonly metadataVersion: "1.0.0";
  readonly tenantRegistry: TenantRegistry;
  readonly deterministicFingerprint: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type RegistryValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

