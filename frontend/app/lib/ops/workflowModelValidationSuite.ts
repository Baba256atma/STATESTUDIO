import {
  buildWorkflowModelManifest,
  validateWorkflowModel,
  WorkflowApprovalModel,
  WorkflowReadinessModel,
  WorkflowStageModel,
  WorkflowTaskLinkModel,
  WorkflowTransitionModel,
  WorkflowTriggerModel,
} from "./workflowModelIndex.ts";
import type { WorkflowValidationEntry } from "./workflowValidationTypes.ts";

export const WorkflowModelValidationSuite = Object.freeze([
  Object.freeze({
    id: "workflow-model-integrity",
    name: "Workflow Model Integrity",
    description: "Validates OPS-3:3 workflow model completeness and structure.",
    category: "Model",
    status: validateWorkflowModel().summary.status === "PASS" ? "PASS" : "FAIL",
    metadataOnly: true,
  } as const satisfies WorkflowValidationEntry),
  Object.freeze({
    id: "workflow-stage-integrity",
    name: "Workflow Stage Integrity",
    description: "Validates workflow stage metadata structure.",
    category: "Stage",
    status:
      WorkflowStageModel.length === 5 &&
      WorkflowStageModel.every((stage) => stage.expectedTaskReferences.length >= 1)
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies WorkflowValidationEntry),
  Object.freeze({
    id: "workflow-transition-integrity",
    name: "Transition Metadata Integrity",
    description: "Validates workflow transition metadata structure.",
    category: "Transition",
    status:
      WorkflowTransitionModel.length === 4 &&
      WorkflowTransitionModel.every(
        (transition) => transition.transitionConditionMetadata.length >= 2,
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies WorkflowValidationEntry),
  Object.freeze({
    id: "workflow-approval-integrity",
    name: "Approval Metadata Integrity",
    description: "Validates workflow approval metadata structure.",
    category: "Approval",
    status:
      WorkflowApprovalModel.approverRoleMetadata.length >= 2 &&
      WorkflowApprovalModel.approvalConditionMetadata.length >= 2
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies WorkflowValidationEntry),
  Object.freeze({
    id: "workflow-trigger-integrity",
    name: "Trigger Metadata Integrity",
    description: "Validates workflow trigger metadata structure.",
    category: "Trigger",
    status:
      WorkflowTriggerModel.length >= 3 &&
      WorkflowTriggerModel.every((trigger) => trigger.triggerScopeMetadata.length >= 2)
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies WorkflowValidationEntry),
  Object.freeze({
    id: "workflow-task-compatibility-integrity",
    name: "Task Compatibility Integrity",
    description: "Validates workflow task-link and readiness compatibility metadata.",
    category: "TaskCompatibility",
    status:
      WorkflowTaskLinkModel.every(
        (entry) => entry.taskCompatibilityMetadata.length >= 2,
      ) &&
      WorkflowReadinessModel.every(
        (entry) => entry.requiredTaskModelCompatibility.length >= 1,
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies WorkflowValidationEntry),
  Object.freeze({
    id: "workflow-model-manifest-generation",
    name: "Workflow Model Manifest Generation",
    description: "Validates deterministic OPS-3:3 model manifest generation.",
    category: "Manifest",
    status:
      Object.isFrozen(buildWorkflowModelManifest()) &&
      buildWorkflowModelManifest().metadataOnly
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies WorkflowValidationEntry),
  Object.freeze({
    id: "workflow-model-deterministic-output",
    name: "Workflow Model Deterministic Output",
    description: "Validates deterministic validation output for OPS-3:3.",
    category: "Determinism",
    status:
      JSON.stringify(validateWorkflowModel()) ===
      JSON.stringify(validateWorkflowModel())
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies WorkflowValidationEntry),
] as const);
