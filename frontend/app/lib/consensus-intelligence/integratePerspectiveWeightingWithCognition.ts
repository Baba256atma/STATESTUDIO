import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectLatestGovernanceCoherenceSnapshot } from "../decision-orchestration/institutionalAlignmentSelectors";
import { selectLatestEnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeSelectors";
import { selectLatestEnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeSelectors";
import { selectInstitutionalLearningGovernanceSnapshot } from "../institutional-memory/institutionalGovernanceSelectors";
import { selectLatestEnterpriseMemorySnapshot } from "../institutional-memory/unifiedInstitutionalMemorySelectors";
import { selectLatestEnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionSelectors";
import { selectLatestStrategicConsensusSnapshot } from "./consensusIntelligenceSelectors";
import { selectLatestEnterpriseConflictResolutionSnapshot } from "./perspectiveNegotiationSelectors";
import { evaluateStrategicPerspectiveWeighting } from "./perspectiveWeightingEngine";
import type { StrategicPerspectiveWeightingResult } from "./perspectiveWeightingTypes";

/**
 * D9:7:3 — Passive executive strategic perspective weighting + adaptive consensus prioritization.
 * Perspective Negotiation → Perspective Weighting → Adaptive Enterprise Consensus Prioritization
 */
export function integratePerspectiveWeightingWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
}): StrategicPerspectiveWeightingResult {
  const organizationId = params.organizationId.trim() || "nexora-default";
  const cognition = params.cognitionSnapshot;

  return evaluateStrategicPerspectiveWeighting({
    organizationId,
    cognitionSnapshot: cognition,
    strategicConsensusSnapshot: selectLatestStrategicConsensusSnapshot(organizationId),
    conflictResolutionSnapshot: selectLatestEnterpriseConflictResolutionSnapshot(organizationId),
    unifiedSelfReflectiveSnapshot: selectLatestEnterpriseSelfReflectiveSnapshot(organizationId),
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(organizationId),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(organizationId),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(organizationId),
    governanceSnapshot: selectInstitutionalLearningGovernanceSnapshot(organizationId),
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
