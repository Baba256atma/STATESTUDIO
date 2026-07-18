/**
 * DKL-7:3 — Knowledge Services Response Models.
 *
 * Canonical response model declarations for all 12 DKL-7:2 response categories.
 * Architectural schemas only — no transport statuses or serializers.
 *
 * Ownership: owned exclusively by DKL-7:3.
 */

import { KnowledgeServicesRegistry } from "./knowledgeServicesRegistry.ts";
import { KnowledgeServicesRequestModels } from "./knowledgeServicesRequestModels.ts";
import type {
  KnowledgeServiceArchitecturalOutcome,
  KnowledgeServiceResponseModel,
} from "./knowledgeServicesModelTypes.ts";

const OUTCOMES: readonly KnowledgeServiceArchitecturalOutcome[] = Object.freeze([
  "Available",
  "PartiallyAvailable",
  "Unavailable",
  "Ambiguous",
  "NotFound",
  "Restricted",
  "InvalidRequestMetadata",
]);

const RESPONSE_CONTRACT =
  KnowledgeServicesRegistry.contracts.find(
    (c) => c.contractId === "DKL-7:1/KnowledgeServiceResponse",
  )?.id ?? "DKL-7:2/Contract/KnowledgeServiceResponse";

const responseCategoryId = (key: string): string =>
  KnowledgeServicesRegistry.responseCategories.find(
    (c) => c.responseCategoryKey === key,
  )?.id ?? `DKL-7:2/ResponseCategory/${key}`;

const requestModelId = (key: string): string =>
  KnowledgeServicesRequestModels.find((m) =>
    m.modelId.endsWith(`/${key}`),
  )?.modelId ?? `DKL-7:3/Request/${key}`;

const serviceForRequest = (requestKey: string): string =>
  KnowledgeServicesRequestModels.find((m) =>
    m.modelId.endsWith(`/${requestKey}`),
  )?.serviceReference ?? "";

const capabilityForRequest = (requestKey: string): string =>
  KnowledgeServicesRequestModels.find((m) =>
    m.modelId.endsWith(`/${requestKey}`),
  )?.capabilityReference ?? "";

const response = (
  key: string,
  name: string,
  requestKey: string | null,
  serviceReference: string,
  capabilityReference: string,
  resultShape: string,
  completeness: string,
  deterministicOrder: number,
): KnowledgeServiceResponseModel =>
  Object.freeze({
    modelId: `DKL-7:3/Response/${key}`,
    modelName: name,
    responseCategoryReference: responseCategoryId(key),
    originatingRequestModelReference: requestKey
      ? requestModelId(requestKey)
      : "DKL-7:3/Request/Any",
    serviceReference,
    capabilityReference,
    resultEnvelopeReference: "DKL-7:3/Result/ServiceResultEnvelope",
    resultShapeMetadata: resultShape,
    traceReferenceDeclaration: "DKL-7:3/Context/TraceContext",
    completenessDeclaration: completeness,
    confidenceMetadataReference: "DKL-7:3/Reference/MetadataReference",
    provenanceReferenceDeclaration: "DKL-7:3/Context/ProvenanceContext",
    architecturalOutcomeVocabulary: OUTCOMES,
    readOnly: true as const,
    transportAware: false as const,
    hasSerializer: false as const,
    hasHandler: false as const,
    metadataOnly: true as const,
    deterministicOrder,
  });

