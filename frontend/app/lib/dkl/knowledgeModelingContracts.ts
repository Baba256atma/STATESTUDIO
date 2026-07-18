/**
 * DKL-4:1 — Knowledge Modeling Contracts.
 *
 * Canonical definition, terminology, knowledge-model element kinds, semantic
 * structure contracts, extension policy, and compatibility policy.
 * Contract definitions only — no runtime behavior.
 *
 * Ownership: owned exclusively by DKL-4:1.
 */

import type {
  BusinessObjectKind,
  CompatibilityPolicyDescriptor,
  CompositionKind,
  EntityKind,
  ExtensionPolicyDescriptor,
  HierarchyKind,
  KnowledgeIdentityScope,
  KnowledgeMetadataClass,
  KnowledgeModelStatus,
  KnowledgeModelingProcessingPolicy,
  KnowledgeModelingTerminology,
  KnowledgeObjectKind,
  ReferenceKind,
  RelationshipKind,
  SemanticStructureKind,
} from "./knowledgeModelingFoundationTypes.ts";
import { KNOWLEDGE_MODELING_DEFINITION } from "./knowledgeModelingFoundationTypes.ts";

export const KNOWLEDGE_OBJECT_KINDS: readonly KnowledgeObjectKind[] = Object.freeze([
  "KnowledgeModel",
  "KnowledgeObject",
  "BusinessObject",
  "Entity",
  "Relationship",
  "IdentityNode",
  "MetadataDescriptor",
  "HierarchyNode",
  "CompositionNode",
  "ReferenceLink",
  "SemanticStructure",
]);

export const BUSINESS_OBJECT_KINDS: readonly BusinessObjectKind[] = Object.freeze([
  "Organization",
  "Person",
  "Asset",
  "Process",
  "Metric",
  "Event",
  "Document",
  "Location",
  "Capability",
  "Constraint",
  "GenericBusinessObject",
]);

export const ENTITY_KINDS: readonly EntityKind[] = Object.freeze([
  "NamedEntity",
  "TypedEntity",
  "CompositeEntity",
  "ReferenceEntity",
  "AbstractEntity",
]);

export const RELATIONSHIP_KINDS: readonly RelationshipKind[] = Object.freeze([
  "Owns",
  "Contains",
  "References",
  "DependsOn",
  "DerivedFrom",
  "Associates",
  "HierarchicallyParents",
  "Composes",
  "Specializes",
  "Equates",
]);

export const KNOWLEDGE_IDENTITY_SCOPES: readonly KnowledgeIdentityScope[] = Object.freeze([
  "Platform",
  "Model",
  "Object",
  "Entity",
  "Relationship",
  "Reference",
]);

export const KNOWLEDGE_METADATA_CLASSES: readonly KnowledgeMetadataClass[] = Object.freeze([
  "Descriptive",
  "Structural",
  "Provenance",
  "Semantic",
  "Lifecycle",
  "Compatibility",
]);

export const HIERARCHY_KINDS: readonly HierarchyKind[] = Object.freeze([
  "Taxonomy",
  "PartWhole",
  "Organizational",
  "Classification",
  "Containment",
]);

export const COMPOSITION_KINDS: readonly CompositionKind[] = Object.freeze([
  "Aggregate",
  "Composite",
  "Collection",
  "Bundle",
  "View",
]);

export const REFERENCE_KINDS: readonly ReferenceKind[] = Object.freeze([
  "UpstreamUnderstanding",
  "CrossModel",
  "ExternalRegistry",
  "IdentityAlias",
  "SemanticEquivalence",
]);

export const SEMANTIC_STRUCTURE_KINDS: readonly SemanticStructureKind[] = Object.freeze([
  "TypeSystem",
  "RoleSystem",
  "ConstraintSystem",
  "HierarchySystem",
  "CompositionSystem",
  "ReferenceSystem",
]);

export const KNOWLEDGE_MODEL_STATUSES: readonly KnowledgeModelStatus[] = Object.freeze([
  "Defined",
  "Draft",
  "Stable",
  "Deprecated",
  "Superseded",
]);

export const KNOWLEDGE_MODELING_TERMINOLOGY: KnowledgeModelingTerminology = Object.freeze({
  KnowledgeModel:
    "An immutable organizational knowledge model composing objects, entities, relationships, and semantic structure.",
  KnowledgeObject:
    "A modeled knowledge element with stable identity and metadata — not a runtime instance.",
  BusinessObject:
    "A canonical organizational business-object definition owned by Knowledge Modeling.",
  Entity:
    "A typed entity definition within a knowledge model — not a persisted record.",
  Relationship:
    "A declared structural or semantic relationship between identities — not a graph traversal.",
  KnowledgeIdentity:
    "A stable, scoped identity contract for knowledge model elements.",
  KnowledgeMetadata:
    "Readonly descriptive, structural, provenance, and semantic metadata attached to knowledge elements.",
  Hierarchy:
    "A declared hierarchical organization of identities — taxonomy or containment metadata only.",
  Composition:
    "A declared part-whole composition of identities — not runtime assembly.",
  Reference:
    "A declared reference link to upstream understanding or cross-model identities.",
  SemanticStructure:
    "A contract describing type, role, constraint, hierarchy, composition, or reference systems.",
});

