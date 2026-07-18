/**
 * DKL-7:2 — Knowledge Services Registry Entries.
 *
 * Canonical service, request-category, response-category, access-mode, and
 * service-to-capability relationship registrations. Metadata only.
 *
 * Ownership: owned exclusively by DKL-7:2.
 */

import type {
  KnowledgeServiceAccessModeRegistration,
  KnowledgeServiceCapabilityRelationship,
  KnowledgeServiceRegistration,
  KnowledgeServiceRequestCategoryRegistration,
  KnowledgeServiceResponseCategoryRegistration,
  KnowledgeServicesProhibitedMutationMode,
} from "./knowledgeServicesRegistryTypes.ts";

const service = (
  serviceKey: string,
  name: string,
  capabilityId: string,
  description: string,
  deterministicOrder: number,
): KnowledgeServiceRegistration =>
  Object.freeze({
    id: `DKL-7:2/Service/${serviceKey}`,
    name,
    category: "service" as const,
    description,
    owner: "DKL-7" as const,
    status: "Registered" as const,
    runtimeBehavior: "None" as const,
    metadataOnly: true as const,
    deterministicOrder,
    serviceKey,
    capabilityId,
    readOnly: true as const,
    createsKnowledge: false as const,
    modifiesKnowledge: false as const,
    performsExecutiveReasoning: false as const,
    hasHandler: false as const,
    hasExecutor: false as const,
  });

const requestCategory = (
  requestCategoryKey: string,
  name: string,
  relatedServiceId: string,
  description: string,
  deterministicOrder: number,
): KnowledgeServiceRequestCategoryRegistration =>
  Object.freeze({
    id: `DKL-7:2/RequestCategory/${requestCategoryKey}`,
    name,
    category: "requestCategory" as const,
    description,
    owner: "DKL-7" as const,
    status: "Registered" as const,
    runtimeBehavior: "None" as const,
    metadataOnly: true as const,
    deterministicOrder,
    requestCategoryKey,
    relatedServiceId,
    executable: false as const,
  });

const responseCategory = (
  responseCategoryKey: string,
  name: string,
  relatedServiceId: string | null,
  description: string,
  deterministicOrder: number,
): KnowledgeServiceResponseCategoryRegistration =>
  Object.freeze({
    id: `DKL-7:2/ResponseCategory/${responseCategoryKey}`,
    name,
    category: "responseCategory" as const,
    description,
    owner: "DKL-7" as const,
    status: "Registered" as const,
    runtimeBehavior: "None" as const,
    metadataOnly: true as const,
    deterministicOrder,
    responseCategoryKey,
    relatedServiceId,
    transportAware: false as const,
    executable: false as const,
  });

const accessMode = (
  accessModeKey: string,
  name: string,
  description: string,
  deterministicOrder: number,
): KnowledgeServiceAccessModeRegistration =>
  Object.freeze({
    id: `DKL-7:2/AccessMode/${accessModeKey}`,
    name,
    category: "accessMode" as const,
    description,
    owner: "DKL-7" as const,
    status: "Registered" as const,
    runtimeBehavior: "None" as const,
    metadataOnly: true as const,
    deterministicOrder,
    accessModeKey,
    readOnly: true as const,
    mutationAllowed: false as const,
  });

const relationship = (
  serviceKey: string,
  capabilityId: string,
  deterministicOrder: number,
): KnowledgeServiceCapabilityRelationship =>
  Object.freeze({
    id: `DKL-7:2/Relationship/${serviceKey}/${capabilityId}`,
    name: `${serviceKey} → ${capabilityId}`,
    category: "relationship" as const,
    description: `Declarative mapping from ${serviceKey} to capability ${capabilityId}.`,
    owner: "DKL-7" as const,
    status: "Registered" as const,
    runtimeBehavior: "None" as const,
    metadataOnly: true as const,
    deterministicOrder,
    serviceId: `DKL-7:2/Service/${serviceKey}`,
    capabilityId,
    foundationCapabilityReference: `DKL-7:1/KnowledgeServicesFoundation#${capabilityId}`,
    routing: false as const,
    dispatching: false as const,
  });

