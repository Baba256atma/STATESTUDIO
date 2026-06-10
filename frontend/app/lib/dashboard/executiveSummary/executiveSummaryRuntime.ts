/**
 * Phase 4:1 — Executive Summary Runtime (single owner).
 * Summary generation, updates, and context aggregation.
 */

import type { DashboardContext } from "../../ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../dashboardContextTypes.ts";
import {
  CANONICAL_EXECUTIVE_SUMMARY_OWNER,
  CANONICAL_DASHBOARD_DEFAULT_LANDING_SURFACE,
  EXECUTIVE_SUMMARY_SURFACE_VERSION,
  type ExecutiveSummaryAggregationInput,
  type ExecutiveSummarySurfaceModel,
} from "./executiveSummaryContract.ts";
import { aggregateExecutiveSummary } from "./executiveSummaryAggregation.ts";
import { reportExecutiveSummary } from "./executiveSummaryLogging.ts";

let lastResolvedSignature: string | null = null;
let lastResolvedModel: ExecutiveSummarySurfaceModel | null = null;

function buildResolutionSignature(input: ExecutiveSummaryAggregationInput): string {
  return JSON.stringify({
    dashboardContext: input.dashboardContext,
    contextId: input.normalizedContext?.id ?? null,
    objectId: input.selectedObjectId ?? null,
    timelineActive: input.timelineActive ?? false,
    openContextCount: input.openContextCount ?? 1,
  });
}

export function resolveExecutiveSummarySurface(
  input: ExecutiveSummaryAggregationInput
): ExecutiveSummarySurfaceModel {
  const signature = buildResolutionSignature(input);
  if (lastResolvedSignature === signature && lastResolvedModel) {
    return lastResolvedModel;
  }

  const model = aggregateExecutiveSummary(input);
  lastResolvedSignature = signature;
  lastResolvedModel = model;
  return model;
}

export function initializeExecutiveSummaryRuntime(input: {
  dashboardContext: DashboardContext;
  normalizedContext: NormalizedDashboardContext | null;
}): ExecutiveSummarySurfaceModel {
  reportExecutiveSummary({
    phase: "runtime_init",
    owner: CANONICAL_EXECUTIVE_SUMMARY_OWNER,
    version: EXECUTIVE_SUMMARY_SURFACE_VERSION,
    defaultLandingSurface: CANONICAL_DASHBOARD_DEFAULT_LANDING_SURFACE,
    dashboardContext: input.dashboardContext,
  });

  return resolveExecutiveSummarySurface({
    dashboardContext: input.dashboardContext,
    normalizedContext: input.normalizedContext,
  });
}

export function resetExecutiveSummaryRuntimeForTests(): void {
  lastResolvedSignature = null;
  lastResolvedModel = null;
}
