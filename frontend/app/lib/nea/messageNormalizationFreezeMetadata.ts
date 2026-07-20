/**
 * NEA-6:8 — Message Normalization Freeze Metadata.
 *
 * Immutable freeze metadata and summary helpers.
 * Counts and certification outcome are derived exclusively from Certification.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-6:8.
 */

import {
  MessageNormalizationCertificationId,
  MessageNormalizationCertificationPlatform,
  getMessageNormalizationCertificationSummary,
} from "./messageNormalizationCertification.ts";
import { MessageNormalizationFreezeCompatibilityCatalog } from "./messageNormalizationFreezeCompatibility.ts";
import { MessageNormalizationFreezeExtensionPolicy } from "./messageNormalizationFreezeExtensions.ts";
import {
  MessageNormalizationFreezeAllLocksActive,
  MessageNormalizationFreezeLockCatalog,
} from "./messageNormalizationFreezeLocks.ts";
import { MessageNormalizationFreezeRegistryCatalog } from "./messageNormalizationFreezeRegistry.ts";
import type { MessageNormalizationFreezeSummary } from "./messageNormalizationFreezeTypes.ts";

/** Canonical readiness value. */
export const MessageNormalizationFreezeReadinessValue =
  "ReadyForPublicIndex" as const;

/** Ownership surfaces owned by Freeze. */
export const MESSAGE_NORMALIZATION_FREEZE_OWNS = Object.freeze([
  "Freeze Locks",
  "Compatibility Metadata",
  "Extension Policy",
  "Freeze Summary",
  "Freeze Metadata",
] as const);

/** Surfaces Freeze does not own. */
export const MESSAGE_NORMALIZATION_FREEZE_DOES_NOT_OWN = Object.freeze([
  "Certification Gates",
  "Platform Namespace",
  "Manifest Inventories",
  "Validation Rules",
  "Domain Models",
  "Registry Collections",
  "Foundation Contracts",
  "Runtime Freeze",
  "Runtime Normalization",
  "Runtime Validation",
  "AI",
  "DKL",
  "Executive Engine",
  "Storage",
  "Routing",
  "Security",
  "Connector Runtime",
] as const);

/** Prohibited Freeze surfaces. */
export const MESSAGE_NORMALIZATION_FREEZE_PROHIBITED_SURFACES = Object.freeze([
  "Runtime Freeze",
  "Runtime Normalization",
  "Runtime Validation",
  "Message Parsing",
  "AI",
  "LLM",
  "Business Understanding",
  "Routing",
  "HTTP",
  "REST",
  "WebSockets",
  "Database",
  "Queue",
  "Event Bus",
  "Authentication",
  "Authorization",
  "Storage",
  "React",
  "Next.js",
  "DKL invocation",
  "Executive Engine invocation",
] as const);