/** Canonical Knowledge Service registrations — architectural declarations only. */
export const KnowledgeServiceRegistrations: readonly KnowledgeServiceRegistration[] =
  Object.freeze([
    service(
      "KnowledgeRetrievalService",
      "Knowledge Retrieval Service",
      "KnowledgeRetrieval",
      "Architectural registration for read-only knowledge retrieval.",
      1,
    ),
    service(
      "BusinessObjectAccessService",
      "Business Object Access Service",
      "BusinessObjectAccess",
      "Architectural registration for read-only Business Object access.",
      2,
    ),
    service(
      "KnowledgeSearchService",
      "Knowledge Search Service",
      "KnowledgeSearch",
      "Architectural registration for knowledge search vocabulary.",
      3,
    ),
    service(
      "RelationshipLookupService",
      "Relationship Lookup Service",
      "RelationshipLookup",
      "Architectural registration for relationship lookup vocabulary.",
      4,
    ),
    service(
      "KnowledgeGraphNavigationService",
      "Knowledge Graph Navigation Service",
      "KnowledgeGraphTraversal",
      "Architectural registration for knowledge graph navigation vocabulary.",
      5,
    ),
    service(
      "MetadataQueryService",
      "Metadata Query Service",
      "MetadataQuery",
      "Architectural registration for metadata query vocabulary.",
      6,
    ),
    service(
      "TimelineQueryService",
      "Timeline Query Service",
      "TimelineQuery",
      "Architectural registration for timeline query vocabulary.",
      7,
    ),
    service(
      "EvidenceLookupService",
      "Evidence Lookup Service",
      "EvidenceLookup",
      "Architectural registration for evidence lookup vocabulary.",
      8,
    ),
    service(
      "KnowledgeSummaryService",
      "Knowledge Summary Service",
      "KnowledgeSummary",
      "Architectural registration for knowledge summary vocabulary.",
      9,
    ),
    service(
      "KnowledgeDiscoveryService",
      "Knowledge Discovery Service",
      "KnowledgeDiscovery",
      "Architectural registration for knowledge discovery vocabulary.",
      10,
    ),
    service(
      "ReferenceResolutionService",
      "Reference Resolution Service",
      "ReferenceResolution",
      "Architectural registration for reference resolution vocabulary.",
      11,
    ),
    service(
      "CrossDomainNavigationService",
      "Cross-Domain Navigation Service",
      "CrossDomainNavigation",
      "Architectural registration for cross-domain navigation vocabulary.",
      12,
    ),
  ]);

