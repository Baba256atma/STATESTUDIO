import { stableSignature } from "../../../intelligence/shared/dedupe";
import { enterpriseCognitionOrchestrationLayer } from "./enterpriseCognitionOrchestrationLayer";
import { executiveCognitionSynchronizationLayer } from "./executiveCognitionSynchronizationLayer";
import { institutionalAdaptationContinuityLayer } from "./institutionalAdaptationContinuityLayer";
import type {
  AdaptationRuntimeState,
  ContinuityHealthRuntime,
  EnterpriseCognitiveRuntimeState,
  ForesightRuntimeState,
  GovernanceRuntimeState,
  InstitutionalLearningRuntimeState,
  OperationalRuntimeState,
  ResilienceRuntimeState,
  StrategicAdvisoryRuntimeState,
  SynthesizeEnterpriseCognitiveRuntimeInput,
} from "./enterpriseCognitiveRuntimeTypes";

export function buildEnterpriseCognitiveRuntimeSignature(
  state: EnterpriseCognitiveRuntimeState
): string {
  return stableSignature([
    "f10-6-institutional-runtime",
    state.organizationId,
    state.synchronizationHealth,
    state.cognitionIntegrity,
    state.continuityHealth,
    String(state.strategicConfidence),
  ]);
}

export function synthesizeEnterpriseCognitiveRuntimeState(
  input: SynthesizeEnterpriseCognitiveRuntimeInput
): EnterpriseCognitiveRuntimeState | null {
  const stack = input.intelligenceStack;
  const hasSignal =
    stack.unifiedStrategicConsciousnessActive ||
    stack.enterpriseMetaIntelligenceActive ||
    stack.unifiedGovernanceRuntimeActive;

  if (!hasSignal && !input.continuityPreserved) return null;

  const operationalState: OperationalRuntimeState = input.fragilityElevated
    ? "pressurized"
    : stack.unifiedGovernanceRuntimeActive
      ? "synchronized"
      : "stable";

  const governanceState: GovernanceRuntimeState = stack.unifiedGovernanceRuntimeActive
    ? "orchestrated"
    : stack.governanceOversightActive
      ? "active"
      : "idle";

  const resilienceState: ResilienceRuntimeState = input.fragilityElevated
    ? "fragile"
    : stack.executiveStabilityActive && stack.cognitiveEvolutionActive
      ? "sustained"
      : "coordinated";

  const strategicAdvisoryState: StrategicAdvisoryRuntimeState =
    stack.executiveMetaCognitionActive && stack.enterpriseCoherenceActive
      ? "coherent"
      : stack.governanceOversightActive
        ? "synchronized"
        : "bounded";

  const foresightState: ForesightRuntimeState = stack.futureStateIntelligenceActive
    ? "synchronized"
    : stack.strategicForesightActive
      ? "active"
      : "idle";

  const institutionalLearningState: InstitutionalLearningRuntimeState =
    stack.cognitiveEvolutionActive && stack.institutionalReflectionActive
      ? "complete"
      : stack.institutionalReflectionActive
        ? "maturing"
        : "nascent";

  const executiveAttentionState = executiveCognitionSynchronizationLayer.inferExecutiveAttention(
    stack,
    input.fragilityElevated
  );

  const cognitionIntegrity = enterpriseCognitionOrchestrationLayer.inferCognitionIntegrity(stack);

  const continuityHealth: ContinuityHealthRuntime = input.continuityPreserved
    ? input.cognitionConverged
      ? "strong"
      : "preserved"
    : "degraded";

  const synchronizationHealth = enterpriseCognitionOrchestrationLayer.inferSynchronizationHealth(
    stack,
    input.continuityPreserved,
    input.runtimeStable
  );

  const adaptationState = institutionalAdaptationContinuityLayer.inferAdaptationState(stack);

  const uncertaintyFactors: string[] = [
    "enterprise cognitive runtime coordinates intelligence — executive authority preserved",
  ];
  if (input.fragilityElevated) {
    uncertaintyFactors.push("elevated fragility requires continuity-safe orchestration");
  }

  const strategicConfidence = Number(
    Math.min(
      0.92,
      0.22 +
        (input.continuityPreserved ? 0.14 : 0) +
        (input.cognitionConverged ? 0.12 : 0) +
        (synchronizationHealth === "complete" ? 0.1 : 0.04) +
        (input.fragilityElevated ? -0.1 : 0.06)
    ).toFixed(2)
  );

  return {
    organizationId: input.organizationId,
    operationalState,
    governanceState,
    resilienceState,
    strategicAdvisoryState,
    foresightState,
    institutionalLearningState,
    executiveAttentionState,
    cognitionIntegrity,
    continuityHealth,
    synchronizationHealth,
    strategicConfidence: Math.max(0.15, strategicConfidence),
    adaptationState,
    uncertaintyFactors: Object.freeze(uncertaintyFactors),
    synchronizedAt: Date.now(),
  };
}
