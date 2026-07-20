/**
 * NEA-5:3 — Gateway Routing Model.
 *
 * Canonical immutable domain model layer for Gateway Routing.
 * Consumes only NEA-5:2 Gateway Routing Registry public surface.
 * Metadata-only. Runtime-free. Ready for Validation.
 *
 * Ownership: owned exclusively by NEA-5:3.
 *
 * Public exports (exactly 8):
 *   GatewayRoutingModelId
 *   GatewayRoutingModelVersion
 *   GatewayRoutingModelName
 *   GatewayRoutingModelNamespace
 *   GatewayRoutingModelStatus
 *   GatewayRoutingModelReadiness
 *   GatewayRoutingModelPlatform
 *   getGatewayRoutingModelSummary()
 */

import {
  GatewayRoutingRegistryId,
  GatewayRoutingRegistryPlatform,
  GatewayRoutingRegistryVersion,
} from "./gatewayRoutingRegistry.ts";
import { GatewayRoutingModelLifecycle } from "./gatewayRoutingModelLifecycle.ts";
import { GatewayRoutingModelMetadata } from "./gatewayRoutingModelMetadata.ts";
import {
  GatewayRoutingModelBoundaries,
  GatewayRoutingModelOwnership,
} from "./gatewayRoutingModelOwnership.ts";
import { GatewayRoutingDomainModelCatalog } from "./gatewayRoutingModels.ts";
import { GatewayRoutingModelRelationshipCatalog } from "./gatewayRoutingRelationships.ts";
import type {
  GatewayRoutingModelIdentity,
  GatewayRoutingModelSummary,
} from "./gatewayRoutingModelTypes.ts";

/** Canonical model identity. */
export const GatewayRoutingModelId = "NEA-5:3/GatewayRoutingModel" as const;

/** Human-readable model name. */
export const GatewayRoutingModelName = "Gateway Routing Model" as const;

/** Semantic version. */
export const GatewayRoutingModelVersion = "1.0.0" as const;

/** Canonical namespace. */
export const GatewayRoutingModelNamespace =
  "nexora.nea.gateway-routing.model" as const;

/** Model status. */
export const GatewayRoutingModelStatus = "Model" as const;

/** Immediate next-phase readiness. */
export const GatewayRoutingModelReadiness = "ReadyForValidation" as const;

const identity: GatewayRoutingModelIdentity = Object.freeze({
  modelId: GatewayRoutingModelId,
  modelName: GatewayRoutingModelName,
  modelVersion: GatewayRoutingModelVersion,
  modelNamespace: GatewayRoutingModelNamespace,
  layer: "NEA" as const,
  phase: "NEA-5:3" as const,
  stage: "Model" as const,
  sourcePhase: "NEA-5:3" as const,
  owner: "NEA-5 Gateway Routing",
  status: GatewayRoutingModelStatus,
  readiness: GatewayRoutingModelReadiness,
  registryId: GatewayRoutingRegistryId,
  registryVersion: GatewayRoutingRegistryVersion,
  description:
    "Immutable domain models transforming Registry declarations into strongly typed Gateway Routing data structures.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-5:3/Dependency/NEA52Registry",
  directPreviousPhaseModule: "gatewayRoutingRegistry.ts" as const,
  registryOnly: true as const,
  registryId: GatewayRoutingRegistryId,
  registryVersion: GatewayRoutingRegistryVersion,
  registryPublicSurfaceOnly: true as const,
  foundationDirectImport: false as const,
  publicIndexDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  reconstructsRegistry: false as const,
  duplicatesRegistryValues: false as const,
  canonicalPath:
    "NEA-5:3 → NEA-5:2 GatewayRoutingRegistryPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "domainModels",
  "relationships",
  "lifecycle",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
] as const);

const modelApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `NEA-5:3/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-5:3" as const,
    section: "Model" as const,
    kind,
    version: GatewayRoutingModelVersion,
    status: GatewayRoutingModelStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "gatewayRoutingModel.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const GatewayRoutingModelApiRegistry = Object.freeze([
  modelApi("GatewayRoutingModelId", "IdentityConstant"),
  modelApi("GatewayRoutingModelVersion", "IdentityConstant"),
  modelApi("GatewayRoutingModelName", "IdentityConstant"),
  modelApi("GatewayRoutingModelNamespace", "IdentityConstant"),
  modelApi("GatewayRoutingModelStatus", "MetadataConstant"),
  modelApi("GatewayRoutingModelReadiness", "MetadataConstant"),
  modelApi("GatewayRoutingModelPlatform", "Aggregate"),
  modelApi("getGatewayRoutingModelSummary", "Helper"),
]);

/**
 * Canonical immutable Gateway Routing Model platform.
 * Nine ordered sections. Metadata only.
 */
export const GatewayRoutingModelPlatform = Object.freeze({
  identity,
  dependency,
  domainModels: GatewayRoutingDomainModelCatalog,
  relationships: GatewayRoutingModelRelationshipCatalog,
  lifecycle: GatewayRoutingModelLifecycle,
  metadata: GatewayRoutingModelMetadata,
  ownership: GatewayRoutingModelOwnership,
  boundaries: GatewayRoutingModelBoundaries,
  readiness: Object.freeze({
    readinessId: "NEA-5:3/ModelReadiness",
    readiness: GatewayRoutingModelReadiness,
    nextPhase: GatewayRoutingModelMetadata.nextPhase,
    claimsReadyForValidation: true as const,
    claimsReadyForRuntime: false as const,
    claimsRuntimeRoutingImplemented: false as const,
    claimsRoutingAlgorithmsImplemented: false as const,
    claimsConsumerSelectionImplemented: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: GatewayRoutingModelApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: GatewayRoutingModelStatus,
  nextPhase: GatewayRoutingModelMetadata.nextPhase,
  downstreamReadiness: GatewayRoutingModelReadiness,
  registryPlatform: GatewayRoutingRegistryPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  implementsRuntimeRouting: false as const,
  implementsRoutingAlgorithms: false as const,
  implementsConsumerSelection: false as const,
  executesStrategies: false as const,
  processesMessages: false as const,
  executesConnectors: false as const,
  implementsHttp: false as const,
  implementsRest: false as const,
  implementsWebSockets: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  businessLogic: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Gateway Routing Model summary.
 * Counts are derived exclusively from canonical model collections.
 */
export function getGatewayRoutingModelSummary(): GatewayRoutingModelSummary {
  const meta = GatewayRoutingModelMetadata;
  return Object.freeze({
    modelId: GatewayRoutingModelId,
    version: GatewayRoutingModelVersion,
    name: GatewayRoutingModelName,
    namespace: GatewayRoutingModelNamespace,
    layer: "NEA" as const,
    phase: "NEA-5:3" as const,
    status: GatewayRoutingModelStatus,
    readiness: GatewayRoutingModelReadiness,
    registryId: GatewayRoutingRegistryId,
    domainModelCount: meta.domainModelCount,
    routeIdentityModelCount: meta.routeIdentityModelCount,
    relationshipCount: meta.relationshipCount,
    lifecycleStateCount: meta.lifecycleStateCount,
    ownershipCount: meta.ownershipCount,
    nonOwnershipCount: meta.nonOwnershipCount,
    prohibitedSurfaceCount: meta.prohibitedSurfaceCount,
    publicExportCount: 8 as const,
    sectionCount: PLATFORM_SECTIONS.length,
    nextPhase: meta.nextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
