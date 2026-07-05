export type {
  RegistryIntegrity,
  RegistryManifest,
  RegistryMetadata,
  RegistrySnapshot,
  RegistryState,
  RegistryStatistics,
  RegistryValidation,
  RegistryVersion,
  TenantRegistry,
  TenantRegistryEntry,
} from "./coreTenantRegistryTypes.ts";

export { buildExecutiveTenantRegistryManifest } from "./coreTenantRegistryManifest.ts";
export {
  CORE_TENANT_REGISTRY,
  CORE_TENANT_REGISTRY_ENTRIES,
  CORE_TENANT_REGISTRY_INTEGRITY,
  CORE_TENANT_REGISTRY_METADATA,
  CORE_TENANT_REGISTRY_SNAPSHOT,
  CORE_TENANT_REGISTRY_STATISTICS,
} from "./coreTenantRegistry.ts";
export { validateExecutiveTenantRegistry } from "./coreTenantRegistryValidation.ts";

import { buildExecutiveTenantRegistryManifest } from "./coreTenantRegistryManifest.ts";
import {
  CORE_TENANT_REGISTRY,
  CORE_TENANT_REGISTRY_ENTRIES,
  CORE_TENANT_REGISTRY_INTEGRITY,
  CORE_TENANT_REGISTRY_METADATA,
  CORE_TENANT_REGISTRY_SNAPSHOT,
  CORE_TENANT_REGISTRY_STATISTICS,
} from "./coreTenantRegistry.ts";
import { validateExecutiveTenantRegistry } from "./coreTenantRegistryValidation.ts";

export const ExecutiveTenantRegistry = Object.freeze({
  registry: CORE_TENANT_REGISTRY,
  metadata: CORE_TENANT_REGISTRY_METADATA,
  entries: CORE_TENANT_REGISTRY_ENTRIES,
  statistics: CORE_TENANT_REGISTRY_STATISTICS,
  snapshot: CORE_TENANT_REGISTRY_SNAPSHOT,
  integrity: CORE_TENANT_REGISTRY_INTEGRITY,
  buildExecutiveTenantRegistryManifest,
  validateExecutiveTenantRegistry,
});