/** Metadata-only request category vocabulary. */
export const KnowledgeServiceRequestCategoryRegistrations: readonly KnowledgeServiceRequestCategoryRegistration[] =
  Object.freeze([
    requestCategory(
      "ObjectRetrievalRequest",
      "Object Retrieval Request",
      "DKL-7:2/Service/KnowledgeRetrievalService",
      "Request vocabulary for single-object retrieval declarations.",
      1,
    ),
    requestCategory(
      "ObjectCollectionRequest",
      "Object Collection Request",
      "DKL-7:2/Service/KnowledgeRetrievalService",
      "Request vocabulary for collection retrieval declarations.",
      2,
    ),
    requestCategory(
      "KnowledgeSearchRequest",
      "Knowledge Search Request",
      "DKL-7:2/Service/KnowledgeSearchService",
      "Request vocabulary for knowledge search declarations.",
      3,
    ),
    requestCategory(
      "RelationshipLookupRequest",
      "Relationship Lookup Request",
      "DKL-7:2/Service/RelationshipLookupService",
      "Request vocabulary for relationship lookup declarations.",
      4,
    ),
    requestCategory(
      "GraphNavigationRequest",
      "Graph Navigation Request",
      "DKL-7:2/Service/KnowledgeGraphNavigationService",
      "Request vocabulary for graph navigation declarations.",
      5,
    ),
    requestCategory(
      "MetadataQueryRequest",
      "Metadata Query Request",
      "DKL-7:2/Service/MetadataQueryService",
      "Request vocabulary for metadata query declarations.",
      6,
    ),
    requestCategory(
      "TimelineQueryRequest",
      "Timeline Query Request",
      "DKL-7:2/Service/TimelineQueryService",
      "Request vocabulary for timeline query declarations.",
      7,
    ),
    requestCategory(
      "EvidenceLookupRequest",
      "Evidence Lookup Request",
      "DKL-7:2/Service/EvidenceLookupService",
      "Request vocabulary for evidence lookup declarations.",
      8,
    ),
    requestCategory(
      "SummaryRequest",
      "Summary Request",
      "DKL-7:2/Service/KnowledgeSummaryService",
      "Request vocabulary for knowledge summary declarations.",
      9,
    ),
    requestCategory(
      "DiscoveryRequest",
      "Discovery Request",
      "DKL-7:2/Service/KnowledgeDiscoveryService",
      "Request vocabulary for knowledge discovery declarations.",
      10,
    ),
    requestCategory(
      "ReferenceResolutionRequest",
      "Reference Resolution Request",
      "DKL-7:2/Service/ReferenceResolutionService",
      "Request vocabulary for reference resolution declarations.",
      11,
    ),
    requestCategory(
      "CrossDomainNavigationRequest",
      "Cross-Domain Navigation Request",
      "DKL-7:2/Service/CrossDomainNavigationService",
      "Request vocabulary for cross-domain navigation declarations.",
      12,
    ),
  ]);

/** Metadata-only response category vocabulary. */
export const KnowledgeServiceResponseCategoryRegistrations: readonly KnowledgeServiceResponseCategoryRegistration[] =
  Object.freeze([
    responseCategory(
      "KnowledgeObjectResponse",
      "Knowledge Object Response",
      "DKL-7:2/Service/KnowledgeRetrievalService",
      "Response vocabulary for a single knowledge object declaration.",
      1,
    ),
    responseCategory(
      "KnowledgeCollectionResponse",
      "Knowledge Collection Response",
      "DKL-7:2/Service/KnowledgeRetrievalService",
      "Response vocabulary for knowledge collection declarations.",
      2,
    ),
    responseCategory(
      "RelationshipResponse",
      "Relationship Response",
      "DKL-7:2/Service/RelationshipLookupService",
      "Response vocabulary for relationship declarations.",
      3,
    ),
    responseCategory(
      "GraphPathResponse",
      "Graph Path Response",
      "DKL-7:2/Service/KnowledgeGraphNavigationService",
      "Response vocabulary for graph path declarations.",
      4,
    ),
    responseCategory(
      "MetadataResponse",
      "Metadata Response",
      "DKL-7:2/Service/MetadataQueryService",
      "Response vocabulary for metadata declarations.",
      5,
    ),
    responseCategory(
      "TimelineResponse",
      "Timeline Response",
      "DKL-7:2/Service/TimelineQueryService",
      "Response vocabulary for timeline declarations.",
      6,
    ),
    responseCategory(
      "EvidenceResponse",
      "Evidence Response",
      "DKL-7:2/Service/EvidenceLookupService",
      "Response vocabulary for evidence declarations.",
      7,
    ),
    responseCategory(
      "KnowledgeSummaryResponse",
      "Knowledge Summary Response",
      "DKL-7:2/Service/KnowledgeSummaryService",
      "Response vocabulary for knowledge summary declarations.",
      8,
    ),
    responseCategory(
      "DiscoveryResponse",
      "Discovery Response",
      "DKL-7:2/Service/KnowledgeDiscoveryService",
      "Response vocabulary for discovery declarations.",
      9,
    ),
    responseCategory(
      "ReferenceResolutionResponse",
      "Reference Resolution Response",
      "DKL-7:2/Service/ReferenceResolutionService",
      "Response vocabulary for reference resolution declarations.",
      10,
    ),
    responseCategory(
      "CrossDomainResultResponse",
      "Cross-Domain Result Response",
      "DKL-7:2/Service/CrossDomainNavigationService",
      "Response vocabulary for cross-domain result declarations.",
      11,
    ),
    responseCategory(
      "ServiceErrorMetadataResponse",
      "Service Error Metadata Response",
      null,
      "Response vocabulary for architectural error metadata — no transport codes.",
      12,
    ),
  ]);