/** Canonical immutable freeze ownership. */
export const MessageNormalizationFreezeOwnership = Object.freeze({
  ownershipId: "NEA-6:8/MessageNormalizationFreezeOwnership",
  sourcePhase: "NEA-6:8" as const,
  owns: MESSAGE_NORMALIZATION_FREEZE_OWNS,
  doesNotOwn: MESSAGE_NORMALIZATION_FREEZE_DOES_NOT_OWN,
  ownsCount: MESSAGE_NORMALIZATION_FREEZE_OWNS.length,
  doesNotOwnCount: MESSAGE_NORMALIZATION_FREEZE_DOES_NOT_OWN.length,
  ownsCertificationGates: false as const,
  ownsPlatformNamespace: false as const,
  ownsManifestInventories: false as const,
  ownsValidationRules: false as const,
  ownsDomainModels: false as const,
  ownsRegistryCollections: false as const,
  ownsFoundationContracts: false as const,
  ownsRuntimeFreeze: false as const,
  ownsRuntimeNormalization: false as const,
  ownsRuntimeValidation: false as const,
  ownsAi: false as const,
  ownsDkl: false as const,
  ownsExecutiveEngine: false as const,
  ownsStorage: false as const,
  ownsRouting: false as const,
  ownsSecurity: false as const,
  ownsConnectorRuntime: false as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable freeze boundaries. */
export const MessageNormalizationFreezeBoundaries = Object.freeze({
  boundariesId: "NEA-6:8/MessageNormalizationFreezeBoundaries",
  sourcePhase: "NEA-6:8" as const,
  consumes: Object.freeze([
    "NEA-6:7 Message Normalization Certification",
  ] as const),
  provides: Object.freeze(["Message Normalization Freeze"] as const),
  prohibitedSurfaces: MESSAGE_NORMALIZATION_FREEZE_PROHIBITED_SURFACES,
  prohibitedSurfaceCount:
    MESSAGE_NORMALIZATION_FREEZE_PROHIBITED_SURFACES.length,
  runtimeEnforcement: false as const,
  runtimeFreezeLogic: false as const,
  runtimeCertification: false as const,
  runtimeNormalization: false as const,
  runtimeValidation: false as const,
  implementsMessageParsing: false as const,
  implementsRouting: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  invokesDkl: false as const,
  invokesExecutiveEngine: false as const,
  duplicatesCertificationMetadata: false as const,
  duplicatesPlatformMetadata: false as const,
  reconstructsInventories: false as const,
  redefinesPriorPhases: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable freeze metadata. */
export const MessageNormalizationFreezeMetadata = Object.freeze({
  metadataId: "NEA-6:8/MessageNormalizationFreezeMetadata",
  sourcePhase: "NEA-6:8" as const,
  freezeStatus: "Freeze" as const,
  freezeVersion: "1.0.0" as const,
  freezeNamespace: "nexora.nea.message-normalization.freeze" as const,
  certifiedVersion:
    MessageNormalizationCertificationPlatform.identity.certificationVersion,
  certifiedPlatformReference:
    MessageNormalizationFreezeRegistryCatalog.certifiedPlatformReference
      .referenceId,
  certificationId: MessageNormalizationCertificationId,
  certificationOutcome:
    MessageNormalizationCertificationPlatform.metadata.certificationOutcome,
  readiness: MessageNormalizationFreezeReadinessValue,
  nextPhase: "NEA-6:9 — Message Normalization Public Index",
  lockSummary: Object.freeze({
    lockCount: MessageNormalizationFreezeLockCatalog.lockCount,
    lockedLockCount: MessageNormalizationFreezeLockCatalog.lockedLockCount,
    allLocksActive: MessageNormalizationFreezeAllLocksActive,
  }),
  compatibilitySummary: Object.freeze({
    compatibilityCount:
      MessageNormalizationFreezeCompatibilityCatalog.compatibilityCount,
    allCompatible: MessageNormalizationFreezeCompatibilityCatalog.allCompatible,
  }),
  extensionSummary: Object.freeze({
    allowedExtensionCount:
      MessageNormalizationFreezeExtensionPolicy.allowedExtensionCount,
    forbiddenExtensionCount:
      MessageNormalizationFreezeExtensionPolicy.forbiddenExtensionCount,
    additiveOnly: MessageNormalizationFreezeExtensionPolicy.additiveOnly,
  }),
  architectureSummary: Object.freeze({
    componentCount: MessageNormalizationFreezeRegistryCatalog.componentCount,
    messageIdentityCount:
      MessageNormalizationFreezeRegistryCatalog.messageIdentityCount,
    payloadCount: MessageNormalizationFreezeRegistryCatalog.payloadCount,
    canonicalExecutiveMessageCount:
      MessageNormalizationFreezeRegistryCatalog.canonicalExecutiveMessageCount,
    inventoryEntryCount:
      MessageNormalizationCertificationPlatform.platform.metadata
        .inventoryEntryCount,
    totalArchitectureCount:
      MessageNormalizationCertificationPlatform.platform.metadata
        .totalArchitectureCount,
  }),
  consumerSummary: Object.freeze({
    soleSupportedEntryPoint:
      MessageNormalizationCertificationPlatform.platform.consumer
        .soleSupportedEntryPoint,
    consumerReady:
      MessageNormalizationCertificationPlatform.platform.readiness
        .consumerReady,
    consumerAccessRule:
      MessageNormalizationCertificationPlatform.platform.boundaries
        .consumerAccessRule,
  }),
  componentCount: MessageNormalizationFreezeRegistryCatalog.componentCount,
  messageIdentityCount:
    MessageNormalizationFreezeRegistryCatalog.messageIdentityCount,
  payloadCount: MessageNormalizationFreezeRegistryCatalog.payloadCount,
  canonicalExecutiveMessageCount:
    MessageNormalizationFreezeRegistryCatalog.canonicalExecutiveMessageCount,
  allowedExtensionCount:
    MessageNormalizationFreezeExtensionPolicy.allowedExtensionCount,
  forbiddenExtensionCount:
    MessageNormalizationFreezeExtensionPolicy.forbiddenExtensionCount,
  ownershipCount: MessageNormalizationFreezeOwnership.ownsCount,
  nonOwnershipCount: MessageNormalizationFreezeOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    MessageNormalizationFreezeBoundaries.prohibitedSurfaceCount,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesCertificationMetadata: false as const,
  duplicatesPlatformMetadata: false as const,
  derivedFromCertification: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Freeze identity constants used by summary composition. */
export const MESSAGE_NORMALIZATION_FREEZE_SUMMARY_IDENTITY = Object.freeze({
  freezeId: "NEA-6:8/MessageNormalizationFreeze" as const,
  name: "Message Normalization Freeze" as const,
  version: "1.0.0" as const,
  namespace: "nexora.nea.message-normalization.freeze" as const,
  publicExportCount: 8 as const,
  sectionCount: 11 as const,
});

/**
 * Build deterministic frozen Freeze summary.
 * Derived exclusively from Certification and Freeze catalogs.
 */
export function buildMessageNormalizationFreezeSummary(): MessageNormalizationFreezeSummary {
  const identity = MESSAGE_NORMALIZATION_FREEZE_SUMMARY_IDENTITY;
  const meta = MessageNormalizationFreezeMetadata;
  const certificationSummary = getMessageNormalizationCertificationSummary();
  return Object.freeze({
    freezeId: identity.freezeId,
    version: identity.version,
    name: identity.name,
    namespace: identity.namespace,
    layer: "NEA" as const,
    phase: "NEA-6:8" as const,
    status: "Freeze" as const,
    readiness: meta.readiness,
    certificationId: certificationSummary.certificationId,
    certificationOutcome: certificationSummary.certificationOutcome,
    lockCount: meta.lockSummary.lockCount,
    lockedLockCount: meta.lockSummary.lockedLockCount,
    compatibilityCount: meta.compatibilitySummary.compatibilityCount,
    componentCount: meta.componentCount,
    messageIdentityCount: meta.messageIdentityCount,
    payloadCount: meta.payloadCount,
    canonicalExecutiveMessageCount: meta.canonicalExecutiveMessageCount,
    allowedExtensionCount: meta.allowedExtensionCount,
    forbiddenExtensionCount: meta.forbiddenExtensionCount,
    ownershipCount: meta.ownershipCount,
    nonOwnershipCount: meta.nonOwnershipCount,
    prohibitedSurfaceCount: meta.prohibitedSurfaceCount,
    publicExportCount: identity.publicExportCount,
    sectionCount: identity.sectionCount,
    nextPhase: meta.nextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
