/**
 * EX-1:6 — Executive Stage Platform.
 *
 * Canonical executable platform surface for the Executive Stage.
 * Runtime Bridge consumes executiveContextRuntimePublicIndex only.
 * No direct imports from Foundation, Registry, Model, Validation, Manifest,
 * Certification, or Freeze. Contracts only — no business/AI logic.
 *
 * Ownership: owned exclusively by EX-1:6.
 *
 * Public exports:
 *   ExecutiveStagePlatformId
 *   ExecutiveStagePlatformVersion
 *   ExecutiveStagePlatformName
 *   ExecutiveStagePlatformNamespace
 *   ExecutiveStagePlatformStatus
 *   ExecutiveStagePlatformReadiness
 *   ExecutiveStagePlatform
 *   getExecutiveStagePlatformSummary()
 *   createStage / initializeStage / attachRuntime / detachRuntime
 *   refreshStage / disposeStage / inspectStage / getPlatformHealth
 */

import { ExecutiveStageEventBus } from "./executiveStageEventBus.ts";
import { ExecutiveStageInspectionService } from "./executiveStageInspectionService.ts";
import { ExecutiveStageLifecycleService } from "./executiveStageLifecycleService.ts";
import {
  ExecutiveStagePlatformGuarantees,
  ExecutiveStagePlatformHealth,
  ExecutiveStagePlatformIdentity,
  ExecutiveStagePlatformId,
  ExecutiveStagePlatformMetadata,
  ExecutiveStagePlatformName,
  ExecutiveStagePlatformNamespace,
  ExecutiveStagePlatformNextPhase,
  ExecutiveStagePlatformPrinciples,
  ExecutiveStagePlatformProhibitedSurfaces,
  ExecutiveStagePlatformPublicApiNames,
  ExecutiveStagePlatformPublicApis,
  ExecutiveStagePlatformReadiness,
  ExecutiveStagePlatformStatus,
  ExecutiveStagePlatformVersion,
  ExecutiveStageInteractionCoordinator,
  ExecutiveStageRenderingCoordinator,
} from "./executiveStagePlatformMetadata.ts";
import {
  ExecutiveStagePlatformServiceCatalog,
  ExecutiveStagePlatformServiceNames,
  ExecutiveStagePlatformServices,
} from "./executiveStagePlatformService.ts";
import { ExecutiveStageRuntimeBridge } from "./executiveStageRuntimeBridge.ts";

export {
  ExecutiveStagePlatformId,
  ExecutiveStagePlatformName,
  ExecutiveStagePlatformNamespace,
  ExecutiveStagePlatformReadiness,
  ExecutiveStagePlatformStatus,
  ExecutiveStagePlatformVersion,
};

