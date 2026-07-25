/** ASSISTANT-8:2 — Foundation-derived capability registry. */
import { ExecutiveActionExecutionFoundation } from "./executiveActionExecutionFoundation.ts";
import { registerExecutionEntries } from "./executionMetadataRegistry.ts";

export const ExecutionCapabilityRegistry = registerExecutionEntries(
  "ExecutionCapability",
  ExecutiveActionExecutionFoundation.capabilities,
);
