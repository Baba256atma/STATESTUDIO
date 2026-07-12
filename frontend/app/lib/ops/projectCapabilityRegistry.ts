import { ProjectPlatformMetadata } from "./projectMetadata.ts";

export interface ProjectCapabilityRegistryEntry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly domainId: string;
  readonly phaseId: string;
  readonly releaseState: "Draft";
  readonly runtimeBehavior: false;
  readonly metadataOnly: true;
}

export const ProjectCapabilityRegistry = Object.freeze([
  Object.freeze({
    id: "cap-executive-projects",
    name: "Executive Projects",
    description: "Descriptive registry entry for executive project execution.",
    domainId: "executive-projects",
    phaseId: "OPS-4:2",
    releaseState: "Draft",
    runtimeBehavior: false,
    metadataOnly: true,
  }),
  Object.freeze({
    id: "cap-operational-projects",
    name: "Operational Projects",
    description: "Descriptive registry entry for operational project execution.",
    domainId: "operational-projects",
    phaseId: "OPS-4:2",
    releaseState: "Draft",
    runtimeBehavior: false,
    metadataOnly: true,
  }),
  Object.freeze({
    id: "cap-strategic-projects",
    name: "Strategic Projects",
    description: "Descriptive registry entry for strategic project execution.",
    domainId: "strategic-projects",
    phaseId: "OPS-4:2",
    releaseState: "Draft",
    runtimeBehavior: false,
    metadataOnly: true,
  }),
  Object.freeze({
    id: "cap-transformation-projects",
    name: "Transformation Projects",
    description: "Descriptive registry entry for transformation project execution.",
    domainId: "transformation-projects",
    phaseId: "OPS-4:2",
    releaseState: "Draft",
    runtimeBehavior: false,
    metadataOnly: true,
  }),
  Object.freeze({
    id: "cap-program-projects",
    name: "Program Projects",
    description: "Descriptive registry entry for program-scale project execution.",
    domainId: "program-projects",
    phaseId: "OPS-4:2",
    releaseState: "Draft",
    runtimeBehavior: false,
    metadataOnly: true,
  }),
  Object.freeze({
    id: "cap-portfolio-projects",
    name: "Portfolio Projects",
    description: "Descriptive registry entry for portfolio-level project execution.",
    domainId: "portfolio-projects",
    phaseId: "OPS-4:2",
    releaseState: "Draft",
    runtimeBehavior: false,
    metadataOnly: true,
  }),
  Object.freeze({
    id: "cap-continuous-improvement-projects",
    name: "Continuous Improvement Projects",
    description: "Descriptive registry entry for continuous improvement project execution.",
    domainId: "continuous-improvement-projects",
    phaseId: "OPS-4:2",
    releaseState: "Draft",
    runtimeBehavior: false,
    metadataOnly: true,
  }),
  Object.freeze({
    id: "cap-future-project-extensions",
    name: "Future Project Extensions",
    description: "Descriptive registry entry for future project execution extensions.",
    domainId: "future-project-extensions",
    phaseId: "OPS-4:2",
    releaseState: "Draft",
    runtimeBehavior: false,
    metadataOnly: true,
  }),
] as const satisfies readonly ProjectCapabilityRegistryEntry[]);

export const ProjectCapabilityRegistryMetadata = Object.freeze({
  registryId: "ops.project-execution.capability-registry",
  registryVersion: ProjectPlatformMetadata.compatibilityVersion,
  platformId: ProjectPlatformMetadata.platformId,
  capabilityCount: ProjectCapabilityRegistry.length,
  metadataOnly: true,
  immutable: true,
} as const);

