import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import { selectLatestDistributedExecutiveCognitionSnapshot } from "../consensus-intelligence/unifiedConsensusRuntimeSelectors";
import { selectLatestCivilizationScaleEnterpriseSnapshot } from "../institutional-consciousness/unifiedInstitutionalConsciousnessSelectors";
import { selectLatestEnterpriseMemorySnapshot } from "../institutional-memory/unifiedInstitutionalMemorySelectors";
import { selectLatestEnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionSelectors";
import { selectLatestEnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionSelectors";
import { selectLatestEnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeSelectors";
import { selectLatestEnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeSelectors";
import { selectLatestEnterpriseAwarenessSynchronizationSnapshot } from "./awarenessSynchronizationSelectors";
import { selectLatestEnterpriseCognitiveSingularitySnapshot } from "./cognitiveSingularitySelectors";
import { selectLatestUnifiedStrategicIntentSnapshot } from "./strategicIntentSelectors";
import { selectLatestEnterpriseStrategicIdentitySnapshot } from "./strategicIdentitySelectors";
import { selectLatestEnterpriseStrategicWillSnapshot } from "./strategicWillSelectors";
import { selectLatestUnifiedStrategicCoherenceSnapshot } from "./strategicCoherenceSelectors";
import { selectLatestEnterpriseStrategicEquilibriumSnapshot } from "./strategicEquilibriumSelectors";
import { selectLatestEnterpriseStrategicResonanceSnapshot } from "./strategicResonanceSelectors";
import { selectLatestFinalStrategicIntegrationSnapshot } from "./finalStrategicIntegrationSelectors";
import { evaluateUnifiedCognitiveSingularityRuntime } from "./unifiedCognitiveSingularityRuntimeEngine";
import type { UnifiedCognitiveSingularityRuntimeResult } from "./unifiedCognitiveSingularityRuntimeTypes";

/**
 * D9:9:10 — Passive unified enterprise cognitive singularity runtime + final strategic intelligence completion.
 * Final Strategic Integration → Unified Cognitive Singularity Runtime
 */
export function integrateUnifiedCognitiveSingularityRuntimeWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  operationalTopologyStressed?: boolean;
  cognitionConverged?: boolean;
  now?: number;
}): UnifiedCognitiveSingularityRuntimeResult {
  const organizationId = params.organizationId.trim() || "nexora-default";
  const cognition = params.cognitionSnapshot;

  return evaluateUnifiedCognitiveSingularityRuntime({
    organizationId,
    cognitionSnapshot: cognition,
    finalStrategicIntegrationSnapshot: selectLatestFinalStrategicIntegrationSnapshot(organizationId),
    enterpriseStrategicResonanceSnapshot:
      selectLatestEnterpriseStrategicResonanceSnapshot(organizationId),
    enterpriseStrategicEquilibriumSnapshot:
      selectLatestEnterpriseStrategicEquilibriumSnapshot(organizationId),
    unifiedStrategicCoherenceSnapshot: selectLatestUnifiedStrategicCoherenceSnapshot(organizationId),
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
    cognitionConverged: params.continuityPreserved ?? true,
    now: params.now,
  });
}
