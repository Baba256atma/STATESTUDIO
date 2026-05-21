import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectLatestDistributedExecutiveCognitionSnapshot } from "../consensus-intelligence/unifiedConsensusRuntimeSelectors";
import { selectLatestGovernanceCoherenceSnapshot } from "../decision-orchestration/institutionalAlignmentSelectors";
import { selectLatestEnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeSelectors";
import { selectLatestEnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeSelectors";
import { selectInstitutionalLearningGovernanceSnapshot } from "../institutional-memory/institutionalGovernanceSelectors";
import { selectLatestEnterpriseMemorySnapshot } from "../institutional-memory/unifiedInstitutionalMemorySelectors";
import { selectLatestEnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionSelectors";
import { selectLatestEnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionSelectors";
import { selectLatestCivilizationFragilitySnapshot } from "./civilizationFragilitySelectors";
import { selectLatestEcosystemSynchronizationSnapshot } from "./ecosystemSynchronizationSelectors";
import { evaluateStrategicInstitutionalInfluence } from "./institutionalInfluenceEngine";
import type { InstitutionalInfluenceResult } from "./institutionalInfluenceTypes";
import { selectLatestInstitutionalConsciousnessSnapshot } from "./institutionalConsciousnessSelectors";

/**
 * D9:8:4 — Passive strategic institutional influence + civilization-scale operational impact awareness.
 * Civilization Fragility Propagation → Institutional Influence Intelligence → Civilization-Scale Operational Impact Awareness
 */
export function integrateInstitutionalInfluenceWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  operationalTopologyStressed?: boolean;
  now?: number;
}): InstitutionalInfluenceResult {
  const organizationId = params.organizationId.trim() || "nexora-default";
  const cognition = params.cognitionSnapshot;

  return evaluateStrategicInstitutionalInfluence({
    organizationId,
    cognitionSnapshot: cognition,
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
