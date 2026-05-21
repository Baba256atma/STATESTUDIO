import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectLatestAdaptiveSequencingSnapshot } from "../decision-orchestration/adaptiveSequencingSelectors";
import { selectLatestConfidenceArbitrationSnapshot } from "../decision-orchestration/decisionConfidenceSelectors";
import { selectLatestGovernanceCoherenceSnapshot } from "../decision-orchestration/institutionalAlignmentSelectors";
import { selectLatestEnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeSelectors";
import { selectLatestEnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeSelectors";
import { selectInstitutionalLearningGovernanceSnapshot } from "../institutional-memory/institutionalGovernanceSelectors";
import { selectLatestEnterpriseMemorySnapshot } from "../institutional-memory/unifiedInstitutionalMemorySelectors";
import { selectLatestEnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionSelectors";
import { selectLatestExecutiveCognitiveAdaptationSnapshot } from "./cognitiveAdaptationSelectors";
import { selectLatestExecutiveCognitiveDriftSnapshot } from "./cognitiveDriftSelectors";
import { selectLatestExecutiveCognitiveResilienceSnapshot } from "./cognitiveResilienceSelectors";
import { selectLatestExecutiveCognitiveUncertaintySnapshot } from "./cognitiveUncertaintySelectors";
import { evaluateExecutiveCognitiveGovernance } from "./cognitiveGovernanceEngine";
import type { ExecutiveCognitiveGovernanceResult } from "./cognitiveGovernanceTypes";
import { selectLatestStrategicExplanationSnapshot } from "./explainabilitySelectors";
import { selectLatestMetaCognitionRuntimeSnapshot } from "./metaCognitionSelectors";
import { selectLatestStrategicReasoningIntegritySnapshot } from "./reasoningIntegritySelectors";
import { selectLatestExecutiveTrustCalibrationSnapshot } from "./trustCalibrationSelectors";

/**
 * D9:6:9 — Passive executive cognitive governance intelligence integration.
 * Adaptive Self-Stabilization → Cognitive Governance → Enterprise Strategic Self-Regulation
 */
export function integrateCognitiveGovernanceWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
}): ExecutiveCognitiveGovernanceResult {
  const organizationId = params.organizationId.trim() || "nexora-default";
  const cognition = params.cognitionSnapshot;

  return evaluateExecutiveCognitiveGovernance({
    organizationId,
    cognitionSnapshot: cognition,
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(organizationId),
    temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(organizationId),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(organizationId),
    metaCognitionSnapshot: selectLatestMetaCognitionRuntimeSnapshot(organizationId),
    reasoningIntegritySnapshot: selectLatestStrategicReasoningIntegritySnapshot(organizationId),
    cognitiveDriftSnapshot: selectLatestExecutiveCognitiveDriftSnapshot(organizationId),
    cognitiveUncertaintySnapshot: selectLatestExecutiveCognitiveUncertaintySnapshot(organizationId),
    explainabilitySnapshot: selectLatestStrategicExplanationSnapshot(organizationId),
    trustCalibrationSnapshot: selectLatestExecutiveTrustCalibrationSnapshot(organizationId),
    cognitiveResilienceSnapshot: selectLatestExecutiveCognitiveResilienceSnapshot(organizationId),
    cognitiveAdaptationSnapshot: selectLatestExecutiveCognitiveAdaptationSnapshot(organizationId),
    confidenceSnapshot: selectLatestConfidenceArbitrationSnapshot(organizationId),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(organizationId),
    governanceSnapshot: selectInstitutionalLearningGovernanceSnapshot(organizationId),
    sequencingSnapshot: selectLatestAdaptiveSequencingSnapshot(organizationId),
    enterpriseNarrativeLine:
      selectLatestEnterpriseAnticipatorySnapshot(organizationId)?.summary.recommendedFocus ??
      cognition?.organizationalLearningLine ??
      "",
    resilienceForecastLine: cognition?.resilienceForecastLine ?? "",
    fragilityElevated: params.fragilityElevated ?? false,
    continuityPreserved: params.continuityPreserved ?? true,
    now: params.now,
  });
}
