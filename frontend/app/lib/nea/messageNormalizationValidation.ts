/**
 * NEA-6:4 — Message Normalization Validation.
 *
 * Canonical immutable declarative validation architecture for Message Normalization.
 * Consumes only NEA-6:3 Message Normalization Model public surface.
 * Metadata-only. Runtime-free. Ready for Manifest.
 *
 * Ownership: owned exclusively by NEA-6:4.
 *
 * Public exports (exactly 8):
 *   MessageNormalizationValidationId
 *   MessageNormalizationValidationVersion
 *   MessageNormalizationValidationName
 *   MessageNormalizationValidationNamespace
 *   MessageNormalizationValidationStatus
 *   MessageNormalizationValidationReadiness
 *   MessageNormalizationValidationPlatform
 *   getMessageNormalizationValidationSummary()
 */

import {
  MessageNormalizationModelId,
  MessageNormalizationModelPlatform,
  MessageNormalizationModelVersion,
} from "./messageNormalizationModel.ts";
import { MessageNormalizationValidationMetadata } from "./messageNormalizationValidationMetadata.ts";
import {
  MessageNormalizationValidationBoundaries,
  MessageNormalizationValidationOwnership,
} from "./messageNormalizationValidationOwnership.ts";
import { MessageNormalizationValidationPolicyCatalog } from "./messageNormalizationValidationPolicies.ts";
import { MessageNormalizationValidationRelationshipCatalog } from "./messageNormalizationValidationRelationships.ts";
import { MessageNormalizationValidationRuleCatalog } from "./messageNormalizationValidationRules.ts";
import type {
  MessageNormalizationValidationIdentity,
  MessageNormalizationValidationSummary,
} from "./messageNormalizationValidationTypes.ts";

/** Canonical validation identity. */
export const MessageNormalizationValidationId =
  "NEA-6:4/MessageNormalizationValidation" as const;

/** Human-readable validation name. */
export const MessageNormalizationValidationName =
  "Message Normalization Validation" as const;

/** Semantic version. */
export const MessageNormalizationValidationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const MessageNormalizationValidationNamespace =
  "nexora.nea.message-normalization.validation" as const;

/** Validation status. */
export const MessageNormalizationValidationStatus = "Validation" as const;

/** Immediate next-phase readiness. */
export const MessageNormalizationValidationReadiness =
  "ReadyForManifest" as const;

const identity: MessageNormalizationValidationIdentity = Object.freeze({
  validationId: MessageNormalizationValidationId,
  validationName: MessageNormalizationValidationName,
  validationVersion: MessageNormalizationValidationVersion,
  validationNamespace: MessageNormalizationValidationNamespace,
  layer: "NEA" as const,
  phase: "NEA-6:4" as const,
  stage: "Validation" as const,
  sourcePhase: "NEA-6:4" as const,
  owner: "NEA-6 Message Normalization",
  status: MessageNormalizationValidationStatus,
  readiness: MessageNormalizationValidationReadiness,
  modelId: MessageNormalizationModelId,
  modelVersion: MessageNormalizationModelVersion,
  description:
    "Immutable declarative validation architecture for Message Normalization domain models. Metadata only; no validation engine, runtime normalization, or payload parsing.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-6:4/Dependency/NEA63Model",
  directPreviousPhaseModule: "messageNormalizationModel.ts" as const,
  modelOnly: true as const,
  modelId: MessageNormalizationModelId,
  modelVersion: MessageNormalizationModelVersion,
  modelPublicSurfaceOnly: true as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  publicIndexDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  reconstructsModel: false as const,
  duplicatesModelValues: false as const,
  canonicalPath:
    "NEA-6:4 → NEA-6:3 MessageNormalizationModelPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "categories",
  "rules",
  "relationships",
  "policies",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
] as const);

const validationApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `NEA-6:4/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-6:4" as const,
    section: "Validation" as const,
    kind,
    version: MessageNormalizationValidationVersion,
    status: MessageNormalizationValidationStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "messageNormalizationValidation.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const MessageNormalizationValidationApiRegistry = Object.freeze([
  validationApi("MessageNormalizationValidationId", "IdentityConstant"),
  validationApi("MessageNormalizationValidationVersion", "IdentityConstant"),
  validationApi("MessageNormalizationValidationName", "IdentityConstant"),
  validationApi("MessageNormalizationValidationNamespace", "IdentityConstant"),
  validationApi("MessageNormalizationValidationStatus", "MetadataConstant"),
  validationApi("MessageNormalizationValidationReadiness", "MetadataConstant"),
  validationApi("MessageNormalizationValidationPlatform", "Aggregate"),
  validationApi("getMessageNormalizationValidationSummary", "Helper"),
]);

/**
 * Canonical immutable Message Normalization Validation platform.
 * Ten ordered sections. Metadata only.
 */
export const MessageNormalizationValidationPlatform = Object.freeze({
  identity,
  dependency,
  categories: MessageNormalizationValidationRuleCatalog.categories,
  rules: MessageNormalizationValidationRuleCatalog,
  relationships: MessageNormalizationValidationRelationshipCatalog,
  policies: MessageNormalizationValidationPolicyCatalog,
  metadata: MessageNormalizationValidationMetadata,
  ownership: MessageNormalizationValidationOwnership,
  boundaries: MessageNormalizationValidationBoundaries,
  readiness: Object.freeze({
    readinessId: "NEA-6:4/ValidationReadiness",
    readiness: MessageNormalizationValidationReadiness,
    nextPhase: MessageNormalizationValidationMetadata.nextPhase,
    claimsReadyForManifest: true as const,
    claimsReadyForRuntime: false as const,
    claimsValidationEngine: false as const,
    claimsRuntimeNormalizationImplemented: false as const,
    claimsPayloadParsingImplemented: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: MessageNormalizationValidationApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: MessageNormalizationValidationStatus,
  nextPhase: MessageNormalizationValidationMetadata.nextPhase,
  downstreamReadiness: MessageNormalizationValidationReadiness,
  modelPlatform: MessageNormalizationModelPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  validationEngine: false as const,
  runtimeValidation: false as const,
  implementsRuntimeNormalization: false as const,
  parsesPayloads: false as const,
  processesMessages: false as const,
  interpretsBusinessMeaning: false as const,
  implementsRouting: false as const,
  implementsHttp: false as const,
  implementsRest: false as const,
  implementsWebSockets: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  invokesDkl: false as const,
  invokesEngine: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Message Normalization Validation summary.
 * Counts are derived exclusively from canonical validation collections.
 */
export function getMessageNormalizationValidationSummary(): MessageNormalizationValidationSummary {
  const meta = MessageNormalizationValidationMetadata;
  return Object.freeze({
    validationId: MessageNormalizationValidationId,
    version: MessageNormalizationValidationVersion,
    name: MessageNormalizationValidationName,
    namespace: MessageNormalizationValidationNamespace,
    layer: "NEA" as const,
    phase: "NEA-6:4" as const,
    status: MessageNormalizationValidationStatus,
    readiness: MessageNormalizationValidationReadiness,
    modelId: MessageNormalizationModelId,
    categoryCount: meta.categoryCount,
    domainCategoryCount: meta.domainCategoryCount,
    ruleCount: meta.ruleCount,
    crossModelRuleCount: meta.crossModelRuleCount,
    platformIntegrityRuleCount: meta.platformIntegrityRuleCount,
    relationshipCount: meta.relationshipCount,
    policyCount: meta.policyCount,
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
