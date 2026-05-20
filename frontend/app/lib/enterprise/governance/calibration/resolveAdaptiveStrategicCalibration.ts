import { stableSignature } from "../../../intelligence/shared/dedupe";
import { decisionQualityCognitionLayer } from "./decisionQualityCognitionLayer";
import { operationalCorrectionInterpretationLayer } from "./operationalCorrectionInterpretationLayer";
import {
  buildStrategicCalibrationSignature,
  synthesizeAdaptiveStrategicCalibration,
} from "./synthesizeAdaptiveStrategicCalibration";
import type {
  AdaptiveStrategicCalibration,
  AdaptiveStrategicCalibrationSnapshot,
  CalibrationPosture,
  SynthesizeAdaptiveStrategicCalibrationInput,
} from "./adaptiveStrategicCalibrationTypes";

export type ResolveAdaptiveStrategicCalibrationInput = SynthesizeAdaptiveStrategicCalibrationInput & {
  enabled: boolean;
  sessionHydrated: boolean;
  runtimeStable: boolean;
  onboardingActive: boolean;
};

function resolveCalibrationPosture(
  calibration: AdaptiveStrategicCalibration | null,
  continuityPreserved: boolean
): CalibrationPosture {
  if (!continuityPreserved) return "attention";
  if (!calibration) return "idle";

  if (
    calibration.decisionQuality === "refined" &&
    calibration.institutionalLearningStrength === "embedded"
  ) {
    return "adaptive";
  }
  if (
    calibration.adaptationEffectiveness === "sustained" ||
    calibration.governanceCorrectionQuality === "mature"
  ) {
    return "calibrating";
  }
  if (calibration.decisionQuality === "developing") return "refining";
  if (calibration.decisionQuality !== "strained") return "observing";
  return "attention";
}

export function resolveAdaptiveStrategicCalibration(
  input: ResolveAdaptiveStrategicCalibrationInput
): AdaptiveStrategicCalibrationSnapshot {
  const canonical =
    input.enabled && input.continuityPreserved
      ? synthesizeAdaptiveStrategicCalibration(input)
      : null;

  const calibrationPosture = resolveCalibrationPosture(canonical, input.continuityPreserved);

  const strategicCalibrationActive =
    calibrationPosture === "adaptive" ||
    calibrationPosture === "calibrating" ||
    calibrationPosture === "refining";

  const decisionQualityCognitionActive =
    strategicCalibrationActive || calibrationPosture === "observing";

  const visible =
    input.enabled &&
    input.sessionHydrated &&
    !input.onboardingActive &&
    calibrationPosture !== "idle";

  const calibrationHeadline =
    calibrationPosture === "adaptive"
      ? "Adaptive strategic calibration active"
      : calibrationPosture === "calibrating"
        ? "Institutional decision evolution calibrating"
        : calibrationPosture === "refining"
          ? "Strategic operational refinement in progress"
          : calibrationPosture === "observing"
            ? "Decision quality cognition observing"
            : calibrationPosture === "attention"
              ? "Strategic calibration requires continuity attention"
              : "Adaptive strategic calibration idle";

  const calibrationSubline = canonical
    ? `Quality ${canonical.decisionQuality} · adjustment ${canonical.strategicAdjustmentPatterns} · learning ${canonical.institutionalLearningStrength}`
    : "Calibration derives from governance and coherence — not executive performance judgment";

  const decisionQualityLine = canonical
    ? decisionQualityCognitionLayer.synthesizeDecisionQualityLine(
        canonical.decisionQuality,
        canonical.adaptationEffectiveness
      )
    : "Decision quality cognition establishes with governance stack depth";

  const operationalCorrectionLine = canonical
    ? operationalCorrectionInterpretationLayer.synthesizeCorrectionLine(
        canonical.strategicAdjustmentPatterns,
        canonical.governanceCorrectionQuality
      )
    : "Operational correction awareness forming through institutional oversight";

  const refinementInterpretationLine = canonical
    ? operationalCorrectionInterpretationLayer.synthesizeRefinementLine(
        canonical.operationalRefinement,
        canonical.resilienceDecisionEvolution
      )
    : "";

  const timelineCalibrationLine =
    "Timeline reflects strategic evolution memory — recalibration, governance refinement, and decision maturity progression";

  const assistantCalibrationLine =
    strategicCalibrationActive || calibrationPosture === "calibrating"
      ? "Strategic calibration is available — discuss recalibration trends, operational correction quality, and decision evolution without judging executives."
      : "Adaptive strategic calibration is establishing — institutional decision refinement will synchronize with governance and coherence cognition.";

  const signature = canonical
    ? buildStrategicCalibrationSignature(canonical)
    : stableSignature(["f9-3-calibration-idle", String(input.cognitionConverged)]);

  return {
    signature,
    enabled: input.enabled,
    hydrated: input.sessionHydrated,
    visible,
    calibrationPosture,
    calibrationHeadline,
    calibrationSubline,
    decisionQualityLine,
    operationalCorrectionLine,
    refinementInterpretationLine,
    timelineCalibrationLine,
    assistantCalibrationLine,
    strategicCalibrationActive,
    decisionQualityCognitionActive,
    canonical,
    calibrationStable: input.continuityPreserved && input.runtimeStable,
  };
}
