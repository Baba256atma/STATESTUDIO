/**
 * NEA-4:1 — Security Gateway Foundation.
 *
 * Immutable architectural foundation for Security Gateway.
 * Consumes only NEA-3 Session & Conversation Public Index.
 * Metadata-only. Runtime-free. Ready for Registry.
 *
 * Ownership: owned exclusively by NEA-4:1.
 *
 * Public exports (exactly 8):
 *   SecurityGatewayFoundationId
 *   SecurityGatewayFoundationVersion
 *   SecurityGatewayFoundationName
 *   SecurityGatewayFoundationNamespace
 *   SecurityGatewayFoundationStatus
 *   SecurityGatewayFoundationReadiness
 *   SecurityGatewayFoundationPlatform
 *   getSecurityGatewayFoundationSummary()
 */

import { SecurityGatewayBoundaries } from "./securityGatewayBoundaries.ts";
import { SecurityGatewayCapabilityCatalog } from "./securityGatewayCapabilities.ts";
import { SecurityGatewayContractCatalog } from "./securityGatewayContracts.ts";
import type {
  SecurityGatewayFoundationIdentity,
  SecurityGatewayFoundationSummary,
} from "./securityGatewayFoundationTypes.ts";
import { SecurityGatewayLifecycle } from "./securityGatewayLifecycle.ts";
import { SecurityGatewayOwnership } from "./securityGatewayOwnership.ts";
import {
  SessionConversationPublicIndexId,
  SessionConversationPublicIndexNamespace,
  SessionConversationPublicIndexVersion,
} from "./sessionConversationPublicIndex.ts";

/** Canonical foundation identity. */
export const SecurityGatewayFoundationId =
  "NEA-4:1/SecurityGatewayFoundation" as const;

/** Human-readable foundation name. */
export const SecurityGatewayFoundationName =
  "Security Gateway Foundation" as const;

/** Semantic version. */
export const SecurityGatewayFoundationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const SecurityGatewayFoundationNamespace =
  "nexora.nea.security-gateway.foundation" as const;

/** Foundation status. */
export const SecurityGatewayFoundationStatus = "Foundation" as const;

/** Immediate next-phase readiness. */
export const SecurityGatewayFoundationReadiness = "ReadyForRegistry" as const;

const identity: SecurityGatewayFoundationIdentity = Object.freeze({
  foundationId: SecurityGatewayFoundationId,
  foundationName: SecurityGatewayFoundationName,
  foundationVersion: SecurityGatewayFoundationVersion,
  foundationNamespace: SecurityGatewayFoundationNamespace,
  layer: "NEA" as const,
  phase: "NEA-4:1" as const,
  stage: "Foundation" as const,
  sourcePhase: "NEA-4:1" as const,
  owner: "NEA-4 Security Gateway",
  status: SecurityGatewayFoundationStatus,
  readiness: SecurityGatewayFoundationReadiness,
  description:
    "Immutable architectural foundation defining security contracts, vocabularies, capabilities, lifecycle, ownership, and boundaries for the Security Gateway without implementing authentication, authorization, encryption, or runtime security.",
  publicIndexId: SessionConversationPublicIndexId,
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-4:1/Dependency/NEA3PublicIndex",
  directPreviousPhaseModule: "sessionConversationPublicIndex.ts" as const,
  publicIndexOnly: true as const,
  publicIndexId: SessionConversationPublicIndexId,
  publicIndexVersion: SessionConversationPublicIndexVersion,
  publicIndexNamespace: SessionConversationPublicIndexNamespace,
  freezeDirectImport: false as const,
  certificationDirectImport: false as const,
  platformDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  circularDependency: false as const,
  canonicalPath:
    "NEA-4:1 → NEA-3 SessionConversationPublicIndex (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "contracts",
  "capabilities",
  "lifecycle",
  "ownership",
  "boundaries",
  "metadata",
  "summary",
  "readiness",
] as const);

const foundationApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `NEA-4:1/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-4:1" as const,
    section: "Foundation" as const,
    kind,
    version: SecurityGatewayFoundationVersion,
    status: SecurityGatewayFoundationStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "securityGatewayFoundation.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const SecurityGatewayFoundationApiRegistry = Object.freeze([
  foundationApi("SecurityGatewayFoundationId", "IdentityConstant"),
  foundationApi("SecurityGatewayFoundationVersion", "IdentityConstant"),
  foundationApi("SecurityGatewayFoundationName", "IdentityConstant"),
  foundationApi("SecurityGatewayFoundationNamespace", "IdentityConstant"),
  foundationApi("SecurityGatewayFoundationStatus", "MetadataConstant"),
  foundationApi("SecurityGatewayFoundationReadiness", "MetadataConstant"),
  foundationApi("SecurityGatewayFoundationPlatform", "Aggregate"),
  foundationApi("getSecurityGatewayFoundationSummary", "Helper"),
]);

const metadata = Object.freeze({
  metadataId: "NEA-4:1/SecurityGatewayFoundationMetadata",
  sourcePhase: "NEA-4:1" as const,
  foundationStatus: SecurityGatewayFoundationStatus,
  foundationVersion: SecurityGatewayFoundationVersion,
  publicIndexId: SessionConversationPublicIndexId,
  architectureVersion: "NEA-4.0.0" as const,
  contractCount: SecurityGatewayContractCatalog.contractCount,
  capabilityCount: SecurityGatewayCapabilityCatalog.capabilityCount,
  lifecycleStateCount: SecurityGatewayLifecycle.stateCount,
  nextPhase: "NEA-4:2 — Security Gateway Registry",
  countsHardcoded: false as const,
  executesAuthentication: false as const,
  executesAuthorization: false as const,
  implementsEncryption: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Build deterministic frozen Foundation summary.
 * Counts are derived exclusively from canonical foundation collections.
 */
function buildSecurityGatewayFoundationSummary(): SecurityGatewayFoundationSummary {
  return Object.freeze({
    foundationId: SecurityGatewayFoundationId,
    version: SecurityGatewayFoundationVersion,
    name: SecurityGatewayFoundationName,
    namespace: SecurityGatewayFoundationNamespace,
    layer: "NEA" as const,
    phase: "NEA-4:1" as const,
    status: SecurityGatewayFoundationStatus,
    readiness: SecurityGatewayFoundationReadiness,
    publicIndexId: SessionConversationPublicIndexId,
    contractCount: SecurityGatewayContractCatalog.contractCount,
    capabilityCount: SecurityGatewayCapabilityCatalog.capabilityCount,
    lifecycleStateCount: SecurityGatewayLifecycle.stateCount,
    ownershipCount: SecurityGatewayOwnership.ownsCount,
    nonOwnershipCount: SecurityGatewayOwnership.doesNotOwnCount,
    prohibitedSurfaceCount: SecurityGatewayBoundaries.prohibitedSurfaceCount,
    publicExportCount: 8 as const,
    sectionCount: PLATFORM_SECTIONS.length,
    nextPhase: metadata.nextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/**
 * Canonical immutable Security Gateway Foundation platform.
 * Metadata only. No authentication, authorization, or encryption runtime.
 */
export const SecurityGatewayFoundationPlatform = Object.freeze({
  identity,
  dependency,
  contracts: SecurityGatewayContractCatalog,
  capabilities: SecurityGatewayCapabilityCatalog,
  lifecycle: SecurityGatewayLifecycle,
  ownership: SecurityGatewayOwnership,
  boundaries: SecurityGatewayBoundaries,
  metadata,
  summary: buildSecurityGatewayFoundationSummary(),
  readiness: Object.freeze({
    readinessId: "NEA-4:1/FoundationReadiness",
    readiness: SecurityGatewayFoundationReadiness,
    nextPhase: metadata.nextPhase,
    claimsReadyForRegistry: true as const,
    claimsReadyForRuntime: false as const,
    claimsAuthenticationImplemented: false as const,
    claimsAuthorizationImplemented: false as const,
    claimsEncryptionImplemented: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: SecurityGatewayFoundationApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: SecurityGatewayFoundationStatus,
  nextPhase: metadata.nextPhase,
  downstreamReadiness: SecurityGatewayFoundationReadiness,
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
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Security Gateway Foundation summary.
 * Counts are derived exclusively from canonical foundation collections.
 */
export function getSecurityGatewayFoundationSummary(): SecurityGatewayFoundationSummary {
  return buildSecurityGatewayFoundationSummary();
}
