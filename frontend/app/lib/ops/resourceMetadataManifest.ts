import { ExecutiveResourceIntelligenceFoundation } from "./resourceIntelligenceIndex.ts";
import {
  ResourceCapabilityRegistry,
  ResourceCapabilityRegistryMetadata,
} from "./resourceCapabilityRegistry.ts";
import {
  ResourceConsumerRegistry,
  ResourceConsumerRegistryMetadata,
} from "./resourceConsumerRegistry.ts";
import {
  ResourceDependencyRegistry,
  ResourceDependencyRegistryMetadata,
} from "./resourceDependencyRegistry.ts";
import { ResourcePlatformMetadata } from "./resourceMetadata.ts";
import {
  ResourcePublicApiRegistry,
  ResourcePublicApiRegistryMetadata,
} from "./resourcePublicApiRegistry.ts";

export const buildResourceMetadataManifest = () =>
  Object.freeze({
    identity: ExecutiveResourceIntelligenceFoundation.identity,
    foundation: ExecutiveResourceIntelligenceFoundation,
    metadata: ResourcePlatformMetadata,
    capabilityRegistry: ResourceCapabilityRegistry,
    capabilityRegistryMetadata: ResourceCapabilityRegistryMetadata,
    dependencyRegistry: ResourceDependencyRegistry,
    dependencyRegistryMetadata: ResourceDependencyRegistryMetadata,
    consumerRegistry: ResourceConsumerRegistry,
    consumerRegistryMetadata: ResourceConsumerRegistryMetadata,
    publicApiRegistry: ResourcePublicApiRegistry,
    publicApiRegistryMetadata: ResourcePublicApiRegistryMetadata,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);

