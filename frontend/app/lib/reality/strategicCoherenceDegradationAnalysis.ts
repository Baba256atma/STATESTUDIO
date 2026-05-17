/**
 * D7:7:4 — Strategic-coherence degradation analysis.
 */

import type { StrategicRealityIntelligenceState } from "./strategicRealityTypes.ts";
import type { OperationalUniverseState } from "./strategicRealityTypes.ts";
import type { EnterpriseRealitySynchronizationIntelligenceState } from "./enterpriseRealitySynchronizationTypes.ts";
import type { EnterpriseOperationalCausalityIntelligenceState } from "./enterpriseOperationalCausalityTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "../recommendation/strategicGovernanceTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type {
  EnterpriseStrategicRealityDriftSignal,
  StrategicCoherenceDegradationRecord,
  DriftEvolutionRecord,
} from "./enterpriseStrategicRealityDriftTypes.ts";
import { logEnterpriseStrategicRealityDriftDev } from "./enterpriseStrategicRealityDriftDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeStrategicCoherenceDegradation(input: {
  driftSignals: readonly EnterpriseStrategicRealityDriftSignal[];
  driftEvolutionRecords: readonly DriftEvolutionRecord[];
  causalityState: EnterpriseOperationalCausalityIntelligenceState;
  synchronizationState: EnterpriseRealitySynchronizationIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  governanceState: ExecutiveStrategicGovernanceState;
  foresightState: PredictiveExecutiveForesightState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
}): readonly StrategicCoherenceDegradationRecord[] {
  const records: StrategicCoherenceDegradationRecord[] = [];
  const driftIds = input.driftSignals.map((s) => s.driftId);

  const driftingSignals = input.driftSignals.filter(
    (s) =>
      s.driftState === "drifting" ||
      s.driftState === "destabilizing" ||
      s.driftState === "critical" ||
      s.driftState === "emerging"
  ).length;

  if (driftingSignals > 0) {
    records.push(
      Object.freeze({
        recordId: "degradation::hidden-instability",
        degradationType: "hidden_strategic_instability",
        degradationStrength: clamp01(
          driftingSignals / Math.max(1, input.driftSignals.length)
        ),
        explanation:
          "Hidden strategic instability may accumulate when no immediate crisis is visible but coordination quality declines continuously.",
        contributingDriftIds: Object.freeze(driftIds.slice(0, 4)),
      })
    );
  }

  if ((1 - input.governanceState.governanceStabilityScore) >= 0.4) {
    records.push(
      Object.freeze({
        recordId: "degradation::governance-degradation",
        degradationType: "slow_governance_degradation",
        degradationStrength: clamp01(
          (1 - input.governanceState.governanceStabilityScore) * 0.55 +
            input.governanceState.oversightRequirementScore * 0.3
        ),
        explanation:
          "Slow governance degradation may erode clarity across financial and logistics coordination pathways.",
        contributingDriftIds: Object.freeze(driftIds.slice(0, 4)),
      })
    );
  }

  if (input.synchronizationState.operationalDriftScore >= 0.4) {
    records.push(
      Object.freeze({
        recordId: "degradation::alignment-drift",
        degradationType: "operational_alignment_drift",
        degradationStrength: clamp01(input.synchronizationState.operationalDriftScore * 0.85),
        explanation:
          "Operational alignment drift may emerge when recovery synchronization weakens across interconnected domains.",
        contributingDriftIds: Object.freeze(driftIds.slice(0, 4)),
      })
    );
  }

  if (input.operationalUniverseState.resilienceState.resilienceDegradationScore >= 0.4) {
    records.push(
      Object.freeze({
        recordId: "degradation::resilience-erosion",
        degradationType: "resilience_capacity_erosion",
        degradationStrength: clamp01(
          input.operationalUniverseState.resilienceState.resilienceDegradationScore
        ),
        explanation:
          "Resilience-capacity erosion may signal declining adaptive recovery capacity over long horizons.",
        contributingDriftIds: Object.freeze(driftIds.slice(0, 4)),
      })
    );
  }

  if (
    input.divergenceState.futureFragmentationScore >= 0.45 &&
    input.trajectoryState.trajectoryVolatilityScore >= 0.4
  ) {
    records.push(
      Object.freeze({
        recordId: "degradation::predictive-weakening",
        degradationType: "predictive_coherence_weakening",
        degradationStrength: clamp01(
          input.divergenceState.futureFragmentationScore * 0.5 +
            input.trajectoryState.trajectoryVolatilityScore * 0.4
        ),
        explanation:
          "Predictive-coherence weakening may reduce forecast alignment as futures diverge across operational domains.",
        contributingDriftIds: Object.freeze(driftIds.slice(0, 4)),
      })
    );
  }

  if (input.strategicRealityState.realityInstabilityScore >= 0.45) {
    records.push(
      Object.freeze({
        recordId: "degradation::long-horizon-fragmentation",
        degradationType: "long_horizon_fragmentation",
        degradationStrength: clamp01(input.strategicRealityState.realityInstabilityScore * 0.8),
        explanation:
          "Long-horizon fragmentation accumulation may introduce emerging enterprise drift risk without acute failure signals.",
        contributingDriftIds: Object.freeze(driftIds.slice(0, 4)),
      })
    );
  }

  logEnterpriseStrategicRealityDriftDev("StrategicCoherence", {
    degradationRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateCoherenceDegradationScore(input: {
  driftSignals: readonly EnterpriseStrategicRealityDriftSignal[];
  degradationRecords: readonly StrategicCoherenceDegradationRecord[];
  driftEvolutionRecords: readonly DriftEvolutionRecord[];
  strategicRealityState: StrategicRealityIntelligenceState;
  synchronizationState: EnterpriseRealitySynchronizationIntelligenceState;
}): number {
  const driftingCount = input.driftSignals.filter(
    (s) =>
      s.driftState === "drifting" ||
      s.driftState === "destabilizing" ||
      s.driftState === "critical"
  ).length;
  const recordAvg =
    input.degradationRecords.length === 0
      ? 0
      : input.degradationRecords.reduce((s, r) => s + r.degradationStrength, 0) /
        input.degradationRecords.length;
  const evolutionAvg =
    input.driftEvolutionRecords.length === 0
      ? 0
      : input.driftEvolutionRecords.reduce((s, r) => s + r.evolutionStrength, 0) /
        input.driftEvolutionRecords.length;
  return clamp01(
    driftingCount / Math.max(1, input.driftSignals.length) * 0.3 +
      recordAvg * 0.35 +
      evolutionAvg * 0.2 +
      input.strategicRealityState.realityInstabilityScore * 0.08 +
      input.synchronizationState.operationalDriftScore * 0.05
  );
}
