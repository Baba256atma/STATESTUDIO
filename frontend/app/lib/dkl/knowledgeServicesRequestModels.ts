/**
 * DKL-7:3 — Knowledge Services Request Models.
 *
 * Canonical request model declarations for all 12 DKL-7:2 request categories.
 * Schemas only — no filtering, searching, routing, or execution.
 *
 * Ownership: owned exclusively by DKL-7:3.
 */

import {
  KnowledgeServicesRegistry,
} from "./knowledgeServicesRegistry.ts";
import type { KnowledgeServiceRequestModel } from "./knowledgeServicesModelTypes.ts";

const OUTCOME_CONTRACT =
  KnowledgeServicesRegistry.contracts.find(
    (c) => c.contractId === "DKL-7:1/KnowledgeServiceRequest",
  )?.id ?? "DKL-7:2/Contract/KnowledgeServiceRequest";

const accessModeId = (key: string): string =>
  KnowledgeServicesRegistry.accessModes.find((m) => m.accessModeKey === key)
    ?.id ?? `DKL-7:2/AccessMode/${key}`;

const requestCategoryId = (key: string): string =>
  KnowledgeServicesRegistry.requestCategories.find(
    (c) => c.requestCategoryKey === key,
  )?.id ?? `DKL-7:2/RequestCategory/${key}`;

const serviceId = (key: string): string =>
  KnowledgeServicesRegistry.services.find((s) => s.serviceKey === key)?.id ??
  `DKL-7:2/Service/${key}`;

const capabilityIdForService = (serviceKey: string): string => {
  const service = KnowledgeServicesRegistry.services.find(
    (s) => s.serviceKey === serviceKey,
  );
  const capability = KnowledgeServicesRegistry.capabilities.find(
    (c) => c.capabilityId === service?.capabilityId,
  );
  return capability?.id ?? `DKL-7:2/Capability/${service?.capabilityId ?? "Unknown"}`;
};

const request = (
  key: string,
  name: string,
  serviceKey: string,
  accessModeKey: string,
  scope: KnowledgeServiceRequestModel["scopeDeclaration"],
  filterDeclaration: string,
  relationshipDepth: string,
  resultShape: string,
  deterministicOrder: number,
): KnowledgeServiceRequestModel =>
  Object.freeze({
    modelId: `DKL-7:3/Request/${key}`,
    modelName: name,
    requestCategoryReference: requestCategoryId(key),
    serviceReference: serviceId(serviceKey),
    capabilityReference: capabilityIdForService(serviceKey),
    contractReference: OUTCOME_CONTRACT,
    accessModeReference: accessModeId(accessModeKey),
    subjectReferenceDeclaration: "DKL-7:3/Reference/SubjectReference",
    scopeDeclaration: scope,
    filterDeclarationMetadata: filterDeclaration,
    relationshipDepthDeclaration: relationshipDepth,
    resultShapeDeclaration: resultShape,
    traceReferenceDeclaration: "DKL-7:3/Context/TraceContext",
    readOnly: true as const,
    mutationAllowed: false as const,
    executable: false as const,
    hasHandler: false as const,
    metadataOnly: true as const,
    deterministicOrder,
  });

