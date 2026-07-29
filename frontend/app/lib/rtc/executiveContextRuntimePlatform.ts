/**
 * RTC-1:6 — Executive Context Runtime Platform.
 *
 * Canonical Runtime platform surface assembling Manifest into public
 * orchestration contracts. Consumes RTC-1:5 Manifest public surface only.
 * UI-independent. Business-independent. Contracts only.
 *
 * Ownership: owned exclusively by RTC-1:6.
 *
 * Public exports:
 *   ExecutiveContextRuntimePlatformId
 *   ExecutiveContextRuntimePlatformVersion
 *   ExecutiveContextRuntimePlatformName
 *   ExecutiveContextRuntimePlatformNamespace
 *   ExecutiveContextRuntimePlatformStatus
 *   ExecutiveContextRuntimePlatformReadiness
 *   ExecutiveContextRuntimePlatform
 *   getExecutiveContextRuntimePlatformSummary()
 */

import {
  ExecutiveContextPlatformEventChannel,
  ExecutiveContextPlatformEventNames,
  ExecutiveContextPlatformEvents,
} from "./executiveContextPlatformEvents.ts";
import {
  ExecutiveContextPlatformHealth,
  ExecutiveContextPlatformHealthStateNames,
  ExecutiveContextPlatformHealthStates,
} from "./executiveContextPlatformHealth.ts";
import {
  ExecutiveContextPlatformInspection,
  ExecutiveContextPlatformInspectionCategories,
  ExecutiveContextPlatformInspectionCategoryNames,
} from "./executiveContextPlatformInspection.ts";
import {
  ExecutiveContextPlatformLifecycle,
  ExecutiveContextPlatformLifecycleOperationNames,
  ExecutiveContextPlatformLifecycleOperations,
} from "./executiveContextPlatformLifecycle.ts";
import {
  ExecutiveContextPlatformBoundaries,
  ExecutiveContextPlatformConsumers,
  ExecutiveContextPlatformExtensionStrategy,
  ExecutiveContextPlatformGuarantees,
  ExecutiveContextPlatformIdentity,
  ExecutiveContextPlatformMetadata,
  ExecutiveContextPlatformPrinciples,
  ExecutiveContextPlatformResponsibilities,
  ExecutiveContextRuntimePlatformId,
  ExecutiveContextRuntimePlatformName,
  ExecutiveContextRuntimePlatformNamespace,
  ExecutiveContextRuntimePlatformNextPhase,
  ExecutiveContextRuntimePlatformReadiness,
  ExecutiveContextRuntimePlatformStatus,
  ExecutiveContextRuntimePlatformVersion,
} from "./executiveContextPlatformMetadata.ts";
import {
  ExecutiveContextPlatformAccessModel,
  ExecutiveContextPlatformServiceNames,
  ExecutiveContextPlatformServices,
} from "./executiveContextPlatformServices.ts";
import { ExecutiveContextRuntimeManifest } from "./executiveContextRuntimeManifest.ts";

export {
  ExecutiveContextRuntimePlatformId,
  ExecutiveContextRuntimePlatformName,
  ExecutiveContextRuntimePlatformNamespace,
  ExecutiveContextRuntimePlatformReadiness,
  ExecutiveContextRuntimePlatformStatus,
  ExecutiveContextRuntimePlatformVersion,
};

/**
 * Canonical immutable Executive Context Runtime Platform aggregate.
 */
