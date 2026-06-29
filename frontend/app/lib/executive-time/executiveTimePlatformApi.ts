/**
 * APP-1:8.5 — Executive Time Platform API.
 * Single public entry point for the entire Executive Time platform.
 */

import { EXECUTIVE_TIME_FOUNDATION_VERSION } from "./executiveTimeContract.ts";
import { EXECUTIVE_TIME_CONTEXT_ENGINE_VERSION } from "./executiveTimeContextResolver.ts";
import { EXECUTIVE_TIME_CAMERA_VERSION } from "./executiveTimeCameraTypes.ts";
import { EXECUTIVE_TIME_STATE_ENGINE_VERSION } from "./executiveTimeStateTypes.ts";
import { EXECUTIVE_TIME_TRANSITION_ENGINE_VERSION } from "./executiveTimeTransitionResolver.ts";
import { EXECUTIVE_TIME_PRIORITY_ENGINE_VERSION } from "./executiveTimePriorityEvaluation.ts";
import { EXECUTIVE_EVENT_ENGINE_VERSION } from "./executiveEventEngineTypes.ts";
import { EXECUTIVE_PREDICTION_ENGINE_VERSION } from "./executivePredictionEngineTypes.ts";
import { ExecutiveTimePlatform } from "./executiveTimePlatformFacade.ts";
import type {
  ExecutiveTimePlatformCapability,
  ExecutiveTimePlatformCapabilityKey,
  ExecutiveTimePlatformConsumerContract,
  ExecutiveTimePlatformConsumerValidationResult,
  ExecutiveTimePlatformFutureIntegrations,
  ExecutiveTimePlatformVersionMetadata,
} from "./executiveTimePlatformApiTypes.ts";
import {
  EXECUTIVE_TIME_PLATFORM_COMPATIBILITY_VERSION,
  EXECUTIVE_TIME_PLATFORM_OWNER,
  EXECUTIVE_TIME_PLATFORM_VERSION,
} from "./executiveTimePlatformApiTypes.ts";

export { ExecutiveTimePlatform };

export const EXECUTIVE_TIME_PLATFORM_FORBIDDEN_ENGINE_IMPORTS = Object.freeze([
  "executiveTimeContextEngine",
  "executiveTimeCameraEngine",
  "executiveTimeStateEngine",
  "executiveTimeTransitionEngine",
  "executiveTimePriorityEngine",
  "executiveEventEngine",
  "executivePredictionEngine",
  "executiveConflictEngine",
] as const);

export const EXECUTIVE_TIME_PLATFORM_CONSUMER_CONTRACT: ExecutiveTimePlatformConsumerContract = Object.freeze({
  mustUsePlatformApi: true,
  directEngineAccessPermitted: false,
  permittedEntryPoint: "ExecutiveTimePlatform",
  forbiddenImports: EXECUTIVE_TIME_PLATFORM_FORBIDDEN_ENGINE_IMPORTS,
});

export const EXECUTIVE_TIME_PLATFORM_FUTURE_INTEGRATIONS: ExecutiveTimePlatformFutureIntegrations = Object.freeze({
  dashboard: Object.freeze({
    moduleId: "dashboard",
    consumerOnly: true,
    integrationImplemented: false,
    mustUsePlatformApi: true,
  }),
  assistant: Object.freeze({
    moduleId: "assistant",
    consumerOnly: true,
    integrationImplemented: false,
    mustUsePlatformApi: true,
  }),
  timeline: Object.freeze({
    moduleId: "timeline",
    consumerOnly: true,
    integrationImplemented: false,
    mustUsePlatformApi: true,
  }),
  executiveMemory: Object.freeze({
    moduleId: "executive_memory",
    consumerOnly: true,
    integrationImplemented: false,
    mustUsePlatformApi: true,
  }),
  recommendation: Object.freeze({
    moduleId: "recommendation",
    consumerOnly: true,
    integrationImplemented: false,
    mustUsePlatformApi: true,
  }),
  scenario: Object.freeze({
    moduleId: "scenario",
    consumerOnly: true,
    integrationImplemented: false,
    mustUsePlatformApi: true,
  }),
  audit: Object.freeze({
    moduleId: "audit",
    consumerOnly: true,
    integrationImplemented: false,
    mustUsePlatformApi: true,
  }),
  ds: Object.freeze({
    moduleId: "ds",
    consumerOnly: true,
    integrationImplemented: false,
    mustUsePlatformApi: true,
  }),
  int: Object.freeze({
    moduleId: "int",
    consumerOnly: true,
    integrationImplemented: false,
    mustUsePlatformApi: true,
  }),
  app: Object.freeze({
    moduleId: "app",
    consumerOnly: true,
    integrationImplemented: false,
    mustUsePlatformApi: true,
  }),
  lay: Object.freeze({
    moduleId: "lay",
    consumerOnly: true,
    integrationImplemented: false,
    mustUsePlatformApi: true,
  }),
});

