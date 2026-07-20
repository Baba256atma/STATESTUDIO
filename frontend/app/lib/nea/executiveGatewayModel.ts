/**
 * NEA-1:3 — Executive Gateway Model.
 *
 * Canonical immutable domain model layer for the Executive Gateway.
 * Consumes only NEA-1:2 Executive Gateway Registry public surface.
 * Metadata-only. Runtime-free. Ready for Validation.
 *
 * Ownership: owned exclusively by NEA-1:3.
 *
 * Public exports (exactly 8):
 *   ExecutiveGatewayModelId
 *   ExecutiveGatewayModelVersion
 *   ExecutiveGatewayModelName
 *   ExecutiveGatewayModelNamespace
 *   ExecutiveGatewayModelStatus
 *   ExecutiveGatewayModelReadiness
 *   ExecutiveGatewayModelPlatform
 *   getExecutiveGatewayModelSummary()
 */

import {
  ExecutiveGatewayRegistryId,
  ExecutiveGatewayRegistryPlatform,
  ExecutiveGatewayRegistryVersion,
} from "./executiveGatewayRegistry.ts";
import { ExecutiveGatewayModelLifecycle } from "./executiveGatewayModelLifecycle.ts";
import { ExecutiveGatewayModelMetadata } from "./executiveGatewayModelMetadata.ts";
import {
  ExecutiveGatewayModelBoundaries,
  ExecutiveGatewayModelOwnership,
} from "./executiveGatewayModelOwnership.ts";
import { ExecutiveGatewayDomainModelCatalog } from "./executiveGatewayModels.ts";
import { ExecutiveGatewayModelRelationshipCatalog } from "./executiveGatewayRelationships.ts";
import type {
  ExecutiveGatewayModelIdentity,
  ExecutiveGatewayModelSummary,
} from "./executiveGatewayModelTypes.ts";

/** Canonical model identity. */
export const ExecutiveGatewayModelId =
  "NEA-1:3/ExecutiveGatewayModel" as const;

/** Human-readable model name. */
export const ExecutiveGatewayModelName = "Executive Gateway Model" as const;

/** Semantic version. */
export const ExecutiveGatewayModelVersion = "1.0.0" as const;

/** Canonical namespace. */
export const ExecutiveGatewayModelNamespace =
  "nexora.nea.executive-gateway.model" as const;

/** Model status. */
export const ExecutiveGatewayModelStatus = "Model" as const;

/** Immediate next-phase readiness. */
export const ExecutiveGatewayModelReadiness = "ReadyForValidation" as const;

const identity: ExecutiveGatewayModelIdentity = Object.freeze({
  modelId: ExecutiveGatewayModelId,
  modelName: ExecutiveGatewayModelName,
  modelVersion: ExecutiveGatewayModelVersion,
  modelNamespace: ExecutiveGatewayModelNamespace,
  layer: "NEA" as const,
  phase: "NEA-1:3" as const,
  stage: "Model" as const,
  sourcePhase: "NEA-1:3" as const,
  owner: "NEA-1 Executive Gateway",
  status: ExecutiveGatewayModelStatus,
  readiness: ExecutiveGatewayModelReadiness,
  registryId: ExecutiveGatewayRegistryId,
  registryVersion: ExecutiveGatewayRegistryVersion,
  description:
    "Immutable domain models transforming Registry declarations into strongly typed Executive Gateway data structures.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-1:3/Dependency/NEA12Registry",
  directPreviousPhaseModule: "executiveGatewayRegistry.ts" as const,
  registryOnly: true as const,
  registryId: ExecutiveGatewayRegistryId,
  registryVersion: ExecutiveGatewayRegistryVersion,
  registryPublicSurfaceOnly: true as const,
  foundationDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  reconstructsRegistry: false as const,
  duplicatesRegistryValues: false as const,
  canonicalPath:
    "NEA-1:3 → NEA-1:2 ExecutiveGatewayRegistryPlatform (exclusive)",
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
    id: `NEA-1:3/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-1:3" as const,
    section: "Model" as const,
    kind,
    version: ExecutiveGatewayModelVersion,
    status: ExecutiveGatewayModelStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "executiveGatewayModel.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const ExecutiveGatewayModelApiRegistry = Object.freeze([
  modelApi("ExecutiveGatewayModelId", "IdentityConstant"),
  modelApi("ExecutiveGatewayModelVersion", "IdentityConstant"),
  modelApi("ExecutiveGatewayModelName", "IdentityConstant"),
  modelApi("ExecutiveGatewayModelNamespace", "IdentityConstant"),
  modelApi("ExecutiveGatewayModelStatus", "MetadataConstant"),
  modelApi("ExecutiveGatewayModelReadiness", "MetadataConstant"),
  modelApi("ExecutiveGatewayModelPlatform", "Aggregate"),
  modelApi("getExecutiveGatewayModelSummary", "Helper"),
]);

/**
 * Canonical immutable Executive Gateway Model platform.
 * Nine ordered sections. Metadata only.
 */
export const ExecutiveGatewayModelPlatform = Object.freeze({
  identity,
  dependency,
  domainModels: ExecutiveGatewayDomainModelCatalog,
  relationships: ExecutiveGatewayModelRelationshipCatalog,
  lifecycle: ExecutiveGatewayModelLifecycle,
  metadata: ExecutiveGatewayModelMetadata,
  ownership: ExecutiveGatewayModelOwnership,
  boundaries: ExecutiveGatewayModelBoundaries,
  readiness: ExecutiveGatewayModelReadiness,
  apiRegistry: ExecutiveGatewayModelApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: ExecutiveGatewayModelStatus,
  nextPhase: "NEA-1:4 — Executive Gateway Validation",
  downstreamReadiness: ExecutiveGatewayModelReadiness,
  registryPlatform: ExecutiveGatewayRegistryPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  validationEngine: false as const,
  routingEngine: false as const,
  authenticationEngine: false as const,
  authorizationEngine: false as const,
  connectorImplementation: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  businessLogic: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Executive Gateway Model summary.
 * Counts are derived exclusively from canonical model collections.
 */
export function getExecutiveGatewayModelSummary(): ExecutiveGatewayModelSummary {
  const meta = ExecutiveGatewayModelMetadata;
  return Object.freeze({
    modelId: ExecutiveGatewayModelId,
    version: ExecutiveGatewayModelVersion,
    name: ExecutiveGatewayModelName,
    namespace: ExecutiveGatewayModelNamespace,
    layer: "NEA" as const,
    phase: "NEA-1:3" as const,
    status: ExecutiveGatewayModelStatus,
    readiness: ExecutiveGatewayModelReadiness,
    registryId: ExecutiveGatewayRegistryId,
    domainModelCount: meta.domainModelCount,
    relationshipCount: meta.relationshipCount,
    lifecycleStateCount: meta.lifecycleStateCount,
    ownershipCount: meta.ownershipCount,
    nonOwnershipCount: meta.nonOwnershipCount,
    prohibitedSurfaceCount: meta.prohibitedSurfaceCount,
    sectionCount: PLATFORM_SECTIONS.length,
    nextPhase: "NEA-1:4 — Executive Gateway Validation",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
