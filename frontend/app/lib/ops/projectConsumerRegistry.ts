import { ProjectPlatformMetadata } from "./projectMetadata.ts";

export interface ProjectConsumerRegistryEntry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly accessMode: "PublicApi";
  readonly runtimeBinding: false;
}

export const ProjectConsumerRegistry = Object.freeze([
  Object.freeze({
    id: "consumer-task-intelligence",
    name: "Task Intelligence",
    description: "Task platform consumers of project execution metadata.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
  Object.freeze({
    id: "consumer-workflow-intelligence",
    name: "Workflow Intelligence",
    description: "Workflow platform consumers of project execution metadata.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
  Object.freeze({
    id: "consumer-executive-operations-dashboard",
    name: "Executive Operations Dashboard",
    description: "Executive dashboard consumers of project execution metadata.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
  Object.freeze({
    id: "consumer-advisor",
    name: "Advisor",
    description: "Advisory consumers of project execution metadata.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
  Object.freeze({
    id: "consumer-bus",
    name: "BUS",
    description: "Business intelligence consumers of project execution metadata.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
  Object.freeze({
    id: "consumer-future-ops-platforms",
    name: "Future OPS Platforms",
    description: "Future OPS platforms extending project execution through public metadata.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
] as const satisfies readonly ProjectConsumerRegistryEntry[]);

export const ProjectConsumerRegistryMetadata = Object.freeze({
  registryId: "ops.project-execution.consumer-registry",
  registryVersion: ProjectPlatformMetadata.compatibilityVersion,
  consumerCount: ProjectConsumerRegistry.length,
  metadataOnly: true,
  immutable: true,
} as const);