const PLATFORM_CAPABILITIES: readonly ExecutiveTimePlatformCapability[] = Object.freeze([
  Object.freeze({
    key: "context" as const,
    label: "Executive Time Context",
    available: true as const,
    operations: Object.freeze(["getCurrentContext", "switchContext"]),
  }),
  Object.freeze({
    key: "camera" as const,
    label: "Executive Time Camera",
    available: true as const,
    operations: Object.freeze(["moveCamera", "getCamera"]),
  }),
  Object.freeze({
    key: "state" as const,
    label: "Executive Time State",
    available: true as const,
    operations: Object.freeze(["getState", "applyApprovedTransition"]),
  }),
  Object.freeze({
    key: "transition" as const,
    label: "Executive Time Transition",
    available: true as const,
    operations: Object.freeze(["evaluateTransition"]),
  }),
  Object.freeze({
    key: "priority" as const,
    label: "Executive Time Priority",
    available: true as const,
    operations: Object.freeze(["evaluatePriority"]),
  }),
  Object.freeze({
    key: "events" as const,
    label: "Executive Events",
    available: true as const,
    operations: Object.freeze(["createExecutiveEvent", "resolveEvent"]),
  }),
  Object.freeze({
    key: "prediction" as const,
    label: "Executive Prediction & Conflict",
    available: true as const,
    operations: Object.freeze(["generatePrediction", "detectConflict"]),
  }),
]);

export const EXECUTIVE_TIME_PLATFORM_FUTURE_CAPABILITIES = Object.freeze([
  "unified_timeline_projection",
  "executive_memory_replay",
  "scenario_time_simulation",
  "recommendation_time_hints",
  "audit_time_trail",
  "lay_time_overlay",
] as const);

export function getEngineVersions() {
  return Object.freeze({
    foundation: EXECUTIVE_TIME_FOUNDATION_VERSION,
    context: EXECUTIVE_TIME_CONTEXT_ENGINE_VERSION,
    camera: EXECUTIVE_TIME_CAMERA_VERSION,
    state: EXECUTIVE_TIME_STATE_ENGINE_VERSION,
    transition: EXECUTIVE_TIME_TRANSITION_ENGINE_VERSION,
    priority: EXECUTIVE_TIME_PRIORITY_ENGINE_VERSION,
    event: EXECUTIVE_EVENT_ENGINE_VERSION,
    prediction: EXECUTIVE_PREDICTION_ENGINE_VERSION,
    platform: EXECUTIVE_TIME_PLATFORM_VERSION,
  });
}

export function getPlatformVersion(): typeof EXECUTIVE_TIME_PLATFORM_VERSION {
  return EXECUTIVE_TIME_PLATFORM_VERSION;
}

export function getCompatibilityVersion(): typeof EXECUTIVE_TIME_PLATFORM_COMPATIBILITY_VERSION {
  return EXECUTIVE_TIME_PLATFORM_COMPATIBILITY_VERSION;
}

export function getApiCapabilities(): readonly ExecutiveTimePlatformCapabilityKey[] {
  return Object.freeze(PLATFORM_CAPABILITIES.map((capability) => capability.key));
}

export function getFutureCapabilities(): readonly string[] {
  return EXECUTIVE_TIME_PLATFORM_FUTURE_CAPABILITIES;
}

export function getCapabilities(): readonly ExecutiveTimePlatformCapability[] {
  return PLATFORM_CAPABILITIES;
}

export function getPlatformVersionMetadata(): ExecutiveTimePlatformVersionMetadata {
  return Object.freeze({
    platformVersion: EXECUTIVE_TIME_PLATFORM_VERSION,
    compatibilityVersion: EXECUTIVE_TIME_PLATFORM_COMPATIBILITY_VERSION,
    engineVersions: getEngineVersions(),
    apiCapabilities: getApiCapabilities(),
    futureCapabilities: getFutureCapabilities(),
    metadataOnly: true,
    owner: EXECUTIVE_TIME_PLATFORM_OWNER,
  });
}

export function validatePlatformConsumerAccess(input: {
  importPath: string;
}): ExecutiveTimePlatformConsumerValidationResult {
  const normalized = input.importPath.trim().toLowerCase();
  const bypassDetected = EXECUTIVE_TIME_PLATFORM_FORBIDDEN_ENGINE_IMPORTS.some((fragment) =>
    normalized.includes(fragment.toLowerCase())
  );
  return Object.freeze({
    valid: !bypassDetected,
    bypassDetected,
    reason: bypassDetected
      ? "Direct engine import forbidden — use ExecutiveTimePlatform from executiveTimePlatformApi."
      : "Consumer import path permitted.",
  });
}

export const ExecutiveTimePlatformApi = Object.freeze({
  platform: ExecutiveTimePlatform,
  getPlatformVersion,
  getEngineVersions,
  getCompatibilityVersion,
  getApiCapabilities,
  getFutureCapabilities,
  getCapabilities,
  getPlatformVersionMetadata,
  validatePlatformConsumerAccess,
  consumerContract: EXECUTIVE_TIME_PLATFORM_CONSUMER_CONTRACT,
  futureIntegrations: EXECUTIVE_TIME_PLATFORM_FUTURE_INTEGRATIONS,
});
