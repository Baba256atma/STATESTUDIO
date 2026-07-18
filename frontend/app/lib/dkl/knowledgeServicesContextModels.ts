/**
 * DKL-7:3 — Knowledge Services Context Models.
 *
 * Consumer, scope, provenance, and trace context models plus reference and
 * graph supporting model inventories. Metadata only.
 *
 * Ownership: owned exclusively by DKL-7:3.
 */

import type {
  KnowledgeServiceContextModel,
  KnowledgeServiceGraphModel,
  KnowledgeServiceReferenceModel,
} from "./knowledgeServicesModelTypes.ts";

const context = (
  key: string,
  name: string,
  contextKind: string,
  description: string,
  fields: readonly string[],
  deterministicOrder: number,
): KnowledgeServiceContextModel =>
  Object.freeze({
    modelId: `DKL-7:3/Context/${key}`,
    modelName: name,
    contextKind,
    description,
    fields: Object.freeze([...fields]),
    importsConsumerImplementations: false as const,
    repositoryAccess: false as const,
    telemetry: false as const,
    metadataOnly: true as const,
    readOnly: true as const,
    deterministicOrder,
  });

const reference = (
  key: string,
  name: string,
  referenceKind: string,
  description: string,
  fields: readonly string[],
  deterministicOrder: number,
): KnowledgeServiceReferenceModel =>
  Object.freeze({
    modelId: `DKL-7:3/Reference/${key}`,
    modelName: name,
    referenceKind,
    description,
    fields: Object.freeze([...fields]),
    ownsReferencedEntity: false as const,
    metadataOnly: true as const,
    readOnly: true as const,
    deterministicOrder,
  });

const graph = (
  key: string,
  name: string,
  graphKind: string,
  description: string,
  fields: readonly string[],
  deterministicOrder: number,
): KnowledgeServiceGraphModel =>
  Object.freeze({
    modelId: `DKL-7:3/Graph/${key}`,
    modelName: name,
    graphKind,
    description,
    fields: Object.freeze([...fields]),
    algorithmic: false as const,
    traversable: false as const,
    metadataOnly: true as const,
    readOnly: true as const,
    deterministicOrder,
  });

/** Canonical service context models. */
export const KnowledgeServicesContextModels: readonly KnowledgeServiceContextModel[] =
  Object.freeze([
    context(
      "ConsumerContext",
      "Knowledge Service Consumer Context",
      "Consumer",
      "Architectural consumer category metadata for Knowledge Service requests.",
      Object.freeze([
        "consumerCategory",
        "consumerIdentityDeclaration",
        "approvedConsumerOnly",
        "importsConsumerImplementations",
      ]),
      1,
    ),
    context(
      "ScopeContext",
      "Knowledge Service Scope Context",
      "Scope",
      "Architectural scope descriptions for Knowledge Service requests.",
      Object.freeze([
        "scopeKind",
        "scopeIdentityDeclaration",
        "organizationalScopeDeclaration",
        "domainScopeDeclaration",
      ]),
      2,
    ),
    context(
      "ProvenanceContext",
      "Knowledge Service Provenance Context",
      "Provenance",
      "References to knowledge sources and prior DKL phase transformations.",
      Object.freeze([
        "knowledgeSourceReferences",
        "repositoryReferences",
        "sourceIdentities",
        "sourceVersions",
        "transformationReferences",
      ]),
      3,
    ),
    context(
      "TraceContext",
      "Knowledge Service Trace Context",
      "Trace",
      "Architectural traceability from consumer request through result envelope.",
      Object.freeze([
        "consumerRequestReference",
        "requestModelReference",
        "serviceReference",
        "capabilityReference",
        "contractReference",
        "responseModelReference",
        "resultEnvelopeReference",
      ]),
      4,
    ),
  ]);

