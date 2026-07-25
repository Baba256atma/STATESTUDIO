/** ASSISTANT-7:3 — Immutable Executive Action Planning lifecycle declarations. */
import type { AssistantExecutiveActionPlanningLifecycleMetadata } from "./assistantExecutiveActionPlanningModel.types.ts";

const names = Object.freeze([
  "Declared",
  "Objective Defined",
  "Actions Structured",
  "Dependencies Defined",
  "Plan Reviewed",
  "Plan Confirmed",
  "Ready",
  "Completed",
  "Archived",
] as const);

export const AssistantExecutiveActionPlanningModelLifecycle:
readonly AssistantExecutiveActionPlanningLifecycleMetadata[] = Object.freeze(
  names.map((name, index) => Object.freeze({
    identifier:
      `ASSISTANT-7:3/Lifecycle/${String(index + 1).padStart(2, "0")}`,
    name,
    order: index + 1,
    transitionsAtRuntime: false,
    metadataOnly: true,
    immutable: true,
  })),
);
