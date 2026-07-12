import { ExecutionMonitoringCompatibilityVersion, ExecutiveExecutionMonitoringFoundation } from "./executionMonitoringIndex.ts";
import { ExecutiveExecutionMonitoringRegistry } from "./executionMonitoringRegistryIndex.ts";
import { ExecutiveExecutionMonitoringModel } from "./executionMonitoringModelIndex.ts";
import { ExecutionMonitoringValidationRegistry, getExecutionMonitoringValidationSummary } from "./executionMonitoringValidationIndex.ts";
import { ExecutionMonitoringPlatformDependencyMap, ExecutionMonitoringPlatformDependencyMapMetadata } from "./executionMonitoringPlatformDependencyMap.ts";
import type { ExecutionMonitoringManifestDescriptor, ExecutionMonitoringManifestSummary } from "./executionMonitoringManifestTypes.ts";
import { ExecutionMonitoringPlatformPhaseRegistry, ExecutionMonitoringPlatformPhaseRegistryMetadata } from "./executionMonitoringPhaseRegistry.ts";
import { ExecutionMonitoringPlatformPublicSurface, ExecutionMonitoringPlatformPublicSurfaceMetadata } from "./executionMonitoringPublicSurface.ts";

export const buildExecutionMonitoringManifest = () => {
  const validationSummary = getExecutionMonitoringValidationSummary();
  const compatibilityStatus = validationSummary.status;
  return Object.freeze({
    platformIdentity: ExecutiveExecutionMonitoringFoundation.registry,
    foundation: ExecutiveExecutionMonitoringFoundation,
    consumedPhases: Object.freeze(ExecutionMonitoringPlatformPhaseRegistry.map((phase) => phase.phaseId)),
    phaseRegistry: ExecutionMonitoringPlatformPhaseRegistry,
    phaseRegistryMetadata: ExecutionMonitoringPlatformPhaseRegistryMetadata,
    dependencyMap: ExecutionMonitoringPlatformDependencyMap,
    dependencyMapMetadata: ExecutionMonitoringPlatformDependencyMapMetadata,
    publicApiSurface: ExecutionMonitoringPlatformPublicSurface,
    publicApiSurfaceMetadata: ExecutionMonitoringPlatformPublicSurfaceMetadata,
    capabilitySummary: Object.freeze({
      targetCount: ExecutiveExecutionMonitoringRegistry.targets.length,
      stateCount: ExecutiveExecutionMonitoringRegistry.states.length,
      healthCount: ExecutiveExecutionMonitoringRegistry.health.length,
      alertCount: ExecutiveExecutionMonitoringRegistry.alerts.length,
      metricCount: ExecutiveExecutionMonitoringRegistry.metrics.length,
      lifecycleCount: ExecutiveExecutionMonitoringRegistry.lifecycle.length,
      severityCount: ExecutiveExecutionMonitoringRegistry.severity.length,
      metadataOnly: true, immutable: true,
    }),
    modelSummary: ExecutiveExecutionMonitoringModel.summary,
    validationSummary,
    compatibilitySummary: Object.freeze({
      internalDependencyCount: ExecutionMonitoringPlatformDependencyMap.filter((dependency) => dependency.scope === "Internal").length,
      crossPlatformCompatibilityCount: ExecutionMonitoringPlatformDependencyMap.filter((dependency) => dependency.scope === "CrossPlatformCompatibility").length,
      validationRegistryGroupCount: ExecutionMonitoringValidationRegistry.validationGroups.length,
      compatibilityStatus, metadataOnly: true, immutable: true, deterministic: true,
    }),
    monitoringPlatformVersion: ExecutiveExecutionMonitoringFoundation.registry.version,
    releaseReadinessMetadata: Object.freeze({ readinessState: compatibilityStatus === "PASS" ? "Ready" : "Blocked", publicApiStable: true, metadataOnly: true, immutable: true, deterministic: true }),
    deterministicSummary: Object.freeze({ deterministic: true, metadataOnly: true, immutable: true }),
    metadataOnlySummary: Object.freeze({ metadataOnly: true, immutable: true, publicApiStable: true }),
    summary: Object.freeze({
      phaseCount: ExecutionMonitoringPlatformPhaseRegistry.length,
      dependencyCount: ExecutionMonitoringPlatformDependencyMap.length,
      publicApiCount: ExecutionMonitoringPlatformPublicSurface.length,
      compatibilityStatus, metadataOnly: true, immutable: true, deterministic: true,
    } as const satisfies ExecutionMonitoringManifestSummary),
    descriptor: Object.freeze({
      platformId: ExecutiveExecutionMonitoringFoundation.registry.platformId,
      platformName: ExecutiveExecutionMonitoringFoundation.registry.platformName,
      platformVersion: ExecutiveExecutionMonitoringFoundation.registry.version,
      compatibilityVersion: ExecutionMonitoringCompatibilityVersion,
      releaseReadiness: compatibilityStatus === "PASS" ? "Ready" : "Blocked",
      metadataOnly: true, immutable: true, deterministic: true,
    } as const satisfies ExecutionMonitoringManifestDescriptor),
    metadataOnly: true, immutable: true, deterministic: true,
  } as const);
};