/** Exactly twelve canonical Knowledge Service response models. */
export const KnowledgeServicesResponseModels: readonly KnowledgeServiceResponseModel[] =
  Object.freeze([
    response(
      "KnowledgeObjectResponse",
      "Knowledge Object Response",
      "ObjectRetrievalRequest",
      serviceForRequest("ObjectRetrievalRequest"),
      capabilityForRequest("ObjectRetrievalRequest"),
      "DKL-7:3/Result/KnowledgeObjectResult",
      "CompleteWhenObjectReferencePresent",
      1,
    ),
    response(
      "KnowledgeCollectionResponse",
      "Knowledge Collection Response",
      "ObjectCollectionRequest",
      serviceForRequest("ObjectCollectionRequest"),
      capabilityForRequest("ObjectCollectionRequest"),
      "DKL-7:3/Result/KnowledgeCollectionResult",
      "CompleteWhenCollectionDeclared",
      2,
    ),
    response(
      "RelationshipResponse",
      "Relationship Response",
      "RelationshipLookupRequest",
      serviceForRequest("RelationshipLookupRequest"),
      capabilityForRequest("RelationshipLookupRequest"),
      "DKL-7:3/Result/RelationshipResult",
      "CompleteWhenRelationshipReferencesDeclared",
      3,
    ),
    response(
      "GraphPathResponse",
      "Graph Path Response",
      "GraphNavigationRequest",
      serviceForRequest("GraphNavigationRequest"),
      capabilityForRequest("GraphNavigationRequest"),
      "DKL-7:3/Result/GraphPathResult",
      "CompleteWhenPathDeclared",
      4,
    ),
    response(
      "MetadataResponse",
      "Metadata Response",
      "MetadataQueryRequest",
      serviceForRequest("MetadataQueryRequest"),
      capabilityForRequest("MetadataQueryRequest"),
      "DKL-7:3/Result/MetadataResult",
      "CompleteWhenMetadataReferencesDeclared",
      5,
    ),
    response(
      "TimelineResponse",
      "Timeline Response",
      "TimelineQueryRequest",
      serviceForRequest("TimelineQueryRequest"),
      capabilityForRequest("TimelineQueryRequest"),
      "DKL-7:3/Result/TimelineResult",
      "CompleteWhenTimelineDeclared",
      6,
    ),
    response(
      "EvidenceResponse",
      "Evidence Response",
      "EvidenceLookupRequest",
      serviceForRequest("EvidenceLookupRequest"),
      capabilityForRequest("EvidenceLookupRequest"),
      "DKL-7:3/Result/EvidenceResult",
      "CompleteWhenEvidenceReferencesDeclared",
      7,
    ),
    response(
      "KnowledgeSummaryResponse",
      "Knowledge Summary Response",
      "SummaryRequest",
      serviceForRequest("SummaryRequest"),
      capabilityForRequest("SummaryRequest"),
      "DKL-7:3/Result/KnowledgeSummaryResult",
      "CompleteWhenSummarySectionsDeclared",
      8,
    ),
    response(
      "DiscoveryResponse",
      "Discovery Response",
      "DiscoveryRequest",
      serviceForRequest("DiscoveryRequest"),
      capabilityForRequest("DiscoveryRequest"),
      "DKL-7:3/Result/DiscoveryResult",
      "CompleteWhenDiscoveryScopeDeclared",
      9,
    ),
    response(
      "ReferenceResolutionResponse",
      "Reference Resolution Response",
      "ReferenceResolutionRequest",
      serviceForRequest("ReferenceResolutionRequest"),
      capabilityForRequest("ReferenceResolutionRequest"),
      "DKL-7:3/Result/ReferenceResolutionResult",
      "CompleteWhenCandidatesDeclared",
      10,
    ),
    response(
      "CrossDomainResultResponse",
      "Cross-Domain Result Response",
      "CrossDomainNavigationRequest",
      serviceForRequest("CrossDomainNavigationRequest"),
      capabilityForRequest("CrossDomainNavigationRequest"),
      "DKL-7:3/Result/CrossDomainNavigationResult",
      "CompleteWhenNavigationPathDeclared",
      11,
    ),
    response(
      "ServiceErrorMetadataResponse",
      "Service Error Metadata Response",
      null,
      "DKL-7:2/Service/Any",
      "DKL-7:2/Capability/Any",
      "DKL-7:3/Result/ServiceErrorMetadataResult",
      "CompleteWhenErrorMetadataDeclared",
      12,
    ),
  ]);

/** Immutable response-model inventory aggregate. */
export const KnowledgeServicesResponseModelInventory = Object.freeze({
  inventoryId: "DKL-7:3/ResponseModelInventory",
  models: KnowledgeServicesResponseModels,
  modelCount: KnowledgeServicesResponseModels.length,
  architecturalOutcomes: OUTCOMES,
  responseContractReference: RESPONSE_CONTRACT,
  notes: Object.freeze({
    metadataOnly: true,
    noHttpStatusCodes: true,
    noNetworkSemantics: true,
    noSerializer: true,
    noRuntimeHandler: true,
    noErrorHandlingImplementation: true,
    noAuthorizationImplementation: true,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
