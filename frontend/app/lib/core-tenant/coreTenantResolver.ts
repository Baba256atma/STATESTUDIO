import { CORE_TENANT_CANONICAL_IDENTITY } from "./coreTenantIdentityIndex.ts";
import { CORE_TENANT_REGISTRY } from "./coreTenantRegistryIndex.ts";
import { CORE_TENANT_CONTEXT } from "./coreTenantContextIndex.ts";
import { CORE_TENANT_ISOLATION } from "./coreTenantIsolationIndex.ts";
import type {
  TenantResolverCompatibility,
  TenantResolverContract,
  TenantResolverDomain,
  TenantResolverGuarantee,
  TenantResolverInputReference,
  TenantResolverMetadata,
  TenantResolverOutputReference,
  TenantResolverRule,
  TenantResolverSnapshot,
} from "./coreTenantResolverTypes.ts";

export const CORE_TENANT_RESOLVER_DOMAINS: readonly TenantResolverDomain[] = Object.freeze([
  "Identity",
  "Registry",
  "Context",
  "Isolation",
  "Workspace",
  "Project",
  "Datasource",
  "Memory",
  "Knowledge",
  "Assistant",
  "Scene",
  "Business",
  "Scenario",
  "Audit",
  "Governance",
] as const);

function input(
  suffix: string,
  domain: TenantResolverDomain,
  inputType: TenantResolverInputReference["inputType"],
  description: string
): TenantResolverInputReference {
  return Object.freeze({
    inputId: `tenant-resolver-input-${suffix}`,
    domain,
    inputType,
    description,
    runtimeResolution: false,
    metadataOnly: true,
    immutable: true,
  });
}

function output(
  suffix: string,
  domain: TenantResolverDomain,
  outputType: TenantResolverOutputReference["outputType"],
  description: string
): TenantResolverOutputReference {
  return Object.freeze({
    outputId: `tenant-resolver-output-${suffix}`,
    domain,
    outputType,
    description,
    runtimeResolution: false,
    metadataOnly: true,
    immutable: true,
  });
}

function rule(
  suffix: string,
  domain: TenantResolverDomain,
  scope: TenantResolverRule["scope"],
  description: string
): TenantResolverRule {
  return Object.freeze({
    ruleId: `tenant-resolver-rule-${suffix}`,
    domain,
    scope,
    description,
    runtimeResolving: false,
    tenantSwitching: false,
    authenticationRequired: false,
    persistenceRequired: false,
    metadataOnly: true,
    immutable: true,
  });
}

function guarantee(
  suffix: string,
  domain: TenantResolverDomain,
  guaranteeType: TenantResolverGuarantee["guaranteeType"],
  description: string,
  consistentWithRuleIds: readonly string[]
): TenantResolverGuarantee {
  return Object.freeze({
    guaranteeId: `tenant-resolver-guarantee-${suffix}`,
    domain,
    guaranteeType,
    description,
    consistentWithRuleIds: Object.freeze([...consistentWithRuleIds]),
    metadataOnly: true,
    immutable: true,
  });
}

export const CORE_TENANT_RESOLVER_INPUTS: readonly TenantResolverInputReference[] = Object.freeze([
  input("identity", "Identity", "TenantIdentityReference", "Identity resolution contracts begin from tenant identity metadata."),
  input("registry", "Registry", "RegistryReference", "Registry resolution contracts begin from tenant registry metadata."),
  input("context", "Context", "ContextReference", "Context resolution contracts begin from tenant context metadata."),
  input("isolation", "Isolation", "IsolationReference", "Isolation resolution contracts begin from tenant isolation metadata."),
  input("workspace", "Workspace", "TenantReference", "Workspace resolution contracts begin from a tenant reference."),
  input("project", "Project", "TenantReference", "Project resolution contracts begin from a tenant reference."),
  input("datasource", "Datasource", "TenantReference", "Datasource resolution contracts begin from a tenant reference."),
  input("memory", "Memory", "TenantReference", "Memory resolution contracts begin from a tenant reference."),
  input("knowledge", "Knowledge", "TenantReference", "Knowledge resolution contracts begin from a tenant reference."),
  input("assistant", "Assistant", "TenantReference", "Assistant resolution contracts begin from a tenant reference."),
  input("scene", "Scene", "TenantReference", "Scene resolution contracts begin from a tenant reference."),
  input("business", "Business", "TenantReference", "Business resolution contracts begin from a tenant reference."),
  input("scenario", "Scenario", "TenantReference", "Scenario resolution contracts begin from a tenant reference."),
  input("audit", "Audit", "TenantReference", "Audit resolution contracts begin from a tenant reference."),
  input("governance", "Governance", "TenantReference", "Governance resolution contracts begin from a tenant reference."),
] as const);

