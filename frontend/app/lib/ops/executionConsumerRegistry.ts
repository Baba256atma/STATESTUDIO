import { ExecutionPlatformMetadata } from "./executionMetadata.ts";

export interface ExecutionConsumerRegistryEntry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly accessMode: "PublicApi";
  readonly runtimeBinding: false;
}

export const ExecutionConsumerRegistry = Object.freeze([
  Object.freeze({
    id: "consumer-bus",
    name: "BUS",
    description: "Executive Business Intelligence platform consumers.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
  Object.freeze({
    id: "consumer-advisor",
    name: "Advisor",
    description: "Executive advisory surfaces consuming execution metadata.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
  Object.freeze({
    id: "consumer-eve",
    name: "EVE",
    description: "Executive orchestration assistant surfaces consuming metadata.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
  Object.freeze({
    id: "consumer-external-connectors",
    name: "External Connectors",
    description: "External integration layers consuming public metadata only.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
  Object.freeze({
    id: "consumer-future-apis",
    name: "Future APIs",
    description: "Future public APIs that depend on stable execution metadata.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
] as const satisfies readonly ExecutionConsumerRegistryEntry[]);

export const ExecutionConsumerRegistryMetadata = Object.freeze({
  registryId: "ops.execution.consumer-registry",
  registryVersion: ExecutionPlatformMetadata.compatibilityVersion,
  consumerCount: ExecutionConsumerRegistry.length,
  metadataOnly: true,
  immutable: true,
} as const);
