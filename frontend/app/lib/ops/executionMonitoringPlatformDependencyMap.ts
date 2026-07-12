import type { ExecutionMonitoringPlatformDependencyEntry } from "./executionMonitoringManifestTypes.ts";

const entry = (sourcePhaseId: string, targetPhaseId: string, relationship: string, scope: ExecutionMonitoringPlatformDependencyEntry["scope"]) => Object.freeze({
  sourcePhaseId, targetPhaseId, dependencyType: "PublicApi", relationship, scope, metadataOnly: true,
} as const satisfies ExecutionMonitoringPlatformDependencyEntry);
const internal = (source: string, target: string, relationship: string) => entry(source, target, relationship, "Internal");
const compatible = (target: string, name: string) => entry("OPS-9", target, `Execution monitoring remains compatible with ${name} metadata.`, "CrossPlatformCompatibility");

export const ExecutionMonitoringPlatformDependencyMap = Object.freeze([
  internal("OPS-9:1", "OPS-9:1", "Foundation defines the canonical monitoring contracts."),
  internal("OPS-9:2", "OPS-9:1", "Registry consumes the foundation public API."),
  internal("OPS-9:3", "OPS-9:1", "Model consumes the foundation public API."),
  internal("OPS-9:3", "OPS-9:2", "Model consumes the registry public API."),
  internal("OPS-9:4", "OPS-9:1", "Validation consumes the foundation public API."),
  internal("OPS-9:4", "OPS-9:2", "Validation consumes the registry public API."),
  internal("OPS-9:4", "OPS-9:3", "Validation consumes the model public API."),
  compatible("OPS-2", "Task Intelligence"), compatible("OPS-3", "Workflow Intelligence"),
  compatible("OPS-4", "Project Execution"), compatible("OPS-5", "Resource Intelligence"),
  compatible("OPS-6", "Scheduling Intelligence"), compatible("OPS-7", "Dependency Intelligence"),
  compatible("OPS-8", "Automation Platform"),
] as const);

export const ExecutionMonitoringPlatformDependencyMapMetadata = Object.freeze({
  dependencyMapId: "ops-9-5-execution-monitoring-dependency-map",
  dependencyCount: ExecutionMonitoringPlatformDependencyMap.length,
  metadataOnly: true, immutable: true, deterministic: true,
} as const);
