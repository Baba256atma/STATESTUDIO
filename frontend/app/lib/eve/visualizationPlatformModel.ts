import {
  VisualizationPlatformModelComposition,
  VisualizationPlatformModelDescriptors,
} from "./visualizationPlatformModelDescriptors.ts";
import { VisualizationPlatformModelInventory } from "./visualizationPlatformModelInventory.ts";
import {
  VisualizationPlatformModelIdentity,
  VisualizationPlatformModelMetadataRecord,
  VisualizationPlatformModelReadiness,
} from "./visualizationPlatformModelMetadata.ts";
import { VisualizationPlatformModelPolicies } from "./visualizationPlatformModelPolicies.ts";
import { VisualizationPlatformModelRelationships } from "./visualizationPlatformModelRelationships.ts";
import { VisualizationPlatformRegistryPlatform } from "./visualizationPlatformRegistry.ts";

export const VisualizationPlatformModelIdentityMetadata =
  VisualizationPlatformModelIdentity;
export const VisualizationPlatformModelReadinessMetadata =
  VisualizationPlatformModelReadiness;
export const VisualizationPlatformModelInventoryMetadata =
  VisualizationPlatformModelInventory;
export const VisualizationPlatformModelMetadata =
  VisualizationPlatformModelMetadataRecord;

export const VisualizationPlatformModelPlatform = Object.freeze({
  metadata: VisualizationPlatformModelMetadata,
  identity: VisualizationPlatformModelIdentityMetadata,
  inventory: VisualizationPlatformModelInventoryMetadata,
  readiness: VisualizationPlatformModelReadinessMetadata,
  registry: VisualizationPlatformRegistryPlatform,
  descriptors: VisualizationPlatformModelDescriptors,
  relationships: VisualizationPlatformModelRelationships,
  composition: VisualizationPlatformModelComposition,
  policies: VisualizationPlatformModelPolicies,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const modelSummary = Object.freeze({
  identity: VisualizationPlatformModelIdentityMetadata,
  status: VisualizationPlatformModelIdentityMetadata.status,
  readiness: VisualizationPlatformModelReadinessMetadata,
  inventory: VisualizationPlatformModelInventoryMetadata,
  registryReference: VisualizationPlatformRegistryPlatform.metadata.id,
  metadataOnly: true,
  immutable: true,
} as const);

export const getVisualizationPlatformModelSummary = () => modelSummary;
export const getVisualizationPlatformModelCount = () =>
  VisualizationPlatformModelDescriptors.length;
export const getVisualizationPlatformModelReleaseMetadata = () =>
  Object.freeze({
    ...VisualizationPlatformModelIdentityMetadata,
    readiness: VisualizationPlatformModelReadinessMetadata.status,
    registryReference: VisualizationPlatformRegistryPlatform.metadata.id,
  });
