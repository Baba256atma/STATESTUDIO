/**
 * NEA-1:7 — Executive Gateway Certification Gates.
 *
 * Immutable declarative certification gates for the Executive Gateway Platform.
 * Architecture compliance only. No runtime certification.
 *
 * Ownership: owned exclusively by NEA-1:7.
 */

import {
  ExecutiveGatewayPlatform,
  ExecutiveGatewayPlatformId,
} from "./executiveGatewayPlatform.ts";
import type {
  ExecutiveGatewayCertificationGate,
  ExecutiveGatewayCertificationGateId,
} from "./executiveGatewayCertificationTypes.ts";

const platform = ExecutiveGatewayPlatform;
const ns = platform.namespace;

const gate = (
  gateId: ExecutiveGatewayCertificationGateId,
  gateName: string,
  description: string,
  outcome: "Pass" | "Fail",
  evidenceRef: string,
  order: number,
): ExecutiveGatewayCertificationGate =>
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
export const ExecutiveGatewayCertificationGates: readonly ExecutiveGatewayCertificationGate[] =
  Object.freeze([
    gate(
      "FoundationIntegrity",
      "Foundation Integrity",
      "Foundation phase is present and immutable through Platform namespace.",
      ns.foundation.identity.foundationId.length > 0 &&
        ns.foundation.immutable === true
        ? "Pass"
        : "Fail",
      `${ExecutiveGatewayPlatformId}/namespace/foundation`,
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
      `${ExecutiveGatewayPlatformId}/namespace/registry`,
      2,
    ),
    gate(
      "ModelIntegrity",
      "Model Integrity",
      "Model phase is present and immutable through Platform namespace.",
      ns.model.identity.modelId.length > 0 && ns.model.immutable === true
        ? "Pass"
        : "Fail",
      `${ExecutiveGatewayPlatformId}/namespace/model`,
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
      `${ExecutiveGatewayPlatformId}/namespace/validation`,
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
      `${ExecutiveGatewayPlatformId}/namespace/manifest`,
      5,
    ),
    gate(
      "PlatformIntegrity",
      "Platform Integrity",
      "Platform identity, status, and immutability are intact.",
      platform.identity.platformId === ExecutiveGatewayPlatformId &&
        platform.immutable === true &&
        platform.status === "Platform"
        ? "Pass"
        : "Fail",
      `${ExecutiveGatewayPlatformId}/identity`,
      6,
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
      `${ExecutiveGatewayPlatformId}/dependency`,
      7,
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
      `${ExecutiveGatewayPlatformId}/ownership`,
      8,
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
      `${ExecutiveGatewayPlatformId}/namespace`,
      9,
    ),
    gate(
      "PublicExportIntegrity",
      "Public Export Integrity",
      "Platform exposes exactly eight public exports.",
      platform.apiRegistry.length === 8
        ? "Pass"
        : "Fail",
      `${ExecutiveGatewayPlatformId}/apiRegistry`,
      10,
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
      `${ExecutiveGatewayPlatformId}/metadata`,
      11,
    ),
    gate(
      "MetadataIntegrity",
      "Metadata Integrity",
      "Platform metadata preserves architecture version and composition mode.",
      platform.metadata.architectureVersion === "NEA-1.0.0" &&
        platform.metadata.compatibility.compositionMode ===
          "CanonicalReferenceOnly"
        ? "Pass"
        : "Fail",
      `${ExecutiveGatewayPlatformId}/metadata/compatibility`,
      12,
    ),
    gate(
      "ReadinessIntegrity",
      "Readiness Integrity",
      "Platform readiness is ReadyForCertification and consumer-ready.",
      platform.readiness.readiness === "ReadyForCertification" &&
        platform.readiness.consumerReady === true
        ? "Pass"
        : "Fail",
      `${ExecutiveGatewayPlatformId}/readiness`,
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
      `${ExecutiveGatewayPlatformId}/immutability`,
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
      `${ExecutiveGatewayPlatformId}/namespace/composition`,
      15,
    ),
    gate(
      "ConsumerReadiness",
      "Consumer Readiness",
      "Consumer platform surface is declared and sole entry point is fixed.",
      platform.consumer.soleSupportedEntryPoint ===
        "executiveGatewayPlatform.ts" &&
        platform.boundaries.consumerAccessRule.includes(
          "ExecutiveGatewayPlatform",
        )
        ? "Pass"
        : "Fail",
      `${ExecutiveGatewayPlatformId}/consumer`,
      16,
    ),
  ]);

export const ExecutiveGatewayCertificationPassedGateCount =
  ExecutiveGatewayCertificationGates.filter(
    (item) => item.outcome === "Pass",
  ).length;

export const ExecutiveGatewayCertificationFailedGateCount =
  ExecutiveGatewayCertificationGates.filter(
    (item) => item.outcome === "Fail",
  ).length;

export const ExecutiveGatewayCertificationAllGatesPass =
  ExecutiveGatewayCertificationFailedGateCount === 0;

/** Canonical immutable certification gate catalog. */
export const ExecutiveGatewayCertificationGateCatalog = Object.freeze({
  catalogId: "NEA-1:7/CertificationGateCatalog",
  sourcePhase: "NEA-1:7" as const,
  platformId: ExecutiveGatewayPlatformId,
  gates: ExecutiveGatewayCertificationGates,
  gateCount: ExecutiveGatewayCertificationGates.length,
  passedGateCount: ExecutiveGatewayCertificationPassedGateCount,
  failedGateCount: ExecutiveGatewayCertificationFailedGateCount,
  allGatesPass: ExecutiveGatewayCertificationAllGatesPass,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
