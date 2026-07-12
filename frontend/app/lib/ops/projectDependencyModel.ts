import type {
  ProjectDependencyDescriptor,
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

export const ProjectDependencyModel = Object.freeze({
  prerequisiteProjects: Object.freeze([
    "project-executive",
    "project-program",
  ]),
  blockingProjects: Object.freeze([
    "project-portfolio",
  ]),
  workflowDependencies: Object.freeze([
    "workflow-executive",
    "workflow-approval",
  ]),
  taskDependencies: Object.freeze([
    "task-executive",
    "task-approval",
  ]),
  downstreamImpact: Object.freeze([
    "Portfolio reporting impact metadata",
    "Program sequencing impact metadata",
  ]),
  dependencyConfidence: "High",
  metadata,
} as const satisfies ProjectDependencyDescriptor);

