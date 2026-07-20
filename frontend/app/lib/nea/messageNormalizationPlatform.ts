/**
 * NEA-6:6 — Message Normalization Platform.
 *
 * Canonical immutable composition surface for the complete Message Normalization architecture.
 * Consumes only NEA-6:5 Message Normalization Manifest public surface.
 * Metadata-only. Runtime-free. Ready for Certification.
 *
 * Ownership: owned exclusively by NEA-6:6.
 *
 * Public exports (exactly 8):
 *   MessageNormalizationPlatformId
 *   MessageNormalizationPlatformVersion
 *   MessageNormalizationPlatformName
 *   MessageNormalizationPlatformNamespace
 *   MessageNormalizationPlatformStatus
 *   MessageNormalizationPlatformReadiness
 *   MessageNormalizationPlatform
 *   getMessageNormalizationPlatformSummary()
 */

import {
  MessageNormalizationManifestId,
  MessageNormalizationManifestPlatform,
  MessageNormalizationManifestVersion,
} from "./messageNormalizationManifest.ts";
import { MessageNormalizationPlatformMetadata } from "./messageNormalizationPlatformMetadata.ts";
import { MessageNormalizationPlatformNamespaceObject } from "./messageNormalizationPlatformNamespace.ts";
import {
  MessageNormalizationPlatformBoundaries,
  MessageNormalizationPlatformOwnership,
} from "./messageNormalizationPlatformOwnership.ts";
import {
  MessageNormalizationPlatformReadinessDeclaration,
  MessageNormalizationPlatformReadinessValue,
} from "./messageNormalizationPlatformReadiness.ts";
import { buildMessageNormalizationPlatformSummary } from "./messageNormalizationPlatformSummary.ts";
import type {
  MessageNormalizationPlatformIdentity,
  MessageNormalizationPlatformSummary,
} from "./messageNormalizationPlatformTypes.ts";

/** Canonical platform identity. */
export const MessageNormalizationPlatformId =
  "NEA-6:6/MessageNormalizationPlatform" as const;

/** Human-readable platform name. */
export const MessageNormalizationPlatformName =
  "Message Normalization Platform" as const;

/** Semantic version. */
export const MessageNormalizationPlatformVersion = "1.0.0" as const;

/** Canonical namespace. */
export const MessageNormalizationPlatformNamespace =
  "nexora.nea.message-normalization.platform" as const;

/** Platform status. */
export const MessageNormalizationPlatformStatus = "Platform" as const;

/** Immediate next-phase readiness. */
export const MessageNormalizationPlatformReadiness =
  MessageNormalizationPlatformReadinessValue;

const identity: MessageNormalizationPlatformIdentity = Object.freeze({
  platformId: MessageNormalizationPlatformId,
  platformName: MessageNormalizationPlatformName,
  platformVersion: MessageNormalizationPlatformVersion,
  platformNamespace: MessageNormalizationPlatformNamespace,
  layer: "NEA" as const,
  phase: "NEA-6:6" as const,
  stage: "Platform" as const,
  sourcePhase: "NEA-6:6" as const,
  owner: "NEA-6 Message Normalization",
  status: MessageNormalizationPlatformStatus,
  readiness: MessageNormalizationPlatformReadiness,
  manifestId: MessageNormalizationManifestId,
  manifestVersion: MessageNormalizationManifestVersion,
  description:
    "Immutable canonical composition surface aggregating Foundation, Registry, Model, Validation, and Manifest exclusively through canonical references.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-6:6/Dependency/NEA65Manifest",
  directPreviousPhaseModule: "messageNormalizationManifest.ts" as const,
  manifestOnly: true as const,
  manifestId: MessageNormalizationManifestId,
  manifestVersion: MessageNormalizationManifestVersion,
  manifestPublicSurfaceOnly: true as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  duplicatesUpstreamArchitecture: false as const,
  redefinesPriorPhases: false as const,
  canonicalPath:
    "NEA-6:6 → NEA-6:5 ManifestPlatform → Validation → Model → Registry → Foundation",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "namespace",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
  "summary",
  "consumer",
] as const);

const platformApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `NEA-6:6/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-6:6" as const,
    section: "Platform" as const,
    kind,
    version: MessageNormalizationPlatformVersion,
    status: MessageNormalizationPlatformStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "messageNormalizationPlatform.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const MessageNormalizationPlatformApiRegistry = Object.freeze([
  platformApi("MessageNormalizationPlatformId", "IdentityConstant"),
  platformApi("MessageNormalizationPlatformVersion", "IdentityConstant"),
  platformApi("MessageNormalizationPlatformName", "IdentityConstant"),
  platformApi("MessageNormalizationPlatformNamespace", "IdentityConstant"),
  platformApi("MessageNormalizationPlatformStatus", "MetadataConstant"),
  platformApi("MessageNormalizationPlatformReadiness", "MetadataConstant"),
  platformApi("MessageNormalizationPlatform", "Aggregate"),
  platformApi("getMessageNormalizationPlatformSummary", "Helper"),
]);

const summarySnapshot = buildMessageNormalizationPlatformSummary();

/**
 * Canonical immutable Message Normalization Platform.
 * Consumer surface for the complete NEA-6 architecture.
 * Nine ordered sections. Metadata only.
 */
export const MessageNormalizationPlatform = Object.freeze({
  identity,
  dependency,
  namespace: MessageNormalizationPlatformNamespaceObject,
  metadata: MessageNormalizationPlatformMetadata,
  ownership: MessageNormalizationPlatformOwnership,
  boundaries: MessageNormalizationPlatformBoundaries,
  readiness: MessageNormalizationPlatformReadinessDeclaration,
  summary: summarySnapshot,
  consumer: Object.freeze({
    consumerSurfaceId: "NEA-6:6/ConsumerPlatformSurface",
    soleSupportedEntryPoint: "messageNormalizationPlatform.ts" as const,
    accessRule:
      "Consumers shall access NEA-6 through MessageNormalizationPlatform only.",
    composedSections: MessageNormalizationPlatformNamespaceObject.sectionOrder,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: MessageNormalizationPlatformApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: MessageNormalizationPlatformStatus,
  nextPhase: MessageNormalizationPlatformReadinessDeclaration.nextPhase,
  downstreamReadiness: MessageNormalizationPlatformReadiness,
  manifestPlatform: MessageNormalizationManifestPlatform,
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
 * Deterministic frozen Message Normalization Platform summary.
 * Counts are derived exclusively from canonical upstream collections.
 */
export function getMessageNormalizationPlatformSummary(): MessageNormalizationPlatformSummary {
  return buildMessageNormalizationPlatformSummary();
}
