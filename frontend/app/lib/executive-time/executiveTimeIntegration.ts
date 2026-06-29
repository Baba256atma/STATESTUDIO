/**
 * APP-1:9 — Executive Time Integration.
 * Consumer validation, capability discovery, and future integration contracts.
 */

import {
  EXECUTIVE_TIME_PLATFORM_FORBIDDEN_ENGINE_IMPORTS,
  getApiCapabilities,
  getCapabilities,
  getCompatibilityVersion,
  getFutureCapabilities,
  getPlatformVersion,
  getPlatformVersionMetadata,
} from "./executiveTimePlatformApi.ts";
import type { ExecutiveTimePlatformCapabilityKey } from "./executiveTimePlatformApiTypes.ts";
import {
  EXECUTIVE_TIME_INTEGRATION_VERSION,
  getConsumer,
  listConsumers,
  registerConsumer,
  type ExecutiveTimeConsumerId,
} from "./executiveTimeConsumerRegistry.ts";

export const EXECUTIVE_TIME_INTEGRATION_TAGS = Object.freeze([
  "[APP1_9_EXECUTIVE_TIME_INTEGRATION]",
] as const);

export type { ExecutiveTimePlatformPublicOperation } from "./executiveTimeIntegrationResolver.ts";
export { EXECUTIVE_TIME_PLATFORM_PUBLIC_OPERATIONS } from "./executiveTimeIntegrationResolver.ts";

export type ExecutiveTimeIntegrationFutureBinding = Readonly<{
  moduleId: string;
  consumerId: ExecutiveTimeConsumerId;
  bindingImplemented: false;
  mustUsePlatformGateway: true;
  runtimeBehaviorChanged: false;
}>;

export type ExecutiveTimeIntegrationFutureBindings = Readonly<{
  dashboard: ExecutiveTimeIntegrationFutureBinding;
  assistant: ExecutiveTimeIntegrationFutureBinding;
  timeline: ExecutiveTimeIntegrationFutureBinding;
  executiveMemory: ExecutiveTimeIntegrationFutureBinding;
  recommendation: ExecutiveTimeIntegrationFutureBinding;
  scenario: ExecutiveTimeIntegrationFutureBinding;
  ds: ExecutiveTimeIntegrationFutureBinding;
  int: ExecutiveTimeIntegrationFutureBinding;
  app: ExecutiveTimeIntegrationFutureBinding;
  lay: ExecutiveTimeIntegrationFutureBinding;
  audit: ExecutiveTimeIntegrationFutureBinding;
}>;

export const EXECUTIVE_TIME_INTEGRATION_FUTURE_BINDINGS: ExecutiveTimeIntegrationFutureBindings = Object.freeze({
  dashboard: Object.freeze({
    moduleId: "dashboard",
    consumerId: "dashboard",
    bindingImplemented: false,
    mustUsePlatformGateway: true,
    runtimeBehaviorChanged: false,
  }),
  assistant: Object.freeze({
    moduleId: "assistant",
    consumerId: "assistant",
    bindingImplemented: false,
    mustUsePlatformGateway: true,
    runtimeBehaviorChanged: false,
  }),
  timeline: Object.freeze({
    moduleId: "timeline",
    consumerId: "timeline",
    bindingImplemented: false,
    mustUsePlatformGateway: true,
    runtimeBehaviorChanged: false,
  }),
  executiveMemory: Object.freeze({
    moduleId: "executive_memory",
    consumerId: "executive_memory",
    bindingImplemented: false,
    mustUsePlatformGateway: true,
    runtimeBehaviorChanged: false,
  }),
  recommendation: Object.freeze({
    moduleId: "recommendation",
    consumerId: "recommendation",
    bindingImplemented: false,
    mustUsePlatformGateway: true,
    runtimeBehaviorChanged: false,
  }),
  scenario: Object.freeze({
    moduleId: "scenario_intelligence",
    consumerId: "scenario",
    bindingImplemented: false,
    mustUsePlatformGateway: true,
    runtimeBehaviorChanged: false,
  }),
  ds: Object.freeze({
    moduleId: "ds",
    consumerId: "ds",
    bindingImplemented: false,
    mustUsePlatformGateway: true,
    runtimeBehaviorChanged: false,
  }),
  int: Object.freeze({
    moduleId: "int",
    consumerId: "int",
    bindingImplemented: false,
    mustUsePlatformGateway: true,
    runtimeBehaviorChanged: false,
  }),
  app: Object.freeze({
    moduleId: "app",
    consumerId: "app",
    bindingImplemented: false,
    mustUsePlatformGateway: true,
    runtimeBehaviorChanged: false,
  }),
  lay: Object.freeze({
    moduleId: "lay",
    consumerId: "lay",
    bindingImplemented: false,
    mustUsePlatformGateway: true,
    runtimeBehaviorChanged: false,
  }),
  audit: Object.freeze({
    moduleId: "audit",
    consumerId: "audit",
    bindingImplemented: false,
    mustUsePlatformGateway: true,
    runtimeBehaviorChanged: false,
  }),
});

export function getPlatformCapabilities() {
  return getCapabilities();
}

export function getConsumerCapabilities(consumerId: ExecutiveTimeConsumerId): readonly ExecutiveTimePlatformCapabilityKey[] {
  const consumer = getConsumer(consumerId);
  return consumer ? consumer.capabilities : Object.freeze([]);
}

export const ExecutiveTimeIntegration = Object.freeze({
  version: EXECUTIVE_TIME_INTEGRATION_VERSION,
  getPlatformCapabilities,
  getConsumerCapabilities,
  registerConsumer,
  listConsumers,
  getPlatformVersion,
  getCompatibilityVersion,
  getApiCapabilities,
  getFutureCapabilities,
  getPlatformVersionMetadata,
  futureBindings: EXECUTIVE_TIME_INTEGRATION_FUTURE_BINDINGS,
  forbiddenEngineImports: EXECUTIVE_TIME_PLATFORM_FORBIDDEN_ENGINE_IMPORTS,
});

export {
  validateConsumer,
  validateConsumerCapabilities,
  validatePlatformCompatibility,
  validateApiAccess,
  rejectDirectEngineAccess,
  resolveConsumerRequest,
  resolvePlatformService,
  resolveCapability,
  resolveCompatibility,
  resolveSupportedFeatures,
  ExecutiveTimeIntegrationResolver,
} from "./executiveTimeIntegrationResolver.ts";

export { ExecutiveTimePlatformGateway } from "./executiveTimePlatformGateway.ts";

export {
  EXECUTIVE_TIME_INTEGRATION_VERSION,
  ExecutiveTimeConsumerRegistry,
  getConsumer,
  listConsumerIds,
  resetExecutiveTimeConsumerRegistryForTests,
} from "./executiveTimeConsumerRegistry.ts";
