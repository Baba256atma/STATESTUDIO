/**
 * DKL-8:7 — Knowledge Governance Certification Criteria.
 *
 * Exactly eighteen certification criteria evaluated against Platform metadata.
 * Outcomes are deterministic. No repair, enforcement, or mutation.
 *
 * Ownership: owned exclusively by DKL-8:7.
 */

import { KnowledgeGovernancePlatform } from "./knowledgeGovernancePlatform.ts";
import type {
  KnowledgeGovernanceCertificationCategory,
  KnowledgeGovernanceCertificationCategoryDescriptor,
  KnowledgeGovernanceCertificationCriterion,
  KnowledgeGovernanceCertificationOutcome,
  KnowledgeGovernanceCertificationOutcomeDescriptor,
} from "./knowledgeGovernanceCertificationTypes.ts";

const platform = KnowledgeGovernancePlatform;

const pass = (condition: boolean): KnowledgeGovernanceCertificationOutcome =>
  condition ? "Pass" : "Fail";

const unique = (values: readonly string[]): boolean =>
  new Set(values).size === values.length;

const EXPECTED_PLATFORM_APIS = Object.freeze([
  "KnowledgeGovernancePlatformId",
  "KnowledgeGovernancePlatformVersion",
  "KnowledgeGovernancePlatformName",
  "KnowledgeGovernancePlatformNamespace",
  "KnowledgeGovernancePlatformStatus",
  "KnowledgeGovernancePlatformReadiness",
  "KnowledgeGovernancePlatform",
  "getKnowledgeGovernancePlatformSummary",
] as const);

const CATEGORY_ORDER: readonly KnowledgeGovernanceCertificationCategory[] =
  Object.freeze([
    "Identity",
    "Dependency",
    "Architecture",
    "PublicSurface",
    "Inventory",
    "ReferenceIntegrity",
    "Ownership",
    "Boundary",
    "Compatibility",
    "Immutability",
    "Determinism",
    "RuntimeProhibition",
    "Readiness",
  ]);

