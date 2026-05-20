import { stableSignature } from "../../../intelligence/shared/dedupe";
import type { AdaptiveGovernanceIntelligenceSnapshot } from "../adaptiveGovernanceTypes";
import type { StrategicAlignmentIntegritySnapshot } from "./enterpriseStrategicCoherenceTypes";

/**
 * F9:2 — Merges F9:1 governance + F9:2 coherence into one continuity-safe snapshot (single provider).
 */
export function mergeEnterpriseGovernanceSnapshot(
  governance: AdaptiveGovernanceIntelligenceSnapshot,
  coherence: StrategicAlignmentIntegritySnapshot
): AdaptiveGovernanceIntelligenceSnapshot {
  const displayHeadline = coherence.enterpriseCoherenceActive
    ? coherence.coherenceHeadline
    : governance.governanceHeadline;

  const displaySubline = coherence.enterpriseCoherenceActive
    ? coherence.coherenceSubline
    : governance.governanceSubline;

  const signature = stableSignature([
    "f9-governance-stack",
    governance.signature,
    coherence.signature,
  ]);

  return {
    ...governance,
    signature,
    visible: governance.visible || coherence.visible,
    governanceHeadline: displayHeadline,
    governanceSubline: displaySubline,
    timelineGovernanceLine: coherence.enterpriseCoherenceActive
      ? coherence.timelineCoherenceLine
      : governance.timelineGovernanceLine,
    assistantGovernanceLine: coherence.assistantCoherenceLine || governance.assistantGovernanceLine,
    coherencePosture: coherence.coherencePosture,
    coherenceHeadline: coherence.coherenceHeadline,
    coherenceSubline: coherence.coherenceSubline,
    alignmentIntegrityLine: coherence.alignmentIntegrityLine,
    operationalHarmonyLine: coherence.operationalHarmonyLine,
    fragmentationAwarenessLine: coherence.fragmentationAwarenessLine,
    timelineCoherenceLine: coherence.timelineCoherenceLine,
    assistantCoherenceLine: coherence.assistantCoherenceLine,
    enterpriseCoherenceActive: coherence.enterpriseCoherenceActive,
    strategicAlignmentIntegrityActive: coherence.strategicAlignmentIntegrityActive,
    strategicCoherence: coherence,
  };
}
