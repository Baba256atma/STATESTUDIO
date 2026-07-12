import { WorkflowPlatformMetadata } from "./workflowMetadata.ts";

export interface WorkflowDependencyRegistryEntry {
  readonly source: string;
  readonly target: string;
  readonly relationship: string;
  readonly dependencyMode: "MetadataOnly";
  readonly runtimeResolution: false;
}

export const WorkflowDependencyRegistry = Object.freeze([
  Object.freeze({
    source: "Workflow Foundation",
    target: "Task Intelligence",
    relationship: "Workflow composition depends on task intelligence public metadata.",
    dependencyMode: "MetadataOnly",
    runtimeResolution: false,
  }),
  Object.freeze({
    source: "Workflow Foundation",
    target: "Project Execution",
    relationship: "Workflow metadata supports future project execution composition.",
    dependencyMode: "MetadataOnly",
    runtimeResolution: false,
  }),
  Object.freeze({
    source: "Workflow Foundation",
    target: "Scheduling Intelligence",
    relationship: "Workflow metadata supports scheduling-aware flow planning.",
    dependencyMode: "MetadataOnly",
    runtimeResolution: false,
  }),
  Object.freeze({
    source: "Workflow Foundation",
    target: "Monitoring & Alerts",
    relationship: "Workflow metadata supports monitoring and alerting architecture.",
    dependencyMode: "MetadataOnly",
    runtimeResolution: false,
  }),
  Object.freeze({
    source: "Workflow Foundation",
    target: "Automation Platform",
    relationship: "Workflow metadata supports future automation platform integration boundaries.",
    dependencyMode: "MetadataOnly",
    runtimeResolution: false,
  }),
] as const satisfies readonly WorkflowDependencyRegistryEntry[]);

export const WorkflowDependencyRegistryMetadata = Object.freeze({
  registryId: "ops.workflow-intelligence.dependency-registry",
  registryVersion: WorkflowPlatformMetadata.compatibilityVersion,
  dependencyCount: WorkflowDependencyRegistry.length,
  metadataOnly: true,
  immutable: true,
} as const);
