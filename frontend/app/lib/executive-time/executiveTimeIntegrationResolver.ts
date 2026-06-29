/**
 * APP-1:9 — Executive Time Integration Resolver.
 * Consumer validation, routing, and platform service resolution.
 */

import {
  getApiCapabilities,
  getCapabilities,
  getCompatibilityVersion,
  getPlatformVersion,
  getPlatformVersionMetadata,
  validatePlatformConsumerAccess,
} from "./executiveTimePlatformApi.ts";
import type { ExecutiveTimePlatformCapabilityKey } from "./executiveTimePlatformApiTypes.ts";
import {
  EXECUTIVE_TIME_MINIMUM_PLATFORM_VERSION,
  getConsumer,
  type ExecutiveTimeConsumerId,
  type ExecutiveTimeConsumerRecord,
} from "./executiveTimeConsumerRegistry.ts";
export type ExecutiveTimePlatformPublicOperation =
  | "getCurrentContext"
  | "switchContext"
  | "getCamera"
  | "moveCamera"
  | "getState"
  | "applyApprovedTransition"
  | "evaluateTransition"
  | "evaluatePriority"
  | "createExecutiveEvent"
  | "resolveEvent"
  | "generatePrediction"
  | "detectConflict";

export const EXECUTIVE_TIME_PLATFORM_PUBLIC_OPERATIONS = Object.freeze([
  "getCurrentContext",
  "switchContext",
  "getCamera",
  "moveCamera",
  "getState",
  "applyApprovedTransition",
  "evaluateTransition",
  "evaluatePriority",
  "createExecutiveEvent",
  "resolveEvent",
  "generatePrediction",
  "detectConflict",
] as const);

export type ExecutiveTimeConsumerValidationResult = Readonly<{
  valid: boolean;
  reason: string;
  consumer: ExecutiveTimeConsumerRecord | null;
}>;

export type ExecutiveTimeConsumerCapabilityValidationResult = Readonly<{
  valid: boolean;
  reason: string;
  missingCapabilities: readonly ExecutiveTimePlatformCapabilityKey[];
}>;

export type ExecutiveTimePlatformCompatibilityValidationResult = Readonly<{
  compatible: boolean;
  reason: string;
  platformVersion: string;
  consumerVersion: string;
}>;

export type ExecutiveTimeApiAccessValidationResult = Readonly<{
  permitted: boolean;
  reason: string;
  directEngineAccessRejected: boolean;
}>;

export type ExecutiveTimeConsumerRequestResult = Readonly<{
  accepted: boolean;
  reason: string;
  consumer: ExecutiveTimeConsumerRecord | null;
  operation: ExecutiveTimePlatformPublicOperation | null;
  capability: ExecutiveTimePlatformCapabilityKey | null;
}>;

export type ExecutiveTimeCompatibilityResult = Readonly<{
  platformVersion: string;
  consumerVersion: string;
  minimumVersion: string;
  compatibilityStatus: "compatible" | "incompatible";
  supportedFeatures: readonly string[];
  futureFeatures: readonly string[];
}>;

const OPERATION_CAPABILITY_MAP: Readonly<Record<ExecutiveTimePlatformPublicOperation, ExecutiveTimePlatformCapabilityKey>> =
  Object.freeze({
    getCurrentContext: "context",
    switchContext: "context",
    getCamera: "camera",
    moveCamera: "camera",
    getState: "state",
    applyApprovedTransition: "state",
    evaluateTransition: "transition",
    evaluatePriority: "priority",
    createExecutiveEvent: "events",
    resolveEvent: "events",
    generatePrediction: "prediction",
    detectConflict: "prediction",
  });

export function validateConsumer(input: {
  consumerId: ExecutiveTimeConsumerId;
}): ExecutiveTimeConsumerValidationResult {
  const consumer = getConsumer(input.consumerId);
  if (!consumer) {
    return Object.freeze({
      valid: false,
      reason: `Unknown consumer "${input.consumerId}".`,
      consumer: null,
    });
  }
  return Object.freeze({
    valid: true,
    reason: "Consumer registered.",
    consumer,
  });
}

