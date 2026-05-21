import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectInstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemorySelectors";
import { selectInstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturitySelectors";
import { selectLatestEnterpriseRecommendationSnapshot } from "../foresight-cognition/advisoryForesightSelectors";
import { selectLatestEnterprisePreparednessSnapshot } from "../foresight-cognition/preparednessCognitionSelectors";
import { selectLatestInterventionWindowSnapshot } from "../foresight-cognition/interventionTimingSelectors";
import { selectLatestEnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeSelectors";
import { selectLatestEnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionSelectors";
import { selectLatestOrganizationalReplaySnapshot } from "../temporal-cognition/operationalReplaySelectors";
import { evaluateExecutiveDecisionOrchestration } from "./decisionOrchestrationEngine";
import type { ExecutiveDecisionOrchestrationResult } from "./decisionOrchestrationTypes";

/**
 * D9:5:1 — Passive executive decision orchestration + action readiness integration.
 * Unified Foresight Runtime → Decision Orchestration → Executive Action Readiness Awareness
 */
export function integrateDecisionOrchestrationWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  pressureTopologyStressed?: boolean;
  now?: number;
}): ExecutiveDecisionOrchestrationResult {
  const organizationId = params.organizationId.trim() || "nexora-default";
  const cognition = params.cognitionSnapshot;

  return evaluateExecutiveDecisionOrchestration({
    organizationId,
    cognitionSnapshot: cognition,
    anticipatorySnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    advisorySnapshot: selectLatestEnterpriseRecommendationSnapshot(organizationId),
    preparednessSnapshot: selectLatestEnterprisePreparednessSnapshot(organizationId),
    interventionSnapshot: selectLatestInterventionWindowSnapshot(organizationId),
    memorySnapshot: selectInstitutionalLearningSnapshot(organizationId),
    maturitySnapshot: selectInstitutionalIntelligenceMaturitySnapshot(organizationId),
    replaySnapshot: selectLatestOrganizationalReplaySnapshot(organizationId),
    temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(organizationId),
    enterpriseNarrativeLine:
      cognition?.timelineStrategicEvolutionLine ??
      cognition?.organizationalLearningLine ??
      "",
    resilienceForecastLine: cognition?.resilienceForecastLine ?? "",
    fragilityElevated: params.fragilityElevated ?? false,
    continuityPreserved: params.continuityPreserved ?? true,
    pressureTopologyStressed: params.pressureTopologyStressed ?? false,
    now: params.now,
  });
}
