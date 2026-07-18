/**
 * DKL-4:1 — Knowledge Modeling Foundation Types.
 *
 * Readonly contracts for the Knowledge Modeling Platform foundation.
 * Architectural and metadata-oriented. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-4:1.
 */

/** Official definition of Knowledge Modeling (DKL-4). */
export const KNOWLEDGE_MODELING_DEFINITION =
  "Knowledge Modeling is the definition of immutable organizational knowledge models, knowledge objects, business objects, entities, relationships, and semantic structure derived from validated DKL-3 understanding — without reasoning, persistence, AI inference, or executive decision making.";

export type KnowledgeObjectKind =
  | "KnowledgeModel"
  | "KnowledgeObject"
  | "BusinessObject"
  | "Entity"
  | "Relationship"
  | "IdentityNode"
  | "MetadataDescriptor"
  | "HierarchyNode"
  | "CompositionNode"
  | "ReferenceLink"
  | "SemanticStructure";

export type BusinessObjectKind =
  | "Organization"
  | "Person"
  | "Asset"
  | "Process"
  | "Metric"
  | "Event"
  | "Document"
  | "Location"
  | "Capability"
  | "Constraint"
  | "GenericBusinessObject";

export type EntityKind =
  | "NamedEntity"
  | "TypedEntity"
  | "CompositeEntity"
  | "ReferenceEntity"
  | "AbstractEntity";

export type RelationshipKind =
  | "Owns"
  | "Contains"
  | "References"
  | "DependsOn"
  | "DerivedFrom"
  | "Associates"
  | "HierarchicallyParents"
  | "Composes"
  | "Specializes"
  | "Equates";

export type KnowledgeIdentityScope =
  | "Platform"
  | "Model"
  | "Object"
  | "Entity"
  | "Relationship"
  | "Reference";

export type KnowledgeMetadataClass =
  | "Descriptive"
  | "Structural"
  | "Provenance"
  | "Semantic"
  | "Lifecycle"
  | "Compatibility";

export type HierarchyKind =
  | "Taxonomy"
  | "PartWhole"
  | "Organizational"
  | "Classification"
  | "Containment";

export type CompositionKind =
  | "Aggregate"
  | "Composite"
  | "Collection"
  | "Bundle"
  | "View";

export type ReferenceKind =
  | "UpstreamUnderstanding"
  | "CrossModel"
  | "ExternalRegistry"
  | "IdentityAlias"
  | "SemanticEquivalence";

export type SemanticStructureKind =
  | "TypeSystem"
  | "RoleSystem"
  | "ConstraintSystem"
  | "HierarchySystem"
  | "CompositionSystem"
  | "ReferenceSystem";

export type KnowledgeModelStatus =
  | "Defined"
  | "Draft"
  | "Stable"
  | "Deprecated"
  | "Superseded";

export type KnowledgeModelingLifecycleState =
  | "Received"
  | "Bound"
  | "Structured"
  | "Related"
  | "Composed"
  | "Referenced"
  | "ModelReady"
  | "Completed"
  | "Blocked"
  | "Failed"
  | "Cancelled";

export type ExtensionPolicyStatus =
  | "AdditiveAllowed"
  | "IdentifierPreserving"
  | "MigrationRequired"
  | "Forbidden";

export type CompatibilityPolicyStatus =
  | "Compatible"
  | "ForwardCompatible"
  | "Restricted"
  | "Forbidden";

export interface KnowledgeModelingFoundationIdentity {
  readonly foundationId: string;
  readonly foundationVersion: string;
  readonly foundationName: string;
  readonly foundationNamespace: string;
  readonly owner: string;
  readonly sourcePhase: "DKL-4:1";
  readonly platformId: "DKL-4";
  readonly platformVersion: string;
  readonly status: "FoundationComplete";
  readonly readiness: "ReadyForRegistry";
}

export interface KnowledgeIdentityDescriptor {
  readonly identityId: string;
  readonly scope: KnowledgeIdentityScope;
  readonly stableName: string;
  readonly version: string;
  readonly ownerPhase: string;
  readonly immutable: true;
}

