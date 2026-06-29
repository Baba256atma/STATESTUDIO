/**
 * APP-11:8 — Executive Inbox Platform Freeze compatibility matrix.
 */

import { EXECUTIVE_INBOX_FREEZE_RULES } from "./executiveInboxContracts.ts";
import { EXECUTIVE_INBOX_PLATFORM_COMPATIBILITY_VERSION } from "./executiveInboxPlatformFreezeRegistry.ts";

export const EXECUTIVE_INBOX_PLATFORM_COMPATIBILITY_MATRIX = Object.freeze({
  compatibilityVersion: EXECUTIVE_INBOX_PLATFORM_COMPATIBILITY_VERSION,
  app11Platform: Object.freeze({
    compatible: true,
    platformId: "executive-inbox-platform",
    runtimeBehaviorChanged: false,
  }),
  app1ExecutiveTime: Object.freeze({
    compatible: true,
    referenceOnly: true,
    directInternalCouplingForbidden: true,
    facadeOnlyReferenceAllowed: true,
    runtimeBehaviorChanged: false,
  }),
  app2ScenarioIntelligence: Object.freeze({
    compatible: true,
    referenceOnly: true,
    directInternalCouplingForbidden: true,
    facadeOnlyReferenceAllowed: true,
    runtimeBehaviorChanged: false,
  }),
  app3ExecutiveIntent: Object.freeze({
    compatible: true,
    referenceOnly: true,
    directInternalCouplingForbidden: true,
    facadeOnlyReferenceAllowed: true,
    runtimeBehaviorChanged: false,
  }),
  app4ExecutiveMemory: Object.freeze({
    compatible: true,
    referenceOnly: true,
    directInternalCouplingForbidden: true,
    facadeOnlyReferenceAllowed: true,
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
  app10CrossScenarioLearning: Object.freeze({
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
  workspaceConsumer: Object.freeze({
    compatible: true,
    integrationPath: "future APP-11 API facade",
    workspaceIsolationRequired: true,
    runtimeBehaviorChanged: false,
  }),
  dashboardConsumer: Object.freeze({
    compatible: true,
    integrationPath: "future APP-11 API facade",
    readOnly: true,
    runtimeBehaviorChanged: false,
  }),
  assistantConsumer: Object.freeze({
    compatible: true,
    integrationPath: "future APP-11 API facade",
    readOnly: true,
    runtimeBehaviorChanged: false,
  }),
  reportConsumer: Object.freeze({
    compatible: true,
    integrationPath: "future APP-11 API facade",
    readOnly: true,
    runtimeBehaviorChanged: false,
  }),
  backwardCompatibility: Object.freeze({
    guaranteed: true,
    breakingChangesForbidden: EXECUTIVE_INBOX_FREEZE_RULES.breakingChangesForbidden,
    publicInterfacesExtendOnly: EXECUTIVE_INBOX_FREEZE_RULES.publicInterfacesExtendOnly,
  }),
  readOnly: true as const,
});

export function getExecutiveInboxCompatibility(): typeof EXECUTIVE_INBOX_PLATFORM_COMPATIBILITY_MATRIX {
  return EXECUTIVE_INBOX_PLATFORM_COMPATIBILITY_MATRIX;
}

export const ExecutiveInboxPlatformFreezeCompatibility = Object.freeze({
  getExecutiveInboxCompatibility,
  matrix: EXECUTIVE_INBOX_PLATFORM_COMPATIBILITY_MATRIX,
});
