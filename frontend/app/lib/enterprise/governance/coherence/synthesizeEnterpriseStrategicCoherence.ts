import { stableSignature } from "../../../intelligence/shared/dedupe";
import type { AdaptiveGovernanceCognition } from "../adaptiveGovernanceTypes";
import { organizationalFragmentationCognitionLayer } from "./organizationalFragmentationCognitionLayer";
import { operationalConsistencyInterpretationLayer } from "./operationalConsistencyInterpretationLayer";
import type {
  AdaptationAlignment,
  CoherenceStrategicAlignment,
  EnterpriseStrategicCoherence,
  GovernanceSynchronization,
  ResilienceCoherence,
  SynthesizeEnterpriseStrategicCoherenceInput,
} from "./enterpriseStrategicCoherenceTypes";

function mapGovernanceAlignment(
  governance: AdaptiveGovernanceCognition | null
): CoherenceStrategicAlignment {
  if (!governance) return "forming";
  switch (governance.strategicAlignment) {
    case "aligned":
      return "harmonized";
    case "tracking":
      return "tracking";
    case "forming":
      return "forming";
    default:
      return "fragmented";
  }
}

function inferGovernanceSynchronization(
  governance: AdaptiveGovernanceCognition | null,
  governanceOversightActive: boolean
): GovernanceSynchronization {
  if (!governance) return "forming";
  if (governanceOversightActive && governance.institutionalCoherence === "stable") {
    return "coherent";
  }
  if (governanceOversightActive || governance.governanceStability === "stable") {
    return "synchronized";
  }
  if (governance.governanceStability === "strained") return "desynchronized";
  return "forming";
}

function inferResilienceCoherence(
  governance: AdaptiveGovernanceCognition | null,
  fragilityElevated: boolean
): ResilienceCoherence {
  if (!governance) return "forming";
  if (governance.resilienceGovernance === "consistent") return "mature";
  if (governance.resilienceGovernance === "adaptive") return "aligned";
  if (fragilityElevated || governance.resilienceGovernance === "strained") return "discontinuous";
  return "forming";
}

function inferAdaptationAlignment(governance: AdaptiveGovernanceCognition | null): AdaptationAlignment {
  if (!governance) return "forming";
  switch (governance.adaptationConsistency) {
    case "sustained":
      return "sustained";
    case "coherent":
      return "aligned";
    case "forming":
      return "forming";
    default:
      return "conflicted";
  }
}

export function buildEnterpriseCoherenceSignature(
  coherence: EnterpriseStrategicCoherence
): string {
  return stableSignature([
    "f9-2-coherence",
    coherence.organizationId,
    coherence.strategicAlignment,
    coherence.operationalConsistency,
    coherence.governanceSynchronization,
    coherence.resilienceCoherence,
    coherence.coordinationIntegrity,
    coherence.adaptationAlignment,
    coherence.institutionalHarmony,
    String(coherence.confidence),
  ]);
}

export function synthesizeEnterpriseStrategicCoherence(
  input: SynthesizeEnterpriseStrategicCoherenceInput
): EnterpriseStrategicCoherence | null {
  const governance = input.adaptiveGovernance;
  const hasDepth =
    governance != null ||
    input.governanceOversightActive ||
    input.enterpriseSelfCalibrationActive ||
    input.cognitionConverged;

  if (!hasDepth && !input.continuityPreserved) return null;

  const strategicAlignment = mapGovernanceAlignment(governance);
  const governanceSynchronization = inferGovernanceSynchronization(
    governance,
    input.governanceOversightActive
  );
  const adaptationAlignment = inferAdaptationAlignment(governance);
  const operationalConsistency =
    operationalConsistencyInterpretationLayer.inferOperationalConsistency(
      input.governanceOversightActive,
      adaptationAlignment,
      input.fragilityElevated
    );
  const resilienceCoherence = inferResilienceCoherence(governance, input.fragilityElevated);
  const coordinationIntegrity =
    organizationalFragmentationCognitionLayer.inferCoordinationIntegrity(
      governanceSynchronization,
      input.fragilityElevated
    );
  const institutionalHarmony =
    organizationalFragmentationCognitionLayer.inferInstitutionalHarmony(
      strategicAlignment,
      input.continuityPreserved
    );

  const confidence = Number(
    Math.min(
      0.95,
      0.3 +
        (governance?.confidence ?? 0) * 0.4 +
        (input.governanceOversightActive ? 0.15 : 0) +
        (strategicAlignment === "harmonized" ? 0.1 : 0)
    ).toFixed(2)
  );

  return {
    organizationId: input.organizationId,
    strategicAlignment,
    operationalConsistency,
    governanceSynchronization,
    resilienceCoherence,
    coordinationIntegrity,
    adaptationAlignment,
    institutionalHarmony,
    confidence,
    timestamp: Date.now(),
  };
}
