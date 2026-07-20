/**
 * NEA-7:4 — Intake Orchestration Validation Policies.
 *
 * Immutable validation policy declarations. No policy execution.
 *
 * Ownership: owned exclusively by NEA-7:4.
 */

import type { IntakeOrchestrationValidationPolicy } from "./intakeOrchestrationValidationTypes.ts";

/** Declarative validation policies — exactly eight. */
export const IntakeOrchestrationValidationPolicies: readonly IntakeOrchestrationValidationPolicy[] =
  Object.freeze([
    Object.freeze({
      policyId: "NEA-7:4/Policy/CanonicalReferenceOnly",
      policyName: "Canonical Reference Only",
      statement:
        "Validation consumes only canonical Model references without reconstructing upstream architecture.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 1,
    }),
    Object.freeze({
      policyId: "NEA-7:4/Policy/DeclarativeValidationOnly",
      policyName: "Declarative Validation Only",
      statement:
        "Validation definitions are declarative metadata only; no validation engine is implemented.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 2,
    }),
    Object.freeze({
      policyId: "NEA-7:4/Policy/NoRuntimeAssembly",
      policyName: "No Runtime Assembly",
      statement:
        "Validation must not assemble Executive Intake Packages or execute orchestration.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 3,
    }),
    Object.freeze({
      policyId: "NEA-7:4/Policy/NoBusinessInterpretation",
      policyName: "No Business Interpretation",
      statement:
        "Validation must not interpret business meaning or create Business Objects.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 4,
    }),
    Object.freeze({
      policyId: "NEA-7:4/Policy/NoDKLInvocation",
      policyName: "No DKL Invocation",
      statement:
        "Validation may describe DKL readiness but must not invoke DKL or Executive Engine.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 5,
    }),
    Object.freeze({
      policyId: "NEA-7:4/Policy/NoUpstreamDuplication",
      policyName: "No Upstream Duplication",
      statement:
        "Validation must not duplicate Model kinds, identities, relationships, or Registry collections.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 6,
    }),
    Object.freeze({
      policyId: "NEA-7:4/Policy/ImmutableValidationMetadata",
      policyName: "Immutable Validation Metadata",
      statement:
        "Validation metadata, rules, and categories remain immutable after declaration.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 7,
    }),
    Object.freeze({
      policyId: "NEA-7:4/Policy/DeterministicValidationInventory",
      policyName: "Deterministic Validation Inventory",
      statement:
        "Validation counts are derived exclusively from canonical validation collections.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 8,
    }),
  ]);

/** Canonical immutable validation policy catalog. */
export const IntakeOrchestrationValidationPolicyCatalog = Object.freeze({
  catalogId: "NEA-7:4/ValidationPolicyCatalog",
  sourcePhase: "NEA-7:4" as const,
  policies: IntakeOrchestrationValidationPolicies,
  policyCount: IntakeOrchestrationValidationPolicies.length,
  executesPolicies: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
