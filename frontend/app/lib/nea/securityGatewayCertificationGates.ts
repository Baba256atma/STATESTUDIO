/**
 * NEA-4:7 — Security Gateway Certification Gates.
 *
 * Immutable declarative certification gates for the Security Gateway Platform.
 * Architecture compliance only. No runtime certification.
 *
 * Ownership: owned exclusively by NEA-4:7.
 */

import {
  SecurityGatewayPlatform,
  SecurityGatewayPlatformId,
} from "./securityGatewayPlatform.ts";
import type {
  SecurityGatewayCertificationGate,
  SecurityGatewayCertificationGateId,
} from "./securityGatewayCertificationTypes.ts";

const platform = SecurityGatewayPlatform;
const ns = platform.namespace;
const securityIdentities = ns.registry.collections.securityIdentities;
const securityPolicies = ns.registry.collections.securityPolicies;
const permissions = ns.registry.collections.permissions;

const gate = (
  gateId: SecurityGatewayCertificationGateId,
  gateName: string,
  description: string,
  outcome: "Pass" | "Fail",
  evidenceRef: string,
  order: number,
): SecurityGatewayCertificationGate =>
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
export const SecurityGatewayCertificationGates: readonly SecurityGatewayCertificationGate[] =
  Object.freeze([
    gate(
      "FoundationIntegrity",
      "Foundation Integrity",
      "Foundation phase is present and immutable through Platform namespace.",
      ns.foundation.identity.foundationId.length > 0 &&
        ns.foundation.immutable === true
        ? "Pass"
        : "Fail",
      `${SecurityGatewayPlatformId}/namespace/foundation`,
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
      `${SecurityGatewayPlatformId}/namespace/registry`,
      2,
    ),
    gate(
      "ModelIntegrity",
      "Model Integrity",
      "Model phase is present and immutable through Platform namespace.",
      ns.model.identity.modelId.length > 0 && ns.model.immutable === true
        ? "Pass"
        : "Fail",
      `${SecurityGatewayPlatformId}/namespace/model`,
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
      `${SecurityGatewayPlatformId}/namespace/validation`,
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
      `${SecurityGatewayPlatformId}/namespace/manifest`,
      5,
    ),
    gate(
      "PlatformIntegrity",
      "Platform Integrity",
      "Platform identity, status, and immutability are intact.",
      platform.identity.platformId === SecurityGatewayPlatformId &&
        platform.immutable === true &&
        platform.status === "Platform"
        ? "Pass"
        : "Fail",
      `${SecurityGatewayPlatformId}/identity`,
      6,
    ),
    gate(
      "SecurityIdentityIntegrity",
      "Security Identity Integrity",
      "Security identity registry is present, unique, and metadata-only.",
      ns.registry.collections.securityIdentityCount > 0 &&
        securityIdentities.length ===
          ns.registry.collections.securityIdentityCount &&
        securityIdentities.every(
          (item) => item.managesRuntimeSecurity === false,
        ) &&
        new Set(securityIdentities.map((item) => item.securityId)).size ===
          securityIdentities.length
        ? "Pass"
        : "Fail",
      `${SecurityGatewayPlatformId}/namespace/registry/collections/securityIdentities`,
      7,
    ),
    gate(
      "SecurityPolicyIntegrity",
      "Security Policy Integrity",
      "Security policy registry is present, unique, and metadata-only.",
      ns.registry.collections.securityPolicyCount > 0 &&
        securityPolicies.length ===
          ns.registry.collections.securityPolicyCount &&
        securityPolicies.every((item) => item.executesRuntime === false) &&
        new Set(securityPolicies.map((item) => item.id)).size ===
          securityPolicies.length
        ? "Pass"
        : "Fail",
      `${SecurityGatewayPlatformId}/namespace/registry/collections/securityPolicies`,
      8,
    ),
    gate(
      "PermissionIntegrity",
      "Permission Integrity",
      "Permission registry is present, unique, and does not evaluate permissions.",
      ns.registry.collections.permissionCount > 0 &&
        permissions.length === ns.registry.collections.permissionCount &&
        permissions.every(
          (item) =>
            item.enforcesPermission === false &&
            item.executesRuntime === false,
        ) &&
        new Set(permissions.map((item) => item.permissionId)).size ===
          permissions.length
        ? "Pass"
        : "Fail",
      `${SecurityGatewayPlatformId}/namespace/registry/collections/permissions`,
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
      `${SecurityGatewayPlatformId}/dependency`,
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
        platform.ownership.ownsManifestInventory === false
        ? "Pass"
        : "Fail",
      `${SecurityGatewayPlatformId}/ownership`,
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
      `${SecurityGatewayPlatformId}/namespace`,
      12,
    ),
    gate(
      "PublicExportIntegrity",
      "Public Export Integrity",
      "Platform exposes exactly eight public exports.",
      platform.apiRegistry.length === 8 ? "Pass" : "Fail",
      `${SecurityGatewayPlatformId}/apiRegistry`,
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
      `${SecurityGatewayPlatformId}/metadata`,
      14,
    ),
    gate(
      "MetadataIntegrity",
      "Metadata Integrity",
      "Platform metadata preserves architecture version and composition mode.",
      platform.metadata.architectureVersion === "NEA-4.0.0" &&
        platform.metadata.compositionMode === "CanonicalReferenceOnly" &&
        platform.metadata.compatibility.compositionMode ===
          "CanonicalReferenceOnly"
        ? "Pass"
        : "Fail",
      `${SecurityGatewayPlatformId}/metadata/compatibility`,
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
      `${SecurityGatewayPlatformId}/namespace/composition`,
      16,
    ),
    gate(
      "ConsumerReadiness",
      "Consumer Readiness",
      "Consumer platform surface is declared and sole entry point is fixed.",
      platform.consumer.soleSupportedEntryPoint ===
        "securityGatewayPlatform.ts" &&
        platform.boundaries.consumerAccessRule.includes(
          "SecurityGatewayPlatform",
        ) &&
        platform.readiness.consumerReady === true
        ? "Pass"
        : "Fail",
      `${SecurityGatewayPlatformId}/consumer`,
      17,
    ),
  ]);

export const SecurityGatewayCertificationPassedGateCount =
  SecurityGatewayCertificationGates.filter(
    (item) => item.outcome === "Pass",
  ).length;

export const SecurityGatewayCertificationFailedGateCount =
  SecurityGatewayCertificationGates.filter(
    (item) => item.outcome === "Fail",
  ).length;

export const SecurityGatewayCertificationAllGatesPass =
  SecurityGatewayCertificationFailedGateCount === 0;

/** Canonical immutable certification gate catalog. */
export const SecurityGatewayCertificationGateCatalog = Object.freeze({
  catalogId: "NEA-4:7/CertificationGateCatalog",
  sourcePhase: "NEA-4:7" as const,
  platformId: SecurityGatewayPlatformId,
  gates: SecurityGatewayCertificationGates,
  gateCount: SecurityGatewayCertificationGates.length,
  passedGateCount: SecurityGatewayCertificationPassedGateCount,
  failedGateCount: SecurityGatewayCertificationFailedGateCount,
  allGatesPass: SecurityGatewayCertificationAllGatesPass,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
