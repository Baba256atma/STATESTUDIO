import type { TenantBoundary, TenantIdentity } from "./coreTenantIdentityTypes.ts";
import type { RegistryMetadata, TenantRegistry, TenantRegistryEntry } from "./coreTenantRegistryTypes.ts";

export type TenantContextId = `tenant-context-${string}`;

export type TenantContextScope = "Architecture" | "Platform" | "WorkspaceReference" | "ScenarioReference";

export type TenantContextMode = "ReferenceOnly" | "InspectionOnly" | "CompatibilityOnly";

export type TenantContextSource = "TenantIdentity" | "TenantRegistry" | "ArchitectureBootstrap";

export type TenantContextStatus = "Defined" | "Validated" | "Certified";

export type TenantContextBinding = Readonly<{
  readonly currentTenantReference: TenantRegistryEntry["tenantId"];
  readonly tenantIdentityReference: TenantIdentity;
  readonly tenantRegistryReference: TenantRegistry;
  readonly tenantRegistryEntryReference: TenantRegistryEntry;
  readonly registryMetadataReference: RegistryMetadata;
  readonly contextBoundary: TenantBoundary;
}>;

export type TenantContextMetadata = Readonly<{
  readonly displayName: string;
  readonly description: string;
  readonly compatibility: readonly ["CORE-TEN-1", "CORE-TEN-2"];
  readonly namespace: "nexora.core.tenant.context";
  readonly metadataVersion: "1.0.0";
  readonly tags: readonly string[];
  readonly labels: Readonly<Record<string, string>>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type TenantContextSnapshot = Readonly<{
  readonly snapshotId: "core-tenant-context-snapshot";
  readonly tenantId: TenantRegistryEntry["tenantId"];
  readonly tenantNamespace: TenantRegistryEntry["tenantNamespace"];
  readonly registryVersion: RegistryMetadata["registryVersion"];
  readonly scope: TenantContextScope;
  readonly mode: TenantContextMode;
  readonly source: TenantContextSource;
  readonly status: TenantContextStatus;
  readonly boundaryId: TenantBoundary["boundaryId"];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type TenantContextManifest = Readonly<{
  readonly platformId: "CORE-TEN-3";
  readonly platformName: "Executive Tenant Context Foundation";
  readonly platformVersion: "1.0.0";
  readonly platformNamespace: "nexora.core.tenant.context";
  readonly contextId: TenantContextId;
  readonly scope: TenantContextScope;
  readonly mode: TenantContextMode;
  readonly source: TenantContextSource;
  readonly status: TenantContextStatus;
  readonly compatibility: readonly ["CORE-TEN-1", "CORE-TEN-2"];
  readonly snapshot: TenantContextSnapshot;
  readonly deterministicFingerprint: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type TenantContext = Readonly<{
  readonly contextId: TenantContextId;
  readonly scope: TenantContextScope;
  readonly mode: TenantContextMode;
  readonly source: TenantContextSource;
  readonly status: TenantContextStatus;
  readonly binding: TenantContextBinding;
  readonly metadata: TenantContextMetadata;
  readonly snapshot: TenantContextSnapshot;
}>;

export type TenantContextValidationResult = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

