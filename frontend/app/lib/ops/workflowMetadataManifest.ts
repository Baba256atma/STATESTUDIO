import { ExecutiveWorkflowIntelligenceFoundation } from "./workflowIntelligenceIndex.ts";
import {
  WorkflowCapabilityRegistry,
  WorkflowCapabilityRegistryMetadata,
} from "./workflowCapabilityRegistry.ts";
import {
  WorkflowConsumerRegistry,
  WorkflowConsumerRegistryMetadata,
} from "./workflowConsumerRegistry.ts";
import {
  WorkflowDependencyRegistry,
  WorkflowDependencyRegistryMetadata,
} from "./workflowDependencyRegistry.ts";
import { WorkflowPlatformMetadata } from "./workflowMetadata.ts";
import {
  WorkflowPublicApiRegistry,
  WorkflowPublicApiRegistryMetadata,
} from "./workflowPublicApiRegistry.ts";

export const buildWorkflowMetadataManifest = () =>
  Object.freeze({
    identity: ExecutiveWorkflowIntelligenceFoundation.identity,
    foundation: ExecutiveWorkflowIntelligenceFoundation,
    metadata: WorkflowPlatformMetadata,
    capabilityRegistry: WorkflowCapabilityRegistry,
    capabilityRegistryMetadata: WorkflowCapabilityRegistryMetadata,
    dependencyRegistry: WorkflowDependencyRegistry,
    dependencyRegistryMetadata: WorkflowDependencyRegistryMetadata,
    consumerRegistry: WorkflowConsumerRegistry,
    consumerRegistryMetadata: WorkflowConsumerRegistryMetadata,
    publicApiRegistry: WorkflowPublicApiRegistry,
    publicApiRegistryMetadata: WorkflowPublicApiRegistryMetadata,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
