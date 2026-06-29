/**
 * APP-1:10 — Executive Time Platform Freeze Manifest.
 * Immutable release metadata — certification and freeze only.
 */

import { EXECUTIVE_TIME_FOUNDATION_VERSION } from "./executiveTimeContract.ts";
import { EXECUTIVE_TIME_CONTEXT_ENGINE_VERSION } from "./executiveTimeContextResolver.ts";
import { EXECUTIVE_TIME_CAMERA_VERSION } from "./executiveTimeCameraTypes.ts";
import { EXECUTIVE_TIME_STATE_ENGINE_VERSION } from "./executiveTimeStateTypes.ts";
import { EXECUTIVE_TIME_TRANSITION_AUTHORITY_VERSION } from "./executiveTimeTransitionAuthorityTypes.ts";
import { EXECUTIVE_TIME_TRANSITION_ENGINE_VERSION } from "./executiveTimeTransitionResolver.ts";
import { EXECUTIVE_TIME_PRIORITY_AUTHORITY_VERSION } from "./executiveTimePriorityAuthorityTypes.ts";
import { EXECUTIVE_TIME_PRIORITY_ENGINE_VERSION } from "./executiveTimePriorityEvaluation.ts";
import { EXECUTIVE_EVENT_AUTHORITY_VERSION } from "./executiveEventAuthorityTypes.ts";
import { EXECUTIVE_EVENT_ENGINE_VERSION } from "./executiveEventEngineTypes.ts";
import { EXECUTIVE_PREDICTION_AUTHORITY_VERSION } from "./executivePredictionAuthorityTypes.ts";
import { EXECUTIVE_PREDICTION_ENGINE_VERSION } from "./executivePredictionEngineTypes.ts";
import { listConsumerIds } from "./executiveTimeConsumerRegistry.ts";
import { EXECUTIVE_TIME_INTEGRATION_VERSION } from "./executiveTimeConsumerRegistry.ts";
import { EXECUTIVE_TIME_PLATFORM_PUBLIC_OPERATIONS } from "./executiveTimeIntegrationResolver.ts";
import { getApiCapabilities, getCompatibilityVersion, getPlatformVersion } from "./executiveTimePlatformApi.ts";
import {
  EXECUTIVE_TIME_PLATFORM_COMPATIBILITY_VERSION,
  EXECUTIVE_TIME_PLATFORM_VERSION,
} from "./executiveTimePlatformApiTypes.ts";

export const EXECUTIVE_TIME_PLATFORM_FREEZE_VERSION = "APP-1/10" as const;

export const EXECUTIVE_TIME_PLATFORM_STATUS = "FROZEN" as const;

export const EXECUTIVE_TIME_FUTURE_EXTENSION_POLICY = Object.freeze({
  policyId: "APP-1-PLATFORM-EXTENSION",
  rule: "Future enhancements must extend the platform without modifying frozen core architecture.",
  permitted: Object.freeze(["consumer_bindings", "gateway_wrappers", "metadata_extensions"]),
  forbidden: Object.freeze([
    "engine_rewrites",
    "public_api_changes",
    "authority_ownership_changes",
    "direct_engine_consumer_access",
  ]),
});

export type ExecutiveTimePlatformFreezeManifest = Readonly<{
  freezeVersion: typeof EXECUTIVE_TIME_PLATFORM_FREEZE_VERSION;
  platformVersion: typeof EXECUTIVE_TIME_PLATFORM_VERSION;
  integrationVersion: typeof EXECUTIVE_TIME_INTEGRATION_VERSION;
  compatibilityVersion: typeof EXECUTIVE_TIME_PLATFORM_COMPATIBILITY_VERSION;
  certificationDate: string;
  platformStatus: typeof EXECUTIVE_TIME_PLATFORM_STATUS;
  frozenPublicApis: readonly string[];
  frozenContracts: readonly string[];
  frozenEngines: Readonly<Record<string, string>>;
  frozenAuthorityRules: readonly string[];
  futureExtensionPolicy: typeof EXECUTIVE_TIME_FUTURE_EXTENSION_POLICY;
  supportedConsumers: readonly string[];
  supportedCapabilities: readonly string[];
  architectureHash: string;
  metadataOnly: true;
}>;

