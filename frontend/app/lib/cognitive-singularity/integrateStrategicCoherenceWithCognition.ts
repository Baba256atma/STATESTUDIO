import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectLatestDistributedExecutiveCognitionSnapshot } from "../consensus-intelligence/unifiedConsensusRuntimeSelectors";
import { selectLatestCivilizationScaleEnterpriseSnapshot } from "../institutional-consciousness/unifiedInstitutionalConsciousnessSelectors";
import { selectLatestEnterpriseMemorySnapshot } from "../institutional-memory/unifiedInstitutionalMemorySelectors";
import { selectLatestEnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionSelectors";
import { selectLatestEnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeSelectors";
import { selectLatestEnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeSelectors";
import { selectLatestEnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionSelectors";
import { selectLatestEnterpriseAwarenessSynchronizationSnapshot } from "./awarenessSynchronizationSelectors";
import { selectLatestEnterpriseCognitiveSingularitySnapshot } from "./cognitiveSingularitySelectors";
import { selectLatestUnifiedStrategicIntentSnapshot } from "./strategicIntentSelectors";
import { selectLatestEnterpriseStrategicIdentitySnapshot } from "./strategicIdentitySelectors";
import { selectLatestEnterpriseStrategicWillSnapshot } from "./strategicWillSelectors";
import { evaluateUnifiedStrategicCoherence } from "./strategicCoherenceEngine";
import type { UnifiedStrategicCoherenceResult } from "./strategicCoherenceTypes";

/**
 * D9:9:6 — Passive unified enterprise strategic coherence field + total-system intelligence alignment.
 * Strategic Will Intelligence → Strategic Coherence Field
 */
export function integrateStrategicCoherenceWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  operationalTopologyStressed?: boolean;
  cognitionConverged?: boolean;
  now?: number;
}): UnifiedStrategicCoherenceResult {
  const organizationId = params.organizationId.trim() || "nexora-default";
  const cognition = params.cognitionSnapshot;

  return evaluateUnifiedStrategicCoherence({
    organizationId,
    cognitionSnapshot: cognition,
    enterpriseStrategicWillSnapshot: selectLatestEnterpriseStrategicWillSnapshot(organizationId),
    enterpriseStrategicIdentitySnapshot:
      selectLatestEnterpriseStrategicIdentitySnapshot(organizationId),
    unifiedStrategicIntentSnapshot: selectLatestUnifiedStrategicIntentSnapshot(organizationId),
    awarenessSynchronizationSnapshot:
      selectLatestEnterpriseAwarenessSynchronizationSnapshot(organizationId),
    cognitiveSingularitySnapshot: selectLatestEnterpriseCognitiveSingularitySnapshot(organizationId),
    unifiedInstitutionalConsciousnessSnapshot:
      selectLatestCivilizationScaleEnterpriseSnapshot(organizationId),
    unifiedConsensusSnapshot: selectLatestDistributedExecutiveCognitionSnapshot(organizationId),
    unifiedSelfReflectiveSnapshot: selectLatestEnterpriseSelfReflectiveSnapshot(organizationId),
    memorySnapshot: selectLatestEnterpriseMemorySnapshot(organizationId),
    temporalSnapshot: selectLatestEnterpriseTimeIntelligenceSnapshot(organizationId),
    foresightSnapshot: selectLatestEnterpriseAnticipatorySnapshot(organizationId),
    decisionSnapshot: selectLatestEnterpriseStrategicActionSnapshot(organizationId),
    enterpriseNarrativeLine:
      selectLatestEnterpriseAnticipatorySnapshot(organizationId)?.summary.recommendedFocus ??
      cognition?.organizationalLearningLine ??
      "",
    resilienceForecastLine: cognition?.resilienceForecastLine ?? "",
    operationalTopologyStressed: params.operationalTopologyStressed ?? params.fragilityElevated ?? false,
    fragilityElevated: params.fragilityElevated ?? false,
    continuityPreserved: params.continuityPreserved ?? true,
    cognitionConverged: params.cognitionConverged ?? params.continuityPreserved ?? true,
    now: params.now,
  });
}
