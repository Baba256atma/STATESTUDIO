/**
 * DKL-5:1 — Knowledge Validation Ownership.
 *
 * Explicit ownership and non-ownership declarations for the Knowledge Validation
 * Platform. Ownership: owned exclusively by DKL-5:1.
 */

export const KNOWLEDGE_VALIDATION_OWNS = Object.freeze([
  "Knowledge-validation vocabulary",
  "Validation contracts",
  "Validation dimensions",
  "Quality-signal definitions",
  "Trust-declaration contracts",
  "Finding and issue contracts",
  "Ambiguity and conflict representation",
  "Validation-result contracts",
  "Validation lifecycle metadata",
  "DKL-5 ownership and boundary policies",
] as const);

export const KNOWLEDGE_VALIDATION_DOES_NOT_OWN = Object.freeze([
  "source ingestion",
  "connector behavior",
  "data parsing",
  "data cleansing",
  "source-system correction",
  "Data Understanding execution",
  "Knowledge Model creation",
  "runtime Business Object creation",
  "entity resolution",
  "semantic inference",
  "AI confidence generation",
  "persistence",
  "repository behavior",
  "search",
  "query execution",
  "executive reasoning",
  "decision making",
  "Advisor behavior",
  "Scene rendering",
  "UI",
  "notifications",
  "workflow orchestration",
  "automatic remediation",
  "DKL-4 Knowledge Modeling ownership",
] as const);

/** Canonical immutable ownership declarations. */
export const KnowledgeValidationOwnership = Object.freeze({
  owns: KNOWLEDGE_VALIDATION_OWNS,
  doesNotOwn: KNOWLEDGE_VALIDATION_DOES_NOT_OWN,
  owner: "DKL-5 Knowledge Validation Platform",
  sourcePhase: "DKL-5:1",
  separationNote:
    "DKL-5 declares how knowledge reliability is evaluated; it does not cleanse data, create models, resolve entities, generate AI confidence, or decide.",
  noDuplicateKnowledgeModelingOwnership: true,
  dkl4RetainsModelingOwnership: true,
  metadataOnly: true,
  immutable: true,
});
