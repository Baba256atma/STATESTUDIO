/** ASSISTANT-3:3 — Immutable Intent & Dialogue lifecycle declarations. */
import type { AssistantIntentDialogueLifecycleMetadata } from "./assistantIntentDialogueModel.types.ts";

const names = Object.freeze([
  "Declared",
  "Initialized",
  "Intent Identified",
  "Clarifying",
  "Context Established",
  "Intent Confirmed",
  "Completed",
  "Archived",
] as const);

export const AssistantIntentDialogueModelLifecycle:
readonly AssistantIntentDialogueLifecycleMetadata[] = Object.freeze(
  names.map((name, index) => Object.freeze({
    identifier:
      `ASSISTANT-3:3/Lifecycle/${String(index + 1).padStart(2, "0")}`,
    name,
    order: index + 1,
    transitionsAtRuntime: false,
    metadataOnly: true,
    immutable: true,
  })),
);
