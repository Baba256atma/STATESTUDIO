import { ExecutiveTaskIntelligenceFoundation } from "./taskIntelligenceIndex.ts";
import {
  TaskCapabilityRegistry,
  TaskCapabilityRegistryMetadata,
} from "./taskCapabilityRegistry.ts";
import {
  TaskConsumerRegistry,
  TaskConsumerRegistryMetadata,
} from "./taskConsumerRegistry.ts";
import {
  TaskDependencyRegistry,
  TaskDependencyRegistryMetadata,
} from "./taskDependencyRegistry.ts";
import { TaskPlatformMetadata } from "./taskMetadata.ts";
import {
  TaskPublicApiRegistry,
  TaskPublicApiRegistryMetadata,
} from "./taskPublicApiRegistry.ts";

export const buildTaskMetadataManifest = () =>
  Object.freeze({
    identity: ExecutiveTaskIntelligenceFoundation.identity,
    foundation: ExecutiveTaskIntelligenceFoundation,
    metadata: TaskPlatformMetadata,
    capabilityRegistry: TaskCapabilityRegistry,
    capabilityRegistryMetadata: TaskCapabilityRegistryMetadata,
    dependencyRegistry: TaskDependencyRegistry,
    dependencyRegistryMetadata: TaskDependencyRegistryMetadata,
    consumerRegistry: TaskConsumerRegistry,
    consumerRegistryMetadata: TaskConsumerRegistryMetadata,
    publicApiRegistry: TaskPublicApiRegistry,
    publicApiRegistryMetadata: TaskPublicApiRegistryMetadata,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
