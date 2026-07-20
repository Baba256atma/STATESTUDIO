/**
 * NEA-1:1 — Executive Gateway Foundation.
 *
 * Immutable architectural foundation for the Nexora Executive Gateway.
 * Local primitive contracts only. Metadata-only. Runtime-free. Ready for Registry.
 *
 * Ownership: owned exclusively by NEA-1:1.
 *
 * Public exports (exactly 8):
 *   ExecutiveGatewayFoundationId
 *   ExecutiveGatewayFoundationVersion
 *   ExecutiveGatewayFoundationName
 *   ExecutiveGatewayFoundationNamespace
 *   ExecutiveGatewayFoundationStatus
 *   ExecutiveGatewayFoundationReadiness
 *   ExecutiveGatewayFoundationPlatform
 *   getExecutiveGatewayFoundationSummary()
 */

import {
  ExecutiveGatewayCapabilityCatalog,
  ExecutiveGatewayCapabilities,
} from "./executiveGatewayCapabilities.ts";
import {
  ExecutiveGatewayContracts,
  ExecutiveGatewayPolicies,
  ExecutiveGatewayRoutingDestinations,
} from "./executiveGatewayContracts.ts";
import type {
  ExecutiveGatewayFoundationSummary,
  ExecutiveGatewayIdentity,
} from "./executiveGatewayFoundationTypes.ts";
import { ExecutiveGatewayLifecycle } from "./executiveGatewayLifecycle.ts";
import {
  ExecutiveGatewayBoundaries,
  ExecutiveGatewayOwnership,
} from "./executiveGatewayOwnership.ts";
import {
  ExecutiveGatewayChannelTypes,
  ExecutiveGatewayModalities,
  ExecutiveGatewaySenderKinds,
  ExecutiveGatewaySourceFamilies,
} from "./executiveGatewaySources.ts";

/** Canonical foundation identity. */
export const ExecutiveGatewayFoundationId =
  "NEA-1:1/ExecutiveGatewayFoundation" as const;

/** Human-readable foundation name. */
export const ExecutiveGatewayFoundationName =
  "Executive Gateway Foundation" as const;

/** Semantic version. */
export const ExecutiveGatewayFoundationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const ExecutiveGatewayFoundationNamespace =
  "nexora.nea.executive-gateway.foundation" as const;

/** Foundation status. */
export const ExecutiveGatewayFoundationStatus = "Foundation" as const;

/** Immediate next-phase readiness. */
export const ExecutiveGatewayFoundationReadiness =
  "ReadyForRegistry" as const;

