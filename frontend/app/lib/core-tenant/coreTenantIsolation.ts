import { CORE_TENANT_CANONICAL_IDENTITY } from "./coreTenantIdentityIndex.ts";
import { CORE_TENANT_REGISTRY } from "./coreTenantRegistryIndex.ts";
import { CORE_TENANT_CONTEXT } from "./coreTenantContextIndex.ts";
import type {
  TenantIsolationBoundary,
  TenantIsolationContract,
  TenantIsolationDomain,
  TenantIsolationGuarantee,
  TenantIsolationMetadata,
  TenantIsolationRisk,
  TenantIsolationRule,
  TenantIsolationSnapshot,
} from "./coreTenantIsolationTypes.ts";

export const CORE_TENANT_ISOLATION_BOUNDARY: TenantIsolationBoundary = Object.freeze({
  boundaryId: "core-tenant-isolation-boundary",
  boundaryName: "Executive Tenant Isolation Boundary",
  tenantScopedOnly: true,
  runtimeEnforcementIncluded: false,
  metadataOnly: true,
  immutable: true,
});

export const CORE_TENANT_ISOLATION_DOMAINS: readonly TenantIsolationDomain[] = Object.freeze([
  "Identity",
  "Registry",
  "Context",
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

function rule(
  suffix: string,
  domain: TenantIsolationDomain,
  description: string,
  scope: "Tenant" | "TenantContainedObject" | "CrossTenantProhibited"
): TenantIsolationRule {
  return Object.freeze({
    ruleId: `tenant-isolation-rule-${suffix}`,
    domain,
    scope,
    description,
    runtimeEnforcement: false,
    permissionsRequired: false,
    authenticationRequired: false,
    persistenceRequired: false,
    metadataOnly: true,
    immutable: true,
  });
}

function guarantee(
  suffix: string,
  domain: TenantIsolationDomain,
  guaranteeType: "ScopedReferenceOnly" | "CrossTenantIsolationRequired" | "MetadataBoundaryOnly",
  description: string,
  consistentWithRuleIds: readonly string[]
): TenantIsolationGuarantee {
  return Object.freeze({
    guaranteeId: `tenant-isolation-guarantee-${suffix}`,
    domain,
    guaranteeType,
    description,
    consistentWithRuleIds: Object.freeze([...consistentWithRuleIds]),
    metadataOnly: true,
    immutable: true,
  });
}

function risk(
  suffix: string,
  domain: TenantIsolationDomain,
  riskLevel: "Low" | "Moderate" | "High",
  description: string
): TenantIsolationRisk {
  return Object.freeze({
    riskId: `tenant-isolation-risk-${suffix}`,
    domain,
    riskLevel,
    description,
    runtimeMitigationIncluded: false,
    metadataOnly: true,
    immutable: true,
  });
}

export const CORE_TENANT_ISOLATION_RULES: readonly TenantIsolationRule[] = Object.freeze([
  rule("identity", "Identity", "Tenant identity metadata must remain tenant-scoped and must not resolve outside the owning tenant boundary.", "Tenant"),
  rule("registry", "Registry", "Tenant registry metadata must reference only tenant-compatible identity records.", "Tenant"),
  rule("context", "Context", "Tenant context metadata must bind only to registry and identity records within the same tenant scope.", "Tenant"),
  rule("workspace", "Workspace", "Workspace metadata must resolve through a tenant-contained object scope.", "TenantContainedObject"),
  rule("project", "Project", "Project metadata must resolve through a tenant-contained object scope.", "TenantContainedObject"),
  rule("datasource", "Datasource", "Datasource metadata must remain tenant-contained and cross-tenant use must be prohibited by architecture.", "CrossTenantProhibited"),
  rule("memory", "Memory", "Memory metadata must remain tenant-contained and reference only tenant-compatible context.", "TenantContainedObject"),
  rule("knowledge", "Knowledge", "Knowledge metadata must remain tenant-contained and reference only tenant-compatible registry metadata.", "TenantContainedObject"),
  rule("assistant", "Assistant", "Assistant metadata must remain tenant-contained and must not cross tenant references.", "CrossTenantProhibited"),
  rule("scene", "Scene", "Scene metadata must remain tenant-contained and context-scoped.", "TenantContainedObject"),
  rule("business", "Business", "Business metadata must remain tenant-contained and architecture-scoped.", "TenantContainedObject"),
  rule("scenario", "Scenario", "Scenario metadata must remain tenant-contained and context-compatible.", "TenantContainedObject"),
  rule("audit", "Audit", "Audit metadata must remain tenant-contained and may not merge cross-tenant references.", "CrossTenantProhibited"),
  rule("governance", "Governance", "Governance metadata must describe tenant-scoped controls without runtime enforcement.", "Tenant"),
] as const);

export const CORE_TENANT_ISOLATION_GUARANTEES: readonly TenantIsolationGuarantee[] = Object.freeze([
  guarantee("identity", "Identity", "ScopedReferenceOnly", "Identity metadata remains scoped to a single tenant reference.", ["tenant-isolation-rule-identity"]),
  guarantee("registry", "Registry", "ScopedReferenceOnly", "Registry metadata remains scoped to tenant-compatible identity records.", ["tenant-isolation-rule-registry"]),
  guarantee("context", "Context", "ScopedReferenceOnly", "Context metadata remains scoped to a single tenant binding.", ["tenant-isolation-rule-context"]),
  guarantee("workspace", "Workspace", "MetadataBoundaryOnly", "Workspace metadata must declare tenant containment before later runtime ownership layers exist.", ["tenant-isolation-rule-workspace"]),
  guarantee("project", "Project", "MetadataBoundaryOnly", "Project metadata must declare tenant containment before later runtime ownership layers exist.", ["tenant-isolation-rule-project"]),
  guarantee("datasource", "Datasource", "CrossTenantIsolationRequired", "Datasource metadata must never imply cross-tenant sharing.", ["tenant-isolation-rule-datasource"]),
  guarantee("memory", "Memory", "MetadataBoundaryOnly", "Memory metadata must remain tenant-contained.", ["tenant-isolation-rule-memory"]),
  guarantee("knowledge", "Knowledge", "MetadataBoundaryOnly", "Knowledge metadata must remain tenant-contained.", ["tenant-isolation-rule-knowledge"]),
  guarantee("assistant", "Assistant", "CrossTenantIsolationRequired", "Assistant metadata must not imply cross-tenant context binding.", ["tenant-isolation-rule-assistant"]),
  guarantee("scene", "Scene", "MetadataBoundaryOnly", "Scene metadata must remain tenant-contained.", ["tenant-isolation-rule-scene"]),
  guarantee("business", "Business", "MetadataBoundaryOnly", "Business metadata must remain tenant-contained.", ["tenant-isolation-rule-business"]),
  guarantee("scenario", "Scenario", "MetadataBoundaryOnly", "Scenario metadata must remain tenant-contained.", ["tenant-isolation-rule-scenario"]),
  guarantee("audit", "Audit", "CrossTenantIsolationRequired", "Audit metadata must not imply cross-tenant merges.", ["tenant-isolation-rule-audit"]),
  guarantee("governance", "Governance", "ScopedReferenceOnly", "Governance metadata must remain tenant-scoped and contract-only.", ["tenant-isolation-rule-governance"]),
] as const);

export const CORE_TENANT_ISOLATION_RISKS: readonly TenantIsolationRisk[] = Object.freeze([
  risk("identity", "Identity", "Moderate", "Identity drift could create invalid tenant references in future layers."),
  risk("registry", "Registry", "Moderate", "Registry drift could allow incompatible tenant metadata catalogs."),
  risk("context", "Context", "Moderate", "Context drift could create mismatched tenant bindings."),
  risk("workspace", "Workspace", "High", "Workspace metadata could later leak across tenant boundaries if not scoped."),
  risk("project", "Project", "High", "Project metadata could later leak across tenant boundaries if not scoped."),
  risk("datasource", "Datasource", "High", "Datasource metadata may incorrectly imply cross-tenant access."),
  risk("memory", "Memory", "High", "Memory metadata may accumulate cross-tenant references if not bounded."),
  risk("knowledge", "Knowledge", "High", "Knowledge metadata may imply unbounded reuse across tenants."),
  risk("assistant", "Assistant", "High", "Assistant metadata may imply cross-tenant context aggregation."),
  risk("scene", "Scene", "Moderate", "Scene metadata may lose tenant containment traceability."),
  risk("business", "Business", "Moderate", "Business metadata may become under-scoped without isolation contracts."),
  risk("scenario", "Scenario", "Moderate", "Scenario metadata may imply cross-tenant simulation aggregation."),
  risk("audit", "Audit", "High", "Audit metadata may imply mixed-tenant event references."),
  risk("governance", "Governance", "Moderate", "Governance metadata may overreach into runtime enforcement concerns."),
] as const);

export const CORE_TENANT_ISOLATION_METADATA: TenantIsolationMetadata = Object.freeze({
  namespace: "nexora.core.tenant.isolation",
  metadataVersion: "1.0.0",
  compatibility: Object.freeze(["CORE-TEN-1", "CORE-TEN-2", "CORE-TEN-3"] as const),
  tags: Object.freeze([
    "core",
    "tenant",
    "isolation",
    "metadata-only",
    "contract-only",
  ] as const),
  labels: Object.freeze({
    layer: "core-tenant-isolation",
    certification: "CORE-TEN-4",
    purpose: "tenant-isolation-contract",
  }),
  metadataOnly: true,
  immutable: true,
});

export const CORE_TENANT_ISOLATION_SNAPSHOT: TenantIsolationSnapshot = Object.freeze({
  snapshotId: "core-tenant-isolation-snapshot",
  tenantIdentityReference: CORE_TENANT_CANONICAL_IDENTITY.tenantId,
  tenantRegistryReference: CORE_TENANT_REGISTRY.metadata.registryId,
  tenantContextReference: CORE_TENANT_CONTEXT.contextId,
  domainCount: CORE_TENANT_ISOLATION_DOMAINS.length,
  ruleCount: CORE_TENANT_ISOLATION_RULES.length,
  guaranteeCount: CORE_TENANT_ISOLATION_GUARANTEES.length,
  riskCount: CORE_TENANT_ISOLATION_RISKS.length,
  boundaryId: CORE_TENANT_ISOLATION_BOUNDARY.boundaryId,
  metadataOnly: true,
  immutable: true,
});

export const CORE_TENANT_ISOLATION: TenantIsolationContract = Object.freeze({
  identityReference: CORE_TENANT_CANONICAL_IDENTITY,
  registryReference: CORE_TENANT_REGISTRY,
  contextReference: CORE_TENANT_CONTEXT,
  boundary: CORE_TENANT_ISOLATION_BOUNDARY,
  domains: CORE_TENANT_ISOLATION_DOMAINS,
  rules: CORE_TENANT_ISOLATION_RULES,
  guarantees: CORE_TENANT_ISOLATION_GUARANTEES,
  risks: CORE_TENANT_ISOLATION_RISKS,
  metadata: CORE_TENANT_ISOLATION_METADATA,
  snapshot: CORE_TENANT_ISOLATION_SNAPSHOT,
});

