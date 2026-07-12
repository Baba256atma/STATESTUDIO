import { WorkflowIdentityModel } from "./workflowIdentityModel.ts";
import type { WorkflowApprovalDescriptor } from "./workflowModelTypes.ts";

const metadata = WorkflowIdentityModel.metadata;

export const WorkflowApprovalModel = Object.freeze({
  approvalStage: "approved",
  approverRoleMetadata: Object.freeze([
    "ExecutiveApprover",
    "OperationalApprover",
  ]),
  reviewRoleMetadata: Object.freeze([
    "ReviewLead",
    "ComplianceReviewer",
  ]),
  approvalConditionMetadata: Object.freeze([
    "ApprovalConditionsDocumented",
    "DependencyReviewComplete",
  ]),
  escalationMetadata: Object.freeze([
    "EscalationPathDefined",
    "EscalationRoleReferenceAvailable",
  ]),
  metadata,
} as const satisfies WorkflowApprovalDescriptor);
