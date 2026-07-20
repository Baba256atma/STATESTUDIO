/**
 * NEA-7:7 — Intake Orchestration Certification Gates.
 *
 * Immutable declarative certification gates for the Intake Orchestration Platform.
 * Architecture compliance only. No runtime certification.
 *
 * Ownership: owned exclusively by NEA-7:7.
 */

import {
  IntakeOrchestrationPlatform,
  IntakeOrchestrationPlatformId,
} from "./intakeOrchestrationPlatform.ts";
import type {
  IntakeOrchestrationCertificationGate,
  IntakeOrchestrationCertificationGateId,
} from "./intakeOrchestrationCertificationTypes.ts";

const platform = IntakeOrchestrationPlatform;
const ns = platform.namespace;
const intakeIdentities = ns.registry.collections.intakeIdentities;
const referenceTypes = ns.registry.collections.referenceTypes;
const executiveContracts =
  ns.foundation.contracts.canonicalExecutiveIntakePackageContracts;

const gate = (
  gateId: IntakeOrchestrationCertificationGateId,
  gateName: string,
  description: string,
  outcome: "Pass" | "Fail",
  evidenceRef: string,
  order: number,
): IntakeOrchestrationCertificationGate =>
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
export const IntakeOrchestrationCertificationGates: readonly IntakeOrchestrationCertificationGate[] =
  Object.freeze([
    gate(
      "FoundationIntegrity",
      "Foundation Integrity",
      "Foundation phase is present and immutable through Platform namespace.",
      ns.foundation.identity.foundationId.length > 0 &&
        ns.foundation.immutable === true
        ? "Pass"
        : "Fail",
      `${IntakeOrchestrationPlatformId}/namespace/foundation`,
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
      `${IntakeOrchestrationPlatformId}/namespace/registry`,
      2,
    ),
    gate(
      "ModelIntegrity",
      "Model Integrity",
      "Model phase is present and immutable through Platform namespace.",
      ns.model.identity.modelId.length > 0 && ns.model.immutable === true
        ? "Pass"
        : "Fail",
      `${IntakeOrchestrationPlatformId}/namespace/model`,
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
      `${IntakeOrchestrationPlatformId}/namespace/validation`,
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
      `${IntakeOrchestrationPlatformId}/namespace/manifest`,
      5,
    ),
    gate(
      "PlatformIntegrity",
      "Platform Integrity",
      "Platform identity, status, and immutability are intact.",
      platform.identity.platformId === IntakeOrchestrationPlatformId &&
        platform.immutable === true &&
        platform.status === "Platform"
        ? "Pass"
        : "Fail",
      `${IntakeOrchestrationPlatformId}/identity`,
      6,
    ),
    gate(
      "ExecutiveIntakePackageIntegrity",
      "Executive Intake Package Integrity",
      "Canonical Executive Intake Package contract is present through Foundation.",
      ns.foundation.contracts.canonicalExecutiveIntakePackageCount === 1 &&
        executiveContracts.length === 1 &&
        executiveContracts[0]?.contractId ===
          "NEA-7:1/Contract/ExecutiveIntakePackage" &&
        executiveContracts[0]?.isCanonicalExecutiveIntakePackage === true
        ? "Pass"
        : "Fail",
      `${IntakeOrchestrationPlatformId}/namespace/foundation/contracts/executiveIntakePackage`,
      7,
    ),
    gate(
      "IntakeIdentityRegistryIntegrity",
      "Intake Identity Registry Integrity",
      "Intake identity registry is present, unique, and metadata-only.",
      ns.registry.collections.intakeIdentityCount === 8 &&
        intakeIdentities.length ===
          ns.registry.collections.intakeIdentityCount &&
        intakeIdentities.every(
          (item) =>
            item.executesRuntime === false &&
            item.assemblesRuntimePackage === false,
        ) &&
        new Set(intakeIdentities.map((item) => item.intakeId)).size ===
          intakeIdentities.length
        ? "Pass"
        : "Fail",
      `${IntakeOrchestrationPlatformId}/namespace/registry/collections/intakeIdentities`,
      8,
    ),
    gate(
      "ReferenceIntegrity",
      "Reference Integrity",
      "Reference type registry is present, unique, and metadata-only.",
      ns.registry.collections.referenceTypeCount > 0 &&
        referenceTypes.length ===
          ns.registry.collections.referenceTypeCount &&
        referenceTypes.every((item) => item.executesRuntime === false) &&
        new Set(referenceTypes.map((item) => item.id)).size ===
          referenceTypes.length
        ? "Pass"
        : "Fail",
      `${IntakeOrchestrationPlatformId}/namespace/registry/collections/referenceTypes`,
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
      `${IntakeOrchestrationPlatformId}/dependency`,
      10,
    ),
    gate(
      "OwnershipIntegrity",
      "Ownership Integrity",
      "Platform ownership is unique and does not claim upstream ownership.",
      platform.ownership.ownsFoundationContracts === false &&
        platform.ownership.ownsRegistryDeclarations === false &&
        platform.ownership.ownsDomainModels === false &&
        platform.ownership.ownsValidationRules === false &&
        platform.ownership.ownsManifestInventories === false
        ? "Pass"
        : "Fail",
      `${IntakeOrchestrationPlatformId}/ownership`,
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
      `${IntakeOrchestrationPlatformId}/namespace`,
      12,
    ),
    gate(
      "PublicExportIntegrity",
      "Public Export Integrity",
      "Platform exposes exactly eight public exports.",
      platform.apiRegistry.length === 8 ? "Pass" : "Fail",
      `${IntakeOrchestrationPlatformId}/apiRegistry`,
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
      `${IntakeOrchestrationPlatformId}/metadata`,
      14,
    ),
    gate(
      "MetadataIntegrity",
      "Metadata Integrity",
      "Platform metadata preserves architecture version and composition mode.",
      platform.metadata.architectureVersion === "NEA-7.0.0" &&
        platform.metadata.compositionMode === "CanonicalReferenceOnly" &&
        platform.metadata.compatibility.compositionMode ===
          "CanonicalReferenceOnly"
        ? "Pass"
        : "Fail",
      `${IntakeOrchestrationPlatformId}/metadata/compatibility`,
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
      `${IntakeOrchestrationPlatformId}/namespace/composition`,
      16,
    ),
    gate(
      "ConsumerReadiness",
      "Consumer Readiness",
      "Consumer platform surface is declared and sole entry point is fixed.",
      platform.consumer.soleSupportedEntryPoint ===
        "intakeOrchestrationPlatform.ts" &&
        platform.boundaries.consumerAccessRule.includes(
          "IntakeOrchestrationPlatform",
        ) &&
        platform.readiness.consumerReady === true
        ? "Pass"
        : "Fail",
      `${IntakeOrchestrationPlatformId}/consumer`,
      17,
    ),
  ]);

export const IntakeOrchestrationCertificationPassedGateCount =
  IntakeOrchestrationCertificationGates.filter(
    (item) => item.outcome === "Pass",
  ).length;

export const IntakeOrchestrationCertificationFailedGateCount =
  IntakeOrchestrationCertificationGates.filter(
    (item) => item.outcome === "Fail",
  ).length;

export const IntakeOrchestrationCertificationAllGatesPass =
  IntakeOrchestrationCertificationFailedGateCount === 0;

/** Canonical immutable certification gate catalog. */
export const IntakeOrchestrationCertificationGateCatalog = Object.freeze({
  catalogId: "NEA-7:7/CertificationGateCatalog",
  sourcePhase: "NEA-7:7" as const,
  platformId: IntakeOrchestrationPlatformId,
  gates: IntakeOrchestrationCertificationGates,
  gateCount: IntakeOrchestrationCertificationGates.length,
  passedGateCount: IntakeOrchestrationCertificationPassedGateCount,
  failedGateCount: IntakeOrchestrationCertificationFailedGateCount,
  allGatesPass: IntakeOrchestrationCertificationAllGatesPass,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