export const CORE_TENANT_RESOLVER_OUTPUTS: readonly TenantResolverOutputReference[] = Object.freeze([
  output("identity", "Identity", "ResolvedTenantReferenceContract", "Identity outputs a tenant-compatible reference contract."),
  output("registry", "Registry", "ResolvedTenantCompatibilityContract", "Registry outputs a tenant-compatible registry contract."),
  output("context", "Context", "ResolvedTenantScopeContract", "Context outputs a tenant-scoped context contract."),
  output("isolation", "Isolation", "ResolvedTenantCompatibilityContract", "Isolation outputs a tenant isolation compatibility contract."),
  output("workspace", "Workspace", "ResolvedTenantScopeContract", "Workspace outputs a tenant-contained scope contract."),
  output("project", "Project", "ResolvedTenantScopeContract", "Project outputs a tenant-contained scope contract."),
  output("datasource", "Datasource", "ResolvedTenantScopeContract", "Datasource outputs a tenant-contained scope contract."),
  output("memory", "Memory", "ResolvedTenantScopeContract", "Memory outputs a tenant-contained scope contract."),
  output("knowledge", "Knowledge", "ResolvedTenantScopeContract", "Knowledge outputs a tenant-contained scope contract."),
  output("assistant", "Assistant", "ResolvedTenantCompatibilityContract", "Assistant outputs a tenant-compatible context contract."),
  output("scene", "Scene", "ResolvedTenantScopeContract", "Scene outputs a tenant-contained scope contract."),
  output("business", "Business", "ResolvedTenantScopeContract", "Business outputs a tenant-contained scope contract."),
  output("scenario", "Scenario", "ResolvedTenantScopeContract", "Scenario outputs a tenant-contained scope contract."),
  output("audit", "Audit", "ResolvedTenantCompatibilityContract", "Audit outputs a tenant-compatible audit contract."),
  output("governance", "Governance", "ResolvedTenantCompatibilityContract", "Governance outputs a tenant-compatible governance contract."),
] as const);

export const CORE_TENANT_RESOLVER_RULES: readonly TenantResolverRule[] = Object.freeze([
  rule("identity", "Identity", "Tenant", "Identity resolver metadata must remain tenant-scoped and contract-only."),
  rule("registry", "Registry", "Tenant", "Registry resolver metadata must remain tenant-scoped and contract-only."),
  rule("context", "Context", "Tenant", "Context resolver metadata must remain tenant-scoped and contract-only."),
  rule("isolation", "Isolation", "Tenant", "Isolation resolver metadata must remain tenant-scoped and contract-only."),
  rule("workspace", "Workspace", "TenantContainedReference", "Workspace resolver metadata must describe tenant-contained references only."),
  rule("project", "Project", "TenantContainedReference", "Project resolver metadata must describe tenant-contained references only."),
  rule("datasource", "Datasource", "CrossTenantResolutionProhibited", "Datasource resolver metadata must prohibit cross-tenant resolution."),
  rule("memory", "Memory", "TenantContainedReference", "Memory resolver metadata must describe tenant-contained references only."),
  rule("knowledge", "Knowledge", "TenantContainedReference", "Knowledge resolver metadata must describe tenant-contained references only."),
  rule("assistant", "Assistant", "CrossTenantResolutionProhibited", "Assistant resolver metadata must prohibit cross-tenant resolution."),
  rule("scene", "Scene", "TenantContainedReference", "Scene resolver metadata must describe tenant-contained references only."),
  rule("business", "Business", "TenantContainedReference", "Business resolver metadata must describe tenant-contained references only."),
  rule("scenario", "Scenario", "TenantContainedReference", "Scenario resolver metadata must describe tenant-contained references only."),
  rule("audit", "Audit", "CrossTenantResolutionProhibited", "Audit resolver metadata must prohibit cross-tenant resolution."),
  rule("governance", "Governance", "Tenant", "Governance resolver metadata must remain tenant-scoped and contract-only."),
] as const);

