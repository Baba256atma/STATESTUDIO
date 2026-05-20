import { stableSignature } from "../../../intelligence/shared/dedupe";
import type { AdaptiveGovernanceIntelligenceSnapshot } from "../adaptiveGovernanceTypes";
import type { AdaptiveStrategicCalibrationSnapshot } from "./adaptiveStrategicCalibrationTypes";

/**
 * F9:3 — Merges calibration into the enterprise governance stack snapshot.
 */
export function mergeStrategicCalibration(
  stack: AdaptiveGovernanceIntelligenceSnapshot,
  calibration: AdaptiveStrategicCalibrationSnapshot
): AdaptiveGovernanceIntelligenceSnapshot {
  const displayHeadline = calibration.strategicCalibrationActive
    ? calibration.calibrationHeadline
    : stack.governanceHeadline;

  const displaySubline = calibration.strategicCalibrationActive
    ? calibration.calibrationSubline
    : stack.governanceSubline;

  const signature = stableSignature([
    "f9-governance-stack-full",
    stack.signature,
    calibration.signature,
  ]);

  const assistantLine =
    calibration.assistantCalibrationLine ||
    stack.assistantCoherenceLine ||
    stack.assistantGovernanceLine;

  return {
    ...stack,
    signature,
    visible: stack.visible || calibration.visible,
    governanceHeadline: displayHeadline,
    governanceSubline: displaySubline,
    timelineGovernanceLine: calibration.strategicCalibrationActive
      ? calibration.timelineCalibrationLine
      : stack.timelineGovernanceLine,
    assistantGovernanceLine: assistantLine,
    calibrationPosture: calibration.calibrationPosture,
    calibrationHeadline: calibration.calibrationHeadline,
    calibrationSubline: calibration.calibrationSubline,
    decisionQualityLine: calibration.decisionQualityLine,
    operationalCorrectionLine: calibration.operationalCorrectionLine,
    refinementInterpretationLine: calibration.refinementInterpretationLine,
    timelineCalibrationLine: calibration.timelineCalibrationLine,
    assistantCalibrationLine: calibration.assistantCalibrationLine,
    strategicCalibrationActive: calibration.strategicCalibrationActive,
    decisionQualityCognitionActive: calibration.decisionQualityCognitionActive,
    strategicCalibration: calibration,
  };
}
