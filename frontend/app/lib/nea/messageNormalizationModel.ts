/**
 * NEA-6:3 — Message Normalization Model.
 *
 * Canonical immutable domain model layer for Message Normalization.
 * Consumes only NEA-6:2 Message Normalization Registry public surface.
 * Metadata-only. Runtime-free. Ready for Validation.
 *
 * Ownership: owned exclusively by NEA-6:3.
 *
 * Public exports (exactly 8):
 *   MessageNormalizationModelId
 *   MessageNormalizationModelVersion
 *   MessageNormalizationModelName
 *   MessageNormalizationModelNamespace
 *   MessageNormalizationModelStatus
 *   MessageNormalizationModelReadiness
 *   MessageNormalizationModelPlatform
 *   getMessageNormalizationModelSummary()
 */

import {
  MessageNormalizationRegistryId,
  MessageNormalizationRegistryPlatform,
  MessageNormalizationRegistryVersion,
} from "./messageNormalizationRegistry.ts";
import { MessageNormalizationModelLifecycle } from "./messageNormalizationModelLifecycle.ts";
import { MessageNormalizationModelMetadata } from "./messageNormalizationModelMetadata.ts";
import {
  MessageNormalizationModelBoundaries,
  MessageNormalizationModelOwnership,
} from "./messageNormalizationModelOwnership.ts";
import { MessageNormalizationDomainModelCatalog } from "./messageNormalizationModels.ts";
import { MessageNormalizationModelRelationshipCatalog } from "./messageNormalizationRelationships.ts";
import type {
  MessageNormalizationModelIdentity,
  MessageNormalizationModelSummary,
} from "./messageNormalizationModelTypes.ts";

/** Canonical model identity. */
export const MessageNormalizationModelId =
  "NEA-6:3/MessageNormalizationModel" as const;

/** Human-readable model name. */
export const MessageNormalizationModelName =
  "Message Normalization Model" as const;

/** Semantic version. */
export const MessageNormalizationModelVersion = "1.0.0" as const;

/** Canonical namespace. */
export const MessageNormalizationModelNamespace =
  "nexora.nea.message-normalization.model" as const;

/** Model status. */
export const MessageNormalizationModelStatus = "Model" as const;

/** Immediate next-phase readiness. */
export const MessageNormalizationModelReadiness =
  "ReadyForValidation" as const;

const identity: MessageNormalizationModelIdentity = Object.freeze({
  modelId: MessageNormalizationModelId,
  modelName: MessageNormalizationModelName,
  modelVersion: MessageNormalizationModelVersion,
  modelNamespace: MessageNormalizationModelNamespace,
  layer: "NEA" as const,
  phase: "NEA-6:3" as const,
  stage: "Model" as const,
  sourcePhase: "NEA-6:3" as const,
  owner: "NEA-6 Message Normalization",
  status: MessageNormalizationModelStatus,
  readiness: MessageNormalizationModelReadiness,
  registryId: MessageNormalizationRegistryId,
  registryVersion: MessageNormalizationRegistryVersion,
  description:
    "Immutable domain models transforming Registry declarations into strongly typed Message Normalization data structures without runtime normalization, parsing, or business interpretation.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-6:3/Dependency/NEA62Registry",
  directPreviousPhaseModule: "messageNormalizationRegistry.ts" as const,
  registryOnly: true as const,
  registryId: MessageNormalizationRegistryId,
  registryVersion: MessageNormalizationRegistryVersion,
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
    "NEA-6:3 → NEA-6:2 MessageNormalizationRegistryPlatform (exclusive)",
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
    id: `NEA-6:3/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-6:3" as const,
    section: "Model" as const,
    kind,
    version: MessageNormalizationModelVersion,
    status: MessageNormalizationModelStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "messageNormalizationModel.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const MessageNormalizationModelApiRegistry = Object.freeze([
  modelApi("MessageNormalizationModelId", "IdentityConstant"),
  modelApi("MessageNormalizationModelVersion", "IdentityConstant"),
  modelApi("MessageNormalizationModelName", "IdentityConstant"),
  modelApi("MessageNormalizationModelNamespace", "IdentityConstant"),
  modelApi("MessageNormalizationModelStatus", "MetadataConstant"),
  modelApi("MessageNormalizationModelReadiness", "MetadataConstant"),
  modelApi("MessageNormalizationModelPlatform", "Aggregate"),
  modelApi("getMessageNormalizationModelSummary", "Helper"),
]);

/**
 * Canonical immutable Message Normalization Model platform.
 * Nine ordered sections. Metadata only.
 */
export const MessageNormalizationModelPlatform = Object.freeze({
  identity,
  dependency,
  domainModels: MessageNormalizationDomainModelCatalog,
  relationships: MessageNormalizationModelRelationshipCatalog,
  lifecycle: MessageNormalizationModelLifecycle,
  metadata: MessageNormalizationModelMetadata,
  ownership: MessageNormalizationModelOwnership,
  boundaries: MessageNormalizationModelBoundaries,
  readiness: Object.freeze({
    readinessId: "NEA-6:3/ModelReadiness",
    readiness: MessageNormalizationModelReadiness,
    nextPhase: MessageNormalizationModelMetadata.nextPhase,
    claimsReadyForValidation: true as const,
    claimsReadyForRuntime: false as const,
    claimsRuntimeNormalizationImplemented: false as const,
    claimsPayloadParsingImplemented: false as const,
    claimsAiImplemented: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: MessageNormalizationModelApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: MessageNormalizationModelStatus,
  nextPhase: MessageNormalizationModelMetadata.nextPhase,
  downstreamReadiness: MessageNormalizationModelReadiness,
  registryPlatform: MessageNormalizationRegistryPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  implementsRuntimeNormalization: false as const,
  parsesPayloads: false as const,
  processesMessages: false as const,
  interpretsBusinessMeaning: false as const,
  modifiesUserIntent: false as const,
  implementsRouting: false as const,
  implementsHttp: false as const,
  implementsRest: false as const,
  implementsWebSockets: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  businessLogic: false as const,
  invokesDkl: false as const,
  invokesExecutiveEngine: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Message Normalization Model summary.
 * Counts are derived exclusively from canonical model collections.
 */
export function getMessageNormalizationModelSummary(): MessageNormalizationModelSummary {
  const meta = MessageNormalizationModelMetadata;
  return Object.freeze({
    modelId: MessageNormalizationModelId,
    version: MessageNormalizationModelVersion,
    name: MessageNormalizationModelName,
    namespace: MessageNormalizationModelNamespace,
    layer: "NEA" as const,
    phase: "NEA-6:3" as const,
    status: MessageNormalizationModelStatus,
    readiness: MessageNormalizationModelReadiness,
    registryId: MessageNormalizationRegistryId,
    domainModelCount: meta.domainModelCount,
    messageIdentityModelCount: meta.messageIdentityModelCount,
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
