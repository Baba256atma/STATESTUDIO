/**
 * DKL-4:1 — Knowledge Modeling Ownership.
 *
 * Explicit ownership and non-ownership declarations for the Knowledge Modeling
 * Platform. Ownership: owned exclusively by DKL-4:1.
 */

export const KNOWLEDGE_MODELING_OWNS = Object.freeze([
  "Knowledge Object definitions",
  "Business Object definitions",
  "Entity modeling",
  "Relationship modeling",
  "Knowledge Identity",
  "Knowledge Metadata",
  "Knowledge Hierarchy",
  "Knowledge Composition",
  "Knowledge References",
  "Semantic Structure contracts",
  "Knowledge Model definitions",
  "Extension policy declarations",
  "Compatibility policy declarations",
] as const);

export const KNOWLEDGE_MODELING_DOES_NOT_OWN = Object.freeze([
  "data ingestion",
  "data parsing",
  "source connectors",
  "AI reasoning",
  "executive reasoning",
  "decision making",
  "visualization",
  "storage implementation",
  "database technology",
  "APIs",
  "UI",
  "Scene",
  "Advisor",
  "DKL-3 understanding execution",
  "graph traversal or querying",
  "orchestration",
  "persistence",
] as const);

/** Canonical immutable ownership declarations. */
export const KnowledgeModelingOwnership = Object.freeze({
  owns: KNOWLEDGE_MODELING_OWNS,
  doesNotOwn: KNOWLEDGE_MODELING_DOES_NOT_OWN,
  owner: "DKL-4 Knowledge Modeling Platform",
  sourcePhase: "DKL-4:1",
  separationNote:
    "DKL-4 defines immutable organizational knowledge models; it does not reason, persist, query, or decide.",
  metadataOnly: true,
  immutable: true,
});
