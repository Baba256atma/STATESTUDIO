/**
 * Phase 5:5 — Decision Guidance Runtime (single owner).
 */

import type {
  DecisionGuidanceAggregationInput,
  DecisionGuidanceSnapshot,
  DecisionGuidanceSurfaceModel,
} from "./decisionGuidanceContract.ts";
import {
  CANONICAL_DECISION_GUIDANCE_OWNER,
  DECISION_GUIDANCE_SURFACE_VERSION,
} from "./decisionGuidanceContract.ts";
import { aggregateDecisionGuidance } from "./decisionGuidanceAggregation.ts";
import { reportDecisionGuidance } from "./decisionGuidanceLogging.ts";

let lastSignature: string | null = null;
let lastModel: DecisionGuidanceSurfaceModel | null = null;

function buildSignature(input: DecisionGuidanceAggregationInput): string {
  return JSON.stringify({
    dashboardContext: input.dashboardContext,
    contextId: input.normalizedContext?.id ?? null,
    objectId: input.selectedObjectId ?? null,
    timelineActive: input.timelineActive ?? false,
  });
}

export function resolveDecisionGuidanceSurface(
  input: DecisionGuidanceAggregationInput
): DecisionGuidanceSurfaceModel {
  const signature = buildSignature(input);
  if (lastSignature === signature && lastModel) return lastModel;
  const model = aggregateDecisionGuidance(input);
  lastSignature = signature;
  lastModel = model;
  return model;
}

/** Approved feed for Executive Summary. */
export function getDecisionGuidanceSnapshotForExecutiveSummary(
  input: DecisionGuidanceAggregationInput
): DecisionGuidanceSnapshot {
  return resolveDecisionGuidanceSurface(input).snapshot;
}

/** Approved feed for War Room presentation layer. */
export function getDecisionGuidanceSnapshotForWarRoom(
  input: DecisionGuidanceAggregationInput
): DecisionGuidanceSnapshot {
  return resolveDecisionGuidanceSurface(input).snapshot;
}

export function initializeDecisionGuidanceRuntime(
  input: DecisionGuidanceAggregationInput
): DecisionGuidanceSurfaceModel {
  reportDecisionGuidance({
    phase: "runtime_init",
    owner: CANONICAL_DECISION_GUIDANCE_OWNER,
    version: DECISION_GUIDANCE_SURFACE_VERSION,
    dashboardContext: input.dashboardContext,
  });
  return resolveDecisionGuidanceSurface(input);
}

export function resetDecisionGuidanceRuntimeForTests(): void {
  lastSignature = null;
  lastModel = null;
}
