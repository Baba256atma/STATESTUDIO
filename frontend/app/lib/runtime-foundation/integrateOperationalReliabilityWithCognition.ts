import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectLatestFinalStrategicIntelligenceSnapshot } from "../cognitive-singularity/unifiedCognitiveSingularityRuntimeSelectors";
import { selectLatestEnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeSelectors";
import { selectLatestEnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionSelectors";
import { selectLatestMVPStrategicReadinessSnapshot } from "./enterpriseRuntimeFoundationSelectors";
import { selectEnterpriseRuntimeGovernanceSignals } from "./enterpriseRuntimeFoundationSelectors";
import { evaluateExecutiveOperationalReliability } from "./operationalReliabilityEngine";
import type { ExecutiveOperationalReliabilityResult } from "./operationalReliabilityTypes";

/**
 * D9:10:2 — Passive executive operational reliability + enterprise runtime trust stabilization.
 * Runtime Foundation → Operational Reliability Intelligence → Runtime Trust Stabilization
 */
export function integrateOperationalReliabilityWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  operationalTopologyStressed?: boolean;
  cognitionConverged?: boolean;
  runtimeStable?: boolean;
  sessionHydrated?: boolean;
  now?: number;
}): ExecutiveOperationalReliabilityResult {
  const organizationId = params.organizationId.trim() || "nexora-default";
  const cognition = params.cognitionSnapshot;
  const runtimeStable = params.runtimeStable ?? true;
  const sessionHydrated = params.sessionHydrated ?? true;

  return evaluateExecutiveOperationalReliability({
    organizationId,
    cognitionSnapshot: cognition,
    mvpStrategicReadinessSnapshot: selectLatestMVPStrategicReadinessSnapshot(organizationId),
    finalStrategicIntelligenceSnapshot:
      selectLatestFinalStrategicIntelligenceSnapshot(organizationId),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(organizationId),
    unifiedSelfReflectiveSnapshot: selectLatestEnterpriseSelfReflectiveSnapshot(organizationId),
    runtimeGovernanceSignals: selectEnterpriseRuntimeGovernanceSignals(organizationId),
    panelRuntimeHealth: {
      panelStable: runtimeStable && sessionHydrated,
      panelFlashDetected: !runtimeStable || params.fragilityElevated === true,
      disappearingPanelSymptom: params.fragilityElevated === true && !runtimeStable,
      transitionLatencyElevated: params.operationalTopologyStressed ?? params.fragilityElevated ?? false,
    },
    sceneStability: {
      sceneReactionStable: params.continuityPreserved !== false,
      sceneContractConsistent:
        params.continuityPreserved !== false && runtimeStable && params.cognitionConverged !== false,
      reactionWithoutContractReason:
        params.continuityPreserved === false || (params.fragilityElevated === true && !runtimeStable),
    },
    operationalTopologyStressed: params.operationalTopologyStressed ?? params.fragilityElevated ?? false,
    fragilityElevated: params.fragilityElevated ?? false,
    continuityPreserved: params.continuityPreserved ?? true,
    cognitionConverged: params.continuityPreserved ?? true,
    runtimeStable,
    sessionHydrated,
    now: params.now,
  });
}