/** Exactly thirteen closed certification categories. */
export const KnowledgeGovernanceCertificationCategories: readonly KnowledgeGovernanceCertificationCategoryDescriptor[] =
  Object.freeze(
    CATEGORY_ORDER.map((category, index) =>
      Object.freeze({
        categoryId: `DKL-8:7/Category/${category}`,
        category,
        description: `Certification category for ${category} guarantees.`,
        deterministicOrder: index + 1,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );

/** Exactly four closed certification outcomes. */
export const KnowledgeGovernanceCertificationOutcomes: readonly KnowledgeGovernanceCertificationOutcomeDescriptor[] =
  Object.freeze([
    Object.freeze({
      outcomeId: "DKL-8:7/Outcome/Pass",
      outcome: "Pass" as const,
      description: "Criterion satisfied.",
      isAuthorizationOutcome: false as const,
      deterministicOrder: 1,
    }),
    Object.freeze({
      outcomeId: "DKL-8:7/Outcome/Fail",
      outcome: "Fail" as const,
      description: "Criterion not satisfied.",
      isAuthorizationOutcome: false as const,
      deterministicOrder: 2,
    }),
    Object.freeze({
      outcomeId: "DKL-8:7/Outcome/NotApplicable",
      outcome: "NotApplicable" as const,
      description: "Criterion not applicable.",
      isAuthorizationOutcome: false as const,
      deterministicOrder: 3,
    }),
    Object.freeze({
      outcomeId: "DKL-8:7/Outcome/NotEvaluated",
      outcome: "NotEvaluated" as const,
      description: "Criterion not evaluated.",
      isAuthorizationOutcome: false as const,
      deterministicOrder: 4,
    }),
  ]);

const criterion = (
  order: number,
  name: KnowledgeGovernanceCertificationCriterion["name"],
  description: string,
  category: KnowledgeGovernanceCertificationCategory,
  blocking: boolean,
  expected: string,
  actual: string,
  outcome: KnowledgeGovernanceCertificationOutcome,
  evidenceReferences: readonly string[],
): KnowledgeGovernanceCertificationCriterion =>
  Object.freeze({
    id: `DKL-8:7/Criterion/${name}`,
    name,
    description,
    category,
    required: true as const,
    blocking,
    sourcePhase: "DKL-8:7" as const,
    targetReference: platform.identity.platformId,
    outcome,
    status: "Active" as const,
    evidenceReferences: Object.freeze([...evidenceReferences]),
    expected,
    actual,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

const apiExportNames = platform.apiRegistry.map((item) => item.exportName);
const apiIds = platform.apiRegistry.map((item) => item.apiId);

const identityPass =
  platform.identity.platformId === "DKL-8:6/KnowledgeGovernancePlatform" &&
  platform.identity.platformVersion === "1.0.0" &&
  platform.identity.platformNamespace ===
    "nexora.dkl.knowledge-governance.platform" &&
  platform.status === "PlatformDefined" &&
  platform.readiness === "ReadyForCertification" &&
  platform.nextPhase === "DKL-8:7 — Knowledge Governance Certification";

const dependencyPass =
  platform.dependency.directPreviousPhaseModule ===
    "knowledgeGovernanceManifest.ts" &&
  platform.dependency.manifestOnly === true &&
  platform.dependency.validationDirectImport === false &&
  platform.dependency.modelDirectImport === false &&
  platform.dependency.registryDirectImport === false &&
  platform.dependency.foundationDirectImport === false &&
  platform.dependency.dkl7DirectImport === false;

const architecturePass =
  platform.architecture.completedPhaseCount === 6 &&
  platform.architecture.futurePhaseCount === 3 &&
  platform.architecture.phases.length === 9 &&
  platform.architecture.chainIds.platformId ===
    "DKL-8:6/KnowledgeGovernancePlatform" &&
  platform.architecture.architectureStatus === "CompleteThroughPlatform";

const publicSurfacePass =
  platform.apiRegistry.length === 8 &&
  unique(apiIds) &&
  unique(apiExportNames) &&
  EXPECTED_PLATFORM_APIS.every((name, index) => apiExportNames[index] === name);

const apiRegistryPass =
  platform.counts.publicApiCount === platform.apiRegistry.length &&
  platform.apiRegistry.every(
    (item, index) => item.deterministicOrder === index + 1,
  ) &&
  platform.apiRegistry.every((item) => item.runtimeService === false);

const manifestReferencePass =
  platform.manifest === KnowledgeGovernancePlatform.manifest &&
  platform.manifest.identity.manifestId ===
    platform.architecture.chainIds.manifestId;

const validationReferencePass =
  platform.validation === platform.manifest.upstreamValidation &&
  platform.validation === KnowledgeGovernancePlatform.validation;

const modelReferencePass =
  platform.model === platform.validation.model &&
  platform.model === KnowledgeGovernancePlatform.model;

const registryReferencePass =
  platform.registry === platform.model.registry &&
  platform.registry === KnowledgeGovernancePlatform.registry;

const foundationReferencePass =
  platform.foundation === platform.registry.foundation &&
  platform.foundation === KnowledgeGovernancePlatform.foundation;

const ownershipPass =
  platform.ownership === platform.manifest.ownership &&
  platform.ownership === KnowledgeGovernancePlatform.ownership &&
  platform.ownership.preservedByReference === true &&
  platform.ownership.ownedCount === platform.ownership.owns.length &&
  platform.ownership.nonOwnedCount === platform.ownership.doesNotOwn.length;

const boundariesPass =
  platform.boundaries === platform.manifest.boundaries &&
  platform.boundaries === KnowledgeGovernancePlatform.boundaries &&
  platform.boundaries.length === platform.inventory.boundaryCount;

const canonicalInventoryPass =
  platform.inventory.manifestTotalEntryCount ===
    platform.manifest.inventory.totalEntryCount &&
  platform.inventory.registryEntryCount ===
    platform.manifest.inventory.registryEntryCount &&
  platform.inventory.modelKindCount ===
    platform.manifest.inventory.modelKindCount &&
  platform.inventory.relationshipKindCount ===
    platform.manifest.inventory.relationshipKindCount &&
  platform.inventory.validationRuleCount ===
    platform.manifest.inventory.validationRuleCount &&
  platform.inventory.validationCategoryCount ===
    platform.manifest.inventory.validationCategoryCount &&
  platform.inventory.validationGateCount ===
    platform.manifest.inventory.validationGateCount;

const inventoryConsistencyPass =
  platform.inventory.registryEntryCount ===
    platform.registry.totalEntryCount &&
  platform.inventory.modelKindCount === platform.model.modelKinds.length &&
  platform.inventory.relationshipKindCount ===
    platform.model.relationships.kinds.length &&
  platform.inventory.validationRuleCount ===
    platform.validation.rules.length &&
  platform.inventory.validationCategoryCount ===
    platform.validation.categories.length &&
  platform.inventory.validationGateCount ===
    platform.validation.gates.length &&
  platform.counts.publicApiCount === platform.apiRegistry.length &&
  platform.counts.guaranteeCount === platform.guarantees.length &&
  platform.counts.compatibilityCount === platform.compatibility.length &&
  platform.inventory.totalEntryCount ===
    platform.inventory.completedPhaseCount +
      platform.inventory.futurePhaseCount +
      platform.inventory.dependencyCount +
      platform.inventory.manifestTotalEntryCount +
      platform.inventory.guaranteeCount +
      platform.inventory.compatibilityCount +
      platform.inventory.publicApiCount;

const immutabilityPass =
  Object.isFrozen(platform) &&
  Object.isFrozen(platform.identity) &&
  Object.isFrozen(platform.metadata) &&
  Object.isFrozen(platform.inventory) &&
  Object.isFrozen(platform.counts) &&
  Object.isFrozen(platform.apiRegistry) &&
  Object.isFrozen(platform.guarantees) &&
  Object.isFrozen(platform.compatibility) &&
  platform.immutable === true &&
  platform.ownership.metadataOnly === true;

const determinismPass =
  platform.deterministic === true &&
  platform.metadata.deterministic === true &&
  platform.inventory.deterministic === true &&
  platform.identity.platformVersion === "1.0.0";

const runtimeProhibitionPass =
  platform.runtimeBehavior === false &&
  platform.runtimeEnforcement === false &&
  platform.policyExecution === false &&
  platform.authenticationBehavior === false &&
  platform.authorizationBehavior === false &&
  platform.repositoryAccess === false &&
  platform.searchExecution === false &&
  platform.graphTraversal === false &&
  platform.aiBehavior === false &&
  platform.transportBehavior === false &&
  platform.engineReasoning === false &&
  platform.advisorBehavior === false &&
  platform.directorBehavior === false &&
  platform.sceneBehavior === false &&
  platform.uiBehavior === false &&
  platform.validates === false &&
  platform.executes === false &&
  platform.enforces === false &&
  platform.persists === false &&
  platform.retrieves === false;

const freezeReadinessPass =
  identityPass &&
  dependencyPass &&
  architecturePass &&
  publicSurfacePass &&
  canonicalInventoryPass &&
  inventoryConsistencyPass &&
  immutabilityPass &&
  runtimeProhibitionPass &&
  platform.compatibility.every((item) => item.compatible === true) &&
  platform.guarantees.every((item) => item.status === true) &&
  platform.readiness === "ReadyForCertification" &&
  platform.status === "PlatformDefined";

/** Exactly eighteen certification criteria. */
export const KnowledgeGovernanceCertificationCriteria: readonly KnowledgeGovernanceCertificationCriterion[] =
  Object.freeze([
    criterion(
      1,
      "IdentityCertified",
      "Platform identity, version, namespace, status, readiness, and next phase match canonical values.",
      "Identity",
      true,
      "DKL-8:6/KnowledgeGovernancePlatform; 1.0.0; PlatformDefined; ReadyForCertification",
      `${platform.identity.platformId}; ${platform.identity.platformVersion}; ${platform.status}; ${platform.readiness}`,
      pass(identityPass),
      Object.freeze(["DKL-8:7/Evidence/PlatformIdentity"]),
    ),
    criterion(
      2,
      "DependencyCertified",
      "Platform declares Manifest-only direct dependency without upstream direct imports.",
      "Dependency",
      true,
      "manifestOnly=true; no Validation/Model/Registry/Foundation/DKL-7 direct imports",
      `manifestOnly=${platform.dependency.manifestOnly}; module=${platform.dependency.directPreviousPhaseModule}`,
      pass(dependencyPass),
      Object.freeze(["DKL-8:7/Evidence/PlatformDependency"]),
    ),
    criterion(
      3,
      "ArchitectureChainCertified",
      "Platform architecture completes six phases with three future phases and intact chain IDs.",
      "Architecture",
      true,
      "completed=6; future=3; total=9; CompleteThroughPlatform",
      `completed=${platform.architecture.completedPhaseCount}; future=${platform.architecture.futurePhaseCount}; total=${platform.architecture.phases.length}`,
      pass(architecturePass),
      Object.freeze(["DKL-8:7/Evidence/ArchitectureChain"]),
    ),
    criterion(
      4,
      "PublicSurfaceCertified",
      "Platform API registry exposes exactly eight canonical top-level public APIs in stable order.",
      "PublicSurface",
      true,
      EXPECTED_PLATFORM_APIS.join(", "),
      apiExportNames.join(", "),
      pass(publicSurfacePass),
      Object.freeze(["DKL-8:7/Evidence/PublicSurface"]),
    ),
    criterion(
      5,
      "ApiRegistryCertified",
      "Platform API registry IDs are unique, ordered, and metadata-only.",
      "PublicSurface",
      true,
      "count=8; unique IDs; deterministicOrder 1..8; runtimeService=false",
      `count=${platform.apiRegistry.length}; publicApiCount=${platform.counts.publicApiCount}`,
      pass(apiRegistryPass),
      Object.freeze(["DKL-8:7/Evidence/ApiRegistry"]),
    ),
    criterion(
      6,
      "ManifestReferenceCertified",
      "Platform.manifest is preserved by canonical Manifest reference.",
      "ReferenceIntegrity",
      true,
      "platform.manifest === KnowledgeGovernancePlatform.manifest",
      `manifestId=${platform.manifest.identity.manifestId}`,
      pass(manifestReferencePass),
      Object.freeze(["DKL-8:7/Evidence/ManifestReference"]),
    ),
    criterion(
      7,
      "ValidationReferenceCertified",
      "Platform.validation equals Manifest.upstreamValidation by reference.",
      "ReferenceIntegrity",
      true,
      "platform.validation === platform.manifest.upstreamValidation",
      `validationId=${platform.validation.identity.validationId}`,
      pass(validationReferencePass),
      Object.freeze(["DKL-8:7/Evidence/ValidationReference"]),
    ),
    criterion(
      8,
      "ModelReferenceCertified",
      "Platform.model equals Validation.model by reference.",
      "ReferenceIntegrity",
      true,
      "platform.model === platform.validation.model",
      `modelId=${platform.model.identity.modelId}`,
      pass(modelReferencePass),
      Object.freeze(["DKL-8:7/Evidence/ModelReference"]),
    ),
    criterion(
      9,
      "RegistryReferenceCertified",
      "Platform.registry equals Model.registry by reference.",
      "ReferenceIntegrity",
      true,
      "platform.registry === platform.model.registry",
      `registryId=${platform.registry.identity.registryId}`,
      pass(registryReferencePass),
      Object.freeze(["DKL-8:7/Evidence/RegistryReference"]),
    ),
    criterion(
      10,
      "FoundationReferenceCertified",
      "Platform.foundation equals Registry.foundation by reference.",
      "ReferenceIntegrity",
      true,
      "platform.foundation === platform.registry.foundation",
      `foundationId=${platform.foundation.identity.foundationId}`,
      pass(foundationReferencePass),
      Object.freeze(["DKL-8:7/Evidence/FoundationReference"]),
    ),
    criterion(
      11,
      "OwnershipCertified",
      "Ownership collection is Manifest-preserved by reference with consistent counts.",
      "Ownership",
      true,
      "ownership === manifest.ownership; counts match collection lengths",
      `owned=${platform.ownership.ownedCount}; nonOwned=${platform.ownership.nonOwnedCount}`,
      pass(ownershipPass),
      Object.freeze(["DKL-8:7/Evidence/Ownership"]),
    ),
    criterion(
      12,
      "BoundariesCertified",
      "Boundary collection is Manifest-preserved by reference with inventory alignment.",
      "Boundary",
      true,
      "boundaries === manifest.boundaries; length === inventory.boundaryCount",
      `boundaryCount=${platform.boundaries.length}`,
      pass(boundariesPass),
      Object.freeze(["DKL-8:7/Evidence/Boundaries"]),
    ),
    criterion(
      13,
      "CanonicalInventoryCertified",
      "Platform inventory upstream counts are sourced through Manifest inventory.",
      "Inventory",
      true,
      "Platform inventory counts equal Manifest inventory counts",
      `manifestTotal=${platform.inventory.manifestTotalEntryCount}; registry=${platform.inventory.registryEntryCount}; kinds=${platform.inventory.modelKindCount}; rules=${platform.inventory.validationRuleCount}`,
      pass(canonicalInventoryPass),
      Object.freeze(["DKL-8:7/Evidence/CanonicalInventory"]),
    ),
    criterion(
      14,
      "InventoryConsistencyCertified",
      "Platform inventory counts are consistent with Platform-held upstream collections and counting rule.",
      "Inventory",
      true,
      "Inventory equals collection lengths and Platform counting rule",
      `totalEntryCount=${platform.inventory.totalEntryCount}`,
      pass(inventoryConsistencyPass),
      Object.freeze(["DKL-8:7/Evidence/InventoryConsistency"]),
    ),
    criterion(
      15,
      "ImmutabilityCertified",
      "Platform aggregate and key collections are frozen and declared immutable.",
      "Immutability",
      true,
      "Object.isFrozen(platform and key sections); immutable=true",
      `immutable=${platform.immutable}; frozen=${Object.isFrozen(platform)}`,
      pass(immutabilityPass),
      Object.freeze(["DKL-8:7/Evidence/Immutability"]),
    ),
    criterion(
      16,
      "DeterminismCertified",
      "Platform declares deterministic metadata without environment-derived behaviour.",
      "Determinism",
      true,
      "deterministic=true across platform/metadata/inventory",
      `deterministic=${platform.deterministic}`,
      pass(determinismPass),
      Object.freeze(["DKL-8:7/Evidence/Determinism"]),
    ),
    criterion(
      17,
      "RuntimeProhibitionsCertified",
      "Platform prohibits runtime enforcement, persistence, retrieval, AI, UI, Engine, and Advisor behaviour.",
      "RuntimeProhibition",
      true,
      "All runtime/enforcement/retrieval/AI/UI/Engine flags false",
      `runtime=${platform.runtimeBehavior}; enforce=${platform.enforces}; persist=${platform.persists}`,
      pass(runtimeProhibitionPass),
      Object.freeze(["DKL-8:7/Evidence/RuntimeProhibitions"]),
    ),
    criterion(
      18,
      "FreezeReadinessCertified",
      "Platform architecture is complete and ReadyForCertification, enabling Freeze readiness.",
      "Readiness",
      true,
      "ReadyForCertification with all blocking architecture criteria Pass",
      `${platform.readiness}; ${platform.status}`,
      pass(freezeReadinessPass),
      Object.freeze(["DKL-8:7/Evidence/FreezeReadiness"]),
    ),
  ]);

export const KnowledgeGovernanceCertificationCriterionCount =
  KnowledgeGovernanceCertificationCriteria.length;

export const KnowledgeGovernanceCertificationAllCriteriaPass =
  KnowledgeGovernanceCertificationCriteria.every(
    (item) => item.outcome === "Pass",
  );
