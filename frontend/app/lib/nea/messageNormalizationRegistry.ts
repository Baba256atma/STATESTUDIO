/**
 * NEA-6:2 — Message Normalization Registry.
 *
 * Canonical immutable registry for Message Normalization vocabularies and lookups.
 * Consumes only NEA-6:1 Message Normalization Foundation public surface.
 * Metadata-only. Runtime-free. Ready for Model.
 *
 * Ownership: owned exclusively by NEA-6:2.
 *
 * Public exports (exactly 8):
 *   MessageNormalizationRegistryId
 *   MessageNormalizationRegistryVersion
 *   MessageNormalizationRegistryName
 *   MessageNormalizationRegistryNamespace
 *   MessageNormalizationRegistryStatus
 *   MessageNormalizationRegistryReadiness
 *   MessageNormalizationRegistryPlatform
 *   getMessageNormalizationRegistrySummary()
 */

import {
  MessageNormalizationFoundationId,
  MessageNormalizationFoundationPlatform,
  MessageNormalizationFoundationVersion,
} from "./messageNormalizationFoundation.ts";
import { MessageNormalizationCapabilityRegistryCatalog } from "./messageNormalizationRegistryCapabilities.ts";
import { MessageNormalizationRegistryCollections } from "./messageNormalizationRegistryCollections.ts";
import { MessageNormalizationRegistryMetadata } from "./messageNormalizationRegistryMetadata.ts";
import {
  MessageNormalizationRegistryBoundaries,
  MessageNormalizationRegistryOwnership,
} from "./messageNormalizationRegistryOwnership.ts";
import { MessageNormalizationRegistryPolicyCatalog } from "./messageNormalizationRegistryPolicies.ts";
import type {
  MessageNormalizationRegistryIdentity,
  MessageNormalizationRegistrySummary,
} from "./messageNormalizationRegistryTypes.ts";

/** Canonical registry identity. */
export const MessageNormalizationRegistryId =
  "NEA-6:2/MessageNormalizationRegistry" as const;

/** Human-readable registry name. */
export const MessageNormalizationRegistryName =
  "Message Normalization Registry" as const;

/** Semantic version. */
export const MessageNormalizationRegistryVersion = "1.0.0" as const;

/** Canonical namespace. */
export const MessageNormalizationRegistryNamespace =
  "nexora.nea.message-normalization.registry" as const;

/** Registry status. */
export const MessageNormalizationRegistryStatus = "Registry" as const;

/** Immediate next-phase readiness. */
export const MessageNormalizationRegistryReadiness = "ReadyForModel" as const;

const identity: MessageNormalizationRegistryIdentity = Object.freeze({
  registryId: MessageNormalizationRegistryId,
  registryName: MessageNormalizationRegistryName,
  registryVersion: MessageNormalizationRegistryVersion,
  registryNamespace: MessageNormalizationRegistryNamespace,
  layer: "NEA" as const,
  phase: "NEA-6:2" as const,
  stage: "Registry" as const,
  sourcePhase: "NEA-6:2" as const,
  owner: "NEA-6 Message Normalization",
  status: MessageNormalizationRegistryStatus,
  readiness: MessageNormalizationRegistryReadiness,
  foundationId: MessageNormalizationFoundationId,
  foundationVersion: MessageNormalizationFoundationVersion,
  description:
    "Canonical immutable registry of message identities, payloads, metadata fields, mappings, normalization policies, statuses, contracts, contexts, attachments, capabilities, and lifecycle.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-6:2/Dependency/NEA61Foundation",
  directPreviousPhaseModule: "messageNormalizationFoundation.ts" as const,
  foundationOnly: true as const,
  foundationId: MessageNormalizationFoundationId,
  foundationVersion: MessageNormalizationFoundationVersion,
  foundationPublicSurfaceOnly: true as const,
  publicIndexDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  reconstructsFoundation: false as const,
  duplicatesFoundationValues: false as const,
  canonicalPath:
    "NEA-6:2 → NEA-6:1 MessageNormalizationFoundationPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "collections",
  "capabilities",
  "policies",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
] as const);

const registryApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `NEA-6:2/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-6:2" as const,
    section: "Registry" as const,
    kind,
    version: MessageNormalizationRegistryVersion,
    status: MessageNormalizationRegistryStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "messageNormalizationRegistry.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const MessageNormalizationRegistryApiRegistry = Object.freeze([
  registryApi("MessageNormalizationRegistryId", "IdentityConstant"),
  registryApi("MessageNormalizationRegistryVersion", "IdentityConstant"),
  registryApi("MessageNormalizationRegistryName", "IdentityConstant"),
  registryApi("MessageNormalizationRegistryNamespace", "IdentityConstant"),
  registryApi("MessageNormalizationRegistryStatus", "MetadataConstant"),
  registryApi("MessageNormalizationRegistryReadiness", "MetadataConstant"),
  registryApi("MessageNormalizationRegistryPlatform", "Aggregate"),
  registryApi("getMessageNormalizationRegistrySummary", "Helper"),
]);

/**
 * Canonical immutable Message Normalization Registry platform.
 * Nine ordered sections. Metadata only.
 */
export const MessageNormalizationRegistryPlatform = Object.freeze({
  identity,
  dependency,
  collections: MessageNormalizationRegistryCollections,
  capabilities: MessageNormalizationCapabilityRegistryCatalog,
  policies: MessageNormalizationRegistryPolicyCatalog,
  metadata: MessageNormalizationRegistryMetadata,
  ownership: MessageNormalizationRegistryOwnership,
  boundaries: MessageNormalizationRegistryBoundaries,
  readiness: Object.freeze({
    readinessId: "NEA-6:2/RegistryReadiness",
    readiness: MessageNormalizationRegistryReadiness,
    nextPhase: MessageNormalizationRegistryMetadata.nextPhase,
    claimsReadyForModel: true as const,
    claimsReadyForRuntime: false as const,
    claimsRuntimeNormalizationImplemented: false as const,
    claimsPayloadParsingImplemented: false as const,
    claimsAiImplemented: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: MessageNormalizationRegistryApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: MessageNormalizationRegistryStatus,
  nextPhase: MessageNormalizationRegistryMetadata.nextPhase,
  downstreamReadiness: MessageNormalizationRegistryReadiness,
  foundationPlatform: MessageNormalizationFoundationPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  implementsRuntimeNormalization: false as const,
  parsesPayloads: false as const,
  interpretsBusinessMeaning: false as const,
  modifiesUserIntent: false as const,
  implementsRouting: false as const,
  implementsHttp: false as const,
  implementsRest: false as const,
  implementsWebSockets: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  invokesDkl: false as const,
  invokesExecutiveEngine: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Message Normalization Registry summary.
 * Counts are derived exclusively from canonical registry collections.
 */
export function getMessageNormalizationRegistrySummary(): MessageNormalizationRegistrySummary {
  const meta = MessageNormalizationRegistryMetadata;
  return Object.freeze({
    registryId: MessageNormalizationRegistryId,
    version: MessageNormalizationRegistryVersion,
    name: MessageNormalizationRegistryName,
    namespace: MessageNormalizationRegistryNamespace,
    layer: "NEA" as const,
    phase: "NEA-6:2" as const,
    status: MessageNormalizationRegistryStatus,
    readiness: MessageNormalizationRegistryReadiness,
    foundationId: MessageNormalizationFoundationId,
    messageIdentityCount: meta.messageIdentityCount,
    payloadCount: meta.payloadCount,
    metadataFieldCount: meta.metadataFieldCount,
    mappingCount: meta.mappingCount,
    normalizationPolicyCount: meta.normalizationPolicyCount,
    statusCount: meta.statusCount,
    contractCount: meta.contractCount,
    contextCount: meta.contextCount,
    attachmentKindCount: meta.attachmentKindCount,
    capabilityCount: meta.capabilityCount,
    lifecycleEntryCount: meta.lifecycleEntryCount,
    registryPolicyCount: meta.registryPolicyCount,
    totalRegistryEntryCount: meta.totalEntryCount,
    publicExportCount: 8 as const,
    sectionCount: PLATFORM_SECTIONS.length,
    nextPhase: meta.nextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
