/**
 * Phase 4:3 — Risk Intelligence Runtime (single owner).
 */

import type {
  RiskIntelligenceAggregationInput,
  RiskIntelligenceSnapshot,
  RiskIntelligenceSurfaceModel,
} from "./riskIntelligenceContract.ts";
import {
  CANONICAL_RISK_INTELLIGENCE_OWNER,
  RISK_INTELLIGENCE_SURFACE_VERSION,
} from "./riskIntelligenceContract.ts";
import { aggregateRiskIntelligence } from "./riskIntelligenceAggregation.ts";
import { reportRiskIntelligence } from "./riskIntelligenceLogging.ts";

let lastSignature: string | null = null;
let lastModel: RiskIntelligenceSurfaceModel | null = null;

function buildSignature(input: RiskIntelligenceAggregationInput): string {
  return JSON.stringify({
    dashboardContext: input.dashboardContext,
    contextId: input.normalizedContext?.id ?? null,
    objectId: input.selectedObjectId ?? null,
    timelineActive: input.timelineActive ?? false,
  });
}

export function resolveRiskIntelligenceSurface(
  input: RiskIntelligenceAggregationInput
): RiskIntelligenceSurfaceModel {
  const signature = buildSignature(input);
  if (lastSignature === signature && lastModel) return lastModel;
  const model = aggregateRiskIntelligence(input);
  lastSignature = signature;
  lastModel = model;
  return model;
}

/** Approved feed for Executive Summary — snapshot only. */
export function getRiskIntelligenceSnapshotForExecutiveSummary(
  input: RiskIntelligenceAggregationInput
): RiskIntelligenceSnapshot {
  return resolveRiskIntelligenceSurface(input).snapshot;
}

export function initializeRiskIntelligenceRuntime(
  input: RiskIntelligenceAggregationInput
): RiskIntelligenceSurfaceModel {
  reportRiskIntelligence({
    phase: "runtime_init",
    owner: CANONICAL_RISK_INTELLIGENCE_OWNER,
    version: RISK_INTELLIGENCE_SURFACE_VERSION,
    dashboardContext: input.dashboardContext,
  });
  return resolveRiskIntelligenceSurface(input);
}

export function resetRiskIntelligenceRuntimeForTests(): void {
  lastSignature = null;
  lastModel = null;
}
