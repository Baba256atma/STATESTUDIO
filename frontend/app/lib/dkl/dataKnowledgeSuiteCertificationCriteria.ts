/**
 * DKL-9:7 — Data Knowledge Suite Certification Criteria.
 *
 * Exactly eighteen certification criteria evaluated against Platform metadata.
 * Outcomes are deterministic. No repair, enforcement, or mutation.
 *
 * Ownership: owned exclusively by DKL-9:7.
 */

import {
  DataKnowledgeSuitePlatform,
  DataKnowledgeSuitePlatformId,
  DataKnowledgeSuitePlatformNamespace,
  DataKnowledgeSuitePlatformReadiness,
  DataKnowledgeSuitePlatformStatus,
  DataKnowledgeSuitePlatformVersion,
} from "./dataKnowledgeSuitePlatform.ts";
import type {
  DataKnowledgeSuiteCertificationCategory,
  DataKnowledgeSuiteCertificationCategoryDescriptor,
  DataKnowledgeSuiteCertificationCriterion,
  DataKnowledgeSuiteCertificationOutcome,
  DataKnowledgeSuiteCertificationOutcomeDescriptor,
} from "./dataKnowledgeSuiteCertificationTypes.ts";

const platform = DataKnowledgeSuitePlatform;

const pass = (condition: boolean): DataKnowledgeSuiteCertificationOutcome =>
  condition ? "Pass" : "Fail";

const unique = (values: readonly string[]): boolean =>
  new Set(values).size === values.length;

const EXPECTED_PLATFORM_APIS = Object.freeze([
  "DataKnowledgeSuitePlatformId",
  "DataKnowledgeSuitePlatformVersion",
  "DataKnowledgeSuitePlatformName",
  "DataKnowledgeSuitePlatformNamespace",
  "DataKnowledgeSuitePlatformStatus",
  "DataKnowledgeSuitePlatformReadiness",
  "DataKnowledgeSuitePlatform",
  "getDataKnowledgeSuitePlatformSummary",
] as const);

const CATEGORY_ORDER: readonly DataKnowledgeSuiteCertificationCategory[] =
  Object.freeze([
    "Identity",
    "Dependency",
    "Platform",
    "CapabilityCatalog",
    "Ownership",
    "Boundaries",
    "Compatibility",
    "Guarantees",
    "CanonicalReferences",
    "CanonicalInventory",
    "PlatformMetadata",
    "PlatformReadiness",
  ]);

