/**
 * NEA-3:4 — Session & Conversation Validation.
 *
 * Canonical immutable declarative validation architecture for Session & Conversation.
 * Consumes only NEA-3:3 Session & Conversation Model public surface.
 * Metadata-only. Runtime-free. Ready for Manifest.
 *
 * Ownership: owned exclusively by NEA-3:4.
 *
 * Public exports (exactly 8):
 *   SessionConversationValidationId
 *   SessionConversationValidationVersion
 *   SessionConversationValidationName
 *   SessionConversationValidationNamespace
 *   SessionConversationValidationStatus
 *   SessionConversationValidationReadiness
 *   SessionConversationValidationPlatform
 *   getSessionConversationValidationSummary()
 */

import {
  SessionConversationModelId,
  SessionConversationModelPlatform,
  SessionConversationModelVersion,
} from "./sessionConversationModel.ts";
import { SessionConversationValidationMetadata } from "./sessionConversationValidationMetadata.ts";
import {
  SessionConversationValidationBoundaries,
  SessionConversationValidationOwnership,
} from "./sessionConversationValidationOwnership.ts";
import { SessionConversationValidationPolicyCatalog } from "./sessionConversationValidationPolicies.ts";
import { SessionConversationValidationRelationshipCatalog } from "./sessionConversationValidationRelationships.ts";
import { SessionConversationValidationRuleCatalog } from "./sessionConversationValidationRules.ts";
import type {
  SessionConversationValidationIdentity,
  SessionConversationValidationSummary,
} from "./sessionConversationValidationTypes.ts";

/** Canonical validation identity. */
export const SessionConversationValidationId =
  "NEA-3:4/SessionConversationValidation" as const;

/** Human-readable validation name. */
export const SessionConversationValidationName =
  "Session & Conversation Validation" as const;

/** Semantic version. */
export const SessionConversationValidationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const SessionConversationValidationNamespace =
  "nexora.nea.session-conversation.validation" as const;

/** Validation status. */
export const SessionConversationValidationStatus = "Validation" as const;

/** Immediate next-phase readiness. */
export const SessionConversationValidationReadiness =
  "ReadyForManifest" as const;

const identity: SessionConversationValidationIdentity = Object.freeze({
  validationId: SessionConversationValidationId,
  validationName: SessionConversationValidationName,
  validationVersion: SessionConversationValidationVersion,
  validationNamespace: SessionConversationValidationNamespace,
  layer: "NEA" as const,
  phase: "NEA-3:4" as const,
  stage: "Validation" as const,
  sourcePhase: "NEA-3:4" as const,
  owner: "NEA-3 Session & Conversation",
  status: SessionConversationValidationStatus,
  readiness: SessionConversationValidationReadiness,
  modelId: SessionConversationModelId,
  modelVersion: SessionConversationModelVersion,
  description:
    "Immutable declarative validation architecture for Session & Conversation domain models. Metadata only; no validation engine.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-3:4/Dependency/NEA33Model",
  directPreviousPhaseModule: "sessionConversationModel.ts" as const,
  modelOnly: true as const,
  modelId: SessionConversationModelId,
  modelVersion: SessionConversationModelVersion,
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
    "NEA-3:4 → NEA-3:3 SessionConversationModelPlatform (exclusive)",
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
    id: `NEA-3:4/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-3:4" as const,
    section: "Validation" as const,
    kind,
    version: SessionConversationValidationVersion,
    status: SessionConversationValidationStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "sessionConversationValidation.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const SessionConversationValidationApiRegistry = Object.freeze([
  validationApi("SessionConversationValidationId", "IdentityConstant"),
  validationApi("SessionConversationValidationVersion", "IdentityConstant"),
  validationApi("SessionConversationValidationName", "IdentityConstant"),
  validationApi("SessionConversationValidationNamespace", "IdentityConstant"),
  validationApi("SessionConversationValidationStatus", "MetadataConstant"),
  validationApi("SessionConversationValidationReadiness", "MetadataConstant"),
  validationApi("SessionConversationValidationPlatform", "Aggregate"),
  validationApi("getSessionConversationValidationSummary", "Helper"),
]);

/**
 * Canonical immutable Session & Conversation Validation platform.
 * Ten ordered sections. Metadata only.
 */
export const SessionConversationValidationPlatform = Object.freeze({
  identity,
  dependency,
  categories: SessionConversationValidationRuleCatalog.categories,
  rules: SessionConversationValidationRuleCatalog,
  relationships: SessionConversationValidationRelationshipCatalog,
  policies: SessionConversationValidationPolicyCatalog,
  metadata: SessionConversationValidationMetadata,
  ownership: SessionConversationValidationOwnership,
  boundaries: SessionConversationValidationBoundaries,
  readiness: Object.freeze({
    readinessId: "NEA-3:4/ValidationReadiness",
    readiness: SessionConversationValidationReadiness,
    nextPhase: SessionConversationValidationMetadata.nextPhase,
    claimsReadyForManifest: true as const,
    claimsReadyForRuntime: false as const,
    claimsValidationEngine: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: SessionConversationValidationApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: SessionConversationValidationStatus,
  nextPhase: SessionConversationValidationMetadata.nextPhase,
  downstreamReadiness: SessionConversationValidationReadiness,
  modelPlatform: SessionConversationModelPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  validationEngine: false as const,
  runtimeValidation: false as const,
  managesRuntimeSessions: false as const,
  managesRuntimeConversations: false as const,
  processesMessages: false as const,
  executesConnectors: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Session & Conversation Validation summary.
 * Counts are derived exclusively from canonical validation collections.
 */
export function getSessionConversationValidationSummary(): SessionConversationValidationSummary {
  const meta = SessionConversationValidationMetadata;
  return Object.freeze({
    validationId: SessionConversationValidationId,
    version: SessionConversationValidationVersion,
    name: SessionConversationValidationName,
    namespace: SessionConversationValidationNamespace,
    layer: "NEA" as const,
    phase: "NEA-3:4" as const,
    status: SessionConversationValidationStatus,
    readiness: SessionConversationValidationReadiness,
    modelId: SessionConversationModelId,
    categoryCount: meta.categoryCount,
    ruleCount: meta.ruleCount,
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
