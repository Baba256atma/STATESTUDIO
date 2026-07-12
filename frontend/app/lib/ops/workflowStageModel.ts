import { WorkflowIdentityModel } from "./workflowIdentityModel.ts";
import type { WorkflowStageDescriptor } from "./workflowModelTypes.ts";

const metadata = WorkflowIdentityModel.metadata;

export const WorkflowStageModel = Object.freeze([
  Object.freeze({
    stageId: "defined",
    stageName: "Defined",
    stageCategory: "Design",
    expectedTaskReferences: Object.freeze([
      "task-executive-001",
    ]),
    entryCriteriaMetadata: Object.freeze([
      "WorkflowIdentityDefined",
      "TaskLinksEnumerated",
    ]),
    exitCriteriaMetadata: Object.freeze([
      "WorkflowStructureDocumented",
      "DependencyMetadataCaptured",
    ]),
    metadata,
  } as const satisfies WorkflowStageDescriptor),
  Object.freeze({
    stageId: "sequenced",
    stageName: "Sequenced",
    stageCategory: "Coordination",
    expectedTaskReferences: Object.freeze([
      "task-operational-002",
      "task-manual-001",
    ]),
    entryCriteriaMetadata: Object.freeze([
      "TransitionMetadataDefined",
      "TaskDependenciesLinked",
    ]),
    exitCriteriaMetadata: Object.freeze([
      "StageOrderingValidated",
      "TaskFlowMetadataAligned",
    ]),
    metadata,
  } as const satisfies WorkflowStageDescriptor),
  Object.freeze({
    stageId: "approved",
    stageName: "Approved",
    stageCategory: "Governance",
    expectedTaskReferences: Object.freeze([
      "task-approval-001",
      "task-review-001",
    ]),
    entryCriteriaMetadata: Object.freeze([
      "ApprovalRolesAssigned",
      "ApprovalConditionsDeclared",
    ]),
    exitCriteriaMetadata: Object.freeze([
      "ApprovalMetadataValidated",
      "EscalationMetadataCaptured",
    ]),
    metadata,
  } as const satisfies WorkflowStageDescriptor),
  Object.freeze({
    stageId: "ready",
    stageName: "Ready",
    stageCategory: "Readiness",
    expectedTaskReferences: Object.freeze([
      "task-automated-001",
      "task-manual-001",
    ]),
    entryCriteriaMetadata: Object.freeze([
      "ReadinessMetadataDefined",
      "DependencyConfidenceValidated",
    ]),
    exitCriteriaMetadata: Object.freeze([
      "ExecutionPlanningBoundaryDefined",
      "PublicApiCompatibilityConfirmed",
    ]),
    metadata,
  } as const satisfies WorkflowStageDescriptor),
  Object.freeze({
    stageId: "cataloged",
    stageName: "Cataloged",
    stageCategory: "Publication",
    expectedTaskReferences: Object.freeze([
      "task-review-001",
    ]),
    entryCriteriaMetadata: Object.freeze([
      "FoundationValidated",
      "RegistryMetadataPublished",
    ]),
    exitCriteriaMetadata: Object.freeze([
      "WorkflowModelPublished",
      "ConsumerMetadataStable",
    ]),
    metadata,
  } as const satisfies WorkflowStageDescriptor),
] as const);
