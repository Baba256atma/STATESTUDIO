import { TaskPlatformMetadata } from "./taskMetadata.ts";

export interface TaskConsumerRegistryEntry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly accessMode: "PublicApi";
  readonly runtimeBinding: false;
}

export const TaskConsumerRegistry = Object.freeze([
  Object.freeze({
    id: "consumer-bus",
    name: "BUS",
    description: "Executive Business Intelligence task consumers.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
  Object.freeze({
    id: "consumer-workflow-intelligence",
    name: "Workflow Intelligence",
    description: "Workflow platform consumers of task intelligence metadata.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
  Object.freeze({
    id: "consumer-project-execution",
    name: "Project Execution",
    description: "Project execution platform consumers of task metadata.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
  Object.freeze({
    id: "consumer-executive-dashboard",
    name: "Executive Dashboard",
    description: "Executive dashboard consumers of task intelligence metadata.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
  Object.freeze({
    id: "consumer-advisor",
    name: "Advisor",
    description: "Advisory consumers of task intelligence metadata.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
  Object.freeze({
    id: "consumer-future-ops-platforms",
    name: "Future OPS Platforms",
    description: "Future OPS platforms extending task intelligence through public metadata.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
] as const satisfies readonly TaskConsumerRegistryEntry[]);

export const TaskConsumerRegistryMetadata = Object.freeze({
  registryId: "ops.task-intelligence.consumer-registry",
  registryVersion: TaskPlatformMetadata.compatibilityVersion,
  consumerCount: TaskConsumerRegistry.length,
  metadataOnly: true,
  immutable: true,
} as const);
