/**
 * DKL-4:3 — Knowledge Modeling Model Types.
 *
 * Readonly contracts for canonical Knowledge Modeling model structures.
 * Architectural declarations only. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-4:3.
 */

export type KnowledgeModelingModelKind =
  | "KnowledgeModel"
  | "KnowledgeObject"
  | "BusinessObject"
  | "Entity"
  | "Relationship"
  | "KnowledgeIdentity"
  | "KnowledgeMetadata"
  | "KnowledgeHierarchy"
  | "KnowledgeComposition"
  | "KnowledgeReference"
  | "SemanticStructure"
  | "KnowledgeModelSnapshot"
  | "KnowledgeModelContext"
  | "KnowledgeModelProvenance"
  | "KnowledgeModelState"
  | "KnowledgeModelRelationshipSet"
  | "KnowledgeModelObjectSet"
  | "KnowledgeModelBoundary"
  | "KnowledgeModelVersion"
  | "KnowledgeModelSummary";

export type ModelLifecycleState =
  | "Defined"
  | "Draft"
  | "Bound"
  | "Structured"
  | "Ready"
  | "Stable"
  | "Deprecated"
  | "Superseded";

export type ModelStatus =
  | "Declared"
  | "Complete"
  | "Incomplete"
  | "Blocked"
  | "Retired";

export type ModelVisibility = "Public" | "Internal";

export type ConfidenceDeclaration =
  | "DeclaredOnly"
  | "NotCalculated"
  | "Unknown"
  | "Low"
  | "Medium"
  | "High";

export type AmbiguityDeclaration =
  | "NoneDeclared"
  | "Declared"
  | "Unresolved"
  | "NotAssessed";

export type StrengthDeclaration =
  | "DeclaredOnly"
  | "NotCalculated"
  | "Weak"
  | "Moderate"
  | "Strong";

export type RelationshipDirection =
  | "SourceToTarget"
  | "TargetToSource"
  | "Bidirectional";

export type RelationshipCardinality =
  | "OneToOne"
  | "OneToMany"
  | "ManyToOne"
  | "ManyToMany";

export type HierarchyStructureKind =
  | "ParentChild"
  | "Organizational"
  | "Semantic"
  | "Containment";

export type CompositionStructureKind =
  | "ObjectComposition"
  | "ModelComposition"
  | "Aggregation"
  | "Membership"
  | "Containment";

export type IdentityKind =
  | "KnowledgeIdentity"
  | "ObjectIdentity"
  | "ExternalIdentity"
  | "SourceIdentity";

export type ReferenceKind =
  | "CanonicalReference"
  | "CrossModelReference"
  | "UpstreamUnderstandingReference"
  | "PublicReference";

export interface KnowledgeModelingModelPhaseIdentity {
  readonly modelPhaseId: string;
  readonly modelPhaseVersion: string;
  readonly modelPhaseName: string;
  readonly modelPhaseNamespace: string;
  readonly owner: string;
  readonly sourcePhase: "DKL-4:3";
  readonly platformId: "DKL-4";
  readonly platformVersion: string;
  readonly status: "ModelComplete";
  readonly readiness: "ReadyForValidation";
}

export interface ModelFieldDescriptor {
  readonly fieldName: string;
  readonly fieldKind: string;
  readonly required: true;
  readonly readonly: true;
  readonly executableBehaviorImplied: false;
  readonly description: string;
}

export interface CanonicalModelDescriptor {
  readonly modelId: string;
  readonly modelKind: KnowledgeModelingModelKind;
  readonly modelName: string;
  readonly namespace: string;
  readonly description: string;
  readonly owner: string;
  readonly sourcePhase: "DKL-4:3";
  readonly registryCategoryReferences: readonly string[];
  readonly fields: readonly ModelFieldDescriptor[];
  readonly fieldCount: number;
  readonly lifecycleStates: readonly ModelLifecycleState[];
  readonly statuses: readonly ModelStatus[];
  readonly metadataOnly: true;
  readonly runtimeInstanceForbidden: true;
  readonly factoryForbidden: true;
  readonly graphBehaviorForbidden: true;
  readonly immutable: true;
}

/** Structural Knowledge Identity contract. */
export interface KnowledgeIdentityModel {
  readonly id: string;
  readonly identityKind: IdentityKind;
  readonly scope: string;
  readonly stableName: string;
  readonly version: string;
  readonly ownerPhase: string;
  readonly namespace: string;
  readonly aliases: readonly string[];
  readonly publicVisibility: ModelVisibility;
  readonly immutable: true;
}

