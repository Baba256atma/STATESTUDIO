import type { TenantIdentity } from "./coreTenantIdentityTypes.ts";
import type { TenantRegistry } from "./coreTenantRegistryTypes.ts";
import type { TenantContext } from "./coreTenantContextTypes.ts";
import type { TenantIsolationContract } from "./coreTenantIsolationTypes.ts";

export type TenantResolverScope = "Tenant" | "TenantContainedReference" | "CrossTenantResolutionProhibited";

export type TenantResolverDomain =
  | "Identity"
  | "Registry"
  | "Context"
  | "Isolation"
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

export type TenantResolverInputReference = Readonly<{
  readonly inputId: `tenant-resolver-input-${string}`;
  readonly domain: TenantResolverDomain;
  readonly inputType: "TenantReference" | "TenantIdentityReference" | "RegistryReference" | "ContextReference" | "IsolationReference";
  readonly description: string;
  readonly runtimeResolution: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type TenantResolverOutputReference = Readonly<{
  readonly outputId: `tenant-resolver-output-${string}`;
  readonly domain: TenantResolverDomain;
  readonly outputType: "ResolvedTenantScopeContract" | "ResolvedTenantCompatibilityContract" | "ResolvedTenantReferenceContract";
  readonly description: string;
  readonly runtimeResolution: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type TenantResolverRule = Readonly<{
  readonly ruleId: `tenant-resolver-rule-${string}`;
  readonly domain: TenantResolverDomain;
  readonly scope: TenantResolverScope;
  readonly description: string;
  readonly runtimeResolving: false;
  readonly tenantSwitching: false;
  readonly authenticationRequired: false;
  readonly persistenceRequired: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type TenantResolverGuarantee = Readonly<{
  readonly guaranteeId: `tenant-resolver-guarantee-${string}`;
  readonly domain: TenantResolverDomain;
  readonly guaranteeType: "ReferenceCompatibilityOnly" | "ScopedResolutionContractOnly" | "CrossTenantProhibition";
  readonly description: string;
  readonly consistentWithRuleIds: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type TenantResolverCompatibility = Readonly<{
  readonly compatibilityId: "core-tenant-resolver-compatibility";
  readonly supportedContracts: readonly ["CORE-TEN-1", "CORE-TEN-2", "CORE-TEN-3", "CORE-TEN-4"];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type TenantResolverMetadata = Readonly<{
  readonly namespace: "nexora.core.tenant.resolver";
  readonly metadataVersion: "1.0.0";
  readonly tags: readonly string[];
  readonly labels: Readonly<Record<string, string>>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type TenantResolverSnapshot = Readonly<{
  readonly snapshotId: "core-tenant-resolver-snapshot";
  readonly tenantIdentityReference: TenantIdentity["tenantId"];
  readonly tenantRegistryReference: TenantRegistry["metadata"]["registryId"];
  readonly tenantContextReference: TenantContext["contextId"];
  readonly tenantIsolationReference: TenantIsolationContract["boundary"]["boundaryId"];
  readonly domainCount: number;
  readonly inputCount: number;
  readonly outputCount: number;
  readonly ruleCount: number;
  readonly guaranteeCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type TenantResolverContract = Readonly<{
  readonly identityReference: TenantIdentity;
  readonly registryReference: TenantRegistry;
  readonly contextReference: TenantContext;
  readonly isolationReference: TenantIsolationContract;
  readonly domains: readonly TenantResolverDomain[];
  readonly inputs: readonly TenantResolverInputReference[];
  readonly outputs: readonly TenantResolverOutputReference[];
  readonly rules: readonly TenantResolverRule[];
  readonly guarantees: readonly TenantResolverGuarantee[];
  readonly compatibility: TenantResolverCompatibility;
  readonly metadata: TenantResolverMetadata;
  readonly snapshot: TenantResolverSnapshot;
}>;

export type TenantResolverManifest = Readonly<{
  readonly platformId: "CORE-TEN-5";
  readonly platformName: "Executive Tenant Resolver Contract";
  readonly platformVersion: "1.0.0";
  readonly platformNamespace: "nexora.core.tenant.resolver";
  readonly compatibility: readonly ["CORE-TEN-1", "CORE-TEN-2", "CORE-TEN-3", "CORE-TEN-4"];
  readonly snapshot: TenantResolverSnapshot;
  readonly deterministicFingerprint: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type TenantResolverValidationResult = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