export const CORE_TENANT_RESOLVER_GUARANTEES: readonly TenantResolverGuarantee[] = Object.freeze([
  guarantee("identity", "Identity", "ReferenceCompatibilityOnly", "Identity resolver contracts describe compatible identity references only.", ["tenant-resolver-rule-identity"]),
  guarantee("registry", "Registry", "ReferenceCompatibilityOnly", "Registry resolver contracts describe compatible registry references only.", ["tenant-resolver-rule-registry"]),
  guarantee("context", "Context", "ScopedResolutionContractOnly", "Context resolver contracts describe tenant-scoped context references only.", ["tenant-resolver-rule-context"]),
  guarantee("isolation", "Isolation", "ReferenceCompatibilityOnly", "Isolation resolver contracts describe isolation-compatible references only.", ["tenant-resolver-rule-isolation"]),
  guarantee("workspace", "Workspace", "ScopedResolutionContractOnly", "Workspace resolver contracts describe tenant-contained scope only.", ["tenant-resolver-rule-workspace"]),
  guarantee("project", "Project", "ScopedResolutionContractOnly", "Project resolver contracts describe tenant-contained scope only.", ["tenant-resolver-rule-project"]),
  guarantee("datasource", "Datasource", "CrossTenantProhibition", "Datasource resolver contracts prohibit cross-tenant resolution.", ["tenant-resolver-rule-datasource"]),
  guarantee("memory", "Memory", "ScopedResolutionContractOnly", "Memory resolver contracts describe tenant-contained scope only.", ["tenant-resolver-rule-memory"]),
  guarantee("knowledge", "Knowledge", "ScopedResolutionContractOnly", "Knowledge resolver contracts describe tenant-contained scope only.", ["tenant-resolver-rule-knowledge"]),
  guarantee("assistant", "Assistant", "CrossTenantProhibition", "Assistant resolver contracts prohibit cross-tenant resolution.", ["tenant-resolver-rule-assistant"]),
  guarantee("scene", "Scene", "ScopedResolutionContractOnly", "Scene resolver contracts describe tenant-contained scope only.", ["tenant-resolver-rule-scene"]),
  guarantee("business", "Business", "ScopedResolutionContractOnly", "Business resolver contracts describe tenant-contained scope only.", ["tenant-resolver-rule-business"]),
  guarantee("scenario", "Scenario", "ScopedResolutionContractOnly", "Scenario resolver contracts describe tenant-contained scope only.", ["tenant-resolver-rule-scenario"]),
  guarantee("audit", "Audit", "CrossTenantProhibition", "Audit resolver contracts prohibit cross-tenant resolution.", ["tenant-resolver-rule-audit"]),
  guarantee("governance", "Governance", "ReferenceCompatibilityOnly", "Governance resolver contracts describe compatible governance references only.", ["tenant-resolver-rule-governance"]),
] as const);

export const CORE_TENANT_RESOLVER_COMPATIBILITY: TenantResolverCompatibility = Object.freeze({
  compatibilityId: "core-tenant-resolver-compatibility",
  supportedContracts: Object.freeze(["CORE-TEN-1", "CORE-TEN-2", "CORE-TEN-3", "CORE-TEN-4"] as const),
  metadataOnly: true,
  immutable: true,
});

export const CORE_TENANT_RESOLVER_METADATA: TenantResolverMetadata = Object.freeze({
  namespace: "nexora.core.tenant.resolver",
  metadataVersion: "1.0.0",
  tags: Object.freeze([
    "core",
    "tenant",
    "resolver",
    "metadata-only",
    "contract-only",
  ] as const),
  labels: Object.freeze({
    layer: "core-tenant-resolver",
    certification: "CORE-TEN-5",
    purpose: "tenant-resolver-contract",
  }),
  metadataOnly: true,
  immutable: true,
});

export const CORE_TENANT_RESOLVER_SNAPSHOT: TenantResolverSnapshot = Object.freeze({
  snapshotId: "core-tenant-resolver-snapshot",
  tenantIdentityReference: CORE_TENANT_CANONICAL_IDENTITY.tenantId,
  tenantRegistryReference: CORE_TENANT_REGISTRY.metadata.registryId,
  tenantContextReference: CORE_TENANT_CONTEXT.contextId,
  tenantIsolationReference: CORE_TENANT_ISOLATION.boundary.boundaryId,
  domainCount: CORE_TENANT_RESOLVER_DOMAINS.length,
  inputCount: CORE_TENANT_RESOLVER_INPUTS.length,
  outputCount: CORE_TENANT_RESOLVER_OUTPUTS.length,
  ruleCount: CORE_TENANT_RESOLVER_RULES.length,
  guaranteeCount: CORE_TENANT_RESOLVER_GUARANTEES.length,
  metadataOnly: true,
  immutable: true,
});

export const CORE_TENANT_RESOLVER: TenantResolverContract = Object.freeze({
  identityReference: CORE_TENANT_CANONICAL_IDENTITY,
  registryReference: CORE_TENANT_REGISTRY,
  contextReference: CORE_TENANT_CONTEXT,
  isolationReference: CORE_TENANT_ISOLATION,
  domains: CORE_TENANT_RESOLVER_DOMAINS,
  inputs: CORE_TENANT_RESOLVER_INPUTS,
  outputs: CORE_TENANT_RESOLVER_OUTPUTS,
  rules: CORE_TENANT_RESOLVER_RULES,
  guarantees: CORE_TENANT_RESOLVER_GUARANTEES,
  compatibility: CORE_TENANT_RESOLVER_COMPATIBILITY,
  metadata: CORE_TENANT_RESOLVER_METADATA,
  snapshot: CORE_TENANT_RESOLVER_SNAPSHOT,
});

