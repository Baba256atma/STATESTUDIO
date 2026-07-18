/**
 * DKL-4:2 — Knowledge Modeling Registry Ownership.
 *
 * Ownership boundaries specific to the Registry phase. Metadata only.
 *
 * Ownership: owned exclusively by DKL-4:2.
 */

import { KnowledgeModelingFoundation } from "./knowledgeModelingFoundation.ts";

export const KNOWLEDGE_MODELING_REGISTRY_OWNS = Object.freeze([
  "Registration of DKL-4 modeling vocabulary",
  "Stable identifiers for modeling concepts",
  "Registry metadata",
  "Category classification",
  "Registry ordering",
  "Registry ownership declarations",
  "Registry compatibility declarations",
  "Registry extension declarations",
  "Business Object category registration",
  "Relationship category registration",
  "Public foundation API registration",
] as const);

export const KNOWLEDGE_MODELING_REGISTRY_DOES_NOT_OWN = Object.freeze([
  "raw-data ingestion",
  "source connectors",
  "data parsing",
  "data understanding",
  "semantic inference",
  "runtime entity creation",
  "runtime relationship creation",
  "Knowledge Graph execution",
  "graph traversal",
  "Business Object behavior",
  "validation execution",
  "storage",
  "databases",
  "search",
  "query execution",
  "Executive reasoning",
  "decisions",
  "Advisor",
  "Scene",
  "UI",
  "orchestration",
] as const);

/** Canonical immutable registry ownership metadata. */
export const KnowledgeModelingRegistryOwnership = Object.freeze({
  ownershipId: "DKL-4:2/KnowledgeModelingRegistryOwnership",
  owner: "DKL-4 Knowledge Modeling Registry",
  sourcePhase: "DKL-4:2",
  foundationOwner: KnowledgeModelingFoundation.identity.owner,
  owns: KNOWLEDGE_MODELING_REGISTRY_OWNS,
  doesNotOwn: KNOWLEDGE_MODELING_REGISTRY_DOES_NOT_OWN,
  noDuplicateArchitecturalOwnership: true,
  explicitOwnershipRequired: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