const apiContract = (operation: string) =>
  Object.freeze({
    operation,
    platformId: ExecutiveStagePlatformId,
    contractsOnly: true as const,
    executed: false as const,
    ownsRuntimeState: false as const,
    businessLogic: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Stable public Platform API — contracts only. */
export const createStage = () => apiContract("createStage");
export const initializeStage = () => apiContract("initializeStage");
export const attachRuntime = () =>
  Object.freeze({
    ...apiContract("attachRuntime"),
    runtimeDependency: ExecutiveStageRuntimeBridge.runtimeDependency,
    runtimePublicIndexId: ExecutiveStageRuntimeBridge.runtimePublicIndexId,
  });
export const detachRuntime = () => apiContract("detachRuntime");
export const refreshStage = () => apiContract("refreshStage");
export const disposeStage = () => apiContract("disposeStage");
export const inspectStage = () =>
  Object.freeze({
    ...apiContract("inspectStage"),
    readOnly: true as const,
    inspectionCapabilities: ExecutiveStageInspectionService.capabilityCount,
  });
export const getPlatformHealth = () =>
  Object.freeze({
    ...apiContract("getPlatformHealth"),
    healthCategories: ExecutiveStagePlatformHealth.categoryCount,
    interruptsExecution: false as const,
  });

/**
 * Canonical immutable Executive Stage Platform aggregate.
 */
export const ExecutiveStagePlatform = Object.freeze({
  identity: ExecutiveStagePlatformIdentity,
  metadata: ExecutiveStagePlatformMetadata,
  services: ExecutiveStagePlatformServices,
  serviceNames: ExecutiveStagePlatformServiceNames,
  serviceCatalog: ExecutiveStagePlatformServiceCatalog,
  lifecycle: ExecutiveStageLifecycleService,
  lifecycleStates: ExecutiveStageLifecycleService.states,
  lifecycleStateNames: ExecutiveStageLifecycleService.stateNames,
  runtimeBridge: ExecutiveStageRuntimeBridge,
  eventBus: ExecutiveStageEventBus,
  events: ExecutiveStageEventBus.events,
  eventNames: ExecutiveStageEventBus.eventNames,
  inspection: ExecutiveStageInspectionService,
  inspectionCapabilities: ExecutiveStageInspectionService.capabilities,
  health: ExecutiveStagePlatformHealth,
  publicApis: ExecutiveStagePlatformPublicApis,
  publicApiNames: ExecutiveStagePlatformPublicApiNames,
  renderingCoordinator: ExecutiveStageRenderingCoordinator,
  interactionCoordinator: ExecutiveStageInteractionCoordinator,
  principles: ExecutiveStagePlatformPrinciples,
  guarantees: ExecutiveStagePlatformGuarantees,
  prohibitedSurfaces: ExecutiveStagePlatformProhibitedSurfaces,
  api: Object.freeze({
    createStage,
    initializeStage,
    attachRuntime,
    detachRuntime,
    refreshStage,
    disposeStage,
    inspectStage,
    getPlatformHealth,
  }),
  baselines: Object.freeze({
    platformServices: ExecutiveStagePlatformServices.length,
    lifecycleStates: ExecutiveStageLifecycleService.stateCount,
    runtimeBridges: ExecutiveStageRuntimeBridge.bridgeCount,
    eventTypes: ExecutiveStageEventBus.eventCount,
    publicApis: ExecutiveStagePlatformPublicApis.length,
    inspectionCapabilities: ExecutiveStageInspectionService.capabilityCount,
    healthCategories: ExecutiveStagePlatformHealth.categoryCount,
  }),
  statistics: Object.freeze({
    serviceCount: ExecutiveStagePlatformServices.length,
    lifecycleStateCount: ExecutiveStageLifecycleService.stateCount,
    runtimeBridgeCount: ExecutiveStageRuntimeBridge.bridgeCount,
    eventCount: ExecutiveStageEventBus.eventCount,
    publicApiCount: ExecutiveStagePlatformPublicApis.length,
    inspectionCapabilityCount: ExecutiveStageInspectionService.capabilityCount,
    healthCategoryCount: ExecutiveStagePlatformHealth.categoryCount,
    principleCount: ExecutiveStagePlatformPrinciples.length,
    guaranteeCount: ExecutiveStagePlatformGuarantees.length,
  }),
  upstreamDependencies: Object.freeze([
    "EX-1:5 — Executive Stage Manifest",
    "RTC-1:9 — Executive Context Runtime Public Index",
  ]),
  compositionLayers: Object.freeze([
    "Foundation",
    "Registry",
    "Model",
    "Validation",
    "Manifest",
    "Platform",
  ]),
  status: ExecutiveStagePlatformStatus,
  readiness: ExecutiveStagePlatformReadiness,
  nextPhase: ExecutiveStagePlatformNextPhase,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
  contractsOnly: true as const,
  ownsRuntimeState: false as const,
  mutatesRuntime: false as const,
  businessLogicBehavior: false as const,
  aiExecutionBehavior: false as const,
  workspaceOrchestrationBehavior: false as const,
  kpiCalculationBehavior: false as const,
  assistantLogicBehavior: false as const,
  externalCommunicationBehavior: false as const,
  modifiesExecutiveContext: false as const,
  reactBehavior: false as const,
  nextJsBehavior: false as const,
  eventTransportImplemented: false as const,
  renderingAlgorithmsImplemented: false as const,
  certificationPhase: false as const,
  freezePhase: false as const,
  publicIndexPhase: false as const,
} as const);

/** Deterministic frozen Platform summary. */
export function getExecutiveStagePlatformSummary() {
  return Object.freeze({
    platformId: ExecutiveStagePlatformId,
    version: ExecutiveStagePlatformVersion,
    name: ExecutiveStagePlatformName,
    namespace: ExecutiveStagePlatformNamespace,
    status: ExecutiveStagePlatformStatus,
    readiness: ExecutiveStagePlatformReadiness,
    serviceCount: ExecutiveStagePlatformServices.length,
    lifecycleStateCount: ExecutiveStageLifecycleService.stateCount,
    eventCount: ExecutiveStageEventBus.eventCount,
    publicApiCount: ExecutiveStagePlatformPublicApis.length,
    inspectionCapabilityCount: ExecutiveStageInspectionService.capabilityCount,
    healthCategoryCount: ExecutiveStagePlatformHealth.categoryCount,
    runtimeBridgeCount: ExecutiveStageRuntimeBridge.bridgeCount,
    runtimeDependency: ExecutiveStageRuntimeBridge.runtimeDependency,
    baselines: ExecutiveStagePlatform.baselines,
    nextPhase: ExecutiveStagePlatformNextPhase,
    sourceManifest: ExecutiveStagePlatformIdentity.sourceManifest,
    ownsRuntimeState: false as const,
    contractsOnly: true as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

export const getExecutiveStagePlatform = () => ExecutiveStagePlatform;

export {
  ExecutiveStagePlatformIdentity,
  ExecutiveStagePlatformNextPhase,
};
