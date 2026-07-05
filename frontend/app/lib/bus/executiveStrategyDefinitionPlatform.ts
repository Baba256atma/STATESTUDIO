export type {
  ExecutiveStrategyDefinition as ExecutiveStrategyDefinitionContract,
  ExecutiveStrategyDefinitionDependency,
  ExecutiveStrategyDefinitionExtensionPolicy,
  ExecutiveStrategyDefinitionManifest,
  ExecutiveStrategyDefinitionPlatform as ExecutiveStrategyDefinitionPlatformContract,
  ExecutiveStrategyDefinitionRegistry,
  ExecutiveStrategyDefinitionValidation,
  ExecutiveStrategyIdentity,
  ExecutiveStrategyMission,
  ExecutiveStrategyName,
  ExecutiveStrategySuccessCriteria,
  ExecutiveStrategicContext,
  ExecutiveStrategicIntent,
  ExecutiveStrategicPurpose,
  ExecutiveStrategicScope,
  ExecutiveStrategyVersion,
  ExecutiveStrategyVision,
} from "./executiveStrategyDefinitionTypes.ts";

export { getExecutiveStrategyDefinitionManifest } from "./executiveStrategyDefinitionManifest.ts";
export {
  EXECUTIVE_STRATEGY_DEFINITION_DEPENDENCIES,
  EXECUTIVE_STRATEGY_DEFINITION_EXTENSION_POLICY,
  EXECUTIVE_STRATEGY_DEFINITION_PUBLIC_APIS,
  EXECUTIVE_STRATEGY_DEFINITION_REGISTRY,
  EXECUTIVE_STRATEGY_DEFINITIONS,
  listExecutiveStrategyDefinitionPublicApis,
  listExecutiveStrategyDefinitions,
} from "./executiveStrategyDefinitionRegistry.ts";
export { validateExecutiveStrategyDefinition } from "./executiveStrategyDefinitionValidation.ts";

import { getExecutiveStrategyDefinitionManifest } from "./executiveStrategyDefinitionManifest.ts";
import {
  EXECUTIVE_STRATEGY_DEFINITION_REGISTRY,
  listExecutiveStrategyDefinitionPublicApis,
  listExecutiveStrategyDefinitions,
} from "./executiveStrategyDefinitionRegistry.ts";
import type { ExecutiveStrategyDefinitionPlatform as ExecutiveStrategyDefinitionPlatformType } from "./executiveStrategyDefinitionTypes.ts";
import { validateExecutiveStrategyDefinition } from "./executiveStrategyDefinitionValidation.ts";

export function buildExecutiveStrategyDefinition(): ExecutiveStrategyDefinitionPlatformType {
  const manifest = getExecutiveStrategyDefinitionManifest();
  return Object.freeze({
    registry: EXECUTIVE_STRATEGY_DEFINITION_REGISTRY,
    manifest,
    validation: validateExecutiveStrategyDefinition(EXECUTIVE_STRATEGY_DEFINITION_REGISTRY, manifest),
  });
}

export const ExecutiveStrategyDefinitionPlatform = Object.freeze({
  buildExecutiveStrategyDefinition,
  validateExecutiveStrategyDefinition,
  getExecutiveStrategyDefinitionManifest,
  listExecutiveStrategyDefinitions,
  listExecutiveStrategyDefinitionPublicApis,
});
