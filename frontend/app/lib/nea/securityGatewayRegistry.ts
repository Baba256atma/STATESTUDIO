/**
 * NEA-4:2 — Security Gateway Registry.
 *
 * Canonical immutable registry for Security Gateway vocabularies and lookups.
 * Consumes only NEA-4:1 Security Gateway Foundation public surface.
 * Metadata-only. Runtime-free. Ready for Model.
 *
 * Ownership: owned exclusively by NEA-4:2.
 *
 * Public exports (exactly 8):
 *   SecurityGatewayRegistryId
 *   SecurityGatewayRegistryVersion
 *   SecurityGatewayRegistryName
 *   SecurityGatewayRegistryNamespace
 *   SecurityGatewayRegistryStatus
 *   SecurityGatewayRegistryReadiness
 *   SecurityGatewayRegistryPlatform
 *   getSecurityGatewayRegistrySummary()
 */

import {
  SecurityGatewayFoundationId,
  SecurityGatewayFoundationPlatform,
  SecurityGatewayFoundationVersion,
} from "./securityGatewayFoundation.ts";
import { SecurityGatewayCapabilityRegistryCatalog } from "./securityGatewayRegistryCapabilities.ts";
import { SecurityGatewayRegistryCollections } from "./securityGatewayRegistryCollections.ts";
import { SecurityGatewayRegistryMetadata } from "./securityGatewayRegistryMetadata.ts";
import {
  SecurityGatewayRegistryBoundaries,
  SecurityGatewayRegistryOwnership,
} from "./securityGatewayRegistryOwnership.ts";
import { SecurityGatewayRegistryPolicyCatalog } from "./securityGatewayRegistryPolicies.ts";
import type {
  SecurityGatewayRegistryIdentity,
  SecurityGatewayRegistrySummary,
} from "./securityGatewayRegistryTypes.ts";

/** Canonical registry identity. */
export const SecurityGatewayRegistryId =
  "NEA-4:2/SecurityGatewayRegistry" as const;

/** Human-readable registry name. */
export const SecurityGatewayRegistryName =
  "Security Gateway Registry" as const;

/** Semantic version. */
export const SecurityGatewayRegistryVersion = "1.0.0" as const;

/** Canonical namespace. */
export const SecurityGatewayRegistryNamespace =
  "nexora.nea.security-gateway.registry" as const;

/** Registry status. */
export const SecurityGatewayRegistryStatus = "Registry" as const;

/** Immediate next-phase readiness. */
export const SecurityGatewayRegistryReadiness = "ReadyForModel" as const;

const identity: SecurityGatewayRegistryIdentity = Object.freeze({
  registryId: SecurityGatewayRegistryId,
  registryName: SecurityGatewayRegistryName,
  registryVersion: SecurityGatewayRegistryVersion,
  registryNamespace: SecurityGatewayRegistryNamespace,
  layer: "NEA" as const,
  phase: "NEA-4:2" as const,
  stage: "Registry" as const,
  sourcePhase: "NEA-4:2" as const,
  owner: "NEA-4 Security Gateway",
  status: SecurityGatewayRegistryStatus,
  readiness: SecurityGatewayRegistryReadiness,
  foundationId: SecurityGatewayFoundationId,
  foundationVersion: SecurityGatewayFoundationVersion,
  description:
    "Canonical immutable registry of security identities, classifications, authentication methods, authorization levels, trust levels, consent states, roles, permissions, policies, statuses, events, context types, capabilities, and lifecycle.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-4:2/Dependency/NEA41Foundation",
  directPreviousPhaseModule: "securityGatewayFoundation.ts" as const,
  foundationOnly: true as const,
  foundationId: SecurityGatewayFoundationId,
  foundationVersion: SecurityGatewayFoundationVersion,
  foundationPublicSurfaceOnly: true as const,
  publicIndexDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  reconstructsFoundation: false as const,
  duplicatesFoundationValues: false as const,
  canonicalPath:
    "NEA-4:2 → NEA-4:1 SecurityGatewayFoundationPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "collections",
  "capabilities",
  "policies",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
] as const);

const registryApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `NEA-4:2/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-4:2" as const,
    section: "Registry" as const,
    kind,
    version: SecurityGatewayRegistryVersion,
    status: SecurityGatewayRegistryStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "securityGatewayRegistry.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const SecurityGatewayRegistryApiRegistry = Object.freeze([
  registryApi("SecurityGatewayRegistryId", "IdentityConstant"),
  registryApi("SecurityGatewayRegistryVersion", "IdentityConstant"),
  registryApi("SecurityGatewayRegistryName", "IdentityConstant"),
  registryApi("SecurityGatewayRegistryNamespace", "IdentityConstant"),
  registryApi("SecurityGatewayRegistryStatus", "MetadataConstant"),
  registryApi("SecurityGatewayRegistryReadiness", "MetadataConstant"),
  registryApi("SecurityGatewayRegistryPlatform", "Aggregate"),
  registryApi("getSecurityGatewayRegistrySummary", "Helper"),
]);

/**
 * Canonical immutable Security Gateway Registry platform.
 * Nine ordered sections. Metadata only.
 */
export const SecurityGatewayRegistryPlatform = Object.freeze({
  identity,
  dependency,
  collections: SecurityGatewayRegistryCollections,
  capabilities: SecurityGatewayCapabilityRegistryCatalog,
  policies: SecurityGatewayRegistryPolicyCatalog,
  metadata: SecurityGatewayRegistryMetadata,
  ownership: SecurityGatewayRegistryOwnership,
  boundaries: SecurityGatewayRegistryBoundaries,
  readiness: Object.freeze({
    readinessId: "NEA-4:2/RegistryReadiness",
    readiness: SecurityGatewayRegistryReadiness,
    nextPhase: SecurityGatewayRegistryMetadata.nextPhase,
    claimsReadyForModel: true as const,
    claimsReadyForRuntime: false as const,
    claimsAuthenticationImplemented: false as const,
    claimsAuthorizationImplemented: false as const,
    claimsEncryptionImplemented: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: SecurityGatewayRegistryApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: SecurityGatewayRegistryStatus,
  nextPhase: SecurityGatewayRegistryMetadata.nextPhase,
  downstreamReadiness: SecurityGatewayRegistryReadiness,
  foundationPlatform: SecurityGatewayFoundationPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  executesAuthentication: false as const,
  executesAuthorization: false as const,
  implementsEncryption: false as const,
  managesSecrets: false as const,
  generatesTokens: false as const,
  implementsOAuth: false as const,
  implementsJwt: false as const,
  verifiesIdentity: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Security Gateway Registry summary.
 * Counts are derived exclusively from canonical registry collections.
 */
export function getSecurityGatewayRegistrySummary(): SecurityGatewayRegistrySummary {
  const meta = SecurityGatewayRegistryMetadata;
  return Object.freeze({
    registryId: SecurityGatewayRegistryId,
    version: SecurityGatewayRegistryVersion,
    name: SecurityGatewayRegistryName,
    namespace: SecurityGatewayRegistryNamespace,
    layer: "NEA" as const,
    phase: "NEA-4:2" as const,
    status: SecurityGatewayRegistryStatus,
    readiness: SecurityGatewayRegistryReadiness,
    foundationId: SecurityGatewayFoundationId,
    securityIdentityCount: meta.securityIdentityCount,
    classificationCount: meta.classificationCount,
    authenticationMethodCount: meta.authenticationMethodCount,
    authorizationLevelCount: meta.authorizationLevelCount,
    trustLevelCount: meta.trustLevelCount,
    consentStateCount: meta.consentStateCount,
    roleCount: meta.roleCount,
    permissionCount: meta.permissionCount,
    securityPolicyCount: meta.securityPolicyCount,
    statusCount: meta.statusCount,
    eventCount: meta.eventCount,
    contextTypeCount: meta.contextTypeCount,
    contractCount: meta.contractCount,
    capabilityCount: meta.capabilityCount,
    lifecycleEntryCount: meta.lifecycleEntryCount,
    registryPolicyCount: meta.registryPolicyCount,
    totalRegistryEntryCount: meta.totalEntryCount,
    publicExportCount: 8 as const,
    sectionCount: PLATFORM_SECTIONS.length,
    nextPhase: meta.nextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
