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
import { evaluateUnifiedStrategicIntent } from "./strategicIntentEngine";
import type { UnifiedStrategicIntentResult } from "./strategicIntentTypes";

/**
 * D9:9:3 — Passive executive unified strategic intent intelligence + enterprise purpose alignment runtime.
 * Awareness Synchronization → Strategic Intent Alignment → Enterprise Purpose Runtime
 */
export function integrateStrategicIntentWithCognition(params: {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  operationalTopologyStressed?: boolean;
  cognitionConverged?: boolean;
  now?: number;
}): UnifiedStrategicIntentResult {
  const organizationId = params.organizationId.trim() || "nexora-default";
  const cognition = params.cognitionSnapshot;

  return evaluateUnifiedStrategicIntent({
    organizationId,
    cognitionSnapshot: cognition,
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
