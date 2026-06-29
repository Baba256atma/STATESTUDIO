/**
 * APP-7:4 — Business Timeline Lifecycle + Milestone Layer.
 * Read-only structuring layer over APP-7:3 timeline query results.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { BUSINESS_TIMELINE_MUST_NOT_OWN } from "./businessTimelineConstants.ts";
import { isBusinessTimelinePlatformInitialized } from "./businessTimelineFoundation.ts";
import { BUSINESS_TIMELINE_QUERY_SELF_MANIFEST, queryBusinessTimeline } from "./businessTimelineQuery.ts";
import {
  buildBusinessLifecycleModelFromEvents,
  buildBusinessLifecycleSummary,
  classifyBusinessLifecycleSegments,
  mapEventsToLifecycle,
} from "./businessTimelineLifecycleBuilder.ts";
import { extractBusinessMilestones } from "./businessTimelineMilestones.ts";
import {
  BUSINESS_TIMELINE_LIFECYCLE_CONTRACT_VERSION,
  BUSINESS_TIMELINE_LIFECYCLE_FORBIDDEN_PATTERNS,
  BUSINESS_TIMELINE_LIFECYCLE_TAGS,
  type BusinessLifecycleBuildInput,
  type BusinessLifecycleEngineState,
  type BusinessLifecycleModel,
  type BusinessLifecycleSummary,
} from "./businessTimelineLifecycleTypes.ts";
import {
  validateBusinessLifecycleModel,
  validateFoundationCompatibilityForLifecycle,
  validatePrerequisitesForLifecycle,
} from "./businessTimelineLifecycleValidation.ts";

export const BUSINESS_TIMELINE_LIFECYCLE_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...BUSINESS_TIMELINE_LIFECYCLE_FORBIDDEN_PATTERNS,
] as const);

export const BUSINESS_TIMELINE_LIFECYCLE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-7/4",
  title: "Business Timeline Lifecycle + Milestone Layer",
  goal: "Read-only lifecycle phase segmentation and milestone extraction from APP-7:3 ordered timeline events.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...BUSINESS_TIMELINE_QUERY_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/business-timeline/businessTimelineLifecycleTypes.ts",
    "frontend/app/lib/business-timeline/businessTimelineLifecycleRules.ts",
    "frontend/app/lib/business-timeline/businessTimelineMilestones.ts",
    "frontend/app/lib/business-timeline/businessTimelineLifecycleBuilder.ts",
    "frontend/app/lib/business-timeline/businessTimelineLifecycleValidation.ts",
    "frontend/app/lib/business-timeline/businessTimelineLifecycle.ts",
    "frontend/app/lib/business-timeline/businessTimelineLifecycleRunner.ts",
    "frontend/app/lib/business-timeline/businessTimelineLifecycle.test.ts",
    "docs/app-7-4-business-timeline-lifecycle-milestones.md",
  ]),
  forbiddenPatterns: BUSINESS_TIMELINE_LIFECYCLE_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-7/1", "APP-7/2", "APP-7/3"]),
  runtimePath: "library-only" as const,
  tags: BUSINESS_TIMELINE_LIFECYCLE_TAGS,
} satisfies StageManifest);

export const BUSINESS_TIMELINE_LIFECYCLE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  readOnlyGateway: true,
  queryDerivedOnly: true,
  noEventCreation: true,
  noEventMutation: true,
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

let lifecycleLayerInitialized = false;
let lifecycleLayerTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeBusinessTimelineLifecycleLayer(
  timestamp: string = lifecycleLayerTimestamp
): BusinessLifecycleEngineState {
  lifecycleLayerInitialized = true;
  lifecycleLayerTimestamp = timestamp;
  return getBusinessTimelineLifecycleEngineState(timestamp);
}

export function isBusinessTimelineLifecycleLayerInitialized(): boolean {
  return lifecycleLayerInitialized;
}

export function getBusinessTimelineLifecycleEngineState(
  timestamp: string = lifecycleLayerTimestamp
): BusinessLifecycleEngineState {
  return Object.freeze({
    engineId: "business-timeline-lifecycle-engine",
    contractVersion: BUSINESS_TIMELINE_LIFECYCLE_CONTRACT_VERSION,
    initialized: lifecycleLayerInitialized,
    timestamp,
    readOnly: true as const,
  });
}

export function resetBusinessTimelineLifecycleLayerForTests(): void {
  lifecycleLayerInitialized = false;
  lifecycleLayerTimestamp = "2026-01-01T00:00:00.000Z";
}

function assertLifecycleLayerReady(): string | null {
  if (!isBusinessTimelinePlatformInitialized()) {
    return "APP-7:1 Business Timeline Foundation is not initialized.";
  }
  const prerequisites = validatePrerequisitesForLifecycle();
  if (!prerequisites.valid) {
    return prerequisites.issues[0]?.message ?? "Lifecycle prerequisites unavailable.";
  }
  if (!isBusinessTimelineLifecycleLayerInitialized()) {
    return "Business Timeline Lifecycle Layer is not initialized.";
  }
  return null;
}

function readTimelineEvents(input: BusinessLifecycleBuildInput) {
  const query = queryBusinessTimeline(
    Object.freeze({
      workspaceId: input.workspaceId,
      includeArchived: input.includeArchived ?? false,
      direction: "asc",
    })
  );
  if (!query.success || !query.data) {
    return Object.freeze({ events: Object.freeze([]), reason: query.reason });
  }
  return Object.freeze({ events: query.data.events, reason: query.reason });
}

export function buildBusinessLifecycleModel(input: BusinessLifecycleBuildInput): BusinessLifecycleModel {
  const readiness = assertLifecycleLayerReady();
  const generatedAt = input.generatedAt ?? lifecycleLayerTimestamp;
  if (readiness) {
    return buildBusinessLifecycleModelFromEvents(Object.freeze([]), input.workspaceId, generatedAt);
  }

  const timeline = readTimelineEvents(input);
  const model = buildBusinessLifecycleModelFromEvents(timeline.events, input.workspaceId, generatedAt);
  const validation = validateBusinessLifecycleModel(model);
  if (!validation.valid) {
    return buildBusinessLifecycleModelFromEvents(Object.freeze([]), input.workspaceId, generatedAt);
  }
  return model;
}

export { classifyBusinessLifecycleSegments, extractBusinessMilestones, mapEventsToLifecycle };

export function getBusinessLifecycleSummary(input: BusinessLifecycleBuildInput): BusinessLifecycleSummary {
  const model = buildBusinessLifecycleModel(input);
  return model.summary;
}

export { validateBusinessLifecycleModel };
export { runBusinessTimelineLifecycleCertification } from "./businessTimelineLifecycleRunner.ts";

export const BUSINESS_TIMELINE_LIFECYCLE_VERSION = BUSINESS_TIMELINE_LIFECYCLE_CONTRACT_VERSION;
export const BUSINESS_TIMELINE_LIFECYCLE_OWNER = "business-timeline-lifecycle-layer";

export const BusinessTimelineLifecycleLayer = Object.freeze({
  initializeBusinessTimelineLifecycleLayer,
  isBusinessTimelineLifecycleLayerInitialized,
  getBusinessTimelineLifecycleEngineState,
  buildBusinessLifecycleModel,
  classifyBusinessLifecycleSegments,
  extractBusinessMilestones,
  mapEventsToLifecycle,
  getBusinessLifecycleSummary,
  validateBusinessLifecycleModel,
  version: BUSINESS_TIMELINE_LIFECYCLE_CONTRACT_VERSION,
  tags: BUSINESS_TIMELINE_LIFECYCLE_TAGS,
  mustNotOwn: BUSINESS_TIMELINE_MUST_NOT_OWN,
});

export { BUSINESS_TIMELINE_LIFECYCLE_TAGS, buildBusinessLifecycleSummary };
