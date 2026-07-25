/** ASSISTANT-8:3 — Canonical immutable Executive Action Execution domain models. */
import { ExecutiveActionExecutionRegistry } from "./executiveActionExecutionRegistry.ts";
import { ExecutionModelAttributes } from "./executionModelMetadata.ts";
import { ExecutionRelationships } from "./executionRelationships.ts";
import type { ExecutionModelCategory } from "./executionModelTypes.ts";
import { registerDomainModel } from "./executionModelUtilities.ts";

const attributeNames = ExecutionModelAttributes.map(({ name }) => name);

const registryEntry = (
  collection: readonly { readonly id: string; readonly name: string }[],
  name: string,
): string =>
  collection.find((candidate) => candidate.name === name)?.id
    ?? ExecutiveActionExecutionRegistry.identity.id;

const relationshipsFor = (modelName: string): readonly string[] =>
  Object.freeze(
    ExecutionRelationships
      .filter(({ source, target }) =>
        source === modelName || target === modelName)
      .map(({ id }) => id),
  );

const declarations = Object.freeze([
  [
    "ExecutiveActionModel",
    "Canonical domain model for an Executive Action under execution.",
    "Execution",
    registryEntry(ExecutiveActionExecutionRegistry.contracts, "ExecutiveAction"),
  ],
  [
    "ExecutionPlanModel",
    "Canonical domain model for an Execution Plan structure.",
    "Planning",
    registryEntry(ExecutiveActionExecutionRegistry.contracts, "ExecutionPlan"),
  ],
  [
    "ExecutionStepModel",
    "Canonical domain model for a discrete Execution Step.",
    "Execution",
    registryEntry(ExecutiveActionExecutionRegistry.contracts, "ExecutionStep"),
  ],
  [
    "ExecutionProgressModel",
    "Canonical domain model for descriptive execution progress.",
    "Progress",
    registryEntry(ExecutiveActionExecutionRegistry.contracts, "ExecutionProgress"),
  ],
  [
    "ExecutionStateModel",
    "Canonical domain model for descriptive execution state.",
    "Execution",
    registryEntry(ExecutiveActionExecutionRegistry.contracts, "ExecutionState"),
  ],
  [
    "ExecutionResultModel",
    "Canonical domain model for descriptive execution results.",
    "Summary",
    registryEntry(ExecutiveActionExecutionRegistry.contracts, "ExecutionResult"),
  ],
  [
    "ExecutionCheckpointModel",
    "Canonical domain model for execution checkpoint metadata.",
    "Monitoring",
    registryEntry(
      ExecutiveActionExecutionRegistry.contracts,
      "ExecutionCheckpoint",
    ),
  ],
  [
    "ExecutionSnapshotModel",
    "Canonical domain model for execution snapshot metadata.",
    "Monitoring",
    registryEntry(ExecutiveActionExecutionRegistry.contracts, "ExecutionSnapshot"),
  ],
  [
    "ExecutionHealthModel",
    "Canonical domain model for execution health classification.",
    "Health",
    registryEntry(ExecutiveActionExecutionRegistry.contracts, "ExecutionHealth"),
  ],
  [
    "ExecutionExceptionModel",
    "Canonical domain model for execution exception classification.",
    "Exception",
    registryEntry(
      ExecutiveActionExecutionRegistry.contracts,
      "ExecutionException",
    ),
  ],
  [
    "ExecutionFeedbackModel",
    "Canonical domain model for execution feedback origins.",
    "Feedback",
    registryEntry(ExecutiveActionExecutionRegistry.contracts, "ExecutionFeedback"),
  ],
  [
    "ExecutionSummaryModel",
    "Canonical domain model for execution summary metadata.",
    "Summary",
    registryEntry(ExecutiveActionExecutionRegistry.contracts, "ExecutionSummary"),
  ],
  [
    "ExecutionDependencyModel",
    "Canonical domain model for execution dependency relationships.",
    "Governance",
    registryEntry(
      ExecutiveActionExecutionRegistry.policies,
      "Execution Consistency",
    ),
  ],
  [
    "ExecutionOwnershipModel",
    "Canonical domain model for execution ownership metadata.",
    "Ownership",
    registryEntry(
      ExecutiveActionExecutionRegistry.policies,
      "Executive Transparency",
    ),
  ],
  [
    "ExecutionPriorityModel",
    "Canonical domain model for execution priority classification.",
    "Governance",
    registryEntry(
      ExecutiveActionExecutionRegistry.policies,
      "Deterministic Status",
    ),
  ],
  [
    "ExecutionTimelineModel",
    "Canonical domain model for descriptive execution timeline events.",
    "Monitoring",
    registryEntry(
      ExecutiveActionExecutionRegistry.policies,
      "Progress Integrity",
    ),
  ],
] as const);

export const ExecutionDomainModels = Object.freeze(
  declarations.map(([name, description, category, registryReference], index) =>
    registerDomainModel({
      order: index + 1,
      name,
      description,
      category: category as ExecutionModelCategory,
      attributes: attributeNames,
      relationshipReferences: relationshipsFor(name),
      registryReference,
    })),
);

export const ExecutiveActionModel = ExecutionDomainModels[0];
export const ExecutionPlanModel = ExecutionDomainModels[1];
export const ExecutionStepModel = ExecutionDomainModels[2];
export const ExecutionProgressModel = ExecutionDomainModels[3];
export const ExecutionStateModel = ExecutionDomainModels[4];
export const ExecutionResultModel = ExecutionDomainModels[5];
export const ExecutionCheckpointModel = ExecutionDomainModels[6];
export const ExecutionSnapshotModel = ExecutionDomainModels[7];
export const ExecutionHealthModel = ExecutionDomainModels[8];
export const ExecutionExceptionModel = ExecutionDomainModels[9];
export const ExecutionFeedbackModel = ExecutionDomainModels[10];
export const ExecutionSummaryModel = ExecutionDomainModels[11];
export const ExecutionDependencyModel = ExecutionDomainModels[12];
export const ExecutionOwnershipModel = ExecutionDomainModels[13];
export const ExecutionPriorityModel = ExecutionDomainModels[14];
export const ExecutionTimelineModel = ExecutionDomainModels[15];
