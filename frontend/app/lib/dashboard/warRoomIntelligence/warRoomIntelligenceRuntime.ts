/**
 * Phase 4:6 — War Room Intelligence Runtime (single owner).
 */

import type {
  WarRoomIntelligenceAggregationInput,
  WarRoomIntelligenceSnapshot,
  WarRoomIntelligenceSurfaceModel,
} from "./warRoomIntelligenceContract.ts";
import {
  CANONICAL_WAR_ROOM_INTELLIGENCE_OWNER,
  WAR_ROOM_INTELLIGENCE_SURFACE_VERSION,
} from "./warRoomIntelligenceContract.ts";
import { aggregateWarRoomIntelligence } from "./warRoomIntelligenceAggregation.ts";
import { reportWarRoomIntelligence } from "./warRoomIntelligenceLogging.ts";

let lastSignature: string | null = null;
let lastModel: WarRoomIntelligenceSurfaceModel | null = null;

function buildSignature(input: WarRoomIntelligenceAggregationInput): string {
  return JSON.stringify({
    dashboardContext: input.dashboardContext,
    contextId: input.normalizedContext?.id ?? null,
    objectId: input.selectedObjectId ?? null,
    timelineActive: input.timelineActive ?? false,
  });
}

export function resolveWarRoomIntelligenceSurface(
  input: WarRoomIntelligenceAggregationInput
): WarRoomIntelligenceSurfaceModel {
  const signature = buildSignature(input);
  if (lastSignature === signature && lastModel) return lastModel;
  const model = aggregateWarRoomIntelligence(input);
  lastSignature = signature;
  lastModel = model;
  return model;
}

/** Approved feed for Executive Summary. */
export function getWarRoomIntelligenceSnapshotForExecutiveSummary(
  input: WarRoomIntelligenceAggregationInput
): WarRoomIntelligenceSnapshot {
  return resolveWarRoomIntelligenceSurface(input).snapshot;
}

export function initializeWarRoomIntelligenceRuntime(
  input: WarRoomIntelligenceAggregationInput
): WarRoomIntelligenceSurfaceModel {
  reportWarRoomIntelligence({
    phase: "runtime_init",
    owner: CANONICAL_WAR_ROOM_INTELLIGENCE_OWNER,
    version: WAR_ROOM_INTELLIGENCE_SURFACE_VERSION,
    dashboardContext: input.dashboardContext,
  });
  return resolveWarRoomIntelligenceSurface(input);
}

export function resetWarRoomIntelligenceRuntimeForTests(): void {
  lastSignature = null;
  lastModel = null;
}
