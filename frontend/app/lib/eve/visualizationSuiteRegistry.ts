import { VisualizationSuiteFoundationPlatform } from "./visualizationSuiteFoundation.ts";
import {
  VisualizationSuitePlatformRegistry,
  VisualizationSuiteRegistryCatalog,
  VisualizationSuiteRegistryCategories,
} from "./visualizationSuiteRegistryCatalog.ts";
import { VisualizationSuiteRegistryExtensions } from "./visualizationSuiteRegistryExtensions.ts";
import { VisualizationSuiteRegistryInventory } from "./visualizationSuiteRegistryInventory.ts";
import {
  VisualizationSuiteRegistryIdentity,
  VisualizationSuiteRegistryMetadataRecord,
  VisualizationSuiteRegistryReadiness,
} from "./visualizationSuiteRegistryMetadata.ts";
import { VisualizationSuiteRegistryPolicies } from "./visualizationSuiteRegistryPolicies.ts";

export const VisualizationSuiteRegistryIdentityMetadata =
  VisualizationSuiteRegistryIdentity;
export const VisualizationSuiteRegistryReadinessMetadata =
  VisualizationSuiteRegistryReadiness;
export const VisualizationSuiteRegistryInventoryMetadata =
  VisualizationSuiteRegistryInventory;
export const VisualizationSuiteRegistryMetadata =
  VisualizationSuiteRegistryMetadataRecord;

export const VisualizationSuiteRegistryPlatform = Object.freeze({
  metadata: VisualizationSuiteRegistryMetadata,
  identity: VisualizationSuiteRegistryIdentityMetadata,
  inventory: VisualizationSuiteRegistryInventoryMetadata,
  readiness: VisualizationSuiteRegistryReadinessMetadata,
  foundation: VisualizationSuiteFoundationPlatform,
  catalog: VisualizationSuiteRegistryCatalog,
  collections: VisualizationSuiteRegistryCatalog,
  platforms: VisualizationSuitePlatformRegistry,
  publicIndexes: VisualizationSuitePlatformRegistry,
  categories: VisualizationSuiteRegistryCategories,
  policies: VisualizationSuiteRegistryPolicies,
  extensions: VisualizationSuiteRegistryExtensions,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const registrySummary = Object.freeze({
  identity: VisualizationSuiteRegistryIdentityMetadata,
  status: VisualizationSuiteRegistryIdentityMetadata.status,
  readiness: VisualizationSuiteRegistryReadinessMetadata,
  inventory: VisualizationSuiteRegistryInventoryMetadata,
  foundationReference: VisualizationSuiteFoundationPlatform.metadata.id,
  metadataOnly: true,
  immutable: true,
} as const);

export const getVisualizationSuiteRegistrySummary = () => registrySummary;
export const getVisualizationSuiteRegistryCount = () =>
  VisualizationSuiteRegistryCatalog.length;
export const getVisualizationSuiteRegistryReleaseMetadata = () =>
  Object.freeze({
    ...VisualizationSuiteRegistryIdentityMetadata,
    readiness: VisualizationSuiteRegistryReadinessMetadata.status,
    foundationReference: VisualizationSuiteFoundationPlatform.metadata.id,
  });
