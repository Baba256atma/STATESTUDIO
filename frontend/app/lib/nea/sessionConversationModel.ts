/**
 * NEA-3:3 — Session & Conversation Model.
 *
 * Canonical immutable domain model layer for Session & Conversation.
 * Consumes only NEA-3:2 Session & Conversation Registry public surface.
 * Metadata-only. Runtime-free. Ready for Validation.
 *
 * Ownership: owned exclusively by NEA-3:3.
 *
 * Public exports (exactly 8):
 *   SessionConversationModelId
 *   SessionConversationModelVersion
 *   SessionConversationModelName
 *   SessionConversationModelNamespace
 *   SessionConversationModelStatus
 *   SessionConversationModelReadiness
 *   SessionConversationModelPlatform
 *   getSessionConversationModelSummary()
 */

import {
  SessionConversationRegistryId,
  SessionConversationRegistryPlatform,
  SessionConversationRegistryVersion,
} from "./sessionConversationRegistry.ts";
import { SessionConversationModelLifecycle } from "./sessionConversationModelLifecycle.ts";
import { SessionConversationModelMetadata } from "./sessionConversationModelMetadata.ts";
import {
  SessionConversationModelBoundaries,
  SessionConversationModelOwnership,
} from "./sessionConversationModelOwnership.ts";
import { SessionConversationDomainModelCatalog } from "./sessionConversationModels.ts";
import { SessionConversationModelRelationshipCatalog } from "./sessionConversationRelationships.ts";
import type {
  SessionConversationModelIdentity,
  SessionConversationModelSummary,
} from "./sessionConversationModelTypes.ts";

/** Canonical model identity. */
export const SessionConversationModelId =
  "NEA-3:3/SessionConversationModel" as const;

/** Human-readable model name. */
export const SessionConversationModelName =
  "Session & Conversation Model" as const;

/** Semantic version. */
export const SessionConversationModelVersion = "1.0.0" as const;

/** Canonical namespace. */
export const SessionConversationModelNamespace =
  "nexora.nea.session-conversation.model" as const;

/** Model status. */
export const SessionConversationModelStatus = "Model" as const;

/** Immediate next-phase readiness. */
export const SessionConversationModelReadiness =
  "ReadyForValidation" as const;

const identity: SessionConversationModelIdentity = Object.freeze({
  modelId: SessionConversationModelId,
  modelName: SessionConversationModelName,
  modelVersion: SessionConversationModelVersion,
  modelNamespace: SessionConversationModelNamespace,
  layer: "NEA" as const,
  phase: "NEA-3:3" as const,
  stage: "Model" as const,
  sourcePhase: "NEA-3:3" as const,
  owner: "NEA-3 Session & Conversation",
  status: SessionConversationModelStatus,
  readiness: SessionConversationModelReadiness,
  registryId: SessionConversationRegistryId,
  registryVersion: SessionConversationRegistryVersion,
  description:
    "Immutable domain models transforming Registry declarations into strongly typed Session & Conversation data structures.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-3:3/Dependency/NEA32Registry",
  directPreviousPhaseModule: "sessionConversationRegistry.ts" as const,
  registryOnly: true as const,
  registryId: SessionConversationRegistryId,
  registryVersion: SessionConversationRegistryVersion,
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
    "NEA-3:3 → NEA-3:2 SessionConversationRegistryPlatform (exclusive)",
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
    id: `NEA-3:3/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-3:3" as const,
    section: "Model" as const,
    kind,
    version: SessionConversationModelVersion,
    status: SessionConversationModelStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "sessionConversationModel.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const SessionConversationModelApiRegistry = Object.freeze([
  modelApi("SessionConversationModelId", "IdentityConstant"),
  modelApi("SessionConversationModelVersion", "IdentityConstant"),
  modelApi("SessionConversationModelName", "IdentityConstant"),
  modelApi("SessionConversationModelNamespace", "IdentityConstant"),
  modelApi("SessionConversationModelStatus", "MetadataConstant"),
  modelApi("SessionConversationModelReadiness", "MetadataConstant"),
  modelApi("SessionConversationModelPlatform", "Aggregate"),
  modelApi("getSessionConversationModelSummary", "Helper"),
]);

/**
 * Canonical immutable Session & Conversation Model platform.
 * Nine ordered sections. Metadata only.
 */
export const SessionConversationModelPlatform = Object.freeze({
  identity,
  dependency,
  domainModels: SessionConversationDomainModelCatalog,
  relationships: SessionConversationModelRelationshipCatalog,
  lifecycle: SessionConversationModelLifecycle,
  metadata: SessionConversationModelMetadata,
  ownership: SessionConversationModelOwnership,
  boundaries: SessionConversationModelBoundaries,
  readiness: Object.freeze({
    readinessId: "NEA-3:3/ModelReadiness",
    readiness: SessionConversationModelReadiness,
    nextPhase: SessionConversationModelMetadata.nextPhase,
    claimsReadyForValidation: true as const,
    claimsReadyForRuntime: false as const,
    claimsSessionsManaged: false as const,
    claimsConversationsManaged: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: SessionConversationModelApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: SessionConversationModelStatus,
  nextPhase: SessionConversationModelMetadata.nextPhase,
  downstreamReadiness: SessionConversationModelReadiness,
  registryPlatform: SessionConversationRegistryPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  managesRuntimeSessions: false as const,
  managesRuntimeConversations: false as const,
  processesMessages: false as const,
  storesMessages: false as const,
  executesConnectors: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  businessLogic: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Session & Conversation Model summary.
 * Counts are derived exclusively from canonical model collections.
 */
export function getSessionConversationModelSummary(): SessionConversationModelSummary {
  const meta = SessionConversationModelMetadata;
  return Object.freeze({
    modelId: SessionConversationModelId,
    version: SessionConversationModelVersion,
    name: SessionConversationModelName,
    namespace: SessionConversationModelNamespace,
    layer: "NEA" as const,
    phase: "NEA-3:3" as const,
    status: SessionConversationModelStatus,
    readiness: SessionConversationModelReadiness,
    registryId: SessionConversationRegistryId,
    domainModelCount: meta.domainModelCount,
    sessionIdentityModelCount: meta.sessionIdentityModelCount,
    conversationIdentityModelCount: meta.conversationIdentityModelCount,
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
