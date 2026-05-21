import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectLatestDistributedExecutiveCognitionSnapshot } from "../consensus-intelligence/unifiedConsensusRuntimeSelectors";
import { selectLatestGovernanceCoherenceSnapshot } from "../decision-orchestration/institutionalAlignmentSelectors";
import { selectLatestEnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeSelectors";
import { selectLatestEnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeSelectors";
import { selectInstitutionalLearningGovernanceSnapshot } from "../institutional-memory/institutionalGovernanceSelectors";
import { selectLatestEnterpriseMemorySnapshot } from "../institutional-memory/unifiedInstitutionalMemorySelectors";
import { selectLatestEnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionSelectors";
import { selectLatestEnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionSelectors";
import { evaluateCivilizationWisdomIntelligence } from "./civilizationWisdomEngine";
import type { CivilizationWisdomResult } from "./civilizationWisdomTypes";
import { selectLatestCivilizationAdaptationSnapshot } from "./civilizationAdaptationSelectors";
import { selectLatestCivilizationContinuitySnapshot } from "./civilizationContinuitySelectors";
import { selectLatestCivilizationCoordinationSnapshot } from "./civilizationCoordinationSelectors";
import { selectLatestCivilizationFragilitySnapshot } from "./civilizationFragilitySelectors";
import { selectLatestEcosystemSynchronizationSnapshot } from "./ecosystemSynchronizationSelectors";
import { selectLatestInstitutionalConsciousnessSnapshot } from "./institutionalConsciousnessSelectors";
import { selectLatestInstitutionalInfluenceSnapshot } from "./institutionalInfluenceSelectors";

/**
 * D9:8:8 — Passive strategic civilization wisdom + macro-institutional learning-convergence awareness.
 * Civilization Coordination Intelligence → Civilization Wisdom Intelligence → Macro-Institutional Learning-Convergence Awareness
 */
export function integrateCivilizationWisdomWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  operationalTopologyStressed?: boolean;
  now?: number;
}): CivilizationWisdomResult {
  const organizationId = params.organizationId.trim() || "nexora-default";
  const cognition = params.cognitionSnapshot;

  return evaluateCivilizationWisdomIntelligence({
    organizationId,
    cognitionSnapshot: cognition,
    civilizationCoordinationSnapshot: selectLatestCivilizationCoordinationSnapshot(organizationId),
    civilizationAdaptationSnapshot: selectLatestCivilizationAdaptationSnapshot(organizationId),
    civilizationContinuitySnapshot: selectLatestCivilizationContinuitySnapshot(organizationId),
    institutionalInfluenceSnapshot: selectLatestInstitutionalInfluenceSnapshot(organizationId),
    civilizationFragilitySnapshot: selectLatestCivilizationFragilitySnapshot(organizationId),
    ecosystemSynchronizationSnapshot: selectLatestEcosystemSynchronizationSnapshot(organizationId),
    institutionalConsciousnessSnapshot: selectLatestInstitutionalConsciousnessSnapshot(organizationId),
    unifiedConsensusSnapshot: selectLatestDistributedExecutiveCognitionSnapshot(organizationId),
    unifiedSelfReflectiveSnapshot: selectLatestEnterpriseSelfReflectiveSnapshot(organizationId),
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(organizationId),
    temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(organizationId),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(organizationId),
    governanceCoherenceSnapshot: selectLatestGovernanceCoherenceSnapshot(organizationId),
    governanceSnapshot: selectInstitutionalLearningGovernanceSnapshot(organizationId),
    enterpriseNarrativeLine:
      selectLatestEnterpriseAnticipatorySnapshot(organizationId)?.summary.recommendedFocus ??
      cognition?.organizationalLearningLine ??
      "",
    resilienceForecastLine: cognition?.resilienceForecastLine ?? "",
    operationalTopologyStressed: params.operationalTopologyStressed ?? params.fragilityElevated ?? false,
    fragilityElevated: params.fragilityElevated ?? false,
    continuityPreserved: params.continuityPreserved ?? true,
    now: params.now,
  });
}
