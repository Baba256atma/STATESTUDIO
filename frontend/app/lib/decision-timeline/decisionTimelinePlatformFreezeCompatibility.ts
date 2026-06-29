/**
 * APP-6:12 — Decision Timeline Platform Freeze compatibility matrix.
 */

import { DECISION_TIMELINE_FREEZE_RULES } from "./decisionTimelineContracts.ts";
import { DECISION_TIMELINE_PLATFORM_COMPATIBILITY_VERSION } from "./decisionTimelinePlatformFreezeRegistry.ts";

export const DECISION_TIMELINE_PLATFORM_COMPATIBILITY_MATRIX = Object.freeze({
  compatibilityVersion: DECISION_TIMELINE_PLATFORM_COMPATIBILITY_VERSION,
  app6Platform: Object.freeze({
    compatible: true,
    platformId: "decision-timeline-platform",
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
  dashboardPlatform: Object.freeze({
    compatible: true,
    integrationLayer: "APP-6/9",
    adapterOnly: true,
    runtimeBehaviorChanged: false,
  }),
  assistantPlatform: Object.freeze({
    compatible: true,
    integrationLayer: "APP-6/10",
    consumesDashboardOnly: true,
    runtimeBehaviorChanged: false,
  }),
  workspacePlatform: Object.freeze({
    compatible: true,
    workspaceIsolationRequired: true,
    crossWorkspaceAccessForbidden: true,
    runtimeBehaviorChanged: false,
  }),
  backwardCompatibility: Object.freeze({
    guaranteed: true,
    breakingChangesForbidden: DECISION_TIMELINE_FREEZE_RULES.breakingChangesForbidden,
    publicInterfacesExtendOnly: DECISION_TIMELINE_FREEZE_RULES.publicInterfacesExtendOnly,
  }),
  readOnly: true as const,
});

export function getDecisionTimelineCompatibility(): typeof DECISION_TIMELINE_PLATFORM_COMPATIBILITY_MATRIX {
  return DECISION_TIMELINE_PLATFORM_COMPATIBILITY_MATRIX;
}

export const DecisionTimelinePlatformFreezeCompatibility = Object.freeze({
  getDecisionTimelineCompatibility,
  matrix: DECISION_TIMELINE_PLATFORM_COMPATIBILITY_MATRIX,
});
