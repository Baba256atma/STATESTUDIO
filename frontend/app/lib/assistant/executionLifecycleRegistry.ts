/** ASSISTANT-8:2 — Lifecycle, progress, exception, and feedback registries. */
import { ExecutiveActionExecutionFoundation } from "./executiveActionExecutionFoundation.ts";
import { registerExecutionEntries } from "./executionMetadataRegistry.ts";

export const ExecutionLifecycleRegistry = registerExecutionEntries(
  "ExecutionLifecycle",
  ExecutiveActionExecutionFoundation.lifecycle.map((entry) => ({
    id: entry.id,
    name: entry.name,
    description:
      `Canonical lifecycle registry metadata for ${entry.name}.`,
  })),
);

export const ExecutionProgressRegistry = registerExecutionEntries(
  "ExecutionProgressType",
  ExecutiveActionExecutionFoundation.progressTypes.map((entry) => ({
    id: entry.id,
    name: entry.name,
    description:
      `Canonical progress type registry metadata for ${entry.name}.`,
  })),
);

export const ExecutionExceptionRegistry = registerExecutionEntries(
  "ExecutionExceptionType",
  ExecutiveActionExecutionFoundation.exceptionTypes.map((entry) => ({
    id: entry.id,
    name: entry.name,
    description:
      `Canonical exception type registry metadata for ${entry.name}.`,
  })),
);

export const ExecutionFeedbackRegistry = registerExecutionEntries(
  "ExecutionFeedbackType",
  ExecutiveActionExecutionFoundation.feedbackTypes.map((entry) => ({
    id: entry.id,
    name: entry.name,
    description:
      `Canonical feedback type registry metadata for ${entry.name}.`,
  })),
);
