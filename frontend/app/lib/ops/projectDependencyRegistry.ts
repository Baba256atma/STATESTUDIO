import { ProjectPlatformMetadata } from "./projectMetadata.ts";

export interface ProjectDependencyRegistryEntry {
  readonly source: string;
  readonly target: string;
  readonly relationship: string;
  readonly dependencyMode: "MetadataOnly";
  readonly runtimeResolution: false;
}

export const ProjectDependencyRegistry = Object.freeze([
  Object.freeze({
    source: "Project Foundation",
    target: "Task Intelligence",
    relationship: "Project metadata depends on task intelligence contracts through public APIs.",
    dependencyMode: "MetadataOnly",
    runtimeResolution: false,
  }),
  Object.freeze({
    source: "Project Foundation",
    target: "Workflow Intelligence",
    relationship: "Project metadata depends on workflow intelligence contracts through public APIs.",
    dependencyMode: "MetadataOnly",
    runtimeResolution: false,
  }),
  Object.freeze({
    source: "Project Foundation",
    target: "Resource Intelligence",
    relationship: "Project metadata describes future resource-aware project coordination.",
    dependencyMode: "MetadataOnly",
    runtimeResolution: false,
  }),
  Object.freeze({
    source: "Project Foundation",
    target: "Scheduling Intelligence",
    relationship: "Project metadata describes future scheduling-aware project coordination.",
    dependencyMode: "MetadataOnly",
    runtimeResolution: false,
  }),
  Object.freeze({
    source: "Project Foundation",
    target: "Monitoring & Alerts",
    relationship: "Project metadata describes future monitoring-compatible project status surfaces.",
    dependencyMode: "MetadataOnly",
    runtimeResolution: false,
  }),
  Object.freeze({
    source: "Project Foundation",
    target: "Automation Platform",
    relationship: "Project metadata describes future automation-compatible project orchestration boundaries.",
    dependencyMode: "MetadataOnly",
    runtimeResolution: false,
  }),
] as const satisfies readonly ProjectDependencyRegistryEntry[]);

export const ProjectDependencyRegistryMetadata = Object.freeze({
  registryId: "ops.project-execution.dependency-registry",
  registryVersion: ProjectPlatformMetadata.compatibilityVersion,
  dependencyCount: ProjectDependencyRegistry.length,
  metadataOnly: true,
  immutable: true,
} as const);

