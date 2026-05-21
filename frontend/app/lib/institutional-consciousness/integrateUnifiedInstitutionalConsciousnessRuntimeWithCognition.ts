import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectLatestDistributedExecutiveCognitionSnapshot } from "../consensus-intelligence/unifiedConsensusRuntimeSelectors";
import { selectLatestGovernanceCoherenceSnapshot } from "../decision-orchestration/institutionalAlignmentSelectors";
import { selectLatestEnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeSelectors";
import { selectLatestEnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeSelectors";
import { selectInstitutionalLearningGovernanceSnapshot } from "../institutional-memory/institutionalGovernanceSelectors";
import { selectLatestEnterpriseMemorySnapshot } from "../institutional-memory/unifiedInstitutionalMemorySelectors";
import { selectLatestEnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionSelectors";
import { selectLatestEnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionSelectors";
import { selectLatestCivilizationAdaptationSnapshot } from "./civilizationAdaptationSelectors";
import { selectLatestCivilizationContinuitySnapshot } from "./civilizationContinuitySelectors";
import { selectLatestCivilizationCoordinationSnapshot } from "./civilizationCoordinationSelectors";
import { selectLatestCivilizationFragilitySnapshot } from "./civilizationFragilitySelectors";
import { selectLatestCivilizationStewardshipSnapshot } from "./civilizationStewardshipSelectors";
import { selectLatestCivilizationWisdomSnapshot } from "./civilizationWisdomSelectors";
import { selectLatestEcosystemSynchronizationSnapshot } from "./ecosystemSynchronizationSelectors";
import { selectLatestInstitutionalConsciousnessSnapshot } from "./institutionalConsciousnessSelectors";
import { selectLatestInstitutionalInfluenceSnapshot } from "./institutionalInfluenceSelectors";
import { evaluateUnifiedInstitutionalConsciousnessRuntime } from "./unifiedInstitutionalConsciousnessEngine";
import type { UnifiedInstitutionalConsciousnessRuntimeResult } from "./unifiedInstitutionalConsciousnessTypes";

/**
 * D9:8:10 — Passive unified institutional consciousness runtime + civilization-scale enterprise intelligence completion.
 * Civilization Stewardship Intelligence → Unified Institutional Consciousness Runtime → Macro-System Preservation Awareness
 */
export function integrateUnifiedInstitutionalConsciousnessRuntimeWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  operationalTopologyStressed?: boolean;
  now?: number;
}): UnifiedInstitutionalConsciousnessRuntimeResult {
  const organizationId = params.organizationId.trim() || "nexora-default";
  const cognition = params.cognitionSnapshot;

  return evaluateUnifiedInstitutionalConsciousnessRuntime({
    organizationId,
    cognitionSnapshot: cognition,
    institutionalConsciousnessSnapshot: selectLatestInstitutionalConsciousnessSnapshot(organizationId),
    ecosystemSynchronizationSnapshot: selectLatestEcosystemSynchronizationSnapshot(organizationId),
    civilizationFragilitySnapshot: selectLatestCivilizationFragilitySnapshot(organizationId),
    institutionalInfluenceSnapshot: selectLatestInstitutionalInfluenceSnapshot(organizationId),
    civilizationContinuitySnapshot: selectLatestCivilizationContinuitySnapshot(organizationId),
    civilizationAdaptationSnapshot: selectLatestCivilizationAdaptationSnapshot(organizationId),
    civilizationCoordinationSnapshot: selectLatestCivilizationCoordinationSnapshot(organizationId),
    civilizationWisdomSnapshot: selectLatestCivilizationWisdomSnapshot(organizationId),
    civilizationStewardshipSnapshot: selectLatestCivilizationStewardshipSnapshot(organizationId),
    unifiedConsensusSnapshot: selectLatestDistributedExecutiveCognitionSnapshot(organizationId),
    unifiedSelfReflectiveSnapshot: selectLatestEnterpriseSelfReflectiveSnapshot(organizationId),
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(organizationId),
    temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(organizationId),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(organizationId),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(organizationId),
    governanceSnapshot: selectInstitutionalLearningGovernanceSnapshot(organizationId),
    fragilityElevated: params.fragilityElevated ?? false,
    continuityPreserved: params.continuityPreserved ?? true,
    operationalTopologyStressed: params.operationalTopologyStressed ?? params.fragilityElevated ?? false,
    now: params.now,
  });
}
