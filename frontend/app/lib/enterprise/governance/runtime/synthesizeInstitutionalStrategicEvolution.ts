import { stableSignature } from "../../../intelligence/shared/dedupe";
import { institutionalStrategicEvolutionConvergenceLayer } from "./institutionalStrategicEvolutionConvergenceLayer";
import type {
  AdaptationGovernanceMaturitySync,
  EnterpriseStrategicContinuity,
  ExecutiveStabilityContinuity,
  GovernanceContinuity,
  InstitutionalEvolutionSync,
  InstitutionalStrategicEvolution,
  OperationalCoherenceContinuity,
  SynthesizeInstitutionalStrategicEvolutionInput,
} from "./unifiedAdaptiveGovernanceTypes";

export function buildInstitutionalStrategicEvolutionSignature(
  evolution: InstitutionalStrategicEvolution
): string {
  return stableSignature([
    "f9-6-evolution",
    evolution.organizationId,
    evolution.governanceContinuity,
    evolution.operationalCoherence,
    evolution.executiveStabilityContinuity,
    evolution.adaptationGovernanceMaturity,
    evolution.institutionalEvolutionSync,
    evolution.enterpriseStrategicContinuity,
    evolution.selfRegulationDiscipline,
    String(evolution.confidence),
  ]);
}

function inferGovernanceContinuity(
  continuityPreserved: boolean,
  governanceOversightActive: boolean
): GovernanceContinuity {
  if (!continuityPreserved) return "broken";
  if (governanceOversightActive) return "coherent";
  return "sustained";
}

function inferOperationalCoherence(
  enterpriseCoherenceActive: boolean,
  coherencePosture: string
): OperationalCoherenceContinuity {
  if (enterpriseCoherenceActive && coherencePosture === "harmonized") return "mature";
  if (enterpriseCoherenceActive) return "harmonized";
  if (coherencePosture === "synchronized") return "aligning";
  return "fragmented";
}

function inferExecutiveStabilityContinuity(
  executiveStabilityActive: boolean,
  pressurePosture: string
): ExecutiveStabilityContinuity {
  if (executiveStabilityActive && pressurePosture === "resilient") return "composed";
  if (executiveStabilityActive) return "stable";
  if (pressurePosture === "stabilizing") return "stabilizing";
  return "fragile";
}

function inferAdaptationMaturity(
  adaptationGovernanceActive: boolean,
  adaptationPosture: string
): AdaptationGovernanceMaturitySync {
  if (adaptationGovernanceActive && adaptationPosture === "progressive") return "mature";
  if (adaptationGovernanceActive) return "developing";
  if (adaptationPosture === "observing") return "nascent";
  return "strained";
}

function inferInstitutionalEvolutionSync(
  institutionalConverged: boolean,
  organizationalEvolutionActive: boolean,
  cognitionConverged: boolean
): InstitutionalEvolutionSync {
  if (institutionalConverged && organizationalEvolutionActive) return "progressive";
  if (cognitionConverged && organizationalEvolutionActive) return "synchronized";
  if (organizationalEvolutionActive) return "converging";
  return "dormant";
}

function inferEnterpriseStrategicContinuity(
  continuityPreserved: boolean,
  fragilityElevated: boolean,
  unifiedLayersActive: number
): EnterpriseStrategicContinuity {
  if (!continuityPreserved || fragilityElevated) return "disrupted";
  if (unifiedLayersActive >= 4) return "coherent";
  if (unifiedLayersActive >= 2) return "sustained";
  return "forming";
}

export function synthesizeInstitutionalStrategicEvolution(
  input: SynthesizeInstitutionalStrategicEvolutionInput
): InstitutionalStrategicEvolution | null {
  const stack = input.stack;
  const hasSignal =
    stack.governanceOversightActive ||
    stack.enterpriseCoherenceActive ||
    stack.strategicCalibrationActive ||
    stack.executiveStabilityActive ||
    stack.organizationalEvolutionActive ||
    Boolean(input.institutional?.institutionalCognitionConverged);

  if (!hasSignal && !input.continuityPreserved) return null;

  const activeLayers = [
    stack.governanceOversightActive,
    stack.enterpriseCoherenceActive,
    stack.strategicCalibrationActive,
    stack.executiveStabilityActive,
    stack.organizationalEvolutionActive,
  ].filter(Boolean).length;

  const governanceContinuity = inferGovernanceContinuity(
    input.continuityPreserved,
    stack.governanceOversightActive
  );
  const operationalCoherence = inferOperationalCoherence(
    stack.enterpriseCoherenceActive,
    stack.coherencePosture
  );
  const executiveStabilityContinuity = inferExecutiveStabilityContinuity(
    stack.executiveStabilityActive,
    stack.pressurePosture
  );
  const adaptationGovernanceMaturity = inferAdaptationMaturity(
    stack.adaptationGovernanceActive,
    stack.adaptationPosture
  );
  const institutionalEvolutionSync = inferInstitutionalEvolutionSync(
    Boolean(input.institutional?.institutionalCognitionConverged),
    stack.organizationalEvolutionActive,
    input.cognitionConverged
  );
  const enterpriseStrategicContinuity = inferEnterpriseStrategicContinuity(
    input.continuityPreserved,
    input.fragilityElevated,
    activeLayers
  );
  const selfRegulationDiscipline =
    institutionalStrategicEvolutionConvergenceLayer.inferSelfRegulationDiscipline(
      stack.governanceOversightActive,
      stack.executiveStabilityActive,
      stack.organizationalEvolutionActive,
      input.fragilityElevated
    );

  const confidence = Number(
    Math.min(
      0.96,
      0.2 +
        (input.continuityPreserved ? 0.16 : 0) +
        (input.cognitionConverged ? 0.1 : 0) +
        (activeLayers >= 3 ? 0.14 : activeLayers * 0.04) +
        (enterpriseStrategicContinuity === "coherent" ? 0.12 : 0) +
        (input.fragilityElevated ? -0.1 : 0.08)
    ).toFixed(2)
  );

  return {
    organizationId: input.organizationId,
    governanceContinuity,
    operationalCoherence,
    executiveStabilityContinuity,
    adaptationGovernanceMaturity,
    institutionalEvolutionSync,
    enterpriseStrategicContinuity,
    selfRegulationDiscipline,
    confidence: Math.max(0.2, confidence),
    timestamp: Date.now(),
  };
}
