/** ASSISTANT-8:2 — Foundation-derived contract registry. */
import { ExecutiveActionExecutionFoundation } from "./executiveActionExecutionFoundation.ts";
import { registerExecutionEntries } from "./executionMetadataRegistry.ts";

export const ExecutionContractRegistry = registerExecutionEntries(
  "ExecutionContract",
  ExecutiveActionExecutionFoundation.contracts,
);
