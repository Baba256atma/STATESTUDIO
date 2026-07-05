import type {
  CoreTenantIdentityRegistry,
  TenantBoundary,
  TenantIdentity,
} from "./coreTenantIdentityTypes.ts";

export const CORE_TENANT_BOUNDARY: TenantBoundary = Object.freeze({
  boundaryId: "core-tenant-boundary",
  highestIsolationBoundary: true,
  prohibitsExternalExistence: true,
  containedPlatformObjects: Object.freeze([
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
    "Executive Brain",
  ] as const),
  metadataOnly: true,
  immutable: true,
});

export const CORE_TENANT_CANONICAL_IDENTITY: TenantIdentity = Object.freeze({
  tenantId: "tenant-executive-root",
  tenantCode: "TENANT_EXECUTIVE_ROOT",
  tenantName: "Executive Root Tenant",
  classification: "Executive",
  status: "Certified",
  metadata: Object.freeze({
    displayName: "Executive Root Tenant",
    description: "Canonical tenant identity metadata for the highest Nexora isolation boundary.",
    createdArchitectureVersion: "NPA-1.0.0",
    identityVersion: "1.0.0",
    namespace: "nexora.core.tenant",
    tags: Object.freeze([
      "core",
      "tenant",
      "identity",
      "metadata-only",
      "isolation-boundary",
    ] as const),
    labels: Object.freeze({
      layer: "core-tenant",
      certification: "CORE-TEN-1",
      scope: "global-tenant-boundary",
    }),
    ownerReference: "NexoraArchitecture",
    metadataVersion: "1.0.0",
  }),
  boundary: CORE_TENANT_BOUNDARY,
});

export const CORE_TENANT_IDENTITY_REGISTRY: CoreTenantIdentityRegistry = Object.freeze({
  platformId: "CORE-TEN-1",
  platformName: "Executive Tenant Identity Foundation",
  platformVersion: "1.0.0",
  platformNamespace: "nexora.core.tenant",
  identitySchemaVersion: "1.0.0",
  supportedTenantVersions: Object.freeze(["1.0.0"] as const),
  metadataVersion: "1.0.0",
  canonicalTenantIdentity: CORE_TENANT_CANONICAL_IDENTITY,
});

