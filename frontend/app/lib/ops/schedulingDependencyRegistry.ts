import { SchedulingPlatformMetadata } from "./schedulingMetadata.ts";

export interface SchedulingDependencyRegistryEntry {
  readonly source: string;
  readonly target: string;
  readonly relationship: string;
  readonly dependencyMode: "MetadataOnly";
  readonly runtimeResolution: false;
}

export const SchedulingDependencyRegistry = Object.freeze([
  Object.freeze({
    source: "Scheduling Foundation",
    target: "Task Intelligence",
    relationship: "Scheduling metadata supports task-level temporal coordination descriptors.",
    dependencyMode: "MetadataOnly",
    runtimeResolution: false,
  }),
  Object.freeze({
    source: "Scheduling Foundation",
    target: "Workflow Intelligence",
    relationship: "Scheduling metadata supports workflow-level sequencing and transition timing descriptors.",
    dependencyMode: "MetadataOnly",
    runtimeResolution: false,
  }),
  Object.freeze({
    source: "Scheduling Foundation",
    target: "Project Execution",
    relationship: "Scheduling metadata supports project-level milestone and timeline descriptors.",
    dependencyMode: "MetadataOnly",
    runtimeResolution: false,
  }),
  Object.freeze({
    source: "Scheduling Foundation",
    target: "Resource Intelligence",
    relationship: "Scheduling metadata supports resource-aware execution window and availability descriptors.",
    dependencyMode: "MetadataOnly",
    runtimeResolution: false,
  }),
  Object.freeze({
    source: "Scheduling Foundation",
    target: "Monitoring & Alerts",
    relationship: "Scheduling metadata describes future monitoring-compatible schedule visibility.",
    dependencyMode: "MetadataOnly",
    runtimeResolution: false,
  }),
  Object.freeze({
    source: "Scheduling Foundation",
    target: "Automation Platform",
    relationship: "Scheduling metadata describes future automation-compatible temporal orchestration boundaries.",
    dependencyMode: "MetadataOnly",
    runtimeResolution: false,
  }),
] as const satisfies readonly SchedulingDependencyRegistryEntry[]);

export const SchedulingDependencyRegistryMetadata = Object.freeze({
  registryId: "ops.scheduling-intelligence.dependency-registry",
  registryVersion: SchedulingPlatformMetadata.compatibilityVersion,
  dependencyCount: SchedulingDependencyRegistry.length,
  metadataOnly: true,
  immutable: true,
} as const);
