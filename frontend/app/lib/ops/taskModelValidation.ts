import { buildTaskModelManifest } from "./taskModelManifest.ts";
import { TaskDependencyModel } from "./taskDependencyModel.ts";
import { TaskEffortModel } from "./taskEffortModel.ts";
import { TaskIdentityModel, TaskExecutionReadinessModel } from "./taskIdentityModel.ts";
import { TaskLifecycleModel } from "./taskLifecycleModel.ts";
import { TaskOwnershipModel } from "./taskOwnershipModel.ts";
import { TaskPlatformMetadata } from "./taskMetadataIndex.ts";
import { TaskPriorityModel } from "./taskPriorityModel.ts";
import { TaskRiskModel } from "./taskRiskModel.ts";

const buildChecks = () =>
  Object.freeze([
    Object.freeze({
      id: "task-model-completeness",
      name: "Model Completeness",
      status:
        TaskExecutionReadinessModel.length === 2 &&
        TaskIdentityModel.taskClassification.length === 7
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "task-lifecycle-states-exist",
      name: "Lifecycle States Exist",
      status: TaskLifecycleModel.length === 8 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "task-priority-metadata-exists",
      name: "Priority Metadata Exists",
      status: TaskPriorityModel.length === 4 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "task-ownership-metadata-exists",
      name: "Ownership Metadata Exists",
      status:
        TaskOwnershipModel.stakeholderReferences.length >= 3 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "task-dependency-metadata-exists",
      name: "Dependency Metadata Exists",
      status:
        TaskDependencyModel.prerequisiteTasks.length >= 1 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "task-effort-metadata-exists",
      name: "Effort Metadata Exists",
      status:
        TaskEffortModel.planningNotesMetadata.length >= 2 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "task-risk-metadata-exists",
      name: "Risk Metadata Exists",
      status:
        TaskRiskModel.mitigationReferenceMetadata.length >= 2 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "task-manifest-builds",
      name: "Manifest Builds",
      status:
        Object.isFrozen(buildTaskModelManifest()) &&
        buildTaskModelManifest().compatibility.compatibilityVersion ===
          TaskPlatformMetadata.compatibilityVersion
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "task-immutable-exports",
      name: "Immutable Exports",
      status:
        Object.isFrozen(TaskIdentityModel) &&
        Object.isFrozen(TaskLifecycleModel) &&
        Object.isFrozen(TaskPriorityModel) &&
        Object.isFrozen(TaskOwnershipModel) &&
        Object.isFrozen(TaskDependencyModel) &&
        Object.isFrozen(TaskEffortModel) &&
        Object.isFrozen(TaskRiskModel)
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "task-deterministic-output",
      name: "Deterministic Output",
      status:
        JSON.stringify(buildTaskModelManifest()) ===
        JSON.stringify(buildTaskModelManifest())
          ? "PASS"
          : "FAIL",
    }),
  ] as const);

export const validateTaskModel = () => {
  const checks = buildChecks();
  const passed = checks.filter((check) => check.status === "PASS").length;
  const failed = checks.length - passed;

  return Object.freeze({
    checks,
    summary: Object.freeze({
      total: checks.length,
      passed,
      failed,
      status: failed === 0 ? "PASS" : "FAIL",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
};
