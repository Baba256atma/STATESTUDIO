import type {
  ProjectModelMetadata,
  ProjectTaskReferenceDescriptor,
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

export const ProjectTaskReferenceModel = Object.freeze({
  linkedTasks: Object.freeze([
    "task-executive",
    "task-operational",
    "task-approval",
  ]),
  taskGroups: Object.freeze([
    "governance-tasks",
    "execution-planning-tasks",
  ]),
  taskCompatibility: Object.freeze([
    "Compatible with OPS-2 public task namespace",
    "Task grouping remains metadata-only",
  ]),
  executionDependencyMetadata: Object.freeze([
    "Task references inform readiness metadata only",
    "No runtime execution dependency is introduced",
  ]),
  metadata,
} as const satisfies ProjectTaskReferenceDescriptor);

