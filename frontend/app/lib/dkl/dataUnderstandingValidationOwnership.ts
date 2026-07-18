/**
 * DKL-3:4 — Data Understanding Validation Ownership.
 *
 * Explicit ownership for the validation layer. Validation owns structural
 * verification summaries only.
 *
 * Ownership: owned exclusively by DKL-3:4.
 */

export const DATA_UNDERSTANDING_VALIDATION_OWNS = Object.freeze([
  "structural model validation",
  "foundation compliance checks",
  "registry compliance checks",
  "model integrity checks",
  "ownership compliance checks",
  "boundary compliance checks",
  "dependency compliance checks",
  "reference integrity checks",
  "validation rule catalog",
  "immutable validation summaries",
  "validation readiness declarations",
] as const);

export const DATA_UNDERSTANDING_VALIDATION_DOES_NOT_OWN = Object.freeze([
  "semantic inference",
  "understanding execution",
  "candidate generation",
  "model repair",
  "model transformation",
  "Business Object creation",
  "Knowledge Graph construction",
  "persistence",
  "AI execution",
  "Engine reasoning",
  "Advisor narration",
  "Scene visualization",
  "Pipeline package mutation",
  "registry mutation",
  "foundation mutation",
] as const);

/** Canonical immutable validation ownership declarations. */
export const DataUnderstandingValidationOwnership = Object.freeze({
  owns: DATA_UNDERSTANDING_VALIDATION_OWNS,
  doesNotOwn: DATA_UNDERSTANDING_VALIDATION_DOES_NOT_OWN,
  owner: "DKL-3 Data Understanding Platform",
  sourcePhase: "DKL-3:4",
  separationNote:
    "Validation verifies contract compliance. It never understands data or creates meaning.",
});