/** Canonical reference model inventory. */
export const KnowledgeServicesReferenceModels: readonly KnowledgeServiceReferenceModel[] =
  Object.freeze([
    reference(
      "SubjectReference",
      "Knowledge Service Subject Reference",
      "Subject",
      "Architectural subject reference metadata.",
      Object.freeze([
        "referenceId",
        "subjectKind",
        "subjectIdentity",
        "domainReference",
        "sourceReference",
      ]),
      1,
    ),
    reference(
      "ObjectReference",
      "Knowledge Service Object Reference",
      "BusinessObject",
      "Business Object reference metadata — references only, never owns.",
      Object.freeze([
        "objectId",
        "objectType",
        "objectNamespace",
        "domainReference",
        "sourceReference",
        "versionReference",
      ]),
      2,
    ),
    reference(
      "RelationshipReference",
      "Knowledge Service Relationship Reference",
      "Relationship",
      "Architectural relationship reference metadata.",
      Object.freeze([
        "relationshipType",
        "sourceObjectReference",
        "targetObjectReference",
        "direction",
      ]),
      3,
    ),
    reference(
      "EvidenceReference",
      "Knowledge Service Evidence Reference",
      "Evidence",
      "Architectural evidence reference metadata.",
      Object.freeze([
        "evidenceIdentity",
        "evidenceCategory",
        "sourceReference",
        "subjectReference",
      ]),
      4,
    ),
    reference(
      "TimelineReference",
      "Knowledge Service Timeline Reference",
      "Timeline",
      "Architectural timeline reference metadata.",
      Object.freeze([
        "timelineIdentity",
        "eventReference",
        "subjectReference",
        "periodDeclaration",
      ]),
      5,
    ),
    reference(
      "MetadataReference",
      "Knowledge Service Metadata Reference",
      "Metadata",
      "Architectural metadata reference.",
      Object.freeze([
        "metadataIdentity",
        "metadataCategory",
        "ownershipReference",
        "sourceReference",
        "versionReference",
      ]),
      6,
    ),
    reference(
      "GraphNodeReference",
      "Knowledge Service Graph Node Reference",
      "GraphNode",
      "Static graph node reference — not traversable.",
      Object.freeze([
        "nodeIdentity",
        "objectReference",
        "domainReference",
      ]),
      7,
    ),
    reference(
      "GraphEdgeReference",
      "Knowledge Service Graph Edge Reference",
      "GraphEdge",
      "Static graph edge reference — not traversable.",
      Object.freeze([
        "edgeIdentity",
        "sourceNodeReference",
        "targetNodeReference",
        "relationshipReference",
        "direction",
      ]),
      8,
    ),
  ]);

/** Supporting graph model declarations (path is a result model). */
export const KnowledgeServicesGraphModels: readonly KnowledgeServiceGraphModel[] =
  Object.freeze([
    graph(
      "NeighborhoodDescription",
      "Graph Neighborhood Description",
      "Neighborhood",
      "Static neighborhood description around a graph node reference.",
      Object.freeze([
        "centerNodeReference",
        "adjacentNodeReferences",
        "adjacentEdgeReferences",
        "neighborhoodScope",
      ]),
      1,
    ),
    graph(
      "RelationshipDirection",
      "Graph Relationship Direction",
      "Direction",
      "Declared graph relationship direction vocabulary.",
      Object.freeze([
        "direction",
        "outbound",
        "inbound",
        "bidirectional",
        "undirected",
      ]),
      2,
    ),
    graph(
      "PathScopeDeclaration",
      "Graph Path Scope Declaration",
      "PathScope",
      "Declared path-scope metadata for static graph paths.",
      Object.freeze([
        "pathScopeIdentity",
        "maxDepthDeclaration",
        "includedRelationshipTypes",
        "excludedRelationshipTypes",
      ]),
      3,
    ),
  ]);

/** Immutable context-model inventory aggregate. */
export const KnowledgeServicesContextModelInventory = Object.freeze({
  inventoryId: "DKL-7:3/ContextModelInventory",
  contexts: KnowledgeServicesContextModels,
  references: KnowledgeServicesReferenceModels,
  graphModels: KnowledgeServicesGraphModels,
  contextCount: KnowledgeServicesContextModels.length,
  referenceCount: KnowledgeServicesReferenceModels.length,
  graphModelCount: KnowledgeServicesGraphModels.length,
  consumerCategories: Object.freeze([
    "ExecutiveEngine",
    "Advisor",
    "ApprovedInternalConsumer",
  ] as const),
  scopeKinds: Object.freeze([
    "SingleObject",
    "ObjectCollection",
    "RelationshipNeighborhood",
    "Domain",
    "CrossDomain",
    "Timeline",
    "EvidenceSet",
    "OrganizationalScope",
  ] as const),
  notes: Object.freeze({
    metadataOnly: true,
    noConsumerImports: true,
    noRepositoryAccess: true,
    noSourceReading: true,
    noRuntimeTracing: true,
    noTelemetry: true,
    businessObjectsReferencedNotOwned: true,
    graphModelsNonAlgorithmic: true,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
