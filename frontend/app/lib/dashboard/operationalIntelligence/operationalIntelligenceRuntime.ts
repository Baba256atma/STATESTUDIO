/**
 * Phase 4:2 — Operational Intelligence Runtime (single owner).
 */

import type { OperationalIntelligenceAggregationInput } from "./operationalIntelligenceContract.ts";
import {
  CANONICAL_OPERATIONAL_INTELLIGENCE_OWNER,
  OPERATIONAL_INTELLIGENCE_SURFACE_VERSION,
  type OperationalIntelligenceSnapshot,
  type OperationalIntelligenceSurfaceModel,
} from "./operationalIntelligenceContract.ts";
import { aggregateOperationalIntelligence } from "./operationalIntelligenceAggregation.ts";
import { reportOperationalIntelligence } from "./operationalIntelligenceLogging.ts";

let lastSignature: string | null = null;
let lastModel: OperationalIntelligenceSurfaceModel | null = null;

function buildSignature(input: OperationalIntelligenceAggregationInput): string {
  return JSON.stringify({
    dashboardContext: input.dashboardContext,
    contextId: input.normalizedContext?.id ?? null,
    objectId: input.selectedObjectId ?? null,
    objectsInScene: input.objectsInScene ?? null,
    timelineActive: input.timelineActive ?? false,
  });
}

export function resolveOperationalIntelligenceSurface(
  input: OperationalIntelligenceAggregationInput
): OperationalIntelligenceSurfaceModel {
  const signature = buildSignature(input);
  if (lastSignature === signature && lastModel) return lastModel;
  const model = aggregateOperationalIntelligence(input);
  lastSignature = signature;
  lastModel = model;
  return model;
}

/** Approved feed for Executive Summary — snapshot only, no summary ownership. */
export function getOperationalIntelligenceSnapshotForExecutiveSummary(
  input: OperationalIntelligenceAggregationInput
): OperationalIntelligenceSnapshot {
  return resolveOperationalIntelligenceSurface(input).snapshot;
}

export function initializeOperationalIntelligenceRuntime(
  input: OperationalIntelligenceAggregationInput
): OperationalIntelligenceSurfaceModel {
  reportOperationalIntelligence({
    phase: "runtime_init",
    owner: CANONICAL_OPERATIONAL_INTELLIGENCE_OWNER,
    version: OPERATIONAL_INTELLIGENCE_SURFACE_VERSION,
    dashboardContext: input.dashboardContext,
  });
  return resolveOperationalIntelligenceSurface(input);
}

export function resetOperationalIntelligenceRuntimeForTests(): void {
  lastSignature = null;
  lastModel = null;
}
