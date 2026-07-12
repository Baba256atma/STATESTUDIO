import { TaskPublicApiRegistry } from "./taskMetadataIndex.ts";
import {
  TaskDependencyModel,
  TaskEffortModel,
  TaskExecutionReadinessModel,
  TaskIdentityModel,
  TaskLifecycleModel,
  TaskOwnershipModel,
  TaskPriorityModel,
  TaskRiskModel,
} from "./taskModelIndex.ts";
import { TaskIntelligencePublicApis, TaskIntelligenceIdentity } from "./taskIntelligenceIndex.ts";
import type { TaskValidationEntry } from "./taskValidationTypes.ts";

const objectModels = Object.freeze([
  TaskIdentityModel,
  TaskOwnershipModel,
  TaskDependencyModel,
  TaskEffortModel,
  TaskRiskModel,
]);

const arrayModels = Object.freeze([
  TaskLifecycleModel,
  TaskPriorityModel,
  TaskExecutionReadinessModel,
]);

export const TaskPublicApiValidation = Object.freeze([
  Object.freeze({
    id: "task-public-api-stability",
    name: "Public API Stability",
    description: "Validates stable public API exposure across OPS-2 phases.",
    category: "PublicApi",
    status:
      TaskIntelligencePublicApis.length === 3 && TaskPublicApiRegistry.length >= 9
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies TaskValidationEntry),
  Object.freeze({
    id: "task-public-api-consumer-only",
    name: "Public API Consumer Only",
    description: "Validates public API remains consumer-facing and metadata-only.",
    category: "PublicApi",
    status:
      objectModels.every((model) => model.metadata.metadataOnly) &&
      arrayModels.every(
        (model) => Object.isFrozen(model) && model.every((entry) => entry.metadata.metadataOnly),
      ) &&
      TaskIntelligenceIdentity.metadataOnly
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies TaskValidationEntry),
  Object.freeze({
    id: "task-public-api-immutability",
    name: "Public API Immutability",
    description: "Validates immutable public API registry and exported models.",
    category: "Immutability",
    status:
      Object.isFrozen(TaskPublicApiRegistry) &&
      Object.isFrozen(TaskIdentityModel) &&
      Object.isFrozen(TaskLifecycleModel) &&
      Object.isFrozen(TaskPriorityModel) &&
      Object.isFrozen(TaskOwnershipModel) &&
      Object.isFrozen(TaskDependencyModel) &&
      Object.isFrozen(TaskEffortModel) &&
      Object.isFrozen(TaskRiskModel) &&
      Object.isFrozen(TaskExecutionReadinessModel)
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies TaskValidationEntry),
] as const);
