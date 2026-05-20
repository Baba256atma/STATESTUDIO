import { stableSignature } from "../../../intelligence/shared/dedupe";
import type { AdaptiveGovernanceIntelligenceSnapshot } from "../adaptiveGovernanceTypes";
import type { InstitutionalStrategicPressureGovernanceSnapshot } from "./strategicPressureGovernanceTypes";

/**
 * F9:4 — Merges pressure governance into the enterprise governance stack snapshot.
 */
export function mergeStrategicPressureGovernance(
  stack: AdaptiveGovernanceIntelligenceSnapshot,
  pressure: InstitutionalStrategicPressureGovernanceSnapshot
): AdaptiveGovernanceIntelligenceSnapshot {
  const usePressureDisplay =
    pressure.executiveStabilityActive ||
    (pressure.pressureGovernanceActive && pressure.pressurePosture !== "idle");

  const displayHeadline = usePressureDisplay
    ? pressure.stabilityHeadline
    : stack.governanceHeadline;

  const displaySubline = usePressureDisplay ? pressure.stabilitySubline : stack.governanceSubline;

  const signature = stableSignature([
    "f9-governance-stack-complete",
    stack.signature,
    pressure.signature,
  ]);

  const assistantLine =
    pressure.assistantStabilityLine ||
    stack.assistantCalibrationLine ||
    stack.assistantCoherenceLine ||
    stack.assistantGovernanceLine;

  return {
    ...stack,
    signature,
    visible: stack.visible || pressure.visible,
    governanceHeadline: displayHeadline,
    governanceSubline: displaySubline,
    timelineGovernanceLine: usePressureDisplay
      ? pressure.timelineStabilityLine
      : stack.timelineGovernanceLine,
    assistantGovernanceLine: assistantLine,
    pressurePosture: pressure.pressurePosture,
    stabilityHeadline: pressure.stabilityHeadline,
    stabilitySubline: pressure.stabilitySubline,
    executiveStabilityLine: pressure.executiveStabilityLine,
    escalationGovernanceLine: pressure.escalationGovernanceLine,
    pressureStabilizationLine: pressure.pressureStabilizationLine,
    timelineStabilityLine: pressure.timelineStabilityLine,
    assistantStabilityLine: pressure.assistantStabilityLine,
    executiveStabilityActive: pressure.executiveStabilityActive,
    pressureGovernanceActive: pressure.pressureGovernanceActive,
    strategicPressureGovernance: pressure,
  };
}
