import { stableSignature } from "../../../intelligence/shared/dedupe";
import { crossLayerCognitionSynchronizationLayer } from "./crossLayerCognitionSynchronizationLayer";
import { executiveStrategicAttentionLayer } from "./executiveStrategicAttentionLayer";
import type {
  AdvisoryConsciousnessState,
  ContinuityHealth,
  ForesightConsciousnessState,
  InstitutionalLearningState,
  StrategicTrajectoryState,
  SynthesizeUnifiedStrategicConsciousnessInput,
  UnifiedStrategicConsciousnessState,
} from "./unifiedStrategicConsciousnessTypes";

export function buildUnifiedStrategicConsciousnessSignature(
  state: UnifiedStrategicConsciousnessState
): string {
  return stableSignature([
    "f10-5-consciousness",
    state.organizationId,
    state.governanceState,
    state.cognitionIntegrity,
    state.continuityHealth,
    String(state.strategicConfidence),
  ]);
}

function inferStrategicTrajectory(
  stack: SynthesizeUnifiedStrategicConsciousnessInput["intelligenceStack"],
  fragilityElevated: boolean
): StrategicTrajectoryState {
  if (fragilityElevated) return "at_risk";
  const projection = stack.autonomousStrategicForesight?.canonical;
  if (projection?.currentTrajectory === "ascending") return "ascending";
  if (projection?.currentTrajectory === "adapting") return "adapting";
  return "stable";
}

function inferInstitutionalLearning(
  stack: SynthesizeUnifiedStrategicConsciousnessInput["intelligenceStack"]
): InstitutionalLearningState {
  const reflection = stack.institutionalStrategicReflection?.canonical;
  if (!reflection) return "nascent";
  if (reflection.reasoningEvolution === "sustained") return "sustained";
  if (reflection.reasoningEvolution === "maturing") return "maturing";
  if (reflection.reasoningEvolution === "forming") return "forming";
  return "nascent";
}

function inferForesightState(
  stack: SynthesizeUnifiedStrategicConsciousnessInput["intelligenceStack"]
): ForesightConsciousnessState {
  if (stack.futureStateIntelligenceActive) return "sustained";
  if (stack.strategicForesightActive) return "active";
  if (stack.strategicForesightPosture === "observing") return "observing";
  return "idle";
}

function inferAdvisoryState(
  stack: SynthesizeUnifiedStrategicConsciousnessInput["intelligenceStack"]
): AdvisoryConsciousnessState {
  if (stack.executiveMetaCognitionActive && stack.enterpriseCoherenceActive) {
    return "coherent";
  }
  if (stack.governanceOversightActive) return "synchronized";
  return "bounded";
}

export function synthesizeUnifiedStrategicConsciousnessState(
  input: SynthesizeUnifiedStrategicConsciousnessInput
): UnifiedStrategicConsciousnessState | null {
  const stack = input.intelligenceStack;
  const hasSignal =
    stack.unifiedGovernanceRuntimeActive ||
    stack.executiveMetaCognitionActive ||
    stack.institutionalReflectionActive ||
    stack.strategicForesightActive;

  if (!hasSignal && !input.continuityPreserved) return null;

  const governanceState = crossLayerCognitionSynchronizationLayer.inferGovernanceState(stack);
  const operationalIntelligence =
    crossLayerCognitionSynchronizationLayer.inferOperationalState(stack, input.fragilityElevated);
  const resilienceState = crossLayerCognitionSynchronizationLayer.inferResilienceState(
    stack,
    input.fragilityElevated
  );
  const activeLayerCount = crossLayerCognitionSynchronizationLayer.countActiveLayers(stack);
  const cognitionIntegrity = crossLayerCognitionSynchronizationLayer.inferCognitionIntegrity(
    stack,
    activeLayerCount
  );
  const executiveAttentionState = executiveStrategicAttentionLayer.inferExecutiveAttentionState(
    stack,
    input.fragilityElevated
  );

  const continuityHealth: ContinuityHealth = input.continuityPreserved
    ? input.cognitionConverged
      ? "strong"
      : "preserved"
    : "degraded";

  const uncertaintyFactors: string[] = [
    "unified meta-intelligence coordinates cognition — not artificial self-awareness",
  ];
  if (input.fragilityElevated) {
    uncertaintyFactors.push("elevated fragility requires continuity-safe orchestration");
  }

  const strategicConfidence = Number(
    Math.min(
      0.9,
      0.2 +
        (input.continuityPreserved ? 0.14 : 0) +
        (input.cognitionConverged ? 0.1 : 0) +
        (cognitionIntegrity === "orchestrated" ? 0.12 : cognitionIntegrity === "harmonized" ? 0.08 : 0) +
        (input.fragilityElevated ? -0.1 : 0.05)
    ).toFixed(2)
  );

  return {
    organizationId: input.organizationId,
    governanceState,
    operationalIntelligence,
    resilienceState,
    strategicTrajectory: inferStrategicTrajectory(stack, input.fragilityElevated),
    institutionalLearningState: inferInstitutionalLearning(stack),
    foresightState: inferForesightState(stack),
    advisoryState: inferAdvisoryState(stack),
    executiveAttentionState,
    strategicConfidence: Math.max(0.15, strategicConfidence),
    continuityHealth,
    cognitionIntegrity,
    uncertaintyFactors: Object.freeze(uncertaintyFactors),
    synchronizedAt: Date.now(),
  };
}
