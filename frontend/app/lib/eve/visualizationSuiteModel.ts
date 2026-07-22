import {
  VisualizationSuiteModelComposition,
  VisualizationSuiteModelDescriptors,
} from "./visualizationSuiteModelDescriptors.ts";
import { VisualizationSuiteModelInventory } from "./visualizationSuiteModelInventory.ts";
import {
  VisualizationSuiteModelIdentity,
  VisualizationSuiteModelMetadataRecord,
  VisualizationSuiteModelReadiness,
} from "./visualizationSuiteModelMetadata.ts";
import { VisualizationSuiteModelPolicies } from "./visualizationSuiteModelPolicies.ts";
import { VisualizationSuiteModelRelationships } from "./visualizationSuiteModelRelationships.ts";
import { VisualizationSuiteRegistryPlatform } from "./visualizationSuiteRegistry.ts";

export const VisualizationSuiteModelIdentityMetadata =
  VisualizationSuiteModelIdentity;
export const VisualizationSuiteModelReadinessMetadata =
  VisualizationSuiteModelReadiness;
export const VisualizationSuiteModelInventoryMetadata =
  VisualizationSuiteModelInventory;
export const VisualizationSuiteModelMetadata =
  VisualizationSuiteModelMetadataRecord;

export const VisualizationSuiteModelPlatform = Object.freeze({
  metadata: VisualizationSuiteModelMetadata,
  identity: VisualizationSuiteModelIdentityMetadata,
  inventory: VisualizationSuiteModelInventoryMetadata,
  readiness: VisualizationSuiteModelReadinessMetadata,
  registry: VisualizationSuiteRegistryPlatform,
  descriptors: VisualizationSuiteModelDescriptors,
  relationships: VisualizationSuiteModelRelationships,
  composition: VisualizationSuiteModelComposition,
  policies: VisualizationSuiteModelPolicies,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const modelSummary = Object.freeze({
  identity: VisualizationSuiteModelIdentityMetadata,
  status: VisualizationSuiteModelIdentityMetadata.status,
  readiness: VisualizationSuiteModelReadinessMetadata,
  inventory: VisualizationSuiteModelInventoryMetadata,
  registryReference: VisualizationSuiteRegistryPlatform.metadata.id,
  metadataOnly: true,
  immutable: true,
} as const);

export const getVisualizationSuiteModelSummary = () => modelSummary;
export const getVisualizationSuiteModelCount = () =>
  VisualizationSuiteModelDescriptors.length;
export const getVisualizationSuiteModelReleaseMetadata = () =>
  Object.freeze({
    ...VisualizationSuiteModelIdentityMetadata,
    readiness: VisualizationSuiteModelReadinessMetadata.status,
    registryReference: VisualizationSuiteRegistryPlatform.metadata.id,
  });
