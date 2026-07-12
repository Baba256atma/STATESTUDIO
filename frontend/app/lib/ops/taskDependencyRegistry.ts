import { TaskPlatformMetadata } from "./taskMetadata.ts";

export interface TaskDependencyRegistryEntry {
  readonly source: string;
  readonly target: string;
  readonly relationship: string;
  readonly dependencyMode: "MetadataOnly";
  readonly runtimeResolution: false;
}

export const TaskDependencyRegistry = Object.freeze([
  Object.freeze({
    source: "Task Foundation",
    target: "Future Task Model",
    relationship: "Task foundation metadata informs future model composition.",
    dependencyMode: "MetadataOnly",
    runtimeResolution: false,
  }),
  Object.freeze({
    source: "Task Foundation",
    target: "Workflow Intelligence",
    relationship: "Task contracts support workflow platform composition.",
    dependencyMode: "MetadataOnly",
    runtimeResolution: false,
  }),
  Object.freeze({
    source: "Task Foundation",
    target: "Project Execution",
    relationship: "Task metadata supports project execution architecture.",
    dependencyMode: "MetadataOnly",
    runtimeResolution: false,
  }),
  Object.freeze({
    source: "Task Foundation",
    target: "Resource Intelligence",
    relationship: "Task metadata supports resource-aware planning architecture.",
    dependencyMode: "MetadataOnly",
    runtimeResolution: false,
  }),
  Object.freeze({
    source: "Task Foundation",
    target: "Scheduling Intelligence",
    relationship: "Task metadata supports scheduling architecture.",
    dependencyMode: "MetadataOnly",
    runtimeResolution: false,
  }),
] as const satisfies readonly TaskDependencyRegistryEntry[]);

export const TaskDependencyRegistryMetadata = Object.freeze({
  registryId: "ops.task-intelligence.dependency-registry",
  registryVersion: TaskPlatformMetadata.compatibilityVersion,
  dependencyCount: TaskDependencyRegistry.length,
  metadataOnly: true,
  immutable: true,
} as const);