const identity: ExecutiveGatewayIdentity = Object.freeze({
  foundationId: ExecutiveGatewayFoundationId,
  foundationName: ExecutiveGatewayFoundationName,
  foundationVersion: ExecutiveGatewayFoundationVersion,
  foundationNamespace: ExecutiveGatewayFoundationNamespace,
  layer: "NEA" as const,
  phase: "NEA-1:1" as const,
  stage: "Foundation" as const,
  sourcePhase: "NEA-1:1" as const,
  owner: "NEA-1 Executive Gateway",
  status: ExecutiveGatewayFoundationStatus,
  readiness: ExecutiveGatewayFoundationReadiness,
  description:
    "Immutable architectural foundation for receiving, identifying, validating, normalizing, securing, tracing, and routing external interactions into Nexora without implementing connectors or runtime orchestration.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-1:1/Dependency/None",
  upstreamDependencies: Object.freeze([] as const),
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  advisorInternalImport: false as const,
  directorInternalImport: false as const,
  eveInternalImport: false as const,
  opsInternalImport: false as const,
  busInternalImport: false as const,
  coreTenInternalImport: false as const,
  circularDependency: false as const,
  prefersLocalContracts: true as const,
  canonicalPath: "NEA-1:1 → local foundation contracts only",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "sources",
  "channels",
  "modalities",
  "senderKinds",
  "contracts",
  "routingDestinations",
  "policies",
  "capabilities",
  "lifecycle",
  "ownership",
  "boundaries",
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
    id: `NEA-1:1/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-1:1" as const,
    section: "Foundation" as const,
    kind,
    version: ExecutiveGatewayFoundationVersion,
    status: ExecutiveGatewayFoundationStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "executiveGatewayFoundation.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const ExecutiveGatewayFoundationApiRegistry = Object.freeze([
  foundationApi("ExecutiveGatewayFoundationId", "IdentityConstant"),
  foundationApi("ExecutiveGatewayFoundationVersion", "IdentityConstant"),
  foundationApi("ExecutiveGatewayFoundationName", "IdentityConstant"),
  foundationApi("ExecutiveGatewayFoundationNamespace", "IdentityConstant"),
  foundationApi("ExecutiveGatewayFoundationStatus", "MetadataConstant"),
  foundationApi("ExecutiveGatewayFoundationReadiness", "MetadataConstant"),
  foundationApi("ExecutiveGatewayFoundationPlatform", "Aggregate"),
  foundationApi("getExecutiveGatewayFoundationSummary", "Helper"),
]);

/**
 * Canonical immutable Executive Gateway Foundation platform.
 * Fourteen ordered sections. Metadata only.
 */
export const ExecutiveGatewayFoundationPlatform = Object.freeze({
  identity,
  dependency,
  sources: ExecutiveGatewaySourceFamilies,
  channels: ExecutiveGatewayChannelTypes,
  modalities: ExecutiveGatewayModalities,
  senderKinds: ExecutiveGatewaySenderKinds,
  contracts: ExecutiveGatewayContracts,
  routingDestinations: ExecutiveGatewayRoutingDestinations,
  policies: ExecutiveGatewayPolicies,
  capabilities: ExecutiveGatewayCapabilityCatalog,
  lifecycle: ExecutiveGatewayLifecycle,
  ownership: ExecutiveGatewayOwnership,
  boundaries: ExecutiveGatewayBoundaries,
  readiness: ExecutiveGatewayFoundationReadiness,
  apiRegistry: ExecutiveGatewayFoundationApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: ExecutiveGatewayFoundationStatus,
  nextPhase: "NEA-1:2 — Executive Gateway Registry",
  downstreamReadiness: ExecutiveGatewayFoundationReadiness,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  runtimeIntegration: false as const,
  connectorImplementation: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  dataUnderstanding: false as const,
  runtimeOrchestration: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Executive Gateway Foundation summary.
 * Counts are derived exclusively from canonical foundation collections.
 */
export function getExecutiveGatewayFoundationSummary(): ExecutiveGatewayFoundationSummary {
  return Object.freeze({
    foundationId: ExecutiveGatewayFoundationId,
    version: ExecutiveGatewayFoundationVersion,
    name: ExecutiveGatewayFoundationName,
    namespace: ExecutiveGatewayFoundationNamespace,
    layer: "NEA" as const,
    phase: "NEA-1:1" as const,
    status: ExecutiveGatewayFoundationStatus,
    readiness: ExecutiveGatewayFoundationReadiness,
    sourceFamilyCount: ExecutiveGatewaySourceFamilies.length,
    channelTypeCount: ExecutiveGatewayChannelTypes.length,
    modalityCount: ExecutiveGatewayModalities.length,
    senderKindCount: ExecutiveGatewaySenderKinds.length,
    contractCount: ExecutiveGatewayContracts.length,
    capabilityCount: ExecutiveGatewayCapabilities.length,
    lifecycleStateCount: ExecutiveGatewayLifecycle.stateCount,
    routingDestinationCount: ExecutiveGatewayRoutingDestinations.length,
    ownershipCount: ExecutiveGatewayOwnership.ownsCount,
    nonOwnershipCount: ExecutiveGatewayOwnership.doesNotOwnCount,
    prohibitedSurfaceCount:
      ExecutiveGatewayBoundaries.prohibitedSurfaceCount,
    policyCount: ExecutiveGatewayPolicies.length,
    sectionCount: PLATFORM_SECTIONS.length,
    nextPhase: "NEA-1:2 — Executive Gateway Registry",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
