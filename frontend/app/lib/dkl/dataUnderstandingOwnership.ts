/**
 * DKL-3:1 — Data Understanding Ownership.
 *
 * Explicit ownership and non-ownership declarations for the Data Understanding
 * Platform. Ownership: owned exclusively by DKL-3:1.
 */

export const DATA_UNDERSTANDING_OWNS = Object.freeze([
  "provisional semantic interpretation",
  "candidate meaning declarations",
  "semantic evidence references",
  "ambiguity detection",
  "clarification requirements",
  "column-role candidates",
  "dataset-purpose candidates",
  "relationship hints",
  "understanding confidence metadata",
  "understanding lifecycle",
  "understanding result envelopes",
] as const);

export const DATA_UNDERSTANDING_DOES_NOT_OWN = Object.freeze([
  "data transport",
  "file reading",
  "CSV parsing",
  "schema parsing mechanics",
  "data cleaning",
  "source registration",
  "permanent persistence",
  "canonical Business Object creation",
  "entity resolution across datasets",
  "knowledge-graph construction",
  "executive reasoning",
  "recommendations",
  "Advisor narration",
  "Scene visualization",
  "connector execution",
] as const);

/** Canonical immutable ownership declarations. */
export const DataUnderstandingOwnership = Object.freeze({
  owns: DATA_UNDERSTANDING_OWNS,
  doesNotOwn: DATA_UNDERSTANDING_DOES_NOT_OWN,
  owner: "DKL-3 Data Understanding Platform",
  sourcePhase: "DKL-3:1",
  separationNote:
    "DKL-3 prepares understandable information; it does not decide what the organization should do.",
});
