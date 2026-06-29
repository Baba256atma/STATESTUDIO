/**
 * APP-10:9 — Cross-Scenario Learning Platform Freeze compatibility matrix.
 */

import { CROSS_SCENARIO_LEARNING_FREEZE_RULES } from "./crossScenarioLearningContracts.ts";
import { CROSS_SCENARIO_LEARNING_PLATFORM_COMPATIBILITY_VERSION } from "./crossScenarioLearningPlatformFreezeRegistry.ts";

export const CROSS_SCENARIO_LEARNING_PLATFORM_COMPATIBILITY_MATRIX = Object.freeze({
  compatibilityVersion: CROSS_SCENARIO_LEARNING_PLATFORM_COMPATIBILITY_VERSION,
  app10Platform: Object.freeze({
    compatible: true,
    platformId: "cross-scenario-learning-platform",
    runtimeBehaviorChanged: false,
  }),
  app5ScenarioTimeline: Object.freeze({
    compatible: true,
    referenceOnly: true,
    directInternalCouplingForbidden: true,
    facadeOnlyReferenceAllowed: true,
    runtimeBehaviorChanged: false,
  }),
  app6DecisionTimeline: Object.freeze({
    compatible: true,
    referenceOnly: true,
    directInternalCouplingForbidden: true,
    facadeOnlyReferenceAllowed: true,
    runtimeBehaviorChanged: false,
  }),
  app7BusinessTimeline: Object.freeze({
    compatible: true,
    referenceOnly: true,
    directInternalCouplingForbidden: true,
    facadeOnlyReferenceAllowed: true,
    runtimeBehaviorChanged: false,
  }),
  app8DecisionJournal: Object.freeze({
    compatible: true,
    referenceOnly: true,
    directInternalCouplingForbidden: true,
    facadeOnlyReferenceAllowed: true,
    runtimeBehaviorChanged: false,
  }),
  app9ConfidenceEvolution: Object.freeze({
    compatible: true,
    referenceOnly: true,
    directInternalCouplingForbidden: true,
    facadeOnlyReferenceAllowed: true,
    runtimeBehaviorChanged: false,
  }),
  intPlatform: Object.freeze({
    compatible: true,
    readOnlyReferenceOnly: true,
    assistantConsumerReady: true,
    runtimeBehaviorChanged: false,
  }),
  dsPlatform: Object.freeze({
    compatible: true,
    readOnlyReferenceOnly: true,
    metadataOnly: true,
    runtimeBehaviorChanged: false,
  }),
  layPlatform: Object.freeze({
    compatible: true,
    extendOnly: true,
    adapterModulesAllowed: true,
    runtimeBehaviorChanged: false,
  }),
  dashboardConsumer: Object.freeze({
    compatible: true,
    integrationPath: "future APP-10 API facade",
    readOnly: true,
    runtimeBehaviorChanged: false,
  }),
  assistantConsumer: Object.freeze({
    compatible: true,
    integrationPath: "future APP-10 API facade",
    readOnly: true,
    runtimeBehaviorChanged: false,
  }),
  workspaceConsumer: Object.freeze({
    compatible: true,
    integrationPath: "future APP-10 API facade",
    workspaceIsolationRequired: true,
    runtimeBehaviorChanged: false,
  }),
  reportConsumer: Object.freeze({
    compatible: true,
    integrationPath: "future APP-10 API facade",
    readOnly: true,
    runtimeBehaviorChanged: false,
  }),
  backwardCompatibility: Object.freeze({
    guaranteed: true,
    breakingChangesForbidden: CROSS_SCENARIO_LEARNING_FREEZE_RULES.breakingChangesForbidden,
    publicInterfacesExtendOnly: CROSS_SCENARIO_LEARNING_FREEZE_RULES.publicInterfacesExtendOnly,
  }),
  readOnly: true as const,
});

export function getCrossScenarioLearningCompatibility(): typeof CROSS_SCENARIO_LEARNING_PLATFORM_COMPATIBILITY_MATRIX {
  return CROSS_SCENARIO_LEARNING_PLATFORM_COMPATIBILITY_MATRIX;
}

export const CrossScenarioLearningPlatformFreezeCompatibility = Object.freeze({
  getCrossScenarioLearningCompatibility,
  matrix: CROSS_SCENARIO_LEARNING_PLATFORM_COMPATIBILITY_MATRIX,
});
