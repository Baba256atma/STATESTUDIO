import { stableSignature } from "../../../intelligence/shared/dedupe";
import { organizationalEvolutionCognitionLayer } from "./organizationalEvolutionCognitionLayer";
import { transformationGovernanceInterpretationLayer } from "./transformationGovernanceInterpretationLayer";
import type {
  InstitutionalStrategicAdaptationGovernance,
  SynthesizeInstitutionalStrategicAdaptationGovernanceInput,
} from "./strategicAdaptationGovernanceTypes";

export function buildStrategicAdaptationGovernanceSignature(
  adaptation: InstitutionalStrategicAdaptationGovernance
): string {
  return stableSignature([
    "f9-5-adaptation",
    adaptation.organizationId,
    adaptation.transformationContinuity,
    adaptation.adaptationGovernance,
    adaptation.resilienceEvolution,
    adaptation.strategicTransformation,
    adaptation.operationalAdaptation,
    adaptation.coordinationEvolution,
    adaptation.institutionalProgression,
    String(adaptation.confidence),
  ]);
}

export function synthesizeInstitutionalStrategicAdaptationGovernance(
  input: SynthesizeInstitutionalStrategicAdaptationGovernanceInput
): InstitutionalStrategicAdaptationGovernance | null {
  const institutional = input.institutional;
  const hasSignal =
    Boolean(institutional?.enterpriseEvolutionActive) ||
    Boolean(institutional?.resilienceEvolutionActive) ||
    Boolean(institutional?.strategicEvolutionActive) ||
    input.governanceOversightActive ||
    input.enterpriseCoherenceActive ||
    input.strategicCalibrationActive ||
    input.executiveStabilityActive ||
    input.adaptiveGovernance != null;

  if (!hasSignal && !input.continuityPreserved) return null;

  const governance = input.adaptiveGovernance;
  const coherence = input.strategicCoherence;
  const calibration = input.strategicCalibration;

  const transformationContinuity = organizationalEvolutionCognitionLayer.inferTransformationContinuity(
    input.continuityPreserved,
    input.executiveStabilityActive,
    input.fragilityElevated
  );
  const strategicTransformation = organizationalEvolutionCognitionLayer.inferStrategicTransformation(
    Boolean(institutional?.enterpriseEvolutionActive),
    Boolean(institutional?.strategicEvolutionActive),
    input.fragilityElevated
  );
  const operationalAdaptation = organizationalEvolutionCognitionLayer.inferOperationalAdaptation(
    input.strategicCalibrationActive,
    input.enterpriseCoherenceActive,
    input.fragilityElevated
  );
  const coordinationEvolution = organizationalEvolutionCognitionLayer.inferCoordinationEvolution(
    coherence?.coordinationIntegrity,
    input.cognitionConverged
  );
  const institutionalProgression = organizationalEvolutionCognitionLayer.inferInstitutionalProgression(
    institutional?.convergenceDepth ?? 0,
    Boolean(institutional?.institutionalCognitionConverged)
  );
  const resilienceEvolution = organizationalEvolutionCognitionLayer.inferResilienceEvolution(
    Boolean(institutional?.resilienceEvolutionActive),
    governance?.resilienceGovernance,
    input.fragilityElevated
  );
  const adaptationGovernance = transformationGovernanceInterpretationLayer.inferAdaptationGovernance(
    input.governanceOversightActive,
    input.strategicCalibrationActive,
    input.pressureGovernanceActive,
    input.fragilityElevated
  );

  const confidence = Number(
    Math.min(
      0.95,
      0.22 +
        (input.continuityPreserved ? 0.14 : 0) +
        (input.cognitionConverged ? 0.12 : 0) +
        (adaptationGovernance === "mature" ? 0.14 : 0) +
        (transformationContinuity === "coherent" ? 0.12 : 0) +
        (input.fragilityElevated ? -0.08 : 0.08) +
        (calibration?.institutionalLearningStrength === "embedded" ? 0.08 : 0)
    ).toFixed(2)
  );

  return {
    organizationId: input.organizationId,
    transformationContinuity,
    adaptationGovernance,
    resilienceEvolution,
    strategicTransformation,
    operationalAdaptation,
    coordinationEvolution,
    institutionalProgression,
    confidence: Math.max(0.2, confidence),
    timestamp: Date.now(),
  };
}
