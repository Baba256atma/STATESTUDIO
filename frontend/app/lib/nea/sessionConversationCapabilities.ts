/**
 * NEA-3:1 — Session & Conversation Capabilities.
 *
 * Immutable capability declarations for Session & Conversation Foundation.
 * Capabilities are declarative only — no runtime execution.
 *
 * Ownership: owned exclusively by NEA-3:1.
 */

import type {
  SessionConversationCapabilityDeclaration,
  SessionConversationCapabilityId,
} from "./sessionConversationFoundationTypes.ts";

const capability = (
  capabilityId: SessionConversationCapabilityId,
  capabilityName: string,
  description: string,
  order: number,
): SessionConversationCapabilityDeclaration =>
  Object.freeze({
    capabilityId,
    capabilityName,
    description,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical session & conversation capability catalog — exactly eight. */
export const SessionConversationCapabilities: readonly SessionConversationCapabilityDeclaration[] =
  Object.freeze([
    capability(
      "SessionTracking",
      "Session Tracking",
      "Declarative ability to track session identity and state metadata.",
      1,
    ),
    capability(
      "ConversationTracking",
      "Conversation Tracking",
      "Declarative ability to track conversation identity and state metadata.",
      2,
    ),
    capability(
      "ParticipantRegistration",
      "Participant Registration",
      "Declarative ability to register participant role classifications.",
      3,
    ),
    capability(
      "ContextDeclaration",
      "Context Declaration",
      "Declarative ability to declare conversation context dimensions.",
      4,
    ),
    capability(
      "CorrelationDeclaration",
      "Correlation Declaration",
      "Declarative ability to declare correlation and trace metadata.",
      5,
    ),
    capability(
      "ConversationContinuity",
      "Conversation Continuity",
      "Declarative ability to declare conversation continuity references.",
      6,
    ),
    capability(
      "MetadataManagement",
      "Metadata Management",
      "Declarative ability to manage session and conversation metadata.",
      7,
    ),
    capability(
      "SummaryDeclaration",
      "Summary Declaration",
      "Declarative ability to publish foundation summary metadata.",
      8,
    ),
  ]);

/** Canonical immutable capability catalog. */
export const SessionConversationCapabilityCatalog = Object.freeze({
  catalogId: "NEA-3:1/CapabilityCatalog",
  sourcePhase: "NEA-3:1" as const,
  capabilities: SessionConversationCapabilities,
  capabilityCount: SessionConversationCapabilities.length,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
