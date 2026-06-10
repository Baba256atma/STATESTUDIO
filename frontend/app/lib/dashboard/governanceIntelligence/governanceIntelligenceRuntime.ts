/**
 * Phase 6:1 — Governance Intelligence Runtime (single owner).
 */

import type {
  GovernanceIntelligenceAggregationInput,
  GovernanceIntelligenceSnapshot,
  GovernanceIntelligenceSurfaceModel,
} from "./governanceIntelligenceContract.ts";
import {
  CANONICAL_GOVERNANCE_INTELLIGENCE_OWNER,
  GOVERNANCE_INTELLIGENCE_SURFACE_VERSION,
} from "./governanceIntelligenceContract.ts";
import { aggregateGovernanceIntelligence } from "./governanceIntelligenceAggregation.ts";
import { reportGovernanceIntelligence } from "./governanceIntelligenceLogging.ts";

let lastSignature: string | null = null;
let lastModel: GovernanceIntelligenceSurfaceModel | null = null;

function buildSignature(input: GovernanceIntelligenceAggregationInput): string {
  return JSON.stringify({
    dashboardContext: input.dashboardContext,
    contextId: input.normalizedContext?.id ?? null,
    objectId: input.selectedObjectId ?? null,
    timelineActive: input.timelineActive ?? false,
  });
}

export function resolveGovernanceIntelligenceSurface(
  input: GovernanceIntelligenceAggregationInput
): GovernanceIntelligenceSurfaceModel {
  const signature = buildSignature(input);
  if (lastSignature === signature && lastModel) return lastModel;
  const model = aggregateGovernanceIntelligence(input);
  lastSignature = signature;
  lastModel = model;
  return model;
}

/** Approved feed for Executive Summary. */
export function getGovernanceIntelligenceSnapshotForExecutiveSummary(
  input: GovernanceIntelligenceAggregationInput
): GovernanceIntelligenceSnapshot {
  return resolveGovernanceIntelligenceSurface(input).snapshot;
}

export function initializeGovernanceIntelligenceRuntime(
  input: GovernanceIntelligenceAggregationInput
): GovernanceIntelligenceSurfaceModel {
  reportGovernanceIntelligence({
    phase: "runtime_init",
    owner: CANONICAL_GOVERNANCE_INTELLIGENCE_OWNER,
    version: GOVERNANCE_INTELLIGENCE_SURFACE_VERSION,
    dashboardContext: input.dashboardContext,
  });
  return resolveGovernanceIntelligenceSurface(input);
}

export function resetGovernanceIntelligenceRuntimeForTests(): void {
  lastSignature = null;
  lastModel = null;
}