export function validateConsumerCapabilities(input: {
  consumerId: ExecutiveTimeConsumerId;
  requiredCapabilities: readonly ExecutiveTimePlatformCapabilityKey[];
}): ExecutiveTimeConsumerCapabilityValidationResult {
  const consumer = getConsumer(input.consumerId);
  if (!consumer) {
    return Object.freeze({
      valid: false,
      reason: `Unknown consumer "${input.consumerId}".`,
      missingCapabilities: Object.freeze([...input.requiredCapabilities]),
    });
  }
  const missing = input.requiredCapabilities.filter(
    (capability) => !consumer.capabilities.includes(capability)
  );
  return Object.freeze({
    valid: missing.length === 0,
    reason:
      missing.length === 0
        ? "Consumer capabilities satisfied."
        : `Consumer lacks capabilities: ${missing.join(", ")}.`,
    missingCapabilities: Object.freeze(missing),
  });
}

export function validatePlatformCompatibility(input: {
  consumerId: ExecutiveTimeConsumerId;
  consumerVersion: string;
}): ExecutiveTimePlatformCompatibilityValidationResult {
  const consumer = getConsumer(input.consumerId);
  const platformVersion = getPlatformVersion();
  if (!consumer) {
    return Object.freeze({
      compatible: false,
      reason: `Unknown consumer "${input.consumerId}".`,
      platformVersion,
      consumerVersion: input.consumerVersion,
    });
  }
  const compatible =
    consumer.minimumPlatformVersion === EXECUTIVE_TIME_MINIMUM_PLATFORM_VERSION &&
    platformVersion >= EXECUTIVE_TIME_MINIMUM_PLATFORM_VERSION;
  return Object.freeze({
    compatible,
    reason: compatible
      ? "Platform version compatible with consumer."
      : "Platform version incompatible with consumer minimum.",
    platformVersion,
    consumerVersion: consumer.version,
  });
}

export function validateApiAccess(input: {
  consumerId: ExecutiveTimeConsumerId;
  operation: ExecutiveTimePlatformPublicOperation;
  importPath?: string;
}): ExecutiveTimeApiAccessValidationResult {
  if (!EXECUTIVE_TIME_PLATFORM_PUBLIC_OPERATIONS.includes(input.operation)) {
    return Object.freeze({
      permitted: false,
      reason: `Operation "${input.operation}" is not a public platform API.`,
      directEngineAccessRejected: false,
    });
  }

  if (input.importPath) {
    const importValidation = validatePlatformConsumerAccess({ importPath: input.importPath });
    if (!importValidation.valid) {
      return Object.freeze({
        permitted: false,
        reason: importValidation.reason,
        directEngineAccessRejected: true,
      });
    }
  }

  const capability = OPERATION_CAPABILITY_MAP[input.operation];
  const capabilityValidation = validateConsumerCapabilities({
    consumerId: input.consumerId,
    requiredCapabilities: Object.freeze([capability]),
  });
  if (!capabilityValidation.valid) {
    return Object.freeze({
      permitted: false,
      reason: capabilityValidation.reason,
      directEngineAccessRejected: false,
    });
  }

  const compatibility = validatePlatformCompatibility({
    consumerId: input.consumerId,
    consumerVersion: getConsumer(input.consumerId)?.version ?? "unknown",
  });
  if (!compatibility.compatible) {
    return Object.freeze({
      permitted: false,
      reason: compatibility.reason,
      directEngineAccessRejected: false,
    });
  }

  return Object.freeze({
    permitted: true,
    reason: "API access permitted through platform gateway.",
    directEngineAccessRejected: false,
  });
}

export function rejectDirectEngineAccess(importPath: string): ExecutiveTimeApiAccessValidationResult {
  const validation = validatePlatformConsumerAccess({ importPath });
  return Object.freeze({
    permitted: validation.valid,
    reason: validation.reason,
    directEngineAccessRejected: validation.bypassDetected,
  });
}

export function resolveCapability(
  consumerId: ExecutiveTimeConsumerId,
  capabilityKey: ExecutiveTimePlatformCapabilityKey
): Readonly<{ supported: boolean; consumer: ExecutiveTimeConsumerRecord | null }> {
  const consumer = getConsumer(consumerId);
  if (!consumer) {
    return Object.freeze({ supported: false, consumer: null });
  }
  return Object.freeze({
    supported: consumer.capabilities.includes(capabilityKey),
    consumer,
  });
}

