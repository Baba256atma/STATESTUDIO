/**
 * NEA-2:3 — Channel Connectors Model.
 *
 * Canonical immutable domain model layer for Channel Connectors.
 * Consumes only NEA-2:2 Channel Connectors Registry public surface.
 * Metadata-only. Runtime-free. Ready for Validation.
 *
 * Ownership: owned exclusively by NEA-2:3.
 *
 * Public exports (exactly 8):
 *   ChannelConnectorModelId
 *   ChannelConnectorModelVersion
 *   ChannelConnectorModelName
 *   ChannelConnectorModelNamespace
 *   ChannelConnectorModelStatus
 *   ChannelConnectorModelReadiness
 *   ChannelConnectorModelPlatform
 *   getChannelConnectorModelSummary()
 */

import {
  ChannelConnectorRegistryId,
  ChannelConnectorRegistryPlatform,
  ChannelConnectorRegistryVersion,
} from "./channelConnectorRegistry.ts";
import { ChannelConnectorModelLifecycle } from "./channelConnectorModelLifecycle.ts";
import { ChannelConnectorModelMetadata } from "./channelConnectorModelMetadata.ts";
import {
  ChannelConnectorModelBoundaries,
  ChannelConnectorModelOwnership,
} from "./channelConnectorModelOwnership.ts";
import { ChannelConnectorDomainModelCatalog } from "./channelConnectorModels.ts";
import { ChannelConnectorModelRelationshipCatalog } from "./channelConnectorRelationships.ts";
import type {
  ChannelConnectorModelIdentity,
  ChannelConnectorModelSummary,
} from "./channelConnectorModelTypes.ts";

/** Canonical model identity. */
export const ChannelConnectorModelId =
  "NEA-2:3/ChannelConnectorModel" as const;

/** Human-readable model name. */
export const ChannelConnectorModelName = "Channel Connectors Model" as const;

/** Semantic version. */
export const ChannelConnectorModelVersion = "1.0.0" as const;

/** Canonical namespace. */
export const ChannelConnectorModelNamespace =
  "nexora.nea.channel-connectors.model" as const;

/** Model status. */
export const ChannelConnectorModelStatus = "Model" as const;

/** Immediate next-phase readiness. */
export const ChannelConnectorModelReadiness = "ReadyForValidation" as const;

const identity: ChannelConnectorModelIdentity = Object.freeze({
  modelId: ChannelConnectorModelId,
  modelName: ChannelConnectorModelName,
  modelVersion: ChannelConnectorModelVersion,
  modelNamespace: ChannelConnectorModelNamespace,
  layer: "NEA" as const,
  phase: "NEA-2:3" as const,
  stage: "Model" as const,
  sourcePhase: "NEA-2:3" as const,
  owner: "NEA-2 Channel Connectors",
  status: ChannelConnectorModelStatus,
  readiness: ChannelConnectorModelReadiness,
  registryId: ChannelConnectorRegistryId,
  registryVersion: ChannelConnectorRegistryVersion,
  description:
    "Immutable domain models transforming Registry declarations into strongly typed Channel Connector data structures.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-2:3/Dependency/NEA22Registry",
  directPreviousPhaseModule: "channelConnectorRegistry.ts" as const,
  registryOnly: true as const,
  registryId: ChannelConnectorRegistryId,
  registryVersion: ChannelConnectorRegistryVersion,
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
    "NEA-2:3 → NEA-2:2 ChannelConnectorRegistryPlatform (exclusive)",
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
    id: `NEA-2:3/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-2:3" as const,
    section: "Model" as const,
    kind,
    version: ChannelConnectorModelVersion,
    status: ChannelConnectorModelStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "channelConnectorModel.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const ChannelConnectorModelApiRegistry = Object.freeze([
  modelApi("ChannelConnectorModelId", "IdentityConstant"),
  modelApi("ChannelConnectorModelVersion", "IdentityConstant"),
  modelApi("ChannelConnectorModelName", "IdentityConstant"),
  modelApi("ChannelConnectorModelNamespace", "IdentityConstant"),
  modelApi("ChannelConnectorModelStatus", "MetadataConstant"),
  modelApi("ChannelConnectorModelReadiness", "MetadataConstant"),
  modelApi("ChannelConnectorModelPlatform", "Aggregate"),
  modelApi("getChannelConnectorModelSummary", "Helper"),
]);

/**
 * Canonical immutable Channel Connectors Model platform.
 * Nine ordered sections. Metadata only.
 */
export const ChannelConnectorModelPlatform = Object.freeze({
  identity,
  dependency,
  domainModels: ChannelConnectorDomainModelCatalog,
  relationships: ChannelConnectorModelRelationshipCatalog,
  lifecycle: ChannelConnectorModelLifecycle,
  metadata: ChannelConnectorModelMetadata,
  ownership: ChannelConnectorModelOwnership,
  boundaries: ChannelConnectorModelBoundaries,
  readiness: Object.freeze({
    readinessId: "NEA-2:3/ModelReadiness",
    readiness: ChannelConnectorModelReadiness,
    nextPhase: ChannelConnectorModelMetadata.nextPhase,
    claimsReadyForValidation: true as const,
    claimsReadyForRuntime: false as const,
    claimsConnectorsImplemented: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: ChannelConnectorModelApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: ChannelConnectorModelStatus,
  nextPhase: ChannelConnectorModelMetadata.nextPhase,
  downstreamReadiness: ChannelConnectorModelReadiness,
  registryPlatform: ChannelConnectorRegistryPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  validationEngine: false as const,
  routingEngine: false as const,
  implementsConnectors: false as const,
  networkingBehavior: false as const,
  oauthFlow: false as const,
  messageProcessing: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  businessLogic: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Channel Connectors Model summary.
 * Counts are derived exclusively from canonical model collections.
 */
export function getChannelConnectorModelSummary(): ChannelConnectorModelSummary {
  const meta = ChannelConnectorModelMetadata;
  return Object.freeze({
    modelId: ChannelConnectorModelId,
    version: ChannelConnectorModelVersion,
    name: ChannelConnectorModelName,
    namespace: ChannelConnectorModelNamespace,
    layer: "NEA" as const,
    phase: "NEA-2:3" as const,
    status: ChannelConnectorModelStatus,
    readiness: ChannelConnectorModelReadiness,
    registryId: ChannelConnectorRegistryId,
    domainModelCount: meta.domainModelCount,
    identityModelCount: meta.identityModelCount,
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
