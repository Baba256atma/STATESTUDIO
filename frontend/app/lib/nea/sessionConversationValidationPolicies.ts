/**
 * NEA-3:4 — Session & Conversation Validation Policies.
 *
 * Immutable validation policy declarations. No policy execution.
 *
 * Ownership: owned exclusively by NEA-3:4.
 */

import type { SessionConversationValidationPolicy } from "./sessionConversationValidationTypes.ts";

/** Declarative validation policies. */
export const SessionConversationValidationPolicies: readonly SessionConversationValidationPolicy[] =
  Object.freeze([
    Object.freeze({
      policyId: "NEA-3:4/Policy/ModelOnlyConsumption",
      policyName: "Model-Only Consumption",
      statement:
        "Validation consumes only NEA-3:3 Session & Conversation Model public surface.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 1,
    }),
    Object.freeze({
      policyId: "NEA-3:4/Policy/NoValidationEngine",
      policyName: "No Validation Engine",
      statement:
        "Validation definitions are declarative metadata only; no validation engine is implemented.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 2,
    }),
    Object.freeze({
      policyId: "NEA-3:4/Policy/PreserveCanonicalReferences",
      policyName: "Preserve Canonical References",
      statement:
        "Validation rules preserve canonical Model and Registry references without duplication.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 3,
    }),
    Object.freeze({
      policyId: "NEA-3:4/Policy/NoRuntimeSessions",
      policyName: "No Runtime Sessions",
      statement:
        "Validation must not create, suspend, or close runtime sessions.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 4,
    }),
    Object.freeze({
      policyId: "NEA-3:4/Policy/NoRuntimeConversations",
      policyName: "No Runtime Conversations",
      statement:
        "Validation must not start, wait on, or complete runtime conversations.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 5,
    }),
    Object.freeze({
      policyId: "NEA-3:4/Policy/NoMessageProcessing",
      policyName: "No Message Processing",
      statement:
        "Message reference validation declares structure only and never processes or stores messages.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 6,
    }),
    Object.freeze({
      policyId: "NEA-3:4/Policy/DeterministicInventory",
      policyName: "Deterministic Inventory",
      statement:
        "Validation counts are derived exclusively from canonical validation collections.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 7,
    }),
    Object.freeze({
      policyId: "NEA-3:4/Policy/ReadyForManifestOnly",
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
export const SessionConversationValidationPolicyCatalog = Object.freeze({
  catalogId: "NEA-3:4/ValidationPolicyCatalog",
  sourcePhase: "NEA-3:4" as const,
  policies: SessionConversationValidationPolicies,
  policyCount: SessionConversationValidationPolicies.length,
  executesPolicies: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
