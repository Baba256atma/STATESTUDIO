import { ExecutiveOrchestrationCapabilityRegistry } from "./executiveOrchestrationCapabilityRegistry.ts";
import {
  ExecutiveOrchestrationComponentRegistry,
  ExecutiveOrchestrationResponsibilityRegistry,
} from "./executiveOrchestrationComponentRegistry.ts";
import {
  ExecutiveOrchestrationCoordinationRegistry,
  ExecutiveOrchestrationExecutionModeRegistry,
  ExecutiveOrchestrationRoutingRegistry,
} from "./executiveOrchestrationCoordinationRegistry.ts";
import { ExecutiveOrchestrationDependencyRegistry } from "./executiveOrchestrationDependencyRegistry.ts";
import {
  getExecutiveOrchestrationFoundation,
} from "./executiveOrchestrationFoundation.ts";
import { ExecutiveOrchestrationLifecycleRegistry } from "./executiveOrchestrationLifecycleRegistry.ts";
import type {
  ExecutiveOrchestrationRegistryEntry,
  ExecutiveOrchestrationRegistryMetadata,
} from "./executiveOrchestrationRegistryTypes.ts";

const registryMetadata = Object.freeze({
  id: "ENG-8:2",
  name: "Executive Orchestration Registry Platform",
  version: "1.0.0",
  namespace: "nexora.engine.executive.orchestration.registry",
  status: "Stable",
  architectureMode: "MetadataOnly",
  immutability: "DeeplyFrozen",
  runtimeBehavior: "None",
  owner: "ENG-8",
  previousPhase: "ENG-8:1",
  nextPhase: "ENG-8:3",
  readiness: "ReadyForModel",
  metadataOnly: true,
  runtimeFree: true,
  deterministic: true,
  immutable: true,
  deeplyFrozen: true,
  readyForModel: true,
} as const satisfies ExecutiveOrchestrationRegistryMetadata);

const status = Object.freeze({
  stable: "Stable",
  metadataOnly: "MetadataOnly",
  runtimeFree: "RuntimeFree",
  deeplyFrozen: "DeeplyFrozen",
  readyForModel: "ReadyForModel",
} as const);

/**
 * Canonical ENG-8:2 Executive Orchestration Registry Platform.
 * Aggregates ENG-8:1 foundation through its approved public API only.
 */
export const ExecutiveOrchestrationRegistryPlatform = Object.freeze({
  foundation: getExecutiveOrchestrationFoundation(),
  components: ExecutiveOrchestrationComponentRegistry,
  coordinationTargets: ExecutiveOrchestrationCoordinationRegistry,
  capabilities: ExecutiveOrchestrationCapabilityRegistry,
  lifecycle: ExecutiveOrchestrationLifecycleRegistry,
  dependencies: ExecutiveOrchestrationDependencyRegistry,
  responsibilities: ExecutiveOrchestrationResponsibilityRegistry,
  executionModes: ExecutiveOrchestrationExecutionModeRegistry,
  routingRelationships: ExecutiveOrchestrationRoutingRegistry,
  registryMetadata,
  status,
  inventory: Object.freeze({
    componentCount: 12,
    coordinationTargetCount: 9,
    capabilityCount: 8,
    lifecycleStageCount: 8,
    dependencyCount: 10,
    responsibilityCount: 12,
    executionModeCount: 6,
    routingRelationshipCount: 8,
  } as const),
  metadataOnly: true,
  runtimeFree: true,
  deterministic: true,
  immutable: true,
  deeplyFrozen: true,
  readyForModel: true,
} as const);

const registryIndex = Object.freeze(
  Object.fromEntries(
    ([
      ...ExecutiveOrchestrationComponentRegistry,
      ...ExecutiveOrchestrationCoordinationRegistry,
      ...ExecutiveOrchestrationCapabilityRegistry,
      ...ExecutiveOrchestrationLifecycleRegistry,
      ...ExecutiveOrchestrationDependencyRegistry,
      ...ExecutiveOrchestrationResponsibilityRegistry,
      ...ExecutiveOrchestrationExecutionModeRegistry,
      ...ExecutiveOrchestrationRoutingRegistry,
    ] as const).map((entry) => [entry.id, entry]),
  ) as Readonly<Record<string, ExecutiveOrchestrationRegistryEntry | undefined>>,
);

export const getExecutiveOrchestrationRegistryPlatform = () =>
  ExecutiveOrchestrationRegistryPlatform;

export const getExecutiveOrchestrationRegistryEntryById = (
  id: string,
): ExecutiveOrchestrationRegistryEntry | undefined => registryIndex[id];

export {
  ExecutiveOrchestrationCapabilityRegistry,
  ExecutiveOrchestrationComponentRegistry,
  ExecutiveOrchestrationCoordinationRegistry,
  ExecutiveOrchestrationDependencyRegistry,
  ExecutiveOrchestrationLifecycleRegistry,
};
