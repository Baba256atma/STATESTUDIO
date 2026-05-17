/**
 * D7:8:8 — Continuity-fragmentation analysis for strategic intelligence continuity.
 */

import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { OperationalUniverseState } from "../reality/strategicRealityTypes.ts";
import type { MetaStrategicIntelligenceState } from "./metaStrategicTypes.ts";
import type { StrategicPatternEvolutionIntelligenceState } from "./strategicPatternEvolutionTypes.ts";
import type { StrategicIntelligenceDriftIntelligenceState } from "./strategicIntelligenceDriftTypes.ts";
import type { StrategicIntelligenceResilienceIntelligenceState } from "./strategicIntelligenceResilienceTypes.ts";
import type { StrategicIntelligenceEvolutionIntelligenceState } from "./strategicIntelligenceEvolutionTypes.ts";
import type { StrategicIntelligenceEquilibriumIntelligenceState } from "./strategicIntelligenceEquilibriumTypes.ts";
import type {
  LongHorizonContinuityRecord,
  ContinuityFragmentationRecord,
  StrategicIntelligenceContinuitySignal,
} from "./strategicIntelligenceContinuityTypes.ts";
import { logStrategicIntelligenceContinuityDev } from "./strategicIntelligenceContinuityDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeContinuityFragmentation(input: {
  continuitySignals: readonly StrategicIntelligenceContinuitySignal[];
  longHorizonContinuityRecords: readonly LongHorizonContinuityRecord[];
  strategicEquilibriumState: StrategicIntelligenceEquilibriumIntelligenceState;
  strategicEvolutionState: StrategicIntelligenceEvolutionIntelligenceState;
  strategicResilienceState: StrategicIntelligenceResilienceIntelligenceState;
  strategicDriftState: StrategicIntelligenceDriftIntelligenceState;
  strategicPatternState: StrategicPatternEvolutionIntelligenceState;
  metaStrategicState: MetaStrategicIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
}): readonly ContinuityFragmentationRecord[] {
  const records: ContinuityFragmentationRecord[] = [];
  const continuityIds = input.continuitySignals.map((s) => s.continuityId);
  const fragmentingSignals = input.continuitySignals.filter(
    (s) => s.continuityState === "fragmenting" || s.continuityState === "critical"
  ).length;

  records.push(
    Object.freeze({
      recordId: "fragmentation::continuity-degradation",
      fragmentationType: "strategic_continuity_degradation",
      fragmentationStrength: clamp01(
        fragmentingSignals / Math.max(1, input.continuitySignals.length) * 0.5 +
          input.strategicDriftState.longHorizonDriftScore * 0.35
      ),
      explanation:
        "Strategic continuity degradation may signal declining capacity to preserve long-horizon direction under sustained pressure.",
      contributingContinuityIds: Object.freeze(continuityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "fragmentation::long-horizon",
      fragmentationType: "long_horizon_fragmentation",
      fragmentationStrength: clamp01(
        input.strategicDriftState.strategicDriftInstabilityScore * 0.45 +
          input.strategicEvolutionState.transformationPressureScore * 0.35
      ),
      explanation:
        "Long-horizon fragmentation may emerge when enterprise cognition diverges across evolving operational realities.",
      contributingContinuityIds: Object.freeze(continuityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "fragmentation::resilience-exhaustion",
      fragmentationType: "resilience_exhaustion_continuity",
      fragmentationStrength: clamp01(
        input.strategicResilienceState.recoveryPressureScore * 0.5 +
          (1 - input.strategicResilienceState.adaptiveRecoveryScore) * 0.35
      ),
      explanation:
        "Resilience exhaustion may weaken continuity preservation when recovery cycles fail to restore coherence.",
      contributingContinuityIds: Object.freeze(continuityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "fragmentation::governance-instability",
      fragmentationType: "governance_continuity_instability",
      fragmentationStrength: clamp01(
        (1 - input.operationalUniverseState.governanceState.governanceStabilityScore) * 0.55 +
          input.metaStrategicState.metaInstabilityScore * 0.3
      ),
      explanation:
        "Governance continuity instability may elevate when leadership fragmentation compounds continuity degradation.",
      contributingContinuityIds: Object.freeze(continuityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "fragmentation::persistence-failure",
      fragmentationType: "strategic_persistence_failure",
      fragmentationStrength: clamp01(
        input.strategicRealityState.realityInstabilityScore * 0.45 +
          input.strategicEquilibriumState.equilibriumPressureScore * 0.35
      ),
      explanation:
        "Strategic persistence failure may threaten sustainable organizational direction when equilibrium and reality coherence weaken.",
      contributingContinuityIds: Object.freeze(continuityIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "fragmentation::collapse-pathway",
      fragmentationType: "continuity_collapse_pathway",
      fragmentationStrength: clamp01(
        input.strategicDriftState.longHorizonDriftScore * 0.4 +
          input.strategicPatternState.patternInstabilityScore * 0.35 +
          input.strategicResilienceState.recoveryPressureScore * 0.15
      ),
      explanation:
        "Repeated optimization pressure with declining continuity redundancy and leadership overload may signal strategic continuity fragmentation risk.",
      contributingContinuityIds: Object.freeze(continuityIds.slice(0, 4)),
    })
  );

  logStrategicIntelligenceContinuityDev("MetaContinuity", {
    fragmentationRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateFragmentationPressureScore(input: {
  continuitySignals: readonly StrategicIntelligenceContinuitySignal[];
  continuityFragmentationRecords: readonly ContinuityFragmentationRecord[];
  strategicEquilibriumState: StrategicIntelligenceEquilibriumIntelligenceState;
  strategicResilienceState: StrategicIntelligenceResilienceIntelligenceState;
}): number {
  const fragmentingSignals = input.continuitySignals.filter(
    (s) => s.continuityState === "fragmenting" || s.continuityState === "critical"
  ).length;
  const fragmentationPressure =
    input.continuityFragmentationRecords.length === 0
      ? 0
      : input.continuityFragmentationRecords.reduce((s, r) => s + r.fragmentationStrength, 0) /
        input.continuityFragmentationRecords.length;
  return clamp01(
    (fragmentingSignals / Math.max(1, input.continuitySignals.length)) * 0.35 +
      fragmentationPressure * 0.35 +
      input.strategicEquilibriumState.equilibriumPressureScore * 0.15 +
      input.strategicResilienceState.recoveryPressureScore * 0.1
  );
}