/** Approved read-only access modes. */
export const KnowledgeServiceAccessModeRegistrations: readonly KnowledgeServiceAccessModeRegistration[] =
  Object.freeze([
    accessMode(
      "DirectReference",
      "Direct Reference",
      "Read-only access by direct knowledge reference.",
      1,
    ),
    accessMode(
      "IdentityLookup",
      "Identity Lookup",
      "Read-only access by identity lookup.",
      2,
    ),
    accessMode(
      "FilteredRetrieval",
      "Filtered Retrieval",
      "Read-only filtered retrieval access vocabulary.",
      3,
    ),
    accessMode(
      "RelationshipNavigation",
      "Relationship Navigation",
      "Read-only relationship navigation access vocabulary.",
      4,
    ),
    accessMode(
      "GraphTraversal",
      "Graph Traversal",
      "Read-only graph traversal access vocabulary.",
      5,
    ),
    accessMode(
      "TimelineAccess",
      "Timeline Access",
      "Read-only timeline access vocabulary.",
      6,
    ),
    accessMode(
      "EvidenceAccess",
      "Evidence Access",
      "Read-only evidence access vocabulary.",
      7,
    ),
    accessMode(
      "MetadataAccess",
      "Metadata Access",
      "Read-only metadata access vocabulary.",
      8,
    ),
    accessMode(
      "CrossDomainNavigation",
      "Cross-Domain Navigation",
      "Read-only cross-domain navigation access vocabulary.",
      9,
    ),
    accessMode(
      "AggregatedRead",
      "Aggregated Read",
      "Read-only aggregated read access vocabulary.",
      10,
    ),
  ]);

/** Declarative service-to-capability relationships. */
export const KnowledgeServiceCapabilityRelationships: readonly KnowledgeServiceCapabilityRelationship[] =
  Object.freeze(
    KnowledgeServiceRegistrations.map((registration, index) =>
      relationship(
        registration.serviceKey,
        registration.capabilityId,
        index + 1,
      ),
    ),
  );

/** Mutation modes explicitly prohibited for Knowledge Services. */
export const KNOWLEDGE_SERVICES_PROHIBITED_MUTATION_MODES: readonly KnowledgeServicesProhibitedMutationMode[] =
  Object.freeze([
    "create",
    "update",
    "delete",
    "execute",
    "mutate",
    "persist",
    "approve",
    "decide",
    "plan",
    "orchestrate",
  ]);

/** Aggregated entry collections for services and related vocabularies. */
export const KnowledgeServicesRegistryEntries = Object.freeze({
  entriesId: "DKL-7:2/KnowledgeServicesRegistryEntries",
  sourcePhase: "DKL-7:2" as const,
  services: KnowledgeServiceRegistrations,
  requestCategories: KnowledgeServiceRequestCategoryRegistrations,
  responseCategories: KnowledgeServiceResponseCategoryRegistrations,
  accessModes: KnowledgeServiceAccessModeRegistrations,
  relationships: KnowledgeServiceCapabilityRelationships,
  prohibitedMutationModes: KNOWLEDGE_SERVICES_PROHIBITED_MUTATION_MODES,
  serviceCount: KnowledgeServiceRegistrations.length,
  requestCategoryCount: KnowledgeServiceRequestCategoryRegistrations.length,
  responseCategoryCount: KnowledgeServiceResponseCategoryRegistrations.length,
  accessModeCount: KnowledgeServiceAccessModeRegistrations.length,
  relationshipCount: KnowledgeServiceCapabilityRelationships.length,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
