/**
 * NEA-6:7 — Message Normalization Certification Gates.
 *
 * Immutable declarative certification gates for the Message Normalization Platform.
 * Architecture compliance only. No runtime certification.
 *
 * Ownership: owned exclusively by NEA-6:7.
 */

import {
  MessageNormalizationPlatform,
  MessageNormalizationPlatformId,
} from "./messageNormalizationPlatform.ts";
import type {
  MessageNormalizationCertificationGate,
  MessageNormalizationCertificationGateId,
} from "./messageNormalizationCertificationTypes.ts";

const platform = MessageNormalizationPlatform;
const ns = platform.namespace;
const messageIdentities = ns.registry.collections.messageIdentities;
const payloads = ns.registry.collections.payloads;
const executiveContracts =
  ns.foundation.contracts.canonicalExecutiveMessageContracts;

const gate = (
  gateId: MessageNormalizationCertificationGateId,
  gateName: string,
  description: string,
  outcome: "Pass" | "Fail",
  evidenceRef: string,
  order: number,
): MessageNormalizationCertificationGate =>
  Object.freeze({
    gateId,
    gateName,
    description,
    outcome,
    evidenceRef,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly seventeen certification gates.
 * Outcomes are derived from Platform canonical metadata references.
 */
export const MessageNormalizationCertificationGates: readonly MessageNormalizationCertificationGate[] =
  Object.freeze([
    gate(
      "FoundationIntegrity",
      "Foundation Integrity",
      "Foundation phase is present and immutable through Platform namespace.",
      ns.foundation.identity.foundationId.length > 0 &&
        ns.foundation.immutable === true
        ? "Pass"
        : "Fail",
      `${MessageNormalizationPlatformId}/namespace/foundation`,
      1,
    ),
    gate(
      "RegistryIntegrity",
      "Registry Integrity",
      "Registry phase is present and immutable through Platform namespace.",
      ns.registry.identity.registryId.length > 0 &&
        ns.registry.immutable === true
        ? "Pass"
        : "Fail",
      `${MessageNormalizationPlatformId}/namespace/registry`,
      2,
    ),
    gate(
      "ModelIntegrity",
      "Model Integrity",
      "Model phase is present and immutable through Platform namespace.",
      ns.model.identity.modelId.length > 0 && ns.model.immutable === true
        ? "Pass"
        : "Fail",
      `${MessageNormalizationPlatformId}/namespace/model`,
      3,
    ),
    gate(
      "ValidationIntegrity",
      "Validation Integrity",
      "Validation phase is present and immutable through Platform namespace.",
      ns.validation.identity.validationId.length > 0 &&
        ns.validation.immutable === true
        ? "Pass"
        : "Fail",
      `${MessageNormalizationPlatformId}/namespace/validation`,
      4,
    ),
    gate(
      "ManifestIntegrity",
      "Manifest Integrity",
      "Manifest phase is present and immutable through Platform namespace.",
      ns.manifest.identity.manifestId.length > 0 &&
        ns.manifest.immutable === true
        ? "Pass"
        : "Fail",
      `${MessageNormalizationPlatformId}/namespace/manifest`,
      5,
    ),
    gate(
      "PlatformIntegrity",
      "Platform Integrity",
      "Platform identity, status, and immutability are intact.",
      platform.identity.platformId === MessageNormalizationPlatformId &&
        platform.immutable === true &&
        platform.status === "Platform"
        ? "Pass"
        : "Fail",
      `${MessageNormalizationPlatformId}/identity`,
      6,
    ),
    gate(
      "ExecutiveMessageIntegrity",
      "Executive Message Integrity",
      "Canonical Executive Message contract is present through Foundation.",
      ns.foundation.contracts.canonicalExecutiveMessageCount === 1 &&
        executiveContracts.length === 1 &&
        executiveContracts[0]?.contractId ===
          "NEA-6:1/Contract/ExecutiveMessage" &&
        executiveContracts[0]?.isCanonicalExecutiveMessage === true
        ? "Pass"
        : "Fail",
      `${MessageNormalizationPlatformId}/namespace/foundation/contracts/executiveMessage`,
      7,
    ),
    gate(
      "MessageIdentityRegistryIntegrity",
      "Message Identity Registry Integrity",
      "Message identity registry is present, unique, and metadata-only.",
      ns.registry.collections.messageIdentityCount === 8 &&
        messageIdentities.length ===
          ns.registry.collections.messageIdentityCount &&
        messageIdentities.every(
          (item) =>
            item.executesRuntime === false &&
            item.normalizesAtRuntime === false,
        ) &&
        new Set(messageIdentities.map((item) => item.messageId)).size ===
          messageIdentities.length
        ? "Pass"
        : "Fail",
      `${MessageNormalizationPlatformId}/namespace/registry/collections/messageIdentities`,
      8,
    ),
    gate(
      "PayloadRegistryIntegrity",
      "Payload Registry Integrity",
      "Payload registry is present, unique, and metadata-only.",
      ns.registry.collections.payloadCount > 0 &&
        payloads.length === ns.registry.collections.payloadCount &&
        payloads.every((item) => item.executesRuntime === false) &&
        new Set(payloads.map((item) => item.id)).size === payloads.length
        ? "Pass"
        : "Fail",
      `${MessageNormalizationPlatformId}/namespace/registry/collections/payloads`,
      9,
    ),
    gate(
      "CanonicalReferenceIntegrity",
      "Canonical Reference Integrity",
      "Platform dependency and composition use canonical references only.",
      platform.dependency.manifestPublicSurfaceOnly === true &&
        ns.reconstructsUpstream === false &&
        ns.duplicatesArchitecture === false
        ? "Pass"
        : "Fail",
      `${MessageNormalizationPlatformId}/dependency`,
      10,
    ),
    gate(
      "OwnershipIntegrity",
      "Ownership Integrity",
      "Platform ownership is unique and does not claim upstream ownership.",
      platform.ownership.ownsFoundationContracts === false &&
        platform.ownership.ownsRegistryCollections === false &&
        platform.ownership.ownsDomainModels === false &&
        platform.ownership.ownsValidationRules === false &&
        platform.ownership.ownsManifestInventories === false
        ? "Pass"
        : "Fail",
      `${MessageNormalizationPlatformId}/ownership`,
      11,
    ),
    gate(
      "NamespaceIntegrity",
      "Namespace Integrity",
      "Platform namespace includes all six required sections by reference.",
      ns.sectionCount === 6 &&
        ns.sectionOrder.length === 6 &&
        ns.composedPhaseCount === 6
        ? "Pass"
        : "Fail",
      `${MessageNormalizationPlatformId}/namespace`,
      12,
    ),
    gate(
      "PublicExportIntegrity",
      "Public Export Integrity",
      "Platform exposes exactly eight public exports.",
      platform.apiRegistry.length === 8 ? "Pass" : "Fail",
      `${MessageNormalizationPlatformId}/apiRegistry`,
      13,
    ),
    gate(
      "InventoryIntegrity",
      "Inventory Integrity",
      "Inventory counts are derived and not hardcoded.",
      platform.metadata.countsHardcoded === false &&
        platform.metadata.countsReconstructed === false &&
        platform.metadata.inventoryEntryCount > 0
        ? "Pass"
        : "Fail",
      `${MessageNormalizationPlatformId}/metadata`,
      14,
    ),
    gate(
      "MetadataIntegrity",
      "Metadata Integrity",
      "Platform metadata preserves architecture version and composition mode.",
      platform.metadata.architectureVersion === "NEA-6.0.0" &&
        platform.metadata.compositionMode === "CanonicalReferenceOnly" &&
        platform.metadata.compatibility.compositionMode ===
          "CanonicalReferenceOnly"
        ? "Pass"
        : "Fail",
      `${MessageNormalizationPlatformId}/metadata/compatibility`,
      15,
    ),
    gate(
      "ArchitectureCompleteness",
      "Architecture Completeness",
      "Foundation through Platform chain is complete.",
      ns.composition.length === 6 &&
        platform.metadata.composedPhaseCount === 6
        ? "Pass"
        : "Fail",
      `${MessageNormalizationPlatformId}/namespace/composition`,
      16,
    ),
    gate(
      "ConsumerReadiness",
      "Consumer Readiness",
      "Consumer platform surface is declared and sole entry point is fixed.",
      platform.consumer.soleSupportedEntryPoint ===
        "messageNormalizationPlatform.ts" &&
        platform.boundaries.consumerAccessRule.includes(
          "MessageNormalizationPlatform",
        ) &&
        platform.readiness.consumerReady === true
        ? "Pass"
        : "Fail",
      `${MessageNormalizationPlatformId}/consumer`,
      17,
    ),
  ]);

export const MessageNormalizationCertificationPassedGateCount =
  MessageNormalizationCertificationGates.filter(
    (item) => item.outcome === "Pass",
  ).length;

export const MessageNormalizationCertificationFailedGateCount =
  MessageNormalizationCertificationGates.filter(
    (item) => item.outcome === "Fail",
  ).length;

export const MessageNormalizationCertificationAllGatesPass =
  MessageNormalizationCertificationFailedGateCount === 0;

/** Canonical immutable certification gate catalog. */
export const MessageNormalizationCertificationGateCatalog = Object.freeze({
  catalogId: "NEA-6:7/CertificationGateCatalog",
  sourcePhase: "NEA-6:7" as const,
  platformId: MessageNormalizationPlatformId,
  gates: MessageNormalizationCertificationGates,
  gateCount: MessageNormalizationCertificationGates.length,
  passedGateCount: MessageNormalizationCertificationPassedGateCount,
  failedGateCount: MessageNormalizationCertificationFailedGateCount,
  allGatesPass: MessageNormalizationCertificationAllGatesPass,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
