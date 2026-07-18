/**
 * DKL-4:3 — Knowledge Modeling Model.
 *
 * Canonical immutable model aggregate for DKL-4 Knowledge Modeling.
 * Publishes exactly eight runtime exports of model contracts. Model only —
 * no runtime instances, graph behavior, persistence, inference, or business logic.
 *
 * Ownership: owned exclusively by DKL-4:3.
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
} from "./knowledgeModelingRegistry.ts";
import {
  KnowledgeModelingEntityModel,
  KnowledgeModelingKnowledgeMetadataModel,
  KnowledgeModelingKnowledgeObjectModel,
} from "./knowledgeModelingKnowledgeObjectModel.ts";
import { KnowledgeModelingBusinessObjectModel } from "./knowledgeModelingBusinessObjectModel.ts";
import { KnowledgeModelingRelationshipModel } from "./knowledgeModelingRelationshipModel.ts";
import {
  KnowledgeModelingKnowledgeIdentityModel,
  KnowledgeModelingKnowledgeReferenceModel,
} from "./knowledgeModelingIdentityReferenceModels.ts";
import {
  KnowledgeModelingBoundaryModel,
  KnowledgeModelingCompositionModel,
  KnowledgeModelingContextModel,
  KnowledgeModelingHierarchyModel,
  KnowledgeModelingKnowledgeModel,
  KnowledgeModelingObjectSetModel,
  KnowledgeModelingProvenanceModel,
  KnowledgeModelingRelationshipSetModel,
  KnowledgeModelingSemanticStructureModel,
  KnowledgeModelingSnapshotModel,
  KnowledgeModelingStateModel,
  KnowledgeModelingSummaryModel,
  KnowledgeModelingVersionModel,
} from "./knowledgeModelingStructureModels.ts";
import type {
  CanonicalModelDescriptor,
  KnowledgeModelingModelPhaseIdentity,
} from "./knowledgeModelingModelTypes.ts";

export const KnowledgeModelingModelVersion = "1.0.0";

export const KnowledgeModelingModelNamespace =
  "nexora.dkl.knowledge-modeling.model";

export const KnowledgeModelingModelIdentity: KnowledgeModelingModelPhaseIdentity =
  Object.freeze({
    modelPhaseId: "DKL-4:3/KnowledgeModelingModel",
    modelPhaseVersion: KnowledgeModelingModelVersion,
    modelPhaseName: "Knowledge Modeling Model",
    modelPhaseNamespace: KnowledgeModelingModelNamespace,
    owner: "DKL-4 Knowledge Modeling Model",
    sourcePhase: "DKL-4:3",
    platformId: "DKL-4",
    platformVersion: KnowledgeModelingModelVersion,
    status: "ModelComplete",
    readiness: "ReadyForValidation",
  });

const CANONICAL_MODELS: readonly CanonicalModelDescriptor[] = Object.freeze([
  KnowledgeModelingKnowledgeModel,
  KnowledgeModelingKnowledgeObjectModel,
  KnowledgeModelingBusinessObjectModel,
  KnowledgeModelingEntityModel,
  KnowledgeModelingRelationshipModel,
  KnowledgeModelingKnowledgeIdentityModel,
  KnowledgeModelingKnowledgeMetadataModel,
  KnowledgeModelingHierarchyModel,
  KnowledgeModelingCompositionModel,
  KnowledgeModelingKnowledgeReferenceModel,
  KnowledgeModelingSemanticStructureModel,
  KnowledgeModelingSnapshotModel,
  KnowledgeModelingContextModel,
  KnowledgeModelingProvenanceModel,
  KnowledgeModelingStateModel,
  KnowledgeModelingRelationshipSetModel,
  KnowledgeModelingObjectSetModel,
  KnowledgeModelingBoundaryModel,
  KnowledgeModelingVersionModel,
  KnowledgeModelingSummaryModel,
]);

/** Ordered catalog of every canonical DKL-4:3 model descriptor. */
export const KnowledgeModelingModelCatalog = Object.freeze({
  catalogId: "DKL-4:3/ModelCatalog",
  models: CANONICAL_MODELS,
  modelCount: CANONICAL_MODELS.length,
  modelKinds: Object.freeze(CANONICAL_MODELS.map((model) => model.modelKind)),
  modelIds: Object.freeze(CANONICAL_MODELS.map((model) => model.modelId)),
  byKind: Object.freeze({
    KnowledgeModel: KnowledgeModelingKnowledgeModel,
    KnowledgeObject: KnowledgeModelingKnowledgeObjectModel,
    BusinessObject: KnowledgeModelingBusinessObjectModel,
    Entity: KnowledgeModelingEntityModel,
    Relationship: KnowledgeModelingRelationshipModel,
    KnowledgeIdentity: KnowledgeModelingKnowledgeIdentityModel,
    KnowledgeMetadata: KnowledgeModelingKnowledgeMetadataModel,
    KnowledgeHierarchy: KnowledgeModelingHierarchyModel,
    KnowledgeComposition: KnowledgeModelingCompositionModel,
    KnowledgeReference: KnowledgeModelingKnowledgeReferenceModel,
    SemanticStructure: KnowledgeModelingSemanticStructureModel,
    KnowledgeModelSnapshot: KnowledgeModelingSnapshotModel,
    KnowledgeModelContext: KnowledgeModelingContextModel,
    KnowledgeModelProvenance: KnowledgeModelingProvenanceModel,
    KnowledgeModelState: KnowledgeModelingStateModel,
    KnowledgeModelRelationshipSet: KnowledgeModelingRelationshipSetModel,
    KnowledgeModelObjectSet: KnowledgeModelingObjectSetModel,
    KnowledgeModelBoundary: KnowledgeModelingBoundaryModel,
    KnowledgeModelVersion: KnowledgeModelingVersionModel,
    KnowledgeModelSummary: KnowledgeModelingSummaryModel,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});

/** Structural relationships between model contracts. */
export const KnowledgeModelingModelRelationships = Object.freeze({
  relationshipsId: "DKL-4:3/ModelRelationships",
  declarations: Object.freeze([
    Object.freeze({
      id: "model-rel-business-object-composes-knowledge-object",
      from: "BusinessObject",
      to: "KnowledgeObject",
      kind: "Composes",
      description: "Business Object composes the Knowledge Object contract.",
    }),
    Object.freeze({
      id: "model-rel-knowledge-object-uses-identity",
      from: "KnowledgeObject",
      to: "KnowledgeIdentity",
      kind: "Uses",
      description: "Knowledge Object uses Knowledge Identity.",
    }),
    Object.freeze({
      id: "model-rel-knowledge-object-uses-metadata",
      from: "KnowledgeObject",
      to: "KnowledgeMetadata",
      kind: "Uses",
      description: "Knowledge Object uses Knowledge Metadata.",
    }),
    Object.freeze({
      id: "model-rel-relationship-references-objects",
      from: "Relationship",
      to: "KnowledgeObject",
      kind: "References",
      description: "Relationship references source and target Knowledge Objects.",
    }),
    Object.freeze({
      id: "model-rel-knowledge-model-contains-object-set",
      from: "KnowledgeModel",
      to: "KnowledgeModelObjectSet",
      kind: "Contains",
      description: "Knowledge Model contains an object set declaration.",
    }),
    Object.freeze({
      id: "model-rel-knowledge-model-contains-relationship-set",
      from: "KnowledgeModel",
      to: "KnowledgeModelRelationshipSet",
      kind: "Contains",
      description: "Knowledge Model contains a relationship set declaration.",
    }),
    Object.freeze({
      id: "model-rel-knowledge-model-uses-provenance",
      from: "KnowledgeModel",
      to: "KnowledgeModelProvenance",
      kind: "Uses",
      description: "Knowledge Model uses provenance declarations.",
    }),
    Object.freeze({
      id: "model-rel-knowledge-model-uses-context",
      from: "KnowledgeModel",
      to: "KnowledgeModelContext",
      kind: "Uses",
      description: "Knowledge Model uses context declarations.",
    }),
    Object.freeze({
      id: "model-rel-entity-uses-identity",
      from: "Entity",
      to: "KnowledgeIdentity",
      kind: "Uses",
      description: "Entity uses canonical Knowledge Identity.",
    }),
    Object.freeze({
      id: "model-rel-reference-links-identities",
      from: "KnowledgeReference",
      to: "KnowledgeIdentity",
      kind: "Links",
      description: "References link identities without runtime dereference.",
    }),
  ]),
  declarationCount: 10,
  graphTraversalForbidden: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});

/** Model-phase ownership metadata. */
export const KnowledgeModelingModelOwnership = Object.freeze({
  ownershipId: "DKL-4:3/ModelOwnership",
  owner: "DKL-4 Knowledge Modeling Model",
  sourcePhase: "DKL-4:3",
  owns: Object.freeze([
    "Canonical DKL-4 model contracts",
    "Structural relationships between model contracts",
    "Model identity metadata",
    "Model lifecycle metadata",
    "Model ownership metadata",
    "Model compatibility metadata",
    "Model extension metadata",
    "Registry-to-model references",
    "DKL-3 understanding references as metadata through DKL-4:1",
  ]),
  doesNotOwn: Object.freeze([
    "Data ingestion",
    "Parsing",
    "Data understanding execution",
    "Entity resolution",
    "Semantic inference",
    "Runtime object creation",
    "Graph construction",
    "Graph traversal",
    "Validation execution",
    "Persistence",
    "Repository implementation",
    "Query execution",
    "Search",
    "Executive reasoning",
    "Decisions",
    "Advisor",
    "Scene",
    "UI",
    "Orchestration",
  ]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});

/** Model-phase dependency metadata. */
export const KnowledgeModelingModelDependencies = Object.freeze({
  dependencyId: "DKL-4:3/ModelDependencies",
  sourcePhase: "DKL-4:3",
  approved: Object.freeze([
    Object.freeze({
      module: "knowledgeModelingFoundation.ts",
      phase: KnowledgeModelingFoundationIdentity.sourcePhase,
      version: KnowledgeModelingFoundationVersion,
      foundationId: KnowledgeModelingFoundationIdentity.foundationId,
      required: true,
      publicEntryPointOnly: true,
    }),
    Object.freeze({
      module: "knowledgeModelingRegistry.ts",
      phase: KnowledgeModelingRegistryIdentity.sourcePhase,
      version: KnowledgeModelingRegistryVersion,
      registryId: KnowledgeModelingRegistryIdentity.registryId,
      required: true,
      publicEntryPointOnly: true,
    }),
  ]),
  approvedDependencyCount: 2,
  upstreamByReference: Object.freeze({
    dkl3PublicIndexId: KnowledgeModelingFoundation.upstream.dkl3PublicIndexId,
    dkl3PublicIndexVersion: KnowledgeModelingFoundation.upstream.dkl3PublicIndexVersion,
    reachedThroughFoundation: true,
    registryReadyForModel: KnowledgeModelingRegistry.readiness.ReadyForModel === true,
  }),
  noDirectDkl3Dependency: true,
  noInternalPriorPhaseImports: true,
  noFutureDkl4Dependency: true,
  forbidden: Object.freeze([
    "knowledgeModelingFoundationTypes.ts",
    "knowledgeModelingContracts.ts",
    "knowledgeModelingRegistryTypes.ts",
    "knowledgeModelingRegistryCatalog.ts",
    "knowledgeModelingBusinessObjectRegistry.ts",
    "knowledgeModelingRelationshipRegistry.ts",
    "dataUnderstandingPublicIndex.ts",
    "DKL-3 direct imports",
    "DKL-4:4+",
    "Engine",
    "Advisor",
    "Scene",
    "UI",
    "Persistence",
    "AI",
    "external packages",
  ]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});

/** Canonical immutable Knowledge Modeling Model aggregate. */
export const KnowledgeModelingModel = Object.freeze({
  identity: KnowledgeModelingModelIdentity,
  version: KnowledgeModelingModelVersion,
  namespace: KnowledgeModelingModelNamespace,
  catalog: KnowledgeModelingModelCatalog,
  relationships: KnowledgeModelingModelRelationships,
  ownership: KnowledgeModelingModelOwnership,
  dependencies: KnowledgeModelingModelDependencies,
  foundation: Object.freeze({
    identity: KnowledgeModelingFoundationIdentity,
    version: KnowledgeModelingFoundationVersion,
    referencedThroughPublicFoundation: true,
  }),
  registry: Object.freeze({
    identity: KnowledgeModelingRegistryIdentity,
    version: KnowledgeModelingRegistryVersion,
    referencedThroughPublicRegistry: true,
    readiness: KnowledgeModelingRegistry.readiness.ReadyForModel,
  }),
  guarantees: Object.freeze({
    canonicalModelNames: true,
    canonicalModelIds: true,
    immutableContracts: true,
    readonlyFields: true,
    explicitOwnership: true,
    explicitSourcePhase: true,
    explicitRegistryReferences: true,
    deterministicExports: true,
    noRuntimeBehavior: true,
    noObjectFactories: true,
    noGraphOperations: true,
    noDynamicRegistration: true,
    noPersistenceCoupling: true,
    noStorageAssumptions: true,
    noUiCoupling: true,
    noEngineReasoning: true,
    noAiInference: true,
    noHiddenMutableState: true,
  }),
  readiness: Object.freeze({
    ModelComplete: true,
    ReadyForValidation: true,
    MetadataOnly: true,
    RuntimeInstanceForbidden: true,
    GraphBehaviorForbidden: true,
    PersistenceForbidden: true,
    InferenceForbidden: true,
    ValidationExecutionForbidden: true,
    BusinessLogicForbidden: true,
    Deterministic: true,
    Immutable: true,
  }),
  completionStatus: Object.freeze([
    "ModelComplete",
    "KnowledgeModelDefined",
    "KnowledgeObjectDefined",
    "BusinessObjectDefined",
    "EntityDefined",
    "RelationshipDefined",
    "IdentityAndReferencesDefined",
    "HierarchyAndCompositionDefined",
    "SemanticStructureDefined",
    "ProvenanceAndContextDefined",
    "RegistryReferenced",
    "MetadataOnly",
    "ReadyForValidation",
  ]),
  nextPhase: "DKL-4:4 — Knowledge Modeling Validation",
  metadataOnly: true,
  modelOnly: true,
  immutable: true,
  deterministic: true,
});
