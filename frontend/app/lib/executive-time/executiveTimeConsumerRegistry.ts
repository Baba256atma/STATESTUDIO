/**
 * APP-1:9 — Executive Time Consumer Registry.
 * Metadata registry for platform consumers — no runtime behavior changes.
 */

import type { ExecutiveTimePlatformCapabilityKey } from "./executiveTimePlatformApiTypes.ts";
import { EXECUTIVE_TIME_PLATFORM_VERSION } from "./executiveTimePlatformApiTypes.ts";

export const EXECUTIVE_TIME_INTEGRATION_VERSION = "APP-1/9" as const;

export const EXECUTIVE_TIME_MINIMUM_PLATFORM_VERSION = "APP-1/8.5" as const;

export type ExecutiveTimeConsumerId =
  | "dashboard"
  | "assistant"
  | "timeline"
  | "executive_memory"
  | "recommendation"
  | "scenario"
  | "ds"
  | "int"
  | "app"
  | "lay"
  | "audit"
  | "custom";

export type ExecutiveTimeConsumerAccessLevel = "read" | "read_write" | "publisher" | "consumer";

export type ExecutiveTimeConsumerRecord = Readonly<{
  id: ExecutiveTimeConsumerId;
  version: string;
  capabilities: readonly ExecutiveTimePlatformCapabilityKey[];
  accessLevel: ExecutiveTimeConsumerAccessLevel;
  platformVersion: typeof EXECUTIVE_TIME_PLATFORM_VERSION;
  minimumPlatformVersion: typeof EXECUTIVE_TIME_MINIMUM_PLATFORM_VERSION;
  metadata: Readonly<Record<string, unknown>>;
}>;

