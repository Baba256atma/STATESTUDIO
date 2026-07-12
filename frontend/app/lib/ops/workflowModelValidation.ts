import { buildWorkflowModelManifest } from "./workflowModelManifest.ts";
import { WorkflowApprovalModel } from "./workflowApprovalModel.ts";
import { WorkflowDependencyModel } from "./workflowDependencyModel.ts";
import { WorkflowIdentityModel } from "./workflowIdentityModel.ts";
import {
  WorkflowReadinessModel,
  WorkflowTaskLinkModel,
} from "./workflowReadinessModel.ts";
import { WorkflowPlatformMetadata } from "./workflowMetadataIndex.ts";
import { WorkflowStageModel } from "./workflowStageModel.ts";
import { WorkflowTransitionModel } from "./workflowTransitionModel.ts";
import { WorkflowTriggerModel } from "./workflowTriggerModel.ts";

const buildChecks = () =>
  Object.freeze([
    Object.freeze({
      id: "workflow-model-completeness",
      name: "Model Completeness",
      status:
        WorkflowReadinessModel.length === 2 &&
        WorkflowIdentityModel.workflowClassification.length === 7
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "workflow-identity-metadata-exists",
      name: "Identity Metadata Exists",
      status: WorkflowIdentityModel.workflowIdPattern.length > 0 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "workflow-stage-metadata-exists",
      name: "Stage Metadata Exists",
      status: WorkflowStageModel.length === 5 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "workflow-transition-metadata-exists",
      name: "Transition Metadata Exists",
      status: WorkflowTransitionModel.length === 4 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "workflow-dependency-metadata-exists",
      name: "Dependency Metadata Exists",
      status:
        WorkflowDependencyModel.prerequisiteWorkflows.length >= 1 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "workflow-trigger-metadata-exists",
      name: "Trigger Metadata Exists",
      status: WorkflowTriggerModel.length >= 2 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "workflow-approval-metadata-exists",
      name: "Approval Metadata Exists",
      status:
        WorkflowApprovalModel.approverRoleMetadata.length >= 2 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "workflow-readiness-metadata-exists",
      name: "Readiness Metadata Exists",
      status: WorkflowReadinessModel.length === 2 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "workflow-task-link-metadata-exists",
      name: "Task-Link Metadata Exists",
      status:
        WorkflowTaskLinkModel[0]?.linkedTaskReferences.length !== undefined ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "workflow-manifest-builds",
      name: "Manifest Builds",
      status:
        Object.isFrozen(buildWorkflowModelManifest()) &&
        buildWorkflowModelManifest().compatibility.compatibilityVersion ===
          WorkflowPlatformMetadata.compatibilityVersion
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "workflow-immutable-exports",
      name: "Immutable Exports",
      status:
        Object.isFrozen(WorkflowIdentityModel) &&
        Object.isFrozen(WorkflowStageModel) &&
        Object.isFrozen(WorkflowTransitionModel) &&
        Object.isFrozen(WorkflowDependencyModel) &&
        Object.isFrozen(WorkflowTriggerModel) &&
        Object.isFrozen(WorkflowApprovalModel) &&
        Object.isFrozen(WorkflowReadinessModel)
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "workflow-deterministic-output",
      name: "Deterministic Output",
      status:
        JSON.stringify(buildWorkflowModelManifest()) ===
        JSON.stringify(buildWorkflowModelManifest())
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "workflow-ops-2-task-compatibility-metadata-exists",
      name: "OPS-2 Task Compatibility Metadata Exists",
      status:
        WorkflowTaskLinkModel.some(
          (entry) => entry.taskCompatibilityMetadata.length >= 2,
        )
          ? "PASS"
          : "FAIL",
    }),
  ] as const);

export const validateWorkflowModel = () => {
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
