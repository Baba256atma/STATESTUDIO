export type {
  ExecutiveStrategy as ExecutiveStrategyContract,
  ExecutiveStrategicAssumption,
  ExecutiveStrategicConstraint,
  ExecutiveStrategicDependency,
  ExecutiveStrategicInitiative,
  ExecutiveStrategicKpiReference,
  ExecutiveStrategicMilestone,
  ExecutiveStrategicObjective,
  ExecutiveStrategicOkrReference,
  ExecutiveStrategyOwner,
  ExecutiveStrategicOpportunity,
  ExecutiveStrategicPillar,
  ExecutiveStrategicProgram,
  ExecutiveStrategicRiskReference,
  ExecutiveStrategicRoadmap,
  ExecutiveStrategyCategory,
  ExecutiveStrategyCompatibility,
  ExecutiveStrategyConsumer,
  ExecutiveStrategyDependency,
  ExecutiveStrategyEntityDefinition,
  ExecutiveStrategyExtensionPolicy,
  ExecutiveStrategyHorizon,
  ExecutiveStrategyLifecycle,
  ExecutiveStrategyMetadata,
  ExecutiveStrategyPlatform as ExecutiveStrategyPlatformContract,
  ExecutiveStrategyPlatformIdentity,
  ExecutiveStrategyPlatformManifest,
  ExecutiveStrategyPlatformRegistry,
  ExecutiveStrategyPlatformValidation,
  ExecutiveStrategyPriority,
  ExecutiveStrategyPublicApi,
  ExecutiveStrategyReleaseMetadata,
  ExecutiveStrategyStakeholder,
  ExecutiveStrategyStatus,
  ExecutiveStrategicTheme,
} from "./executiveStrategyTypes.ts";

export { getExecutiveStrategyManifest } from "./executiveStrategyManifest.ts";
export {
  EXECUTIVE_STRATEGY_COMPATIBILITY,
  EXECUTIVE_STRATEGY_CONSUMERS,
  EXECUTIVE_STRATEGY_DEPENDENCIES,
  EXECUTIVE_STRATEGY_ENTITY_REGISTRY,
  EXECUTIVE_STRATEGY_EXTENSION_POLICY,
  EXECUTIVE_STRATEGY_LIFECYCLE_REGISTRY,
  EXECUTIVE_STRATEGY_PLATFORM_IDENTITY,
  EXECUTIVE_STRATEGY_PLATFORM_REGISTRY,
  EXECUTIVE_STRATEGY_PRIORITY_REGISTRY,
  EXECUTIVE_STRATEGY_PUBLIC_APIS,
  EXECUTIVE_STRATEGY_RELEASE_METADATA,
  EXECUTIVE_STRATEGY_STATUS_REGISTRY,
  EXECUTIVE_STRATEGY_TYPE_REGISTRY,
  listExecutiveStrategyEntities,
  listExecutiveStrategyPublicApis,
} from "./executiveStrategyRegistry.ts";
export { validateExecutiveStrategyPlatform } from "./executiveStrategyValidation.ts";

import { getExecutiveStrategyManifest } from "./executiveStrategyManifest.ts";
import {
  EXECUTIVE_STRATEGY_PLATFORM_REGISTRY,
  listExecutiveStrategyEntities,
  listExecutiveStrategyPublicApis,
} from "./executiveStrategyRegistry.ts";
import type { ExecutiveStrategyPlatform as ExecutiveStrategyPlatformType } from "./executiveStrategyTypes.ts";
import { validateExecutiveStrategyPlatform } from "./executiveStrategyValidation.ts";

export function getExecutiveStrategyPlatform(): ExecutiveStrategyPlatformType {
  const manifest = getExecutiveStrategyManifest();
  return Object.freeze({
    registry: EXECUTIVE_STRATEGY_PLATFORM_REGISTRY,
    manifest,
    validation: validateExecutiveStrategyPlatform(EXECUTIVE_STRATEGY_PLATFORM_REGISTRY, manifest),
  });
}

export const ExecutiveStrategyFoundation = Object.freeze({
  getExecutiveStrategyPlatform,
  getExecutiveStrategyManifest,
  validateExecutiveStrategyPlatform,
  listExecutiveStrategyEntities,
  listExecutiveStrategyPublicApis,
});
