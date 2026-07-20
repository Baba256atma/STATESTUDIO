/**
 * NEA-6:5 — Message Normalization Manifest.
 *
 * Canonical immutable architectural publication of NEA-6 through Validation.
 * Consumes only NEA-6:4 Message Normalization Validation public surface.
 * Metadata-only. Runtime-free. Ready for Platform.
 *
 * Ownership: owned exclusively by NEA-6:5.
 *
 * Public exports (exactly 8):
 *   MessageNormalizationManifestId
 *   MessageNormalizationManifestVersion
 *   MessageNormalizationManifestName
 *   MessageNormalizationManifestNamespace
 *   MessageNormalizationManifestStatus
 *   MessageNormalizationManifestReadiness
 *   MessageNormalizationManifestPlatform
 *   getMessageNormalizationManifestSummary()
 */

import {
  MessageNormalizationValidationId,
  MessageNormalizationValidationPlatform,
  MessageNormalizationValidationVersion,
} from "./messageNormalizationValidation.ts";
import { MessageNormalizationManifestInventoryCatalog } from "./messageNormalizationManifestInventory.ts";
import { MessageNormalizationManifestMetadata } from "./messageNormalizationManifestMetadata.ts";
import {
  MessageNormalizationManifestBoundaries,
  MessageNormalizationManifestOwnership,
} from "./messageNormalizationManifestOwnership.ts";
import {
  MessageNormalizationManifestReadinessDeclaration,
  MessageNormalizationManifestReadinessValue,
} from "./messageNormalizationManifestReadiness.ts";
import { buildMessageNormalizationManifestSummary } from "./messageNormalizationManifestSummary.ts";
import type {
  MessageNormalizationManifestIdentity,
  MessageNormalizationManifestSummary,
} from "./messageNormalizationManifestTypes.ts";

/** Canonical manifest identity. */
export const MessageNormalizationManifestId =
  "NEA-6:5/MessageNormalizationManifest" as const;

/** Human-readable manifest name. */
export const MessageNormalizationManifestName =
  "Message Normalization Manifest" as const;

/** Semantic version. */
export const MessageNormalizationManifestVersion = "1.0.0" as const;

/** Canonical namespace. */
export const MessageNormalizationManifestNamespace =
  "nexora.nea.message-normalization.manifest" as const;

/** Manifest status. */
export const MessageNormalizationManifestStatus = "Manifest" as const;

/** Immediate next-phase readiness. */
export const MessageNormalizationManifestReadiness =
  MessageNormalizationManifestReadinessValue;

const identity: MessageNormalizationManifestIdentity = Object.freeze({
  manifestId: MessageNormalizationManifestId,
  manifestName: MessageNormalizationManifestName,
  manifestVersion: MessageNormalizationManifestVersion,
  manifestNamespace: MessageNormalizationManifestNamespace,
  layer: "NEA" as const,
  phase: "NEA-6:5" as const,
  stage: "Manifest" as const,
  sourcePhase: "NEA-6:5" as const,
  owner: "NEA-6 Message Normalization",
  status: MessageNormalizationManifestStatus,
  readiness: MessageNormalizationManifestReadiness,
  validationId: MessageNormalizationValidationId,
  validationVersion: MessageNormalizationValidationVersion,
  description:
    "Immutable architectural publication of Message Normalization aggregating Foundation, Registry, Model, and Validation through canonical references only.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-6:5/Dependency/NEA64Validation",
  directPreviousPhaseModule: "messageNormalizationValidation.ts" as const,
  validationOnly: true as const,
  validationId: MessageNormalizationValidationId,
  validationVersion: MessageNormalizationValidationVersion,
  validationPublicSurfaceOnly: true as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  duplicatesUpstreamCollections: false as const,
  redefinesPriorPhases: false as const,
  canonicalPath:
    "NEA-6:5 → NEA-6:4 ValidationPlatform → Model → Registry → Foundation",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "phaseReferences",
  "inventory",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
  "summary",
] as const);

const manifestApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `NEA-6:5/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-6:5" as const,
    section: "Manifest" as const,
    kind,
    version: MessageNormalizationManifestVersion,
    status: MessageNormalizationManifestStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "messageNormalizationManifest.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const MessageNormalizationManifestApiRegistry = Object.freeze([
  manifestApi("MessageNormalizationManifestId", "IdentityConstant"),
  manifestApi("MessageNormalizationManifestVersion", "IdentityConstant"),
  manifestApi("MessageNormalizationManifestName", "IdentityConstant"),
  manifestApi("MessageNormalizationManifestNamespace", "IdentityConstant"),
  manifestApi("MessageNormalizationManifestStatus", "MetadataConstant"),
  manifestApi("MessageNormalizationManifestReadiness", "MetadataConstant"),
  manifestApi("MessageNormalizationManifestPlatform", "Aggregate"),
  manifestApi("getMessageNormalizationManifestSummary", "Helper"),
]);

/**
 * Canonical immutable Message Normalization Manifest platform.
 * Nine ordered sections. Metadata only.
 */
export const MessageNormalizationManifestPlatform = Object.freeze({
  identity,
  dependency,
  phaseReferences: MessageNormalizationManifestInventoryCatalog.phaseReferences,
  inventory: MessageNormalizationManifestInventoryCatalog,
  metadata: MessageNormalizationManifestMetadata,
  ownership: MessageNormalizationManifestOwnership,
  boundaries: MessageNormalizationManifestBoundaries,
  readiness: MessageNormalizationManifestReadinessDeclaration,
  summary: buildMessageNormalizationManifestSummary(),
  apiRegistry: MessageNormalizationManifestApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: MessageNormalizationManifestStatus,
  nextPhase: MessageNormalizationManifestReadinessDeclaration.nextPhase,
  downstreamReadiness: MessageNormalizationManifestReadiness,
  validationPlatform: MessageNormalizationValidationPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  validationExecution: false as const,
  implementsRuntimeNormalization: false as const,
  parsesPayloads: false as const,
  processesMessages: false as const,
  interpretsBusinessMeaning: false as const,
  implementsRouting: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Message Normalization Manifest summary.
 * Counts are derived exclusively from canonical inventory collections.
 */
export function getMessageNormalizationManifestSummary(): MessageNormalizationManifestSummary {
  return buildMessageNormalizationManifestSummary();
}
