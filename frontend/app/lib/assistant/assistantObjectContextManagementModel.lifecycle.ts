/** ASSISTANT-6:3 — Immutable Object & Context Management lifecycle declarations. */
import type { AssistantObjectContextManagementLifecycleMetadata } from "./assistantObjectContextManagementModel.types.ts";

const names = Object.freeze([
  "Declared",
  "Initialized",
  "Context Established",
  "Objects Referenced",
  "Relationships Established",
  "Context Verified",
  "Completed",
  "Archived",
] as const);

export const AssistantObjectContextManagementModelLifecycle:
readonly AssistantObjectContextManagementLifecycleMetadata[] = Object.freeze(
  names.map((name, index) => Object.freeze({
    identifier:
      `ASSISTANT-6:3/Lifecycle/${String(index + 1).padStart(2, "0")}`,
    name,
    order: index + 1,
    transitionsAtRuntime: false,
    metadataOnly: true,
    immutable: true,
  })),
);
