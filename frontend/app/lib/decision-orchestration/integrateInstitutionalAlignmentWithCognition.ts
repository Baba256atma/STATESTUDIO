import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectInstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemorySelectors";
import { selectInstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturitySelectors";
import { selectLatestEnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeSelectors";
import { selectLatestEnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionSelectors";
import { selectLatestDependencyAwarenessSnapshot } from "./actionDependencySelectors";
import { selectLatestDecisionCoordinationSnapshot } from "./decisionOrchestrationSelectors";
import { selectLatestMultiObjectiveDecisionSnapshot } from "./priorityArbitrationSelectors";
import { selectLatestScenarioCoordinationSnapshot } from "./scenarioCoordinationSelectors";
import { selectLatestAdaptiveSequencingSnapshot } from "./adaptiveSequencingSelectors";
import { selectLatestConfidenceArbitrationSnapshot } from "./decisionConfidenceSelectors";
import { evaluateInstitutionalAlignmentIntelligence } from "./institutionalAlignmentEngine";
import type { InstitutionalAlignmentIntelligenceResult } from "./institutionalAlignmentTypes";

/**
 * D9:5:7 — Passive executive institutional alignment integration.
 * Confidence Arbitration → Institutional Alignment → Governance-Coherence Awareness
 */
export function integrateInstitutionalAlignmentWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  pressureTopologyStressed?: boolean;
  now?: number;
}): InstitutionalAlignmentIntelligenceResult {
  const organizationId = params.organizationId.trim() || "nexora-default";
  const cognition = params.cognitionSnapshot;

  return evaluateInstitutionalAlignmentIntelligence({
    organizationId,
    cognitionSnapshot: cognition,
    coordinationSnapshot: selectLatestDecisionCoordinationSnapshot(organizationId),
    dependencySnapshot: selectLatestDependencyAwarenessSnapshot(organizationId),
    arbitrationSnapshot: selectLatestMultiObjectiveDecisionSnapshot(organizationId),
    scenarioSnapshot: selectLatestScenarioCoordinationSnapshot(organizationId),
    sequencingSnapshot: selectLatestAdaptiveSequencingSnapshot(organizationId),
    confidenceSnapshot: selectLatestConfidenceArbitrationSnapshot(organizationId),
    anticipatorySnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    memorySnapshot: selectInstitutionalLearningSnapshot(organizationId),
    maturitySnapshot: selectInstitutionalIntelligenceMaturitySnapshot(organizationId),
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
