/**
 * Phase 5:1 — Executive Advisory Runtime (single owner).
 */

import type {
  ExecutiveAdvisoryAggregationInput,
  ExecutiveAdvisorySnapshot,
  ExecutiveAdvisorySurfaceModel,
} from "./executiveAdvisoryContract.ts";
import {
  CANONICAL_EXECUTIVE_ADVISORY_OWNER,
  EXECUTIVE_ADVISORY_SURFACE_VERSION,
} from "./executiveAdvisoryContract.ts";
import { aggregateExecutiveAdvisory } from "./executiveAdvisoryAggregation.ts";
import { reportExecutiveAdvisory } from "./executiveAdvisoryLogging.ts";

let lastSignature: string | null = null;
let lastModel: ExecutiveAdvisorySurfaceModel | null = null;

function buildSignature(input: ExecutiveAdvisoryAggregationInput): string {
  return JSON.stringify({
    dashboardContext: input.dashboardContext,
    contextId: input.normalizedContext?.id ?? null,
    objectId: input.selectedObjectId ?? null,
    timelineActive: input.timelineActive ?? false,
  });
}

export function resolveExecutiveAdvisorySurface(
  input: ExecutiveAdvisoryAggregationInput
): ExecutiveAdvisorySurfaceModel {
  const signature = buildSignature(input);
  if (lastSignature === signature && lastModel) return lastModel;
  const model = aggregateExecutiveAdvisory(input);
  lastSignature = signature;
  lastModel = model;
  return model;
}

/** Approved feed for Executive Summary. */
export function getExecutiveAdvisorySnapshotForExecutiveSummary(
  input: ExecutiveAdvisoryAggregationInput
): ExecutiveAdvisorySnapshot {
  return resolveExecutiveAdvisorySurface(input).snapshot;
}

export function initializeExecutiveAdvisoryRuntime(
  input: ExecutiveAdvisoryAggregationInput
): ExecutiveAdvisorySurfaceModel {
  reportExecutiveAdvisory({
    phase: "runtime_init",
    owner: CANONICAL_EXECUTIVE_ADVISORY_OWNER,
    version: EXECUTIVE_ADVISORY_SURFACE_VERSION,
    dashboardContext: input.dashboardContext,
  });
  return resolveExecutiveAdvisorySurface(input);
}

export function resetExecutiveAdvisoryRuntimeForTests(): void {
  lastSignature = null;
  lastModel = null;
}