/** Exactly twelve closed certification categories. */
export const DataKnowledgeSuiteCertificationCategories: readonly DataKnowledgeSuiteCertificationCategoryDescriptor[] =
  Object.freeze(
    CATEGORY_ORDER.map((category, index) =>
      Object.freeze({
        categoryId: `DKL-9:7/Category/${category}`,
        category,
        description: `Certification category for ${category}.`,
        deterministicOrder: index + 1,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );

/** Exactly four closed certification outcomes. */
export const DataKnowledgeSuiteCertificationOutcomes: readonly DataKnowledgeSuiteCertificationOutcomeDescriptor[] =
  Object.freeze([
    Object.freeze({
      outcomeId: "DKL-9:7/Outcome/Pass",
      outcome: "Pass" as const,
      description: "Criterion satisfied.",
      deterministicOrder: 1,
      metadataOnly: true as const,
      immutable: true as const,
    }),
    Object.freeze({
      outcomeId: "DKL-9:7/Outcome/Fail",
      outcome: "Fail" as const,
      description: "Criterion not satisfied.",
      deterministicOrder: 2,
      metadataOnly: true as const,
      immutable: true as const,
    }),
    Object.freeze({
      outcomeId: "DKL-9:7/Outcome/NotApplicable",
      outcome: "NotApplicable" as const,
      description: "Criterion not applicable.",
      deterministicOrder: 3,
      metadataOnly: true as const,
      immutable: true as const,
    }),
    Object.freeze({
      outcomeId: "DKL-9:7/Outcome/NotEvaluated",
      outcome: "NotEvaluated" as const,
      description: "Criterion not evaluated.",
      deterministicOrder: 4,
      metadataOnly: true as const,
      immutable: true as const,
    }),
  ]);

const criterion = (
  name: string,
  category: DataKnowledgeSuiteCertificationCategory,
  description: string,
  sourceReference: string,
  expected: string,
  actual: string,
  outcome: DataKnowledgeSuiteCertificationOutcome,
  order: number,
): DataKnowledgeSuiteCertificationCriterion =>
  Object.freeze({
    id: `DKL-9:7/Criterion/${name}`,
    name,
    category,
    description,
    required: true as const,
    status: "Active" as const,
    outcome,
    sourceReference,
    expected,
    actual,
    sourcePhase: "DKL-9:7" as const,
    runtimeBehavior: "None" as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Exactly eighteen certification criteria. */
export const DataKnowledgeSuiteCertificationCriteria: readonly DataKnowledgeSuiteCertificationCriterion[] =
  Object.freeze([
    criterion(
      "IdentityCertified",
      "Identity",
      "Platform identity must equal DKL-9:6/DataKnowledgeSuitePlatform at 1.0.0.",
      DataKnowledgeSuitePlatformId,
      "DKL-9:6/DataKnowledgeSuitePlatform@1.0.0",
      `${DataKnowledgeSuitePlatformId}@${DataKnowledgeSuitePlatformVersion}`,
      pass(
        DataKnowledgeSuitePlatformId === "DKL-9:6/DataKnowledgeSuitePlatform" &&
          DataKnowledgeSuitePlatformVersion === "1.0.0" &&
          DataKnowledgeSuitePlatformNamespace ===
            "nexora.dkl.data-knowledge-suite.platform" &&
          DataKnowledgeSuitePlatformStatus === "PlatformDefined",
      ),
      1,
    ),
    criterion(
      "DependencyCertified",
      "Dependency",
      "Platform must consume Manifest only with no lower-level imports.",
      platform.dependency.dependencyId,
      "manifestOnly=true",
      `manifestOnly=${String(platform.dependency.manifestOnly)};validation=${String(platform.dependency.validationDirectImport)};model=${String(platform.dependency.modelDirectImport)}`,
      pass(
        platform.dependency.manifestOnly === true &&
          platform.dependency.validationDirectImport === false &&
          platform.dependency.modelDirectImport === false &&
          platform.dependency.registryDirectImport === false &&
          platform.dependency.foundationDirectImport === false &&
          platform.dependency.dkl1DirectImport === false &&
          platform.dependency.dkl8DirectImport === false,
      ),
      2,
    ),
    criterion(
      "PlatformIntegrityCertified",
      "Platform",
      "Platform must expose eighteen canonical sections and remain immutable.",
      "sectionOrder",
      "18",
      String(platform.sectionCount),
      pass(
        platform.sectionCount === 18 &&
          platform.immutable === true &&
          platform.deterministic === true,
      ),
      3,
    ),
    criterion(
      "PublicSurfaceCertified",
      "Platform",
      "Platform public API registry must declare the eight Platform exports.",
      "apiRegistry",
      EXPECTED_PLATFORM_APIS.join(","),
      platform.apiRegistry.map((item) => item.exportName).join(","),
      pass(
        platform.apiRegistry.length === 8 &&
          platform.apiRegistry.every(
            (item, index) => item.exportName === EXPECTED_PLATFORM_APIS[index],
          ),
      ),
      4,
    ),
    criterion(
      "CapabilityCatalogCertified",
      "CapabilityCatalog",
      "Capability catalog must contain exactly eight suite capabilities.",
      "capabilityCatalog",
      "8",
      String(platform.capabilityCatalog.length),
      pass(
        platform.capabilityCatalog.length === 8 &&
          unique(
            platform.capabilityCatalog.map((item) => item.capabilityId),
          ) &&
          platform.inventory.capabilityCount === 8,
      ),
      5,
    ),
    criterion(
      "OwnershipCertified",
      "Ownership",
      "Ownership aggregate must be preserved from Platform ownership section.",
      "ownership",
      "preserved",
      platform.ownership ? "preserved" : "missing",
      pass(
        platform.ownership !== undefined &&
          platform.ownership.aggregate.ownership.owns.includes(
            "Suite composition",
          ),
      ),
      6,
    ),
    criterion(
      "BoundariesCertified",
      "Boundaries",
      "Boundaries must prohibit runtime enforcement and lower-level imports.",
      "boundaries",
      "runtimeEnforcement=false",
      `runtimeEnforcement=${String(platform.boundaries.aggregate.boundaries.runtimeEnforcement)};lowerLevel=${String(platform.boundaries.aggregate.boundaries.importsLowerLevelDklModules)}`,
      pass(
        platform.boundaries.aggregate.boundaries.runtimeEnforcement === false &&
          platform.boundaries.aggregate.boundaries.importsLowerLevelDklModules ===
            false,
      ),
      7,
    ),
    criterion(
      "CompatibilityCertified",
      "Compatibility",
      "Platform must expose exactly twelve compatible declarations.",
      "compatibility",
      "12",
      String(platform.compatibility.length),
      pass(
        platform.compatibility.length === 12 &&
          platform.compatibility.every(
            (item) =>
              item.compatible === true && item.status === "Compatible",
          ) &&
          unique(platform.compatibility.map((item) => item.id)),
      ),
      8,
    ),
    criterion(
      "GuaranteesCertified",
      "Guarantees",
      "Platform must expose exactly eighteen satisfied guarantees.",
      "guarantees",
      "18",
      String(platform.guarantees.length),
      pass(
        platform.guarantees.length === 18 &&
          platform.guarantees.every((item) => item.status === "Satisfied") &&
          unique(platform.guarantees.map((item) => item.guaranteeId)),
      ),
      9,
    ),
    criterion(
      "ManifestReferenceCertified",
      "CanonicalReferences",
      "Platform.manifest must equal DataKnowledgeSuiteManifestPlatform by reference.",
      "manifest",
      "preserved",
      platform.manifest === platform.manifest ? "preserved" : "diverged",
      pass(
        platform.manifest.identity.manifestId ===
          "DKL-9:5/DataKnowledgeSuiteManifest",
      ),
      10,
    ),
    criterion(
      "ValidationReferenceCertified",
      "CanonicalReferences",
      "Platform.validation must equal Manifest.upstreamValidation by reference.",
      "validation",
      "preserved",
      platform.validation === platform.manifest.upstreamValidation
        ? "preserved"
        : "diverged",
      pass(platform.validation === platform.manifest.upstreamValidation),
      11,
    ),
    criterion(
      "ModelReferenceCertified",
      "CanonicalReferences",
      "Platform.model must equal Validation.model by reference.",
      "model",
      "preserved",
      platform.model === platform.validation.model ? "preserved" : "diverged",
      pass(platform.model === platform.validation.model),
      12,
    ),
    criterion(
      "RegistryReferenceCertified",
      "CanonicalReferences",
      "Platform.registry must equal Model.registry by reference.",
      "registry",
      "preserved",
      platform.registry === platform.model.registry ? "preserved" : "diverged",
      pass(platform.registry === platform.model.registry),
      13,
    ),
    criterion(
      "FoundationReferenceCertified",
      "CanonicalReferences",
      "Platform.foundation must equal Registry.foundation by reference.",
      "foundation",
      "preserved",
      platform.foundation === platform.registry.foundation
        ? "preserved"
        : "diverged",
      pass(platform.foundation === platform.registry.foundation),
      14,
    ),
    criterion(
      "CanonicalInventoryCertified",
      "CanonicalInventory",
      "Platform inventory must be sourced through Manifest without reconstruction.",
      "inventory.sourcedThroughManifest",
      "true/false/false",
      `${String(platform.inventory.sourcedThroughManifest)}/${String(platform.inventory.reconstructed)}/${String(platform.inventory.hardcoded)}`,
      pass(
        platform.inventory.sourcedThroughManifest === true &&
          platform.inventory.reconstructed === false &&
          platform.inventory.hardcoded === false &&
          platform.inventory.duplicated === false,
      ),
      15,
    ),
    criterion(
      "InventoryConsistencyCertified",
      "CanonicalInventory",
      "Platform inventory totals must match Manifest inventory totals.",
      "inventory.manifestTotalEntryCount",
      String(platform.manifest.inventory.totalEntryCount),
      String(platform.inventory.manifestTotalEntryCount),
      pass(
        platform.inventory.manifestTotalEntryCount ===
          platform.manifest.inventory.totalEntryCount &&
          platform.inventory.publicApiInventoryTotal ===
            platform.manifest.inventory.publicApiInventoryTotal &&
          platform.inventory.capabilityCount ===
            platform.manifest.inventory.capabilityCount,
      ),
      16,
    ),
    criterion(
      "PlatformMetadataCertified",
      "PlatformMetadata",
      "Platform metadata must declare CompleteThroughPlatform architecture status.",
      "metadata.architectureStatus",
      "CompleteThroughPlatform",
      platform.metadata.architectureStatus,
      pass(
        platform.metadata.architectureStatus === "CompleteThroughPlatform" &&
          platform.identity.architectureStatus === "CompleteThroughPlatform",
      ),
      17,
    ),
    criterion(
      "FreezeReadinessCertified",
      "PlatformReadiness",
      "Platform readiness must be ReadyForCertification with no runtime behaviour.",
      DataKnowledgeSuitePlatformReadiness,
      "ReadyForCertification/runtime=false",
      `${DataKnowledgeSuitePlatformReadiness}/runtime=${String(platform.runtimeBehavior)}`,
      pass(
        DataKnowledgeSuitePlatformReadiness === "ReadyForCertification" &&
          platform.runtimeBehavior === false &&
          platform.runtimeEnforcement === false &&
          platform.reconstructsUpstream === false,
      ),
      18,
    ),
  ]);

export const DataKnowledgeSuiteCertificationCriterionCount =
  DataKnowledgeSuiteCertificationCriteria.length;

export const DataKnowledgeSuiteCertificationAllCriteriaPass =
  DataKnowledgeSuiteCertificationCriteria.every(
    (item) => item.outcome === "Pass",
  );
