import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectLatestExecutiveCognitiveAdaptationSnapshot } from "./cognitiveAdaptationSelectors";
import { selectLatestExecutiveCognitiveDriftSnapshot } from "./cognitiveDriftSelectors";
import { selectLatestExecutiveCognitiveGovernanceSnapshot } from "./cognitiveGovernanceSelectors";
import { selectLatestExecutiveCognitiveResilienceSnapshot } from "./cognitiveResilienceSelectors";
import { selectLatestExecutiveCognitiveUncertaintySnapshot } from "./cognitiveUncertaintySelectors";
import { selectLatestStrategicExplanationSnapshot } from "./explainabilitySelectors";
import { selectLatestMetaCognitionRuntimeSnapshot } from "./metaCognitionSelectors";
import { selectLatestStrategicReasoningIntegritySnapshot } from "./reasoningIntegritySelectors";
import { selectLatestExecutiveTrustCalibrationSnapshot } from "./trustCalibrationSelectors";
import { evaluateUnifiedExecutiveMetaCognitionRuntime } from "./unifiedMetaCognitionEngine";
import type { UnifiedExecutiveMetaCognitionResult } from "./unifiedMetaCognitionTypes";

/**
 * D9:6:10 — Passive unified executive meta-cognition runtime integration.
 * Cognitive Governance → Unified Executive Meta-Cognition Runtime → Enterprise Self-Reflective Intelligence
 */
export function integrateUnifiedExecutiveMetaCognitionWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
}): UnifiedExecutiveMetaCognitionResult {
  const organizationId = params.organizationId.trim() || "nexora-default";
  const cognition = params.cognitionSnapshot;

  return evaluateUnifiedExecutiveMetaCognitionRuntime({
    organizationId,
    cognitionSnapshot: cognition,
    metaCognitionSnapshot: selectLatestMetaCognitionRuntimeSnapshot(organizationId),
    reasoningIntegritySnapshot: selectLatestStrategicReasoningIntegritySnapshot(organizationId),
    cognitiveDriftSnapshot: selectLatestExecutiveCognitiveDriftSnapshot(organizationId),
    cognitiveUncertaintySnapshot: selectLatestExecutiveCognitiveUncertaintySnapshot(organizationId),
    explainabilitySnapshot: selectLatestStrategicExplanationSnapshot(organizationId),
    trustCalibrationSnapshot: selectLatestExecutiveTrustCalibrationSnapshot(organizationId),
    cognitiveResilienceSnapshot: selectLatestExecutiveCognitiveResilienceSnapshot(organizationId),
    cognitiveAdaptationSnapshot: selectLatestExecutiveCognitiveAdaptationSnapshot(organizationId),
    cognitiveGovernanceSnapshot: selectLatestExecutiveCognitiveGovernanceSnapshot(organizationId),
    fragilityElevated: params.fragilityElevated ?? false,
    continuityPreserved: params.continuityPreserved ?? true,
    now: params.now,
  });
}
