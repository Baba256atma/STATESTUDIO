export type {
  ExecutiveOkrCapability,
  ExecutiveOkrConsumer,
  ExecutiveOkrDependency,
  ExecutiveOkrExtensionPolicy,
  ExecutiveOkrPlatform as ExecutiveOkrPlatformContract,
  ExecutiveOkrPlatformLifecycle,
  ExecutiveOkrPlatformManifest,
  ExecutiveOkrPlatformRegistry,
  ExecutiveOkrPlatformValidation,
  ExecutiveOkrPublicApi,
  ExecutiveOkrReleaseMetadata,
} from "./executiveOkrPlatformTypes.ts";

export { getExecutiveOkrPlatformManifest } from "./executiveOkrPlatformManifest.ts";
export {
  EXECUTIVE_OKR_CAPABILITIES,
  EXECUTIVE_OKR_DEPENDENCIES,
  EXECUTIVE_OKR_EXTENSION_POLICY,
  EXECUTIVE_OKR_PLATFORM_REGISTRY,
  EXECUTIVE_OKR_PUBLIC_APIS,
  listExecutiveOkrCapabilities,
  listExecutiveOkrPublicApis,
} from "./executiveOkrPlatformRegistry.ts";
export { validateExecutiveOkrPlatform } from "./executiveOkrPlatformValidation.ts";

import { getExecutiveOkrPlatformManifest } from "./executiveOkrPlatformManifest.ts";
import {
  EXECUTIVE_OKR_PLATFORM_REGISTRY,
  listExecutiveOkrCapabilities,
  listExecutiveOkrPublicApis,
} from "./executiveOkrPlatformRegistry.ts";
import type { ExecutiveOkrPlatform as ExecutiveOkrPlatformType } from "./executiveOkrPlatformTypes.ts";
import { validateExecutiveOkrPlatform } from "./executiveOkrPlatformValidation.ts";

export function getExecutiveOkrPlatform(): ExecutiveOkrPlatformType {
  const manifest = getExecutiveOkrPlatformManifest();
  return Object.freeze({
    registry: EXECUTIVE_OKR_PLATFORM_REGISTRY,
    manifest,
    validation: validateExecutiveOkrPlatform(EXECUTIVE_OKR_PLATFORM_REGISTRY, manifest),
  });
}

export const ExecutiveOkrPlatform = Object.freeze({
  getExecutiveOkrPlatform,
  getExecutiveOkrPlatformManifest,
  validateExecutiveOkrPlatform,
  listExecutiveOkrCapabilities,
  listExecutiveOkrPublicApis,
});
