import { ExecutionPlatformMetadata } from "./executionMetadata.ts";

export interface ExecutionCapabilityRegistryEntry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly domainId: string;
  readonly phaseId: string;
  readonly releaseState: "Draft";
  readonly executionRuntime: false;
  readonly metadataOnly: true;
}

export const ExecutionCapabilityRegistry = Object.freeze([
  Object.freeze({
    id: "cap-task-intelligence",
    name: "Task Intelligence",
    description: "Descriptive registry entry for task-oriented execution capabilities.",
    domainId: "task-intelligence",
    phaseId: "OPS-1:2",
    releaseState: "Draft",
    executionRuntime: false,
    metadataOnly: true,
  }),
  Object.freeze({
    id: "cap-workflow-intelligence",
    name: "Workflow Intelligence",
    description: "Descriptive registry entry for workflow-oriented execution capabilities.",
    domainId: "workflow-intelligence",
    phaseId: "OPS-1:2",
    releaseState: "Draft",
    executionRuntime: false,
    metadataOnly: true,
  }),
  Object.freeze({
    id: "cap-project-execution",
    name: "Project Execution",
    description: "Descriptive registry entry for project execution architecture.",
    domainId: "project-execution",
    phaseId: "OPS-1:2",
    releaseState: "Draft",
    executionRuntime: false,
    metadataOnly: true,
  }),
  Object.freeze({
    id: "cap-resource-intelligence",
    name: "Resource Intelligence",
    description: "Descriptive registry entry for resource-aware execution architecture.",
    domainId: "resource-intelligence",
    phaseId: "OPS-1:2",
    releaseState: "Draft",
    executionRuntime: false,
    metadataOnly: true,
  }),
  Object.freeze({
    id: "cap-scheduling-intelligence",
    name: "Scheduling Intelligence",
    description: "Descriptive registry entry for scheduling architecture.",
    domainId: "scheduling-intelligence",
    phaseId: "OPS-1:2",
    releaseState: "Draft",
    executionRuntime: false,
    metadataOnly: true,
  }),
  Object.freeze({
    id: "cap-monitoring",
    name: "Monitoring",
    description: "Descriptive registry entry for monitoring architecture.",
    domainId: "monitoring",
    phaseId: "OPS-1:2",
    releaseState: "Draft",
    executionRuntime: false,
    metadataOnly: true,
  }),
  Object.freeze({
    id: "cap-automation",
    name: "Automation",
    description: "Descriptive registry entry for automation architecture.",
    domainId: "automation",
    phaseId: "OPS-1:2",
    releaseState: "Draft",
    executionRuntime: false,
    metadataOnly: true,
  }),
  Object.freeze({
    id: "cap-executive-dashboard",
    name: "Executive Dashboard",
    description: "Descriptive registry entry for executive dashboard architecture.",
    domainId: "executive-dashboard",
    phaseId: "OPS-1:2",
    releaseState: "Draft",
    executionRuntime: false,
    metadataOnly: true,
  }),
] as const satisfies readonly ExecutionCapabilityRegistryEntry[]);

export const ExecutionCapabilityRegistryMetadata = Object.freeze({
  registryId: "ops.execution.capability-registry",
  registryVersion: ExecutionPlatformMetadata.compatibilityVersion,
  platformId: ExecutionPlatformMetadata.platformId,
  capabilityCount: ExecutionCapabilityRegistry.length,
  metadataOnly: true,
  immutable: true,
} as const);
