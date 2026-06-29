/**
 * APP-5:10 — Scenario Timeline Platform Freeze compatibility matrix.
 */

import { SCENARIO_TIMELINE_PLATFORM_COMPATIBILITY_VERSION } from "./scenarioTimelinePlatformFreezeContracts.ts";
import { SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS } from "./scenarioTimelinePlatformConstants.ts";
import { SCENARIO_TIMELINE_FREEZE_RULES } from "./scenarioTimelinePlatformContracts.ts";

export const SCENARIO_TIMELINE_PLATFORM_COMPATIBILITY_MATRIX = Object.freeze({
  compatibilityVersion: SCENARIO_TIMELINE_PLATFORM_COMPATIBILITY_VERSION,
  app2ScenarioIntelligence: Object.freeze({
    compatible: true,
    mustUseScenarioIdentity: true,
    runtimeBehaviorChanged: false,
  }),
  app4ExecutiveMemory: Object.freeze({
    compatible: true,
    readOnlyReferenceOnly: true,
    runtimeBehaviorChanged: false,
  }),
  app5ApiLayer: Object.freeze({
    compatible: true,
    singleIntegrationBoundary: true,
    consumerMustUseApiLayer: true,
    runtimeBehaviorChanged: false,
  }),
  app5AssistantIntegration: Object.freeze({
    compatible: true,
    consumesApiLayerOnly: true,
    runtimeBehaviorChanged: false,
  }),
  app5DashboardIntegration: Object.freeze({
    compatible: true,
    consumesApiLayerOnly: true,
    optionalAssistantContext: true,
    runtimeBehaviorChanged: false,
  }),
  lifecycleVocabulary: Object.freeze({
    compatible: true,
    stageCount: SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS.length,
    frozen: true,
  }),
  backwardCompatibility: Object.freeze({
    guaranteed: true,
    breakingChangesForbidden: SCENARIO_TIMELINE_FREEZE_RULES.breakingChangesForbidden,
    publicInterfacesExtendOnly: SCENARIO_TIMELINE_FREEZE_RULES.publicInterfacesExtendOnly,
  }),
  readOnly: true as const,
});

export function getScenarioTimelinePlatformCompatibility(): typeof SCENARIO_TIMELINE_PLATFORM_COMPATIBILITY_MATRIX {
  return SCENARIO_TIMELINE_PLATFORM_COMPATIBILITY_MATRIX;
}

export const ScenarioTimelinePlatformFreezeCompatibility = Object.freeze({
  getScenarioTimelinePlatformCompatibility,
  matrix: SCENARIO_TIMELINE_PLATFORM_COMPATIBILITY_MATRIX,
});
