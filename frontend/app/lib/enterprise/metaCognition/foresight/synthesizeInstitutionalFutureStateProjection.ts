import { stableSignature } from "../../../intelligence/shared/dedupe";
import { organizationalTrajectoryLayer } from "./organizationalTrajectoryLayer";
import { resilienceForesightLayer } from "./resilienceForesightLayer";
import { strategicTimingIntelligenceLayer } from "./strategicTimingIntelligenceLayer";
import type {
  GovernanceEvolutionOutlook,
  InstitutionalFutureStateProjection,
  SynthesizeInstitutionalFutureStateProjectionInput,
} from "./institutionalFutureStateTypes";

export function buildInstitutionalFutureStateProjectionSignature(
  projection: InstitutionalFutureStateProjection
): string {
  return stableSignature([
    "f10-4-foresight",
    projection.organizationId,
    projection.currentTrajectory,
    projection.resilienceTrajectory,
    projection.fragilityTrajectory,
    projection.governanceEvolution,
    String(projection.confidence),
  ]);
}

function inferGovernanceEvolutionOutlook(
  stack: SynthesizeInstitutionalFutureStateProjectionInput["intelligenceStack"]
): GovernanceEvolutionOutlook {
  if (stack.unifiedGovernanceRuntimeActive && stack.governanceOversightActive) {
    return "maturing";
  }
  if (stack.pressurePosture === "attention" || stack.metaCognitionPosture === "attention") {
    return "strained";
  }
  if (stack.cognitiveEvolutionPosture === "evolving") return "consolidating";
  return "uncertain";
}

export function synthesizeInstitutionalFutureStateProjection(
  input: SynthesizeInstitutionalFutureStateProjectionInput
): InstitutionalFutureStateProjection | null {
  const stack = input.intelligenceStack;
  const hasSignal =
    stack.institutionalReflectionActive ||
    stack.cognitiveEvolutionActive ||
    stack.executiveMetaCognitionActive ||
    stack.unifiedGovernanceRuntimeActive;

  if (!hasSignal && !input.continuityPreserved) return null;

  const currentTrajectory = organizationalTrajectoryLayer.inferCurrentTrajectory(
    stack,
    input.fragilityElevated
  );
  const fragilityTrajectory = organizationalTrajectoryLayer.inferFragilityTrajectory(
    input.fragilityElevated,
    stack
  );
  const resilienceTrajectory = resilienceForesightLayer.inferResilienceTrajectory(
    stack,
    input.fragilityElevated
  );
  const possibleFutureStates = organizationalTrajectoryLayer.collectPossibleFutureStates(
    currentTrajectory,
    stack
  );
  const escalationRisks = organizationalTrajectoryLayer.collectEscalationRisks(
    currentTrajectory,
    input.fragilityElevated
  );
  const adaptationOpportunities = resilienceForesightLayer.collectAdaptationOpportunities(
    stack,
    input.cognitionConverged
  );
  const governanceEvolution = inferGovernanceEvolutionOutlook(stack);
  const timingConsiderations = strategicTimingIntelligenceLayer.collectTimingConsiderations(
    currentTrajectory,
    stack,
    input.fragilityElevated
  );

  const uncertaintyFactors: string[] = [
    "future trajectories are possible paths — not guaranteed outcomes",
  ];
  if (input.fragilityElevated) {
    uncertaintyFactors.push("elevated fragility widens outcome variance");
  }
  if (!input.cognitionConverged) {
    uncertaintyFactors.push("cognition convergence incomplete — timing windows less stable");
  }

  const strategicForesightSummary =
    currentTrajectory === "ascending" || currentTrajectory === "adapting"
      ? "Strategic foresight reasons about institutional futures — trajectory, resilience, and timing without prediction certainty"
      : "Future-state intelligence observes emerging trajectories with strategic humility";

  const confidence = Number(
    Math.min(
      0.88,
      0.18 +
        (input.continuityPreserved ? 0.12 : 0) +
        (input.cognitionConverged ? 0.08 : 0) +
        (stack.institutionalReflectionActive ? 0.1 : 0) +
        (input.fragilityElevated ? -0.12 : 0.05)
    ).toFixed(2)
  );

  return {
    organizationId: input.organizationId,
    currentTrajectory,
    possibleFutureStates: Object.freeze(possibleFutureStates),
    resilienceTrajectory,
    fragilityTrajectory,
    escalationRisks: Object.freeze(escalationRisks),
    adaptationOpportunities: Object.freeze(adaptationOpportunities),
    governanceEvolution,
    timingConsiderations: Object.freeze(timingConsiderations),
    uncertaintyFactors: Object.freeze(uncertaintyFactors),
    strategicForesightSummary,
    confidence: Math.max(0.15, confidence),
    timestamp: Date.now(),
  };
}
