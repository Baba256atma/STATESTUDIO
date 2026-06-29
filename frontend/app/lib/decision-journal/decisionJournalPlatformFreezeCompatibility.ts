/**
 * APP-8:9 — Decision Journal Platform Freeze compatibility matrix.
 */

import { DECISION_JOURNAL_FREEZE_RULES } from "./decisionJournalContracts.ts";
import { DECISION_JOURNAL_PLATFORM_COMPATIBILITY_VERSION } from "./decisionJournalPlatformFreezeRegistry.ts";

export const DECISION_JOURNAL_PLATFORM_COMPATIBILITY_MATRIX = Object.freeze({
  compatibilityVersion: DECISION_JOURNAL_PLATFORM_COMPATIBILITY_VERSION,
  app8Platform: Object.freeze({
    compatible: true,
    platformId: "decision-journal-platform",
    runtimeBehaviorChanged: false,
  }),
  app6DecisionTimeline: Object.freeze({
    compatible: true,
    referenceOnly: true,
    directInternalCouplingForbidden: true,
    facadeOnlyLinkAdapterAllowed: true,
    runtimeBehaviorChanged: false,
  }),
  app7BusinessTimeline: Object.freeze({
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
    integrationPath: "APP-8:7 facade",
    readOnly: true,
    runtimeBehaviorChanged: false,
  }),
  assistantConsumer: Object.freeze({
    compatible: true,
    integrationPath: "APP-8:7 facade",
    readOnly: true,
    runtimeBehaviorChanged: false,
  }),
  visualizationConsumer: Object.freeze({
    compatible: true,
    integrationPath: "APP-8:7 facade",
    readOnly: true,
    runtimeBehaviorChanged: false,
  }),
  workspaceConsumer: Object.freeze({
    compatible: true,
    integrationPath: "APP-8:7 facade",
    controlledWritesOnly: true,
    workspaceIsolationRequired: true,
    runtimeBehaviorChanged: false,
  }),
  reportConsumer: Object.freeze({
    compatible: true,
    integrationPath: "APP-8:7 facade",
    readOnly: true,
    runtimeBehaviorChanged: false,
  }),
  exportConsumer: Object.freeze({
    compatible: true,
    integrationPath: "APP-8:7 facade",
    readOnly: true,
    runtimeBehaviorChanged: false,
  }),
  backwardCompatibility: Object.freeze({
    guaranteed: true,
    breakingChangesForbidden: DECISION_JOURNAL_FREEZE_RULES.breakingChangesForbidden,
    publicInterfacesExtendOnly: DECISION_JOURNAL_FREEZE_RULES.publicInterfacesExtendOnly,
  }),
  readOnly: true as const,
});

export function getDecisionJournalCompatibility(): typeof DECISION_JOURNAL_PLATFORM_COMPATIBILITY_MATRIX {
  return DECISION_JOURNAL_PLATFORM_COMPATIBILITY_MATRIX;
}

export const DecisionJournalPlatformFreezeCompatibility = Object.freeze({
  getDecisionJournalCompatibility,
  matrix: DECISION_JOURNAL_PLATFORM_COMPATIBILITY_MATRIX,
});
