import { stableSignature } from "../../../intelligence/shared/dedupe";
import type { AdaptiveGovernanceCognition } from "../adaptiveGovernanceTypes";
import type { EnterpriseStrategicCoherence } from "../coherence/enterpriseStrategicCoherenceTypes";
import { decisionQualityCognitionLayer } from "./decisionQualityCognitionLayer";
import { operationalCorrectionInterpretationLayer } from "./operationalCorrectionInterpretationLayer";
import type {
  AdaptationEffectiveness,
  AdaptiveStrategicCalibration,
  SynthesizeAdaptiveStrategicCalibrationInput,
} from "./adaptiveStrategicCalibrationTypes";

function inferAdaptationEffectiveness(
  governance: AdaptiveGovernanceCognition | null,
  coherence: EnterpriseStrategicCoherence | null
): AdaptationEffectiveness {
  if (governance?.adaptationConsistency === "sustained") return "sustained";
  if (coherence?.adaptationAlignment === "sustained") return "sustained";
  if (governance?.adaptationConsistency === "coherent" || coherence?.adaptationAlignment === "aligned") {
    return "effective";
  }
  if (governance?.adaptationConsistency === "forming") return "forming";
  return "weak";
}

export function buildStrategicCalibrationSignature(
  calibration: AdaptiveStrategicCalibration
): string {
  return stableSignature([
    "f9-3-calibration",
    calibration.organizationId,
    calibration.decisionQuality,
    calibration.strategicAdjustmentPatterns,
    calibration.adaptationEffectiveness,
    calibration.resilienceDecisionEvolution,
    calibration.governanceCorrectionQuality,
    calibration.operationalRefinement,
    calibration.institutionalLearningStrength,
    String(calibration.confidence),
  ]);
}

export function synthesizeAdaptiveStrategicCalibration(
  input: SynthesizeAdaptiveStrategicCalibrationInput
): AdaptiveStrategicCalibration | null {
  const hasDepth =
    input.adaptiveGovernance != null ||
    input.strategicCoherence != null ||
    input.governanceOversightActive ||
    input.enterpriseCoherenceActive ||
    input.cognitionConverged;

  if (!hasDepth && !input.continuityPreserved) return null;

  const coherence = input.strategicCoherence;
  const governance = input.adaptiveGovernance;

  const adaptationEffectiveness = inferAdaptationEffectiveness(governance, coherence);
  const decisionQuality = decisionQualityCognitionLayer.inferDecisionQuality(
    input.governanceOversightActive,
    input.enterpriseCoherenceActive,
    input.cognitionConverged,
    input.fragilityElevated
  );
  const strategicAdjustmentPatterns =
    operationalCorrectionInterpretationLayer.inferStrategicAdjustmentPattern(
      input.enterpriseCoherenceActive,
      input.fragilityElevated
    );
  const resilienceDecisionEvolution =
    operationalCorrectionInterpretationLayer.inferResilienceDecisionEvolution(
      coherence?.resilienceCoherence,
      input.fragilityElevated
    );
  const governanceCorrectionQuality =
    operationalCorrectionInterpretationLayer.inferGovernanceCorrectionQuality(
      coherence?.governanceSynchronization,
      input.governanceOversightActive
    );
  const operationalRefinement =
    operationalCorrectionInterpretationLayer.inferOperationalRefinement(
      coherence?.operationalConsistency,
      input.cognitionConverged
    );
  const institutionalLearningStrength =
    decisionQualityCognitionLayer.inferInstitutionalLearningStrength(
      adaptationEffectiveness,
      input.continuityPreserved
    );

  const confidence = Number(
    Math.min(
      0.95,
      0.28 +
        (governance?.confidence ?? 0) * 0.25 +
        (coherence?.confidence ?? 0) * 0.2 +
        (input.enterpriseCoherenceActive ? 0.12 : 0) +
        (decisionQuality === "refined" ? 0.1 : 0)
    ).toFixed(2)
  );

  return {
    organizationId: input.organizationId,
    decisionQuality,
    strategicAdjustmentPatterns,
    adaptationEffectiveness,
    resilienceDecisionEvolution,
    governanceCorrectionQuality,
    operationalRefinement,
    institutionalLearningStrength,
    confidence,
    timestamp: Date.now(),
  };
}
