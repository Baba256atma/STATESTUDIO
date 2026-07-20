/**
 * NEA-1:2 — Executive Gateway Registry.
 *
 * Canonical immutable registry for Executive Gateway vocabularies and lookups.
 * Consumes only NEA-1:1 Executive Gateway Foundation public surface.
 * Metadata-only. Runtime-free. Ready for Model.
 *
 * Ownership: owned exclusively by NEA-1:2.
 *
 * Public exports (exactly 8):
 *   ExecutiveGatewayRegistryId
 *   ExecutiveGatewayRegistryVersion
 *   ExecutiveGatewayRegistryName
 *   ExecutiveGatewayRegistryNamespace
 *   ExecutiveGatewayRegistryStatus
 *   ExecutiveGatewayRegistryReadiness
 *   ExecutiveGatewayRegistryPlatform
 *   getExecutiveGatewayRegistrySummary()
 */

import {
  ExecutiveGatewayFoundationId,
  ExecutiveGatewayFoundationPlatform,
  ExecutiveGatewayFoundationVersion,
} from "./executiveGatewayFoundation.ts";
import { ExecutiveGatewayCapabilityRegistryCatalog } from "./executiveGatewayRegistryCapabilities.ts";
import { ExecutiveGatewayRegistryCollections } from "./executiveGatewayRegistryCollections.ts";
import { ExecutiveGatewayRegistryMetadata } from "./executiveGatewayRegistryMetadata.ts";
import {
  ExecutiveGatewayRegistryBoundaries,
  ExecutiveGatewayRegistryOwnership,
} from "./executiveGatewayRegistryOwnership.ts";
import { ExecutiveGatewayPolicyRegistryCatalog } from "./executiveGatewayRegistryPolicies.ts";
import type {
  ExecutiveGatewayRegistryIdentity,
  ExecutiveGatewayRegistrySummary,
} from "./executiveGatewayRegistryTypes.ts";

/** Canonical registry identity. */
export const ExecutiveGatewayRegistryId =
  "NEA-1:2/ExecutiveGatewayRegistry" as const;

/** Human-readable registry name. */
export const ExecutiveGatewayRegistryName =
  "Executive Gateway Registry" as const;

/** Semantic version. */
export const ExecutiveGatewayRegistryVersion = "1.0.0" as const;

/** Canonical namespace. */
export const ExecutiveGatewayRegistryNamespace =
  "nexora.nea.executive-gateway.registry" as const;

/** Registry status. */
export const ExecutiveGatewayRegistryStatus = "Registry" as const;

/** Immediate next-phase readiness. */
export const ExecutiveGatewayRegistryReadiness = "ReadyForModel" as const;

