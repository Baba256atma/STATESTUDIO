import { ResourcePlatformMetadata } from "./resourceMetadata.ts";

export interface ResourceDependencyRegistryEntry {
  readonly source: string;
  readonly target: string;
  readonly relationship: string;
  readonly dependencyMode: "MetadataOnly";
  readonly runtimeResolution: false;
}

export const ResourceDependencyRegistry = Object.freeze([
  Object.freeze({
    source: "Resource Foundation",
    target: "Task Intelligence",
    relationship: "Resource metadata supports task-level execution resource descriptors.",
    dependencyMode: "MetadataOnly",
    runtimeResolution: false,
  }),
  Object.freeze({
    source: "Resource Foundation",
    target: "Workflow Intelligence",
    relationship: "Resource metadata supports workflow-level coordination descriptors.",
    dependencyMode: "MetadataOnly",
    runtimeResolution: false,
  }),
  Object.freeze({
    source: "Resource Foundation",
    target: "Project Execution",
    relationship: "Resource metadata supports project-level planning and execution descriptors.",
    dependencyMode: "MetadataOnly",
    runtimeResolution: false,
  }),
  Object.freeze({
    source: "Resource Foundation",
    target: "Scheduling Intelligence",
    relationship: "Resource metadata describes future scheduling-aware resource coordination.",
    dependencyMode: "MetadataOnly",
    runtimeResolution: false,
  }),
  Object.freeze({
    source: "Resource Foundation",
    target: "Monitoring & Alerts",
    relationship: "Resource metadata describes future monitoring-compatible resource visibility.",
    dependencyMode: "MetadataOnly",
    runtimeResolution: false,
  }),
  Object.freeze({
    source: "Resource Foundation",
    target: "Automation Platform",
    relationship: "Resource metadata describes future automation-compatible resource orchestration boundaries.",
    dependencyMode: "MetadataOnly",
    runtimeResolution: false,
  }),
] as const satisfies readonly ResourceDependencyRegistryEntry[]);

export const ResourceDependencyRegistryMetadata = Object.freeze({
  registryId: "ops.resource-intelligence.dependency-registry",
  registryVersion: ResourcePlatformMetadata.compatibilityVersion,
  dependencyCount: ResourceDependencyRegistry.length,
  metadataOnly: true,
  immutable: true,
} as const);

