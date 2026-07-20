/**
 * NEA-3:7 — Session & Conversation Certification Gates.
 *
 * Immutable declarative certification gates for the Session & Conversation Platform.
 * Architecture compliance only. No runtime certification.
 *
 * Ownership: owned exclusively by NEA-3:7.
 */

import {
  SessionConversationPlatform,
  SessionConversationPlatformId,
} from "./sessionConversationPlatform.ts";
import type {
  SessionConversationCertificationGate,
  SessionConversationCertificationGateId,
} from "./sessionConversationCertificationTypes.ts";

const platform = SessionConversationPlatform;
const ns = platform.namespace;
const sessionIdentities = ns.registry.collections.sessionIdentities;
const conversationIdentities = ns.registry.collections.conversationIdentities;

const gate = (
  gateId: SessionConversationCertificationGateId,
  gateName: string,
  description: string,
  outcome: "Pass" | "Fail",
  evidenceRef: string,
  order: number,
): SessionConversationCertificationGate =>
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
export const SessionConversationCertificationGates: readonly SessionConversationCertificationGate[] =
  Object.freeze([
    gate(
      "FoundationIntegrity",
      "Foundation Integrity",
      "Foundation phase is present and immutable through Platform namespace.",
      ns.foundation.identity.foundationId.length > 0 &&
        ns.foundation.immutable === true
        ? "Pass"
        : "Fail",
      `${SessionConversationPlatformId}/namespace/foundation`,
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
      `${SessionConversationPlatformId}/namespace/registry`,
      2,
    ),
    gate(
      "ModelIntegrity",
      "Model Integrity",
      "Model phase is present and immutable through Platform namespace.",
      ns.model.identity.modelId.length > 0 && ns.model.immutable === true
        ? "Pass"
        : "Fail",
      `${SessionConversationPlatformId}/namespace/model`,
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
      `${SessionConversationPlatformId}/namespace/validation`,
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
      `${SessionConversationPlatformId}/namespace/manifest`,
      5,
    ),
    gate(
      "PlatformIntegrity",
      "Platform Integrity",
      "Platform identity, status, and immutability are intact.",
      platform.identity.platformId === SessionConversationPlatformId &&
        platform.immutable === true &&
        platform.status === "Platform"
        ? "Pass"
        : "Fail",
      `${SessionConversationPlatformId}/identity`,
      6,
    ),
    gate(
      "SessionIdentityIntegrity",
      "Session Identity Integrity",
      "Session identity registry is present, unique, and metadata-only.",
      ns.registry.collections.sessionIdentityCount > 0 &&
        sessionIdentities.length ===
          ns.registry.collections.sessionIdentityCount &&
        sessionIdentities.every(
          (item) => item.managesRuntimeSession === false,
        ) &&
        new Set(sessionIdentities.map((item) => item.sessionId)).size ===
          sessionIdentities.length
        ? "Pass"
        : "Fail",
      `${SessionConversationPlatformId}/namespace/registry/collections/sessionIdentities`,
      7,
    ),
    gate(
      "ConversationIdentityIntegrity",
      "Conversation Identity Integrity",
      "Conversation identity registry is present, unique, and metadata-only.",
      ns.registry.collections.conversationIdentityCount > 0 &&
        conversationIdentities.length ===
          ns.registry.collections.conversationIdentityCount &&
        conversationIdentities.every(
          (item) => item.managesRuntimeConversation === false,
        ) &&
        new Set(
          conversationIdentities.map((item) => item.conversationId),
        ).size === conversationIdentities.length
        ? "Pass"
        : "Fail",
      `${SessionConversationPlatformId}/namespace/registry/collections/conversationIdentities`,
      8,
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
      `${SessionConversationPlatformId}/dependency`,
      9,
    ),
    gate(
      "OwnershipIntegrity",
      "Ownership Integrity",
      "Platform ownership is unique and does not claim upstream ownership.",
      platform.ownership.ownsFoundationContracts === false &&
        platform.ownership.ownsRegistryCollections === false &&
        platform.ownership.ownsDomainModels === false &&
        platform.ownership.ownsValidationRules === false &&
        platform.ownership.ownsManifestInventory === false
        ? "Pass"
        : "Fail",
      `${SessionConversationPlatformId}/ownership`,
      10,
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
      `${SessionConversationPlatformId}/namespace`,
      11,
    ),
    gate(
      "PublicExportIntegrity",
      "Public Export Integrity",
      "Platform exposes exactly eight public exports.",
      platform.apiRegistry.length === 8 ? "Pass" : "Fail",
      `${SessionConversationPlatformId}/apiRegistry`,
      12,
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
      `${SessionConversationPlatformId}/metadata`,
      13,
    ),
    gate(
      "MetadataIntegrity",
      "Metadata Integrity",
      "Platform metadata preserves architecture version and composition mode.",
      platform.metadata.architectureVersion === "NEA-3.0.0" &&
        platform.metadata.compatibility.compositionMode ===
          "CanonicalReferenceOnly"
        ? "Pass"
        : "Fail",
      `${SessionConversationPlatformId}/metadata/compatibility`,
      14,
    ),
    gate(
      "ImmutabilityIntegrity",
      "Immutability Integrity",
      "Platform and namespace surfaces are immutable.",
      platform.immutable === true &&
        ns.immutable === true &&
        platform.metadataOnly === true
        ? "Pass"
        : "Fail",
      `${SessionConversationPlatformId}/immutability`,
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
      `${SessionConversationPlatformId}/namespace/composition`,
      16,
    ),
    gate(
      "ConsumerReadiness",
      "Consumer Readiness",
      "Consumer platform surface is declared and sole entry point is fixed.",
      platform.consumer.soleSupportedEntryPoint ===
        "sessionConversationPlatform.ts" &&
        platform.boundaries.consumerAccessRule.includes(
          "SessionConversationPlatform",
        ) &&
        platform.readiness.consumerReady === true
        ? "Pass"
        : "Fail",
      `${SessionConversationPlatformId}/consumer`,
      17,
    ),
  ]);

export const SessionConversationCertificationPassedGateCount =
  SessionConversationCertificationGates.filter(
    (item) => item.outcome === "Pass",
  ).length;

export const SessionConversationCertificationFailedGateCount =
  SessionConversationCertificationGates.filter(
    (item) => item.outcome === "Fail",
  ).length;

export const SessionConversationCertificationAllGatesPass =
  SessionConversationCertificationFailedGateCount === 0;

/** Canonical immutable certification gate catalog. */
export const SessionConversationCertificationGateCatalog = Object.freeze({
  catalogId: "NEA-3:7/CertificationGateCatalog",
  sourcePhase: "NEA-3:7" as const,
  platformId: SessionConversationPlatformId,
  gates: SessionConversationCertificationGates,
  gateCount: SessionConversationCertificationGates.length,
  passedGateCount: SessionConversationCertificationPassedGateCount,
  failedGateCount: SessionConversationCertificationFailedGateCount,
  allGatesPass: SessionConversationCertificationAllGatesPass,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
