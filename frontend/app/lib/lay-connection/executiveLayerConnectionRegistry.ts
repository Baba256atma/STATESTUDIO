import {
  EXECUTIVE_CONNECTION_CAPABILITIES,
  EXECUTIVE_CONNECTION_CATEGORIES,
  EXECUTIVE_CONNECTION_CONSUMERS,
  EXECUTIVE_CONNECTION_DEPENDENCIES,
  EXECUTIVE_CONNECTION_DIRECTIONS,
  EXECUTIVE_CONNECTION_EXTENSION_POLICY,
  EXECUTIVE_CONNECTION_METADATA,
  EXECUTIVE_CONNECTION_PROVIDERS,
  EXECUTIVE_CONNECTION_VERSION,
  ExecutiveLayerConnectionContracts,
} from "./executiveLayerConnectionContracts.ts";
import type {
  ExecutiveConnectionCapability,
  ExecutiveConnectionCategory,
  ExecutiveConnectionDirection,
  ExecutiveConnectionRegistry,
} from "./executiveLayerConnectionTypes.ts";

export function getExecutiveConnectionRegistry(): ExecutiveConnectionRegistry {
  return Object.freeze({
    contracts: ExecutiveLayerConnectionContracts,
    categories: EXECUTIVE_CONNECTION_CATEGORIES,
    directions: EXECUTIVE_CONNECTION_DIRECTIONS,
    providers: EXECUTIVE_CONNECTION_PROVIDERS,
    consumers: EXECUTIVE_CONNECTION_CONSUMERS,
    capabilities: EXECUTIVE_CONNECTION_CAPABILITIES,
    dependencies: EXECUTIVE_CONNECTION_DEPENDENCIES,
    version: EXECUTIVE_CONNECTION_VERSION,
    releaseMetadata: EXECUTIVE_CONNECTION_METADATA,
    extensionPolicy: EXECUTIVE_CONNECTION_EXTENSION_POLICY,
  });
}

export function listExecutiveConnectionCategories(): readonly ExecutiveConnectionCategory[] {
  return getExecutiveConnectionRegistry().categories;
}

export function listExecutiveConnectionCapabilities(): readonly ExecutiveConnectionCapability[] {
  return getExecutiveConnectionRegistry().capabilities;
}

export function listExecutiveConnectionDirections(): readonly ExecutiveConnectionDirection[] {
  return getExecutiveConnectionRegistry().directions;
}
