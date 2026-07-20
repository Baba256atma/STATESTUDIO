/**
 * NEA-8:7 — Executive Gateway Suite Certification Gates.
 *
 * Immutable declarative certification gates for the Executive Gateway Suite Platform.
 * Architecture compliance only. No runtime certification.
 *
 * Ownership: owned exclusively by NEA-8:7.
 */

import {
  ExecutiveGatewaySuitePlatform,
  ExecutiveGatewaySuitePlatformId,
} from "./executiveGatewaySuitePlatform.ts";
import type {
  ExecutiveGatewaySuiteCertificationGate,
  ExecutiveGatewaySuiteCertificationGateId,
} from "./executiveGatewaySuiteCertificationTypes.ts";

const platform = ExecutiveGatewaySuitePlatform;
const ns = platform.namespace;
const suiteComponents = ns.suiteComponents;
const componentIdentities = ns.registry.collections.componentIdentities;

const EXPECTED_COMPONENT_IDS = Object.freeze([
  "NEA-1",
  "NEA-2",
  "NEA-3",
  "NEA-4",
  "NEA-5",
  "NEA-6",
  "NEA-7",
] as const);

const gate = (
  id: ExecutiveGatewaySuiteCertificationGateId,
  name: string,
  description: string,
  outcome: "Pass" | "Fail",
  rationale: string,
  order: number,
): ExecutiveGatewaySuiteCertificationGate =>
  Object.freeze({
    id,
    name,
    description,
    status: "Evaluated" as const,
    outcome,
    rationale,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly eighteen certification gates.
 * Outcomes are derived from Platform canonical metadata references.
 */
export const ExecutiveGatewaySuiteCertificationGates: readonly ExecutiveGatewaySuiteCertificationGate[] =
  Object.freeze([
    gate(
      "FoundationIntegrity",
      "Foundation Integrity",
      "Foundation phase is present and immutable through Platform namespace.",
      ns.foundation.identity.foundationId.length > 0 &&
        ns.foundation.immutable === true
        ? "Pass"
        : "Fail",
      `Evidence: ${ExecutiveGatewaySuitePlatformId}/namespace/foundation`,
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
      `Evidence: ${ExecutiveGatewaySuitePlatformId}/namespace/registry`,
      2,
    ),
    gate(
      "ModelIntegrity",
      "Model Integrity",
      "Model phase is present and immutable through Platform namespace.",
      ns.model.identity.modelId.length > 0 && ns.model.immutable === true
        ? "Pass"
        : "Fail",
      `Evidence: ${ExecutiveGatewaySuitePlatformId}/namespace/model`,
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
      `Evidence: ${ExecutiveGatewaySuitePlatformId}/namespace/validation`,
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
      `Evidence: ${ExecutiveGatewaySuitePlatformId}/namespace/manifest`,
      5,
    ),
    gate(
      "PlatformIntegrity",
      "Platform Integrity",
      "Platform identity, status, and immutability are intact.",
      platform.identity.platformId === ExecutiveGatewaySuitePlatformId &&
        platform.immutable === true &&
        platform.status === "Platform"
        ? "Pass"
        : "Fail",
      `Evidence: ${ExecutiveGatewaySuitePlatformId}/identity`,
      6,
    ),
    gate(
      "SuiteCompositionIntegrity",
      "Suite Composition Integrity",
      "Suite composes exactly seven released NEA platforms by reference.",
      ns.suiteComponentCount === 7 &&
        suiteComponents.length === 7 &&
        suiteComponents.every((item) => item.ownership === "Referenced")
        ? "Pass"
        : "Fail",
      `Evidence: ${ExecutiveGatewaySuitePlatformId}/namespace/suiteComponents`,
      7,
    ),
    gate(
      "ComponentIdentityIntegrity",
      "Component Identity Integrity",
      "Component identities are complete, unique, and aligned to NEA-1 through NEA-7.",
      ns.registry.collections.componentIdentityCount === 7 &&
        componentIdentities.length === 7 &&
        suiteComponents
          .map((item) => item.componentId)
          .every((id, index) => id === EXPECTED_COMPONENT_IDS[index]) &&
        new Set(suiteComponents.map((item) => item.componentId)).size === 7
        ? "Pass"
        : "Fail",
      `Evidence: ${ExecutiveGatewaySuitePlatformId}/namespace/registry/collections/componentIdentities`,
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
      `Evidence: ${ExecutiveGatewaySuitePlatformId}/dependency`,
      9,
    ),
    gate(
      "DependencyIntegrity",
      "Dependency Integrity",
      "Dependency direction is Platform-only with no earlier-phase direct imports.",
      platform.dependency.manifestOnly === true &&
        platform.dependency.validationDirectImport === false &&
        platform.dependency.modelDirectImport === false &&
        platform.dependency.registryDirectImport === false &&
        platform.dependency.foundationDirectImport === false
        ? "Pass"
        : "Fail",
      `Evidence: ${ExecutiveGatewaySuitePlatformId}/dependency/imports`,
      10,
    ),
    gate(
      "OwnershipIntegrity",
      "Ownership Integrity",
      "Platform ownership is unique and does not claim upstream ownership.",
      platform.ownership.ownsFoundation === false &&
        platform.ownership.ownsRegistry === false &&
        platform.ownership.ownsModel === false &&
        platform.ownership.ownsValidation === false &&
        platform.ownership.ownsManifest === false
        ? "Pass"
        : "Fail",
      `Evidence: ${ExecutiveGatewaySuitePlatformId}/ownership`,
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
      `Evidence: ${ExecutiveGatewaySuitePlatformId}/namespace`,
      12,
    ),
    gate(
      "PublicExportIntegrity",
      "Public Export Integrity",
      "Platform exposes exactly eight public exports.",
      platform.apiRegistry.length === 8 ? "Pass" : "Fail",
      `Evidence: ${ExecutiveGatewaySuitePlatformId}/apiRegistry`,
      13,
    ),
    gate(
      "InventoryIntegrity",
      "Inventory Integrity",
      "Inventory counts are derived and not hardcoded; public API inventory and architecture totals are present.",
      platform.metadata.countsHardcoded === false &&
        platform.metadata.countsReconstructed === false &&
        platform.metadata.inventoryEntryCount > 0 &&
        platform.metadata.publicApiInventoryTotal === 532 &&
        platform.metadata.totalArchitectureCount === 820
        ? "Pass"
        : "Fail",
      `Evidence: ${ExecutiveGatewaySuitePlatformId}/metadata/inventory`,
      14,
    ),
    gate(
      "MetadataIntegrity",
      "Metadata Integrity",
      "Platform metadata preserves architecture version and composition mode.",
      platform.metadata.architectureVersion === "NEA-8.0.0" &&
        platform.metadata.compositionMode === "CanonicalReferenceOnly" &&
        platform.metadata.canonicalReferenceMode === "ManifestOnly"
        ? "Pass"
        : "Fail",
      `Evidence: ${ExecutiveGatewaySuitePlatformId}/metadata`,
      15,
    ),
    gate(
      "ImmutabilityIntegrity",
      "Immutability Integrity",
      "Platform, metadata, and namespace declare immutable metadata-only architecture.",
      platform.immutable === true &&
        platform.metadata.immutable === true &&
        ns.immutable === true
        ? "Pass"
        : "Fail",
      `Evidence: ${ExecutiveGatewaySuitePlatformId}/immutability`,
      16,
    ),
    gate(
      "ArchitectureCompleteness",
      "Architecture Completeness",
      "Foundation through Platform chain is complete.",
      ns.composition.length === 6 &&
        platform.metadata.composedPhaseCount === 6
        ? "Pass"
        : "Fail",
      `Evidence: ${ExecutiveGatewaySuitePlatformId}/namespace/composition`,
      17,
    ),
    gate(
      "ConsumerReadiness",
      "Consumer Readiness",
      "Consumer platform surface is declared and sole entry point is fixed.",
      platform.consumer.soleSupportedEntryPoint ===
        "executiveGatewaySuitePlatform.ts" &&
        platform.boundaries.consumerAccessRule.includes(
          "ExecutiveGatewaySuitePlatform",
        ) &&
        platform.readiness.consumerReady === true
        ? "Pass"
        : "Fail",
      `Evidence: ${ExecutiveGatewaySuitePlatformId}/consumer`,
      18,
    ),
  ]);

export const ExecutiveGatewaySuiteCertificationPassedGateCount =
  ExecutiveGatewaySuiteCertificationGates.filter(
    (item) => item.outcome === "Pass",
  ).length;

export const ExecutiveGatewaySuiteCertificationFailedGateCount =
  ExecutiveGatewaySuiteCertificationGates.filter(
    (item) => item.outcome === "Fail",
  ).length;

export const ExecutiveGatewaySuiteCertificationAllGatesPass =
  ExecutiveGatewaySuiteCertificationFailedGateCount === 0;

/** Canonical immutable certification gate catalog. */
export const ExecutiveGatewaySuiteCertificationGateCatalog = Object.freeze({
  catalogId: "NEA-8:7/CertificationGateCatalog",
  sourcePhase: "NEA-8:7" as const,
  platformId: ExecutiveGatewaySuitePlatformId,
  gates: ExecutiveGatewaySuiteCertificationGates,
  gateCount: ExecutiveGatewaySuiteCertificationGates.length,
  passedGateCount: ExecutiveGatewaySuiteCertificationPassedGateCount,
  failedGateCount: ExecutiveGatewaySuiteCertificationFailedGateCount,
  allGatesPass: ExecutiveGatewaySuiteCertificationAllGatesPass,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
