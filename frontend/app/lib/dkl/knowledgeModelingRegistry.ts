/**
 * DKL-4:2 — Knowledge Modeling Registry.
 *
 * Canonical immutable registry for every approved Knowledge Modeling concept
 * declared by DKL-4:1. Registers architecture definitions only. No construction,
 * lifecycle execution, inference, graph traversal, persistence, validation
 * execution, or business logic.
 *
 * Ownership: owned exclusively by DKL-4:2.
 */

import {
  KnowledgeModelingFoundation,
  KnowledgeModelingFoundationIdentity,
  KnowledgeModelingFoundationVersion,
} from "./knowledgeModelingFoundation.ts";
import { KnowledgeModelingBusinessObjectRegistry } from "./knowledgeModelingBusinessObjectRegistry.ts";
import {
  KnowledgeModelingBoundaryDeclarationRegistry,
  KnowledgeModelingCompatibilityPolicyRegistry,
  KnowledgeModelingCompositionTypeRegistry,
  KnowledgeModelingDependencyDeclarationRegistry,
  KnowledgeModelingEntityTypeRegistry,
  KnowledgeModelingExtensionPolicyRegistry,
  KnowledgeModelingHierarchyTypeRegistry,
  KnowledgeModelingIdentityTypeRegistry,
  KnowledgeModelingKnowledgeModelTypeRegistry,
  KnowledgeModelingKnowledgeObjectTypeRegistry,
  KnowledgeModelingLifecycleStateRegistry,
  KnowledgeModelingMetadataTypeRegistry,
  KnowledgeModelingOwnershipDeclarationRegistry,
  KnowledgeModelingPublicFoundationApiRegistry,
  KnowledgeModelingReferenceTypeRegistry,
  KnowledgeModelingSemanticStructureTypeRegistry,
} from "./knowledgeModelingRegistryCatalog.ts";
import { KnowledgeModelingRelationshipRegistry } from "./knowledgeModelingRelationshipRegistry.ts";
import { KnowledgeModelingRegistryOwnership } from "./knowledgeModelingRegistryOwnership.ts";
import { KnowledgeModelingRegistryDependencies } from "./knowledgeModelingRegistryDependencies.ts";
import type {
  KnowledgeModelingRegistryCollectionsDescriptor,
  KnowledgeModelingRegistryIdentityDescriptor,
  KnowledgeModelingRegistrySummaryDescriptor,
} from "./knowledgeModelingRegistryTypes.ts";

export const KnowledgeModelingRegistryVersion = "1.0.0";

export const KnowledgeModelingRegistryNamespace =
  "nexora.dkl.knowledge-modeling.registry";

export const KnowledgeModelingRegistryIdentity: KnowledgeModelingRegistryIdentityDescriptor =
  Object.freeze({
    registryId: "DKL-4:2/KnowledgeModelingRegistry",
    registryVersion: KnowledgeModelingRegistryVersion,
    registryName: "Knowledge Modeling Registry",
    registryNamespace: KnowledgeModelingRegistryNamespace,
    owner: "DKL-4 Knowledge Modeling Registry",
    sourcePhase: "DKL-4:2",
    platformId: "DKL-4",
    platformVersion: KnowledgeModelingRegistryVersion,
    status: "RegistryComplete",
    readiness: "ReadyForModel",
  });

export const KnowledgeModelingRegistryCollections: KnowledgeModelingRegistryCollectionsDescriptor =
  Object.freeze({
    knowledgeModelTypes: KnowledgeModelingKnowledgeModelTypeRegistry,
    knowledgeObjectTypes: KnowledgeModelingKnowledgeObjectTypeRegistry,
    businessObjectTypes: KnowledgeModelingBusinessObjectRegistry,
    entityTypes: KnowledgeModelingEntityTypeRegistry,
    relationshipTypes: KnowledgeModelingRelationshipRegistry,
    identityTypes: KnowledgeModelingIdentityTypeRegistry,
    metadataTypes: KnowledgeModelingMetadataTypeRegistry,
    hierarchyTypes: KnowledgeModelingHierarchyTypeRegistry,
    compositionTypes: KnowledgeModelingCompositionTypeRegistry,
    referenceTypes: KnowledgeModelingReferenceTypeRegistry,
    semanticStructureTypes: KnowledgeModelingSemanticStructureTypeRegistry,
    lifecycleStates: KnowledgeModelingLifecycleStateRegistry,
    ownershipDeclarations: KnowledgeModelingOwnershipDeclarationRegistry,
    boundaryDeclarations: KnowledgeModelingBoundaryDeclarationRegistry,
    extensionPolicies: KnowledgeModelingExtensionPolicyRegistry,
    compatibilityPolicies: KnowledgeModelingCompatibilityPolicyRegistry,
    dependencyDeclarations: KnowledgeModelingDependencyDeclarationRegistry,
    publicFoundationApis: KnowledgeModelingPublicFoundationApiRegistry,
  });

