/**
 * NEA-6:4 — Message Normalization Validation Policies.
 *
 * Immutable validation policy declarations. No policy execution.
 *
 * Ownership: owned exclusively by NEA-6:4.
 */

import type { MessageNormalizationValidationPolicy } from "./messageNormalizationValidationTypes.ts";

/** Declarative validation policies — exactly eight. */
export const MessageNormalizationValidationPolicies: readonly MessageNormalizationValidationPolicy[] =
  Object.freeze([
    Object.freeze({
      policyId: "NEA-6:4/Policy/ModelOnlyConsumption",
      policyName: "Model-Only Consumption",
      statement:
        "Validation consumes only NEA-6:3 Message Normalization Model public surface.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 1,
    }),
    Object.freeze({
      policyId: "NEA-6:4/Policy/NoValidationEngine",
      policyName: "No Validation Engine",
      statement:
        "Validation definitions are declarative metadata only; no validation engine is implemented.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 2,
    }),
    Object.freeze({
      policyId: "NEA-6:4/Policy/PreserveCanonicalReferences",
      policyName: "Preserve Canonical References",
      statement:
        "Validation rules preserve canonical Model and Registry references without duplication.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 3,
    }),
    Object.freeze({
      policyId: "NEA-6:4/Policy/NoRuntimeNormalization",
      policyName: "No Runtime Normalization",
      statement:
        "Validation must not normalize messages or execute normalization pipelines.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 4,
    }),
    Object.freeze({
      policyId: "NEA-6:4/Policy/NoPayloadParsing",
      policyName: "No Payload Parsing",
      statement:
        "Validation must not parse payloads or interpret business meaning.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 5,
    }),
    Object.freeze({
      policyId: "NEA-6:4/Policy/NoConsumerInvocation",
      policyName: "No Consumer Invocation",
      statement:
        "Validation must not invoke DKL, Executive Engine, Advisor, Director, or EVE.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 6,
    }),
    Object.freeze({
      policyId: "NEA-6:4/Policy/DeterministicInventory",
      policyName: "Deterministic Inventory",
      statement:
        "Validation counts are derived exclusively from canonical validation collections.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 7,
    }),
    Object.freeze({
      policyId: "NEA-6:4/Policy/ReadyForManifestOnly",
      policyName: "Ready For Manifest Only",
      statement:
        "Validation readiness is ReadyForManifest and must not claim runtime readiness.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 8,
    }),
  ]);

/** Canonical immutable validation policy catalog. */
export const MessageNormalizationValidationPolicyCatalog = Object.freeze({
  catalogId: "NEA-6:4/ValidationPolicyCatalog",
  sourcePhase: "NEA-6:4" as const,
  policies: MessageNormalizationValidationPolicies,
  policyCount: MessageNormalizationValidationPolicies.length,
  executesPolicies: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
