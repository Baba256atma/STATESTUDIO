/**
 * DKL-7:1 — Knowledge Services Foundation Types.
 *
 * Readonly contracts for the canonical Knowledge Services Foundation.
 * Metadata only. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-7:1.
 */

export type KnowledgeServiceLifecycleStage =
  | "Declared"
  | "Registered"
  | "Available"
  | "Certified"
  | "Frozen"
  | "Released"
  | "Deprecated"
  | "Retired";

export type KnowledgeServiceCapabilityId =
  | "KnowledgeRetrieval"
  | "BusinessObjectAccess"
  | "KnowledgeSearch"
  | "RelationshipLookup"
  | "KnowledgeGraphTraversal"
  | "MetadataQuery"
  | "TimelineQuery"
  | "EvidenceLookup"
  | "KnowledgeSummary"
  | "KnowledgeDiscovery"
  | "ReferenceResolution"
  | "CrossDomainNavigation";

export type KnowledgeServiceNamespace =
  "nexora.dkl.knowledge-services.foundation";

export interface KnowledgeServiceIdentity {
  readonly serviceId: string;
  readonly serviceName: string;
  readonly serviceNamespace: KnowledgeServiceNamespace;
  readonly owner: string;
  readonly sourcePhase: "DKL-7:1";
  readonly version: string;
  readonly status: KnowledgeServiceLifecycleStage;
  readonly metadataOnly: true;
  readonly readOnly: true;
}

export interface KnowledgeServiceMetadata {
  readonly metadataId: string;
  readonly serviceId: string;
  readonly description: string;
  readonly capabilityIds: readonly KnowledgeServiceCapabilityId[];
  readonly contractIds: readonly string[];
  readonly owner: string;
  readonly sourcePhase: "DKL-7:1";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface KnowledgeServiceCapability {
  readonly capabilityId: KnowledgeServiceCapabilityId;
  readonly name: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly declaredOnly: true;
  readonly implemented: false;
  readonly createsKnowledge: false;
  readonly modifiesKnowledge: false;
  readonly performsExecutiveReasoning: false;
}

export interface KnowledgeServiceLifecycle {
  readonly lifecycleId: string;
  readonly stages: readonly KnowledgeServiceLifecycleStage[];
  readonly stageCount: number;
  readonly transitions: Readonly<
    Record<KnowledgeServiceLifecycleStage, readonly KnowledgeServiceLifecycleStage[]>
  >;
  readonly notes: Readonly<{
    metadataOnly: true;
    noTransitionExecution: true;
    noRuntimeBehavior: true;
    terminalStage: "Retired";
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface KnowledgeServiceBoundary {
  readonly boundaryId: string;
  readonly sourcePhase: "DKL-7:1";
  readonly readOnlyAccessLayer: true;
  readonly createsKnowledge: false;
  readonly modifiesKnowledge: false;
  readonly performsExecutiveReasoning: false;
  readonly prohibitedSurfaces: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface KnowledgeServiceOwnership {
  readonly ownershipId: string;
  readonly owner: string;
  readonly sourcePhase: "DKL-7:1";
  readonly owns: readonly string[];
  readonly doesNotOwn: readonly string[];
  readonly ownsCount: number;
  readonly doesNotOwnCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface KnowledgeServiceContract {
  readonly contractId: string;
  readonly contractName: string;
  readonly description: string;
  readonly fields: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly readOnly: true;
}

export interface KnowledgeServiceRequest {
  readonly requestId: string;
  readonly serviceId: string;
  readonly capabilityId: KnowledgeServiceCapabilityId;
  readonly consumer: string;
  readonly purpose: string;
  readonly metadataOnly: true;
  readonly executed: false;
}

export interface KnowledgeServiceResponse {
  readonly responseId: string;
  readonly requestId: string;
  readonly serviceId: string;
  readonly status: "Declared";
  readonly knowledgeReferences: readonly string[];
  readonly limitations: readonly string[];
  readonly metadataOnly: true;
  readonly materialized: false;
}

export interface KnowledgeService {
  readonly identity: KnowledgeServiceIdentity;
  readonly metadata: KnowledgeServiceMetadata;
  readonly capabilityIds: readonly KnowledgeServiceCapabilityId[];
  readonly contractIds: readonly string[];
  readonly lifecycleStage: KnowledgeServiceLifecycleStage;
  readonly readOnly: true;
  readonly metadataOnly: true;
  readonly createsKnowledge: false;
  readonly modifiesKnowledge: false;
  readonly performsExecutiveReasoning: false;
}

export interface KnowledgeServicesFoundationIdentity {
  readonly foundationId: "DKL-7:1/KnowledgeServicesFoundation";
  readonly foundationName: "Knowledge Services Foundation";
  readonly foundationVersion: string;
  readonly foundationNamespace: KnowledgeServiceNamespace;
  readonly layer: "Data Knowledge Layer";
  readonly phase: "DKL-7";
  readonly stage: "Foundation";
  readonly sourcePhase: "DKL-7:1";
  readonly owner: string;
  readonly architectureType: "KnowledgeServices";
  readonly status: "FoundationComplete";
  readonly readiness: "ReadyForRegistry";
  readonly metadataOnly: true;
  readonly runtimeBehavior: false;
  readonly serviceImplementation: false;
  readonly immutable: true;
}

export interface KnowledgeServicesFoundationSummary {
  readonly foundationId: "DKL-7:1/KnowledgeServicesFoundation";
  readonly version: string;
  readonly namespace: KnowledgeServiceNamespace;
  readonly layer: "Data Knowledge Layer";
  readonly phase: "DKL-7";
  readonly stage: "Foundation";
  readonly status: "FoundationComplete";
  readonly readiness: "ReadyForRegistry";
  readonly capabilityCount: number;
  readonly contractCount: number;
  readonly lifecycleStageCount: number;
  readonly ownsCount: number;
  readonly doesNotOwnCount: number;
  readonly prohibitedBoundaryCount: number;
  readonly upstreamPublicIndexId: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