export const KNOWLEDGE_MODELING_PROCESSING_POLICIES: KnowledgeModelingProcessingPolicy =
  Object.freeze({
    metadataOnly: true,
    modelingOnly: true,
    runtimeBehaviorForbidden: true,
    algorithmsForbidden: true,
    persistenceForbidden: true,
    graphTraversalForbidden: true,
    executionForbidden: true,
    businessLogicForbidden: true,
    aiForbidden: true,
    inferenceForbidden: true,
    calculationsForbidden: true,
    sideEffectsForbidden: true,
    engineReasoningForbidden: true,
    advisorNarrationForbidden: true,
    sceneVisualizationForbidden: true,
    queryExecutionForbidden: true,
    orchestrationForbidden: true,
  });

export const KNOWLEDGE_MODELING_EXTENSION_POLICIES: readonly ExtensionPolicyDescriptor[] =
  Object.freeze([
    Object.freeze({
      policyId: "EXT-ADDITIVE",
      name: "Additive Extension",
      status: "AdditiveAllowed" as const,
      description:
        "Additive, identifier-preserving knowledge-model extensions may be declared in later DKL-4 phases.",
    }),
    Object.freeze({
      policyId: "EXT-IDENTITY-PRESERVING",
      name: "Identity Preserving",
      status: "IdentifierPreserving" as const,
      description: "Existing knowledge identities must not be renamed or repurposed silently.",
    }),
    Object.freeze({
      policyId: "EXT-MIGRATION",
      name: "Major Migration Required",
      status: "MigrationRequired" as const,
      description: "Breaking identity or semantic-structure changes require a versioned major migration.",
    }),
    Object.freeze({
      policyId: "EXT-RUNTIME-FORBIDDEN",
      name: "Runtime Extension Forbidden",
      status: "Forbidden" as const,
      description: "Runtime algorithms, AI, persistence, and Engine extensions are forbidden in DKL-4.",
    }),
  ]);

export const KNOWLEDGE_MODELING_COMPATIBILITY_POLICIES: readonly CompatibilityPolicyDescriptor[] =
  Object.freeze([
    Object.freeze({
      policyId: "COMPAT-DKL3",
      name: "DKL-3 Understanding Compatible",
      status: "Compatible" as const,
      description:
        "Knowledge Modeling consumes DKL-3 exclusively through the Data Understanding Public Index.",
    }),
    Object.freeze({
      policyId: "COMPAT-FORWARD-REGISTRY",
      name: "Forward Compatible to Registry",
      status: "ForwardCompatible" as const,
      description: "Foundation contracts are intended for DKL-4:2 Registry without schema rename.",
    }),
    Object.freeze({
      policyId: "COMPAT-ENGINE-REFERENCE",
      name: "Executive Engine Reference Only",
      status: "Restricted" as const,
      description:
        "Executive Engine may consume frozen knowledge models later; Engine reasoning is not owned here.",
    }),
    Object.freeze({
      policyId: "COMPAT-AI-FORBIDDEN",
      name: "AI Compatibility Forbidden",
      status: "Forbidden" as const,
      description: "Knowledge Modeling must never claim AI inference or LLM compatibility.",
    }),
    Object.freeze({
      policyId: "COMPAT-PERSISTENCE-FORBIDDEN",
      name: "Persistence Compatibility Forbidden",
      status: "Forbidden" as const,
      description: "Knowledge Modeling must never claim database or storage implementation compatibility.",
    }),
  ]);

/** Canonical immutable Knowledge Modeling contracts. */
export const KnowledgeModelingContracts = Object.freeze({
  definition: KNOWLEDGE_MODELING_DEFINITION,
  terminology: KNOWLEDGE_MODELING_TERMINOLOGY,
  knowledgeObjectKinds: KNOWLEDGE_OBJECT_KINDS,
  businessObjectKinds: BUSINESS_OBJECT_KINDS,
  entityKinds: ENTITY_KINDS,
  relationshipKinds: RELATIONSHIP_KINDS,
  identityScopes: KNOWLEDGE_IDENTITY_SCOPES,
  metadataClasses: KNOWLEDGE_METADATA_CLASSES,
  hierarchyKinds: HIERARCHY_KINDS,
  compositionKinds: COMPOSITION_KINDS,
  referenceKinds: REFERENCE_KINDS,
  semanticStructureKinds: SEMANTIC_STRUCTURE_KINDS,
  knowledgeModelStatuses: KNOWLEDGE_MODEL_STATUSES,
  processingPolicies: KNOWLEDGE_MODELING_PROCESSING_POLICIES,
  extensionPolicies: KNOWLEDGE_MODELING_EXTENSION_POLICIES,
  compatibilityPolicies: KNOWLEDGE_MODELING_COMPATIBILITY_POLICIES,
  notes: Object.freeze({
    metadataOnly: true,
    definitionsOnly: true,
    noRuntimeInstances: true,
    noGraphTraversal: true,
    noInference: true,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
