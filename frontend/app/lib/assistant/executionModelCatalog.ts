/** ASSISTANT-8:3 — Immutable progress, health, exception, feedback, priority, timeline catalogs. */
import { ExecutiveActionExecutionRegistry } from "./executiveActionExecutionRegistry.ts";
import { registerCatalogEntries } from "./executionModelUtilities.ts";

const registryId = ExecutiveActionExecutionRegistry.identity.id;

export const ExecutionProgressCatalog = registerCatalogEntries(
  "ProgressMeasurement",
  [
    "Percentage",
    "Milestone",
    "Weighted",
    "Business Outcome",
    "Manual Confirmation",
    "Automatic Assessment",
  ],
  registryId,
);

export const ExecutionHealthCatalog = registerCatalogEntries(
  "HealthLevel",
  [
    "Excellent",
    "Healthy",
    "Attention",
    "Warning",
    "Critical",
  ],
  registryId,
);

export const ExecutionExceptionCatalog = registerCatalogEntries(
  "ExceptionClassification",
  [
    "Blocked",
    "Dependency Failure",
    "Deadline Risk",
    "Execution Error",
    "Policy Conflict",
    "External Failure",
    "Business Risk",
    "Resource Constraint",
  ],
  registryId,
);

export const ExecutionFeedbackCatalog = registerCatalogEntries(
  "FeedbackOrigin",
  [
    "Executive",
    "Workspace",
    "Automatic",
    "Manual",
    "System",
    "External",
  ],
  registryId,
);

export const ExecutionPriorityCatalog = registerCatalogEntries(
  "ExecutionPriority",
  [
    "Critical",
    "High",
    "Normal",
    "Low",
    "Deferred",
  ],
  registryId,
);

export const ExecutionTimelineCatalog = registerCatalogEntries(
  "TimelineEvent",
  [
    "Execution Start",
    "Checkpoint",
    "Progress Update",
    "Completion",
    "Cancellation",
    "Archival",
  ],
  registryId,
);

export const ExecutionModelCatalog = Object.freeze({
  progress: ExecutionProgressCatalog,
  health: ExecutionHealthCatalog,
  exceptions: ExecutionExceptionCatalog,
  feedback: ExecutionFeedbackCatalog,
  priorities: ExecutionPriorityCatalog,
  timeline: ExecutionTimelineCatalog,
  sourceRegistry: ExecutiveActionExecutionRegistry.identity,
  metadataOnly: true,
  immutable: true,
} as const);