const TOTAL_ENTRY_COUNT =
  KnowledgeModelingRegistryCollections.knowledgeModelTypes.length +
  KnowledgeModelingRegistryCollections.knowledgeObjectTypes.length +
  KnowledgeModelingRegistryCollections.businessObjectTypes.length +
  KnowledgeModelingRegistryCollections.entityTypes.length +
  KnowledgeModelingRegistryCollections.relationshipTypes.length +
  KnowledgeModelingRegistryCollections.identityTypes.length +
  KnowledgeModelingRegistryCollections.metadataTypes.length +
  KnowledgeModelingRegistryCollections.hierarchyTypes.length +
  KnowledgeModelingRegistryCollections.compositionTypes.length +
  KnowledgeModelingRegistryCollections.referenceTypes.length +
  KnowledgeModelingRegistryCollections.semanticStructureTypes.length +
  KnowledgeModelingRegistryCollections.lifecycleStates.length +
  KnowledgeModelingRegistryCollections.ownershipDeclarations.length +
  KnowledgeModelingRegistryCollections.boundaryDeclarations.length +
  KnowledgeModelingRegistryCollections.extensionPolicies.length +
  KnowledgeModelingRegistryCollections.compatibilityPolicies.length +
  KnowledgeModelingRegistryCollections.dependencyDeclarations.length +
  KnowledgeModelingRegistryCollections.publicFoundationApis.length;

export const KnowledgeModelingRegistrySummary: KnowledgeModelingRegistrySummaryDescriptor =
  Object.freeze({
    registryId: KnowledgeModelingRegistryIdentity.registryId,
    registryVersion: KnowledgeModelingRegistryVersion,
    registryCategoryCount: 18,
    totalEntryCount: TOTAL_ENTRY_COUNT,
    businessObjectTypeCount: KnowledgeModelingBusinessObjectRegistry.length,
    relationshipTypeCount: KnowledgeModelingRelationshipRegistry.length,
    lifecycleStateCount: KnowledgeModelingFoundation.lifecycle.stateCount,
    publicFoundationApiCount: KnowledgeModelingPublicFoundationApiRegistry.length,
    uniqueIdentifiersGuaranteed: true,
    uniqueNamesWithinRegistryGuaranteed: true,
    deterministicOrderingGuaranteed: true,
    immutableEntriesGuaranteed: true,
    registryCollectionsFrozen: true,
    metadataOnly: true,
    runtimeBehaviorForbidden: true,
    mutableRegistrationForbidden: true,
    dynamicPluginsForbidden: true,
    reflectionForbidden: true,
    autoDiscoveryForbidden: true,
    status: "RegistryComplete",
    readiness: "ReadyForModel",
  });

/** Canonical immutable Knowledge Modeling Registry aggregate. */
export const KnowledgeModelingRegistry = Object.freeze({
  identity: KnowledgeModelingRegistryIdentity,
  version: KnowledgeModelingRegistryVersion,
  namespace: KnowledgeModelingRegistryNamespace,
  foundation: Object.freeze({
    identity: KnowledgeModelingFoundationIdentity,
    version: KnowledgeModelingFoundationVersion,
    readiness: KnowledgeModelingFoundation.readiness.ReadyForRegistry,
    referencedThroughPublicFoundation: true,
  }),
  collections: KnowledgeModelingRegistryCollections,
  ownership: KnowledgeModelingRegistryOwnership,
  dependencies: KnowledgeModelingRegistryDependencies,
  summary: KnowledgeModelingRegistrySummary,
  guarantees: Object.freeze({
    uniqueIdentifiers: true,
    uniqueNamesWithinEachRegistry: true,
    deterministicOrdering: true,
    immutableEntries: true,
    frozenRegistryCollections: true,
    explicitOwnership: true,
    explicitSourcePhase: true,
    noDuplicateArchitecturalOwnership: true,
    noInternalImplementationReferences: true,
    noRuntimeConstruction: true,
    noMutableRegistration: true,
    noDynamicPlugins: true,
    noReflection: true,
    noAutoDiscovery: true,
    noSourceCodeScanning: true,
    noEnvironmentDependentBehavior: true,
  }),
  readiness: Object.freeze({
    RegistryComplete: true,
    ReadyForModel: true,
    MetadataOnly: true,
    RuntimeBehaviorForbidden: true,
    KnowledgeObjectConstructionForbidden: true,
    LifecycleExecutionForbidden: true,
    InferenceForbidden: true,
    GraphTraversalForbidden: true,
    PersistenceForbidden: true,
    BusinessLogicForbidden: true,
    Deterministic: true,
    Immutable: true,
  }),
  completionStatus: Object.freeze([
    "RegistryComplete",
    "KnowledgeModelTypesRegistered",
    "BusinessObjectTypesRegistered",
    "RelationshipTypesRegistered",
    "FoundationApisRegistered",
    "OwnershipRegistered",
    "BoundaryDeclarationsRegistered",
    "DependencyDeclarationsRegistered",
    "MetadataOnly",
    "ReadyForModel",
  ]),
  nextPhase: "DKL-4:3 — Knowledge Modeling Model",
  metadataOnly: true,
  registryOnly: true,
  immutable: true,
  deterministic: true,
});

export {
  KnowledgeModelingRegistryOwnership,
  KnowledgeModelingRegistryDependencies,
};
