/**
 * NEA-6:2 — Message Normalization Registry Policies.
 *
 * Immutable message normalization registry architectural policies.
 * Declarations only. No policy execution.
 *
 * Ownership: owned exclusively by NEA-6:2.
 */

import type { MessageNormalizationRegistryEntry } from "./messageNormalizationRegistryTypes.ts";

const policy = (
  id: string,
  label: string,
  description: string,
  order: number,
): MessageNormalizationRegistryEntry =>
  Object.freeze({
    id: `NEA-6:2/Policy/${id}`,
    label,
    description,
    sourcePhase: "NEA-6:2" as const,
    foundationReference: null,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical message normalization registry architectural policy registry. */
export const MessageNormalizationRegistryPolicyRegistry: readonly MessageNormalizationRegistryEntry[] =
  Object.freeze([
    policy(
      "DeclarationOnly",
      "Declaration Only",
      "Registry entries are declarative metadata and must not normalize messages.",
      1,
    ),
    policy(
      "FoundationReferencePreservation",
      "Foundation Reference Preservation",
      "Contracts, contexts, attachments, capabilities, lifecycle, ownership, and boundaries must preserve Foundation references.",
      2,
    ),
    policy(
      "NoRuntimeNormalization",
      "No Runtime Normalization",
      "Registry must not implement runtime normalization or payload parsing.",
      3,
    ),
    policy(
      "NoBusinessInterpretation",
      "No Business Interpretation",
      "Registry must not interpret business meaning or modify user intent.",
      4,
    ),
    policy(
      "NoConsumerInvocation",
      "No Consumer Invocation",
      "Registry must not invoke DKL, Executive Engine, Advisor, Director, or EVE.",
      5,
    ),
    policy(
      "UniqueMessageIdentities",
      "Unique Message Identities",
      "Each message identity id must be unique and deterministic.",
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
export const MessageNormalizationRegistryPolicyCatalog = Object.freeze({
  catalogId: "NEA-6:2/PolicyRegistry",
  sourcePhase: "NEA-6:2" as const,
  policies: MessageNormalizationRegistryPolicyRegistry,
  policyCount: MessageNormalizationRegistryPolicyRegistry.length,
  executesPolicies: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
