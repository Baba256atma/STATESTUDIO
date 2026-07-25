/** ASSISTANT-1:3 — Immutable Conversation lifecycle declarations. */
import type { AssistantConversationLifecycleMetadata } from "./assistantConversationModel.types.ts";

const names = Object.freeze([
  "Declared",
  "Initialized",
  "Active",
  "Clarifying",
  "Guiding",
  "Completed",
  "Archived",
] as const);

export const AssistantConversationModelLifecycle:
readonly AssistantConversationLifecycleMetadata[] = Object.freeze(
  names.map((name, index) => Object.freeze({
    identifier:
      `ASSISTANT-1:3/Lifecycle/${String(index + 1).padStart(2, "0")}`,
    name,
    order: index + 1,
    transitionsAtRuntime: false,
    metadataOnly: true,
    immutable: true,
  })),
);
