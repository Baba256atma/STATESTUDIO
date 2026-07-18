/**
 * DKL-5:5 — Knowledge Validation Manifest Inventory.
 *
 * Immutable architectural inventory aggregating Foundation, Registry, Model,
 * and Validation metadata by reference. Manifest only. No execution.
 *
 * Ownership: owned exclusively by DKL-5:5.
 */

import {
  KnowledgeValidationFoundation,
  KnowledgeValidationFoundationIdentity,
  KnowledgeValidationFoundationVersion,
} from "./knowledgeValidationFoundation.ts";
import {
  KnowledgeValidationRegistry,
  KnowledgeValidationRegistryIdentity,
  KnowledgeValidationRegistryVersion,
  KnowledgeValidationRegistryCollections,
  KnowledgeValidationRegistrySummary,
} from "./knowledgeValidationRegistry.ts";
import {
  KnowledgeValidationModel,
  KnowledgeValidationModelIdentity,
  KnowledgeValidationModelVersion,
  KnowledgeValidationModelCatalog,
  KnowledgeValidationModelRelationships,
} from "./knowledgeValidationModel.ts";
import {
  KnowledgeValidationValidation,
  KnowledgeValidationValidationIdentity,
  KnowledgeValidationValidationVersion,
  KnowledgeValidationValidationRules,
  KnowledgeValidationValidationCategories,
} from "./knowledgeValidationValidation.ts";
import type { ManifestComponentEntry } from "./knowledgeValidationManifestTypes.ts";

const OWNER = "DKL-5 Knowledge Validation Manifest";

