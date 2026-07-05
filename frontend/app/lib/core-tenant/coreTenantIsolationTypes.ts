import type { TenantIdentity } from "./coreTenantIdentityTypes.ts";
import type { TenantRegistry } from "./coreTenantRegistryTypes.ts";
import type { TenantContext } from "./coreTenantContextTypes.ts";

export type TenantIsolationBoundary = Readonly<{
  readonly boundaryId: "core-tenant-isolation-boundary";
  readonly boundaryName: "Executive Tenant Isolation Boundary";
  readonly tenantScopedOnly: true;
  readonly runtimeEnforcementIncluded: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type TenantIsolationScope = "Tenant" | "TenantContainedObject" | "CrossTenantProhibited";

export type TenantIsolationDomain =
  | "Identity"
  | "Registry"
  | "Context"
  | "Workspace"
  | "Project"
  | "Datasource"
  | "Memory"
  | "Knowledge"
  | "Assistant"
  | "Scene"
  | "Business"
  | "Scenario"
  | "Audit"
  | "Governance";

export type TenantIsolationRule = Readonly<{
  readonly ruleId: `tenant-isolation-rule-${string}`;
  readonly domain: TenantIsolationDomain;
  readonly scope: TenantIsolationScope;
  readonly description: string;
  readonly runtimeEnforcement: false;
  readonly permissionsRequired: false;
  readonly authenticationRequired: false;
  readonly persistenceRequired: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type TenantIsolationGuarantee = Readonly<{
  readonly guaranteeId: `tenant-isolation-guarantee-${string}`;
  readonly domain: TenantIsolationDomain;
  readonly guaranteeType: "ScopedReferenceOnly" | "CrossTenantIsolationRequired" | "MetadataBoundaryOnly";
  readonly description: string;
  readonly consistentWithRuleIds: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type TenantIsolationRisk = Readonly<{
  readonly riskId: `tenant-isolation-risk-${string}`;
  readonly domain: TenantIsolationDomain;
  readonly riskLevel: "Low" | "Moderate" | "High";
  readonly description: string;
  readonly runtimeMitigationIncluded: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type TenantIsolationMetadata = Readonly<{
  readonly namespace: "nexora.core.tenant.isolation";
  readonly metadataVersion: "1.0.0";
  readonly compatibility: readonly ["CORE-TEN-1", "CORE-TEN-2", "CORE-TEN-3"];
  readonly tags: readonly string[];
  readonly labels: Readonly<Record<string, string>>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type TenantIsolationSnapshot = Readonly<{
  readonly snapshotId: "core-tenant-isolation-snapshot";
  readonly tenantIdentityReference: TenantIdentity["tenantId"];
  readonly tenantRegistryReference: TenantRegistry["metadata"]["registryId"];
  readonly tenantContextReference: TenantContext["contextId"];
  readonly domainCount: number;
  readonly ruleCount: number;
  readonly guaranteeCount: number;
  readonly riskCount: number;
  readonly boundaryId: TenantIsolationBoundary["boundaryId"];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type TenantIsolationContract = Readonly<{
  readonly identityReference: TenantIdentity;
  readonly registryReference: TenantRegistry;
  readonly contextReference: TenantContext;
  readonly boundary: TenantIsolationBoundary;
  readonly domains: readonly TenantIsolationDomain[];
  readonly rules: readonly TenantIsolationRule[];
  readonly guarantees: readonly TenantIsolationGuarantee[];
  readonly risks: readonly TenantIsolationRisk[];
  readonly metadata: TenantIsolationMetadata;
  readonly snapshot: TenantIsolationSnapshot;
}>;

export type TenantIsolationManifest = Readonly<{
  readonly platformId: "CORE-TEN-4";
  readonly platformName: "Executive Tenant Isolation Contract";
  readonly platformVersion: "1.0.0";
  readonly platformNamespace: "nexora.core.tenant.isolation";
  readonly compatibility: readonly ["CORE-TEN-1", "CORE-TEN-2", "CORE-TEN-3"];
  readonly snapshot: TenantIsolationSnapshot;
  readonly deterministicFingerprint: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type TenantIsolationValidationResult = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

