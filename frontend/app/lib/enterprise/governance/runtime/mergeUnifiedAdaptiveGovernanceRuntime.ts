import { stableSignature } from "../../../intelligence/shared/dedupe";
import type { AdaptiveGovernanceIntelligenceSnapshot } from "../adaptiveGovernanceTypes";
import type { UnifiedAdaptiveGovernanceRuntimeSnapshot } from "./unifiedAdaptiveGovernanceTypes";

/**
 * F9:6 — Merges unified runtime convergence into the complete governance stack snapshot.
 */
export function mergeUnifiedAdaptiveGovernanceRuntime(
  stack: AdaptiveGovernanceIntelligenceSnapshot,
  runtime: UnifiedAdaptiveGovernanceRuntimeSnapshot
): AdaptiveGovernanceIntelligenceSnapshot {
  const useUnifiedDisplay =
    runtime.unifiedGovernanceRuntimeActive ||
    (runtime.institutionalStrategicEvolutionConverged &&
      runtime.evolutionConvergencePosture !== "idle");

  const displayHeadline = useUnifiedDisplay
    ? runtime.unifiedGovernanceHeadline
    : stack.governanceHeadline;

  const displaySubline = useUnifiedDisplay
    ? runtime.unifiedGovernanceSubline
    : stack.governanceSubline;

  const signature = stableSignature([
    "f9-unified-governance-runtime",
    stack.signature,
    runtime.signature,
  ]);

  const assistantLine =
    runtime.assistantUnifiedGovernanceLine ||
    stack.assistantAdaptationLine ||
    stack.assistantStabilityLine ||
    stack.assistantCalibrationLine ||
    stack.assistantCoherenceLine ||
    stack.assistantGovernanceLine;

  return {
    ...stack,
    signature,
    visible: stack.visible || runtime.visible,
    governanceHeadline: displayHeadline,
    governanceSubline: displaySubline,
    timelineGovernanceLine: useUnifiedDisplay
      ? runtime.timelineStrategicEvolutionLine
      : stack.timelineGovernanceLine,
    assistantGovernanceLine: assistantLine,
    evolutionConvergencePosture: runtime.evolutionConvergencePosture,
    unifiedGovernanceHeadline: runtime.unifiedGovernanceHeadline,
    unifiedGovernanceSubline: runtime.unifiedGovernanceSubline,
    strategicEvolutionLine: runtime.strategicEvolutionLine,
    selfRegulationLine: runtime.selfRegulationLine,
    timelineStrategicEvolutionLine: runtime.timelineStrategicEvolutionLine,
    assistantUnifiedGovernanceLine: runtime.assistantUnifiedGovernanceLine,
    unifiedGovernanceRuntimeActive: runtime.unifiedGovernanceRuntimeActive,
    institutionalStrategicEvolutionConverged: runtime.institutionalStrategicEvolutionConverged,
    unifiedAdaptiveGovernanceRuntime: runtime,
  };
}