/** Exactly twelve canonical Knowledge Service request models. */
export const KnowledgeServicesRequestModels: readonly KnowledgeServiceRequestModel[] =
  Object.freeze([
    request(
      "ObjectRetrievalRequest",
      "Object Retrieval Request",
      "KnowledgeRetrievalService",
      "IdentityLookup",
      "SingleObject",
      "Filter declarations describe identity selection metadata only.",
      "DepthNone",
      "DKL-7:3/Result/KnowledgeObjectResult",
      1,
    ),
    request(
      "ObjectCollectionRequest",
      "Object Collection Request",
      "KnowledgeRetrievalService",
      "FilteredRetrieval",
      "ObjectCollection",
      "Filter declarations describe collection scope metadata only.",
      "DepthNone",
      "DKL-7:3/Result/KnowledgeCollectionResult",
      2,
    ),
    request(
      "KnowledgeSearchRequest",
      "Knowledge Search Request",
      "KnowledgeSearchService",
      "FilteredRetrieval",
      "Domain",
      "Filter declarations describe search vocabulary metadata only.",
      "DepthNone",
      "DKL-7:3/Result/DiscoveryResult",
      3,
    ),
    request(
      "RelationshipLookupRequest",
      "Relationship Lookup Request",
      "RelationshipLookupService",
      "RelationshipNavigation",
      "RelationshipNeighborhood",
      "Filter declarations describe relationship type metadata only.",
      "DepthOne",
      "DKL-7:3/Result/RelationshipResult",
      4,
    ),
    request(
      "GraphNavigationRequest",
      "Graph Navigation Request",
      "KnowledgeGraphNavigationService",
      "GraphTraversal",
      "RelationshipNeighborhood",
      "Filter declarations describe path-scope metadata only.",
      "DepthDeclared",
      "DKL-7:3/Result/GraphPathResult",
      5,
    ),
    request(
      "MetadataQueryRequest",
      "Metadata Query Request",
      "MetadataQueryService",
      "MetadataAccess",
      "SingleObject",
      "Filter declarations describe metadata category metadata only.",
      "DepthNone",
      "DKL-7:3/Result/MetadataResult",
      6,
    ),
    request(
      "TimelineQueryRequest",
      "Timeline Query Request",
      "TimelineQueryService",
      "TimelineAccess",
      "Timeline",
      "Filter declarations describe period metadata only.",
      "DepthNone",
      "DKL-7:3/Result/TimelineResult",
      7,
    ),
    request(
      "EvidenceLookupRequest",
      "Evidence Lookup Request",
      "EvidenceLookupService",
      "EvidenceAccess",
      "EvidenceSet",
      "Filter declarations describe evidence category metadata only.",
      "DepthNone",
      "DKL-7:3/Result/EvidenceResult",
      8,
    ),
    request(
      "SummaryRequest",
      "Summary Request",
      "KnowledgeSummaryService",
      "AggregatedRead",
      "OrganizationalScope",
      "Filter declarations describe included-section metadata only.",
      "DepthNone",
      "DKL-7:3/Result/KnowledgeSummaryResult",
      9,
    ),
    request(
      "DiscoveryRequest",
      "Discovery Request",
      "KnowledgeDiscoveryService",
      "FilteredRetrieval",
      "Domain",
      "Filter declarations describe discovery-scope metadata only.",
      "DepthNone",
      "DKL-7:3/Result/DiscoveryResult",
      10,
    ),
    request(
      "ReferenceResolutionRequest",
      "Reference Resolution Request",
      "ReferenceResolutionService",
      "IdentityLookup",
      "SingleObject",
      "Filter declarations describe input-reference metadata only.",
      "DepthNone",
      "DKL-7:3/Result/ReferenceResolutionResult",
      11,
    ),
    request(
      "CrossDomainNavigationRequest",
      "Cross-Domain Navigation Request",
      "CrossDomainNavigationService",
      "CrossDomainNavigation",
      "CrossDomain",
      "Filter declarations describe origin and destination domain metadata only.",
      "DepthDeclared",
      "DKL-7:3/Result/CrossDomainNavigationResult",
      12,
    ),
  ]);

/** Immutable request-model inventory aggregate. */
export const KnowledgeServicesRequestModelInventory = Object.freeze({
  inventoryId: "DKL-7:3/RequestModelInventory",
  models: KnowledgeServicesRequestModels,
  modelCount: KnowledgeServicesRequestModels.length,
  notes: Object.freeze({
    metadataOnly: true,
    noFiltering: true,
    noParsing: true,
    noSearching: true,
    noMatching: true,
    noRouting: true,
    noQueryPlanning: true,
    noGraphTraversal: true,
    noRequestExecution: true,
    noAuthorization: true,
    noTransportValidation: true,
    noMutationFields: true,
    noSqlOrQueryLanguage: true,
    noHttpMethod: true,
    noEndpointUrl: true,
    noAuthenticationToken: true,
    noRuntimeHandler: true,
    noExecutablePredicate: true,
    noCallback: true,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
