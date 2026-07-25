/** ASSISTANT-1:1 — Immutable descriptive Conversation contracts. */
import type { AssistantConversationContractMetadata } from "./assistantConversationFoundation.types.ts";

const declarations = Object.freeze([
  ["Assistant Conversation Contract", "Defines the canonical conversation domain."],
  ["Executive Interaction Contract", "Defines executive interaction metadata."],
  ["Conversation Session Contract", "Defines conversation session identity metadata."],
  ["Conversation Turn Contract", "Defines conversation turn metadata."],
  ["Conversation Context Contract", "Defines declared conversation context."],
  ["Conversation Lifecycle Contract", "Defines lifecycle vocabulary metadata."],
  ["Conversation Policy Contract", "Defines conversation policy declarations."],
  ["Conversation Boundary Contract", "Defines prohibited architectural surfaces."],
] as const);

export const AssistantConversationFoundationContracts:
readonly AssistantConversationContractMetadata[] = Object.freeze(
  declarations.map(([name, description], index) => Object.freeze({
    id: `ASSISTANT-1:1/Contract/${String(index + 1).padStart(2, "0")}`,
    name,
    description,
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
