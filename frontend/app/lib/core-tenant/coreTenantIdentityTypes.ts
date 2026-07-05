export type TenantId = `tenant-${string}`;

export type TenantCode = `TENANT_${string}`;

export type TenantName = string;

export type TenantVersion = "1.0.0";

export type TenantStatus = "Defined" | "Certified" | "Frozen" | "Archived";

export type TenantClassification = "Executive" | "Enterprise" | "Government" | "Internal";

export type TenantMetadata = Readonly<{
  readonly displayName: string;
  readonly description: string;
  readonly createdArchitectureVersion: "NPA-1.0.0";
  readonly identityVersion: TenantVersion;
  readonly namespace: "nexora.core.tenant";
  readonly tags: readonly string[];
  readonly labels: Readonly<Record<string, string>>;
  readonly ownerReference: "NexoraArchitecture";
  readonly metadataVersion: "1.0.0";
}>;

export type TenantBoundary = Readonly<{
  readonly boundaryId: "core-tenant-boundary";
  readonly highestIsolationBoundary: true;
  readonly prohibitsExternalExistence: true;
  readonly containedPlatformObjects: readonly [
    "Projects",
    "Workspaces",
    "War Rooms",
    "Data Sources",
    "Knowledge",
    "Memory",
    "Business Models",
    "Scenarios",
    "Visual Scene",
    "Assistant Context",
    "Executive Brain"
  ];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type TenantIdentity = Readonly<{
  readonly tenantId: TenantId;
  readonly tenantCode: TenantCode;
  readonly tenantName: TenantName;
  readonly classification: TenantClassification;
  readonly status: TenantStatus;
  readonly metadata: TenantMetadata;
  readonly boundary: TenantBoundary;
}>;

export type TenantIdentityManifest = Readonly<{
  readonly platformId: "CORE-TEN-1";
  readonly platformName: "Executive Tenant Identity Foundation";
  readonly platformVersion: "1.0.0";
  readonly platformNamespace: "nexora.core.tenant";
  readonly identitySchemaVersion: "1.0.0";
  readonly supportedTenantVersions: readonly TenantVersion[];
  readonly metadataVersion: "1.0.0";
  readonly tenantIdentity: TenantIdentity;
  readonly deterministicFingerprint: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type CoreTenantIdentityRegistry = Readonly<{
  readonly platformId: "CORE-TEN-1";
  readonly platformName: "Executive Tenant Identity Foundation";
  readonly platformVersion: "1.0.0";
  readonly platformNamespace: "nexora.core.tenant";
  readonly identitySchemaVersion: "1.0.0";
  readonly supportedTenantVersions: readonly TenantVersion[];
  readonly metadataVersion: "1.0.0";
  readonly canonicalTenantIdentity: TenantIdentity;
}>;

export type CoreTenantIdentityValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

