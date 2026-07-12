import { WorkflowIdentityModel } from "./workflowIdentityModel.ts";
import type { WorkflowTriggerDescriptor } from "./workflowModelTypes.ts";

const metadata = WorkflowIdentityModel.metadata;

export const WorkflowTriggerModel = Object.freeze([
  Object.freeze({
    triggerId: "decision-trigger",
    triggerCategory: "Decision",
    triggerSource: "BUS",
    triggerConditionMetadata: Object.freeze([
      "DecisionReferenceAvailable",
      "TaskCompatibilityConfirmed",
    ]),
    triggerScopeMetadata: Object.freeze([
      "ExecutiveScope",
      "CrossPlatformMetadataOnly",
    ]),
    metadata,
  } as const satisfies WorkflowTriggerDescriptor),
  Object.freeze({
    triggerId: "approval-trigger",
    triggerCategory: "Approval",
    triggerSource: "WorkflowGovernance",
    triggerConditionMetadata: Object.freeze([
      "ApprovalStageEntered",
      "ApproverMetadataDefined",
    ]),
    triggerScopeMetadata: Object.freeze([
      "GovernanceScope",
      "ReviewScope",
    ]),
    metadata,
  } as const satisfies WorkflowTriggerDescriptor),
  Object.freeze({
    triggerId: "schedule-trigger",
    triggerCategory: "Schedule",
    triggerSource: "SchedulingIntelligence",
    triggerConditionMetadata: Object.freeze([
      "WindowMetadataPublished",
      "DependencyHealthStable",
    ]),
    triggerScopeMetadata: Object.freeze([
      "PlanningScope",
      "MetadataBoundaryOnly",
    ]),
    metadata,
  } as const satisfies WorkflowTriggerDescriptor),
] as const);
