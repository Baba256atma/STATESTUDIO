/**
 * D7:7:1 — Reality-evolution analysis.
 */

import type { ExecutiveCognitiveCompletionIntelligenceState } from "../cognitive/executiveCognitiveCompletionTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type { OperationalUniverseState } from "./strategicRealityTypes.ts";
import type {
  RealityEvolutionRecord,
  StrategicRealitySignal,
} from "./strategicRealityTypes.ts";
import { logStrategicRealityDev } from "./strategicRealityDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeRealityEvolution(input: {
  realitySignals: readonly StrategicRealitySignal[];
  cognitiveCompletionState: ExecutiveCognitiveCompletionIntelligenceState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  operationalUniverseState: OperationalUniverseState;
  foresightState: PredictiveExecutiveForesightState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
}): readonly RealityEvolutionRecord[] {
  const records: RealityEvolutionRecord[] = [];
  const realityIds = input.realitySignals.map((s) => s.realityId);

  const volatileSignals = input.realitySignals.filter(
    (s) => s.realityState === "volatile" || s.realityState === "critical"
  ).length;

  if (volatileSignals > 0) {
    records.push(
      Object.freeze({
        recordId: "evolution::unstable-ecosystem",
        evolutionType: "unstable_operational_ecosystem",
        evolutionStrength: clamp01(
          volatileSignals / Math.max(1, input.realitySignals.length)
        ),
        explanation:
          "Unstable operational ecosystems may emerge when cross-domain conditions diverge across the strategic reality engine.",
        contributingRealityIds: Object.freeze(realityIds.slice(0, 4)),
      })
    );
  }

  if (
    input.divergenceState.futureFragmentationScore >= 0.5 &&
    input.trajectoryState.trajectoryVolatilityScore >= 0.45
  ) {
    records.push(
      Object.freeze({
        recordId: "evolution::reality-coherence-degradation",
        evolutionType: "operational_state_divergence",
        evolutionStrength: clamp01(
          input.divergenceState.futureFragmentationScore * 0.5 +
            input.trajectoryState.trajectoryVolatilityScore * 0.4
        ),
        explanation:
          "Reality coherence degradation may occur when cross-domain operational instability intersects with future divergence escalation.",
        contributingRealityIds: Object.freeze(realityIds.slice(0, 4)),
      })
    );
  }

  if (
    input.cognitiveCompletionState.executiveCompletionLabel === "fragmented" ||
    input.cognitiveCompletionState.executiveCompletionLabel === "critical"
  ) {
    records.push(
      Object.freeze({
        recordId: "evolution::fragmented-reality",
        evolutionType: "fragmented_strategic_reality",
        evolutionStrength: clamp01(input.cognitiveCompletionState.platformCoherenceDegradationScore),
        explanation:
          "Fragmented strategic reality may weaken decision quality when cognitive completion and operational layers diverge.",
        contributingRealityIds: Object.freeze(realityIds.slice(0, 4)),
      })
    );
  }

  if ((1 - input.operationalUniverseState.governanceState.governanceStabilityScore) >= 0.45) {
    records.push(
      Object.freeze({
        recordId: "evolution::governance-instability",
        evolutionType: "governance_instability_propagation",
        evolutionStrength: clamp01(
          (1 - input.operationalUniverseState.governanceState.governanceStabilityScore) * 0.55 +
            input.operationalUniverseState.governanceState.oversightRequirementScore * 0.35
        ),
        explanation:
          "Governance instability propagation may elevate long-horizon recovery pathway risk across operational reality.",
        contributingRealityIds: Object.freeze(realityIds.slice(0, 4)),
      })
    );
  }

  if (input.operationalUniverseState.resilienceState.resilienceDegradationScore >= 0.45) {
    records.push(
      Object.freeze({
        recordId: "evolution::resilience-degradation",
        evolutionType: "resilience_degradation",
        evolutionStrength: clamp01(
          input.operationalUniverseState.resilienceState.resilienceDegradationScore
        ),
        explanation:
          "Resilience degradation may signal declining adaptive capacity within the operational universe.",
        contributingRealityIds: Object.freeze(realityIds.slice(0, 4)),
      })
    );
  }

  if (input.orchestrationState.orchestrationInstabilityScore >= 0.5) {
    records.push(
      Object.freeze({
        recordId: "evolution::continuity-disruption",
        evolutionType: "strategic_continuity_disruption",
        evolutionStrength: clamp01(input.orchestrationState.orchestrationInstabilityScore),
        explanation:
          "Strategic continuity disruption may appear when orchestration instability persists across reality evolution cycles.",
        contributingRealityIds: Object.freeze(realityIds.slice(0, 4)),
      })
    );
  }

  logStrategicRealityDev("RealityEvolution", {
    evolutionRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateRealityInstabilityScore(input: {
  realitySignals: readonly StrategicRealitySignal[];
  evolutionRecords: readonly RealityEvolutionRecord[];
  operationalUniverseState: OperationalUniverseState;
  divergenceState: MultiFutureDivergenceState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
}): number {
  const volatileCount = input.realitySignals.filter(
    (s) => s.realityState === "volatile" || s.realityState === "critical"
  ).length;
  const recordAvg =
    input.evolutionRecords.length === 0
      ? 0
      : input.evolutionRecords.reduce((s, r) => s + r.evolutionStrength, 0) /
        input.evolutionRecords.length;
  return clamp01(
    volatileCount / Math.max(1, input.realitySignals.length) * 0.3 +
      recordAvg * 0.35 +
      input.divergenceState.futureFragmentationScore * 0.15 +
      input.orchestrationState.orchestrationInstabilityScore * 0.1 +
      input.operationalUniverseState.resilienceState.resilienceDegradationScore * 0.08
  );
}
