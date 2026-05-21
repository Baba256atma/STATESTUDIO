import { stableSignature } from "../../../intelligence/shared/dedupe";
import type { AdaptiveGovernanceIntelligenceSnapshot } from "../../governance/adaptiveGovernanceTypes";
import type { AutonomousInstitutionalIntelligenceRuntimeSnapshot } from "./enterpriseCognitiveRuntimeTypes";

/**
 * F10:6 — Merges final institutional intelligence into the complete enterprise snapshot.
 */
export function mergeAutonomousInstitutionalIntelligence(
  stack: AdaptiveGovernanceIntelligenceSnapshot,
  institutional: AutonomousInstitutionalIntelligenceRuntimeSnapshot
): AdaptiveGovernanceIntelligenceSnapshot {
  const useInstitutionalDisplay =
    institutional.enterpriseCognitiveRuntimeComplete ||
    (institutional.autonomousInstitutionalIntelligenceActive &&
      institutional.institutionalIntelligencePosture !== "idle");

  const displayHeadline = useInstitutionalDisplay
    ? institutional.institutionalHeadline
    : stack.governanceHeadline;

  const displaySubline = useInstitutionalDisplay
    ? institutional.institutionalSubline
    : stack.governanceSubline;

  const signature = stableSignature([
    "f-series-enterprise-cognitive-runtime-complete",
    stack.signature,
    institutional.signature,
  ]);

  const assistantLine =
    institutional.assistantInstitutionalIntelligenceLine ||
    stack.assistantMetaIntelligenceLine ||
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
    visible: stack.visible || institutional.visible,
    governanceHeadline: displayHeadline,
    governanceSubline: displaySubline,
    timelineGovernanceLine: useInstitutionalDisplay
      ? institutional.timelineInstitutionalContinuityLine
      : stack.timelineGovernanceLine,
    assistantGovernanceLine: assistantLine,
    institutionalIntelligencePosture: institutional.institutionalIntelligencePosture,
    institutionalHeadline: institutional.institutionalHeadline,
    institutionalSubline: institutional.institutionalSubline,
    synchronizationHealthLine: institutional.synchronizationHealthLine,
    adaptationContinuityLine: institutional.adaptationContinuityLine,
    executiveCognitionSyncLine: institutional.executiveCognitionSyncLine,
    timelineInstitutionalContinuityLine: institutional.timelineInstitutionalContinuityLine,
    assistantInstitutionalIntelligenceLine: institutional.assistantInstitutionalIntelligenceLine,
    autonomousInstitutionalIntelligenceActive: institutional.autonomousInstitutionalIntelligenceActive,
    enterpriseCognitiveRuntimeComplete: institutional.enterpriseCognitiveRuntimeComplete,
    autonomousInstitutionalIntelligence: institutional,
  };
}