export interface KnowledgeMetadataDescriptor {
  readonly metadataId: string;
  readonly metadataClass: KnowledgeMetadataClass;
  readonly description: string;
  readonly required: boolean;
  readonly immutable: true;
}

export interface KnowledgeObjectDescriptor {
  readonly objectId: string;
  readonly kind: KnowledgeObjectKind;
  readonly identity: KnowledgeIdentityDescriptor;
  readonly metadataIds: readonly string[];
  readonly description: string;
}

export interface BusinessObjectDescriptor {
  readonly businessObjectId: string;
  readonly kind: BusinessObjectKind;
  readonly identity: KnowledgeIdentityDescriptor;
  readonly entityIds: readonly string[];
  readonly description: string;
  readonly canonical: true;
}

export interface EntityDescriptor {
  readonly entityId: string;
  readonly kind: EntityKind;
  readonly identity: KnowledgeIdentityDescriptor;
  readonly attributes: readonly string[];
  readonly description: string;
}

export interface RelationshipDescriptor {
  readonly relationshipId: string;
  readonly kind: RelationshipKind;
  readonly fromIdentityId: string;
  readonly toIdentityId: string;
  readonly cardinality: "OneToOne" | "OneToMany" | "ManyToMany";
  readonly description: string;
}

export interface HierarchyDescriptor {
  readonly hierarchyId: string;
  readonly kind: HierarchyKind;
  readonly rootIdentityId: string;
  readonly childIdentityIds: readonly string[];
  readonly description: string;
}

export interface CompositionDescriptor {
  readonly compositionId: string;
  readonly kind: CompositionKind;
  readonly parentIdentityId: string;
  readonly partIdentityIds: readonly string[];
  readonly description: string;
}

export interface ReferenceDescriptor {
  readonly referenceId: string;
  readonly kind: ReferenceKind;
  readonly sourceIdentityId: string;
  readonly targetIdentityId: string;
  readonly description: string;
}

export interface SemanticStructureDescriptor {
  readonly structureId: string;
  readonly kind: SemanticStructureKind;
  readonly memberIds: readonly string[];
  readonly description: string;
  readonly metadataOnly: true;
}

export interface KnowledgeModelDescriptor {
  readonly modelId: string;
  readonly identity: KnowledgeIdentityDescriptor;
  readonly status: KnowledgeModelStatus;
  readonly knowledgeObjectIds: readonly string[];
  readonly businessObjectIds: readonly string[];
  readonly entityIds: readonly string[];
  readonly relationshipIds: readonly string[];
  readonly hierarchyIds: readonly string[];
  readonly compositionIds: readonly string[];
  readonly referenceIds: readonly string[];
  readonly semanticStructureIds: readonly string[];
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface KnowledgeModelingTerminology {
  readonly KnowledgeModel: string;
  readonly KnowledgeObject: string;
  readonly BusinessObject: string;
  readonly Entity: string;
  readonly Relationship: string;
  readonly KnowledgeIdentity: string;
  readonly KnowledgeMetadata: string;
  readonly Hierarchy: string;
  readonly Composition: string;
  readonly Reference: string;
  readonly SemanticStructure: string;
}

export interface ExtensionPolicyDescriptor {
  readonly policyId: string;
  readonly name: string;
  readonly status: ExtensionPolicyStatus;
  readonly description: string;
}

export interface CompatibilityPolicyDescriptor {
  readonly policyId: string;
  readonly name: string;
  readonly status: CompatibilityPolicyStatus;
  readonly description: string;
}

export interface KnowledgeModelingProcessingPolicy {
  readonly metadataOnly: true;
  readonly modelingOnly: true;
  readonly runtimeBehaviorForbidden: true;
  readonly algorithmsForbidden: true;
  readonly persistenceForbidden: true;
  readonly graphTraversalForbidden: true;
  readonly executionForbidden: true;
  readonly businessLogicForbidden: true;
  readonly aiForbidden: true;
  readonly inferenceForbidden: true;
  readonly calculationsForbidden: true;
  readonly sideEffectsForbidden: true;
  readonly engineReasoningForbidden: true;
  readonly advisorNarrationForbidden: true;
  readonly sceneVisualizationForbidden: true;
  readonly queryExecutionForbidden: true;
  readonly orchestrationForbidden: true;
}
