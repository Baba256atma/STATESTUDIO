/**
 * D7:8:5 — Strategic-recovery analysis for intelligence resilience.
 */

import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { OperationalUniverseState } from "../reality/strategicRealityTypes.ts";
import type { MetaStrategicIntelligenceState } from "./metaStrategicTypes.ts";
import type { StrategicPatternEvolutionIntelligenceState } from "./strategicPatternEvolutionTypes.ts";
import type { StrategicIntelligenceDriftIntelligenceState } from "./strategicIntelligenceDriftTypes.ts";
import type {
  LongHorizonResilienceRecord,
  StrategicRecoveryRecord,
  StrategicIntelligenceResilienceSignal,
} from "./strategicIntelligenceResilienceTypes.ts";
import { logStrategicIntelligenceResilienceDev } from "./strategicIntelligenceResilienceDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeStrategicRecovery(input: {
  resilienceSignals: readonly StrategicIntelligenceResilienceSignal[];
  longHorizonResilienceRecords: readonly LongHorizonResilienceRecord[];
  strategicDriftState: StrategicIntelligenceDriftIntelligenceState;
  strategicPatternState: StrategicPatternEvolutionIntelligenceState;
  metaStrategicState: MetaStrategicIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
}): readonly StrategicRecoveryRecord[] {
  const records: StrategicRecoveryRecord[] = [];
  const resilienceIds = input.resilienceSignals.map((s) => s.resilienceId);

  const strainedSignals = input.resilienceSignals.filter(
    (s) => s.resilienceState === "strained" || s.resilienceState === "critical"
  ).length;

  records.push(
    Object.freeze({
      recordId: "recovery::resilience-degradation",
      recoveryType: "resilience_degradation",
      recoveryStrength: clamp01(
        strainedSignals / Math.max(1, input.resilienceSignals.length) * 0.5 +
          input.strategicDriftState.longHorizonDriftScore * 0.35
      ),
      explanation:
        "Resilience degradation may signal declining capacity to absorb optimization pressure without coherence loss.",
      contributingResilienceIds: Object.freeze(resilienceIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "recovery::recovery-fatigue",
      recoveryType: "recovery_fatigue",
      recoveryStrength: clamp01(
        input.strategicDriftState.strategicDriftInstabilityScore * 0.45 +
          (1 - input.operationalUniverseState.momentumState.recoveryMomentumScore) * 0.35
      ),
      explanation:
        "Recovery fatigue may emerge when repeated pressure cycles exhaust adaptive coordination without restoration.",
      contributingResilienceIds: Object.freeze(resilienceIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "recovery::governance-instability",
      recoveryType: "governance_resilience_instability",
      recoveryStrength: clamp01(
        (1 - input.operationalUniverseState.governanceState.governanceStabilityScore) * 0.55 +
          input.metaStrategicState.metaInstabilityScore * 0.3
      ),
      explanation:
        "Governance resilience instability may weaken stabilization when predictive volatility rises.",
      contributingResilienceIds: Object.freeze(resilienceIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "recovery::continuity-failure",
      recoveryType: "continuity_preservation_failure",
      recoveryStrength: clamp01(
        input.strategicRealityState.realityInstabilityScore * 0.45 +
          input.strategicDriftState.strategicDriftInstabilityScore * 0.35
      ),
      explanation:
        "Continuity-preservation failure may elevate when leadership overload compounds continuity degradation.",
      contributingResilienceIds: Object.freeze(resilienceIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "recovery::exhaustion-risk",
      recoveryType: "strategic_exhaustion_risk",
      recoveryStrength: clamp01(
        input.strategicDriftState.longHorizonDriftScore * 0.4 +
          input.strategicPatternState.patternInstabilityScore * 0.35 +
          (input.longHorizonResilienceRecords.find((r) =>
            r.recordId.includes("under-pressure")
          )?.resilienceStrength ?? 0.3)
      ),
      explanation:
        "Repeated optimization pressure with declining resilience redundancy and leadership overload may signal strategic resilience exhaustion risk.",
      contributingResilienceIds: Object.freeze(resilienceIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "recovery::resilience-fragmentation",
      recoveryType: "long_horizon_resilience_fragmentation",
      recoveryStrength: clamp01(
        input.strategicPatternState.patternInstabilityScore * 0.4 +
          input.metaStrategicState.metaInstabilityScore * 0.35
      ),
      explanation:
        "Long-horizon resilience fragmentation may appear when recovery pathways diverge across domains without shared coherence.",
      contributingResilienceIds: Object.freeze(resilienceIds.slice(0, 4)),
    })
  );

  logStrategicIntelligenceResilienceDev("MetaRecovery", {
    recoveryRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateRecoveryPressureScore(input: {
  resilienceSignals: readonly StrategicIntelligenceResilienceSignal[];
  strategicRecoveryRecords: readonly StrategicRecoveryRecord[];
  strategicDriftState: StrategicIntelligenceDriftIntelligenceState;
}): number {
  const strainedSignals = input.resilienceSignals.filter(
    (s) => s.resilienceState === "strained" || s.resilienceState === "critical"
  ).length;
  const recoveryPressure =
    input.strategicRecoveryRecords.length === 0
      ? 0
      : input.strategicRecoveryRecords.reduce((s, r) => s + r.recoveryStrength, 0) /
        input.strategicRecoveryRecords.length;
  return clamp01(
    (strainedSignals / Math.max(1, input.resilienceSignals.length)) * 0.35 +
      recoveryPressure * 0.35 +
      input.strategicDriftState.strategicDriftInstabilityScore * 0.2 +
      input.strategicDriftState.longHorizonDriftScore * 0.05
  );
}
