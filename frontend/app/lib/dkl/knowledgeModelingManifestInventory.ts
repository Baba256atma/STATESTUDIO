/**
 * DKL-4:5 — Knowledge Modeling Manifest Inventory.
 *
 * Immutable architectural inventory aggregating Foundation, Registry, Model,
 * and Validation metadata. Manifest only. No execution.
 *
 * Ownership: owned exclusively by DKL-4:5.
 */

import {
  KnowledgeModelingFoundation,
  KnowledgeModelingFoundationIdentity,
  KnowledgeModelingFoundationVersion,
} from "./knowledgeModelingFoundation.ts";
import {
  KnowledgeModelingRegistry,
  KnowledgeModelingRegistryIdentity,
  KnowledgeModelingRegistryVersion,
  KnowledgeModelingRegistrySummary,
  KnowledgeModelingRegistryCollections,
} from "./knowledgeModelingRegistry.ts";
import {
  KnowledgeModelingModel,
  KnowledgeModelingModelIdentity,
  KnowledgeModelingModelVersion,
  KnowledgeModelingModelCatalog,
  KnowledgeModelingModelRelationships,
} from "./knowledgeModelingModel.ts";
import {
  KnowledgeModelingValidation,
  KnowledgeModelingValidationIdentity,
  KnowledgeModelingValidationVersion,
  KnowledgeModelingValidationRules,
  KnowledgeModelingValidationReport,
} from "./knowledgeModelingValidation.ts";
import type { ManifestComponentEntry } from "./knowledgeModelingManifestTypes.ts";

const OWNER = "DKL-4 Knowledge Modeling Manifest";

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
  component("DKL-4:1/Foundation", "Knowledge Modeling Foundation", "DKL-4:1", "Foundation"),
  component("DKL-4:2/Registry", "Knowledge Modeling Registry", "DKL-4:2", "Registry"),
  component("DKL-4:3/Model", "Knowledge Modeling Model", "DKL-4:3", "Model"),
  component("DKL-4:4/Validation", "Knowledge Modeling Validation", "DKL-4:4", "Validation"),
  component("DKL-4:5/Manifest", "Knowledge Modeling Manifest", "DKL-4:5", "Manifest"),
]);

const REGISTRY_CATEGORIES = Object.freeze([
  "knowledgeModelTypes",
  "knowledgeObjectTypes",
  "businessObjectTypes",
  "entityTypes",
  "relationshipTypes",
  "identityTypes",
  "metadataTypes",
  "hierarchyTypes",
  "compositionTypes",
  "referenceTypes",
  "semanticStructureTypes",
  "lifecycleStates",
  "ownershipDeclarations",
  "boundaryDeclarations",
  "extensionPolicies",
  "compatibilityPolicies",
  "dependencyDeclarations",
  "publicFoundationApis",
] as const);

const PUBLIC_APIS = Object.freeze({
  foundation: Object.freeze([
    "KnowledgeModelingFoundation",
    "KnowledgeModelingFoundationVersion",
    "KnowledgeModelingFoundationIdentity",
    "KnowledgeModelingContracts",
    "KnowledgeModelingOwnership",
    "KnowledgeModelingBoundaries",
    "KnowledgeModelingLifecycle",
    "KnowledgeModelingDependencies",
  ]),
  registry: Object.freeze([
    "KnowledgeModelingRegistry",
    "KnowledgeModelingRegistryIdentity",
    "KnowledgeModelingRegistryVersion",
    "KnowledgeModelingRegistryNamespace",
    "KnowledgeModelingRegistryCollections",
    "KnowledgeModelingRegistryOwnership",
    "KnowledgeModelingRegistryDependencies",
    "KnowledgeModelingRegistrySummary",
  ]),
  model: Object.freeze([
    "KnowledgeModelingModel",
    "KnowledgeModelingModelIdentity",
    "KnowledgeModelingModelVersion",
    "KnowledgeModelingModelNamespace",
    "KnowledgeModelingModelCatalog",
    "KnowledgeModelingModelRelationships",
    "KnowledgeModelingModelOwnership",
    "KnowledgeModelingModelDependencies",
  ]),
  validation: Object.freeze([
    "KnowledgeModelingValidation",
    "KnowledgeModelingValidationIdentity",
    "KnowledgeModelingValidationVersion",
    "KnowledgeModelingValidationNamespace",
    "KnowledgeModelingValidationRules",
    "KnowledgeModelingValidationOwnership",
    "KnowledgeModelingValidationReport",
    "validateKnowledgeModelingArchitecture",
  ]),
  manifest: Object.freeze([
    "KnowledgeModelingManifest",
    "KnowledgeModelingManifestIdentity",
    "KnowledgeModelingManifestVersion",
    "KnowledgeModelingManifestNamespace",
    "KnowledgeModelingManifestInventory",
    "KnowledgeModelingManifestDependencies",
    "getKnowledgeModelingManifestSummary",
    "getKnowledgeModelingManifestStatistics",
  ]),
});

