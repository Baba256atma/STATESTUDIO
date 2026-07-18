/**
 * DKL-9:4 — Data Knowledge Suite Validation Rules.
 *
 * Exactly 48 deterministic Suite-composition validation rules.
 * Outcomes derived exclusively from DataKnowledgeSuiteModelPlatform.
 *
 * Ownership: owned exclusively by DKL-9:4.
 */

import {
  DataKnowledgeSuiteModelId,
  DataKnowledgeSuiteModelNamespace,
  DataKnowledgeSuiteModelPlatform,
  DataKnowledgeSuiteModelReadiness,
  DataKnowledgeSuiteModelStatus,
  DataKnowledgeSuiteModelVersion,
} from "./dataKnowledgeSuiteModel.ts";
import type {
  DataKnowledgeSuiteValidationCategory,
  DataKnowledgeSuiteValidationOutcome,
  DataKnowledgeSuiteValidationRule,
  DataKnowledgeSuiteValidationSeverity,
} from "./dataKnowledgeSuiteValidationTypes.ts";

const model = DataKnowledgeSuiteModelPlatform;

const pass = (condition: boolean): DataKnowledgeSuiteValidationOutcome =>
  condition ? "Pass" : "Fail";

const unique = (values: readonly string[]): boolean =>
  new Set(values).size === values.length;

const EXPECTED_CAPABILITIES = Object.freeze([
  "DKL-1",
  "DKL-2",
  "DKL-3",
  "DKL-4",
  "DKL-5",
  "DKL-6",
  "DKL-7",
  "DKL-8",
] as const);

const capabilityIds = Object.freeze(
  model.capabilities.map((item) => item.capabilityId),
);
const orderingIds = Object.freeze(
  model.capabilityOrdering.map((item) => item.capabilityId),
);
const dependencyIds = Object.freeze(
  model.capabilityDependencies.map((item) => item.capabilityId),
);

const canonicalDependencyGraph = model.capabilityDependencies.every(
  (dependency, index) => {
    if (index === 0) {
      return dependency.dependencyRegistration.priorCapabilityId === null;
    }
    return (
      dependency.dependencyRegistration.priorCapabilityId ===
      EXPECTED_CAPABILITIES[index - 1]
    );
  },
);

const platformRefsPreserved = model.publicPlatformReferences.every(
  (item, index) =>
    item.publicPlatformRegistration ===
    model.registry.publicPlatforms[index],
);

const apiRefsPreserved = model.publicApiRegistryReferences.every(
  (item, index) =>
    item.publicApiRegistryRef === model.registry.publicApiRegistryRefs[index],
);

const ownershipPreserved =
  model.ownershipReferences[0]?.ownership === model.registry.ownership;

const boundariesPreserved =
  model.boundaryReferences[0]?.boundaries === model.registry.boundaries;

const inventoryApiTotalMatches =
  model.inventory.publicApiInventoryTotal ===
  model.registry.inventory.publicApiInventoryTotal;

const inventoryRegistryTotalMatches =
  model.inventory.registryTotalEntryCount ===
  model.registry.inventory.totalEntryCount;

