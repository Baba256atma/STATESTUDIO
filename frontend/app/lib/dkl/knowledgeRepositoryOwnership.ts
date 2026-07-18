/**
 * DKL-6:1 — Knowledge Repository Ownership.
 *
 * Explicit ownership and non-ownership declarations for the Knowledge
 * Repository Foundation. Ownership: owned exclusively by DKL-6:1.
 */

export const KNOWLEDGE_REPOSITORY_OWNS = Object.freeze([
  "Repository contracts",
  "Repository identity",
  "Repository metadata",
  "Repository lifecycle",
  "Repository ownership",
  "Repository boundaries",
  "Repository version model",
  "Snapshot concepts",
  "Archive concepts",
  "Retrieval contracts",
  "Repository policies",
] as const);

export const KNOWLEDGE_REPOSITORY_DOES_NOT_OWN = Object.freeze([
  "Database engines",
  "SQL",
  "Graph DB",
  "Vector DB",
  "Elasticsearch",
  "Redis",
  "File systems",
  "Cloud storage",
  "AI",
  "Embeddings",
  "Search implementation",
  "Query execution",
  "APIs",
  "Engine reasoning",
  "Business Objects",
  "Knowledge Validation",
  "UI",
  "Advisor",
  "Scene",
] as const);

/** Canonical immutable ownership declarations. */
export const KnowledgeRepositoryOwnership = Object.freeze({
  ownershipId: "DKL-6:1/KnowledgeRepositoryOwnership",
  owner: "DKL-6 Knowledge Repository Foundation",
  sourcePhase: "DKL-6:1" as const,
  owns: KNOWLEDGE_REPOSITORY_OWNS,
  doesNotOwn: KNOWLEDGE_REPOSITORY_DOES_NOT_OWN,
  ownsCount: KNOWLEDGE_REPOSITORY_OWNS.length,
  doesNotOwnCount: KNOWLEDGE_REPOSITORY_DOES_NOT_OWN.length,
  separationNote:
    "DKL-6 declares the logical repository model of validated knowledge; it does not implement databases, search engines, storage adapters, AI, or Executive Engine behavior.",
  dkl5RetainsValidationOwnership: true,
  noStorageEngineOwnership: true,
  noDatabaseCoupling: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
