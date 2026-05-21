import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectLatestGovernanceCoherenceSnapshot } from "../decision-orchestration/institutionalAlignmentSelectors";
import { selectLatestEnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeSelectors";
import { selectLatestEnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeSelectors";
import { selectInstitutionalLearningGovernanceSnapshot } from "../institutional-memory/institutionalGovernanceSelectors";
import { selectLatestEnterpriseMemorySnapshot } from "../institutional-memory/unifiedInstitutionalMemorySelectors";
import { selectLatestEnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionSelectors";
import { selectLatestExecutiveCollectiveLearningSnapshot } from "./collectiveLearningSelectors";
import { selectLatestStrategicConsensusSnapshot } from "./consensusIntelligenceSelectors";
import { selectLatestCollectiveStrategicGuidanceSnapshot } from "./distributedAdvisorySelectors";
import { selectLatestDistributedStrategicGovernanceSnapshot } from "./distributedGovernanceSelectors";
import { selectLatestMultiPerspectiveMemorySnapshot } from "./distributedMemorySyncSelectors";
import { selectLatestStrategicDiversitySnapshot } from "./diversityPreservationSelectors";
import { selectLatestEnterpriseConflictResolutionSnapshot } from "./perspectiveNegotiationSelectors";
import { selectLatestEnterpriseConsensusPrioritySnapshot } from "./perspectiveWeightingSelectors";
import { selectLatestCounterfactualReasoningSnapshot } from "./strategicDebateSelectors";
import { evaluateUnifiedEnterpriseConsensusRuntime } from "./unifiedConsensusRuntimeEngine";
import type { UnifiedEnterpriseConsensusRuntimeResult } from "./unifiedConsensusRuntimeTypes";

/**
 * D9:7:10 — Passive unified enterprise consensus intelligence runtime integration.
 * Distributed Strategic Governance → Unified Enterprise Consensus Runtime → Distributed Executive Strategic Cognition
 */
export function integrateUnifiedEnterpriseConsensusRuntimeWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
}): UnifiedEnterpriseConsensusRuntimeResult {
  const organizationId = params.organizationId.trim() || "nexora-default";
  const cognition = params.cognitionSnapshot;

  return evaluateUnifiedEnterpriseConsensusRuntime({
    organizationId,
    cognitionSnapshot: cognition,
    unifiedSelfReflectiveSnapshot: selectLatestEnterpriseSelfReflectiveSnapshot(organizationId),
    strategicConsensusSnapshot: selectLatestStrategicConsensusSnapshot(organizationId),
    conflictResolutionSnapshot: selectLatestEnterpriseConflictResolutionSnapshot(organizationId),
    consensusPrioritySnapshot: selectLatestEnterpriseConsensusPrioritySnapshot(organizationId),
    collectiveGuidanceSnapshot: selectLatestCollectiveStrategicGuidanceSnapshot(organizationId),
    counterfactualSnapshot: selectLatestCounterfactualReasoningSnapshot(organizationId),
    diversitySnapshot: selectLatestStrategicDiversitySnapshot(organizationId),
    collectiveLearningSnapshot: selectLatestExecutiveCollectiveLearningSnapshot(organizationId),
    memorySyncSnapshot: selectLatestMultiPerspectiveMemorySnapshot(organizationId),
    distributedGovernanceSnapshot: selectLatestDistributedStrategicGovernanceSnapshot(organizationId),
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(organizationId),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(organizationId),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(organizationId),
    governanceSnapshot: selectInstitutionalLearningGovernanceSnapshot(organizationId),
    fragilityElevated: params.fragilityElevated ?? false,
    continuityPreserved: params.continuityPreserved ?? true,
    now: params.now,
  });
}
