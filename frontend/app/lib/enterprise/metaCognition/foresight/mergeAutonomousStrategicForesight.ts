import { stableSignature } from "../../../intelligence/shared/dedupe";
import type { AdaptiveGovernanceIntelligenceSnapshot } from "../../governance/adaptiveGovernanceTypes";
import type { AutonomousStrategicForesightLayerSnapshot } from "./institutionalFutureStateTypes";

/**
 * F10:4 — Merges strategic foresight into the enterprise intelligence snapshot.
 */
export function mergeAutonomousStrategicForesight(
  stack: AdaptiveGovernanceIntelligenceSnapshot,
  foresight: AutonomousStrategicForesightLayerSnapshot
): AdaptiveGovernanceIntelligenceSnapshot {
  const useForesightDisplay =
    foresight.futureStateIntelligenceActive ||
    (foresight.strategicForesightActive && foresight.strategicForesightPosture !== "idle");

  const displayHeadline = useForesightDisplay
    ? foresight.foresightHeadline
    : stack.governanceHeadline;

  const displaySubline = useForesightDisplay ? foresight.foresightSubline : stack.governanceSubline;

  const signature = stableSignature([
    "f10-enterprise-intelligence-complete",
    stack.signature,
    foresight.signature,
  ]);

  const assistantLine =
    foresight.assistantStrategicForesightLine ||
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
    visible: stack.visible || foresight.visible,
    governanceHeadline: displayHeadline,
    governanceSubline: displaySubline,
    timelineGovernanceLine: useForesightDisplay
      ? foresight.timelineFutureStateLine
      : stack.timelineGovernanceLine,
    assistantGovernanceLine: assistantLine,
    strategicForesightPosture: foresight.strategicForesightPosture,
    foresightHeadline: foresight.foresightHeadline,
    foresightSubline: foresight.foresightSubline,
    trajectoryLine: foresight.trajectoryLine,
    resilienceForecastLine: foresight.resilienceForecastLine,
    strategicTimingLine: foresight.strategicTimingLine,
    uncertaintyFactorsLine: foresight.uncertaintyFactorsLine,
    timelineFutureStateLine: foresight.timelineFutureStateLine,
    assistantStrategicForesightLine: foresight.assistantStrategicForesightLine,
    strategicForesightActive: foresight.strategicForesightActive,
    futureStateIntelligenceActive: foresight.futureStateIntelligenceActive,
    autonomousStrategicForesight: foresight,
  };
}
