import { stableSignature } from "../../../intelligence/shared/dedupe";
import type { AdaptiveGovernanceIntelligenceSnapshot } from "../../governance/adaptiveGovernanceTypes";
import type { UnifiedStrategicConsciousnessRuntimeSnapshot } from "./unifiedStrategicConsciousnessTypes";

/**
 * F10:5 — Merges unified strategic consciousness into the complete enterprise intelligence snapshot.
 */
export function mergeUnifiedStrategicConsciousness(
  stack: AdaptiveGovernanceIntelligenceSnapshot,
  consciousness: UnifiedStrategicConsciousnessRuntimeSnapshot
): AdaptiveGovernanceIntelligenceSnapshot {
  const useConsciousnessDisplay =
    consciousness.enterpriseMetaIntelligenceActive ||
    (consciousness.unifiedStrategicConsciousnessActive &&
      consciousness.metaIntelligencePosture !== "idle");

  const displayHeadline = useConsciousnessDisplay
    ? consciousness.consciousnessHeadline
    : stack.governanceHeadline;

  const displaySubline = useConsciousnessDisplay
    ? consciousness.consciousnessSubline
    : stack.governanceSubline;

  const signature = stableSignature([
    "f10-enterprise-meta-intelligence-complete",
    stack.signature,
    consciousness.signature,
  ]);

  const assistantLine =
    consciousness.assistantMetaIntelligenceLine ||
    stack.assistantStrategicForesightLine ||
    stack.assistantInstitutionalReflectionLine ||
    stack.assistantMetaCognitionLine ||
    stack.assistantUnifiedGovernanceLine ||
    stack.assistantAdaptationLine ||
    stack.assistantStabilityLine ||
    stack.assistantCalibrationLine ||
    stack.assistantCoherenceLine ||
    stack.assistantGovernanceLine;

  return {
    ...stack,
    signature,
    visible: stack.visible || consciousness.visible,
    governanceHeadline: displayHeadline,
    governanceSubline: displaySubline,
    timelineGovernanceLine: useConsciousnessDisplay
      ? consciousness.timelineStrategicContinuityLine
      : stack.timelineGovernanceLine,
    assistantGovernanceLine: assistantLine,
    metaIntelligencePosture: consciousness.metaIntelligencePosture,
    consciousnessHeadline: consciousness.consciousnessHeadline,
    consciousnessSubline: consciousness.consciousnessSubline,
    cognitionIntegrityLine: consciousness.cognitionIntegrityLine,
    continuityHealthLine: consciousness.continuityHealthLine,
    crossLayerSyncLine: consciousness.crossLayerSyncLine,
    executiveAttentionLine: consciousness.executiveAttentionLine,
    timelineStrategicContinuityLine: consciousness.timelineStrategicContinuityLine,
    assistantMetaIntelligenceLine: consciousness.assistantMetaIntelligenceLine,
    unifiedStrategicConsciousnessActive: consciousness.unifiedStrategicConsciousnessActive,
    enterpriseMetaIntelligenceActive: consciousness.enterpriseMetaIntelligenceActive,
    unifiedStrategicConsciousness: consciousness,
  };
}
