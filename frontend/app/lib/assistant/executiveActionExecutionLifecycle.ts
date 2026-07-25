/** ASSISTANT-8:1 — Lifecycle, states, progress, exception, and feedback metadata. */
import type {
  ExecutiveActionExecutionClassificationMetadata,
  ExecutiveActionExecutionLifecycleMetadata,
  ExecutiveActionExecutionStateMetadata,
} from "./executiveActionExecutionTypes.ts";

const registerClassification = (
  prefix: string,
  names: readonly string[],
): readonly ExecutiveActionExecutionClassificationMetadata[] =>
  Object.freeze(
    names.map((name, index) => Object.freeze({
      id: `ASSISTANT-8:1/${prefix}/${String(index + 1).padStart(2, "0")}`,
      name,
      order: index + 1,
      conceptualOnly: true,
      executable: false,
      metadataOnly: true,
      immutable: true,
    })),
  );

const lifecycleNames = Object.freeze([
  "Declared",
  "Prepared",
  "Queued",
  "Running",
  "Monitoring",
  "Paused",
  "Completed",
  "Cancelled",
  "Archived",
] as const);

export const ExecutiveActionExecutionLifecycle:
readonly ExecutiveActionExecutionLifecycleMetadata[] = Object.freeze(
  lifecycleNames.map((name, index) => Object.freeze({
    id: `ASSISTANT-8:1/Lifecycle/${String(index + 1).padStart(2, "0")}`,
    name,
    order: index + 1,
    transitionsAtRuntime: false,
    metadataOnly: true,
    immutable: true,
  })),
);

const executionStateNames = Object.freeze([
  "NotStarted",
  "Queued",
  "Executing",
  "Waiting",
  "Blocked",
  "Paused",
  "Completed",
  "Cancelled",
  "Failed",
] as const);

export const ExecutiveActionExecutionStates:
readonly ExecutiveActionExecutionStateMetadata[] = Object.freeze(
  executionStateNames.map((name, index) => Object.freeze({
    id: `ASSISTANT-8:1/ExecutionState/${String(index + 1).padStart(2, "0")}`,
    name,
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);

export const ExecutiveActionExecutionProgressTypes = registerClassification(
  "ProgressType",
  [
    "Percentage",
    "Milestone",
    "Task Count",
    "Weighted Progress",
    "Business Outcome",
    "Manual Confirmation",
  ],
);

export const ExecutiveActionExecutionExceptionTypes = registerClassification(
  "ExceptionType",
  [
    "Blocked",
    "Dependency Failure",
    "Resource Issue",
    "Policy Violation",
    "Deadline Risk",
    "Business Risk",
    "Execution Error",
    "External Failure",
  ],
);

export const ExecutiveActionExecutionFeedbackTypes = registerClassification(
  "FeedbackType",
  [
    "Automatic",
    "Manual",
    "Executive",
    "Workspace",
    "System",
    "External",
  ],
);
