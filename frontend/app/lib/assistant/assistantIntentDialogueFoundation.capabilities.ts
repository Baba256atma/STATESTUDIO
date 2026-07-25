/** ASSISTANT-3:1 — Immutable capability declarations. */
import type { AssistantIntentDialogueCapabilityMetadata } from "./assistantIntentDialogueFoundation.types.ts";

const names = Object.freeze([
  "Intent Awareness",
  "Dialogue Awareness",
  "Executive Language Awareness",
  "Context Awareness",
  "Clarification Awareness",
  "Conversation Continuity Awareness",
  "Multi-turn Awareness",
  "Executive Communication Awareness",
  "Intent Governance",
  "Dialogue Governance",
] as const);

export const AssistantIntentDialogueFoundationCapabilities:
readonly AssistantIntentDialogueCapabilityMetadata[] = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `ASSISTANT-3:1/Capability/${String(index + 1).padStart(2, "0")}`,
    name,
    order: index + 1,
    implemented: false,
    metadataOnly: true,
    immutable: true,
  })),
);