const DEFAULT_CONSUMER_DEFINITIONS: readonly ExecutiveTimeConsumerRecord[] = Object.freeze([
  Object.freeze({
    id: "dashboard" as const,
    version: "1.0.0",
    capabilities: Object.freeze(["context", "camera", "state", "priority"] as const),
    accessLevel: "read" as const,
    platformVersion: EXECUTIVE_TIME_PLATFORM_VERSION,
    minimumPlatformVersion: EXECUTIVE_TIME_MINIMUM_PLATFORM_VERSION,
    metadata: Object.freeze({ module: "executive-dashboard", runtimeIntegrated: false }),
  }),
  Object.freeze({
    id: "assistant" as const,
    version: "1.0.0",
    capabilities: Object.freeze(["context", "camera", "events", "prediction"] as const),
    accessLevel: "consumer" as const,
    platformVersion: EXECUTIVE_TIME_PLATFORM_VERSION,
    minimumPlatformVersion: EXECUTIVE_TIME_MINIMUM_PLATFORM_VERSION,
    metadata: Object.freeze({ module: "executive-assistant", runtimeIntegrated: false }),
  }),
  Object.freeze({
    id: "timeline" as const,
    version: "1.0.0",
    capabilities: Object.freeze(["context", "camera", "events"] as const),
    accessLevel: "read" as const,
    platformVersion: EXECUTIVE_TIME_PLATFORM_VERSION,
    minimumPlatformVersion: EXECUTIVE_TIME_MINIMUM_PLATFORM_VERSION,
    metadata: Object.freeze({ module: "timeline", runtimeIntegrated: false }),
  }),
  Object.freeze({
    id: "executive_memory" as const,
    version: "1.0.0",
    capabilities: Object.freeze(["context", "state", "events"] as const),
    accessLevel: "consumer" as const,
    platformVersion: EXECUTIVE_TIME_PLATFORM_VERSION,
    minimumPlatformVersion: EXECUTIVE_TIME_MINIMUM_PLATFORM_VERSION,
    metadata: Object.freeze({ module: "executive_memory", runtimeIntegrated: false }),
  }),
  Object.freeze({
    id: "recommendation" as const,
    version: "1.0.0",
    capabilities: Object.freeze(["prediction", "priority"] as const),
    accessLevel: "consumer" as const,
    platformVersion: EXECUTIVE_TIME_PLATFORM_VERSION,
    minimumPlatformVersion: EXECUTIVE_TIME_MINIMUM_PLATFORM_VERSION,
    metadata: Object.freeze({ module: "recommendation", runtimeIntegrated: false }),
  }),
  Object.freeze({
    id: "scenario" as const,
    version: "1.0.0",
    capabilities: Object.freeze(["transition", "state", "events", "prediction"] as const),
    accessLevel: "publisher" as const,
    platformVersion: EXECUTIVE_TIME_PLATFORM_VERSION,
    minimumPlatformVersion: EXECUTIVE_TIME_MINIMUM_PLATFORM_VERSION,
    metadata: Object.freeze({ module: "scenario_intelligence", runtimeIntegrated: false }),
  }),
  Object.freeze({
    id: "ds" as const,
    version: "1.0.0",
    capabilities: Object.freeze(["context", "events"] as const),
    accessLevel: "read" as const,
    platformVersion: EXECUTIVE_TIME_PLATFORM_VERSION,
    minimumPlatformVersion: EXECUTIVE_TIME_MINIMUM_PLATFORM_VERSION,
    metadata: Object.freeze({ module: "ds", runtimeIntegrated: false }),
  }),
  Object.freeze({
    id: "int" as const,
    version: "1.0.0",
    capabilities: Object.freeze(["prediction", "priority", "events"] as const),
    accessLevel: "consumer" as const,
    platformVersion: EXECUTIVE_TIME_PLATFORM_VERSION,
    minimumPlatformVersion: EXECUTIVE_TIME_MINIMUM_PLATFORM_VERSION,
    metadata: Object.freeze({ module: "int", runtimeIntegrated: false }),
  }),
  Object.freeze({
    id: "app" as const,
    version: "1.0.0",
    capabilities: Object.freeze([
      "context",
      "camera",
      "state",
      "transition",
      "priority",
      "events",
      "prediction",
    ] as const),
    accessLevel: "read_write" as const,
    platformVersion: EXECUTIVE_TIME_PLATFORM_VERSION,
    minimumPlatformVersion: EXECUTIVE_TIME_MINIMUM_PLATFORM_VERSION,
    metadata: Object.freeze({ module: "app", runtimeIntegrated: false }),
  }),
  Object.freeze({
    id: "lay" as const,
    version: "1.0.0",
    capabilities: Object.freeze(["context", "camera", "prediction"] as const),
    accessLevel: "consumer" as const,
    platformVersion: EXECUTIVE_TIME_PLATFORM_VERSION,
    minimumPlatformVersion: EXECUTIVE_TIME_MINIMUM_PLATFORM_VERSION,
    metadata: Object.freeze({ module: "lay", runtimeIntegrated: false }),
  }),
  Object.freeze({
    id: "audit" as const,
    version: "1.0.0",
    capabilities: Object.freeze(["events", "state"] as const),
    accessLevel: "read" as const,
    platformVersion: EXECUTIVE_TIME_PLATFORM_VERSION,
    minimumPlatformVersion: EXECUTIVE_TIME_MINIMUM_PLATFORM_VERSION,
    metadata: Object.freeze({ module: "audit", runtimeIntegrated: false }),
  }),
]);

const registry = new Map<ExecutiveTimeConsumerId, ExecutiveTimeConsumerRecord>();

function seedRegistry(): void {
  registry.clear();
  for (const consumer of DEFAULT_CONSUMER_DEFINITIONS) {
    registry.set(consumer.id, consumer);
  }
}

seedRegistry();

export function resetExecutiveTimeConsumerRegistryForTests(): void {
  seedRegistry();
}

export function registerConsumer(record: ExecutiveTimeConsumerRecord): ExecutiveTimeConsumerRecord {
  const frozen = Object.freeze({
    ...record,
    capabilities: Object.freeze([...record.capabilities]),
    metadata: Object.freeze({ ...record.metadata }),
  });
  registry.set(record.id, frozen);
  return frozen;
}

export function getConsumer(consumerId: ExecutiveTimeConsumerId): ExecutiveTimeConsumerRecord | null {
  return registry.get(consumerId) ?? null;
}

export function listConsumers(): readonly ExecutiveTimeConsumerRecord[] {
  return Object.freeze([...registry.values()].map((entry) => Object.freeze(entry)));
}

export function listConsumerIds(): readonly ExecutiveTimeConsumerId[] {
  return Object.freeze([...registry.keys()]);
}

export const ExecutiveTimeConsumerRegistry = Object.freeze({
  registerConsumer,
  getConsumer,
  listConsumers,
  listConsumerIds,
  resetExecutiveTimeConsumerRegistryForTests,
});
