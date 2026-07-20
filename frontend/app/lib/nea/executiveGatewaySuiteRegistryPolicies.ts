/**
 * NEA-8:2 — Executive Gateway Suite Registry Policies.
 *
 * Immutable suite registry architectural policies.
 * Declarations only. No policy execution.
 *
 * Ownership: owned exclusively by NEA-8:2.
 */

import type { ExecutiveGatewaySuiteRegistryEntry } from "./executiveGatewaySuiteRegistryTypes.ts";

const policy = (
  id: string,
  label: string,
  description: string,
  order: number,
): ExecutiveGatewaySuiteRegistryEntry =>
  Object.freeze({
    id: `NEA-8:2/Policy/${id}`,
    label,
    description,
    sourcePhase: "NEA-8:2" as const,
    foundationReference: null,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical suite registry architectural policy registry. */
export const ExecutiveGatewaySuiteRegistryPolicyRegistry: readonly ExecutiveGatewaySuiteRegistryEntry[] =
  Object.freeze([
    policy(
      "DeclarationOnly",
      "Declaration Only",
      "Registry entries are declarative metadata and must not introduce gateway functionality.",
      1,
    ),
    policy(
      "FoundationReferencePreservation",
      "Foundation Reference Preservation",
      "Composition, capabilities, contracts, and lifecycle must preserve Foundation references.",
      2,
    ),
    policy(
      "PublicIndexThroughFoundationOnly",
      "Public Index Through Foundation Only",
      "Registry must consume Public Index metadata only through Executive Gateway Suite Foundation.",
      3,
    ),
    policy(
      "NoRuntimeGateway",
      "No Runtime Gateway",
      "Registry must not implement runtime gateway, connectors, sessions, security, routing, or operations.",
      4,
    ),
    policy(
      "NoConsumerInvocation",
      "No Consumer Invocation",
      "Registry must not invoke DKL, Executive Engine, Assistant, Advisor, Director, or EVE.",
      5,
    ),
    policy(
      "UniqueComponentRegistrations",
      "Unique Component Registrations",
      "Each suite component id must be unique and deterministic.",
      6,
    ),
    policy(
      "CanonicalInventoryRule",
      "Canonical Inventory Rule",
      "Registry counts and public API inventory must be derived from canonical collections without hardcoding.",
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
export const ExecutiveGatewaySuiteRegistryPolicyCatalog = Object.freeze({
  catalogId: "NEA-8:2/PolicyRegistry",
  sourcePhase: "NEA-8:2" as const,
  policies: ExecutiveGatewaySuiteRegistryPolicyRegistry,
  policyCount: ExecutiveGatewaySuiteRegistryPolicyRegistry.length,
  executesPolicies: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
