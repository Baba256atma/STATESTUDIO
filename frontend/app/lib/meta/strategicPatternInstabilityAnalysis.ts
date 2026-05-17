/**
 * D7:8:2 — Strategic-pattern instability analysis.
 */

import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { OperationalUniverseState } from "../reality/strategicRealityTypes.ts";
import type { MetaStrategicIntelligenceState } from "./metaStrategicTypes.ts";
import type {
  LongHorizonPatternRecord,
  StrategicPatternEvolutionSignal,
  StrategicPatternInstabilityRecord,
} from "./strategicPatternEvolutionTypes.ts";
import { logStrategicPatternEvolutionDev } from "./strategicPatternEvolutionDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeStrategicPatternInstability(input: {
  patternSignals: readonly StrategicPatternEvolutionSignal[];
  longHorizonPatternRecords: readonly LongHorizonPatternRecord[];
  metaStrategicState: MetaStrategicIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
}): readonly StrategicPatternInstabilityRecord[] {
  const records: StrategicPatternInstabilityRecord[] = [];
  const patternIds = input.patternSignals.map((s) => s.patternId);

  const degradingSignals = input.patternSignals.filter(
    (s) => s.patternState === "degrading" || s.patternState === "critical"
  ).length;

  records.push(
    Object.freeze({
      recordId: "instability::degrading-behaviors",
      instabilityType: "degrading_strategic_behaviors",
      instabilityStrength: clamp01(
        degradingSignals / Math.max(1, input.patternSignals.length) * 0.5 +
          input.metaStrategicState.metaInstabilityScore * 0.35
      ),
      explanation:
        "Degrading strategic behaviors may accumulate when recurring decisions repeatedly weaken shared resilience objectives.",
      contributingPatternIds: Object.freeze(patternIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "instability::governance-recurrence",
      instabilityType: "unstable_recurring_governance_patterns",
      instabilityStrength: clamp01(
        (1 - input.operationalUniverseState.governanceState.governanceStabilityScore) * 0.55 +
          input.operationalUniverseState.governanceState.oversightRequirementScore * 0.3
      ),
      explanation:
        "Unstable recurring governance patterns may elevate when policy fragmentation persists through repeated strategic cycles.",
      contributingPatternIds: Object.freeze(patternIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "instability::fragility-accumulation",
      instabilityType: "long_horizon_fragility_accumulation",
      instabilityStrength: clamp01(
        input.strategicRealityState.realityInstabilityScore * 0.45 +
          (input.longHorizonPatternRecords.find((r) =>
            r.recordId.includes("optimization-risk")
          )?.patternStrength ?? 0.35)
      ),
      explanation:
        "Long-horizon fragility accumulation may signal a negative strategic evolution pattern as dependency concentration compounds.",
      contributingPatternIds: Object.freeze(patternIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "instability::resilience-erosion",
      instabilityType: "resilience_erosion_cycles",
      instabilityStrength: clamp01(
        Math.abs(
          input.operationalUniverseState.resilienceState.enterpriseResilienceScore -
            input.operationalUniverseState.momentumState.recoveryMomentumScore
        ) * 0.85
      ),
      explanation:
        "Resilience erosion cycles may emerge when recovery capacity repeatedly lags behind operational optimization pressure.",
      contributingPatternIds: Object.freeze(patternIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "instability::continuity-degradation",
      instabilityType: "continuity_degradation_patterns",
      instabilityStrength: clamp01(
        input.strategicRealityState.realityInstabilityScore * 0.4 +
          degradingSignals / Math.max(1, input.patternSignals.length) * 0.35
      ),
      explanation:
        "Repeated aggressive optimization with declining continuity resilience may form a continuity degradation pattern.",
      contributingPatternIds: Object.freeze(patternIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "instability::recursive-contradiction",
      instabilityType: "recursive_strategic_contradictions",
      instabilityStrength: clamp01(
        input.longHorizonPatternRecords.find((r) =>
          r.recordId.includes("optimization-risk")
        )?.patternStrength ?? 0.35
      ),
      explanation:
        "Recursive strategic contradictions may appear when competing recurring initiatives reinforce short-term gains while undermining continuity.",
      contributingPatternIds: Object.freeze(patternIds.slice(0, 4)),
    })
  );

  logStrategicPatternEvolutionDev("RecurringBehavior", {
    instabilityRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculatePatternCoherenceScore(input: {
  patternSignals: readonly StrategicPatternEvolutionSignal[];
  patternInstabilityRecords: readonly StrategicPatternInstabilityRecord[];
  metaStrategicState: MetaStrategicIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
}): number {
  if (input.patternSignals.length === 0) return 0;
  const signalAvg =
    input.patternSignals.reduce((s, sig) => s + sig.patternStrength, 0) /
    input.patternSignals.length;
  const instabilityPressure =
    input.patternInstabilityRecords.length === 0
      ? 0
      : input.patternInstabilityRecords.reduce((s, r) => s + r.instabilityStrength, 0) /
        input.patternInstabilityRecords.length;
  return clamp01(
    signalAvg * 0.35 +
      (1 - instabilityPressure) * 0.3 +
      input.metaStrategicState.strategicMetaCoherenceScore * 0.2 +
      input.strategicRealityState.operationalRealityCoherenceScore * 0.1 -
      input.metaStrategicState.metaInstabilityScore * 0.05
  );
}

export function calculatePatternInstabilityScore(input: {
  patternSignals: readonly StrategicPatternEvolutionSignal[];
  patternInstabilityRecords: readonly StrategicPatternInstabilityRecord[];
  metaStrategicState: MetaStrategicIntelligenceState;
}): number {
  const unstableSignals = input.patternSignals.filter(
    (s) => s.patternState === "degrading" || s.patternState === "critical"
  ).length;
  const instabilityPressure =
    input.patternInstabilityRecords.length === 0
      ? 0
      : input.patternInstabilityRecords.reduce((s, r) => s + r.instabilityStrength, 0) /
        input.patternInstabilityRecords.length;
  return clamp01(
    (unstableSignals / Math.max(1, input.patternSignals.length)) * 0.35 +
      instabilityPressure * 0.35 +
      input.metaStrategicState.metaInstabilityScore * 0.25
  );
}
