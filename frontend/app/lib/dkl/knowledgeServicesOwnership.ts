/**
 * DKL-7:1 — Knowledge Services Ownership.
 *
 * Explicit ownership and non-ownership declarations for the Knowledge Services
 * Foundation. Ownership: owned exclusively by DKL-7:1.
 */

export const KNOWLEDGE_SERVICES_OWNS = Object.freeze([
  "Knowledge Service contracts",
  "Knowledge Service metadata",
  "Service capability declarations",
  "Knowledge access vocabulary",
  "Read-only service boundaries",
  "Service lifecycle definitions",
] as const);

export const KNOWLEDGE_SERVICES_DOES_NOT_OWN = Object.freeze([
  "Repository implementation",
  "Persistence",
  "Database",
  "Search engine",
  "Graph engine",
  "Caching",
  "Authentication",
  "Authorization",
  "Transport",
  "REST",
  "HTTP",
  "SDK",
  "MCP",
  "NEA",
  "Executive Engine",
  "Advisor",
  "Scene",
  "Business Object creation",
  "Knowledge validation",
  "Knowledge storage",
  "AI reasoning",
  "Decision making",
  "Planning",
  "Execution",
] as const);

/** Canonical immutable ownership declarations. */
export const KnowledgeServicesOwnership = Object.freeze({
  ownershipId: "DKL-7:1/KnowledgeServicesOwnership",
  owner: "DKL-7 Knowledge Services Foundation",
  sourcePhase: "DKL-7:1" as const,
  owns: KNOWLEDGE_SERVICES_OWNS,
  doesNotOwn: KNOWLEDGE_SERVICES_DOES_NOT_OWN,
  ownsCount: KNOWLEDGE_SERVICES_OWNS.length,
  doesNotOwnCount: KNOWLEDGE_SERVICES_DOES_NOT_OWN.length,
  separationNote:
    "DKL-7 declares the official read-only Knowledge Services access layer; it does not implement repositories, persistence, search, graph engines, networking, AI reasoning, or Executive Engine behavior.",
  dkl6RetainsRepositoryOwnership: true,
  noRepositoryImplementationOwnership: true,
  noPersistenceOwnership: true,
  noExecutiveEngineOwnership: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
