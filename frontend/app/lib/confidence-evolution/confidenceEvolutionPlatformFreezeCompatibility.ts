/**
 * APP-9:9 — Confidence Evolution Platform Freeze compatibility matrix.
 */

import { CONFIDENCE_EVOLUTION_FREEZE_RULES } from "./confidenceEvolutionContracts.ts";
import { CONFIDENCE_EVOLUTION_PLATFORM_COMPATIBILITY_VERSION } from "./confidenceEvolutionPlatformFreezeRegistry.ts";

export const CONFIDENCE_EVOLUTION_PLATFORM_COMPATIBILITY_MATRIX = Object.freeze({
  compatibilityVersion: CONFIDENCE_EVOLUTION_PLATFORM_COMPATIBILITY_VERSION,
  app9Platform: Object.freeze({
    compatible: true,
    platformId: "confidence-evolution-platform",
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
    facadeOnlyLinkAdapterAllowed: true,
    runtimeBehaviorChanged: false,
  }),
  app8DecisionJournal: Object.freeze({
    compatible: true,
    referenceOnly: true,
    directInternalCouplingForbidden: true,
    facadeOnlyLinkAdapterAllowed: true,
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
    integrationPath: "APP-9:7 facade",
    readOnly: true,
    runtimeBehaviorChanged: false,
  }),
  assistantConsumer: Object.freeze({
    compatible: true,
    integrationPath: "APP-9:7 facade",
    readOnly: true,
    runtimeBehaviorChanged: false,
  }),
  visualizationConsumer: Object.freeze({
    compatible: true,
    integrationPath: "APP-9:7 facade",
    readOnly: true,
    runtimeBehaviorChanged: false,
  }),
  workspaceConsumer: Object.freeze({
    compatible: true,
    integrationPath: "APP-9:7 facade",
    controlledWritesOnly: true,
    workspaceIsolationRequired: true,
    runtimeBehaviorChanged: false,
  }),
  reportConsumer: Object.freeze({
    compatible: true,
    integrationPath: "APP-9:7 facade",
    readOnly: true,
    runtimeBehaviorChanged: false,
  }),
  exportConsumer: Object.freeze({
    compatible: true,
    integrationPath: "APP-9:7 facade",
    readOnly: true,
    runtimeBehaviorChanged: false,
  }),
  backwardCompatibility: Object.freeze({
    guaranteed: true,
    breakingChangesForbidden: CONFIDENCE_EVOLUTION_FREEZE_RULES.breakingChangesForbidden,
    publicInterfacesExtendOnly: CONFIDENCE_EVOLUTION_FREEZE_RULES.publicInterfacesExtendOnly,
  }),
  readOnly: true as const,
});

export function getConfidenceEvolutionCompatibility(): typeof CONFIDENCE_EVOLUTION_PLATFORM_COMPATIBILITY_MATRIX {
  return CONFIDENCE_EVOLUTION_PLATFORM_COMPATIBILITY_MATRIX;
}

export const ConfidenceEvolutionPlatformFreezeCompatibility = Object.freeze({
  getConfidenceEvolutionCompatibility,
  matrix: CONFIDENCE_EVOLUTION_PLATFORM_COMPATIBILITY_MATRIX,
});
