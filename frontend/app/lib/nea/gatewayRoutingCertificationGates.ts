/**
 * NEA-5:7 — Gateway Routing Certification Gates.
 *
 * Immutable declarative certification gates for the Gateway Routing Platform.
 * Architecture compliance only. No runtime certification.
 *
 * Ownership: owned exclusively by NEA-5:7.
 */

import {
  GatewayRoutingPlatform,
  GatewayRoutingPlatformId,
} from "./gatewayRoutingPlatform.ts";
import type {
  GatewayRoutingCertificationGate,
  GatewayRoutingCertificationGateId,
} from "./gatewayRoutingCertificationTypes.ts";

const platform = GatewayRoutingPlatform;
const ns = platform.namespace;
const routeIdentities = ns.registry.collections.routeIdentities;
const domainModels = ns.model.domainModels.models;

const gate = (
  gateId: GatewayRoutingCertificationGateId,
  gateName: string,
  description: string,
  outcome: "Pass" | "Fail",
  evidenceRef: string,
  order: number,
): GatewayRoutingCertificationGate =>
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
export const GatewayRoutingCertificationGates: readonly GatewayRoutingCertificationGate[] =
  Object.freeze([
    gate(
      "FoundationIntegrity",
      "Foundation Integrity",
      "Foundation phase is present and immutable through Platform namespace.",
      ns.foundation.identity.foundationId.length > 0 &&
        ns.foundation.immutable === true
        ? "Pass"
        : "Fail",
      `${GatewayRoutingPlatformId}/namespace/foundation`,
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
      `${GatewayRoutingPlatformId}/namespace/registry`,
      2,
    ),
    gate(
      "ModelIntegrity",
      "Model Integrity",
      "Model phase is present and immutable through Platform namespace.",
      ns.model.identity.modelId.length > 0 && ns.model.immutable === true
        ? "Pass"
        : "Fail",
      `${GatewayRoutingPlatformId}/namespace/model`,
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
      `${GatewayRoutingPlatformId}/namespace/validation`,
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
      `${GatewayRoutingPlatformId}/namespace/manifest`,
      5,
    ),
    gate(
      "PlatformIntegrity",
      "Platform Integrity",
      "Platform identity, status, and immutability are intact.",
      platform.identity.platformId === GatewayRoutingPlatformId &&
        platform.immutable === true &&
        platform.status === "Platform"
        ? "Pass"
        : "Fail",
      `${GatewayRoutingPlatformId}/identity`,
      6,
    ),
    gate(
      "RouteIdentityIntegrity",
      "Route Identity Integrity",
      "Route identity registry is present, unique, and metadata-only.",
      ns.registry.collections.routeIdentityCount > 0 &&
        routeIdentities.length ===
          ns.registry.collections.routeIdentityCount &&
        routeIdentities.every(
          (item) =>
            item.executesRuntime === false && item.routesAtRuntime === false,
        ) &&
        new Set(routeIdentities.map((item) => item.routeId)).size ===
          routeIdentities.length
        ? "Pass"
        : "Fail",
      `${GatewayRoutingPlatformId}/namespace/registry/collections/routeIdentities`,
      7,
    ),
    gate(
      "RouteDefinitionIntegrity",
      "Route Definition Integrity",
      "Route Definition domain model is declared and does not execute runtime.",
      ns.model.domainModels.modelCount > 0 &&
        domainModels.some((item) => item.modelKind === "RouteDefinition") &&
        domainModels.every((item) => item.executesRuntime === false)
        ? "Pass"
        : "Fail",
      `${GatewayRoutingPlatformId}/namespace/model/domainModels`,
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
      `${GatewayRoutingPlatformId}/dependency`,
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
      `${GatewayRoutingPlatformId}/ownership`,
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
      `${GatewayRoutingPlatformId}/namespace`,
      11,
    ),
    gate(
      "PublicExportIntegrity",
      "Public Export Integrity",
      "Platform exposes exactly eight public exports.",
      platform.apiRegistry.length === 8 ? "Pass" : "Fail",
      `${GatewayRoutingPlatformId}/apiRegistry`,
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
      `${GatewayRoutingPlatformId}/metadata`,
      13,
    ),
    gate(
      "MetadataIntegrity",
      "Metadata Integrity",
      "Platform metadata preserves architecture version and composition mode.",
      platform.metadata.architectureVersion === "NEA-5.0.0" &&
        platform.metadata.compositionMode === "CanonicalReferenceOnly" &&
        platform.metadata.compatibility.compositionMode ===
          "CanonicalReferenceOnly"
        ? "Pass"
        : "Fail",
      `${GatewayRoutingPlatformId}/metadata/compatibility`,
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
      `${GatewayRoutingPlatformId}/immutability`,
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
      `${GatewayRoutingPlatformId}/namespace/composition`,
      16,
    ),
    gate(
      "ConsumerReadiness",
      "Consumer Readiness",
      "Consumer platform surface is declared and sole entry point is fixed.",
      platform.consumer.soleSupportedEntryPoint ===
        "gatewayRoutingPlatform.ts" &&
        platform.boundaries.consumerAccessRule.includes(
          "GatewayRoutingPlatform",
        ) &&
        platform.readiness.consumerReady === true
        ? "Pass"
        : "Fail",
      `${GatewayRoutingPlatformId}/consumer`,
      17,
    ),
  ]);

export const GatewayRoutingCertificationPassedGateCount =
  GatewayRoutingCertificationGates.filter(
    (item) => item.outcome === "Pass",
  ).length;

export const GatewayRoutingCertificationFailedGateCount =
  GatewayRoutingCertificationGates.filter(
    (item) => item.outcome === "Fail",
  ).length;

export const GatewayRoutingCertificationAllGatesPass =
  GatewayRoutingCertificationFailedGateCount === 0;

/** Canonical immutable certification gate catalog. */
export const GatewayRoutingCertificationGateCatalog = Object.freeze({
  catalogId: "NEA-5:7/CertificationGateCatalog",
  sourcePhase: "NEA-5:7" as const,
  platformId: GatewayRoutingPlatformId,
  gates: GatewayRoutingCertificationGates,
  gateCount: GatewayRoutingCertificationGates.length,
  passedGateCount: GatewayRoutingCertificationPassedGateCount,
  failedGateCount: GatewayRoutingCertificationFailedGateCount,
  allGatesPass: GatewayRoutingCertificationAllGatesPass,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
