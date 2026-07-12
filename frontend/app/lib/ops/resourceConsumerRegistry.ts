import { ResourcePlatformMetadata } from "./resourceMetadata.ts";

export interface ResourceConsumerRegistryEntry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly accessMode: "PublicApi";
  readonly runtimeBinding: false;
}

export const ResourceConsumerRegistry = Object.freeze([
  Object.freeze({
    id: "consumer-task-intelligence",
    name: "Task Intelligence",
    description: "Task platform consumers of resource intelligence metadata.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
  Object.freeze({
    id: "consumer-workflow-intelligence",
    name: "Workflow Intelligence",
    description: "Workflow platform consumers of resource intelligence metadata.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
  Object.freeze({
    id: "consumer-project-execution",
    name: "Project Execution",
    description: "Project execution platform consumers of resource intelligence metadata.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
  Object.freeze({
    id: "consumer-executive-operations-dashboard",
    name: "Executive Operations Dashboard",
    description: "Executive dashboard consumers of resource intelligence metadata.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
  Object.freeze({
    id: "consumer-advisor",
    name: "Advisor",
    description: "Advisory consumers of resource intelligence metadata.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
  Object.freeze({
    id: "consumer-bus",
    name: "BUS",
    description: "Business intelligence consumers of resource intelligence metadata.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
] as const satisfies readonly ResourceConsumerRegistryEntry[]);

export const ResourceConsumerRegistryMetadata = Object.freeze({
  registryId: "ops.resource-intelligence.consumer-registry",
  registryVersion: ResourcePlatformMetadata.compatibilityVersion,
  consumerCount: ResourceConsumerRegistry.length,
  metadataOnly: true,
  immutable: true,
} as const);