const identity: ExecutiveGatewayRegistryIdentity = Object.freeze({
  registryId: ExecutiveGatewayRegistryId,
  registryName: ExecutiveGatewayRegistryName,
  registryVersion: ExecutiveGatewayRegistryVersion,
  registryNamespace: ExecutiveGatewayRegistryNamespace,
  layer: "NEA" as const,
  phase: "NEA-1:2" as const,
  stage: "Registry" as const,
  sourcePhase: "NEA-1:2" as const,
  owner: "NEA-1 Executive Gateway",
  status: ExecutiveGatewayRegistryStatus,
  readiness: ExecutiveGatewayRegistryReadiness,
  foundationId: ExecutiveGatewayFoundationId,
  foundationVersion: ExecutiveGatewayFoundationVersion,
  description:
    "Canonical immutable registry of Executive Gateway vocabularies, enumerations, declarations, and lookup collections.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-1:2/Dependency/NEA11Foundation",
  directPreviousPhaseModule: "executiveGatewayFoundation.ts" as const,
  foundationOnly: true as const,
  foundationId: ExecutiveGatewayFoundationId,
  foundationVersion: ExecutiveGatewayFoundationVersion,
  foundationPublicSurfaceOnly: true as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  reconstructsFoundation: false as const,
  duplicatesFoundationInventory: false as const,
  canonicalPath:
    "NEA-1:2 → NEA-1:1 ExecutiveGatewayFoundationPlatform (exclusive)",
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
    id: `NEA-1:2/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-1:2" as const,
    section: "Registry" as const,
    kind,
    version: ExecutiveGatewayRegistryVersion,
    status: ExecutiveGatewayRegistryStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "executiveGatewayRegistry.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const ExecutiveGatewayRegistryApiRegistry = Object.freeze([
  registryApi("ExecutiveGatewayRegistryId", "IdentityConstant"),
  registryApi("ExecutiveGatewayRegistryVersion", "IdentityConstant"),
  registryApi("ExecutiveGatewayRegistryName", "IdentityConstant"),
  registryApi("ExecutiveGatewayRegistryNamespace", "IdentityConstant"),
  registryApi("ExecutiveGatewayRegistryStatus", "MetadataConstant"),
  registryApi("ExecutiveGatewayRegistryReadiness", "MetadataConstant"),
  registryApi("ExecutiveGatewayRegistryPlatform", "Aggregate"),
  registryApi("getExecutiveGatewayRegistrySummary", "Helper"),
]);

/**
 * Canonical immutable Executive Gateway Registry platform.
 * Nine ordered sections. Metadata only.
 */
export const ExecutiveGatewayRegistryPlatform = Object.freeze({
  identity,
  dependency,
  collections: ExecutiveGatewayRegistryCollections,
  capabilities: ExecutiveGatewayCapabilityRegistryCatalog,
  policies: ExecutiveGatewayPolicyRegistryCatalog,
  metadata: ExecutiveGatewayRegistryMetadata,
  ownership: ExecutiveGatewayRegistryOwnership,
  boundaries: ExecutiveGatewayRegistryBoundaries,
  readiness: ExecutiveGatewayRegistryReadiness,
  apiRegistry: ExecutiveGatewayRegistryApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: ExecutiveGatewayRegistryStatus,
  nextPhase: "NEA-1:3 — Executive Gateway Model",
  downstreamReadiness: ExecutiveGatewayRegistryReadiness,
  foundationPlatform: ExecutiveGatewayFoundationPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  runtimeRouting: false as const,
  runtimeValidation: false as const,
  runtimeNormalization: false as const,
  connectorImplementation: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  authenticationEngine: false as const,
  authorizationEngine: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Executive Gateway Registry summary.
 * Counts are derived exclusively from canonical registry collections.
 */
export function getExecutiveGatewayRegistrySummary(): ExecutiveGatewayRegistrySummary {
  const meta = ExecutiveGatewayRegistryMetadata;
  return Object.freeze({
    registryId: ExecutiveGatewayRegistryId,
    version: ExecutiveGatewayRegistryVersion,
    name: ExecutiveGatewayRegistryName,
    namespace: ExecutiveGatewayRegistryNamespace,
    layer: "NEA" as const,
    phase: "NEA-1:2" as const,
    status: ExecutiveGatewayRegistryStatus,
    readiness: ExecutiveGatewayRegistryReadiness,
    foundationId: ExecutiveGatewayFoundationId,
    sourceFamilyCount: meta.sourceFamilyCount,
    channelTypeCount: meta.channelTypeCount,
    modalityCount: meta.modalityCount,
    senderKindCount: meta.senderKindCount,
    authenticationMethodCount: meta.authenticationMethodCount,
    authorizationStatusCount: meta.authorizationStatusCount,
    trustLevelCount: meta.trustLevelCount,
    consentStatusCount: meta.consentStatusCount,
    validationStatusCount: meta.validationStatusCount,
    routingDestinationCount: meta.routingDestinationCount,
    lifecycleStateCount: meta.lifecycleStateCount,
    capabilityCount: meta.capabilityCount,
    policyCount: meta.policyCount,
    diagnosticCategoryCount: meta.diagnosticCategoryCount,
    totalRegistryEntryCount: meta.totalEntryCount,
    sectionCount: PLATFORM_SECTIONS.length,
    nextPhase: "NEA-1:3 — Executive Gateway Model",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
