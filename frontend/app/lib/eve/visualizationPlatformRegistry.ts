import {
  VisualizationPlatformModuleRegistry,
  VisualizationPlatformRegistryCatalog,
  VisualizationPlatformRegistryCategories,
} from "./visualizationPlatformRegistryCatalog.ts";
import { VisualizationPlatformRegistryExtensions } from "./visualizationPlatformRegistryExtensions.ts";
import { VisualizationPlatformFoundationPlatform } from "./visualizationPlatformFoundation.ts";
import { VisualizationPlatformRegistryInventory } from "./visualizationPlatformRegistryInventory.ts";
import {
  VisualizationPlatformRegistryIdentity,
  VisualizationPlatformRegistryMetadataRecord,
  VisualizationPlatformRegistryReadiness,
} from "./visualizationPlatformRegistryMetadata.ts";
import { VisualizationPlatformRegistryPolicies } from "./visualizationPlatformRegistryPolicies.ts";

export const VisualizationPlatformRegistryIdentityMetadata =
  VisualizationPlatformRegistryIdentity;
export const VisualizationPlatformRegistryReadinessMetadata =
  VisualizationPlatformRegistryReadiness;
export const VisualizationPlatformRegistryInventoryMetadata =
  VisualizationPlatformRegistryInventory;
export const VisualizationPlatformRegistryMetadata =
  VisualizationPlatformRegistryMetadataRecord;

export const VisualizationPlatformRegistryPlatform = Object.freeze({
  metadata: VisualizationPlatformRegistryMetadata,
  identity: VisualizationPlatformRegistryIdentityMetadata,
  inventory: VisualizationPlatformRegistryInventoryMetadata,
  readiness: VisualizationPlatformRegistryReadinessMetadata,
  foundation: VisualizationPlatformFoundationPlatform,
  catalog: VisualizationPlatformRegistryCatalog,
  collections: VisualizationPlatformRegistryCatalog,
  modules: VisualizationPlatformModuleRegistry,
  categories: VisualizationPlatformRegistryCategories,
  policies: VisualizationPlatformRegistryPolicies,
  extensions: VisualizationPlatformRegistryExtensions,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const registrySummary = Object.freeze({
  identity: VisualizationPlatformRegistryIdentityMetadata,
  status: VisualizationPlatformRegistryIdentityMetadata.status,
  readiness: VisualizationPlatformRegistryReadinessMetadata,
  inventory: VisualizationPlatformRegistryInventoryMetadata,
  foundationReference: VisualizationPlatformFoundationPlatform.metadata.id,
  metadataOnly: true,
  immutable: true,
} as const);

export const getVisualizationPlatformRegistrySummary = () => registrySummary;
export const getVisualizationPlatformRegistryCount = () =>
  VisualizationPlatformRegistryCatalog.length;
export const getVisualizationPlatformRegistryReleaseMetadata = () =>
  Object.freeze({
    ...VisualizationPlatformRegistryIdentityMetadata,
    readiness: VisualizationPlatformRegistryReadinessMetadata.status,
    foundationReference: VisualizationPlatformFoundationPlatform.metadata.id,
  });
