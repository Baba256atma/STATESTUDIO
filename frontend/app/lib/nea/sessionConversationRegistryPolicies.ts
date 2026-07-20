/**
 * NEA-3:2 — Session & Conversation Registry Policies.
 *
 * Immutable session and conversation policy registry.
 * Declarations only. No policy execution.
 *
 * Ownership: owned exclusively by NEA-3:2.
 */

import type { SessionConversationRegistryEntry } from "./sessionConversationRegistryTypes.ts";

const policy = (
  id: string,
  label: string,
  description: string,
  order: number,
): SessionConversationRegistryEntry =>
  Object.freeze({
    id: `NEA-3:2/Policy/${id}`,
    label,
    description,
    sourcePhase: "NEA-3:2" as const,
    foundationReference: null,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical session & conversation policy registry — declarations only. */
export const SessionConversationPolicyRegistry: readonly SessionConversationRegistryEntry[] =
  Object.freeze([
    policy(
      "DeclarationOnly",
      "Declaration Only",
      "Registry entries are declarative metadata and must not manage runtime sessions or conversations.",
      1,
    ),
    policy(
      "FoundationReferencePreservation",
      "Foundation Reference Preservation",
      "Participants, lifecycle states, capabilities, and context must preserve Foundation references.",
      2,
    ),
    policy(
      "NoRuntimeSessions",
      "No Runtime Sessions",
      "Registry must not create, suspend, or close runtime sessions.",
      3,
    ),
    policy(
      "NoRuntimeConversations",
      "No Runtime Conversations",
      "Registry must not start, wait on, or complete runtime conversations.",
      4,
    ),
    policy(
      "NoMessageProcessing",
      "No Message Processing",
      "Message reference types are declared only; messages are never stored or processed.",
      5,
    ),
    policy(
      "UniqueSessionIdentities",
      "Unique Session Identities",
      "Each session identity id must be unique and deterministic.",
      6,
    ),
    policy(
      "UniqueConversationIdentities",
      "Unique Conversation Identities",
      "Each conversation identity id must be unique and deterministic.",
      7,
    ),
    policy(
      "CanonicalInventoryRule",
      "Canonical Inventory Rule",
      "Registry counts must be derived from canonical collections without hardcoding.",
      8,
    ),
    policy(
      "ReadyForModelOnly",
      "Ready For Model Only",
      "Registry readiness is ReadyForModel and must not claim runtime readiness.",
      9,
    ),
  ]);

/** Canonical immutable policy registry catalog. */
export const SessionConversationPolicyRegistryCatalog = Object.freeze({
  catalogId: "NEA-3:2/PolicyRegistry",
  sourcePhase: "NEA-3:2" as const,
  policies: SessionConversationPolicyRegistry,
  policyCount: SessionConversationPolicyRegistry.length,
  executesPolicies: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
