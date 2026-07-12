import type {
  ProjectMilestoneDescriptor,
  ProjectModelMetadata,
} from "./projectModelTypes.ts";

const metadata = Object.freeze({
  platformId: "OPS-4:1",
  platformVersion: "1.0.0",
  compatibilityVersion: "1.0.0",
  sourceDependencies: Object.freeze([
    "OPS-1:9",
    "OPS-2:9",
    "OPS-3:9",
    "OPS-4:1",
    "OPS-4:2",
  ]),
  releaseStage: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ProjectModelMetadata);

export const ProjectMilestoneModel = Object.freeze([
  Object.freeze({
    milestoneId: "milestone-charter-approved",
    milestoneCategory: "Governance",
    successCriteria: Object.freeze([
      "Executive charter metadata approved",
      "Ownership metadata assigned",
    ]),
    completionMetadata: Object.freeze([
      "Approval checkpoint complete",
      "Audit metadata recorded",
    ]),
    dependencyMetadata: Object.freeze([
      "Depends on workflow-executive metadata",
    ]),
    metadata,
  }),
  Object.freeze({
    milestoneId: "milestone-plan-baselined",
    milestoneCategory: "Planning",
    successCriteria: Object.freeze([
      "Project phase metadata baselined",
      "Task group metadata linked",
    ]),
    completionMetadata: Object.freeze([
      "Planning review metadata complete",
    ]),
    dependencyMetadata: Object.freeze([
      "Depends on task-operational metadata",
    ]),
    metadata,
  }),
  Object.freeze({
    milestoneId: "milestone-readiness-confirmed",
    milestoneCategory: "Readiness",
    successCriteria: Object.freeze([
      "Readiness metadata complete",
      "Governance readiness metadata complete",
    ]),
    completionMetadata: Object.freeze([
      "Readiness review metadata complete",
    ]),
    dependencyMetadata: Object.freeze([
      "Depends on workflow-review metadata",
    ]),
    metadata,
  }),
] as const satisfies readonly ProjectMilestoneDescriptor[]);

