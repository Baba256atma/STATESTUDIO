export type {
  AppDomainBridge as AppDomainBridgeContract,
  AppDomainBridgeManifest,
  AppDomainBridgeState,
  AppDomainBridgeStatus,
  AppDomainBridgeValidation,
  AppDomainCapability,
  AppDomainCompatibilityResult,
  AppDomainConsumerResult,
  AppDomainPlatformInfo,
  AppDomainRegistrySnapshot,
} from "./appDomainBridgeTypes.ts";
export {
  APP_DOMAIN_BRIDGE_IDENTITY,
  APP_DOMAIN_CONSUMED_PLATFORM,
  APP_DOMAIN_CONSUMER_METADATA,
} from "./appDomainBridgeRegistry.ts";
export {
  createAppDomainBridge,
  getAvailableDomains,
  getDomainPlatformCapabilities,
  getDomainPlatformInfo,
  getDomainPlatformRegistry,
  isDomainPlatformCompatible,
  validateAppDomainBridge,
} from "./appDomainBridge.ts";
export { buildAppDomainBridgeManifest } from "./appDomainBridgeManifest.ts";

import {
  createAppDomainBridge,
  getAvailableDomains,
  getDomainPlatformCapabilities,
  getDomainPlatformInfo,
  getDomainPlatformRegistry,
  isDomainPlatformCompatible,
  validateAppDomainBridge,
} from "./appDomainBridge.ts";
import { buildAppDomainBridgeManifest } from "./appDomainBridgeManifest.ts";

export const AppDomainBridge = Object.freeze({
  createAppDomainBridge,
  validateAppDomainBridge,
  getDomainPlatformInfo,
  getDomainPlatformCapabilities,
  getDomainPlatformRegistry,
  getAvailableDomains,
  isDomainPlatformCompatible,
  buildAppDomainBridgeManifest,
});
