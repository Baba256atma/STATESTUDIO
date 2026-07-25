/** ASSISTANT-8:2 — Foundation-derived policy registry. */
import { ExecutiveActionExecutionFoundation } from "./executiveActionExecutionFoundation.ts";
import { registerExecutionEntries } from "./executionMetadataRegistry.ts";

export const ExecutionPolicyRegistry = registerExecutionEntries(
  "ExecutionPolicy",
  ExecutiveActionExecutionFoundation.policies,
);
