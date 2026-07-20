/**
 * NEA-5:2 — Gateway Routing Registry.
 *
 * Canonical immutable registry for Gateway Routing vocabularies and lookups.
 * Consumes only NEA-5:1 Gateway Routing Foundation public surface.
 * Metadata-only. Runtime-free. Ready for Model.
 *
 * Ownership: owned exclusively by NEA-5:2.
 *
 * Public exports (exactly 8):
 *   GatewayRoutingRegistryId
 *   GatewayRoutingRegistryVersion
 *   GatewayRoutingRegistryName
 *   GatewayRoutingRegistryNamespace
 *   GatewayRoutingRegistryStatus
 *   GatewayRoutingRegistryReadiness
 *   GatewayRoutingRegistryPlatform
 *   getGatewayRoutingRegistrySummary()
 */

import {
  GatewayRoutingFoundationId,
  GatewayRoutingFoundationPlatform,
  GatewayRoutingFoundationVersion,
} from "./gatewayRoutingFoundation.ts";
import { GatewayRoutingCapabilityRegistryCatalog } from "./gatewayRoutingRegistryCapabilities.ts";
import { GatewayRoutingRegistryCollections } from "./gatewayRoutingRegistryCollections.ts";
import { GatewayRoutingRegistryMetadata } from "./gatewayRoutingRegistryMetadata.ts";
import {
  GatewayRoutingRegistryBoundaries,
  GatewayRoutingRegistryOwnership,
} from "./gatewayRoutingRegistryOwnership.ts";
import { GatewayRoutingRegistryPolicyCatalog } from "./gatewayRoutingRegistryPolicies.ts";
import type {
  GatewayRoutingRegistryIdentity,
  GatewayRoutingRegistrySummary,
} from "./gatewayRoutingRegistryTypes.ts";

/** Canonical registry identity. */
export const GatewayRoutingRegistryId =
  "NEA-5:2/GatewayRoutingRegistry" as const;

/** Human-readable registry name. */
export const GatewayRoutingRegistryName =
  "Gateway Routing Registry" as const;

/** Semantic version. */
export const GatewayRoutingRegistryVersion = "1.0.0" as const;

/** Canonical namespace. */
export const GatewayRoutingRegistryNamespace =
  "nexora.nea.gateway-routing.registry" as const;

/** Registry status. */
export const GatewayRoutingRegistryStatus = "Registry" as const;

/** Immediate next-phase readiness. */
export const GatewayRoutingRegistryReadiness = "ReadyForModel" as const;

const identity: GatewayRoutingRegistryIdentity = Object.freeze({
  registryId: GatewayRoutingRegistryId,
  registryName: GatewayRoutingRegistryName,
  registryVersion: GatewayRoutingRegistryVersion,
  registryNamespace: GatewayRoutingRegistryNamespace,
  layer: "NEA" as const,
  phase: "NEA-5:2" as const,
  stage: "Registry" as const,
  sourcePhase: "NEA-5:2" as const,
  owner: "NEA-5 Gateway Routing",
  status: GatewayRoutingRegistryStatus,
  readiness: GatewayRoutingRegistryReadiness,
  foundationId: GatewayRoutingFoundationId,
  foundationVersion: GatewayRoutingFoundationVersion,
  description:
    "Canonical immutable registry of routing identities, destinations, decisions, strategies, priorities, statuses, results, contexts, policies, capabilities, and lifecycle.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-5:2/Dependency/NEA51Foundation",
  directPreviousPhaseModule: "gatewayRoutingFoundation.ts" as const,
  foundationOnly: true as const,
  foundationId: GatewayRoutingFoundationId,
  foundationVersion: GatewayRoutingFoundationVersion,
  foundationPublicSurfaceOnly: true as const,
  publicIndexDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  reconstructsFoundation: false as const,
  duplicatesFoundationValues: false as const,
  canonicalPath:
    "NEA-5:2 → NEA-5:1 GatewayRoutingFoundationPlatform (exclusive)",
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
    id: `NEA-5:2/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-5:2" as const,
    section: "Registry" as const,
    kind,
    version: GatewayRoutingRegistryVersion,
    status: GatewayRoutingRegistryStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "gatewayRoutingRegistry.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const GatewayRoutingRegistryApiRegistry = Object.freeze([
  registryApi("GatewayRoutingRegistryId", "IdentityConstant"),
  registryApi("GatewayRoutingRegistryVersion", "IdentityConstant"),
  registryApi("GatewayRoutingRegistryName", "IdentityConstant"),
  registryApi("GatewayRoutingRegistryNamespace", "IdentityConstant"),
  registryApi("GatewayRoutingRegistryStatus", "MetadataConstant"),
  registryApi("GatewayRoutingRegistryReadiness", "MetadataConstant"),
  registryApi("GatewayRoutingRegistryPlatform", "Aggregate"),
  registryApi("getGatewayRoutingRegistrySummary", "Helper"),
]);

/**
 * Canonical immutable Gateway Routing Registry platform.
 * Nine ordered sections. Metadata only.
 */
export const GatewayRoutingRegistryPlatform = Object.freeze({
  identity,
  dependency,
  collections: GatewayRoutingRegistryCollections,
  capabilities: GatewayRoutingCapabilityRegistryCatalog,
  policies: GatewayRoutingRegistryPolicyCatalog,
  metadata: GatewayRoutingRegistryMetadata,
  ownership: GatewayRoutingRegistryOwnership,
  boundaries: GatewayRoutingRegistryBoundaries,
  readiness: Object.freeze({
    readinessId: "NEA-5:2/RegistryReadiness",
    readiness: GatewayRoutingRegistryReadiness,
    nextPhase: GatewayRoutingRegistryMetadata.nextPhase,
    claimsReadyForModel: true as const,
    claimsReadyForRuntime: false as const,
    claimsRuntimeRoutingImplemented: false as const,
    claimsRoutingAlgorithmsImplemented: false as const,
    claimsConsumerSelectionImplemented: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: GatewayRoutingRegistryApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: GatewayRoutingRegistryStatus,
  nextPhase: GatewayRoutingRegistryMetadata.nextPhase,
  downstreamReadiness: GatewayRoutingRegistryReadiness,
  foundationPlatform: GatewayRoutingFoundationPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  implementsRuntimeRouting: false as const,
  implementsRoutingAlgorithms: false as const,
  implementsConsumerSelection: false as const,
  processesMessages: false as const,
  executesConnectors: false as const,
  implementsHttp: false as const,
  implementsRest: false as const,
  implementsWebSockets: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Gateway Routing Registry summary.
 * Counts are derived exclusively from canonical registry collections.
 */
export function getGatewayRoutingRegistrySummary(): GatewayRoutingRegistrySummary {
  const meta = GatewayRoutingRegistryMetadata;
  return Object.freeze({
    registryId: GatewayRoutingRegistryId,
    version: GatewayRoutingRegistryVersion,
    name: GatewayRoutingRegistryName,
    namespace: GatewayRoutingRegistryNamespace,
    layer: "NEA" as const,
    phase: "NEA-5:2" as const,
    status: GatewayRoutingRegistryStatus,
    readiness: GatewayRoutingRegistryReadiness,
    foundationId: GatewayRoutingFoundationId,
    routeIdentityCount: meta.routeIdentityCount,
    destinationCount: meta.destinationCount,
    decisionCount: meta.decisionCount,
    strategyCount: meta.strategyCount,
    priorityCount: meta.priorityCount,
    statusCount: meta.statusCount,
    resultCount: meta.resultCount,
    contextCount: meta.contextCount,
    routingPolicyCount: meta.routingPolicyCount,
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
