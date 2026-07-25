/** ASSISTANT-1:1 — Immutable capability declarations. */
import type { AssistantConversationCapabilityMetadata } from "./assistantConversationFoundation.types.ts";

const names = Object.freeze([
  "Executive Conversation",
  "Multi-turn Dialogue",
  "Context Preservation",
  "Clarification Support",
  "Guidance Support",
  "Workspace Awareness",
  "Object Awareness",
  "Executive Communication",
  "Conversation Continuity",
  "Conversation Governance",
] as const);

export const AssistantConversationFoundationCapabilities:
readonly AssistantConversationCapabilityMetadata[] = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `ASSISTANT-1:1/Capability/${String(index + 1).padStart(2, "0")}`,
    name,
    order: index + 1,
    implemented: false,
    metadataOnly: true,
    immutable: true,
  })),
);
