import { ExecutiveSchedulingIntelligenceFoundation } from "./schedulingIntelligenceIndex.ts";
import {
  SchedulingCapabilityRegistry,
  SchedulingCapabilityRegistryMetadata,
} from "./schedulingCapabilityRegistry.ts";
import {
  SchedulingConsumerRegistry,
  SchedulingConsumerRegistryMetadata,
} from "./schedulingConsumerRegistry.ts";
import {
  SchedulingDependencyRegistry,
  SchedulingDependencyRegistryMetadata,
} from "./schedulingDependencyRegistry.ts";
import { SchedulingPlatformMetadata } from "./schedulingMetadata.ts";
import {
  SchedulingPublicApiRegistry,
  SchedulingPublicApiRegistryMetadata,
} from "./schedulingPublicApiRegistry.ts";

export const buildSchedulingMetadataManifest = () =>
  Object.freeze({
    identity: ExecutiveSchedulingIntelligenceFoundation.identity,
    foundation: ExecutiveSchedulingIntelligenceFoundation,
    metadata: SchedulingPlatformMetadata,
    capabilityRegistry: SchedulingCapabilityRegistry,
    capabilityRegistryMetadata: SchedulingCapabilityRegistryMetadata,
    dependencyRegistry: SchedulingDependencyRegistry,
    dependencyRegistryMetadata: SchedulingDependencyRegistryMetadata,
    consumerRegistry: SchedulingConsumerRegistry,
    consumerRegistryMetadata: SchedulingConsumerRegistryMetadata,
    publicApiRegistry: SchedulingPublicApiRegistry,
    publicApiRegistryMetadata: SchedulingPublicApiRegistryMetadata,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