/** Structural Knowledge Metadata contract. */
export interface KnowledgeMetadataModel {
  readonly id: string;
  readonly metadataClass: string;
  readonly labels: readonly string[];
  readonly descriptions: readonly string[];
  readonly tags: readonly string[];
  readonly owner: string;
  readonly sourcePhase: string;
  readonly compatibility: string;
  readonly extensionPolicy: string;
  readonly immutable: true;
}

/** Structural Knowledge Object contract. */
export interface KnowledgeObjectModel {
  readonly id: string;
  readonly type: string;
  readonly name: string;
  readonly description: string;
  readonly identity: KnowledgeIdentityModel;
  readonly metadata: KnowledgeMetadataModel;
  readonly owner: string;
  readonly lifecycleState: ModelLifecycleState;
  readonly status: ModelStatus;
  readonly semanticClassifications: readonly string[];
  readonly hierarchyReferences: readonly string[];
  readonly compositionReferences: readonly string[];
  readonly outgoingRelationshipReferences: readonly string[];
  readonly incomingRelationshipReferences: readonly string[];
  readonly sourceUnderstandingReferences: readonly string[];
  readonly provenance: string;
  readonly compatibility: string;
  readonly extensionMetadata: string;
  readonly publicVisibility: ModelVisibility;
}

/** Structural Business Object contract. */
export interface BusinessObjectModel {
  readonly knowledgeObject: KnowledgeObjectModel;
  readonly businessObjectCategory: string;
  readonly organizationalRole: string;
  readonly businessDomain: string;
  readonly ownership: string;
  readonly sourceReferences: readonly string[];
  readonly relatedBusinessObjectReferences: readonly string[];
  readonly lifecycleState: ModelLifecycleState;
  readonly semanticLabels: readonly string[];
  readonly operationalRelevance: string;
  readonly executiveRelevance: string;
  readonly stability: string;
  readonly compatibility: string;
  readonly extensionPolicy: string;
  readonly behaviorImplemented: false;
}

/** Structural Entity contract. */
export interface EntityModel {
  readonly id: string;
  readonly entityType: string;
  readonly canonicalIdentity: KnowledgeIdentityModel;
  readonly aliases: readonly string[];
  readonly labels: readonly string[];
  readonly classifications: readonly string[];
  readonly sourceReferences: readonly string[];
  readonly confidenceDeclaration: ConfidenceDeclaration;
  readonly ambiguityDeclaration: AmbiguityDeclaration;
  readonly provenance: string;
  readonly status: ModelStatus;
  readonly lifecycleState: ModelLifecycleState;
  readonly ownership: string;
  readonly linkedObjectReferences: readonly string[];
  readonly entityResolutionPerformed: false;
  readonly mergePerformed: false;
  readonly confidenceCalculated: false;
}

/** Structural Relationship contract. */
export interface RelationshipModel {
  readonly id: string;
  readonly type: string;
  readonly sourceObjectReference: string;
  readonly targetObjectReference: string;
  readonly direction: RelationshipDirection;
  readonly category: string;
  readonly cardinality: RelationshipCardinality;
  readonly strengthDeclaration: StrengthDeclaration;
  readonly confidenceDeclaration: ConfidenceDeclaration;
  readonly provenance: string;
  readonly lifecycleState: ModelLifecycleState;
  readonly status: ModelStatus;
  readonly ownership: string;
  readonly semanticLabels: readonly string[];
  readonly compatibility: string;
  readonly extensionMetadata: string;
  readonly graphTraversalForbidden: true;
  readonly rulesEnforced: false;
  readonly strengthCalculated: false;
  readonly confidenceCalculated: false;
}

/** Structural Reference contract. */
export interface KnowledgeReferenceModel {
  readonly id: string;
  readonly referenceKind: ReferenceKind;
  readonly sourceIdentityId: string;
  readonly targetIdentityId: string;
  readonly description: string;
  readonly owner: string;
  readonly sourcePhase: string;
  readonly dereferencedAtRuntime: false;
  readonly resolutionServiceForbidden: true;
  readonly immutable: true;
}

/** Structural Hierarchy contract. */
export interface KnowledgeHierarchyModel {
  readonly id: string;
  readonly hierarchyKind: HierarchyStructureKind;
  readonly parentIdentityId: string;
  readonly childIdentityIds: readonly string[];
  readonly description: string;
  readonly owner: string;
  readonly sourcePhase: string;
  readonly treeTraversalForbidden: true;
  readonly recursiveProcessingForbidden: true;
  readonly cycleDetectionDeferred: true;
  readonly immutable: true;
}