export const ExecutiveContextRuntimePlatform = Object.freeze({
  identity: ExecutiveContextPlatformIdentity,
  manifest: ExecutiveContextRuntimeManifest,
  metadata: ExecutiveContextPlatformMetadata,
  services: ExecutiveContextPlatformServices,
  serviceNames: ExecutiveContextPlatformServiceNames,
  accessModel: ExecutiveContextPlatformAccessModel,
  events: ExecutiveContextPlatformEvents,
  eventNames: ExecutiveContextPlatformEventNames,
  eventChannel: ExecutiveContextPlatformEventChannel,
  lifecycle: ExecutiveContextPlatformLifecycle,
  lifecycleOperations: ExecutiveContextPlatformLifecycleOperations,
  lifecycleOperationNames: ExecutiveContextPlatformLifecycleOperationNames,
  inspection: ExecutiveContextPlatformInspection,
  inspectionCategories: ExecutiveContextPlatformInspectionCategories,
  inspectionCategoryNames: ExecutiveContextPlatformInspectionCategoryNames,
  health: ExecutiveContextPlatformHealth,
  healthStates: ExecutiveContextPlatformHealthStates,
  healthStateNames: ExecutiveContextPlatformHealthStateNames,
  consumers: ExecutiveContextPlatformConsumers,
  guarantees: ExecutiveContextPlatformGuarantees,
  principles: ExecutiveContextPlatformPrinciples,
  boundaries: ExecutiveContextPlatformBoundaries,
  responsibilities: ExecutiveContextPlatformResponsibilities,
  extensionStrategy: ExecutiveContextPlatformExtensionStrategy,
  baselines: Object.freeze({
    platformServices: ExecutiveContextPlatformServices.length,
    lifecycleOperations: ExecutiveContextPlatformLifecycleOperations.length,
    runtimeEvents: ExecutiveContextPlatformEvents.length,
    healthStates: ExecutiveContextPlatformHealthStates.length,
    inspectionCategories: ExecutiveContextPlatformInspectionCategories.length,
    runtimeConsumers: ExecutiveContextPlatformConsumers.length,
    platformGuarantees: ExecutiveContextPlatformGuarantees.length,
  }),
  statistics: Object.freeze({
    serviceCount: ExecutiveContextPlatformServices.length,
    lifecycleOperationCount: ExecutiveContextPlatformLifecycleOperations.length,
    eventCount: ExecutiveContextPlatformEvents.length,
    healthStateCount: ExecutiveContextPlatformHealthStates.length,
    inspectionCategoryCount: ExecutiveContextPlatformInspectionCategories.length,
    consumerCount: ExecutiveContextPlatformConsumers.length,
    guaranteeCount: ExecutiveContextPlatformGuarantees.length,
    principleCount: ExecutiveContextPlatformPrinciples.length,
    boundaryCount: ExecutiveContextPlatformBoundaries.length,
    responsibilityCount: ExecutiveContextPlatformResponsibilities.length,
  }),
  upstreamDependencies: Object.freeze([
    "RTC-1:5 — Executive Context Runtime Manifest",
  ]),
  compositionLayers: Object.freeze([
    "Foundation",
    "Registry",
    "Model",
    "Validation",
    "Manifest",
    "Platform",
  ]),
  status: ExecutiveContextRuntimePlatformStatus,
  readiness: ExecutiveContextRuntimePlatformReadiness,
  nextPhase: ExecutiveContextRuntimePlatformNextPhase,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
  contractsOnly: true as const,
  singleRuntimeEntryPoint: true as const,
  consumersMutateContextDirectly: false as const,
  businessLogicBehavior: false as const,
  aiExecutionBehavior: false as const,
  persistenceBehavior: false as const,
  renderingBehavior: false as const,
  visualTransitionBehavior: false as const,
  workflowExecutionBehavior: false as const,
  externalCommunicationBehavior: false as const,
  kpiCalculationBehavior: false as const,
  scenarioEngineBehavior: false as const,
  decisionEngineBehavior: false as const,
  reactBehavior: false as const,
  nextJsBehavior: false as const,
  eventTransportImplemented: false as const,
  snapshotStorageImplemented: false as const,
  certificationPhase: false as const,
  freezePhase: false as const,
  publicIndexPhase: false as const,
} as const);

/** Deterministic frozen Platform summary. */
export function getExecutiveContextRuntimePlatformSummary() {
  return Object.freeze({
    platformId: ExecutiveContextRuntimePlatformId,
    version: ExecutiveContextRuntimePlatformVersion,
    name: ExecutiveContextRuntimePlatformName,
    namespace: ExecutiveContextRuntimePlatformNamespace,
    status: ExecutiveContextRuntimePlatformStatus,
    readiness: ExecutiveContextRuntimePlatformReadiness,
    serviceCount: ExecutiveContextPlatformServices.length,
    lifecycleOperationCount: ExecutiveContextPlatformLifecycleOperations.length,
    eventCount: ExecutiveContextPlatformEvents.length,
    healthStateCount: ExecutiveContextPlatformHealthStates.length,
    inspectionCategoryCount: ExecutiveContextPlatformInspectionCategories.length,
    consumerCount: ExecutiveContextPlatformConsumers.length,
    guaranteeCount: ExecutiveContextPlatformGuarantees.length,
    nextPhase: ExecutiveContextRuntimePlatformNextPhase,
    sourceManifest: ExecutiveContextPlatformIdentity.sourceManifest,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

export const getExecutiveContextRuntimePlatform = () =>
  ExecutiveContextRuntimePlatform;

export {
  ExecutiveContextPlatformIdentity,
  ExecutiveContextRuntimePlatformNextPhase,
};