/** Canonical immutable architectural inventory for DKL-4. */
export const KnowledgeModelingManifestInventory = Object.freeze({
  inventoryId: "DKL-4:5/ManifestInventory",
  sourcePhase: "DKL-4:5" as const,
  owner: OWNER,
  components: COMPONENTS,
  componentCount: COMPONENTS.length as 5,
  publicApis: PUBLIC_APIS,
  foundation: Object.freeze({
    identity: KnowledgeModelingFoundationIdentity,
    version: KnowledgeModelingFoundationVersion,
    sourcePhase: "DKL-4:1" as const,
    status: KnowledgeModelingFoundationIdentity.status,
    readiness: KnowledgeModelingFoundationIdentity.readiness,
    contracts: KnowledgeModelingFoundation.contracts,
    ownershipOwns: KnowledgeModelingFoundation.ownership.owns,
    ownershipDoesNotOwn: KnowledgeModelingFoundation.ownership.doesNotOwn,
    boundaries: KnowledgeModelingFoundation.boundaries,
    lifecycleStates: KnowledgeModelingFoundation.lifecycle.states,
    lifecycleStateCount: KnowledgeModelingFoundation.lifecycle.stateCount,
    extensionPolicies: KnowledgeModelingFoundation.contracts.extensionPolicies,
    compatibilityPolicies: KnowledgeModelingFoundation.contracts.compatibilityPolicies,
    publicApiCount: 8 as const,
  }),
  registry: Object.freeze({
    identity: KnowledgeModelingRegistryIdentity,
    version: KnowledgeModelingRegistryVersion,
    sourcePhase: "DKL-4:2" as const,
    status: KnowledgeModelingRegistryIdentity.status,
    readiness: KnowledgeModelingRegistryIdentity.readiness,
    categories: REGISTRY_CATEGORIES,
    categoryCount: KnowledgeModelingRegistrySummary.registryCategoryCount,
    entryCount: KnowledgeModelingRegistrySummary.totalEntryCount,
    businessObjectCategories: Object.freeze(
      KnowledgeModelingRegistryCollections.businessObjectTypes.map((e) => e.name),
    ),
    businessObjectCategoryCount: KnowledgeModelingRegistrySummary.businessObjectTypeCount,
    relationshipCategories: Object.freeze(
      KnowledgeModelingRegistryCollections.relationshipTypes.map((e) => e.name),
    ),
    relationshipCategoryCount: KnowledgeModelingRegistrySummary.relationshipTypeCount,
    ownershipDeclarations: KnowledgeModelingRegistryCollections.ownershipDeclarations,
    boundaryDeclarations: KnowledgeModelingRegistryCollections.boundaryDeclarations,
    publicFoundationApiCount: KnowledgeModelingRegistrySummary.publicFoundationApiCount,
    publicApiCount: 8 as const,
  }),
  model: Object.freeze({
    identity: KnowledgeModelingModelIdentity,
    version: KnowledgeModelingModelVersion,
    sourcePhase: "DKL-4:3" as const,
    status: KnowledgeModelingModelIdentity.status,
    readiness: KnowledgeModelingModelIdentity.readiness,
    canonicalModels: KnowledgeModelingModelCatalog.modelKinds,
    canonicalModelIds: KnowledgeModelingModelCatalog.modelIds,
    canonicalModelCount: KnowledgeModelingModelCatalog.modelCount,
    modelRelationshipDeclarationCount:
      KnowledgeModelingModelRelationships.declarationCount,
    ownershipOwns: KnowledgeModelingModel.ownership.owns,
    ownershipDoesNotOwn: KnowledgeModelingModel.ownership.doesNotOwn,
    publicApiCount: 8 as const,
  }),
  validation: Object.freeze({
    identity: KnowledgeModelingValidationIdentity,
    version: KnowledgeModelingValidationVersion,
    sourcePhase: "DKL-4:4" as const,
    status: KnowledgeModelingValidationIdentity.status,
    readiness: KnowledgeModelingValidationIdentity.readiness,
    categories: KnowledgeModelingValidation.categories,
    categoryCount: KnowledgeModelingValidationReport.categoryCount,
    rules: KnowledgeModelingValidationRules,
    ruleCount: KnowledgeModelingValidationRules.length,
    passCount: KnowledgeModelingValidationReport.passCount,
    failCount: KnowledgeModelingValidationReport.failCount,
    validationStatus: KnowledgeModelingValidationReport.status,
    ownershipOwns: KnowledgeModelingValidation.ownership.owns,
    ownershipDoesNotOwn: KnowledgeModelingValidation.ownership.doesNotOwn,
    publicApiCount: 8 as const,
  }),
  ownershipSummary: Object.freeze({
    foundationOwns: KnowledgeModelingFoundation.ownership.owns,
    foundationDoesNotOwn: KnowledgeModelingFoundation.ownership.doesNotOwn,
    foundationOwnsCount: KnowledgeModelingFoundation.ownership.owns.length,
    foundationDoesNotOwnCount: KnowledgeModelingFoundation.ownership.doesNotOwn.length,
    registryOwnsCount: KnowledgeModelingRegistry.ownership.owns.length,
    modelOwnsCount: KnowledgeModelingModel.ownership.owns.length,
    validationOwnsCount: KnowledgeModelingValidation.ownership.owns.length,
    noDuplicateArchitecturalOwnership:
      KnowledgeModelingRegistry.ownership.noDuplicateArchitecturalOwnership === true,
  }),
  compatibilitySummary: Object.freeze({
    policyCount: KnowledgeModelingFoundation.contracts.compatibilityPolicies.length,
    policies: KnowledgeModelingFoundation.contracts.compatibilityPolicies,
  }),
  extensionSummary: Object.freeze({
    policyCount: KnowledgeModelingFoundation.contracts.extensionPolicies.length,
    policies: KnowledgeModelingFoundation.contracts.extensionPolicies,
  }),
  lifecycleSummary: Object.freeze({
    states: KnowledgeModelingFoundation.lifecycle.states,
    stateCount: KnowledgeModelingFoundation.lifecycle.stateCount,
  }),
  architecturalBoundaries: Object.freeze({
    foundation: KnowledgeModelingFoundation.boundaries,
    validation: KnowledgeModelingValidation.boundaries,
    metadataOnly: true,
    runtimeBehaviorForbidden: true,
    persistenceForbidden: true,
    aiForbidden: true,
    engineFree: true,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
