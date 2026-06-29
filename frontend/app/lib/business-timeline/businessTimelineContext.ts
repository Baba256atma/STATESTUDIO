/**
 * APP-7:5 — Business Timeline Causality + Context Layer.
 * Read-only historical relationship structuring over APP-7:3 and APP-7:4.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { BUSINESS_TIMELINE_MUST_NOT_OWN } from "./businessTimelineConstants.ts";
import { isBusinessTimelinePlatformInitialized } from "./businessTimelineFoundation.ts";
import { buildBusinessLifecycleModel, BUSINESS_TIMELINE_LIFECYCLE_SELF_MANIFEST } from "./businessTimelineLifecycle.ts";
import { queryBusinessTimeline } from "./businessTimelineQuery.ts";
import {
  buildBusinessEventContexts,
  buildBusinessTimelineContextModelFromSources,
} from "./businessTimelineContextBuilder.ts";
import { buildBusinessContextClusters } from "./businessTimelineClusters.ts";
import { buildBusinessEventRelationships } from "./businessTimelineRelationships.ts";
import {
  BUSINESS_CONTEXT_DEFAULT_PROXIMITY_DAYS,
  BUSINESS_TIMELINE_CONTEXT_CONTRACT_VERSION,
  BUSINESS_TIMELINE_CONTEXT_FORBIDDEN_PATTERNS,
  BUSINESS_TIMELINE_CONTEXT_TAGS,
  type BusinessTimelineContextBuildInput,
  type BusinessTimelineContextEngineState,
  type BusinessTimelineContextModel,
} from "./businessTimelineContextTypes.ts";
import {
  validateBusinessTimelineContextModel,
  validateFoundationCompatibilityForContext,
  validatePrerequisitesForContext,
} from "./businessTimelineContextValidation.ts";

export const BUSINESS_TIMELINE_CONTEXT_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...BUSINESS_TIMELINE_CONTEXT_FORBIDDEN_PATTERNS,
] as const);

export const BUSINESS_TIMELINE_CONTEXT_SELF_MANIFEST = Object.freeze({
  stageId: "APP-7/5",
  title: "Business Timeline Causality + Context Layer",
  goal: "Read-only historical event relationships, context clusters, and possible causal links over APP-7:3/7:4 outputs.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...BUSINESS_TIMELINE_LIFECYCLE_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/business-timeline/businessTimelineContextTypes.ts",
    "frontend/app/lib/business-timeline/businessTimelineContextRules.ts",
    "frontend/app/lib/business-timeline/businessTimelineRelationships.ts",
    "frontend/app/lib/business-timeline/businessTimelineClusters.ts",
    "frontend/app/lib/business-timeline/businessTimelineContextBuilder.ts",
    "frontend/app/lib/business-timeline/businessTimelineContextValidation.ts",
    "frontend/app/lib/business-timeline/businessTimelineContext.ts",
    "frontend/app/lib/business-timeline/businessTimelineContextRunner.ts",
    "frontend/app/lib/business-timeline/businessTimelineContext.test.ts",
    "docs/app-7-5-business-timeline-causality-context.md",
  ]),
  forbiddenPatterns: BUSINESS_TIMELINE_CONTEXT_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-7/1", "APP-7/2", "APP-7/3", "APP-7/4"]),
  runtimePath: "library-only" as const,
  tags: BUSINESS_TIMELINE_CONTEXT_TAGS,
} satisfies StageManifest);

export const BUSINESS_TIMELINE_CONTEXT_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  readOnlyGateway: true,
  queryAndLifecycleDerivedOnly: true,
  noEventMutation: true,
  noLifecycleMutation: true,
  noTrueCausalityClaims: true,
  noPrediction: true,
  noRecommendation: true,
  noPersistence: true,
  noVisualization: true,
  noReact: true,
  noDashboardIntegration: true,
  noAssistantIntegration: true,
  noScenarioCoupling: true,
  noDecisionCoupling: true,
} as const);

let contextLayerInitialized = false;
let contextLayerTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeBusinessTimelineContextLayer(
  timestamp: string = contextLayerTimestamp
): BusinessTimelineContextEngineState {
  contextLayerInitialized = true;
  contextLayerTimestamp = timestamp;
  return getBusinessTimelineContextEngineState(timestamp);
}

export function isBusinessTimelineContextLayerInitialized(): boolean {
  return contextLayerInitialized;
}

export function getBusinessTimelineContextEngineState(
  timestamp: string = contextLayerTimestamp
): BusinessTimelineContextEngineState {
  return Object.freeze({
    engineId: "business-timeline-context-engine",
    contractVersion: BUSINESS_TIMELINE_CONTEXT_CONTRACT_VERSION,
    initialized: contextLayerInitialized,
    timestamp,
    readOnly: true as const,
  });
}

export function resetBusinessTimelineContextLayerForTests(): void {
  contextLayerInitialized = false;
  contextLayerTimestamp = "2026-01-01T00:00:00.000Z";
}

function assertContextLayerReady(): string | null {
  if (!isBusinessTimelinePlatformInitialized()) {
    return "APP-7:1 Business Timeline Foundation is not initialized.";
  }
  const prerequisites = validatePrerequisitesForContext();
  if (!prerequisites.valid) {
    return prerequisites.issues[0]?.message ?? "Context prerequisites unavailable.";
  }
  if (!isBusinessTimelineContextLayerInitialized()) {
    return "Business Timeline Context Layer is not initialized.";
  }
  return null;
}

export function buildBusinessTimelineContextModel(
  input: BusinessTimelineContextBuildInput
): BusinessTimelineContextModel {
  const readiness = assertContextLayerReady();
  const generatedAt = input.generatedAt ?? contextLayerTimestamp;
  const proximityDays = input.proximityDays ?? BUSINESS_CONTEXT_DEFAULT_PROXIMITY_DAYS;

  if (readiness) {
    return buildBusinessTimelineContextModelFromSources(
      Object.freeze([]),
      buildBusinessLifecycleModel({ workspaceId: input.workspaceId, generatedAt }),
      input.workspaceId,
      generatedAt,
      proximityDays
    );
  }

  const query = queryBusinessTimeline(
    Object.freeze({
      workspaceId: input.workspaceId,
      includeArchived: input.includeArchived ?? false,
      direction: "asc",
    })
  );
  const lifecycle = buildBusinessLifecycleModel({
    workspaceId: input.workspaceId,
    includeArchived: input.includeArchived ?? false,
    generatedAt,
  });

  const events = query.success && query.data ? query.data.events : Object.freeze([]);
  const model = buildBusinessTimelineContextModelFromSources(
    events,
    lifecycle,
    input.workspaceId,
    generatedAt,
    proximityDays
  );
  const validation = validateBusinessTimelineContextModel(model);
  if (!validation.valid) {
    return buildBusinessTimelineContextModelFromSources(
      Object.freeze([]),
      buildBusinessLifecycleModel({ workspaceId: input.workspaceId, generatedAt }),
      input.workspaceId,
      generatedAt,
      proximityDays
    );
  }
  return model;
}

export function getBusinessEventContext(
  model: BusinessTimelineContextModel,
  eventId: string
): BusinessTimelineContextModel["eventContexts"][number] | null {
  return model.eventContexts.find((context) => context.eventId === eventId) ?? null;
}

export function getBusinessRelatedEvents(
  model: BusinessTimelineContextModel,
  eventId: string
): readonly BusinessTimelineContextModel["events"][number][] {
  const context = getBusinessEventContext(model, eventId);
  if (!context) {
    return Object.freeze([]);
  }
  const relatedIds = new Set(context.relatedEventIds);
  return Object.freeze(model.events.filter((event) => relatedIds.has(event.id)));
}

export { buildBusinessEventContexts, buildBusinessEventRelationships, buildBusinessContextClusters };
export { validateBusinessTimelineContextModel };
export { runBusinessTimelineContextCertification } from "./businessTimelineContextRunner.ts";

export const BUSINESS_TIMELINE_CONTEXT_VERSION = BUSINESS_TIMELINE_CONTEXT_CONTRACT_VERSION;
export const BUSINESS_TIMELINE_CONTEXT_OWNER = "business-timeline-context-layer";

export const BusinessTimelineContextLayer = Object.freeze({
  initializeBusinessTimelineContextLayer,
  isBusinessTimelineContextLayerInitialized,
  getBusinessTimelineContextEngineState,
  buildBusinessTimelineContextModel,
  buildBusinessEventContexts,
  buildBusinessEventRelationships,
  buildBusinessContextClusters,
  getBusinessEventContext,
  getBusinessRelatedEvents,
  validateBusinessTimelineContextModel,
  version: BUSINESS_TIMELINE_CONTEXT_CONTRACT_VERSION,
  tags: BUSINESS_TIMELINE_CONTEXT_TAGS,
  mustNotOwn: BUSINESS_TIMELINE_MUST_NOT_OWN,
});

export { BUSINESS_TIMELINE_CONTEXT_TAGS };
