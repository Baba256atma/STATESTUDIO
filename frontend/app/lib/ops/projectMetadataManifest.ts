import { ExecutiveProjectExecutionFoundation } from "./projectExecutionIndex.ts";
import {
  ProjectCapabilityRegistry,
  ProjectCapabilityRegistryMetadata,
} from "./projectCapabilityRegistry.ts";
import {
  ProjectConsumerRegistry,
  ProjectConsumerRegistryMetadata,
} from "./projectConsumerRegistry.ts";
import {
  ProjectDependencyRegistry,
  ProjectDependencyRegistryMetadata,
} from "./projectDependencyRegistry.ts";
import { ProjectPlatformMetadata } from "./projectMetadata.ts";
import {
  ProjectPublicApiRegistry,
  ProjectPublicApiRegistryMetadata,
} from "./projectPublicApiRegistry.ts";

export const buildProjectMetadataManifest = () =>
  Object.freeze({
    identity: ExecutiveProjectExecutionFoundation.identity,
    foundation: ExecutiveProjectExecutionFoundation,
    metadata: ProjectPlatformMetadata,
    capabilityRegistry: ProjectCapabilityRegistry,
    capabilityRegistryMetadata: ProjectCapabilityRegistryMetadata,
    dependencyRegistry: ProjectDependencyRegistry,
    dependencyRegistryMetadata: ProjectDependencyRegistryMetadata,
    consumerRegistry: ProjectConsumerRegistry,
    consumerRegistryMetadata: ProjectConsumerRegistryMetadata,
    publicApiRegistry: ProjectPublicApiRegistry,
    publicApiRegistryMetadata: ProjectPublicApiRegistryMetadata,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);

