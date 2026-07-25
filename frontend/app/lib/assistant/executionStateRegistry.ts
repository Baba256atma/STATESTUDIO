/** ASSISTANT-8:2 — Foundation-derived execution state registry. */
import { ExecutiveActionExecutionFoundation } from "./executiveActionExecutionFoundation.ts";
import { registerExecutionEntries } from "./executionMetadataRegistry.ts";

export const ExecutionStateRegistry = registerExecutionEntries(
  "ExecutionState",
  ExecutiveActionExecutionFoundation.executionStates.map((entry) => ({
    id: entry.id,
    name: entry.name,
    description:
      `Canonical execution state registry metadata for ${entry.name}.`,
  })),
);
