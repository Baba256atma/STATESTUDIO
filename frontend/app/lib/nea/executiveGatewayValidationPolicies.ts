/**
 * NEA-1:4 — Executive Gateway Validation Policies.
 *
 * Immutable validation policy declarations. No policy execution.
 *
 * Ownership: owned exclusively by NEA-1:4.
 */

import type { ExecutiveGatewayValidationPolicy } from "./executiveGatewayValidationTypes.ts";

/** Declarative validation policies. */
export const ExecutiveGatewayValidationPolicies: readonly ExecutiveGatewayValidationPolicy[] =
  Object.freeze([
    Object.freeze({
      policyId: "NEA-1:4/Policy/ModelOnlyConsumption",
      policyName: "Model-Only Consumption",
      statement:
        "Validation consumes only NEA-1:3 Executive Gateway Model public surface.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 1,
    }),
    Object.freeze({
      policyId: "NEA-1:4/Policy/NoValidationEngine",
      policyName: "No Validation Engine",
      statement:
        "Validation definitions are declarative metadata only; no validation engine is implemented.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 2,
    }),
    Object.freeze({
      policyId: "NEA-1:4/Policy/PreserveCanonicalReferences",
      policyName: "Preserve Canonical References",
      statement:
        "Validation rules preserve canonical Model and Registry references without duplication.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 3,
    }),
    Object.freeze({
      policyId: "NEA-1:4/Policy/NoSecurityExecution",
      policyName: "No Security Execution",
      statement:
        "Authentication, authorization, trust, and consent rules never execute engines or evaluations.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 4,
    }),
    Object.freeze({
      policyId: "NEA-1:4/Policy/NoRoutingExecution",
      policyName: "No Routing Execution",
      statement:
        "Routing validation declares structure only and never performs routing.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 5,
    }),
    Object.freeze({
      policyId: "NEA-1:4/Policy/DeterministicInventory",
      policyName: "Deterministic Inventory",
      statement:
        "Validation counts are derived exclusively from canonical validation collections.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 6,
    }),
  ]);

/** Canonical immutable validation policy catalog. */
export const ExecutiveGatewayValidationPolicyCatalog = Object.freeze({
  catalogId: "NEA-1:4/ValidationPolicyCatalog",
  sourcePhase: "NEA-1:4" as const,
  policies: ExecutiveGatewayValidationPolicies,
  policyCount: ExecutiveGatewayValidationPolicies.length,
  executesPolicies: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
