import {
  ExecutiveOperationsPublicIndexId,
} from "./executiveOperationsPublicIndex.ts";
import {
  ProjectExecutionArchitecturalLevel,
  ProjectExecutionIdentity,
  ProjectExecutionPlatformId,
  ProjectExecutionPlatformVersion,
} from "./projectExecutionIndex.ts";

export interface ProjectDomainDescriptor {
  readonly id: string;
  readonly name: string;
  readonly description: string;
}

export interface ProjectPlatformMetadataDescriptor {
  readonly platformId: string;
  readonly platformName: string;
  readonly platformNamespace: string;
  readonly platformVersion: string;
  readonly projectExecutionScope: string;
  readonly architecturalLevel: string;
  readonly supportedProjectDomains: readonly ProjectDomainDescriptor[];
  readonly releaseStatus: string;
  readonly compatibilityVersion: string;
  readonly certificationState: string;
  readonly dependencySource: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export const ProjectSupportedDomains = Object.freeze([
  Object.freeze({
    id: "executive-projects",
    name: "Executive Projects",
    description: "Metadata domain for executive-level project definitions.",
  }),
  Object.freeze({
    id: "operational-projects",
    name: "Operational Projects",
    description: "Metadata domain for operational project definitions.",
  }),
  Object.freeze({
    id: "strategic-projects",
    name: "Strategic Projects",
    description: "Metadata domain for strategic project definitions.",
  }),
  Object.freeze({
    id: "transformation-projects",
    name: "Transformation Projects",
    description: "Metadata domain for transformation project definitions.",
  }),
  Object.freeze({
    id: "program-projects",
    name: "Program Projects",
    description: "Metadata domain for program project definitions.",
  }),
  Object.freeze({
    id: "portfolio-projects",
    name: "Portfolio Projects",
    description: "Metadata domain for portfolio project definitions.",
  }),
  Object.freeze({
    id: "continuous-improvement-projects",
    name: "Continuous Improvement Projects",
    description: "Metadata domain for continuous improvement project definitions.",
  }),
  Object.freeze({
    id: "future-project-extensions",
    name: "Future Project Extensions",
    description: "Metadata domain for future project execution extensions.",
  }),
] as const);

export const ProjectPlatformMetadata = Object.freeze({
  platformId: ProjectExecutionPlatformId,
  platformName: ProjectExecutionIdentity.platformName,
  platformNamespace: ProjectExecutionIdentity.platformNamespace,
  platformVersion: ProjectExecutionPlatformVersion,
  projectExecutionScope: "Executive project execution architecture",
  architecturalLevel: ProjectExecutionArchitecturalLevel,
  supportedProjectDomains: ProjectSupportedDomains,
  releaseStatus: "Draft",
  compatibilityVersion: "1.0.0",
  certificationState: "Pending",
  dependencySource: ExecutiveOperationsPublicIndexId,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ProjectPlatformMetadataDescriptor);

