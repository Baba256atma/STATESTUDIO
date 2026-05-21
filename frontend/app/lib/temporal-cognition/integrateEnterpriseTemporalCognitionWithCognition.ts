import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { integrateCausalDependencyWithCognition } from "./integrateCausalDependencyWithCognition";
import { integrateMultiTimelineWithCognition } from "./integrateMultiTimelineWithCognition";
import { integrateOperationalReplayWithCognition } from "./integrateOperationalReplayWithCognition";
import { integrateTemporalCompressionWithCognition } from "./integrateTemporalCompressionWithCognition";
import { integrateTemporalConvergenceWithCognition } from "./integrateTemporalConvergenceWithCognition";
import { integrateTemporalCognitionWithCognition } from "./integrateTemporalCognitionWithCognition";
import { integrateTemporalDriftProjectionWithCognition } from "./integrateTemporalDriftProjectionWithCognition";
import { integrateTemporalFieldWithCognition } from "./integrateTemporalFieldWithCognition";
import { integrateTemporalMemorySyncWithCognition } from "./integrateTemporalMemorySyncWithCognition";
import type { EnterpriseTemporalCognitionPipelineResult } from "./unifiedTemporalCognitionTypes";

/**
 * D9:3:1–D9:3:9 — Canonical enterprise temporal cognition pipeline.
 * Orchestrated deterministically; does not mutate operational state.
 */
export type { EnterpriseTemporalCognitionPipelineResult } from "./unifiedTemporalCognitionTypes";

export function integrateEnterpriseTemporalCognitionWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
}): EnterpriseTemporalCognitionPipelineResult {
  const organizationId = params.organizationId.trim() || "nexora-default";
  const base = {
    organizationId,
    cognitionSnapshot: params.cognitionSnapshot,
    fragilityElevated: params.fragilityElevated ?? false,
    continuityPreserved: params.continuityPreserved ?? true,
    now: params.now,
  };

  const timelineAwareness = integrateTemporalCognitionWithCognition(base);
  const causalDependencies = integrateCausalDependencyWithCognition(base);
  const operationalReplay = integrateOperationalReplayWithCognition(base);
  const driftProjection = integrateTemporalDriftProjectionWithCognition(base);
  const divergenceAwareness = integrateMultiTimelineWithCognition(base);
  const convergenceIntelligence = integrateTemporalConvergenceWithCognition(base);
  const temporalCompression = integrateTemporalCompressionWithCognition(base);
  const crossPeriodSynchronization = integrateTemporalMemorySyncWithCognition(base);
  const longHorizonAwareness = integrateTemporalFieldWithCognition(base);

  const pipelineSignature = [
    timelineAwareness.storeSignature,
    causalDependencies.storeSignature,
    operationalReplay.storeSignature,
    driftProjection.storeSignature,
    divergenceAwareness.storeSignature,
    convergenceIntelligence.storeSignature,
    temporalCompression.storeSignature,
    crossPeriodSynchronization.storeSignature,
    longHorizonAwareness.storeSignature,
  ].join("|");

  return {
    organizationId,
    pipelineSignature,
    timelineAwareness,
    causalDependencies,
    operationalReplay,
    driftProjection,
    divergenceAwareness,
    convergenceIntelligence,
    temporalCompression,
    crossPeriodSynchronization,
    longHorizonAwareness,
  };
}
