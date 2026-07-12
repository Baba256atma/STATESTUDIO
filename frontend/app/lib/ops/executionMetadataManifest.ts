import { ExecutiveExecutionFoundation } from "./executionIndex.ts";
import {
  ExecutionCapabilityRegistry,
  ExecutionCapabilityRegistryMetadata,
} from "./executionCapabilityRegistry.ts";
import {
  ExecutionConsumerRegistry,
  ExecutionConsumerRegistryMetadata,
} from "./executionConsumerRegistry.ts";
import {
  ExecutionDependencyRegistry,
  ExecutionDependencyRegistryMetadata,
} from "./executionDependencyRegistry.ts";
import { ExecutionPlatformMetadata } from "./executionMetadata.ts";
import {
  ExecutionPublicApiRegistry,
  ExecutionPublicApiRegistryMetadata,
} from "./executionPublicApiRegistry.ts";

export const buildExecutionMetadataManifest = () =>
  Object.freeze({
    identity: ExecutiveExecutionFoundation.identity,
    foundation: ExecutiveExecutionFoundation,
    metadata: ExecutionPlatformMetadata,
    capabilityRegistry: ExecutionCapabilityRegistry,
    capabilityRegistryMetadata: ExecutionCapabilityRegistryMetadata,
    dependencyRegistry: ExecutionDependencyRegistry,
    dependencyRegistryMetadata: ExecutionDependencyRegistryMetadata,
    consumerRegistry: ExecutionConsumerRegistry,
    consumerRegistryMetadata: ExecutionConsumerRegistryMetadata,
    publicApiRegistry: ExecutionPublicApiRegistry,
    publicApiRegistryMetadata: ExecutionPublicApiRegistryMetadata,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
