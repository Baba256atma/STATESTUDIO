export type {
  ExecutiveConnectionBoundary,
  ExecutiveConnectionCapability,
  ExecutiveConnectionCategory,
  ExecutiveConnectionCertification,
  ExecutiveConnectionCompatibility,
  ExecutiveConnectionConsumer,
  ExecutiveConnectionDependency,
  ExecutiveConnectionDirection,
  ExecutiveConnectionIdentity,
  ExecutiveConnectionLifecycle,
  ExecutiveConnectionManifest,
  ExecutiveConnectionMetadata,
  ExecutiveConnectionPayload,
  ExecutiveConnectionPermission,
  ExecutiveConnectionPolicy,
  ExecutiveConnectionProvider,
  ExecutiveConnectionRegistry,
  ExecutiveConnectionResult,
  ExecutiveConnectionSignal,
  ExecutiveConnectionValidation,
  ExecutiveConnectionVersion,
  ExecutiveLayerConnectionContract,
} from "./executiveLayerConnectionTypes.ts";

export {
  EXECUTIVE_CONNECTION_BOUNDARY,
  EXECUTIVE_CONNECTION_CAPABILITIES,
  EXECUTIVE_CONNECTION_CATEGORIES,
  EXECUTIVE_CONNECTION_CONSUMERS,
  EXECUTIVE_CONNECTION_DEPENDENCIES,
  EXECUTIVE_CONNECTION_DIRECTIONS,
  EXECUTIVE_CONNECTION_EXTENSION_POLICY,
  EXECUTIVE_CONNECTION_METADATA,
  EXECUTIVE_CONNECTION_PERMISSION,
  EXECUTIVE_CONNECTION_PROVIDERS,
  EXECUTIVE_CONNECTION_VERSION,
  ExecutiveLayerConnectionContracts,
} from "./executiveLayerConnectionContracts.ts";
export { getExecutiveConnectionCompatibilityMatrix } from "./executiveLayerConnectionCompatibility.ts";
export { buildExecutiveConnectionManifest } from "./executiveLayerConnectionManifest.ts";
export {
  getExecutiveConnectionRegistry,
  listExecutiveConnectionCapabilities,
  listExecutiveConnectionCategories,
  listExecutiveConnectionDirections,
} from "./executiveLayerConnectionRegistry.ts";
export {
  validateExecutiveConnectionManifest,
  validateExecutiveConnectionRegistry,
  validateExecutiveLayerConnection,
} from "./executiveLayerConnectionValidation.ts";

import { getExecutiveConnectionCompatibilityMatrix } from "./executiveLayerConnectionCompatibility.ts";
import { ExecutiveLayerConnectionContracts } from "./executiveLayerConnectionContracts.ts";
import { buildExecutiveConnectionManifest } from "./executiveLayerConnectionManifest.ts";
import {
  getExecutiveConnectionRegistry,
  listExecutiveConnectionCapabilities,
  listExecutiveConnectionCategories,
  listExecutiveConnectionDirections,
} from "./executiveLayerConnectionRegistry.ts";
import {
  validateExecutiveConnectionManifest,
  validateExecutiveConnectionRegistry,
  validateExecutiveLayerConnection,
} from "./executiveLayerConnectionValidation.ts";

export const ExecutiveLayerConnectionContractPlatform = Object.freeze({
  ExecutiveLayerConnectionContracts,
  buildExecutiveConnectionManifest,
  validateExecutiveConnectionManifest,
  validateExecutiveLayerConnection,
  validateExecutiveConnectionRegistry,
  getExecutiveConnectionRegistry,
  getExecutiveConnectionCompatibilityMatrix,
  listExecutiveConnectionCategories,
  listExecutiveConnectionCapabilities,
  listExecutiveConnectionDirections,
});
