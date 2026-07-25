/** ASSISTANT-8:3 — Immutable descriptive execution relationship metadata. */
import { ExecutiveActionExecutionRegistry } from "./executiveActionExecutionRegistry.ts";
import { registerRelationship } from "./executionModelUtilities.ts";

const registryId = ExecutiveActionExecutionRegistry.identity.id;

const declarations = Object.freeze([
  [
    "ExecutionPlanModel",
    "contains",
    "ExecutiveActionModel",
    "An Execution Plan contains Executive Actions as descriptive structure.",
  ],
  [
    "ExecutiveActionModel",
    "contains",
    "ExecutionStepModel",
    "An Executive Action contains Execution Steps as descriptive structure.",
  ],
  [
    "ExecutionStepModel",
    "reports",
    "ExecutionProgressModel",
    "An Execution Step reports Progress as descriptive metadata.",
  ],
  [
    "ExecutionProgressModel",
    "updates",
    "ExecutionStateModel",
    "Progress updates Execution State as descriptive metadata.",
  ],
  [
    "ExecutionStateModel",
    "produces",
    "ExecutionResultModel",
    "Execution State produces Execution Result as descriptive metadata.",
  ],
  [
    "ExecutionExceptionModel",
    "affects",
    "ExecutionHealthModel",
    "Exception metadata affects Execution Health classification.",
  ],
  [
    "ExecutionFeedbackModel",
    "improves",
    "ExecutionSummaryModel",
    "Feedback improves Execution Summary as descriptive metadata.",
  ],
  [
    "ExecutionCheckpointModel",
    "validates",
    "ExecutionProgressModel",
    "Checkpoint metadata validates Execution Progress descriptively.",
  ],
  [
    "ExecutionTimelineModel",
    "records",
    "ExecutionSnapshotModel",
    "Timeline metadata records Execution Snapshot descriptively.",
  ],
] as const);

export const ExecutionRelationships = Object.freeze(
  declarations.map(([source, relationshipType, target, description], index) =>
    registerRelationship(
      index + 1,
      source,
      relationshipType,
      target,
      description,
      registryId,
    )),
);
