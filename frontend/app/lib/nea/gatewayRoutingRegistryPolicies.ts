/**
 * NEA-5:2 — Gateway Routing Registry Policies.
 *
 * Immutable routing registry architectural policies.
 * Declarations only. No policy execution.
 *
 * Ownership: owned exclusively by NEA-5:2.
 */

import type { GatewayRoutingRegistryEntry } from "./gatewayRoutingRegistryTypes.ts";

const policy = (
  id: string,
  label: string,
  description: string,
  order: number,
): GatewayRoutingRegistryEntry =>
  Object.freeze({
    id: `NEA-5:2/Policy/${id}`,
    label,
    description,
    sourcePhase: "NEA-5:2" as const,
    foundationReference: null,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical routing registry architectural policy registry. */
export const GatewayRoutingRegistryPolicyRegistry: readonly GatewayRoutingRegistryEntry[] =
  Object.freeze([
    policy(
      "DeclarationOnly",
      "Declaration Only",
      "Registry entries are declarative metadata and must not execute routing.",
      1,
    ),
    policy(
      "FoundationReferencePreservation",
      "Foundation Reference Preservation",
      "Destinations, decisions, contexts, capabilities, and lifecycle must preserve Foundation references.",
      2,
    ),
    policy(
      "NoRuntimeRouting",
      "No Runtime Routing",
      "Registry must not implement runtime routing or dispatch.",
      3,
    ),
    policy(
      "NoRoutingAlgorithms",
      "No Routing Algorithms",
      "Registry must not implement routing algorithms or consumer selection logic.",
      4,
    ),
    policy(
      "NoConsumerInvocation",
      "No Consumer Invocation",
      "Registry must not invoke DKL, Executive Engine, Advisor, Director, or EVE.",
      5,
    ),
    policy(
      "UniqueRouteIdentities",
      "Unique Route Identities",
      "Each route identity id must be unique and deterministic.",
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
export const GatewayRoutingRegistryPolicyCatalog = Object.freeze({
  catalogId: "NEA-5:2/PolicyRegistry",
  sourcePhase: "NEA-5:2" as const,
  policies: GatewayRoutingRegistryPolicyRegistry,
  policyCount: GatewayRoutingRegistryPolicyRegistry.length,
  executesPolicies: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
