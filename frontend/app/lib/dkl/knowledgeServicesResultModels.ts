/**
 * DKL-7:3 — Knowledge Services Result Models.
 *
 * Canonical result model declarations, result envelope, and collection shape.
 * Architectural schemas only — no repository access, algorithms, or AI.
 *
 * Ownership: owned exclusively by DKL-7:3.
 */

import type {
  KnowledgeServiceArchitecturalOutcome,
  KnowledgeServiceResultCollection,
  KnowledgeServiceResultEnvelope,
  KnowledgeServiceResultModel,
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

const result = (
  key: string,
  name: string,
  resultKind: string,
  description: string,
  fields: readonly string[],
  deterministicOrder: number,
  extras: {
    readonly algorithmic?: false;
    readonly aiBehavior?: false;
  } = {},
): KnowledgeServiceResultModel =>
  Object.freeze({
    modelId: `DKL-7:3/Result/${key}`,
    modelName: name,
    resultKind,
    description,
    fields: Object.freeze([...fields]),
    ownsBusinessObjects: false as const,
    repositoryAccess: false as const,
    algorithmic: extras.algorithmic ?? false,
    aiBehavior: extras.aiBehavior ?? false,
    executable: false as const,
    metadataOnly: true as const,
    readOnly: true as const,
    deterministicOrder,
  });

/** Exactly twelve primary Knowledge Service result models. */
export const KnowledgeServicesResultModels: readonly KnowledgeServiceResultModel[] =
  Object.freeze([
    result(
      "KnowledgeObjectResult",
      "Knowledge Object Result",
      "KnowledgeObject",
      "Canonical read-only reference to one organizational knowledge object.",
      Object.freeze([
        "objectReference",
        "objectType",
        "objectIdentity",
        "displayLabel",
        "domainReference",
        "sourceReferences",
        "relationshipReferences",
        "metadataReferences",
        "provenanceReferences",
      ]),
      1,
    ),
    result(
      "KnowledgeCollectionResult",
      "Knowledge Collection Result",
      "KnowledgeCollection",
      "Read-only collection of knowledge object references.",
      Object.freeze([
        "collectionIdentity",
        "itemReferences",
        "resultCount",
        "orderingDeclaration",
        "groupingDeclaration",
        "scopeDeclaration",
      ]),
      2,
    ),
    result(
      "RelationshipResult",
      "Relationship Result",
      "Relationship",
      "Declared relationship between knowledge subjects.",
      Object.freeze([
        "sourceObjectReference",
        "targetObjectReference",
        "relationshipType",
        "direction",
        "strengthMetadata",
        "evidenceReferences",
        "provenanceReferences",
      ]),
      3,
      { algorithmic: false },
    ),
    result(
      "GraphPathResult",
      "Graph Path Result",
      "GraphPath",
      "Static graph-path description — no traversal algorithm.",
      Object.freeze([
        "orderedNodeReferences",
        "orderedEdgeReferences",
        "pathLength",
        "startingReference",
        "endingReference",
        "pathScopeMetadata",
      ]),
      4,
      { algorithmic: false },
    ),
    result(
      "MetadataResult",
      "Metadata Result",
      "Metadata",
      "Metadata associated with a knowledge subject.",
      Object.freeze([
        "metadataReferences",
        "metadataCategories",
        "ownershipReferences",
        "sourceReferences",
        "versionReferences",
      ]),
      5,
    ),
    result(
      "TimelineResult",
      "Timeline Result",
      "Timeline",
      "Ordered timeline references — no runtime date processing.",
      Object.freeze([
        "timelineIdentity",
        "eventReferences",
        "sequenceDeclaration",
        "periodDeclaration",
        "subjectReferences",
        "sourceReferences",
      ]),
      6,
    ),
    result(
      "EvidenceResult",
      "Evidence Result",
      "Evidence",
      "Evidence references supporting organizational knowledge — no scoring.",
      Object.freeze([
        "evidenceReferences",
        "evidenceCategories",
        "sourceReferences",
        "subjectReferences",
        "relevanceDeclaration",
        "provenanceDeclaration",
      ]),
      7,
      { algorithmic: false },
    ),
    result(
      "KnowledgeSummaryResult",
      "Knowledge Summary Result",
      "KnowledgeSummary",
      "Structured summary description — no text generation or AI summarization.",
      Object.freeze([
        "subjectReferences",
        "summarySections",
        "includedResultReferences",
        "omittedResultDeclarations",
        "provenanceReferences",
      ]),
      8,
      { aiBehavior: false },
    ),
    result(
      "DiscoveryResult",
      "Discovery Result",
      "Discovery",
      "Discovered references and architectural discovery metadata — no search execution.",
      Object.freeze([
        "discoveredObjectReferences",
        "discoveredRelationshipReferences",
        "discoveryScopeDeclaration",
        "discoveryReasonMetadata",
        "provenanceReferences",
      ]),
      9,
    ),
    result(
      "ReferenceResolutionResult",
      "Reference Resolution Result",
      "ReferenceResolution",
      "Resolution candidates for an indirect reference — no candidate-selection logic.",
      Object.freeze([
        "inputReferenceMetadata",
        "candidateReferences",
        "selectedReferenceDeclaration",
        "ambiguityStatus",
        "evidenceReferences",
      ]),
      10,
      { algorithmic: false, aiBehavior: false },
    ),
    result(
      "CrossDomainNavigationResult",
      "Cross-Domain Navigation Result",
      "CrossDomainNavigation",
      "Static navigation structure across registered domains — no dynamic routing.",
      Object.freeze([
        "originDomainReference",
        "destinationDomainReferences",
        "intermediaryObjectReferences",
        "relationshipReferences",
        "navigationPathDeclarations",
      ]),
      11,
      { algorithmic: false },
    ),
    result(
      "ServiceErrorMetadataResult",
      "Service Error Metadata Result",
      "ServiceErrorMetadata",
      "Architectural error metadata — no exceptions, logging, or transport status.",
      Object.freeze([
        "errorCategory",
        "relatedRequestReference",
        "affectedServiceReference",
        "missingReferenceDeclarations",
        "boundaryViolationDeclarations",
        "recoverabilityMetadata",
      ]),
      12,
    ),
  ]);

/** Canonical immutable result envelope model. */
export const KnowledgeServicesResultEnvelope: KnowledgeServiceResultEnvelope =
  Object.freeze({
    envelopeId: "DKL-7:3/Result/ServiceResultEnvelope",
    requestModelReference: "DKL-7:3/Request/*",
    responseModelReference: "DKL-7:3/Response/*",
    serviceReference: "DKL-7:2/Service/*",
    capabilityReference: "DKL-7:2/Capability/*",
    contractReference: "DKL-7:2/Contract/KnowledgeServiceResponse",
    resultTypeReference: "DKL-7:3/Result/*",
    resultReferenceDeclaration: "SingleResultOrResultReferenceCollection",
    provenanceReferenceDeclaration: "DKL-7:3/Context/ProvenanceContext",
    traceReferenceDeclaration: "DKL-7:3/Context/TraceContext",
    completenessMetadata: "ArchitecturalCompletenessDeclaration",
    outcomeStatusVocabulary: OUTCOMES,
    readOnly: true as const,
    runtimePayloadProcessing: false as const,
    metadataOnly: true as const,
  });

/** Canonical immutable result collection shape. */
export const KnowledgeServicesResultCollection: KnowledgeServiceResultCollection =
  Object.freeze({
    collectionId: "DKL-7:3/Result/ServiceResultCollection",
    itemReferenceDeclaration: "ReadonlyKnowledgeObjectReferences",
    resultCountDeclaration: "DeclaredCountOnly",
    orderingDeclaration: "DeclaredOrderOnly",
    groupingDeclaration: "DeclaredGroupingOnly",
    scopeDeclaration: "DeclaredScopeOnly",
    mutable: false as const,
    paginationEngine: false as const,
    metadataOnly: true as const,
    readOnly: true as const,
  });

/** Immutable result-model inventory aggregate. */
export const KnowledgeServicesResultModelInventory = Object.freeze({
  inventoryId: "DKL-7:3/ResultModelInventory",
  models: KnowledgeServicesResultModels,
  modelCount: KnowledgeServicesResultModels.length,
  envelope: KnowledgeServicesResultEnvelope,
  collection: KnowledgeServicesResultCollection,
  notes: Object.freeze({
    metadataOnly: true,
    noRepositoryAccess: true,
    noGraphAlgorithms: true,
    noEvidenceScoring: true,
    noAiSummarization: true,
    noCandidateSelection: true,
    noExceptionThrowing: true,
    noLogging: true,
    noTransportStatus: true,
    noRuntimeDateProcessing: true,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