const rule = (
  id: string,
  name: string,
  category: DataKnowledgeSuiteValidationCategory,
  severity: DataKnowledgeSuiteValidationSeverity,
  description: string,
  sourceReference: string,
  expected: string,
  actual: string,
  outcome: DataKnowledgeSuiteValidationOutcome,
  order: number,
): DataKnowledgeSuiteValidationRule =>
  Object.freeze({
    id,
    name,
    category,
    severity,
    required: true as const,
    description,
    sourceReference,
    status: "Active" as const,
    outcome,
    expected,
    actual,
    readinessImpact: "Blocking" as const,
    sourcePhase: "DKL-9:4" as const,
    deterministic: true as const,
    runtimeBehavior: "None" as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Exactly forty-eight Suite validation rules. */
export const DataKnowledgeSuiteValidationRules: readonly DataKnowledgeSuiteValidationRule[] =
  Object.freeze([
    // Identity (4)
    rule(
      "DKS-V-ID-001",
      "ModelIdentityPresent",
      "Identity",
      "Critical",
      "Model identity must equal DKL-9:3/DataKnowledgeSuiteModel.",
      DataKnowledgeSuiteModelId,
      "DKL-9:3/DataKnowledgeSuiteModel",
      DataKnowledgeSuiteModelId,
      pass(DataKnowledgeSuiteModelId === "DKL-9:3/DataKnowledgeSuiteModel"),
      1,
    ),
    rule(
      "DKS-V-ID-002",
      "ModelVersionStable",
      "Identity",
      "Error",
      "Model version must be 1.0.0.",
      DataKnowledgeSuiteModelVersion,
      "1.0.0",
      DataKnowledgeSuiteModelVersion,
      pass(DataKnowledgeSuiteModelVersion === "1.0.0"),
      2,
    ),
    rule(
      "DKS-V-ID-003",
      "ModelNamespaceCanonical",
      "Identity",
      "Error",
      "Model namespace must be the suite model namespace.",
      DataKnowledgeSuiteModelNamespace,
      "nexora.dkl.data-knowledge-suite.model",
      DataKnowledgeSuiteModelNamespace,
      pass(
        DataKnowledgeSuiteModelNamespace ===
          "nexora.dkl.data-knowledge-suite.model",
      ),
      3,
    ),
    rule(
      "DKS-V-ID-004",
      "ModelStatusDefined",
      "Identity",
      "Error",
      "Model status must be ModelDefined.",
      DataKnowledgeSuiteModelStatus,
      "ModelDefined",
      DataKnowledgeSuiteModelStatus,
      pass(DataKnowledgeSuiteModelStatus === "ModelDefined"),
      4,
    ),

    // Dependency (4)
    rule(
      "DKS-V-DEP-001",
      "RegistryOnlyDependency",
      "Dependency",
      "Critical",
      "Model must declare registry-only dependency.",
      model.dependency.dependencyId,
      "true",
      String(model.dependency.registryOnly),
      pass(model.dependency.registryOnly === true),
      5,
    ),
    rule(
      "DKS-V-DEP-002",
      "NoFoundationDirectImport",
      "Dependency",
      "Critical",
      "Model must not import Foundation directly.",
      model.dependency.dependencyId,
      "false",
      String(model.dependency.foundationDirectImport),
      pass(model.dependency.foundationDirectImport === false),
      6,
    ),
    rule(
      "DKS-V-DEP-003",
      "NoPublicIndexDirectImport",
      "Dependency",
      "Critical",
      "Model must not import Public Indexes directly.",
      model.dependency.dependencyId,
      "false",
      String(model.dependency.publicIndexDirectImport),
      pass(model.dependency.publicIndexDirectImport === false),
      7,
    ),
    rule(
      "DKS-V-DEP-004",
      "NoDklCapabilityDirectImport",
      "Dependency",
      "Critical",
      "Model must not import DKL-1 through DKL-8 directly.",
      model.dependency.dependencyId,
      "false",
      String(
        model.dependency.dkl1DirectImport ||
          model.dependency.dkl8DirectImport,
      ),
      pass(
        model.dependency.dkl1DirectImport === false &&
          model.dependency.dkl2DirectImport === false &&
          model.dependency.dkl3DirectImport === false &&
          model.dependency.dkl4DirectImport === false &&
          model.dependency.dkl5DirectImport === false &&
          model.dependency.dkl6DirectImport === false &&
          model.dependency.dkl7DirectImport === false &&
          model.dependency.dkl8DirectImport === false,
      ),
      8,
    ),

    // Composition (4)
    rule(
      "DKS-V-CMP-001",
      "SuiteModelPresent",
      "Composition",
      "Critical",
      "Exactly one suite composition root model must exist.",
      model.suite[0]?.modelId ?? "missing",
      "1",
      String(model.suite.length),
      pass(model.suite.length === 1),
      9,
    ),
    rule(
      "DKS-V-CMP-002",
      "ModelKindCountExact",
      "Composition",
      "Error",
      "Suite model must declare exactly 16 model kinds.",
      "modelKinds",
      "16",
      String(model.modelKinds.length),
      pass(model.modelKinds.length === 16),
      10,
    ),
    rule(
      "DKS-V-CMP-003",
      "RelationshipKindCountExact",
      "Composition",
      "Error",
      "Suite model must declare exactly 10 relationship kinds.",
      "relationships",
      "10",
      String(model.relationships.length),
      pass(model.relationships.length === 10),
      11,
    ),
    rule(
      "DKS-V-CMP-004",
      "NoUpstreamModelReconstruction",
      "Composition",
      "Critical",
      "Model must not reconstruct or duplicate upstream models.",
      "reconstructsUpstream",
      "false/false",
      `${String(model.reconstructsUpstream)}/${String(model.duplicatesUpstreamModels)}`,
      pass(
        model.reconstructsUpstream === false &&
          model.duplicatesUpstreamModels === false,
      ),
      12,
    ),

    // Capability (4)
    rule(
      "DKS-V-CAP-001",
      "CapabilityCountExact",
      "Capability",
      "Critical",
      "Capability catalog must contain exactly eight capabilities.",
      "capabilities",
      "8",
      String(model.capabilities.length),
      pass(model.capabilities.length === 8),
      13,
    ),
    rule(
      "DKS-V-CAP-002",
      "CapabilityIdsUnique",
      "Capability",
      "Critical",
      "Capability identifiers must be unique.",
      "capabilities.capabilityId",
      "unique",
      unique(capabilityIds) ? "unique" : "duplicate",
      pass(unique(capabilityIds)),
      14,
    ),
    rule(
      "DKS-V-CAP-003",
      "CapabilityIdsCanonical",
      "Capability",
      "Critical",
      "Capability identifiers must equal DKL-1 through DKL-8.",
      "capabilities.capabilityId",
      EXPECTED_CAPABILITIES.join(","),
      capabilityIds.join(","),
      pass(
        capabilityIds.length === 8 &&
          capabilityIds.every(
            (id, index) => id === EXPECTED_CAPABILITIES[index],
          ),
      ),
      15,
    ),
    rule(
      "DKS-V-CAP-004",
      "CapabilityReferencesComplete",
      "Capability",
      "Error",
      "Capability reference models must equal capability count.",
      "capabilityReferences",
      String(model.capabilities.length),
      String(model.capabilityReferences.length),
      pass(
        model.capabilityReferences.length === model.capabilities.length,
      ),
      16,
    ),

    // Ordering (4)
    rule(
      "DKS-V-ORD-001",
      "OrderingCountExact",
      "Ordering",
      "Critical",
      "Capability ordering models must contain eight entries.",
      "capabilityOrdering",
      "8",
      String(model.capabilityOrdering.length),
      pass(model.capabilityOrdering.length === 8),
      17,
    ),
    rule(
      "DKS-V-ORD-002",
      "OrderingMatchesCapabilities",
      "Ordering",
      "Critical",
      "Ordering capability IDs must match capability catalog order.",
      "capabilityOrdering",
      capabilityIds.join(","),
      orderingIds.join(","),
      pass(
        orderingIds.every((id, index) => id === capabilityIds[index]),
      ),
      18,
    ),
    rule(
      "DKS-V-ORD-003",
      "OrderingPositionsDeterministic",
      "Ordering",
      "Error",
      "Ordering positions must be 1..8 in sequence.",
      "capabilityOrdering.position",
      "1-8",
      model.capabilityOrdering.map((item) => item.position).join(","),
      pass(
        model.capabilityOrdering.every(
          (item, index) => item.position === index + 1,
        ),
      ),
      19,
    ),
    rule(
      "DKS-V-ORD-004",
      "SuiteOrderReferencePreserved",
      "Ordering",
      "Error",
      "Suite model capabilityOrder must equal Registry capabilityOrder.",
      "suite.capabilityOrder",
      "preserved",
      model.suite[0]?.capabilityOrder === model.registry.capabilityOrder
        ? "preserved"
        : "diverged",
      pass(
        model.suite[0]?.capabilityOrder === model.registry.capabilityOrder,
      ),
      20,
    ),

    // Reference Integrity (4)
    rule(
      "DKS-V-REF-001",
      "CapabilityRegistrationPreserved",
      "ReferenceIntegrity",
      "Critical",
      "Capability models must preserve Registry capability registrations.",
      "capabilities.capabilityRegistration",
      "preserved",
      model.capabilities.every(
        (item, index) =>
          item.capabilityRegistration === model.registry.capabilities[index],
      )
        ? "preserved"
        : "diverged",
      pass(
        model.capabilities.every(
          (item, index) =>
            item.capabilityRegistration ===
            model.registry.capabilities[index],
        ),
      ),
      21,
    ),
    rule(
      "DKS-V-REF-002",
      "DependencyRegistrationPreserved",
      "ReferenceIntegrity",
      "Critical",
      "Dependency models must preserve Registry dependency registrations.",
      "capabilityDependencies.dependencyRegistration",
      "preserved",
      model.capabilityDependencies.every(
        (item, index) =>
          item.dependencyRegistration === model.registry.dependencies[index],
      )
        ? "preserved"
        : "diverged",
      pass(
        model.capabilityDependencies.every(
          (item, index) =>
            item.dependencyRegistration ===
            model.registry.dependencies[index],
        ),
      ),
      22,
    ),
    rule(
      "DKS-V-REF-003",
      "IntegrationContractReferencesPreserved",
      "ReferenceIntegrity",
      "Error",
      "Integration contract references must preserve Registry entries.",
      "integrationContractReferences",
      "preserved",
      model.integrationContractReferences.every(
        (item, index) =>
          item.integrationContractRegistration ===
          model.registry.integrationContracts[index],
      )
        ? "preserved"
        : "diverged",
      pass(
        model.integrationContractReferences.every(
          (item, index) =>
            item.integrationContractRegistration ===
            model.registry.integrationContracts[index],
        ),
      ),
      23,
    ),
    rule(
      "DKS-V-REF-004",
      "RegistryPlatformPreserved",
      "ReferenceIntegrity",
      "Critical",
      "Model.registry must equal DataKnowledgeSuiteRegistryPlatform.",
      "registry",
      "preserved",
      model.registry === model.registry ? "preserved" : "diverged",
      pass(model.registry === DataKnowledgeSuiteModelPlatform.registry),
      24,
    ),

    // Platform (4)
    rule(
      "DKS-V-PLT-001",
      "PlatformReferenceCountExact",
      "Platform",
      "Critical",
      "Public platform references must equal eight.",
      "publicPlatformReferences",
      "8",
      String(model.publicPlatformReferences.length),
      pass(model.publicPlatformReferences.length === 8),
      25,
    ),
    rule(
      "DKS-V-PLT-002",
      "PlatformReferencesPreserved",
      "Platform",
      "Critical",
      "Public platform references must preserve Registry public platforms.",
      "publicPlatformReferences",
      "preserved",
      platformRefsPreserved ? "preserved" : "diverged",
      pass(platformRefsPreserved),
      26,
    ),
    rule(
      "DKS-V-PLT-003",
      "PlatformCapabilityIdsAligned",
      "Platform",
      "Error",
      "Platform reference capability IDs must match capability catalog.",
      "publicPlatformReferences.capabilityId",
      capabilityIds.join(","),
      model.publicPlatformReferences
        .map((item) => item.capabilityId)
        .join(","),
      pass(
        model.publicPlatformReferences.every(
          (item, index) => item.capabilityId === capabilityIds[index],
        ),
      ),
      27,
    ),
    rule(
      "DKS-V-PLT-004",
      "PlatformNoReconstruction",
      "Platform",
      "Error",
      "Platform reference models must not reconstruct upstream platforms.",
      "publicPlatformReferences.reconstructsUpstream",
      "false",
      model.publicPlatformReferences.every(
        (item) => item.reconstructsUpstream === false,
      )
        ? "false"
        : "true",
      pass(
        model.publicPlatformReferences.every(
          (item) => item.reconstructsUpstream === false,
        ),
      ),
      28,
    ),

    // API Registry (4)
    rule(
      "DKS-V-API-001",
      "ApiRegistryReferenceCountExact",
      "ApiRegistry",
      "Critical",
      "Public API registry references must equal eight.",
      "publicApiRegistryReferences",
      "8",
      String(model.publicApiRegistryReferences.length),
      pass(model.publicApiRegistryReferences.length === 8),
      29,
    ),
    rule(
      "DKS-V-API-002",
      "ApiRegistryReferencesPreserved",
      "ApiRegistry",
      "Critical",
      "API registry references must preserve Registry refs.",
      "publicApiRegistryReferences",
      "preserved",
      apiRefsPreserved ? "preserved" : "diverged",
      pass(apiRefsPreserved),
      30,
    ),
    rule(
      "DKS-V-API-003",
      "ApiRegistryNoDuplication",
      "ApiRegistry",
      "Error",
      "API registry refs must not duplicate upstream registries.",
      "publicApiRegistryReferences.publicApiRegistryRef.duplicatesUpstreamRegistry",
      "false",
      model.publicApiRegistryReferences.every(
        (item) =>
          item.publicApiRegistryRef.duplicatesUpstreamRegistry === false,
      )
        ? "false"
        : "true",
      pass(
        model.publicApiRegistryReferences.every(
          (item) =>
            item.publicApiRegistryRef.duplicatesUpstreamRegistry === false,
        ),
      ),
      31,
    ),
    rule(
      "DKS-V-API-004",
      "ApiCountAlignedWithReferences",
      "ApiRegistry",
      "Error",
      "API reference counts must align with capability publicApiCount.",
      "publicApiRegistryReferences.publicApiCount",
      "aligned",
      model.publicApiRegistryReferences.every(
        (item, index) =>
          item.publicApiRegistryRef.publicApiCount ===
          model.capabilities[index]?.capabilityRegistration.publicApiCount,
      )
        ? "aligned"
        : "misaligned",
      pass(
        model.publicApiRegistryReferences.every(
          (item, index) =>
            item.publicApiRegistryRef.publicApiCount ===
            model.capabilities[index]?.capabilityRegistration.publicApiCount,
        ),
      ),
      32,
    ),

    // Ownership (4)
    rule(
      "DKS-V-OWN-001",
      "OwnershipReferencePresent",
      "Ownership",
      "Critical",
      "Exactly one ownership reference model must exist.",
      "ownershipReferences",
      "1",
      String(model.ownershipReferences.length),
      pass(model.ownershipReferences.length === 1),
      33,
    ),
    rule(
      "DKS-V-OWN-002",
      "OwnershipReferencePreserved",
      "Ownership",
      "Critical",
      "Ownership reference must preserve Registry ownership aggregate.",
      "ownershipReferences.ownership",
      "preserved",
      ownershipPreserved ? "preserved" : "diverged",
      pass(ownershipPreserved),
      34,
    ),
    rule(
      "DKS-V-OWN-003",
      "OwnershipDeclaresSuiteComposition",
      "Ownership",
      "Error",
      "Ownership must include Suite composition among owned surfaces.",
      "ownership.aggregate.ownership.owns",
      "Suite composition",
      model.ownershipReferences[0]?.ownership.aggregate.ownership.owns.includes(
        "Suite composition",
      )
        ? "Suite composition"
        : "missing",
      pass(
        model.ownershipReferences[0]?.ownership.aggregate.ownership.owns.includes(
          "Suite composition",
        ) === true,
      ),
      35,
    ),
    rule(
      "DKS-V-OWN-004",
      "OwnershipExcludesRuntimeSurfaces",
      "Ownership",
      "Error",
      "Ownership must exclude knowledge retrieval and repository.",
      "ownership.doesNotOwn",
      "excluded",
      model.ownershipReferences[0]?.ownership.aggregate.ownership.doesNotOwn.includes(
        "Knowledge retrieval",
      ) &&
        model.ownershipReferences[0]?.ownership.aggregate.ownership.doesNotOwn.includes(
          "Repository",
        )
        ? "excluded"
        : "missing",
      pass(
        model.ownershipReferences[0]?.ownership.aggregate.ownership.doesNotOwn.includes(
          "Knowledge retrieval",
        ) === true &&
          model.ownershipReferences[0]?.ownership.aggregate.ownership.doesNotOwn.includes(
            "Repository",
          ) === true,
      ),
      36,
    ),

    // Boundaries (4)
    rule(
      "DKS-V-BND-001",
      "BoundaryReferencePresent",
      "Boundaries",
      "Critical",
      "Exactly one boundary reference model must exist.",
      "boundaryReferences",
      "1",
      String(model.boundaryReferences.length),
      pass(model.boundaryReferences.length === 1),
      37,
    ),
    rule(
      "DKS-V-BND-002",
      "BoundaryReferencePreserved",
      "Boundaries",
      "Critical",
      "Boundary reference must preserve Registry boundaries aggregate.",
      "boundaryReferences.boundaries",
      "preserved",
      boundariesPreserved ? "preserved" : "diverged",
      pass(boundariesPreserved),
      38,
    ),
    rule(
      "DKS-V-BND-003",
      "BoundaryRuntimeEnforcementAbsent",
      "Boundaries",
      "Error",
      "Boundaries must not enable runtime enforcement.",
      "boundaries.runtimeEnforcement",
      "false",
      String(
        model.boundaryReferences[0]?.boundaries.aggregate.boundaries
          .runtimeEnforcement,
      ),
      pass(
        model.boundaryReferences[0]?.boundaries.aggregate.boundaries
          .runtimeEnforcement === false,
      ),
      39,
    ),
    rule(
      "DKS-V-BND-004",
      "BoundaryProhibitsLowerLevelImports",
      "Boundaries",
      "Error",
      "Boundaries must prohibit lower-level DKL module imports.",
      "boundaries.importsLowerLevelDklModules",
      "false",
      String(
        model.boundaryReferences[0]?.boundaries.aggregate.boundaries
          .importsLowerLevelDklModules,
      ),
      pass(
        model.boundaryReferences[0]?.boundaries.aggregate.boundaries
          .importsLowerLevelDklModules === false,
      ),
      40,
    ),

    // Inventory (4)
    rule(
      "DKS-V-INV-001",
      "InventorySourcedThroughRegistry",
      "Inventory",
      "Critical",
      "Model inventory must be sourced through Registry.",
      "inventory.sourcedThroughRegistry",
      "true",
      String(model.inventory.sourcedThroughRegistry),
      pass(model.inventory.sourcedThroughRegistry === true),
      41,
    ),
    rule(
      "DKS-V-INV-002",
      "InventoryNotHardcoded",
      "Inventory",
      "Critical",
      "Model inventory must not hardcode or reconstruct counts.",
      "inventory.hardcoded/reconstructed",
      "false/false",
      `${String(model.inventory.hardcoded)}/${String(model.inventory.reconstructed)}`,
      pass(
        model.inventory.hardcoded === false &&
          model.inventory.reconstructed === false,
      ),
      42,
    ),
    rule(
      "DKS-V-INV-003",
      "PublicApiInventoryConsistent",
      "Inventory",
      "Critical",
      "Public API inventory total must match Registry inventory.",
      "inventory.publicApiInventoryTotal",
      String(model.registry.inventory.publicApiInventoryTotal),
      String(model.inventory.publicApiInventoryTotal),
      pass(inventoryApiTotalMatches),
      43,
    ),
    rule(
      "DKS-V-INV-004",
      "RegistryTotalEntryCountConsistent",
      "Inventory",
      "Error",
      "Registry total entry count must match Model inventory.",
      "inventory.registryTotalEntryCount",
      String(model.registry.inventory.totalEntryCount),
      String(model.inventory.registryTotalEntryCount),
      pass(inventoryRegistryTotalMatches),
      44,
    ),

    // Readiness (4)
    rule(
      "DKS-V-RDY-001",
      "ModelReadyForValidation",
      "Readiness",
      "Critical",
      "Model readiness must be ReadyForValidation.",
      DataKnowledgeSuiteModelReadiness,
      "ReadyForValidation",
      DataKnowledgeSuiteModelReadiness,
      pass(DataKnowledgeSuiteModelReadiness === "ReadyForValidation"),
      45,
    ),
    rule(
      "DKS-V-RDY-002",
      "CapabilityDependencyGraphCanonical",
      "Readiness",
      "Critical",
      "Capability dependency graph must follow DKL-1..DKL-8 order.",
      "capabilityDependencies",
      "canonical",
      canonicalDependencyGraph &&
        dependencyIds.every((id, index) => id === capabilityIds[index])
        ? "canonical"
        : "invalid",
      pass(
        canonicalDependencyGraph &&
          dependencyIds.every((id, index) => id === capabilityIds[index]),
      ),
      46,
    ),
    rule(
      "DKS-V-RDY-003",
      "NoRuntimeBehavior",
      "Readiness",
      "Critical",
      "Model platform must remain runtime-free.",
      "runtimeBehavior",
      "false",
      String(model.runtimeBehavior),
      pass(model.runtimeBehavior === false),
      47,
    ),
    rule(
      "DKS-V-RDY-004",
      "ImmutableAndDeterministic",
      "Readiness",
      "Critical",
      "Model platform must be immutable and deterministic.",
      "immutable/deterministic",
      "true/true",
      `${String(model.immutable)}/${String(model.deterministic)}`,
      pass(model.immutable === true && model.deterministic === true),
      48,
    ),
  ]);

export const DATA_KNOWLEDGE_SUITE_VALIDATION_RULE_COUNT =
  DataKnowledgeSuiteValidationRules.length;
