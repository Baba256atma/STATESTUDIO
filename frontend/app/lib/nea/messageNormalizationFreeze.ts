/**
 * NEA-6:8 — Message Normalization Freeze.
 *
 * Canonical immutable freeze surface for certified Message Normalization.
 * Consumes only NEA-6:7 Message Normalization Certification public surface.
 * Metadata-only. Runtime-free. Ready for Public Index.
 *
 * Ownership: owned exclusively by NEA-6:8.
 *
 * Public exports (exactly 8):
 *   MessageNormalizationFreezeId
 *   MessageNormalizationFreezeVersion
 *   MessageNormalizationFreezeName
 *   MessageNormalizationFreezeNamespace
 *   MessageNormalizationFreezeStatus
 *   MessageNormalizationFreezeReadiness
 *   MessageNormalizationFreezePlatform
 *   getMessageNormalizationFreezeSummary()
 */

import {
  MessageNormalizationCertificationId,
  MessageNormalizationCertificationPlatform,
  MessageNormalizationCertificationVersion,
} from "./messageNormalizationCertification.ts";
import { MessageNormalizationFreezeCompatibilityCatalog } from "./messageNormalizationFreezeCompatibility.ts";
import { MessageNormalizationFreezeExtensionPolicy } from "./messageNormalizationFreezeExtensions.ts";
import { MessageNormalizationFreezeLockCatalog } from "./messageNormalizationFreezeLocks.ts";
import {
  buildMessageNormalizationFreezeSummary,
  MessageNormalizationFreezeBoundaries,
  MessageNormalizationFreezeMetadata,
  MessageNormalizationFreezeOwnership,
  MessageNormalizationFreezeReadinessValue,
} from "./messageNormalizationFreezeMetadata.ts";
import { MessageNormalizationFreezeRegistryCatalog } from "./messageNormalizationFreezeRegistry.ts";
import type {
  MessageNormalizationFreezeIdentity,
  MessageNormalizationFreezeSummary,
} from "./messageNormalizationFreezeTypes.ts";

/** Canonical freeze identity. */
export const MessageNormalizationFreezeId =
  "NEA-6:8/MessageNormalizationFreeze" as const;

/** Human-readable freeze name. */
export const MessageNormalizationFreezeName =
  "Message Normalization Freeze" as const;

/** Semantic version. */
export const MessageNormalizationFreezeVersion = "1.0.0" as const;

/** Canonical namespace. */
export const MessageNormalizationFreezeNamespace =
  "nexora.nea.message-normalization.freeze" as const;

/** Freeze status. */
export const MessageNormalizationFreezeStatus = "Freeze" as const;

/** Immediate next-phase readiness. */
export const MessageNormalizationFreezeReadiness =
  MessageNormalizationFreezeReadinessValue;

const identity: MessageNormalizationFreezeIdentity = Object.freeze({
  freezeId: MessageNormalizationFreezeId,
  freezeName: MessageNormalizationFreezeName,
  freezeVersion: MessageNormalizationFreezeVersion,
  freezeNamespace: MessageNormalizationFreezeNamespace,
  layer: "NEA" as const,
  phase: "NEA-6:8" as const,
  stage: "Freeze" as const,
  sourcePhase: "NEA-6:8" as const,
  owner: "NEA-6 Message Normalization",
  status: MessageNormalizationFreezeStatus,
  readiness: MessageNormalizationFreezeReadiness,
  certificationId: MessageNormalizationCertificationId,
  certificationVersion: MessageNormalizationCertificationVersion,
  description:
    "Immutable freeze layer permanently locking the certified Message Normalization architecture as the sole frozen baseline for Public Index consumers.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-6:8/Dependency/NEA67Certification",
  directPreviousPhaseModule: "messageNormalizationCertification.ts" as const,
  certificationOnly: true as const,
  certificationId: MessageNormalizationCertificationId,
  certificationVersion: MessageNormalizationCertificationVersion,
  certificationPublicSurfaceOnly: true as const,
  platformDirectImport: false as const,
  manifestDirectImport: false as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  duplicatesCertificationMetadata: false as const,
  duplicatesPlatformMetadata: false as const,
  reconstructsCertification: false as const,
  reconstructsPlatform: false as const,
  redefinesPriorPhases: false as const,
  canonicalPath:
    "NEA-6:8 → NEA-6:7 MessageNormalizationCertificationPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "registry",
  "locks",
  "compatibility",
  "extensions",
  "metadata",
  "ownership",
  "boundaries",
  "summary",
  "readiness",
] as const);

const freezeApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `NEA-6:8/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-6:8" as const,
    section: "Freeze" as const,
    kind,
    version: MessageNormalizationFreezeVersion,
    status: MessageNormalizationFreezeStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "messageNormalizationFreeze.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const MessageNormalizationFreezeApiRegistry = Object.freeze([
  freezeApi("MessageNormalizationFreezeId", "IdentityConstant"),
  freezeApi("MessageNormalizationFreezeVersion", "IdentityConstant"),
  freezeApi("MessageNormalizationFreezeName", "IdentityConstant"),
  freezeApi("MessageNormalizationFreezeNamespace", "IdentityConstant"),
  freezeApi("MessageNormalizationFreezeStatus", "MetadataConstant"),
  freezeApi("MessageNormalizationFreezeReadiness", "MetadataConstant"),
  freezeApi("MessageNormalizationFreezePlatform", "Aggregate"),
  freezeApi("getMessageNormalizationFreezeSummary", "Helper"),
]);

/**
 * Canonical immutable Message Normalization Freeze platform.
 * Metadata only. Certified architecture preserved by reference.
 */
export const MessageNormalizationFreezePlatform = Object.freeze({
  identity,
  dependency,
  registry: MessageNormalizationFreezeRegistryCatalog,
  locks: MessageNormalizationFreezeLockCatalog,
  compatibility: MessageNormalizationFreezeCompatibilityCatalog,
  extensions: MessageNormalizationFreezeExtensionPolicy,
  metadata: MessageNormalizationFreezeMetadata,
  ownership: MessageNormalizationFreezeOwnership,
  boundaries: MessageNormalizationFreezeBoundaries,
  summary: buildMessageNormalizationFreezeSummary(),
  readiness: Object.freeze({
    readinessId: "NEA-6:8/FreezeReadiness",
    readiness: MessageNormalizationFreezeReadiness,
    nextPhase: MessageNormalizationFreezeMetadata.nextPhase,
    allLocksActive: MessageNormalizationFreezeLockCatalog.allLocksActive,
    allCompatible: MessageNormalizationFreezeCompatibilityCatalog.allCompatible,
    certificationOutcome:
      MessageNormalizationCertificationPlatform.metadata.certificationOutcome,
    claimsReadyForPublicIndex: true as const,
    claimsPublicIndexPublished: false as const,
    claimsReadyForProduction: false as const,
    claimsRuntimeReady: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: MessageNormalizationFreezeApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: MessageNormalizationFreezeStatus,
  nextPhase: MessageNormalizationFreezeMetadata.nextPhase,
  downstreamReadiness: MessageNormalizationFreezeReadiness,
  certification: MessageNormalizationCertificationPlatform,
  certifiedPlatformReference:
    MessageNormalizationFreezeRegistryCatalog.certifiedPlatformReference,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  runtimeFreezeLogic: false as const,
  runtimeCertification: false as const,
  runtimeNormalization: false as const,
  runtimeValidation: false as const,
  implementsMessageParsing: false as const,
  implementsRouting: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Message Normalization Freeze summary.
 * Counts are derived exclusively from Certification and Freeze catalogs.
 */
export function getMessageNormalizationFreezeSummary(): MessageNormalizationFreezeSummary {
  return buildMessageNormalizationFreezeSummary();
}
