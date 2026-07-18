/**
 * DKL-7:3 — Knowledge Services Model Types.
 *
 * Readonly contracts for the canonical Knowledge Services Model.
 * Metadata only. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-7:3.
 */

export type KnowledgeServiceArchitecturalOutcome =
  | "Available"
  | "PartiallyAvailable"
  | "Unavailable"
  | "Ambiguous"
  | "NotFound"
  | "Restricted"
  | "InvalidRequestMetadata";

export type KnowledgeServiceConsumerCategory =
  | "ExecutiveEngine"
  | "Advisor"
  | "ApprovedInternalConsumer";

export type KnowledgeServiceScopeKind =
  | "SingleObject"
  | "ObjectCollection"
  | "RelationshipNeighborhood"
  | "Domain"
  | "CrossDomain"
  | "Timeline"
  | "EvidenceSet"
  | "OrganizationalScope";

export type KnowledgeServiceGraphDirection =
  | "Outbound"
  | "Inbound"
  | "Bidirectional"
  | "Undirected";

export interface KnowledgeServicesModelIdentity {
  readonly modelId: "DKL-7:3/KnowledgeServicesModel";
  readonly modelName: "Knowledge Services Model";
  readonly modelVersion: string;
  readonly modelNamespace: "nexora.dkl.knowledge-services.model";
  readonly layer: "Data Knowledge Layer";
  readonly phase: "DKL-7";
  readonly stage: "Model";
  readonly sourcePhase: "DKL-7:3";
  readonly owner: string;
  readonly status: "ModelComplete";
  readonly readiness: "ReadyForValidation";
  readonly registryId: string;
  readonly registryVersion: string;
  readonly foundationId: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface KnowledgeServicesModelMetadata {
  readonly metadataId: "DKL-7:3/KnowledgeServicesModelMetadata";
  readonly modelId: "DKL-7:3/KnowledgeServicesModel";
  readonly description: string;
  readonly metadataOnly: true;
  readonly declarationOnly: true;
  readonly runtimeBehavior: false;
  readonly transportNeutral: true;
  readonly persistenceNeutral: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface KnowledgeServiceSubjectReference {
  readonly referenceId: string;
  readonly subjectKind: string;
  readonly subjectIdentity: string;
  readonly domainReference: string;
  readonly sourceReference: string;
  readonly metadataOnly: true;
  readonly readOnly: true;
}

export interface KnowledgeServiceObjectReference {
  readonly referenceId: string;
  readonly objectId: string;
  readonly objectType: string;
  readonly objectNamespace: string;
  readonly domainReference: string;
  readonly sourceReference: string;
  readonly versionReference: string;
  readonly ownsBusinessObject: false;
  readonly metadataOnly: true;
  readonly readOnly: true;
}

export interface KnowledgeServiceRelationshipReference {
  readonly referenceId: string;
  readonly relationshipType: string;
  readonly sourceObjectReference: string;
  readonly targetObjectReference: string;
  readonly direction: KnowledgeServiceGraphDirection;
  readonly metadataOnly: true;
  readonly readOnly: true;
}

export interface KnowledgeServiceEvidenceReference {
  readonly referenceId: string;
  readonly evidenceIdentity: string;
  readonly evidenceCategory: string;
  readonly sourceReference: string;
  readonly subjectReference: string;
  readonly metadataOnly: true;
  readonly readOnly: true;
}

export interface KnowledgeServiceTimelineReference {
  readonly referenceId: string;
  readonly timelineIdentity: string;
  readonly eventReference: string;
  readonly subjectReference: string;
  readonly periodDeclaration: string;
  readonly metadataOnly: true;
  readonly readOnly: true;
}

export interface KnowledgeServiceMetadataReference {
  readonly referenceId: string;
  readonly metadataIdentity: string;
  readonly metadataCategory: string;
  readonly ownershipReference: string;
  readonly sourceReference: string;
  readonly versionReference: string;
  readonly metadataOnly: true;
  readonly readOnly: true;
}

export interface KnowledgeServiceGraphNodeReference {
  readonly referenceId: string;
  readonly nodeIdentity: string;
  readonly objectReference: string;
  readonly domainReference: string;
  readonly metadataOnly: true;
  readonly readOnly: true;
  readonly traversable: false;
}

export interface KnowledgeServiceGraphEdgeReference {
  readonly referenceId: string;
  readonly edgeIdentity: string;
  readonly sourceNodeReference: string;
  readonly targetNodeReference: string;
  readonly relationshipReference: string;
  readonly direction: KnowledgeServiceGraphDirection;
  readonly metadataOnly: true;
  readonly readOnly: true;
  readonly traversable: false;
}

export interface KnowledgeServiceGraphPath {
  readonly pathId: string;
  readonly orderedNodeReferences: readonly string[];
  readonly orderedEdgeReferences: readonly string[];
  readonly pathLength: number;
  readonly startingReference: string;
  readonly endingReference: string;
  readonly pathScope: string;
  readonly metadataOnly: true;
  readonly algorithmic: false;
}

export interface KnowledgeServiceTraceReference {
  readonly traceId: string;
  readonly consumerRequestReference: string;
  readonly requestModelReference: string;
  readonly serviceReference: string;
  readonly capabilityReference: string;
  readonly contractReference: string;
  readonly responseModelReference: string;
  readonly resultEnvelopeReference: string;
  readonly metadataOnly: true;
  readonly telemetry: false;
}

export interface KnowledgeServiceRequestModel {
  readonly modelId: string;
  readonly modelName: string;
  readonly requestCategoryReference: string;
  readonly serviceReference: string;
  readonly capabilityReference: string;
  readonly contractReference: string;
  readonly accessModeReference: string;
  readonly subjectReferenceDeclaration: string;
  readonly scopeDeclaration: KnowledgeServiceScopeKind;
  readonly filterDeclarationMetadata: string;
  readonly relationshipDepthDeclaration: string;
  readonly resultShapeDeclaration: string;
  readonly traceReferenceDeclaration: string;
  readonly readOnly: true;
  readonly mutationAllowed: false;
  readonly executable: false;
  readonly hasHandler: false;
  readonly metadataOnly: true;
  readonly deterministicOrder: number;
}

export interface KnowledgeServiceResponseModel {
  readonly modelId: string;
  readonly modelName: string;
  readonly responseCategoryReference: string;
  readonly originatingRequestModelReference: string;
  readonly serviceReference: string;
  readonly capabilityReference: string;
  readonly resultEnvelopeReference: string;
  readonly resultShapeMetadata: string;
  readonly traceReferenceDeclaration: string;
  readonly completenessDeclaration: string;
  readonly confidenceMetadataReference: string;
  readonly provenanceReferenceDeclaration: string;
  readonly architecturalOutcomeVocabulary: readonly KnowledgeServiceArchitecturalOutcome[];
  readonly readOnly: true;
  readonly transportAware: false;
  readonly hasSerializer: false;
  readonly hasHandler: false;
  readonly metadataOnly: true;
  readonly deterministicOrder: number;
}

export interface KnowledgeServiceResultModel {
  readonly modelId: string;
  readonly modelName: string;
  readonly resultKind: string;
  readonly description: string;
  readonly fields: readonly string[];
  readonly ownsBusinessObjects: false;
  readonly repositoryAccess: false;
  readonly algorithmic: false;
  readonly aiBehavior: false;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly readOnly: true;
  readonly deterministicOrder: number;
}

export interface KnowledgeServiceResultEnvelope {
  readonly envelopeId: string;
  readonly requestModelReference: string;
  readonly responseModelReference: string;
  readonly serviceReference: string;
  readonly capabilityReference: string;
  readonly contractReference: string;
  readonly resultTypeReference: string;
  readonly resultReferenceDeclaration: string;
  readonly provenanceReferenceDeclaration: string;
  readonly traceReferenceDeclaration: string;
  readonly completenessMetadata: string;
  readonly outcomeStatusVocabulary: readonly KnowledgeServiceArchitecturalOutcome[];
  readonly readOnly: true;
  readonly runtimePayloadProcessing: false;
  readonly metadataOnly: true;
}

export interface KnowledgeServiceResultCollection {
  readonly collectionId: string;
  readonly itemReferenceDeclaration: string;
  readonly resultCountDeclaration: string;
  readonly orderingDeclaration: string;
  readonly groupingDeclaration: string;
  readonly scopeDeclaration: string;
  readonly mutable: false;
  readonly paginationEngine: false;
  readonly metadataOnly: true;
  readonly readOnly: true;
}

export interface KnowledgeServiceContextModel {
  readonly modelId: string;
  readonly modelName: string;
  readonly contextKind: string;
  readonly description: string;
  readonly fields: readonly string[];
  readonly importsConsumerImplementations: false;
  readonly repositoryAccess: false;
  readonly telemetry: false;
  readonly metadataOnly: true;
  readonly readOnly: true;
  readonly deterministicOrder: number;
}

export interface KnowledgeServiceReferenceModel {
  readonly modelId: string;
  readonly modelName: string;
  readonly referenceKind: string;
  readonly description: string;
  readonly fields: readonly string[];
  readonly ownsReferencedEntity: false;
  readonly metadataOnly: true;
  readonly readOnly: true;
  readonly deterministicOrder: number;
}

export interface KnowledgeServiceGraphModel {
  readonly modelId: string;
  readonly modelName: string;
  readonly graphKind: string;
  readonly description: string;
  readonly fields: readonly string[];
  readonly algorithmic: false;
  readonly traversable: false;
  readonly metadataOnly: true;
  readonly readOnly: true;
  readonly deterministicOrder: number;
}

export interface KnowledgeServiceModelRelationship {
  readonly relationshipId: string;
  readonly name: string;
  readonly sourceModelReference: string;
  readonly targetModelReference: string;
  readonly relationshipKind: string;
  readonly description: string;
  readonly dispatching: false;
  readonly orchestration: false;
  readonly metadataOnly: true;
  readonly deterministicOrder: number;
}

export interface KnowledgeServicesModelInventory {
  readonly inventoryId: "DKL-7:3/KnowledgeServicesModelInventory";
  readonly requestModelCount: number;
  readonly responseModelCount: number;
  readonly resultModelCount: number;
  readonly contextModelCount: number;
  readonly referenceModelCount: number;
  readonly graphModelCount: number;
  readonly relationshipCount: number;
  readonly totalEntryCount: number;
  readonly countingRule: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface KnowledgeServicesModelSummary {
  readonly modelId: "DKL-7:3/KnowledgeServicesModel";
  readonly version: string;
  readonly status: "ModelComplete";
  readonly registryId: string;
  readonly foundationId: string;
  readonly requestModelCount: number;
  readonly responseModelCount: number;
  readonly resultModelCount: number;
  readonly contextModelCount: number;
  readonly referenceModelCount: number;
  readonly graphModelCount: number;
  readonly relationshipCount: number;
  readonly registeredServiceCount: number;
  readonly registeredCapabilityCount: number;
  readonly registeredContractCount: number;
  readonly approvedAccessModeCount: number;
  readonly mutationModeCount: 0;
  readonly readiness: "ReadyForValidation";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
