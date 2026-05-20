import { stableSignature } from "../../intelligence/shared/dedupe";
import { enterpriseSelfCalibrationLayer } from "./enterpriseSelfCalibrationLayer";
import { strategicOversightInterpretationLayer } from "./strategicOversightInterpretationLayer";
import type {
  AdaptiveGovernanceCognition,
  SynthesizeAdaptiveGovernanceCognitionInput,
  StrategicAlignment,
} from "./adaptiveGovernanceTypes";

function resolveStrategicAlignment(
  institutional: SynthesizeAdaptiveGovernanceCognitionInput["institutional"],
  cognitionConverged: boolean
): StrategicAlignment {
  if (institutional?.institutionalCognitionConverged && cognitionConverged) return "aligned";
  if (institutional?.enterpriseEvolutionActive || institutional?.cognitiveCultureActive) {
    return "tracking";
  }
  if (institutional?.strategicEvolutionActive || institutional?.resilienceEvolutionActive) {
    return "forming";
  }
  return institutional?.historicalCognitionActive ? "forming" : "misaligned";
}

export function buildAdaptiveGovernanceSignature(cognition: AdaptiveGovernanceCognition): string {
  return stableSignature([
    "f9-1-governance",
    cognition.organizationId,
    cognition.governanceStability,
    cognition.strategicAlignment,
    cognition.operationalDiscipline,
    cognition.resilienceGovernance,
    cognition.escalationGovernance,
    cognition.adaptationConsistency,
    cognition.institutionalCoherence,
    String(cognition.confidence),
  ]);
}

export function synthesizeAdaptiveGovernanceCognition(
  input: SynthesizeAdaptiveGovernanceCognitionInput
): AdaptiveGovernanceCognition | null {
  const inst = input.institutional;
  const convergenceDepth = inst?.convergenceDepth ?? 0;
  const hasSignal =
    convergenceDepth > 0 ||
    input.cognitionConverged ||
    input.fragilityElevated ||
    input.continuityPreserved;

  if (!hasSignal) return null;

  const resilienceEvolutionActive = inst?.resilienceEvolutionActive ?? false;
  const behavioralLearningActive = inst?.behavioralLearningActive ?? false;
  const cognitiveCultureActive = inst?.cognitiveCultureActive ?? false;
  const enterpriseEvolutionActive = inst?.enterpriseEvolutionActive ?? false;
  const institutionalCognitionConverged = inst?.institutionalCognitionConverged ?? false;

  const governanceStability = enterpriseSelfCalibrationLayer.inferGovernanceStability(
    input.continuityPreserved,
    convergenceDepth,
    input.fragilityElevated
  );

  const operationalDiscipline = enterpriseSelfCalibrationLayer.inferOperationalDiscipline(
    behavioralLearningActive,
    cognitiveCultureActive,
    input.cognitionConverged
  );

  const resilienceGovernance = strategicOversightInterpretationLayer.inferResilienceGovernance(
    resilienceEvolutionActive,
    input.fragilityElevated
  );

  const escalationGovernance = strategicOversightInterpretationLayer.inferEscalationGovernance(
    behavioralLearningActive,
    input.fragilityElevated
  );

  const adaptationConsistency = strategicOversightInterpretationLayer.inferAdaptationConsistency(
    enterpriseEvolutionActive,
    institutionalCognitionConverged
  );

  const institutionalCoherence = strategicOversightInterpretationLayer.inferInstitutionalCoherence(
    convergenceDepth,
    input.continuityPreserved
  );

  const strategicAlignment = resolveStrategicAlignment(inst, input.cognitionConverged);

  const confidence = Number(
    Math.min(
      0.95,
      0.35 +
        convergenceDepth * 0.1 +
        (input.cognitionConverged ? 0.15 : 0) +
        (governanceStability === "stable" ? 0.1 : 0)
    ).toFixed(2)
  );

  return {
    organizationId: input.organizationId,
    governanceStability,
    strategicAlignment,
    operationalDiscipline,
    resilienceGovernance,
    escalationGovernance,
    adaptationConsistency,
    institutionalCoherence,
    confidence,
    timestamp: Date.now(),
  };
}
