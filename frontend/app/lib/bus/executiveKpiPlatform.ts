export type {
  ExecutiveKpiCapability,
  ExecutiveKpiConsumer,
  ExecutiveKpiDependency,
  ExecutiveKpiExtensionPolicy,
  ExecutiveKpiPlatform as ExecutiveKpiPlatformContract,
  ExecutiveKpiPlatformLifecycle,
  ExecutiveKpiPlatformManifest,
  ExecutiveKpiPlatformRegistry,
  ExecutiveKpiPlatformValidation,
  ExecutiveKpiPublicApi,
  ExecutiveKpiReleaseMetadata,
} from "./executiveKpiPlatformTypes.ts";

export { getExecutiveKpiPlatformManifest } from "./executiveKpiPlatformManifest.ts";
export {
  EXECUTIVE_KPI_CAPABILITIES,
  EXECUTIVE_KPI_DEPENDENCIES,
  EXECUTIVE_KPI_EXTENSION_POLICY,
  EXECUTIVE_KPI_PLATFORM_REGISTRY,
  EXECUTIVE_KPI_PUBLIC_APIS,
  listExecutiveKpiCapabilities,
  listExecutiveKpiPublicApis,
} from "./executiveKpiPlatformRegistry.ts";
export { validateExecutiveKpiPlatform } from "./executiveKpiPlatformValidation.ts";

import { getExecutiveKpiPlatformManifest } from "./executiveKpiPlatformManifest.ts";
import {
  EXECUTIVE_KPI_PLATFORM_REGISTRY,
  listExecutiveKpiCapabilities,
  listExecutiveKpiPublicApis,
} from "./executiveKpiPlatformRegistry.ts";
import { validateExecutiveKpiPlatform } from "./executiveKpiPlatformValidation.ts";
import type { ExecutiveKpiPlatform as ExecutiveKpiPlatformType } from "./executiveKpiPlatformTypes.ts";

export function getExecutiveKpiPlatform(): ExecutiveKpiPlatformType {
  const manifest = getExecutiveKpiPlatformManifest();
  return Object.freeze({
    registry: EXECUTIVE_KPI_PLATFORM_REGISTRY,
    manifest,
    validation: validateExecutiveKpiPlatform(EXECUTIVE_KPI_PLATFORM_REGISTRY, manifest),
  });
}

export const ExecutiveKpiPlatform = Object.freeze({
  getExecutiveKpiPlatform,
  getExecutiveKpiPlatformManifest,
  validateExecutiveKpiPlatform,
  listExecutiveKpiCapabilities,
  listExecutiveKpiPublicApis,
});
