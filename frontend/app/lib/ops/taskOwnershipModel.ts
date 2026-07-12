import { TaskIdentityModel } from "./taskIdentityModel.ts";
import type { TaskOwnerDescriptor } from "./taskModelTypes.ts";

const metadata = TaskIdentityModel.metadata;

export const TaskOwnershipModel = Object.freeze({
  ownerReference: "PrimaryTaskOwner",
  accountableRole: "ExecutiveOperationsLead",
  reviewerRole: "TaskReviewAuthority",
  stakeholderReferences: Object.freeze([
    "DecisionOwner",
    "ExecutionStakeholder",
    "ReportingStakeholder",
  ]),
  responsibilityMetadata: Object.freeze([
    "AccountabilityDefined",
    "ReviewResponsibilityDefined",
    "StakeholderVisibilityDefined",
  ]),
  metadata,
} as const satisfies TaskOwnerDescriptor);
