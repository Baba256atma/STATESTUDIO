import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectLatestAdaptiveSequencingSnapshot } from "../decision-orchestration/adaptiveSequencingSelectors";
import { selectLatestConfidenceArbitrationSnapshot } from "../decision-orchestration/decisionConfidenceSelectors";
import { selectLatestGovernanceCoherenceSnapshot } from "../decision-orchestration/institutionalAlignmentSelectors";
import { selectLatestEnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeSelectors";
import { selectLatestEnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeSelectors";
import { selectInstitutionalLearningGovernanceSnapshot } from "../institutional-memory/institutionalGovernanceSelectors";
import { selectLatestEnterpriseMemorySnapshot } from "../institutional-memory/unifiedInstitutionalMemorySelectors";
import { selectLatestEnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionSelectors";
import { selectLatestExecutiveCognitiveDriftSnapshot } from "./cognitiveDriftSelectors";
import { selectLatestExecutiveCognitiveUncertaintySnapshot } from "./cognitiveUncertaintySelectors";
import { selectLatestStrategicExplanationSnapshot } from "./explainabilitySelectors";
import { selectLatestMetaCognitionRuntimeSnapshot } from "./metaCognitionSelectors";
import { selectLatestStrategicReasoningIntegritySnapshot } from "./reasoningIntegritySelectors";
import { selectLatestExecutiveTrustCalibrationSnapshot } from "./trustCalibrationSelectors";
import { evaluateExecutiveCognitiveResilience } from "./cognitiveResilienceEngine";
import type { ExecutiveCognitiveResilienceResult } from "./cognitiveResilienceTypes";

/**
 * D9:6:7 — Passive executive cognitive resilience monitoring integration.
 * Trust Calibration → Cognitive Resilience Monitoring → Enterprise Intelligence Survivability Awareness
 */
export function integrateCognitiveResilienceWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
}): ExecutiveCognitiveResilienceResult {
  const organizationId = params.organizationId.trim() || "nexora-default";
  const cognition = params.cognitionSnapshot;

  return evaluateExecutiveCognitiveResilience({
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
