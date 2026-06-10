/**
 * Phase 6:5 — Consensus Intelligence Runtime (single owner).
 */

import type {
  ConsensusIntelligenceAggregationInput,
  ConsensusIntelligenceSnapshot,
  ConsensusIntelligenceSurfaceModel,
} from "./consensusIntelligenceContract.ts";
import {
  CANONICAL_CONSENSUS_INTELLIGENCE_OWNER,
  CONSENSUS_INTELLIGENCE_SURFACE_VERSION,
} from "./consensusIntelligenceContract.ts";
import { aggregateConsensusIntelligence } from "./consensusIntelligenceAggregation.ts";
import { reportConsensusIntelligence } from "./consensusIntelligenceLogging.ts";

let lastSignature: string | null = null;
let lastModel: ConsensusIntelligenceSurfaceModel | null = null;

function buildSignature(input: ConsensusIntelligenceAggregationInput): string {
  return JSON.stringify({
    dashboardContext: input.dashboardContext,
    contextId: input.normalizedContext?.id ?? null,
    objectId: input.selectedObjectId ?? null,
    timelineActive: input.timelineActive ?? false,
  });
}

export function resolveConsensusIntelligenceSurface(
  input: ConsensusIntelligenceAggregationInput
): ConsensusIntelligenceSurfaceModel {
  const signature = buildSignature(input);
  if (lastSignature === signature && lastModel) return lastModel;
  const model = aggregateConsensusIntelligence(input);
  lastSignature = signature;
  lastModel = model;
  return model;
}

/** Approved feed for Executive Summary. */
export function getConsensusIntelligenceSnapshotForExecutiveSummary(
  input: ConsensusIntelligenceAggregationInput
): ConsensusIntelligenceSnapshot {
  return resolveConsensusIntelligenceSurface(input).snapshot;
}

/** Approved feed for Stakeholder Intelligence presentation layer. */
export function getConsensusIntelligenceSnapshotForStakeholderIntelligence(
  input: ConsensusIntelligenceAggregationInput
): ConsensusIntelligenceSnapshot {
  return resolveConsensusIntelligenceSurface(input).snapshot;
}

/** Approved feed for Strategic Alignment presentation layer. */
export function getConsensusIntelligenceSnapshotForStrategicAlignment(
  input: ConsensusIntelligenceAggregationInput
): ConsensusIntelligenceSnapshot {
  return resolveConsensusIntelligenceSurface(input).snapshot;
}

/** Approved feed for Policy Intelligence presentation layer. */
export function getConsensusIntelligenceSnapshotForPolicyIntelligence(
  input: ConsensusIntelligenceAggregationInput
): ConsensusIntelligenceSnapshot {
  return resolveConsensusIntelligenceSurface(input).snapshot;
}

export function initializeConsensusIntelligenceRuntime(
  input: ConsensusIntelligenceAggregationInput
): ConsensusIntelligenceSurfaceModel {
  reportConsensusIntelligence({
    phase: "runtime_init",
    owner: CANONICAL_CONSENSUS_INTELLIGENCE_OWNER,
    version: CONSENSUS_INTELLIGENCE_SURFACE_VERSION,
    dashboardContext: input.dashboardContext,
  });
  return resolveConsensusIntelligenceSurface(input);
}

export function resetConsensusIntelligenceRuntimeForTests(): void {
  lastSignature = null;
  lastModel = null;
}
