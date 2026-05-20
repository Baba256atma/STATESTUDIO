import { stableSignature } from "../../../intelligence/shared/dedupe";
import { executiveStabilityInterpretationLayer } from "./executiveStabilityInterpretationLayer";
import { escalationGovernanceCognitionLayer } from "./escalationGovernanceCognitionLayer";
import type {
  ResilienceContinuity,
  StrategicPressureGovernance,
  SynthesizeStrategicPressureGovernanceInput,
} from "./strategicPressureGovernanceTypes";

function inferResilienceContinuity(
  resilienceGovernance: string | undefined,
  resilienceCoherence: string | undefined,
  fragilityElevated: boolean
): ResilienceContinuity {
  if (resilienceGovernance === "consistent" && resilienceCoherence === "mature") {
    return "mature";
  }
  if (resilienceGovernance === "adaptive" || resilienceCoherence === "aligned") {
    return "sustained";
  }
  if (fragilityElevated) return "broken";
  return "forming";
}

export function buildStrategicPressureGovernanceSignature(
  pressure: StrategicPressureGovernance
): string {
  return stableSignature([
    "f9-4-pressure",
    pressure.organizationId,
    pressure.operationalPressure,
    pressure.escalationGovernance,
    pressure.executiveStability,
    pressure.resilienceContinuity,
    pressure.coordinationStressHandling,
    pressure.stabilizationMaturity,
    pressure.strategicComposure,
    String(pressure.confidence),
  ]);
}

export function synthesizeStrategicPressureGovernance(
  input: SynthesizeStrategicPressureGovernanceInput
): StrategicPressureGovernance | null {
  const hasSignal =
    input.fragilityElevated ||
    input.governanceOversightActive ||
    input.enterpriseCoherenceActive ||
    input.strategicCalibrationActive ||
    input.adaptiveGovernance != null;

  if (!hasSignal && !input.continuityPreserved) return null;

  const governance = input.adaptiveGovernance;
  const coherence = input.strategicCoherence;
  const calibration = input.strategicCalibration;

  const operationalPressure = escalationGovernanceCognitionLayer.inferOperationalPressure(
    input.fragilityElevated,
    input.continuityPreserved
  );
  const escalationGovernance = escalationGovernanceCognitionLayer.inferEscalationGovernance(
    governance?.escalationGovernance,
    input.fragilityElevated
  );
  const executiveStability = executiveStabilityInterpretationLayer.inferExecutiveStability(
    input.fragilityElevated,
    input.continuityPreserved,
    input.governanceOversightActive
  );
  const resilienceContinuity = inferResilienceContinuity(
    governance?.resilienceGovernance,
    coherence?.resilienceCoherence,
    input.fragilityElevated
  );
  const coordinationStressHandling =
    escalationGovernanceCognitionLayer.inferCoordinationStressHandling(
      coherence?.coordinationIntegrity,
      input.fragilityElevated
    );
  const stabilizationMaturity = escalationGovernanceCognitionLayer.inferStabilizationMaturity(
    input.enterpriseCoherenceActive,
    input.strategicCalibrationActive,
    input.fragilityElevated
  );
  const strategicComposure = executiveStabilityInterpretationLayer.inferStrategicComposure(
    executiveStability,
    calibration?.decisionQuality
  );

  const confidence = Number(
    Math.min(
      0.95,
      0.25 +
        (input.continuityPreserved ? 0.15 : 0) +
        (input.governanceOversightActive ? 0.12 : 0) +
        (executiveStability === "composed" ? 0.15 : 0) +
        (input.fragilityElevated ? -0.1 : 0.1)
    ).toFixed(2)
  );

  return {
    organizationId: input.organizationId,
    operationalPressure,
    escalationGovernance,
    executiveStability,
    resilienceContinuity,
    coordinationStressHandling,
    stabilizationMaturity,
    strategicComposure,
    confidence: Math.max(0.2, confidence),
    timestamp: Date.now(),
  };
}