/** Structural Composition contract. */
export interface KnowledgeCompositionModel {
  readonly id: string;
  readonly compositionKind: CompositionStructureKind;
  readonly parentIdentityId: string;
  readonly partIdentityIds: readonly string[];
  readonly description: string;
  readonly owner: string;
  readonly sourcePhase: string;
  readonly runtimeAssemblyForbidden: true;
  readonly immutable: true;
}

/** Structural Semantic Structure contract. */
export interface SemanticStructureModel {
  readonly id: string;
  readonly semanticType: string;
  readonly semanticLabels: readonly string[];
  readonly classifications: readonly string[];
  readonly domains: readonly string[];
  readonly concepts: readonly string[];
  readonly terms: readonly string[];
  readonly aliases: readonly string[];
  readonly context: string;
  readonly sourceUnderstandingReferences: readonly string[];
  readonly registeredSemanticCategoryReferences: readonly string[];
  readonly compatibility: string;
  readonly extensionPolicy: string;
  readonly inferenceForbidden: true;
  readonly aiForbidden: true;
  readonly immutable: true;
}

/** Structural Provenance contract. */
export interface KnowledgeModelProvenanceModel {
  readonly id: string;
  readonly provenanceChain: readonly string[];
  readonly sourcePhase: string;
  readonly sourceArtifact: string;
  readonly sourceUnderstandingCandidate: string;
  readonly sourceEvidenceReference: string;
  readonly transformationDeclaration: string;
  readonly timestampsGeneratedAtRuntime: false;
  readonly transformationLogicForbidden: true;
  readonly immutable: true;
}

/** Structural Context contract. */
export interface KnowledgeModelContextModel {
  readonly id: string;
  readonly modelContext: string;
  readonly organizationalContext: string;
  readonly temporalContext: string;
  readonly businessContext: string;
  readonly executiveContextReference: string;
  readonly contextAssemblyForbidden: true;
  readonly immutable: true;
}

/** Structural Knowledge Model contract. */
export interface KnowledgeModelContract {
  readonly modelIdentity: KnowledgeIdentityModel;
  readonly namespace: string;
  readonly version: string;
  readonly lifecycleState: ModelLifecycleState;
  readonly status: ModelStatus;
  readonly ownership: string;
  readonly provenance: KnowledgeModelProvenanceModel;
  readonly objectCollection: readonly string[];
  readonly relationshipCollection: readonly string[];
  readonly hierarchy: readonly string[];
  readonly composition: readonly string[];
  readonly references: readonly string[];
  readonly semanticStructures: readonly string[];
  readonly metadata: KnowledgeMetadataModel;
  readonly context: KnowledgeModelContextModel;
  readonly boundaries: readonly string[];
  readonly compatibilityMetadata: string;
  readonly extensionMetadata: string;
  readonly sourceUnderstandingReferences: readonly string[];
  readonly creationMetadataDeclaredOnly: true;
  readonly updateMetadataDeclaredOnly: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface KnowledgeModelSnapshotModel {
  readonly id: string;
  readonly modelIdentityId: string;
  readonly capturedFieldNames: readonly string[];
  readonly declaredOnly: true;
  readonly runtimeCaptureForbidden: true;
  readonly immutable: true;
}

export interface KnowledgeModelStateModel {
  readonly id: string;
  readonly lifecycleState: ModelLifecycleState;
  readonly status: ModelStatus;
  readonly readiness: string;
  readonly declaredOnly: true;
  readonly immutable: true;
}

export interface KnowledgeModelRelationshipSetModel {
  readonly id: string;
  readonly relationshipIds: readonly string[];
  readonly orderingDeterministic: true;
  readonly graphOperationsForbidden: true;
  readonly immutable: true;
}

export interface KnowledgeModelObjectSetModel {
  readonly id: string;
  readonly objectIds: readonly string[];
  readonly orderingDeterministic: true;
  readonly constructionForbidden: true;
  readonly immutable: true;
}

export interface KnowledgeModelBoundaryModel {
  readonly id: string;
  readonly boundaryName: string;
  readonly forbids: readonly string[];
  readonly allows: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface KnowledgeModelVersionModel {
  readonly id: string;
  readonly version: string;
  readonly previousVersion: string | null;
  readonly stability: string;
  readonly declaredOnly: true;
  readonly immutable: true;
}

export interface KnowledgeModelSummaryModel {
  readonly id: string;
  readonly modelKindCount: number;
  readonly objectFieldCount: number;
  readonly relationshipFieldCount: number;
  readonly businessObjectFieldCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}
