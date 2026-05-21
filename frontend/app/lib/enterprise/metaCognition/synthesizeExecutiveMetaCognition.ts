import { stableSignature } from "../../intelligence/shared/dedupe";
import { reasoningSelfObservationLayer } from "./reasoningSelfObservationLayer";
import { strategicAssumptionReflectionLayer } from "./strategicAssumptionReflectionLayer";
import type {
  ExecutiveMetaCognitionSnapshot,
  SynthesizeExecutiveMetaCognitionInput,
} from "./executiveMetaCognitionTypes";

export function buildExecutiveMetaCognitionSignature(
  cognition: ExecutiveMetaCognitionSnapshot
): string {
  return stableSignature([
    "f10-1-meta-cognition",
    cognition.organizationId,
    cognition.reasoningPath,
    cognition.uncertainty,
    cognition.confidenceEvolution,
    cognition.governanceContext,
    String(cognition.confidence),
    cognition.supportingSignals.join("|"),
  ]);
}

export function synthesizeExecutiveMetaCognition(
  input: SynthesizeExecutiveMetaCognitionInput
): ExecutiveMetaCognitionSnapshot | null {
  const stack = input.governanceStack;
  const hasSignal =
    stack.visible ||
    stack.governanceOversightActive ||
    stack.unifiedGovernanceRuntimeActive ||
    stack.executiveStabilityActive ||
    stack.organizationalEvolutionActive;

  if (!hasSignal && !input.continuityPreserved) return null;

  const reasoningPath = reasoningSelfObservationLayer.inferReasoningPath(stack);
  const supportingSignals = reasoningSelfObservationLayer.collectSupportingSignals(stack);
  const assumptions = strategicAssumptionReflectionLayer.collectAssumptions(
    input.fragilityElevated,
    input.cognitionConverged,
    stack
  );
  const uncertainty = reasoningSelfObservationLayer.inferUncertaintyLevel(
    input.fragilityElevated,
    input.continuityPreserved,
    stack
  );
  const confidenceEvolution = strategicAssumptionReflectionLayer.inferConfidenceEvolution(
    stack,
    input.fragilityElevated
  );
  const governanceContext =
    stack.unifiedGovernanceSubline || stack.governanceSubline || "Governance context forming";
  const advisoryLimits = strategicAssumptionReflectionLayer.collectAdvisoryLimits();
  const strategicReflection =
    reasoningPath === "reflecting"
      ? "Strategic self-awareness reflects how governance, stability, and adaptation shaped current interpretation"
      : "Meta-cognitive reflection tracks reasoning formation without claiming machine consciousness";

  const confidence = Number(
    Math.min(
      0.94,
      0.22 +
        (input.continuityPreserved ? 0.14 : 0) +
        (input.cognitionConverged ? 0.1 : 0) +
        (stack.unifiedGovernanceRuntimeActive ? 0.12 : 0) +
        (uncertainty === "low" ? 0.1 : uncertainty === "moderate" ? 0.05 : 0) +
        (input.fragilityElevated ? -0.12 : 0.06)
    ).toFixed(2)
  );

  return {
    organizationId: input.organizationId,
    reasoningPath,
    supportingSignals: Object.freeze(supportingSignals),
    assumptions: Object.freeze(assumptions),
    uncertainty,
    confidenceEvolution,
    governanceContext,
    advisoryLimits: Object.freeze(advisoryLimits),
    strategicReflection,
    confidence: Math.max(0.2, confidence),
    timestamp: Date.now(),
  };
}
