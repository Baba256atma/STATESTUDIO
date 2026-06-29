/**
 * APP-7:8 — Business Timeline Platform Freeze compatibility matrix.
 */

import { BUSINESS_TIMELINE_FREEZE_RULES } from "./businessTimelineContracts.ts";
import { BUSINESS_TIMELINE_PLATFORM_COMPATIBILITY_VERSION } from "./businessTimelinePlatformFreezeRegistry.ts";

export const BUSINESS_TIMELINE_PLATFORM_COMPATIBILITY_MATRIX = Object.freeze({
  compatibilityVersion: BUSINESS_TIMELINE_PLATFORM_COMPATIBILITY_VERSION,
  app7Platform: Object.freeze({
    compatible: true,
    platformId: "business-timeline-platform",
    runtimeBehaviorChanged: false,
  }),
  app5ScenarioTimeline: Object.freeze({
    compatible: true,
    referenceOnly: true,
    directInternalCouplingForbidden: true,
    runtimeBehaviorChanged: false,
  }),
  app6DecisionTimeline: Object.freeze({
    compatible: true,
    referenceOnly: true,
    directInternalCouplingForbidden: true,
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
  dashboardConsumer: Object.freeze({
    compatible: true,
    integrationPath: "APP-7:6 facade",
    readOnly: true,
    runtimeBehaviorChanged: false,
  }),
  assistantConsumer: Object.freeze({
    compatible: true,
    integrationPath: "APP-7:6 facade",
    readOnly: true,
    runtimeBehaviorChanged: false,
  }),
  visualizationConsumer: Object.freeze({
    compatible: true,
    integrationPath: "APP-7:6 facade",
    readOnly: true,
    runtimeBehaviorChanged: false,
  }),
  workspaceConsumer: Object.freeze({
    compatible: true,
    integrationPath: "APP-7:6 facade",
    controlledWritesOnly: true,
    workspaceIsolationRequired: true,
    runtimeBehaviorChanged: false,
  }),
  backwardCompatibility: Object.freeze({
    guaranteed: true,
    breakingChangesForbidden: BUSINESS_TIMELINE_FREEZE_RULES.breakingChangesForbidden,
    publicInterfacesExtendOnly: BUSINESS_TIMELINE_FREEZE_RULES.publicInterfacesExtendOnly,
  }),
  readOnly: true as const,
});

export function getBusinessTimelineCompatibility(): typeof BUSINESS_TIMELINE_PLATFORM_COMPATIBILITY_MATRIX {
  return BUSINESS_TIMELINE_PLATFORM_COMPATIBILITY_MATRIX;
}

export const BusinessTimelinePlatformFreezeCompatibility = Object.freeze({
  getBusinessTimelineCompatibility,
  matrix: BUSINESS_TIMELINE_PLATFORM_COMPATIBILITY_MATRIX,
});