export function resolveCompatibility(consumerId: ExecutiveTimeConsumerId): ExecutiveTimeCompatibilityResult {
  const consumer = getConsumer(consumerId);
  const compatibility = validatePlatformCompatibility({
    consumerId,
    consumerVersion: consumer?.version ?? "unknown",
  });
  const metadata = getPlatformVersionMetadata();
  return Object.freeze({
    platformVersion: getPlatformVersion(),
    consumerVersion: consumer?.version ?? "unknown",
    minimumVersion: consumer?.minimumPlatformVersion ?? metadata.compatibilityVersion,
    compatibilityStatus: compatibility.compatible ? "compatible" : "incompatible",
    supportedFeatures: Object.freeze(
      consumer ? consumer.capabilities.map((capability) => `${capability}`) : []
    ),
    futureFeatures: metadata.futureCapabilities,
  });
}

export function resolvePlatformService(consumerId: ExecutiveTimeConsumerId): Readonly<{
  available: boolean;
  consumer: ExecutiveTimeConsumerRecord | null;
  platformVersion: string;
  compatibilityVersion: string;
  capabilities: readonly ExecutiveTimePlatformCapabilityKey[];
}> {
  const consumerValidation = validateConsumer({ consumerId });
  const consumer = getConsumer(consumerId);
  return Object.freeze({
    available: consumerValidation.valid,
    consumer,
    platformVersion: getPlatformVersion(),
    compatibilityVersion: getCompatibilityVersion(),
    capabilities: consumer ? consumer.capabilities : Object.freeze([]),
  });
}

export function resolveConsumerRequest(input: {
  consumerId: ExecutiveTimeConsumerId;
  operation: ExecutiveTimePlatformPublicOperation;
  importPath?: string;
}): ExecutiveTimeConsumerRequestResult {
  const consumerValidation = validateConsumer({ consumerId: input.consumerId });
  if (!consumerValidation.valid) {
    return Object.freeze({
      accepted: false,
      reason: consumerValidation.reason,
      consumer: null,
      operation: null,
      capability: null,
    });
  }

  if (input.importPath) {
    const access = validateApiAccess({
      consumerId: input.consumerId,
      operation: input.operation,
      importPath: input.importPath,
    });
    if (!access.permitted) {
      return Object.freeze({
        accepted: false,
        reason: access.reason,
        consumer: getConsumer(input.consumerId),
        operation: input.operation,
        capability: OPERATION_CAPABILITY_MAP[input.operation] ?? null,
      });
    }
  }

  const capability = OPERATION_CAPABILITY_MAP[input.operation];
  const capabilityValidation = validateConsumerCapabilities({
    consumerId: input.consumerId,
    requiredCapabilities: Object.freeze([capability]),
  });
  if (!capabilityValidation.valid) {
    return Object.freeze({
      accepted: false,
      reason: capabilityValidation.reason,
      consumer: getConsumer(input.consumerId),
      operation: input.operation,
      capability,
    });
  }

  const compatibility = validatePlatformCompatibility({
    consumerId: input.consumerId,
    consumerVersion: getConsumer(input.consumerId)!.version,
  });
  if (!compatibility.compatible) {
    return Object.freeze({
      accepted: false,
      reason: compatibility.reason,
      consumer: getConsumer(input.consumerId),
      operation: input.operation,
      capability,
    });
  }

  return Object.freeze({
    accepted: true,
    reason: "Consumer request accepted for platform routing.",
    consumer: getConsumer(input.consumerId),
    operation: input.operation,
    capability,
  });
}

export function resolveSupportedFeatures(consumerId: ExecutiveTimeConsumerId): readonly string[] {
  const consumer = getConsumer(consumerId);
  if (!consumer) return Object.freeze([]);
  const platformCapabilities = getCapabilities();
  return Object.freeze(
    platformCapabilities
      .filter((capability) => consumer.capabilities.includes(capability.key))
      .flatMap((capability) => [...capability.operations])
  );
}

export function listPlatformCapabilityKeys(): readonly ExecutiveTimePlatformCapabilityKey[] {
  return getApiCapabilities();
}

export const ExecutiveTimeIntegrationResolver = Object.freeze({
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
  listPlatformCapabilityKeys,
});
