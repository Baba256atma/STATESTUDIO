/**
 * NEA-4:4 — Security Gateway Validation Policies.
 *
 * Immutable validation policy declarations. No policy execution.
 *
 * Ownership: owned exclusively by NEA-4:4.
 */

import type { SecurityGatewayValidationPolicy } from "./securityGatewayValidationTypes.ts";

/** Exactly eight declarative validation policies. */
export const SecurityGatewayValidationPolicies: readonly SecurityGatewayValidationPolicy[] =
  Object.freeze([
    Object.freeze({
      policyId: "NEA-4:4/Policy/CanonicalReferenceRequired",
      policyName: "Canonical Reference Required",
      statement:
        "Validation rules must preserve canonical Model and Registry references without duplication.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 1,
    }),
    Object.freeze({
      policyId: "NEA-4:4/Policy/MetadataComplete",
      policyName: "Metadata Complete",
      statement:
        "Validation categories, rules, relationships, and policies must be metadata-complete.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 2,
    }),
    Object.freeze({
      policyId: "NEA-4:4/Policy/OwnershipPreserved",
      policyName: "Ownership Preserved",
      statement:
        "Validation must preserve unique ownership and must not claim Model or Registry ownership.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 3,
    }),
    Object.freeze({
      policyId: "NEA-4:4/Policy/ImmutableModels",
      policyName: "Immutable Models",
      statement:
        "Validation must treat Model surfaces as immutable and must not reconstruct them.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 4,
    }),
    Object.freeze({
      policyId: "NEA-4:4/Policy/NoDuplicateDefinitions",
      policyName: "No Duplicate Definitions",
      statement:
        "Validation must not duplicate Model definitions or invent parallel vocabularies.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 5,
    }),
    Object.freeze({
      policyId: "NEA-4:4/Policy/NoRuntimeBehavior",
      policyName: "No Runtime Behavior",
      statement:
        "Validation definitions are declarative metadata only; no validation or security engine is implemented.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 6,
    }),
    Object.freeze({
      policyId: "NEA-4:4/Policy/NoDeepImports",
      policyName: "No Deep Imports",
      statement:
        "Validation imports only SecurityGatewayModelPlatform and never deep-imports Registry or Foundation.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 7,
    }),
    Object.freeze({
      policyId: "NEA-4:4/Policy/PlatformIntegrity",
      policyName: "Platform Integrity",
      statement:
        "Validation readiness is ReadyForManifest and must preserve Validation → Model → Registry → Foundation integrity.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 8,
    }),
  ]);

/** Canonical immutable validation policy catalog. */
export const SecurityGatewayValidationPolicyCatalog = Object.freeze({
  catalogId: "NEA-4:4/ValidationPolicyCatalog",
  sourcePhase: "NEA-4:4" as const,
  policies: SecurityGatewayValidationPolicies,
  policyCount: SecurityGatewayValidationPolicies.length,
  executesPolicies: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
