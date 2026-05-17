/**
 * D7:8:2 — Enterprise pattern intelligence across recurring strategic behaviors.
 */

import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { OperationalUniverseState } from "../reality/strategicRealityTypes.ts";
import type { MetaStrategicIntelligenceState } from "./metaStrategicTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type {
  EnterprisePatternRecord,
  LongHorizonPatternRecord,
  StrategicPatternEvolutionSignal,
  StrategicPatternInstabilityRecord,
} from "./strategicPatternEvolutionTypes.ts";
import { logStrategicPatternEvolutionDev } from "./strategicPatternEvolutionDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeEnterprisePatternIntelligence(input: {
  patternSignals: readonly StrategicPatternEvolutionSignal[];
  longHorizonPatternRecords: readonly LongHorizonPatternRecord[];
  patternInstabilityRecords: readonly StrategicPatternInstabilityRecord[];
  metaStrategicState: MetaStrategicIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  foresightState: PredictiveExecutiveForesightState;
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
}): readonly EnterprisePatternRecord[] {
  const records: EnterprisePatternRecord[] = [];
  const patternIds = input.patternSignals.map((s) => s.patternId);

  records.push(
    Object.freeze({
      recordId: "enterprise-pattern::operations",
      patternDomain: "operations",
      patternStrength: clamp01(
        input.strategicRealityState.operationalRealityCoherenceScore * 0.45 +
          input.operationalUniverseState.momentumState.organizationalMomentumScore * 0.35
      ),
      explanation:
        "Operations pattern dynamics may reflect recurring optimization-driven behaviors shaping manufacturing and service coordination.",
      contributingPatternIds: Object.freeze(patternIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-pattern::logistics",
      patternDomain: "logistics",
      patternStrength: clamp01(
        input.operationalUniverseState.equilibriumState.equilibriumScore * 0.45 +
          (input.longHorizonPatternRecords.find((r) =>
            r.recordId.includes("recurring-operational")
          )?.patternStrength ?? 0.35)
      ),
      explanation:
        "Logistics pattern evolution may reveal how repeated flow and dependency decisions form long-horizon concentration structures.",
      contributingPatternIds: Object.freeze(patternIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-pattern::finance",
      patternDomain: "finance",
      patternStrength: clamp01(
        input.operationalUniverseState.governanceState.governanceStabilityScore * 0.5 +
          input.foresightState.strategicPreparednessScore * 0.3
      ),
      explanation:
        "Finance pattern intelligence may track how capital allocation rhythms reinforce or weaken recurring strategic tradeoffs.",
      contributingPatternIds: Object.freeze(patternIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-pattern::recovery",
      patternDomain: "recovery",
      patternStrength: clamp01(
        input.operationalUniverseState.resilienceState.enterpriseResilienceScore * 0.5 +
          (input.longHorizonPatternRecords.find((r) =>
            r.recordId.includes("resilience-adaptation")
          )?.patternStrength ?? 0.35)
      ),
      explanation:
        "Recovery pattern structures may indicate whether repeated stabilization efforts build durable resilience or recurring instability.",
      contributingPatternIds: Object.freeze(patternIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-pattern::momentum",
      patternDomain: "strategic_momentum",
      patternStrength: clamp01(
        input.operationalUniverseState.momentumState.organizationalMomentumScore * 0.45 +
          input.trajectoryState.futureStabilityScore * 0.35
      ),
      explanation:
        "Strategic momentum patterns may show how recurring initiatives sustain or erode forward progress across enterprise domains.",
      contributingPatternIds: Object.freeze(patternIds.slice(0, 4)),
    }),
    Object.freeze({
      recordId: "enterprise-pattern::equilibrium",
      patternDomain: "systemic_equilibrium",
      patternStrength: clamp01(
        input.operationalUniverseState.equilibriumState.equilibriumScore * 0.4 +
          input.divergenceState.futureConvergenceScore * 0.35 +
          (1 - input.divergenceState.futureFragmentationScore) * 0.2
      ),
      explanation:
        "Systemic equilibrium patterns may reveal how recurring strategic behaviors reshape long-horizon organizational balance.",
      contributingPatternIds: Object.freeze(patternIds.slice(0, 4)),
    })
  );

  logStrategicPatternEvolutionDev("MetaTrajectory", {
    enterprisePatternRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
