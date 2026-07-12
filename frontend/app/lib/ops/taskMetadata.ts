import {
  ExecutiveOperationsPublicIndexId,
} from "./executiveOperationsPublicIndex.ts";
import {
  TaskIntelligenceArchitecturalLevel,
  TaskIntelligenceIdentity,
  TaskIntelligencePlatformId,
  TaskIntelligencePlatformVersion,
} from "./taskIntelligenceIndex.ts";

export interface TaskDomainDescriptor {
  readonly id: string;
  readonly name: string;
  readonly description: string;
}

export interface TaskPlatformMetadataDescriptor {
  readonly platformId: string;
  readonly platformName: string;
  readonly platformNamespace: string;
  readonly platformVersion: string;
  readonly taskIntelligenceScope: string;
  readonly architecturalLevel: string;
  readonly supportedTaskDomains: readonly TaskDomainDescriptor[];
  readonly releaseStatus: string;
  readonly compatibilityVersion: string;
  readonly certificationState: string;
  readonly dependencySource: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export const TaskSupportedDomains = Object.freeze([
  Object.freeze({
    id: "executive-tasks",
    name: "Executive Tasks",
    description: "Metadata domain for executive-level task definitions.",
  }),
  Object.freeze({
    id: "operational-tasks",
    name: "Operational Tasks",
    description: "Metadata domain for operational task definitions.",
  }),
  Object.freeze({
    id: "strategic-tasks",
    name: "Strategic Tasks",
    description: "Metadata domain for strategic task definitions.",
  }),
  Object.freeze({
    id: "approval-tasks",
    name: "Approval Tasks",
    description: "Metadata domain for approval-oriented task definitions.",
  }),
  Object.freeze({
    id: "review-tasks",
    name: "Review Tasks",
    description: "Metadata domain for review-oriented task definitions.",
  }),
  Object.freeze({
    id: "manual-tasks",
    name: "Manual Tasks",
    description: "Metadata domain for manual task definitions.",
  }),
  Object.freeze({
    id: "automated-tasks",
    name: "Automated Tasks",
    description: "Metadata domain for automated task definitions.",
  }),
  Object.freeze({
    id: "future-task-extensions",
    name: "Future Task Extensions",
    description: "Metadata domain for future task intelligence extensions.",
  }),
] as const);

export const TaskPlatformMetadata = Object.freeze({
  platformId: TaskIntelligencePlatformId,
  platformName: TaskIntelligenceIdentity.platformName,
  platformNamespace: TaskIntelligenceIdentity.platformNamespace,
  platformVersion: TaskIntelligencePlatformVersion,
  taskIntelligenceScope: "Executive task intelligence architecture",
  architecturalLevel: TaskIntelligenceArchitecturalLevel,
  supportedTaskDomains: TaskSupportedDomains,
  releaseStatus: "Draft",
  compatibilityVersion: "1.0.0",
  certificationState: "Pending",
  dependencySource: ExecutiveOperationsPublicIndexId,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies TaskPlatformMetadataDescriptor);
