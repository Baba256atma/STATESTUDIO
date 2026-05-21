import { stableSignature } from "../../../intelligence/shared/dedupe";
import { executiveCognitiveEvolutionLayer } from "./executiveCognitiveEvolutionLayer";
import { organizationalLearningReflectionLayer } from "./organizationalLearningReflectionLayer";
import type {
  InstitutionalStrategicReflection,
  SynthesizeInstitutionalStrategicReflectionInput,
} from "./institutionalStrategicReflectionTypes";

export function buildInstitutionalStrategicReflectionSignature(
  reflection: InstitutionalStrategicReflection
): string {
  return stableSignature([
    "f10-3-reflection",
    reflection.organizationId,
    reflection.reasoningEvolution,
    reflection.strategicBehaviorPatterns,
    reflection.governanceMaturity,
    reflection.resilienceProgression,
    reflection.coordinationEvolution,
    String(reflection.confidence),
  ]);
}

export function synthesizeInstitutionalStrategicReflection(
  input: SynthesizeInstitutionalStrategicReflectionInput
): InstitutionalStrategicReflection | null {
  const stack = input.intelligenceStack;
  const hasSignal =
    stack.executiveMetaCognitionActive ||
    stack.unifiedGovernanceRuntimeActive ||
    stack.organizationalEvolutionActive ||
    stack.strategicSelfAwarenessActive;

  if (!hasSignal && !input.continuityPreserved) return null;

  const reasoningEvolution = executiveCognitiveEvolutionLayer.inferReasoningEvolution(stack);
  const strategicBehaviorPatterns =
    executiveCognitiveEvolutionLayer.inferStrategicBehaviorPattern(stack);
  const governanceMaturity = executiveCognitiveEvolutionLayer.inferGovernanceMaturity(stack);
  const resilienceProgression = executiveCognitiveEvolutionLayer.inferResilienceProgression(
    stack,
    input.fragilityElevated
  );
  const coordinationEvolution = executiveCognitiveEvolutionLayer.inferCoordinationEvolution(
    stack,
    input.cognitionConverged
  );
  const adaptationSignals = organizationalLearningReflectionLayer.collectAdaptationSignals(stack);
  const executiveLearningIndicators =
    organizationalLearningReflectionLayer.collectExecutiveLearningIndicators(
      stack,
      input.cognitionConverged
    );
  const institutionalStrengths =
    organizationalLearningReflectionLayer.collectInstitutionalStrengths(stack);
  const institutionalFragilities =
    organizationalLearningReflectionLayer.collectInstitutionalFragilities(
      input.fragilityElevated,
      stack
    );

  const strategicReflectionSummary =
    reasoningEvolution === "sustained"
      ? "Institutional strategic reflection tracks mature reasoning evolution across governance and meta-cognition"
      : "Institutional learning awareness forms as organizational reasoning patterns stabilize";

  const confidence = Number(
    Math.min(
      0.93,
      0.2 +
        (input.continuityPreserved ? 0.14 : 0) +
        (input.cognitionConverged ? 0.1 : 0) +
        (reasoningEvolution === "sustained" || reasoningEvolution === "maturing" ? 0.12 : 0) +
        (governanceMaturity === "mature" ? 0.1 : 0) +
        (input.fragilityElevated ? -0.1 : 0.06)
    ).toFixed(2)
  );

  return {
    organizationId: input.organizationId,
    reasoningEvolution,
    strategicBehaviorPatterns,
    governanceMaturity,
    resilienceProgression,
    adaptationSignals: Object.freeze(adaptationSignals),
    executiveLearningIndicators: Object.freeze(executiveLearningIndicators),
    coordinationEvolution,
    institutionalStrengths: Object.freeze(institutionalStrengths),
    institutionalFragilities: Object.freeze(institutionalFragilities),
    strategicReflectionSummary,
    confidence: Math.max(0.2, confidence),
    timestamp: Date.now(),
  };
}
