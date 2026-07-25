/** ASSISTANT-5:3 — Immutable Workspace Orchestration lifecycle declarations. */
import type { AssistantWorkspaceOrchestrationLifecycleMetadata } from "./assistantWorkspaceOrchestrationModel.types.ts";

const names = Object.freeze([
  "Declared",
  "Initialized",
  "Workspace Selected",
  "Workspace Coordinated",
  "Workspace Transitioned",
  "Workspace Confirmed",
  "Completed",
  "Archived",
] as const);

export const AssistantWorkspaceOrchestrationModelLifecycle:
readonly AssistantWorkspaceOrchestrationLifecycleMetadata[] = Object.freeze(
  names.map((name, index) => Object.freeze({
    identifier:
      `ASSISTANT-5:3/Lifecycle/${String(index + 1).padStart(2, "0")}`,
    name,
    order: index + 1,
    transitionsAtRuntime: false,
    metadataOnly: true,
    immutable: true,
  })),
);
