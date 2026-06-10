/**
 * Phase 6:4 — Stakeholder Intelligence Runtime (single owner).
 */

import type {
  StakeholderIntelligenceAggregationInput,
  StakeholderIntelligenceSnapshot,
  StakeholderIntelligenceSurfaceModel,
} from "./stakeholderIntelligenceContract.ts";
import {
  CANONICAL_STAKEHOLDER_INTELLIGENCE_OWNER,
  STAKEHOLDER_INTELLIGENCE_SURFACE_VERSION,
} from "./stakeholderIntelligenceContract.ts";
import { aggregateStakeholderIntelligence } from "./stakeholderIntelligenceAggregation.ts";
import { reportStakeholderIntelligence } from "./stakeholderIntelligenceLogging.ts";

let lastSignature: string | null = null;
let lastModel: StakeholderIntelligenceSurfaceModel | null = null;

function buildSignature(input: StakeholderIntelligenceAggregationInput): string {
  return JSON.stringify({
    dashboardContext: input.dashboardContext,
    contextId: input.normalizedContext?.id ?? null,
    objectId: input.selectedObjectId ?? null,
    timelineActive: input.timelineActive ?? false,
  });
}

export function resolveStakeholderIntelligenceSurface(
  input: StakeholderIntelligenceAggregationInput
): StakeholderIntelligenceSurfaceModel {
  const signature = buildSignature(input);
  if (lastSignature === signature && lastModel) return lastModel;
  const model = aggregateStakeholderIntelligence(input);
  lastSignature = signature;
  lastModel = model;
  return model;
}

/** Approved feed for Executive Summary. */
export function getStakeholderIntelligenceSnapshotForExecutiveSummary(
  input: StakeholderIntelligenceAggregationInput
): StakeholderIntelligenceSnapshot {
  return resolveStakeholderIntelligenceSurface(input).snapshot;
}

/** Approved feed for Policy Intelligence presentation layer. */
export function getStakeholderIntelligenceSnapshotForPolicyIntelligence(
  input: StakeholderIntelligenceAggregationInput
): StakeholderIntelligenceSnapshot {
  return resolveStakeholderIntelligenceSurface(input).snapshot;
}

/** Approved feed for Strategic Alignment presentation layer. */
export function getStakeholderIntelligenceSnapshotForStrategicAlignment(
  input: StakeholderIntelligenceAggregationInput
): StakeholderIntelligenceSnapshot {
  return resolveStakeholderIntelligenceSurface(input).snapshot;
}

export function initializeStakeholderIntelligenceRuntime(
  input: StakeholderIntelligenceAggregationInput
): StakeholderIntelligenceSurfaceModel {
  reportStakeholderIntelligence({
    phase: "runtime_init",
    owner: CANONICAL_STAKEHOLDER_INTELLIGENCE_OWNER,
    version: STAKEHOLDER_INTELLIGENCE_SURFACE_VERSION,
    dashboardContext: input.dashboardContext,
  });
  return resolveStakeholderIntelligenceSurface(input);
}

export function resetStakeholderIntelligenceRuntimeForTests(): void {
  lastSignature = null;
  lastModel = null;
}
