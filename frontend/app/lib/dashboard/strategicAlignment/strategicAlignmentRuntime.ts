/**
 * Phase 6:2 — Strategic Alignment Runtime (single owner).
 */

import type {
  StrategicAlignmentAggregationInput,
  StrategicAlignmentSnapshot,
  StrategicAlignmentSurfaceModel,
} from "./strategicAlignmentContract.ts";
import {
  CANONICAL_STRATEGIC_ALIGNMENT_OWNER,
  STRATEGIC_ALIGNMENT_SURFACE_VERSION,
} from "./strategicAlignmentContract.ts";
import { aggregateStrategicAlignment } from "./strategicAlignmentAggregation.ts";
import { reportStrategicAlignment } from "./strategicAlignmentLogging.ts";

let lastSignature: string | null = null;
let lastModel: StrategicAlignmentSurfaceModel | null = null;

function buildSignature(input: StrategicAlignmentAggregationInput): string {
  return JSON.stringify({
    dashboardContext: input.dashboardContext,
    contextId: input.normalizedContext?.id ?? null,
    objectId: input.selectedObjectId ?? null,
    timelineActive: input.timelineActive ?? false,
  });
}

export function resolveStrategicAlignmentSurface(
  input: StrategicAlignmentAggregationInput
): StrategicAlignmentSurfaceModel {
  const signature = buildSignature(input);
  if (lastSignature === signature && lastModel) return lastModel;
  const model = aggregateStrategicAlignment(input);
  lastSignature = signature;
  lastModel = model;
  return model;
}

/** Approved feed for Executive Summary. */
export function getStrategicAlignmentSnapshotForExecutiveSummary(
  input: StrategicAlignmentAggregationInput
): StrategicAlignmentSnapshot {
  return resolveStrategicAlignmentSurface(input).snapshot;
}

/** Approved feed for Governance presentation layer. */
export function getStrategicAlignmentSnapshotForGovernance(
  input: StrategicAlignmentAggregationInput
): StrategicAlignmentSnapshot {
  return resolveStrategicAlignmentSurface(input).snapshot;
}

export function initializeStrategicAlignmentRuntime(
  input: StrategicAlignmentAggregationInput
): StrategicAlignmentSurfaceModel {
  reportStrategicAlignment({
    phase: "runtime_init",
    owner: CANONICAL_STRATEGIC_ALIGNMENT_OWNER,
    version: STRATEGIC_ALIGNMENT_SURFACE_VERSION,
    dashboardContext: input.dashboardContext,
  });
  return resolveStrategicAlignmentSurface(input);
}

export function resetStrategicAlignmentRuntimeForTests(): void {
  lastSignature = null;
  lastModel = null;
}
