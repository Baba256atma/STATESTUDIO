import {
  ExecutionPlatformId,
  ExecutionPlatformIdentity,
  ExecutionPlatformVersion,
} from "./executionIndex.ts";

export interface ExecutionDomainDescriptor {
  readonly id: string;
  readonly name: string;
  readonly description: string;
}

export interface ExecutionPlatformMetadataDescriptor {
  readonly platformId: string;
  readonly platformName: string;
  readonly platformNamespace: string;
  readonly platformVersion: string;
  readonly executionScope: string;
  readonly architectureLevel: string;
  readonly supportedExecutionDomains: readonly ExecutionDomainDescriptor[];
  readonly publicReleaseStatus: string;
  readonly compatibilityVersion: string;
  readonly certificationState: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export const ExecutionSupportedExecutionDomains = Object.freeze([
  Object.freeze({
    id: "task-intelligence",
    name: "Task Intelligence",
    description: "Metadata domain for executive task-oriented operations.",
  }),
  Object.freeze({
    id: "workflow-intelligence",
    name: "Workflow Intelligence",
    description: "Metadata domain for executive workflow coordination.",
  }),
  Object.freeze({
    id: "project-execution",
    name: "Project Execution",
    description: "Metadata domain for executive project delivery structure.",
  }),
  Object.freeze({
    id: "resource-intelligence",
    name: "Resource Intelligence",
    description: "Metadata domain for resource-aware execution architecture.",
  }),
  Object.freeze({
    id: "scheduling-intelligence",
    name: "Scheduling Intelligence",
    description: "Metadata domain for temporal planning and scheduling architecture.",
  }),
  Object.freeze({
    id: "monitoring",
    name: "Monitoring",
    description: "Metadata domain for executive monitoring architecture.",
  }),
  Object.freeze({
    id: "automation",
    name: "Automation",
    description: "Metadata domain for automation architecture boundaries.",
  }),
  Object.freeze({
    id: "executive-dashboard",
    name: "Executive Dashboard",
    description: "Metadata domain for executive operational visibility surfaces.",
  }),
] as const);

export const ExecutionPlatformMetadata = Object.freeze({
  platformId: ExecutionPlatformId,
  platformName: ExecutionPlatformIdentity.platformName,
  platformNamespace: ExecutionPlatformIdentity.platformNamespace,
  platformVersion: ExecutionPlatformVersion,
  executionScope: "Executive Operations Execution Architecture",
  architectureLevel: "OPS Foundation Metadata Layer",
  supportedExecutionDomains: ExecutionSupportedExecutionDomains,
  publicReleaseStatus: "Draft",
  compatibilityVersion: "1.0.0",
  certificationState: "Pending",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutionPlatformMetadataDescriptor);
