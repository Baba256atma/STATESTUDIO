/**
 * NEA-2:7 — Channel Connectors Certification Gates.
 *
 * Immutable declarative certification gates for the Channel Connectors Platform.
 * Architecture compliance only. No runtime certification.
 *
 * Ownership: owned exclusively by NEA-2:7.
 */

import {
  ChannelConnectorPlatform,
  ChannelConnectorPlatformId,
} from "./channelConnectorPlatform.ts";
import type {
  ChannelConnectorCertificationGate,
  ChannelConnectorCertificationGateId,
} from "./channelConnectorCertificationTypes.ts";

const platform = ChannelConnectorPlatform;
const ns = platform.namespace;
const identities = ns.registry.collections.identities;

const gate = (
  gateId: ChannelConnectorCertificationGateId,
  gateName: string,
  description: string,
  outcome: "Pass" | "Fail",
  evidenceRef: string,
  order: number,
): ChannelConnectorCertificationGate =>
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
 * Exactly sixteen certification gates.
 * Outcomes are derived from Platform canonical metadata references.
 */
export const ChannelConnectorCertificationGates: readonly ChannelConnectorCertificationGate[] =
  Object.freeze([
    gate(
      "FoundationIntegrity",
      "Foundation Integrity",
      "Foundation phase is present and immutable through Platform namespace.",
      ns.foundation.identity.foundationId.length > 0 &&
        ns.foundation.immutable === true
        ? "Pass"
        : "Fail",
      `${ChannelConnectorPlatformId}/namespace/foundation`,
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
      `${ChannelConnectorPlatformId}/namespace/registry`,
      2,
    ),
    gate(
      "ModelIntegrity",
      "Model Integrity",
      "Model phase is present and immutable through Platform namespace.",
      ns.model.identity.modelId.length > 0 && ns.model.immutable === true
        ? "Pass"
        : "Fail",
      `${ChannelConnectorPlatformId}/namespace/model`,
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
      `${ChannelConnectorPlatformId}/namespace/validation`,
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
      `${ChannelConnectorPlatformId}/namespace/manifest`,
      5,
    ),
    gate(
      "PlatformIntegrity",
      "Platform Integrity",
      "Platform identity, status, and immutability are intact.",
      platform.identity.platformId === ChannelConnectorPlatformId &&
        platform.immutable === true &&
        platform.status === "Platform"
        ? "Pass"
        : "Fail",
      `${ChannelConnectorPlatformId}/identity`,
      6,
    ),
    gate(
      "ConnectorIdentityIntegrity",
      "Connector Identity Integrity",
      "Connector identity registry is present, unique, and metadata-only.",
      ns.registry.collections.identityCount > 0 &&
        identities.length === ns.registry.collections.identityCount &&
        identities.every((item) => item.implementsConnector === false) &&
        identities.every((item) => item.executesRuntime === false) &&
        new Set(identities.map((item) => item.connectorId)).size ===
          identities.length
        ? "Pass"
        : "Fail",
      `${ChannelConnectorPlatformId}/namespace/registry/collections/identities`,
      7,
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
      `${ChannelConnectorPlatformId}/dependency`,
      8,
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
      `${ChannelConnectorPlatformId}/ownership`,
      9,
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
      `${ChannelConnectorPlatformId}/namespace`,
      10,
    ),
    gate(
      "PublicExportIntegrity",
      "Public Export Integrity",
      "Platform exposes exactly eight public exports.",
      platform.apiRegistry.length === 8 ? "Pass" : "Fail",
      `${ChannelConnectorPlatformId}/apiRegistry`,
      11,
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
      `${ChannelConnectorPlatformId}/metadata`,
      12,
    ),
    gate(
      "MetadataIntegrity",
      "Metadata Integrity",
      "Platform metadata preserves architecture version and composition mode.",
      platform.metadata.architectureVersion === "NEA-2.0.0" &&
        platform.metadata.compatibility.compositionMode ===
          "CanonicalReferenceOnly"
        ? "Pass"
        : "Fail",
      `${ChannelConnectorPlatformId}/metadata/compatibility`,
      13,
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
      `${ChannelConnectorPlatformId}/immutability`,
      14,
    ),
    gate(
      "ArchitectureCompleteness",
      "Architecture Completeness",
      "Foundation through Platform chain is complete.",
      ns.composition.length === 6 &&
        platform.metadata.composedPhaseCount === 6
        ? "Pass"
        : "Fail",
      `${ChannelConnectorPlatformId}/namespace/composition`,
      15,
    ),
    gate(
      "ConsumerReadiness",
      "Consumer Readiness",
      "Consumer platform surface is declared and sole entry point is fixed.",
      platform.consumer.soleSupportedEntryPoint ===
        "channelConnectorPlatform.ts" &&
        platform.boundaries.consumerAccessRule.includes(
          "ChannelConnectorPlatform",
        ) &&
        platform.readiness.consumerReady === true
        ? "Pass"
        : "Fail",
      `${ChannelConnectorPlatformId}/consumer`,
      16,
    ),
  ]);

export const ChannelConnectorCertificationPassedGateCount =
  ChannelConnectorCertificationGates.filter(
    (item) => item.outcome === "Pass",
  ).length;

export const ChannelConnectorCertificationFailedGateCount =
  ChannelConnectorCertificationGates.filter(
    (item) => item.outcome === "Fail",
  ).length;

export const ChannelConnectorCertificationAllGatesPass =
  ChannelConnectorCertificationFailedGateCount === 0;

/** Canonical immutable certification gate catalog. */
export const ChannelConnectorCertificationGateCatalog = Object.freeze({
  catalogId: "NEA-2:7/CertificationGateCatalog",
  sourcePhase: "NEA-2:7" as const,
  platformId: ChannelConnectorPlatformId,
  gates: ChannelConnectorCertificationGates,
  gateCount: ChannelConnectorCertificationGates.length,
  passedGateCount: ChannelConnectorCertificationPassedGateCount,
  failedGateCount: ChannelConnectorCertificationFailedGateCount,
  allGatesPass: ChannelConnectorCertificationAllGatesPass,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