const component = (
  componentId: string,
  componentName: string,
  sourcePhase: string,
  kind: string,
): ManifestComponentEntry =>
  Object.freeze({
    componentId,
    componentName,
    sourcePhase,
    kind,
    publicApiCount: 8 as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

const COMPONENTS: readonly ManifestComponentEntry[] = Object.freeze([
  component("DKL-5:1/Foundation", "Knowledge Validation Foundation", "DKL-5:1", "Foundation"),
  component("DKL-5:2/Registry", "Knowledge Validation Registry", "DKL-5:2", "Registry"),
  component("DKL-5:3/Model", "Knowledge Validation Model", "DKL-5:3", "Model"),
  component("DKL-5:4/Validation", "Knowledge Validation Validation", "DKL-5:4", "Validation"),
  component("DKL-5:5/Manifest", "Knowledge Validation Manifest", "DKL-5:5", "Manifest"),
]);

const PUBLIC_APIS = Object.freeze({
  foundation: Object.freeze([
    "KnowledgeValidationFoundation",
    "KnowledgeValidationFoundationIdentity",
    "KnowledgeValidationFoundationVersion",
    "KnowledgeValidationContracts",
    "KnowledgeValidationOwnership",
    "KnowledgeValidationBoundaries",
    "KnowledgeValidationLifecycle",
    "KnowledgeValidationDependencies",
  ]),
  registry: Object.freeze([
    "KnowledgeValidationRegistry",
    "KnowledgeValidationRegistryIdentity",
    "KnowledgeValidationRegistryVersion",
    "KnowledgeValidationRegistryNamespace",
    "KnowledgeValidationRegistryCollections",
    "KnowledgeValidationRegistryOwnership",
    "KnowledgeValidationRegistryDependencies",
    "KnowledgeValidationRegistrySummary",
  ]),
  model: Object.freeze([
    "KnowledgeValidationModel",
    "KnowledgeValidationModelIdentity",
    "KnowledgeValidationModelVersion",
    "KnowledgeValidationModelNamespace",
    "KnowledgeValidationModelCatalog",
    "KnowledgeValidationModelRelationships",
    "KnowledgeValidationModelOwnership",
    "KnowledgeValidationModelDependencies",
  ]),
  validation: Object.freeze([
    "KnowledgeValidationValidation",
    "KnowledgeValidationValidationIdentity",
    "KnowledgeValidationValidationVersion",
    "KnowledgeValidationValidationNamespace",
    "KnowledgeValidationValidationRules",
    "KnowledgeValidationValidationCategories",
    "runKnowledgeValidationValidation",
    "getKnowledgeValidationValidationSummary",
  ]),
  manifest: Object.freeze([
    "KnowledgeValidationManifest",
    "KnowledgeValidationManifestIdentity",
    "KnowledgeValidationManifestVersion",
    "KnowledgeValidationManifestNamespace",
    "KnowledgeValidationManifestInventory",
    "KnowledgeValidationManifestDependencies",
    "getKnowledgeValidationManifestSummary",
    "getKnowledgeValidationManifestStatistics",
  ]),
});

const foundationContracts = KnowledgeValidationFoundation.contracts;
const validationResult = KnowledgeValidationValidation.result;

/** Foundation inventory (DKL-5:1) — by reference. */
const FOUNDATION_INVENTORY = Object.freeze({
  identity: KnowledgeValidationFoundationIdentity,
  version: KnowledgeValidationFoundationVersion,
  namespace: KnowledgeValidationFoundationIdentity.foundationNamespace,
  sourcePhase: "DKL-5:1" as const,
  status: KnowledgeValidationFoundationIdentity.status,
  readiness: KnowledgeValidationFoundationIdentity.readiness,
  contractKinds: foundationContracts.contractKinds,
  contractKindCount: foundationContracts.contractKinds.length,
  validationTargets: foundationContracts.targetCategories,
  validationTargetCount: foundationContracts.targetCategories.length,
  validationDimensions: foundationContracts.dimensions,
  validationDimensionCount: foundationContracts.dimensions.length,
  qualitySignals: foundationContracts.qualitySignals,
  qualitySignalCount: foundationContracts.qualitySignals.length,
  outcomes: foundationContracts.outcomes,
  outcomeCount: foundationContracts.outcomes.length,
  severities: foundationContracts.severities,
  severityCount: foundationContracts.severities.length,
  trustDeclaration: foundationContracts.trustDeclaration,
  evidenceContracts: foundationContracts.evidenceAndFindings,
  ambiguityAndConflictContracts: foundationContracts.ambiguityAndConflict,
  lifecycleStates: KnowledgeValidationFoundation.lifecycle.states,
  lifecycleStateCount: KnowledgeValidationFoundation.lifecycle.stateCount,
  ownershipOwns: KnowledgeValidationFoundation.ownership.owns,
  ownershipDoesNotOwn: KnowledgeValidationFoundation.ownership.doesNotOwn,
  boundaries: KnowledgeValidationFoundation.boundaries,
  dependencies: KnowledgeValidationFoundation.dependencies,
  extensionPolicies: foundationContracts.extensionPolicies,
  compatibilityPolicies: foundationContracts.compatibilityPolicies,
  publicApiCount: 8 as const,
});

/** Registry inventory (DKL-5:2) — by reference. */
const REGISTRY_INVENTORY = Object.freeze({
  identity: KnowledgeValidationRegistryIdentity,
  version: KnowledgeValidationRegistryVersion,
  namespace: KnowledgeValidationRegistryIdentity.registryNamespace,
  sourcePhase: "DKL-5:2" as const,
  status: KnowledgeValidationRegistryIdentity.status,
  readiness: KnowledgeValidationRegistryIdentity.readiness,
  collectionNames: Object.freeze(
    Object.keys(KnowledgeValidationRegistryCollections),
  ),
  collectionCount: KnowledgeValidationRegistrySummary.registryCategoryCount,
  totalEntryCount: KnowledgeValidationRegistrySummary.totalEntryCount,
  targetEntryCount: KnowledgeValidationRegistrySummary.validationTargetCount,
  dimensionEntryCount: KnowledgeValidationRegistrySummary.validationDimensionCount,
  qualitySignalEntryCount: KnowledgeValidationRegistrySummary.qualitySignalCount,
  statusEntryCount: KnowledgeValidationRegistryCollections.validationStatuses.length,
  outcomeEntryCount: KnowledgeValidationRegistrySummary.outcomeCount,
  severityEntryCount: KnowledgeValidationRegistrySummary.severityCount,
  evidenceEntryCount: KnowledgeValidationRegistryCollections.evidenceTypes.length,
  findingEntryCount: KnowledgeValidationRegistryCollections.findingCategories.length,
  issueEntryCount: KnowledgeValidationRegistryCollections.issueCategories.length,
  conflictEntryCount: KnowledgeValidationRegistryCollections.conflictTypes.length,
  ambiguityEntryCount: KnowledgeValidationRegistryCollections.ambiguityTypes.length,
  trustLevelEntryCount: KnowledgeValidationRegistryCollections.trustLevels.length,
  lifecycleEntryCount:
    KnowledgeValidationRegistryCollections.validationLifecycleStates.length,
  ownershipDeclarations:
    KnowledgeValidationRegistryCollections.ownershipDeclarations,
  boundaryDeclarations:
    KnowledgeValidationRegistryCollections.boundaryDeclarations,
  compatibilityPolicies:
    KnowledgeValidationRegistryCollections.compatibilityPolicies,
  extensionPolicies: KnowledgeValidationRegistryCollections.extensionPolicies,
  dependencyDeclarations:
    KnowledgeValidationRegistryCollections.dependencyDeclarations,
  publicFoundationApiCount:
    KnowledgeValidationRegistrySummary.publicFoundationApiCount,
  publicApiCount: 8 as const,
});

/** Model inventory (DKL-5:3) — by reference. */
const MODEL_INVENTORY = Object.freeze({
  identity: KnowledgeValidationModelIdentity,
  version: KnowledgeValidationModelVersion,
  namespace: KnowledgeValidationModelIdentity.modelPhaseNamespace,
  sourcePhase: "DKL-5:3" as const,
  status: KnowledgeValidationModelIdentity.status,
  readiness: KnowledgeValidationModelIdentity.readiness,
  canonicalModelKinds: KnowledgeValidationModelCatalog.modelKinds,
  canonicalModelIds: KnowledgeValidationModelCatalog.modelIds,
  canonicalModelCount: KnowledgeValidationModelCatalog.modelCount,
  modelRelationshipCount: KnowledgeValidationModelRelationships.declarationCount,
  modelRelationships: KnowledgeValidationModelRelationships.declarations,
  consumerSuitabilityStates:
    KnowledgeValidationModelCatalog.consumerSuitabilityStates.states,
  executiveUsabilityCapabilities:
    KnowledgeValidationModelCatalog.executiveUsabilityCapabilities.capabilities,
  ownershipOwns: KnowledgeValidationModel.ownership.owns,
  ownershipDoesNotOwn: KnowledgeValidationModel.ownership.doesNotOwn,
  dependencies: KnowledgeValidationModel.dependencies,
  publicApiCount: 8 as const,
});

/** Validation inventory (DKL-5:4) — by reference. */
const VALIDATION_INVENTORY = Object.freeze({
  identity: KnowledgeValidationValidationIdentity,
  version: KnowledgeValidationValidationVersion,
  namespace: KnowledgeValidationValidationIdentity.validationNamespace,
  sourcePhase: "DKL-5:4" as const,
  status: KnowledgeValidationValidationIdentity.status,
  readiness: KnowledgeValidationValidationIdentity.readiness,
  categories: KnowledgeValidationValidationCategories,
  categoryCount: KnowledgeValidationValidationCategories.length,
  rules: KnowledgeValidationValidationRules,
  ruleCount: KnowledgeValidationValidationRules.length,
  ruleResultCount: validationResult.ruleResults.length,
  evidenceCount: validationResult.ruleResults.length,
  passCount: validationResult.summary.passCount,
  failCount: validationResult.summary.failCount,
  overallStatus: validationResult.overallStatus,
  phaseResults: validationResult.phaseResults,
  categoryResults: validationResult.categoryResults,
  ownershipOwns: KnowledgeValidationValidation.ownership.owns,
  ownershipDoesNotOwn: KnowledgeValidationValidation.ownership.doesNotOwn,
  publicApiCount: 8 as const,
});

/** Canonical immutable architectural inventory for DKL-5. */
export const KnowledgeValidationManifestInventory = Object.freeze({
  inventoryId: "DKL-5:5/ManifestInventory",
  sourcePhase: "DKL-5:5" as const,
  owner: OWNER,
  sectionOrder: Object.freeze([
    "metadata",
    "foundation",
    "registry",
    "model",
    "validation",
    "ownership",
    "boundary",
    "dependency",
    "compatibility",
    "extension",
    "guarantee",
    "readiness",
  ]),
  components: COMPONENTS,
  componentCount: COMPONENTS.length as 5,
  publicApis: PUBLIC_APIS,
  foundation: FOUNDATION_INVENTORY,
  registry: REGISTRY_INVENTORY,
  model: MODEL_INVENTORY,
  validation: VALIDATION_INVENTORY,
  ownershipSummary: Object.freeze({
    owns: Object.freeze([
      "Knowledge Validation vocabulary",
      "Validation contracts",
      "Registry identities",
      "Validation model contracts",
      "Architectural validation rules",
      "Validation evidence structures",
      "Quality-signal declarations",
      "Trust declarations",
      "Finding, issue, conflict, ambiguity, and limitation structures",
      "Consumer-readiness declarations",
      "Executive-usability declarations",
      "Manifest metadata",
    ]),
    doesNotOwn: Object.freeze([
      "Data ingestion",
      "Data parsing",
      "Broad cleansing",
      "Source-system correction",
      "Knowledge Modeling ownership",
      "Runtime Business Objects",
      "Runtime validation of live knowledge",
      "Numeric scoring",
      "Trust calculation",
      "AI confidence generation",
      "Entity resolution",
      "Semantic inference",
      "Conflict resolution",
      "Ambiguity resolution",
      "Remediation",
      "Persistence",
      "Repositories",
      "Search",
      "Queries",
      "Executive reasoning",
      "Advisor",
      "Scene",
      "UI",
      "Notifications",
      "Workflow orchestration",
    ]),
    foundationOwnsCount: KnowledgeValidationFoundation.ownership.owns.length,
    registryOwnsCount: KnowledgeValidationRegistry.ownership.owns.length,
    modelOwnsCount: KnowledgeValidationModel.ownership.owns.length,
    validationOwnsCount: KnowledgeValidationValidation.ownership.owns.length,
    noDuplicateArchitecturalOwnership:
      KnowledgeValidationRegistry.ownership.noDuplicateArchitecturalOwnership ===
        true &&
      KnowledgeValidationFoundation.guarantees
        .noDuplicateKnowledgeModelingOwnership === true,
    noOwnershipTransfer: true,
  }),
  boundarySummary: Object.freeze({
    foundation: KnowledgeValidationFoundation.boundaries,
    metadataOnly: true,
    runtimeValidationForbidden: true,
    scoringForbidden: true,
    trustCalculationForbidden: true,
    cleansingForbidden: true,
    remediationForbidden: true,
    persistenceForbidden: true,
    graphTraversalForbidden: true,
    aiForbidden: true,
    engineFree: true,
  }),
  guaranteeSummary: Object.freeze({
    oneCanonicalInventory: true,
    immutableMetadata: true,
    deterministicOrdering: true,
    frozenCollections: true,
    accurateCounts: true,
    publicEntryPointOnlyDependencies: true,
    noDuplicateOwnership: true,
    noArchitectureDuplication: true,
    noNewContracts: true,
    noNewRegistries: true,
    noNewModels: true,
    noNewValidationRules: true,
    noRuntimeKnowledgeValidation: true,
    noNumericScoring: true,
    noTrustCalculation: true,
    noAiConfidence: true,
    noCleansing: true,
    noRemediation: true,
    noPersistence: true,
    noGraphTraversal: true,
    noEngineBehavior: true,
    noSourceScanning: true,
    noEnvironmentDependentBehavior: true,
    readinessOnlyWhenValidationPass:
      KnowledgeValidationValidation.result.overallStatus === "Pass",
  }),
  lifecycleSummary: Object.freeze({
    states: KnowledgeValidationFoundation.lifecycle.states,
    stateCount: KnowledgeValidationFoundation.lifecycle.stateCount,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
