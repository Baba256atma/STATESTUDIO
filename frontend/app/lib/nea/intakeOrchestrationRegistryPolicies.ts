/**
 * NEA-7:2 — Intake Orchestration Registry Policies.
 *
 * Immutable intake orchestration registry architectural policies.
 * Declarations only. No policy execution.
 *
 * Ownership: owned exclusively by NEA-7:2.
 */

import type { IntakeOrchestrationRegistryEntry } from "./intakeOrchestrationRegistryTypes.ts";

const policy = (
  id: string,
  label: string,
  description: string,
  order: number,
): IntakeOrchestrationRegistryEntry =>
  Object.freeze({
    id: `NEA-7:2/Policy/${id}`,
    label,
    description,
    sourcePhase: "NEA-7:2" as const,
    foundationReference: null,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical intake orchestration registry architectural policy registry. */
export const IntakeOrchestrationRegistryPolicyRegistry: readonly IntakeOrchestrationRegistryEntry[] =
  Object.freeze([
    policy(
      "DeclarationOnly",
      "Declaration Only",
      "Registry entries are declarative metadata and must not assemble intake packages.",
      1,
    ),
    policy(
      "FoundationReferencePreservation",
      "Foundation Reference Preservation",
      "Contracts, capabilities, lifecycle, ownership, and boundaries must preserve Foundation references.",
      2,
    ),
    policy(
      "NoRuntimeOrchestration",
      "No Runtime Orchestration",
      "Registry must not implement runtime orchestration or package assembly.",
      3,
    ),
    policy(
      "NoRuntimeAssembly",
      "No Runtime Assembly",
      "Registry must not assemble runtime Executive Intake Packages.",
      4,
    ),
    policy(
      "NoConsumerInvocation",
      "No Consumer Invocation",
      "Registry must not invoke DKL, Executive Engine, Advisor, Director, or EVE.",
      5,
    ),
    policy(
      "UniqueIntakeIdentities",
      "Unique Intake Identities",
      "Each intake identity id must be unique and deterministic.",
      6,
    ),
    policy(
      "CanonicalInventoryRule",
      "Canonical Inventory Rule",
      "Registry counts must be derived from canonical collections without hardcoding.",
      7,
    ),
    policy(
      "ReadyForModelOnly",
      "Ready For Model Only",
      "Registry readiness is ReadyForModel and must not claim runtime readiness.",
      8,
    ),
  ]);

/** Canonical immutable policy registry catalog. */
export const IntakeOrchestrationRegistryPolicyCatalog = Object.freeze({
  catalogId: "NEA-7:2/PolicyRegistry",
  sourcePhase: "NEA-7:2" as const,
  policies: IntakeOrchestrationRegistryPolicyRegistry,
  policyCount: IntakeOrchestrationRegistryPolicyRegistry.length,
  executesPolicies: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
