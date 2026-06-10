/**
 * Phase 4:4 — Timeline Intelligence Runtime (single owner).
 */

import type {
  TimelineIntelligenceAggregationInput,
  TimelineIntelligenceSnapshot,
  TimelineIntelligenceSurfaceModel,
} from "./timelineIntelligenceContract.ts";
import {
  CANONICAL_TIMELINE_INTELLIGENCE_OWNER,
  TIMELINE_INTELLIGENCE_SURFACE_VERSION,
} from "./timelineIntelligenceContract.ts";
import { aggregateTimelineIntelligence } from "./timelineIntelligenceAggregation.ts";
import { reportTimelineIntelligence } from "./timelineIntelligenceLogging.ts";

let lastSignature: string | null = null;
let lastModel: TimelineIntelligenceSurfaceModel | null = null;

function buildSignature(input: TimelineIntelligenceAggregationInput): string {
  return JSON.stringify({
    dashboardContext: input.dashboardContext,
    contextId: input.normalizedContext?.id ?? null,
    objectId: input.selectedObjectId ?? null,
    timelineActive: input.timelineActive ?? false,
  });
}

export function resolveTimelineIntelligenceSurface(
  input: TimelineIntelligenceAggregationInput
): TimelineIntelligenceSurfaceModel {
  const signature = buildSignature(input);
  if (lastSignature === signature && lastModel) return lastModel;
  const model = aggregateTimelineIntelligence(input);
  lastSignature = signature;
  lastModel = model;
  return model;
}

/** Approved feed for Executive Summary. */
export function getTimelineIntelligenceSnapshotForExecutiveSummary(
  input: TimelineIntelligenceAggregationInput
): TimelineIntelligenceSnapshot {
  return resolveTimelineIntelligenceSurface(input).snapshot;
}

/** Approved feed for Risk Intelligence — temporal awareness only. */
export function getTimelineIntelligenceSnapshotForRiskIntelligence(
  input: TimelineIntelligenceAggregationInput
): TimelineIntelligenceSnapshot {
  return resolveTimelineIntelligenceSurface(input).snapshot;
}

export function initializeTimelineIntelligenceRuntime(
  input: TimelineIntelligenceAggregationInput
): TimelineIntelligenceSurfaceModel {
  reportTimelineIntelligence({
    phase: "runtime_init",
    owner: CANONICAL_TIMELINE_INTELLIGENCE_OWNER,
    version: TIMELINE_INTELLIGENCE_SURFACE_VERSION,
    dashboardContext: input.dashboardContext,
  });
  return resolveTimelineIntelligenceSurface(input);
}

export function resetTimelineIntelligenceRuntimeForTests(): void {
  lastSignature = null;
  lastModel = null;
}
