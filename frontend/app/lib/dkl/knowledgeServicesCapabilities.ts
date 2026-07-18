/**
 * DKL-7:1 — Knowledge Services Capabilities.
 *
 * Immutable capability declarations for Knowledge Services.
 * Declarations only — no retrieval, search, graph, or query implementation.
 *
 * Ownership: owned exclusively by DKL-7:1.
 */

import type { KnowledgeServiceCapability } from "./knowledgeServicesFoundationTypes.ts";

const capability = (
  capabilityId: KnowledgeServiceCapability["capabilityId"],
  name: string,
  description: string,
): KnowledgeServiceCapability =>
  Object.freeze({
    capabilityId,
    name,
    description,
    metadataOnly: true as const,
    declaredOnly: true as const,
    implemented: false as const,
    createsKnowledge: false as const,
    modifiesKnowledge: false as const,
    performsExecutiveReasoning: false as const,
  });

export const KNOWLEDGE_SERVICE_CAPABILITIES: readonly KnowledgeServiceCapability[] =
  Object.freeze([
    capability(
      "KnowledgeRetrieval",
      "Knowledge Retrieval",
      "Declared capability to retrieve organizational knowledge by reference.",
    ),
    capability(
      "BusinessObjectAccess",
      "Business Object Access",
      "Declared capability to access Business Object knowledge surfaces read-only.",
    ),
    capability(
      "KnowledgeSearch",
      "Knowledge Search",
      "Declared capability to search across organizational knowledge.",
    ),
    capability(
      "RelationshipLookup",
      "Relationship Lookup",
      "Declared capability to look up declared knowledge relationships.",
    ),
    capability(
      "KnowledgeGraphTraversal",
      "Knowledge Graph Traversal",
      "Declared capability to traverse knowledge graph relationships.",
    ),
    capability(
      "MetadataQuery",
      "Metadata Query",
      "Declared capability to query knowledge metadata surfaces.",
    ),
    capability(
      "TimelineQuery",
      "Timeline Query",
      "Declared capability to query knowledge timeline declarations.",
    ),
    capability(
      "EvidenceLookup",
      "Evidence Lookup",
      "Declared capability to look up knowledge evidence references.",
    ),
    capability(
      "KnowledgeSummary",
      "Knowledge Summary",
      "Declared capability to obtain knowledge summary declarations.",
    ),
    capability(
      "KnowledgeDiscovery",
      "Knowledge Discovery",
      "Declared capability to discover available knowledge surfaces.",
    ),
    capability(
      "ReferenceResolution",
      "Reference Resolution",
      "Declared capability to resolve knowledge references.",
    ),
    capability(
      "CrossDomainNavigation",
      "Cross-domain Navigation",
      "Declared capability to navigate across knowledge domains.",
    ),
  ]);

/** Canonical immutable Knowledge Service capability declarations. */
export const KnowledgeServicesCapabilities = Object.freeze({
  capabilitiesId: "DKL-7:1/KnowledgeServicesCapabilities",
  sourcePhase: "DKL-7:1" as const,
  capabilities: KNOWLEDGE_SERVICE_CAPABILITIES,
  capabilityCount: KNOWLEDGE_SERVICE_CAPABILITIES.length,
  requiredCapabilityIds: Object.freeze([
    "KnowledgeRetrieval",
    "BusinessObjectAccess",
    "KnowledgeSearch",
    "RelationshipLookup",
    "KnowledgeGraphTraversal",
    "MetadataQuery",
    "TimelineQuery",
    "EvidenceLookup",
    "KnowledgeSummary",
    "KnowledgeDiscovery",
    "ReferenceResolution",
    "CrossDomainNavigation",
  ] as const),
  notes: Object.freeze({
    metadataOnly: true,
    declarationsOnly: true,
    noImplementation: true,
    noRetrievalRuntime: true,
    noSearchRuntime: true,
    noGraphRuntime: true,
    noQueryRuntime: true,
    createsKnowledge: false,
    modifiesKnowledge: false,
    performsExecutiveReasoning: false,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
