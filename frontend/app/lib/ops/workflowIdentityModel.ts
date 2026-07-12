import {
  WorkflowIntelligenceIdentity,
  WorkflowIntelligencePlatformVersion,
} from "./workflowIntelligenceIndex.ts";
import { WorkflowPlatformMetadata } from "./workflowMetadataIndex.ts";
import type {
  WorkflowModelIdentity,
  WorkflowModelMetadata,
  WorkflowReadinessDescriptor,
  WorkflowTaskLinkDescriptor,
} from "./workflowModelTypes.ts";

const workflowModelMetadata = Object.freeze({
  platformId: WorkflowIntelligenceIdentity.platformId,
  platformVersion: WorkflowIntelligencePlatformVersion,
  compatibilityVersion: WorkflowPlatformMetadata.compatibilityVersion,
  sourceDependencies: Object.freeze(["OPS-1:9", "OPS-2:9", "OPS-3:1", "OPS-3:2"]),
  releaseStage: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies WorkflowModelMetadata);

export const WorkflowReadinessModel = Object.freeze([
  Object.freeze({
    readinessCategory: "Ready",
    requiredTaskModelCompatibility: Object.freeze([
      "OPS-2:9 Public Platform",
      "TaskIdentityMetadataAvailable",
    ]),
    requiredDependencyMetadata: Object.freeze([
      "DependencyRegistryDefined",
      "WorkflowDependencyMetadataReviewed",
    ]),
    requiredOwnershipMetadata: Object.freeze([
      "ApproverRolesDefined",
      "StakeholderRolesDefined",
    ]),
    readinessConfidenceMetadata: Object.freeze([
      "ValidatedCompatibility",
      "StablePublicApiDependency",
    ]),
    metadata: workflowModelMetadata,
  } as const satisfies WorkflowReadinessDescriptor),
  Object.freeze({
    readinessCategory: "Blocked",
    requiredTaskModelCompatibility: Object.freeze([
      "TaskLinkMetadataMissing",
    ]),
    requiredDependencyMetadata: Object.freeze([
      "DependencyConfidenceUnverified",
    ]),
    requiredOwnershipMetadata: Object.freeze([
      "ApprovalRolesIncomplete",
    ]),
    readinessConfidenceMetadata: Object.freeze([
      "CompatibilityPending",
    ]),
    metadata: workflowModelMetadata,
  } as const satisfies WorkflowReadinessDescriptor),
] as const);

export const WorkflowTaskLinkModel = Object.freeze([
  Object.freeze({
    linkedTaskCategories: Object.freeze([
      "Executive",
      "Approval",
      "Review",
    ]),
    linkedTaskReferences: Object.freeze([
      "task-executive-001",
      "task-approval-001",
      "task-review-001",
    ]),
    taskCompatibilityMetadata: Object.freeze([
      "OPS-2PublicApiCompatible",
      "TaskContractLinkable",
    ]),
    coordinationNotesMetadata: Object.freeze([
      "WorkflowCoordinatesDependentTasks",
      "TaskSequenceMetadataShared",
    ]),
    metadata: workflowModelMetadata,
  } as const satisfies WorkflowTaskLinkDescriptor),
  Object.freeze({
    linkedTaskCategories: Object.freeze([
      "Operational",
      "Manual",
      "Automated",
    ]),
    linkedTaskReferences: Object.freeze([
      "task-operational-002",
      "task-manual-001",
      "task-automated-001",
    ]),
    taskCompatibilityMetadata: Object.freeze([
      "TaskReadinessMetadataAvailable",
      "CrossPlatformTaskDependencySupported",
    ]),
    coordinationNotesMetadata: Object.freeze([
      "TaskOwnershipMetadataAligned",
      "ExecutionReadinessSignalsShared",
    ]),
    metadata: workflowModelMetadata,
  } as const satisfies WorkflowTaskLinkDescriptor),
] as const);

export const WorkflowIdentityModel = Object.freeze({
  workflowIdPattern: "workflow-{category}-{sequence}",
  displayName: "Workflow Identity Model",
  description: "Canonical metadata model for workflow identity and classification.",
  category: "WorkflowIdentity",
  sourcePlatform: WorkflowIntelligenceIdentity.platformName,
  taskIntelligenceDependencyMetadata: Object.freeze([
    "OPS-2PublicFoundationDependency",
    "TaskLinkCompatibilityMetadata",
  ]),
  decisionReferenceMetadata: Object.freeze([
    "BusDecisionReference",
    "WorkflowOriginMetadata",
  ]),
  workflowClassification: Object.freeze([
    "Executive",
    "Operational",
    "Approval",
    "Review",
    "Escalation",
    "Automated",
    "Manual",
  ]),
  readinessMetadata: WorkflowReadinessModel,
  taskLinkMetadata: WorkflowTaskLinkModel,
  metadata: workflowModelMetadata,
} as const satisfies WorkflowModelIdentity);
