import type {
  ProjectModelMetadata,
  ProjectWorkflowReferenceDescriptor,
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

export const ProjectWorkflowReferenceModel = Object.freeze({
  linkedWorkflows: Object.freeze([
    "workflow-executive",
    "workflow-operational",
    "workflow-approval",
  ]),
  workflowGroups: Object.freeze([
    "governance-workflows",
    "delivery-workflows",
  ]),
  workflowCategories: Object.freeze([
    "Executive",
    "Operational",
    "Approval",
  ]),
  workflowCompatibilityMetadata: Object.freeze([
    "Compatible with OPS-3 public workflow namespace",
    "Workflow grouping remains metadata-only",
  ]),
  metadata,
} as const satisfies ProjectWorkflowReferenceDescriptor);

