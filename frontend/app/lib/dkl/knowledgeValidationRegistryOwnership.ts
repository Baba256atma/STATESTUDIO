/**
 * DKL-5:2 — Knowledge Validation Registry Ownership.
 *
 * Ownership boundaries specific to the Registry phase. Metadata only.
 *
 * Ownership: owned exclusively by DKL-5:2.
 */

import { KnowledgeValidationFoundation } from "./knowledgeValidationFoundation.ts";

export const KNOWLEDGE_VALIDATION_REGISTRY_OWNS = Object.freeze([
  "Registration of Knowledge Validation vocabulary",
  "Stable identifiers",
  "Category classification",
  "Registry ordering",
  "Registry ownership metadata",
  "Registry compatibility metadata",
  "Registry extension metadata",
  "Stable meanings for statuses, outcomes, signals, severities, evidence, findings, conflicts, and ambiguity",
] as const);

export const KNOWLEDGE_VALIDATION_REGISTRY_DOES_NOT_OWN = Object.freeze([
  "runtime validation",
  "rule execution",
  "trust calculation",
  "score calculation",
  "data cleansing",
  "source correction",
  "Knowledge Model creation",
  "runtime Business Objects",
  "entity resolution",
  "semantic inference",
  "conflict resolution",
  "ambiguity resolution",
  "persistence",
  "search",
  "queries",
  "executive reasoning",
  "Advisor",
  "Scene",
  "UI",
  "notifications",
  "workflow",
  "remediation",
] as const);

/** Canonical immutable registry ownership metadata. */
export const KnowledgeValidationRegistryOwnership = Object.freeze({
  ownershipId: "DKL-5:2/KnowledgeValidationRegistryOwnership",
  owner: "DKL-5 Knowledge Validation Registry",
  sourcePhase: "DKL-5:2",
  foundationOwner: KnowledgeValidationFoundation.identity.owner,
  owns: KNOWLEDGE_VALIDATION_REGISTRY_OWNS,
  doesNotOwn: KNOWLEDGE_VALIDATION_REGISTRY_DOES_NOT_OWN,
  noDuplicateArchitecturalOwnership: true,
  explicitOwnershipRequired: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