function buildArchitectureHash(components: Readonly<Record<string, string>>): string {
  const payload = Object.entries(components)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}:${value}`)
    .join("|");
  let hash = 0;
  for (let index = 0; index < payload.length; index += 1) {
    hash = (Math.imul(31, hash) + payload.charCodeAt(index)) >>> 0;
  }
  return `arch-${hash.toString(16).padStart(8, "0")}`;
}

export function buildExecutiveTimePlatformFreezeManifest(certificationDate: string): ExecutiveTimePlatformFreezeManifest {
  const frozenEngines = Object.freeze({
    foundation: EXECUTIVE_TIME_FOUNDATION_VERSION,
    context: EXECUTIVE_TIME_CONTEXT_ENGINE_VERSION,
    camera: EXECUTIVE_TIME_CAMERA_VERSION,
    state: EXECUTIVE_TIME_STATE_ENGINE_VERSION,
    transitionAuthority: EXECUTIVE_TIME_TRANSITION_AUTHORITY_VERSION,
    transition: EXECUTIVE_TIME_TRANSITION_ENGINE_VERSION,
    priorityAuthority: EXECUTIVE_TIME_PRIORITY_AUTHORITY_VERSION,
    priority: EXECUTIVE_TIME_PRIORITY_ENGINE_VERSION,
    eventAuthority: EXECUTIVE_EVENT_AUTHORITY_VERSION,
    event: EXECUTIVE_EVENT_ENGINE_VERSION,
    predictionAuthority: EXECUTIVE_PREDICTION_AUTHORITY_VERSION,
    prediction: EXECUTIVE_PREDICTION_ENGINE_VERSION,
    platform: EXECUTIVE_TIME_PLATFORM_VERSION,
    integration: EXECUTIVE_TIME_INTEGRATION_VERSION,
    freeze: EXECUTIVE_TIME_PLATFORM_FREEZE_VERSION,
  });

  return Object.freeze({
    freezeVersion: EXECUTIVE_TIME_PLATFORM_FREEZE_VERSION,
    platformVersion: getPlatformVersion(),
    integrationVersion: EXECUTIVE_TIME_INTEGRATION_VERSION,
    compatibilityVersion: getCompatibilityVersion(),
    certificationDate,
    platformStatus: EXECUTIVE_TIME_PLATFORM_STATUS,
    frozenPublicApis: Object.freeze([
      "ExecutiveTimePlatform",
      "ExecutiveTimePlatformGateway",
      "ExecutiveTimeIntegration",
      ...EXECUTIVE_TIME_PLATFORM_PUBLIC_OPERATIONS,
    ]),
    frozenContracts: Object.freeze([
      "EXECUTIVE_TIME_PLATFORM_CONSUMER_CONTRACT",
      "executive-time-transition-authority",
      "executive-time-priority-authority",
      "executive-event-authority",
      "executive-prediction-authority",
      "executive-time-platform-gateway",
    ]),
    frozenEngines,
    frozenAuthorityRules: Object.freeze([
      "Context mutation requires camera authority",
      "State mutation requires approved transition authority",
      "Events created only through event engine",
      "Predictions generated only through prediction engine",
      "Conflicts detected only through conflict engine",
      "Consumers must use platform gateway",
    ]),
    futureExtensionPolicy: EXECUTIVE_TIME_FUTURE_EXTENSION_POLICY,
    supportedConsumers: listConsumerIds(),
    supportedCapabilities: getApiCapabilities(),
    architectureHash: buildArchitectureHash(frozenEngines),
    metadataOnly: true,
  });
}

export const ExecutiveTimePlatformFreezeManifestBuilder = Object.freeze({
  buildExecutiveTimePlatformFreezeManifest,
});
