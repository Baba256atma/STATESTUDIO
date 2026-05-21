import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectLatestGovernanceCoherenceSnapshot } from "../decision-orchestration/institutionalAlignmentSelectors";
import { selectLatestEnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeSelectors";
import { selectLatestEnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeSelectors";
import { selectInstitutionalLearningGovernanceSnapshot } from "../institutional-memory/institutionalGovernanceSelectors";
import { selectLatestEnterpriseMemorySnapshot } from "../institutional-memory/unifiedInstitutionalMemorySelectors";
import { selectLatestEnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionSelectors";
import { selectLatestExecutiveCollectiveLearningSnapshot } from "./collectiveLearningSelectors";
import { selectLatestStrategicConsensusSnapshot } from "./consensusIntelligenceSelectors";
import { evaluateDistributedStrategicGovernance } from "./distributedGovernanceEngine";
import type { DistributedStrategicGovernanceResult } from "./distributedGovernanceTypes";
import { selectLatestCollectiveStrategicGuidanceSnapshot } from "./distributedAdvisorySelectors";
import { selectLatestMultiPerspectiveMemorySnapshot } from "./distributedMemorySyncSelectors";
import { selectLatestStrategicDiversitySnapshot } from "./diversityPreservationSelectors";
import { selectLatestEnterpriseConflictResolutionSnapshot } from "./perspectiveNegotiationSelectors";
import { selectLatestEnterpriseConsensusPrioritySnapshot } from "./perspectiveWeightingSelectors";
import { selectLatestCounterfactualReasoningSnapshot } from "./strategicDebateSelectors";

/**
 * D9:7:9 — Passive executive distributed strategic governance + enterprise collective intelligence integrity.
 * Distributed Memory Synchronization → Distributed Strategic Governance → Enterprise Collective Intelligence Integrity
 */
export function integrateDistributedGovernanceWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
}): DistributedStrategicGovernanceResult {
  const organizationId = params.organizationId.trim() || "nexora-default";
  const cognition = params.cognitionSnapshot;

  return evaluateDistributedStrategicGovernance({
    organizationId,
    cognitionSnapshot: cognition,
    strategicConsensusSnapshot: selectLatestStrategicConsensusSnapshot(organizationId),
    conflictResolutionSnapshot: selectLatestEnterpriseConflictResolutionSnapshot(organizationId),
    consensusPrioritySnapshot: selectLatestEnterpriseConsensusPrioritySnapshot(organizationId),
    collectiveGuidanceSnapshot: selectLatestCollectiveStrategicGuidanceSnapshot(organizationId),
    counterfactualSnapshot: selectLatestCounterfactualReasoningSnapshot(organizationId),
    diversitySnapshot: selectLatestStrategicDiversitySnapshot(organizationId),
    collectiveLearningSnapshot: selectLatestExecutiveCollectiveLearningSnapshot(organizationId),
    memorySyncSnapshot: selectLatestMultiPerspectiveMemorySnapshot(organizationId),
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
