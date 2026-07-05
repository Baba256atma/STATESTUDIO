export type {
  ExecutiveStrategyMonitoring as ExecutiveStrategyMonitoringContract,
  ExecutiveStrategyMonitoringCadence,
  ExecutiveStrategyMonitoringCategory,
  ExecutiveStrategyMonitoringDependency,
  ExecutiveStrategyMonitoringDimension,
  ExecutiveStrategyMonitoringEventType,
  ExecutiveStrategyMonitoringEvidenceReference,
  ExecutiveStrategyMonitoringExtensionPolicy,
  ExecutiveStrategyMonitoringIdentity,
  ExecutiveStrategyMonitoringManifest,
  ExecutiveStrategyMonitoringName,
  ExecutiveStrategyMonitoringPlatform as ExecutiveStrategyMonitoringPlatformContract,
  ExecutiveStrategyMonitoringPlatformDependency,
  ExecutiveStrategyMonitoringProfile,
  ExecutiveStrategyMonitoringPurpose,
  ExecutiveStrategyMonitoringRegistry,
  ExecutiveStrategyMonitoringRelationship,
  ExecutiveStrategyMonitoringRelationshipType,
  ExecutiveStrategyMonitoringScope,
  ExecutiveStrategyMonitoringStatus,
  ExecutiveStrategyMonitoringThresholdDefinition,
  ExecutiveStrategyMonitoringValidation,
} from "./executiveStrategyMonitoringTypes.ts";

export { getExecutiveStrategyMonitoringManifest } from "./executiveStrategyMonitoringManifest.ts";
export {
  EXECUTIVE_STRATEGY_MONITORING_CADENCE_REGISTRY,
  EXECUTIVE_STRATEGY_MONITORING_DEPENDENCIES,
  EXECUTIVE_STRATEGY_MONITORING_DEPENDENCY_REGISTRY,
  EXECUTIVE_STRATEGY_MONITORING_EVENT_REGISTRY,
  EXECUTIVE_STRATEGY_MONITORING_EVIDENCE_REGISTRY,
  EXECUTIVE_STRATEGY_MONITORING_EXTENSION_POLICY,
  EXECUTIVE_STRATEGY_MONITORING_PUBLIC_APIS,
  EXECUTIVE_STRATEGY_MONITORING_REGISTRY,
  EXECUTIVE_STRATEGY_MONITORING_RELATIONSHIPS,
  EXECUTIVE_STRATEGY_MONITORING_THRESHOLD_REGISTRY,
  EXECUTIVE_STRATEGY_MONITORINGS,
  listExecutiveStrategyMonitoringProfiles,
  listExecutiveStrategyMonitoringPublicApis,
} from "./executiveStrategyMonitoringRegistry.ts";

import { getExecutiveStrategyMonitoringManifest } from "./executiveStrategyMonitoringManifest.ts";
import {
  EXECUTIVE_STRATEGY_MONITORING_REGISTRY,
  listExecutiveStrategyMonitoringProfiles,
  listExecutiveStrategyMonitoringPublicApis,
} from "./executiveStrategyMonitoringRegistry.ts";
import type {
  ExecutiveStrategyMonitoringPlatform as ExecutiveStrategyMonitoringPlatformType,
  ExecutiveStrategyMonitoringValidation as ExecutiveStrategyMonitoringValidationType,
} from "./executiveStrategyMonitoringTypes.ts";

function buildBuilderValidation(): ExecutiveStrategyMonitoringValidationType {
  const registry = EXECUTIVE_STRATEGY_MONITORING_REGISTRY;
  const valid =
    registry.platformId === "BUS-24" &&
    registry.monitorings.length > 0 &&
    registry.cadences.length > 0 &&
    registry.events.length > 0 &&
    registry.thresholds.length > 0 &&
    registry.relationships.length > 0 &&
    registry.publicApis.length > 0 &&
    registry.metadataOnly &&
    registry.immutable;

  return Object.freeze({
    valid,
    errors: Object.freeze(valid ? [] : ["builder-registry-validation-failed"]),
    warnings: Object.freeze([]),
  });
}

function validateExecutiveStrategyMonitoringFacade(): ExecutiveStrategyMonitoringValidationType {
  return buildBuilderValidation();
}

export function buildExecutiveStrategyMonitoring(): ExecutiveStrategyMonitoringPlatformType {
  const manifest = getExecutiveStrategyMonitoringManifest();
  return Object.freeze({
    registry: EXECUTIVE_STRATEGY_MONITORING_REGISTRY,
    manifest,
    validation: buildBuilderValidation(),
  });
}

export const ExecutiveStrategyMonitoringPlatform = Object.freeze({
  buildExecutiveStrategyMonitoring,
  validateExecutiveStrategyMonitoring: validateExecutiveStrategyMonitoringFacade,
  getExecutiveStrategyMonitoringManifest,
  listExecutiveStrategyMonitoringProfiles,
  listExecutiveStrategyMonitoringPublicApis,
});
