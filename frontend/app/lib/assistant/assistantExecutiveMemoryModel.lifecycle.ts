/** ASSISTANT-2:3 — Immutable Executive Memory lifecycle declarations. */
import type { AssistantExecutiveMemoryLifecycleMetadata } from "./assistantExecutiveMemoryModel.types.ts";

const names = Object.freeze([
  "Declared",
  "Initialized",
  "Active",
  "Referenced",
  "Reviewed",
  "Certified",
  "Frozen",
  "Archived",
] as const);

export const AssistantExecutiveMemoryModelLifecycle:
readonly AssistantExecutiveMemoryLifecycleMetadata[] = Object.freeze(
  names.map((name, index) => Object.freeze({
    identifier:
      `ASSISTANT-2:3/Lifecycle/${String(index + 1).padStart(2, "0")}`,
    name,
    order: index + 1,
    transitionsAtRuntime: false,
    metadataOnly: true,
    immutable: true,
  })),
);
