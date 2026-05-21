import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { integrateAdvisoryForesightWithCognition } from "./integrateAdvisoryForesightWithCognition";
import { integrateConsensusForesightWithCognition } from "./integrateConsensusForesightWithCognition";
import { integrateEarlyWarningWithCognition } from "./integrateEarlyWarningWithCognition";
import { integrateForesightCognitionWithCognition } from "./integrateForesightCognitionWithCognition";
import { integrateInterventionTimingWithCognition } from "./integrateInterventionTimingWithCognition";
import { integratePositiveDriftWithCognition } from "./integratePositiveDriftWithCognition";
import { integratePreparednessCognitionWithCognition } from "./integratePreparednessCognitionWithCognition";
import { integrateRiskConstellationWithCognition } from "./integrateRiskConstellationWithCognition";
import { integrateStressSimulationWithCognition } from "./integrateStressSimulationWithCognition";
import type { EnterpriseForesightPipelineResult } from "./unifiedForesightRuntimeTypes";

/**
 * D9:4:1–D9:4:9 — Canonical enterprise strategic foresight pipeline.
 * Orchestrated deterministically; does not mutate operational state.
 */
export type { EnterpriseForesightPipelineResult } from "./unifiedForesightRuntimeTypes";

export function integrateEnterpriseForesightWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  pressureTopologyStressed?: boolean;
  now?: number;
}): EnterpriseForesightPipelineResult {
  const organizationId = params.organizationId.trim() || "nexora-default";
  const base = {
    organizationId,
    cognitionSnapshot: params.cognitionSnapshot,
    fragilityElevated: params.fragilityElevated ?? false,
    continuityPreserved: params.continuityPreserved ?? true,
    pressureTopologyStressed: params.pressureTopologyStressed ?? false,
    now: params.now,
  };

  const foresightFoundation = integrateForesightCognitionWithCognition(base);
  const riskConstellation = integrateRiskConstellationWithCognition(base);
  const earlyWarning = integrateEarlyWarningWithCognition(base);
  const positiveDrift = integratePositiveDriftWithCognition(base);
  const stressSimulation = integrateStressSimulationWithCognition(base);
  const interventionTiming = integrateInterventionTimingWithCognition(base);
  const preparednessCognition = integratePreparednessCognitionWithCognition(base);
  const advisoryForesight = integrateAdvisoryForesightWithCognition(base);
  const consensusForesight = integrateConsensusForesightWithCognition(base);

  const pipelineSignature = [
    foresightFoundation.storeSignature,
    riskConstellation.storeSignature,
    earlyWarning.storeSignature,
    positiveDrift.storeSignature,
    stressSimulation.storeSignature,
    interventionTiming.storeSignature,
    preparednessCognition.storeSignature,
    advisoryForesight.storeSignature,
    consensusForesight.storeSignature,
  ].join("|");

  return {
    organizationId,
    pipelineSignature,
    foresightFoundation,
    riskConstellation,
    earlyWarning,
    positiveDrift,
    stressSimulation,
    interventionTiming,
    preparednessCognition,
    advisoryForesight,
    consensusForesight,
  };
}
