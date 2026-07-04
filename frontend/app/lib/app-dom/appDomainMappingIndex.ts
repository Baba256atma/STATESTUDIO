export type {
  AppDomainCapabilityMap,
  AppDomainConsumerSnapshot,
  AppDomainMapping,
  AppDomainMappingManifest,
  AppDomainMappingResult,
  AppDomainMappingValidation,
  AppDomainPackageMap,
  AppDomainPlatformMap,
  AppDomainRegistryMap,
} from "./appDomainMappingTypes.ts";
export {
  buildAppDomainConsumerSnapshot,
  buildAppDomainMapping,
  buildDomainCapabilityMap,
  buildDomainPackageMap,
  buildDomainPlatformMap,
  buildDomainRegistryMap,
  validateAppDomainMapping,
} from "./appDomainMapping.ts";
export {
  buildAppDomainMappingManifest,
  validateAppDomainMappingManifest,
} from "./appDomainMappingManifest.ts";

import {
  buildAppDomainConsumerSnapshot,
  buildAppDomainMapping,
  buildDomainCapabilityMap,
  buildDomainPackageMap,
  buildDomainPlatformMap,
  buildDomainRegistryMap,
  validateAppDomainMapping,
} from "./appDomainMapping.ts";
import {
  buildAppDomainMappingManifest,
  validateAppDomainMappingManifest,
} from "./appDomainMappingManifest.ts";

export const AppDomainMappingLayer = Object.freeze({
  buildDomainCapabilityMap,
  buildDomainRegistryMap,
  buildDomainPackageMap,
  buildDomainPlatformMap,
  buildAppDomainConsumerSnapshot,
  buildAppDomainMapping,
  validateAppDomainMapping,
  buildAppDomainMappingManifest,
  validateAppDomainMappingManifest,
});
